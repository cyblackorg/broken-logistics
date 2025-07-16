-- BrokenLogistics Database Schema
-- This script initializes the database with intentionally vulnerable design

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (vulnerable: plain text passwords)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Stored as plain text (vulnerable)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) CHECK (role IN ('customer', 'driver', 'admin', 'customer_service')) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Addresses table (vulnerable: exposes coordinates)
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('pickup', 'delivery', 'billing')) DEFAULT 'delivery',
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'US',
    latitude DECIMAL(10, 8),  -- Exposed in API (vulnerable)
    longitude DECIMAL(11, 8), -- Exposed in API (vulnerable)
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Packages table (vulnerable: unencrypted contents)
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_id INTEGER REFERENCES users(id),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    pickup_address_id INTEGER REFERENCES addresses(id),
    delivery_address_id INTEGER REFERENCES addresses(id),
    package_type VARCHAR(20) CHECK (package_type IN ('document', 'small', 'medium', 'large', 'fragile')) DEFAULT 'small',
    weight DECIMAL(8, 2),
    dimensions VARCHAR(50), -- LxWxH format
    declared_value DECIMAL(10, 2) DEFAULT 0.00,
    contents TEXT, -- Unencrypted package contents (vulnerable)
    status VARCHAR(30) CHECK (status IN ('created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception')) DEFAULT 'created',
    delivery_instructions TEXT,
    signature_required BOOLEAN DEFAULT false,
    current_location VARCHAR(255),
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    special_instructions TEXT,
    insurance_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Package events table
CREATE TABLE package_events (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
    event_type VARCHAR(30) CHECK (event_type IN ('created', 'picked_up', 'in_transit', 'delivered', 'exception', 'scan')),
    event_description TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    user_id INTEGER REFERENCES users(id), -- Who performed the action
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB, -- Additional vulnerable data storage
    photo_url TEXT,
    signature_data TEXT
);

-- Routes table
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id),
    route_name VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('planned', 'active', 'completed', 'cancelled')) DEFAULT 'planned',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_packages INTEGER DEFAULT 0,
    total_distance DECIMAL(8, 2) DEFAULT 0.00,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Route packages junction table
CREATE TABLE route_packages (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id),
    sequence_order INTEGER,
    estimated_time TIMESTAMP,
    actual_time TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'delivered', 'failed', 'skipped')) DEFAULT 'pending',
    notes TEXT
);

-- Audit logs table (vulnerable: stores sensitive data)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Sessions table (vulnerable: predictable session IDs)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User preferences table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    default_package_type VARCHAR(20) DEFAULT 'small',
    preferred_delivery_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance (some intentionally missing for vulnerabilities)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_packages_tracking ON packages(tracking_number);
CREATE INDEX idx_packages_sender ON packages(sender_id);
CREATE INDEX idx_package_events_package ON package_events(package_id);
CREATE INDEX idx_routes_driver ON routes(driver_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
-- Intentionally missing index on audit_logs.user_id for slow queries

-- Insert seed data for development
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@brokenlogistics.com', 'admin123', 'System', 'Administrator', 'admin'),
('driver@brokenlogistics.com', 'driver123', 'John', 'Driver', 'driver'),
('customer@brokenlogistics.com', 'customer123', 'Jane', 'Customer', 'customer'),
('support@brokenlogistics.com', 'support123', 'Sarah', 'Support', 'customer_service');

-- Insert sample addresses
INSERT INTO addresses (user_id, type, street_address, city, state, postal_code, latitude, longitude, is_default) VALUES
(3, 'delivery', '123 Main Street', 'New York', 'NY', '10001', 40.7128, -74.0060, true),
(3, 'pickup', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', 34.0522, -118.2437, false),
(2, 'delivery', '789 Pine Road', 'Chicago', 'IL', '60601', 41.8781, -87.6298, true);

-- Insert sample packages with vulnerable data
INSERT INTO packages (tracking_number, sender_id, recipient_name, recipient_email, pickup_address_id, delivery_address_id, contents, declared_value) VALUES
('BL001234567890', 3, 'John Smith', 'john@example.com', 2, 1, 'Confidential business documents - merger details', 1000.00),
('BL001234567891', 3, 'Mary Johnson', 'mary@example.com', 2, 3, 'Personal photos and letters', 50.00),
('BL001234567892', 1, 'Tech Corp', 'info@techcorp.com', 1, 3, 'Server passwords and API keys', 5000.00);

-- Insert package events
INSERT INTO package_events (package_id, event_type, event_description, location, user_id) VALUES
(1, 'created', 'Package created and labeled', 'Los Angeles Warehouse', 3),
(1, 'picked_up', 'Package picked up by driver', 'Los Angeles Warehouse', 2),
(2, 'created', 'Package created and labeled', 'Los Angeles Warehouse', 3),
(3, 'created', 'Package created and labeled', 'New York Warehouse', 1);

-- Insert sample route
INSERT INTO routes (driver_id, route_name, status, total_packages) VALUES
(2, 'Downtown LA Route 1', 'active', 2);

-- Insert route packages
INSERT INTO route_packages (route_id, package_id, sequence_order, status) VALUES
(1, 1, 1, 'pending'),
(1, 2, 2, 'pending');

-- Insert audit log entries (with sensitive data exposed)
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, ip_address, user_agent) VALUES
(1, 'LOGIN', 'user', 1, '{"email": "admin@brokenlogistics.com", "password": "admin123"}', '192.168.1.100', 'Mozilla/5.0'),
(3, 'CREATE_PACKAGE', 'package', 1, '{"contents": "Confidential business documents - merger details"}', '192.168.1.101', 'Mozilla/5.0');

-- Create vulnerable function for tracking (SQL injection vulnerability)
CREATE OR REPLACE FUNCTION get_package_by_tracking(tracking_num TEXT)
RETURNS TABLE(
    id INTEGER,
    tracking_number VARCHAR,
    contents TEXT,
    status VARCHAR,
    recipient_name VARCHAR
) AS $$
BEGIN
    -- Vulnerable to SQL injection
    RETURN QUERY EXECUTE 'SELECT p.id, p.tracking_number, p.contents, p.status, p.recipient_name FROM packages p WHERE p.tracking_number = ''' || tracking_num || '''';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (overly permissive)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create vulnerable stored procedure for user authentication
CREATE OR REPLACE FUNCTION authenticate_user(user_email TEXT, user_password TEXT)
RETURNS TABLE(
    user_id INTEGER,
    email VARCHAR,
    role VARCHAR,
    is_active BOOLEAN
) AS $$
BEGIN
    -- Vulnerable to SQL injection
    RETURN QUERY EXECUTE 'SELECT u.id, u.email, u.role, u.is_active FROM users u WHERE u.email = ''' || user_email || ''' AND u.password = ''' || user_password || '''';
END;
$$ LANGUAGE plpgsql; 