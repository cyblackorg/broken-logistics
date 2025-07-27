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
    customer_type VARCHAR(20) CHECK (customer_type IN ('individual', 'business')) DEFAULT 'individual',
    company_name VARCHAR(255), -- For business customers
    tax_id VARCHAR(50), -- Business tax ID (stored in plain text - vulnerable)
    credit_limit DECIMAL(10, 2) DEFAULT 0.00, -- Business customers may have credit
    discount_rate DECIMAL(5, 2) DEFAULT 0.00, -- Business discount percentage
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
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    sender_phone VARCHAR(20),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    pickup_address_id INTEGER REFERENCES addresses(id),
    delivery_address_id INTEGER REFERENCES addresses(id),
    origin_state VARCHAR(2),
    destination_state VARCHAR(2),
    package_size VARCHAR(20) CHECK (package_size IN ('small', 'medium', 'large', 'xlarge')) DEFAULT 'small',
    speed_option VARCHAR(20) CHECK (speed_option IN ('standard', 'express', 'overnight')) DEFAULT 'standard',
    weight DECIMAL(8, 2),
    dimensions VARCHAR(50), -- LxWxH format
    declared_value DECIMAL(10, 2) DEFAULT 0.00,
    contents TEXT, -- Unencrypted package contents (vulnerable)
    status VARCHAR(30) CHECK (status IN ('created', 'dropped_off', 'picked_up', 'origin_depot', 'in_transit', 'destination_depot', 'out_for_delivery', 'delivered', 'exception')) DEFAULT 'created',
    delivery_instructions TEXT,
    signature_required BOOLEAN DEFAULT false,
    current_location VARCHAR(255),
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    delivered_at TIMESTAMP,
    signature VARCHAR(255),
    delivery_notes TEXT,
    special_instructions TEXT,
    insurance_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_cost DECIMAL(10, 2),
    estimated_days INTEGER,
    distance_miles DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quotes table (vulnerable: exposed pricing logic)
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'expired', 'accepted', 'cancelled')) DEFAULT 'draft',
    pickup_address_id INTEGER REFERENCES addresses(id),
    delivery_address_id INTEGER REFERENCES addresses(id),
    package_type VARCHAR(20) CHECK (package_type IN ('document', 'small', 'medium', 'large', 'fragile')) DEFAULT 'small',
    weight DECIMAL(8, 2),
    dimensions VARCHAR(50), -- LxWxH format
    distance_miles DECIMAL(8, 2),
    service_type VARCHAR(20) CHECK (service_type IN ('standard', 'express', 'overnight', 'same_day')) DEFAULT 'standard',
    base_price DECIMAL(10, 2),
    distance_price DECIMAL(10, 2),
    weight_price DECIMAL(10, 2),
    service_price DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_price DECIMAL(10, 2),
    customer_type_applied VARCHAR(20), -- Track what pricing was used
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pricing rules table (vulnerable: hardcoded business logic)
CREATE TABLE pricing_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255),
    customer_type VARCHAR(20) CHECK (customer_type IN ('individual', 'business', 'all')) DEFAULT 'all',
    package_type VARCHAR(20),
    service_type VARCHAR(20),
    base_rate DECIMAL(10, 2) DEFAULT 0.00,
    per_mile_rate DECIMAL(6, 4) DEFAULT 0.50,
    per_pound_rate DECIMAL(6, 2) DEFAULT 1.00,
    size_multiplier DECIMAL(4, 2) DEFAULT 1.00,
    min_charge DECIMAL(8, 2) DEFAULT 5.00,
    max_discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Package events table
CREATE TABLE package_events (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
    event_type VARCHAR(30) CHECK (event_type IN ('created', 'dropped_off', 'picked_up', 'origin_depot', 'in_transit', 'destination_depot', 'out_for_delivery', 'delivered', 'exception', 'scan')),
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
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_pricing_rules_type ON pricing_rules(customer_type, package_type, service_type);
-- Intentionally missing index on audit_logs.user_id for slow queries

-- Insert seed data for development
INSERT INTO users (email, password, first_name, last_name, role, customer_type, company_name, tax_id, credit_limit, discount_rate) VALUES
('admin@brokenlogistics.com', 'admin123', 'System', 'Administrator', 'admin', 'individual', NULL, NULL, 0.00, 0.00),
('driver@brokenlogistics.com', 'driver123', 'John', 'Driver', 'driver', 'individual', NULL, NULL, 0.00, 0.00),
('customer@brokenlogistics.com', 'customer123', 'Jane', 'Customer', 'customer', 'individual', NULL, NULL, 0.00, 0.00),
('support@brokenlogistics.com', 'support123', 'Sarah', 'Support', 'customer_service', 'individual', NULL, NULL, 0.00, 0.00),
('business@brokenlogistics.com', 'business123', 'Mike', 'Corporate', 'customer', 'business', 'TechCorp Industries', '12-3456789', 50000.00, 15.00),
('bigcorp@brokenlogistics.com', 'bigcorp123', 'Alice', 'Procurement', 'customer', 'business', 'Big Corp LLC', '98-7654321', 100000.00, 25.00);

-- Insert sample addresses
INSERT INTO addresses (user_id, type, street_address, city, state, postal_code, latitude, longitude, is_default) VALUES
(3, 'delivery', '123 Main Street', 'New York', 'NY', '10001', 40.7128, -74.0060, true),
(3, 'pickup', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', 34.0522, -118.2437, false),
(2, 'delivery', '789 Pine Road', 'Chicago', 'IL', '60601', 41.8781, -87.6298, true);

-- Insert sample packages with vulnerable data
INSERT INTO packages (tracking_number, sender_id, sender_name, sender_email, recipient_name, recipient_email, origin_state, destination_state, package_size, speed_option, weight, contents, declared_value, total_cost, estimated_days, distance_miles) VALUES
('BL001234567890', 3, 'Jane Customer', 'customer@brokenlogistics.com', 'John Smith', 'john@example.com', 'CA', 'NY', 'medium', 'express', 5.5, 'Confidential business documents - merger details', 1000.00, 32.45, 3, 2789.2),
('BL001234567891', 3, 'Jane Customer', 'customer@brokenlogistics.com', 'Mary Johnson', 'mary@example.com', 'CA', 'IL', 'small', 'standard', 2.0, 'Personal photos and letters', 50.00, 18.75, 5, 1756.8),
('BL001234567892', 1, 'System Administrator', 'admin@brokenlogistics.com', 'Tech Corp', 'info@techcorp.com', 'NY', 'IL', 'large', 'overnight', 12.0, 'Server passwords and API keys', 5000.00, 45.20, 1, 787.3);

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

-- Insert pricing rules (vulnerable: exposed business logic)
INSERT INTO pricing_rules (rule_name, customer_type, package_type, service_type, base_rate, per_mile_rate, per_pound_rate, size_multiplier, min_charge, max_discount_percent) VALUES
-- Individual customer rates
('Individual Document Standard', 'individual', 'document', 'standard', 5.00, 0.75, 0.50, 1.0, 5.00, 0.00),
('Individual Small Standard', 'individual', 'small', 'standard', 8.00, 0.85, 1.25, 1.2, 8.00, 0.00),
('Individual Medium Standard', 'individual', 'medium', 'standard', 12.00, 1.00, 1.50, 1.5, 12.00, 0.00),
('Individual Large Standard', 'individual', 'large', 'standard', 18.00, 1.25, 2.00, 2.0, 18.00, 0.00),
('Individual Express Service', 'individual', 'small', 'express', 15.00, 1.50, 2.00, 1.8, 15.00, 0.00),
('Individual Overnight Service', 'individual', 'small', 'overnight', 25.00, 2.00, 3.00, 2.5, 25.00, 0.00),

-- Business customer rates (discounted)
('Business Document Standard', 'business', 'document', 'standard', 3.50, 0.60, 0.40, 1.0, 3.50, 20.00),
('Business Small Standard', 'business', 'small', 'standard', 6.00, 0.70, 1.00, 1.2, 6.00, 20.00),
('Business Medium Standard', 'business', 'medium', 'standard', 9.00, 0.80, 1.20, 1.5, 9.00, 25.00),
('Business Large Standard', 'business', 'large', 'standard', 14.00, 1.00, 1.60, 2.0, 14.00, 25.00),
('Business Express Service', 'business', 'small', 'express', 12.00, 1.20, 1.60, 1.8, 12.00, 15.00),
('Business Overnight Service', 'business', 'small', 'overnight', 20.00, 1.60, 2.40, 2.5, 20.00, 15.00),

-- Premium services (vulnerable: hardcoded "VIP" backdoor)
('VIP Same Day Service', 'all', 'small', 'same_day', 50.00, 3.00, 5.00, 3.0, 50.00, 50.00); -- 50% discount backdoor!

-- Insert sample quotes (with intentionally vulnerable data)
INSERT INTO quotes (quote_number, customer_id, pickup_address_id, delivery_address_id, package_type, weight, dimensions, distance_miles, service_type, base_price, distance_price, weight_price, service_price, total_price, customer_type_applied, status) VALUES
('QT-2024-001', 3, 2, 1, 'small', 2.5, '12x8x6', 45.2, 'standard', 8.00, 38.42, 3.13, 0.00, 49.55, 'individual', 'active'),
('QT-2024-002', 5, 1, 3, 'medium', 8.0, '18x12x10', 78.5, 'express', 12.00, 94.20, 12.80, 15.00, 134.00, 'business', 'active'),
('QT-2024-003', 6, 2, 1, 'large', 15.0, '24x18x14', 45.2, 'overnight', 20.00, 72.32, 36.00, 25.00, 153.32, 'business', 'draft'),
('QT-2024-VIP', 3, 1, 2, 'small', 1.0, '6x6x6', 25.0, 'same_day', 50.00, 75.00, 5.00, 0.00, 65.00, 'individual', 'active'); -- VIP backdoor applied!

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