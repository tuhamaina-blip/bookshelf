from django.core.management.base import BaseCommand
from catalog.models import Author, Genre, Book

BOOKS = [
    ("Dune", "Frank Herbert", ["Sci-fi"], "9780441013593"),
    ("Project Hail Mary", "Andy Weir", ["Sci-fi"], "9780593135204"),
    ("The Hobbit", "J.R.R. Tolkien", ["Fantasy"], "9780547928227"),
    ("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", ["Fantasy"], "9780590353427"),
    ("The Hunger Games", "Suzanne Collins", ["Sci-fi"], "9780439023481"),
    ("1984", "George Orwell", ["Classic", "Sci-fi"], "9780451524935"),
    ("Pride and Prejudice", "Jane Austen", ["Classic", "Romance"], "9780141439518"),
    ("The Great Gatsby", "F. Scott Fitzgerald", ["Classic"], "9780743273565"),
    ("To Kill a Mockingbird", "Harper Lee", ["Classic"], "9780061120084"),
    ("Things Fall Apart", "Chinua Achebe", ["Classic"], "9780385474542"),
    ("Gone Girl", "Gillian Flynn", ["Thriller"], "9780307588371"),
    ("The Girl with the Dragon Tattoo", "Stieg Larsson", ["Thriller", "Mystery"], "9780307454546"),
    ("The Da Vinci Code", "Dan Brown", ["Thriller", "Mystery"], "9780307474278"),
    ("Atomic Habits", "James Clear", ["Non-fiction"], "9780735211292"),
    ("Sapiens", "Yuval Noah Harari", ["Non-fiction"], "9780062316097"),
    ("Educated", "Tara Westover", ["Non-fiction"], "9780399590504"),
    ("The Alchemist", "Paulo Coelho", ["Fiction"], "9780062315007"),
    ("Becoming", "Michelle Obama", ["Non-fiction"], "9781524763138"),
]


class Command(BaseCommand):
    help = "Seed the catalog with starter books (safe to run repeatedly)"

    def handle(self, *args, **options):
        for title, author_name, genre_names, isbn in BOOKS:
            author, _ = Author.objects.get_or_create(name=author_name)
            cover = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
            book, _ = Book.objects.get_or_create(
                title=title, author=author, defaults={"cover_image": cover}
            )
            for name in genre_names:
                genre, _ = Genre.objects.get_or_create(name=name)
                book.genres.add(genre)
        self.stdout.write(self.style.SUCCESS(f"Catalog now has {Book.objects.count()} books"))