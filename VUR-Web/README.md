# VUR - Void User Repository

A modern web-based package repository system inspired by AUR (Arch User Repository), built with FastAPI backend and static frontend.

## Features

- 🔍 **Search Engine**: Search packages by name, description, or maintainer
- 📦 **Package Details**: View comprehensive package information
- 🔗 **Dependency Graph**: Navigate between package dependencies
- 🌙 **Dark/Light Mode**: Toggle between themes (Dark by default)
- 📱 **Responsive Design**: Works on all devices
- 🚀 **REST API**: Public API for CLI tools
- 🏷️ **Package Status**: Track maintained/orphan packages
- ⚠️ **Flag Outdated**: Mark packages as out-of-date

## Architecture
Frontend (Static)  →  Backend API (FastAPI)  →  Database (PostgreSQL)


## Cara Menjalankan Project

### 1. Setup Database
```bash
# Masuk ke PostgreSQL
psql -U postgres

# Jalankan init.sql
\i database/init.sql

# Jalankan seed data
\i database/seed_data.sql
```

### 2. Jalankan Backend 
```bash
cd backend
pip install -r requirements.txt
python run.py
```
 
### 3. Jalankan Frontend 
```bash
cd frontend
python -m http.server 3000
# atau
npx serve .
```

### 4. Akses Aplikasi 
1. Frontend: http://localhost:3000
2. Backend API: http://localhost:8000
3. API Documentation: http://localhost:8000/docs


## Deploy ke Production 
### Backend (Railway/Render)
1. Push code ke GitHub
2. Connect repository ke Railway/Render
3. Set environment variable DATABASE_URL
4. Deploy
     
### Frontend (GitHub Pages)
1. Push frontend folder ke gh-pages branch
2. Enable GitHub Pages di repository settings
3. Update API base URL di JS files ke production URL


## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd vur-web
```

2. Start all Services :
```bash
docker-compose up -d
```

3. Acces the application :
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs


## Manual Setup
### Backend 

1. Install dependencies:  
```bash
cd backend
pip install -r requirements.txt
 ```

2. Set up database:
```bash
# Create database and run migrations
psql -f database/init.sql
psql -f database/seed_data.sql
```

3. Run the backend:  
```bash
python run.py
 ```

 
### Frontend 
1. Serve the static files:
```bash
cd frontend
python -m http.server 3000
```

2. Or use any static file server (nginx, apache, etc.)
     
#### API Endpoints 
##### Public Endpoints 
- GET /api/v1/packages - List all packages
- GET /api/v1/package/{name} - Get package details
- GET /api/v1/search?q=<query> - Search packages


### Example Usage
```bash
# Get all packages
curl http://localhost:8000/api/v1/packages

# Get specific package
curl http://localhost:8000/api/v1/package/vur-core

# Search packages
curl "http://localhost:8000/api/v1/search?q=python"
```

### Database Schema
```bash
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    license TEXT,
    homepage TEXT,
    maintainer TEXT,
    last_update TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT DEFAULT 'maintained',
    out_of_date TIMESTAMP
);

CREATE TABLE dependencies (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    depends_on_id INT REFERENCES packages(id) ON DELETE CASCADE
);
```

## Deployment
### Backend Deployment Options 
1. Railway: Connect GitHub repository, set environment variables
2. Render: Create Web Service, connect repo
3. Fly.io: Use fly deploy
4. VPS: Use Docker or manual deployment

### Frontend Deployment 
1. GitHub Pages: Push to gh-pages branch
2. Netlify: Connect repository
3. Vercel: Connect repository
4. S3 + CloudFront: Upload static files

## Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Development 
### Adding New Features
1. Backend: Add new endpoints in backend/app/api/
2. Frontend: Add new pages in frontend/
3. Database: Create migrations with Alembic
     

## Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests (if added)
cd frontend
npm test
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

