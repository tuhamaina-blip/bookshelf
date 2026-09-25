# BookShelf

BookShelf is a full-stack social reading platform, inspired by Goodreads. It brings book lovers together in one place to discover new titles, track their personal reading progress, and share honest reviews and discussion with a community — all built on a Django REST API backend and a React frontend.


---

## Live Demo

- **Frontend (Vercel):** https://bookshelf-nu-khaki.vercel.app
- **Backend API (Render):** https://bookshelf-backend-r50j.onrender.com/api/



---

## Features

### Shared Book Catalog
- Browse a shared library of books contributed by all users, displayed as a visual grid with cover images
- Search books by title
- Filter books by genre
- Add new books to the catalog, including author, genres, and a cover image URL

### Personal Reading Shelf
- Add any book in the catalog to your own personal shelf
- Track your reading status per book: *Want to Read*, *Currently Reading*, or *Read*
- View and manage your shelf from a dedicated page

### Reviews & Ratings
- Leave a public review with a 1–5 star rating on any book
- Each book displays its live average rating and total review count
- Edit or delete your own reviews at any time
- One review per user per book

### Discussion
- Reply to any review with a comment, enabling discussion threads under reviews
- All comments are public and visible to everyone browsing the book

### Personalized Recommendations
- The "Recommended for You" section identifies your most-read genre based on your shelf history
- Pulls live book suggestions in that genre from the Google Books API

### User Profiles
- Every user has a public profile page showing their shelf and all the reviews they've written
- Usernames are clickable throughout the app, linking to that user's profile

### Authentication
- Secure registration and login using JWT (JSON Web Tokens)
- Access tokens automatically refresh in the background, so users are rarely logged out unexpectedly
- Protected routes ensure only authenticated users can access the app's core features

---

## Tech Stack

**Backend**
- Django & Django REST Framework
- PostgreSQL
- `djangorestframework-simplejwt` for JWT authentication
- `django-cors-headers` for cross-origin support
- `requests` for calling the Google Books API
- `python-decouple` for environment variable management
- `gunicorn` + `whitenoise` for production serving
- Deployed on Render

**Frontend**
- React (Vite)
- React Router for client-side routing
- Axios for API requests, with interceptors for automatic token attachment and refresh
- Tailwind CSS for styling
- Deployed on Vercel

---

## Data Model

| Model      | Description                                                                 |
|------------|------------------------------------------------------------------------------|
| `User`     | Django's built-in auth user model                                            |
| `Author`   | A book's author (name, bio)                                                  |
| `Genre`    | A genre/category a book can belong to                                        |
| `Book`     | Shared catalog entry — title, author, genres, cover image                    |
| `UserBook` | Links a user to a book with their personal reading status (their "shelf")    |
| `Review`   | A user's public rating and written review of a book (one per user per book)  |
| `Comment`  | A reply to a review, enabling discussion                                     |

---

## API Endpoints

All endpoints are prefixed with `/api/` and require a valid JWT access token in the `Authorization: Bearer <token>` header, except where noted.

### Auth
| Method | Endpoint                | Description                          | Auth required |
|--------|--------------------------|---------------------------------------|----------------|
| POST   | `/register/`             | Create a new user account             | No             |
| POST   | `/login/`                | Log in and receive access/refresh tokens | No          |
| POST   | `/login/refresh/`        | Exchange a refresh token for a new access token | No   |

### Catalog
| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | `/books/`                | List all books (supports `?search=`, `?genre=`) |
| POST   | `/books/`                | Add a new book to the catalog         |
| GET    | `/books/{id}/`           | Retrieve a single book's details      |
| PUT/PATCH | `/books/{id}/`        | Update a book                         |
| DELETE | `/books/{id}/`           | Delete a book                         |
| GET/POST | `/authors/`            | List / create authors                 |
| GET/POST | `/genres/`             | List / create genres                  |

### Shelf
| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | `/shelf/`                | List the current user's shelf (supports `?status=`) |
| POST   | `/shelf/`                | Add a book to the current user's shelf |
| PATCH  | `/shelf/{id}/`           | Update reading status                 |
| DELETE | `/shelf/{id}/`           | Remove a book from the shelf          |

### Reviews & Comments
| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | `/reviews/`              | List reviews (supports `?book=`)      |
| POST   | `/reviews/`              | Submit a review                       |
| PATCH  | `/reviews/{id}/`         | Edit your own review (owner only)     |
| DELETE | `/reviews/{id}/`         | Delete your own review (owner only)   |
| GET    | `/comments/`             | List comments (supports `?review=`)   |
| POST   | `/comments/`             | Post a comment on a review            |

### Other
| Method | Endpoint                    | Description                                  |
|--------|------------------------------|-----------------------------------------------|
| GET    | `/recommendations/`          | Get personalized book recommendations         |
| GET    | `/users/{username}/`         | Get a user's public shelf and reviews         |

---

## Getting Started Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
git clone <repository-url>
cd bookshelf

python -m venv venv
source venv/Scripts/activate   # or venv\Scripts\activate on Windows cmd

pip install -r requirements.txt
```

Create a `.env` file in the project root:

```
DB_NAME=bookshelf_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_django_secret_key
DEBUG=True
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

Create the database and run migrations:

```bash
createdb bookshelf_db
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables Reference

| Variable                | Used by  | Description                                      |
|--------------------------|----------|---------------------------------------------------|
| `DB_NAME`                | Backend  | PostgreSQL database name                          |
| `DB_USER`                | Backend  | PostgreSQL username                               |
| `DB_PASSWORD`            | Backend  | PostgreSQL password                               |
| `DB_HOST`                | Backend  | Database host                                     |
| `DB_PORT`                | Backend  | Database port                                     |
| `SECRET_KEY`             | Backend  | Django secret key                                 |
| `DEBUG`                  | Backend  | `True` for local development, `False` in production |
| `GOOGLE_BOOKS_API_KEY`   | Backend  | API key for the Google Books recommendations feature |
| `DATABASE_URL`           | Backend  | Full database connection string (used in production on Render) |
| `VITE_API_URL`           | Frontend | Base URL of the backend API the frontend should call |

---

## Project Structure

```
bookshelf/
├── catalog/              # Django app: models, serializers, views for the core API
│   ├── models.py         # Author, Genre, Book, UserBook, Review, Comment
│   ├── serializers.py
│   ├── views.py
│   └── admin.py
├── config/                # Django project settings and URL routing
├── frontend/              # React application
│   └── src/
│       ├── api/           # Axios instance with auth interceptors
│       ├── context/        # AuthContext for login state
│       ├── components/     # Navbar, ProtectedRoute
│       └── pages/          # Home (Catalog), Shelf, BookDetail, Profile, Login, Register
├── build.sh                # Production build script (used by Render)
└── requirements.txt
```

