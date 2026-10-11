# TP1 – Application CRUD Full Stack (WSL2 Ubuntu)

Stack : **React (Vite)** + **FastAPI** + **PostgreSQL**

```
tp1-crud-produits/
├── backend/    (FastAPI, SQLAlchemy)
└── frontend/   (React + Vite)
```

## 1. Prérequis (dans le terminal Ubuntu WSL2)

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql postgresql-contrib curl
# Node.js 20 (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc && nvm install 20
```

## 2. Base de données PostgreSQL

```bash
sudo service postgresql start
sudo -u postgres psql <<SQL
CREATE USER produits_user WITH PASSWORD 'produits_pwd';
CREATE DATABASE produits_db OWNER produits_user;
SQL
```

## 3. Backend (port 8000)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Documentation Swagger : http://localhost:8000/docs
(La table `products` est créée automatiquement au démarrage.)

## 4. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173 dans le navigateur Windows.

## 5. Tests CRUD

```bash
cd backend
./test_api.sh
```

Vérification directe en base :

```bash
sudo -u postgres psql -d produits_db -c "SELECT * FROM products;"
```

## API REST

| Méthode | URL              | Action                |
|---------|------------------|-----------------------|
| POST    | /products        | Ajouter un produit    |
| GET     | /products        | Lister les produits   |
| GET     | /products/{id}   | Consulter un produit  |
| PUT     | /products/{id}   | Modifier un produit   |
| DELETE  | /products/{id}   | Supprimer un produit  |
