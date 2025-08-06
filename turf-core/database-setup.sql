-- Turf Booking Database Setup Script
-- Run this script in PostgreSQL to create the database and tables

-- Create database (run this as superuser)
-- CREATE DATABASE turf_booking_db;

-- Connect to the database
-- \c turf_booking_db;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'VENDOR');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    verified BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    vendor_approval_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles junction table (removed - using direct role field in users table)

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Turfs table
CREATE TABLE IF NOT EXISTS turfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    location VARCHAR(255) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    vendor_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turf_id UUID NOT NULL REFERENCES turfs(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'confirmed',
    payment_status payment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name) VALUES 
    ('CUSTOMER'),
    ('ADMIN'),
    ('VENDOR')
ON CONFLICT (name) DO NOTHING;

-- Insert default sports categories
INSERT INTO categories (id, name, description) VALUES 
('a1b2c3d4-e5f6-4789-a123-123456789abc', 'Football', 'Football/Soccer fields and pitches'),
('b2c3d4e5-f6a7-4890-b234-234567890bcd', 'Cricket', 'Cricket grounds and pitches'),
('c3d4e5f6-a7b8-4901-c345-345678901cde', 'Basketball', 'Basketball courts and arenas'),
('d4e5f6a7-b8c9-4012-d456-456789012def', 'Tennis', 'Tennis courts and facilities'),
('e5f6a7b8-c9d0-4123-e567-567890123efa', 'Volleyball', 'Volleyball courts and beach volleyball'),
('f6a7b8c9-d0e1-4234-f678-678901234fab', 'Badminton', 'Badminton courts and halls'),
('a7b8c9d0-e1f2-4345-a789-789012345abc', 'Hockey', 'Hockey fields and rinks'),
('b8c9d0e1-f2a3-4456-b890-890123456bcd', 'Table Tennis', 'Table tennis and ping pong facilities'),
('c9d0e1f2-a3b4-4567-c901-901234567cde', 'Squash', 'Squash courts and facilities'),
('d0e1f2a3-b4c5-4678-d012-012345678def', 'Multi-Sport', 'Multi-purpose sports facilities')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_turfs_vendor_id ON turfs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_turfs_category_id ON turfs(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_turf_id ON bookings(turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turfs_updated_at BEFORE UPDATE ON turfs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 