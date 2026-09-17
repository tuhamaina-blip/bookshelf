from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from catalog.views import RecommendationsView, RegisterView, BookViewSet, AuthorViewSet, GenreViewSet


router = DefaultRouter()
router.register('books', BookViewSet, basename='book')
router.register('authors', AuthorViewSet, basename='author')
router.register('genres', GenreViewSet, basename='genre')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/login/refresh/', TokenRefreshView.as_view()),
    path('api/recommendations/', RecommendationsView.as_view()),
    path('api/', include(router.urls)),
]