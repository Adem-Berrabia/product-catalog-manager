# Product Catalog Manager

![CI](https://github.com/Adem-Berrabia/product-catalog-manager/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.12-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/postgresql-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)

A full stack web application to manage products (Create, Read, Update, Delete),
built with **React**, **FastAPI** and **PostgreSQL**, and developed entirely in **WSL2 Ubuntu**.

## Features

- Add, list, view, edit and delete products
- Search by name or description (case-insensitive)
- Client-side and server-side validation with clear error messages
- REST API documented automatically (Swagger / OpenAPI)
- Automated tests (pytest) and CI with GitHub Actions
- One-command startup with Docker Compose

## Tech stack

| Layer    | Technology                             |
|----------|----------------------------------------|
| Frontend | React 18, Vite                         |
| Backend  | FastAPI, SQLAlchemy, Pydantic v2       |
| Database | PostgreSQL 16                          |
| DevOps   | Docker, Docker Compose, GitHub Actions |

## Architecture

```mermaid
flowchart LR
    A["React frontend :5173"] -- "REST / JSON" --> B["FastAPI backend :8000"]
    B -- "SQLAlchemy" --> C[("PostgreSQL :5432")]
```

## Project structure

```
.
├── backend/              FastAPI application
│   ├── main.py           Routes (CRUD + search)
│   ├── models.py         SQLAlchemy models
│   ├── schemas.py        Pydantic schemas and validation
│   ├── database.py       Database connection
│   ├── tests/            pytest suite
│   └── Dockerfile
├── frontend/             React application (Vite)
│   ├── src/
│   └── Dockerfile
├── docs/screenshots/     Screenshots
├── docker-compose.yml
└── .github/workflows/    CI pipeline
```

## Quick start with Docker

```bash
git clone https://github.com/Adem-Berrabia/product-catalog-manager.git
cd product-catalog-manager
docker compose up --build
```

- Frontend: http://localhost:5173
- API docs (Swagger): http://localhost:8000/docs

Stop with `docker compose down` (add `-v` to also delete the database volume).

## Run locally (without Docker)

**Database**

```bash
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER produits_user WITH PASSWORD 'produits_pwd';"
sudo -u postgres psql -c "CREATE DATABASE produits_db OWNER produits_user;"
```

**Backend**

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## API

| Method | Endpoint                | Description                         |
|--------|-------------------------|-------------------------------------|
| POST   | `/products`             | Create a product                    |
| GET    | `/products`             | List products                       |
| GET    | `/products?search=term` | Search by name or description       |
| GET    | `/products/{id}`        | Get a product                       |
| PUT    | `/products/{id}`        | Update a product                    |
| DELETE | `/products/{id}`        | Delete a product                    |

Validation: `name` is required (max 100 characters), `price >= 0`, `quantity >= 0`.
Invalid input returns `422` with details.

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest -v
```

The tests use an in-memory-style SQLite database, so PostgreSQL is not needed.
A quick end-to-end check against a running API is also available: `./backend/test_api.sh`.

## Configuration

Copy `.env.example` to `.env` to change the database credentials used by Docker Compose.

## Screenshots

Add your screenshots to `docs/screenshots/` and reference them here:

```md
![App](docs/screenshots/app.png)
![Swagger](docs/screenshots/swagger.png)
```

## License

MIT, see [LICENSE](LICENSE).
