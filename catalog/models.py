from django.db import models
from django.contrib.auth.models import User


class Author(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=300)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    genres = models.ManyToManyField(Genre, related_name='books', blank=True)
    cover_image = models.URLField(blank=True)

    def __str__(self):
        return self.title


class UserBook(models.Model):
    STATUS_CHOICES = [
        ('want_to_read', 'Want to Read'),
        ('reading', 'Currently Reading'),
        ('read', 'Read'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelf')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='on_shelves')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_read')
    date_added = models.DateTimeField(auto_now_add=True)
    date_finished = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} — {self.book.title} ({self.status})"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username}'s review of {self.book.title}"