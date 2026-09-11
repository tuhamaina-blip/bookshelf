from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from catalog.views import RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/login/refresh/', TokenRefreshView.as_view()),
]