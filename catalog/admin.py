from django.contrib import admin
from .models import Author, Genre, Book, UserBook, Review

admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(UserBook)
admin.site.register(Review)