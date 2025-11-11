-- Create database if not exists
CREATE DATABASE vur_db;

-- Create user
CREATE USER vur_user WITH PASSWORD 'vur_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vur_db TO vur_user;

-- Connect to database
\c vur_db;

-- Enable UUID extension (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    license TEXT,
    homepage TEXT,
    maintainer TEXT,
    last_update TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT DEFAULT 'maintained' CHECK (status IN ('maintained', 'orphan')),
    out_of_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dependencies (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    depends_on_id INT REFERENCES packages(id) ON DELETE CASCADE,
    UNIQUE(package_id, depends_on_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_name ON packages(name);
CREATE INDEX IF NOT EXISTS idx_packages_maintainer ON packages(maintainer);
CREATE INDEX IF NOT EXISTS idx_dependencies_package_id ON dependencies(package_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_depends_on_id ON dependencies(depends_on_id);
