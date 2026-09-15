from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from .models import Book, Author, Genre
from .serializers import RegisterSerializer, BookSerializer, AuthorSerializer, GenreSerializer
from rest_framework.response import Response

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Book.objects.filter(user=self.request.user)

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        genre_param = self.request.query_params.get('genre')
        if genre_param:
            queryset = queryset.filter(genres__id=genre_param)

        search_param = self.request.query_params.get('search')
        if search_param:
            queryset = queryset.filter(title__icontains=search_param)

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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