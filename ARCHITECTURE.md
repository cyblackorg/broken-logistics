# BrokenLogistics - System Architecture

## Overview
BrokenLogistics is a full-stack web application designed to simulate a real-world logistics platform with intentionally implemented vulnerabilities for educational purposes.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Context API + useReducer
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Framework**: Tailwind CSS
- **Icons**: Heroicons + Custom SVGs
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT (intentionally insecure)
- **File Upload**: Multer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL container
- **Reverse Proxy**: Nginx (production)
- **Environment**: Docker networks for service isolation

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Docker        │
                        │   Compose       │
                        │   Network       │
                        └─────────────────┘
```

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Stored as plain text (vulnerable)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('customer', 'driver', 'admin', 'customer_service'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Addresses
```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type ENUM('pickup', 'delivery', 'billing'),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    latitude DECIMAL(10, 8),  -- Exposed in API (vulnerable)
    longitude DECIMAL(11, 8), -- Exposed in API (vulnerable)
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Packages
```sql
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_id INTEGER REFERENCES users(id),
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    pickup_address_id INTEGER REFERENCES addresses(id),
    delivery_address_id INTEGER REFERENCES addresses(id),
    package_type ENUM('document', 'small', 'medium', 'large', 'fragile'),
    weight DECIMAL(8, 2),
    dimensions VARCHAR(50), -- LxWxH format
    declared_value DECIMAL(10, 2),
    contents TEXT, -- Unencrypted package contents (vulnerable)
    status ENUM('created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception'),
    delivery_instructions TEXT,
    signature_required BOOLEAN DEFAULT false,
    current_location VARCHAR(255),
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Package_Events
```sql
CREATE TABLE package_events (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id),
    event_type ENUM('created', 'picked_up', 'in_transit', 'delivered', 'exception'),
    event_description TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    user_id INTEGER REFERENCES users(id), -- Who performed the action
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- Additional vulnerable data storage
);
```

#### Routes
```sql
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id),
    route_name VARCHAR(255),
    status ENUM('planned', 'active', 'completed'),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_packages INTEGER,
    total_distance DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Route_Packages
```sql
CREATE TABLE route_packages (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id),
    package_id INTEGER REFERENCES packages(id),
    sequence_order INTEGER,
    estimated_time TIMESTAMP,
    actual_time TIMESTAMP,
    status ENUM('pending', 'delivered', 'failed')
);
```

#### Audit_Logs
```sql
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
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## API Structure

### Authentication Endpoints
```
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User login
POST   /api/auth/logout       - User logout
GET    /api/auth/profile      - Get user profile
PUT    /api/auth/profile      - Update user profile
POST   /api/auth/reset        - Password reset
```

### Package Management
```
GET    /api/packages          - List packages (with IDOR vulnerability)
POST   /api/packages          - Create new package
GET    /api/packages/:id      - Get package details (vulnerable)
PUT    /api/packages/:id      - Update package
DELETE /api/packages/:id      - Delete package
GET    /api/packages/:id/tracking - Track package
POST   /api/packages/:id/events   - Add package event
```

### User Management (Admin)
```
GET    /api/admin/users       - List all users (privilege escalation)
POST   /api/admin/users       - Create user
GET    /api/admin/users/:id   - Get user details
PUT    /api/admin/users/:id   - Update user
DELETE /api/admin/users/:id   - Delete user
POST   /api/admin/users/:id/impersonate - Impersonate user
```

### Route Management
```
GET    /api/routes            - List routes
POST   /api/routes            - Create route
GET    /api/routes/:id        - Get route details
PUT    /api/routes/:id        - Update route
POST   /api/routes/:id/packages - Assign packages to route
PUT   /api/routes/:id/status - Update route status
```

### Driver APIs
```
GET    /api/driver/routes     - Get assigned routes
PUT    /api/driver/location   - Update driver location (spoofable)
POST   /api/driver/scan       - Scan package QR code
POST   /api/driver/delivery   - Mark package as delivered
POST   /api/driver/photo      - Upload delivery photo
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ProtectedRoute.tsx
│   ├── customer/
│   │   ├── Dashboard.tsx
│   │   ├── ShipPackage.tsx
│   │   ├── TrackPackage.tsx
│   │   ├── PackageHistory.tsx
│   │   └── AddressBook.tsx
│   ├── driver/
│   │   ├── DriverDashboard.tsx
│   │   ├── RouteList.tsx
│   │   ├── PackageScan.tsx
│   │   ├── DeliveryForm.tsx
│   │   └── LocationTracker.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── PackageMonitoring.tsx
│   │   ├── RouteManagement.tsx
│   │   └── SecurityLogs.tsx
│   └── vulnerabilities/
│       ├── SqlInjectionDemo.tsx
│       ├── XssDemo.tsx
│       ├── IdorDemo.tsx
│       └── VulnerabilityExplainer.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CustomerPortal.tsx
│   ├── DriverPortal.tsx
│   ├── AdminPortal.tsx
│   └── VulnerabilityLab.tsx
├── hooks/
│   ├── useAuth.tsx
│   ├── useApi.tsx
│   ├── useLocalStorage.tsx
│   └── useGeolocation.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── packages.ts
│   └── vulnerabilities.ts
├── context/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── VulnerabilityContext.tsx
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validation.ts
│   └── vulnerableHelpers.ts  -- Intentionally insecure functions
└── types/
    ├── auth.ts
    ├── package.ts
    ├── user.ts
    └── api.ts
```

### Routing Structure
```
/                           - Homepage
/login                      - Login page
/register                   - Registration
/customer                   - Customer portal
  /customer/dashboard       - Customer dashboard
  /customer/ship           - Create shipment
  /customer/track          - Track packages
  /customer/history        - Package history
  /customer/profile        - Profile settings
/driver                     - Driver portal
  /driver/dashboard        - Driver dashboard
  /driver/routes           - Route assignments
  /driver/scan             - Package scanning
  /driver/deliveries       - Delivery status
/admin                      - Admin portal
  /admin/dashboard         - Admin dashboard
  /admin/users             - User management
  /admin/packages          - Package monitoring
  /admin/routes            - Route management
  /admin/security          - Security logs
/vulnerabilities            - Learning module
  /vulnerabilities/sql     - SQL injection demos
  /vulnerabilities/xss     - XSS demonstrations
  /vulnerabilities/idor    - IDOR examples
  /vulnerabilities/auth    - Auth vulnerabilities
```

## User Journeys

### Customer Journey - Ship Package
```
1. Login/Register → Customer Dashboard
2. Click "Ship Package" → Ship Package Form
3. Fill sender/recipient details
4. Select package type and dimensions
5. Choose pickup/delivery addresses
6. Add package contents (vulnerable input)
7. Submit → Generate tracking number
8. View confirmation → Email notification
```

### Customer Journey - Track Package
```
1. Enter tracking number → Track Package Page
2. View package status and location
3. See delivery timeline and events
4. View estimated delivery date
5. Access delivery photos (if available)
6. Download delivery receipt
```

### Driver Journey - Daily Route
```
1. Login → Driver Dashboard
2. View assigned routes for the day
3. Start route → GPS tracking begins
4. Navigate to pickup locations
5. Scan package QR codes
6. Update package status
7. Navigate to delivery addresses
8. Confirm delivery → Capture photo
9. Get customer signature (if required)
10. Complete route → Submit timesheet
```

### Admin Journey - Monitor Operations
```
1. Login → Admin Dashboard
2. View real-time package statistics
3. Monitor driver locations and routes
4. Handle customer service inquiries
5. Investigate delivery exceptions
6. Review security logs and alerts
7. Manage user accounts and permissions
8. Generate operational reports
```

## Vulnerability Implementation

### Authentication Vulnerabilities
- **Weak passwords**: No complexity requirements
- **Session fixation**: Predictable session tokens
- **Brute force**: No rate limiting on login attempts
- **Password storage**: Plain text passwords in database

### Authorization Vulnerabilities
- **IDOR**: Direct object references in package URLs
- **Privilege escalation**: Missing role checks
- **Horizontal access**: Users can access others' data
- **Admin impersonation**: Weak admin verification

### Input Validation Vulnerabilities
- **SQL Injection**: Unparameterized queries
- **XSS**: Unescaped user input in package descriptions
- **File upload**: No file type validation
- **XML parsing**: XXE vulnerabilities in shipping labels

### Logistics-Specific Vulnerabilities
- **GPS spoofing**: Driver location manipulation
- **Package interception**: Fake tracking numbers
- **Route manipulation**: Unauthorized route changes
- **Identity theft**: Weak package pickup verification

## Security Headers (Intentionally Weak)

### Missing Security Headers
```javascript
// Intentionally missing or weak headers:
// - X-Frame-Options: Allow framing (clickjacking)
// - Content-Security-Policy: Permissive policy
// - X-XSS-Protection: Disabled
// - Strict-Transport-Security: Missing HTTPS enforcement
// - X-Content-Type-Options: Allow MIME sniffing
```

## Development Environment

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/brokenlogistics
      - JWT_SECRET=vulnerable_secret
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=brokenlogistics
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "docker-compose up -d",
    "dev:logs": "docker-compose logs -f",
    "dev:down": "docker-compose down",
    "seed": "npm run seed:data",
    "test": "npm run test:frontend && npm run test:backend",
    "lint": "eslint src/ --ext .ts,.tsx",
    "build": "npm run build:frontend && npm run build:backend"
  }
}
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: User interactions and API calls
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance

### Backend Testing
- **Unit Tests**: Business logic and utilities
- **Integration Tests**: API endpoints and database
- **Security Tests**: Vulnerability verification
- **Performance Tests**: Load testing for scalability

### Vulnerability Testing
- **Automated Scans**: OWASP ZAP integration
- **Manual Testing**: Penetration testing scenarios
- **Code Review**: Security-focused code analysis
- **Documentation**: Vulnerability catalogs and examples

## Deployment Considerations

### Production Environment
- **Container Orchestration**: Docker Swarm or Kubernetes
- **Load Balancing**: Nginx reverse proxy
- **SSL/TLS**: Let's Encrypt certificates
- **Monitoring**: Application and infrastructure monitoring
- **Logging**: Centralized log aggregation

### Security Considerations (for educational use)
- **Network Isolation**: Separate vulnerable app from production systems
- **Access Control**: Restrict to educational environments
- **Data Protection**: Use synthetic data only
- **Incident Response**: Clear guidelines for security events

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline functionality
- **Image Optimization**: WebP format and lazy loading

### Backend Optimization
- **Database Indexing**: Strategic index placement
- **Query Optimization**: N+1 query prevention
- **Caching**: Redis for session and data caching
- **Rate Limiting**: API throttling for stability

## Monitoring and Logging

### Application Monitoring
- **Error Tracking**: Sentry or similar service
- **Performance Monitoring**: APM tools
- **User Analytics**: Privacy-compliant tracking
- **Security Monitoring**: Vulnerability exploit detection

### Infrastructure Monitoring
- **Container Health**: Docker health checks
- **Database Performance**: PostgreSQL monitoring
- **System Resources**: CPU, memory, disk usage
- **Network Traffic**: Request/response analytics 