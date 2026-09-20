from django.contrib import admin
from .models import Author, Genre, Book, UserBook, Review
from .models import Author, Genre, Book, UserBook, Review, Comment

admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(UserBook)
admin.site.register(Review)
admin.site.register(Comment)