from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from decouple import config
from .models import Book, Author, Genre, UserBook, Review, Comment
from .serializers import (
    RegisterSerializer, BookSerializer, AuthorSerializer,
    GenreSerializer, UserBookSerializer, ReviewSerializer, CommentSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Book.objects.all()
        search_param = self.request.query_params.get('search')
        if search_param:
            queryset = queryset.filter(title__icontains=search_param)
        genre_param = self.request.query_params.get('genre')
        if genre_param:
            queryset = queryset.filter(genres__id=genre_param)
        return queryset.distinct()


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        author, created = Author.objects.get_or_create(name=name, defaults={'bio': request.data.get('bio', '')})
        serializer = self.get_serializer(author)
        return Response(serializer.data, status=201 if created else 200)


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserBookViewSet(viewsets.ModelViewSet):
    serializer_class = UserBookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = UserBook.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.all()
        book_param = self.request.query_params.get('book')
        if book_param:
            queryset = queryset.filter(book=book_param)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        top_genre = (
            Genre.objects.filter(books__on_shelves__user=request.user, books__on_shelves__status='read')
            .annotate(count=Count('books'))
            .order_by('-count')
            .first()
        )

        if not top_genre:
            top_genre = (
                Genre.objects.filter(books__on_shelves__user=request.user)
                .annotate(count=Count('books'))
                .order_by('-count')
                .first()
            )

        if not top_genre:
            return Response({'genre': None, 'books': []})

        api_url = 'https://www.googleapis.com/books/v1/volumes'
        params = {'q': f'subject:{top_genre.name}', 'maxResults': 6, 'key': config('GOOGLE_BOOKS_API_KEY')}

        try:
            resp = requests.get(api_url, params=params, timeout=5)
            data = resp.json()
        except requests.RequestException:
            return Response({'genre': top_genre.name, 'books': []})

        results = []
        for item in data.get('items', []):
            info = item.get('volumeInfo', {})
            results.append({
                'title': info.get('title', 'Unknown title'),
                'authors': ', '.join(info.get('authors', ['Unknown author'])),
                'thumbnail': info.get('imageLinks', {}).get('thumbnail', ''),
                'link': info.get('infoLink', ''),
            })

        return Response({'genre': top_genre.name, 'books': results})

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.all()
        review_param = self.request.query_params.get('review')
        if review_param:
            queryset = queryset.filter(review=review_param)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)