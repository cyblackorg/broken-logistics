# Vulnerable Logistics Application - Project Plan

## Project Overview
**BrokenLogistics** - An intentionally vulnerable logistics and delivery application for security education, similar to DVWA but focused on logistics-specific vulnerabilities.

## Project Phases

### Phase 1: Planning & Design (Week 1-2)
**Deliverables:**
- [ ] Project architecture design
- [ ] User personas and journeys
- [ ] Vulnerability catalog
- [ ] Branding and UI/UX design
- [ ] Database schema design
- [ ] API specification

### Phase 2: Foundation Setup (Week 3)
**Deliverables:**
- [ ] Docker Compose environment
- [ ] Basic React frontend structure
- [ ] Node.js backend with Express
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] Authentication system (intentionally vulnerable)
- [ ] CI/CD pipeline

### Phase 3: Core Features Implementation (Week 4-5)
**Deliverables:**
- [ ] Package tracking system
- [ ] User management (customers, drivers, admins)
- [ ] Shipping and delivery workflow
- [ ] Basic admin dashboard
- [ ] Payment processing (mock)
- [ ] Notification system

### Phase 4: Vulnerability Implementation (Week 6-7)
**Deliverables:**
- [ ] OWASP Top 10 vulnerabilities
- [ ] Logistics-specific vulnerabilities
- [ ] Vulnerability documentation
- [ ] Exploitation scenarios
- [ ] Learning materials

### Phase 5: Polish & Documentation (Week 8)
**Deliverables:**
- [ ] Complete user documentation
- [ ] Instructor guide
- [ ] Deployment guide
- [ ] Security assessment reports
- [ ] Final testing and cleanup

## User Roles & Personas

### 1. Customer Users
- **Regular Customer**: Ships and receives packages
- **Business Customer**: High-volume shipping with special rates
- **Vulnerable behaviors**: Weak passwords, sharing tracking info

### 2. Delivery Personnel
- **Delivery Driver**: Scans packages, updates delivery status
- **Warehouse Worker**: Manages inventory, processes shipments
- **Vulnerable behaviors**: Unsecured mobile devices, location spoofing

### 3. Administrative Users
- **Customer Service**: Handles inquiries, can access customer data
- **Operations Manager**: Oversees routes, driver assignments
- **System Admin**: Manages users, system configuration
- **Vulnerable behaviors**: Excessive privileges, weak access controls

## Core Features by User Type

### Customer Features
- Account registration/login
- Package shipping (create shipment)
- Package tracking
- Delivery preferences
- Payment and billing
- Address book management
- Delivery history
- Support tickets

### Driver Features
- Route assignment
- Package scanning (pickup/delivery)
- Status updates
- GPS tracking
- Photo proof of delivery
- Customer signature capture
- Exception reporting

### Admin Features
- User management
- Package monitoring
- Route optimization
- Analytics dashboard
- Customer service tools
- System configuration
- Audit logs
- Financial reporting

## Vulnerabilities to Implement

### OWASP Top 10 Web Vulnerabilities
1. **Injection (SQL/NoSQL)**
   - Vulnerable package search
   - User data queries without sanitization

2. **Broken Authentication**
   - Weak password policies
   - Session fixation
   - Brute force vulnerabilities

3. **Sensitive Data Exposure**
   - Unencrypted package contents
   - Exposed customer PII
   - Clear text passwords in logs

4. **XML External Entities (XXE)**
   - Vulnerable shipping label XML processing
   - Configuration file parsing

5. **Broken Access Control**
   - Horizontal privilege escalation
   - Direct object references
   - Admin function access

6. **Security Misconfiguration**
   - Default credentials
   - Verbose error messages
   - Unnecessary services enabled

7. **Cross-Site Scripting (XSS)**
   - Stored XSS in package descriptions
   - Reflected XSS in search results

8. **Insecure Deserialization**
   - Vulnerable session tokens
   - Package data serialization

9. **Using Components with Known Vulnerabilities**
   - Outdated libraries
   - Vulnerable dependencies

10. **Insufficient Logging & Monitoring**
    - Missing audit trails
    - Poor security monitoring

### Logistics-Specific Vulnerabilities

1. **Package Spoofing**
   - Fake tracking numbers
   - Package interception
   - Identity theft for package pickup

2. **Geospoofing**
   - GPS manipulation by drivers
   - Fake delivery locations
   - Route manipulation

3. **Inventory Manipulation**
   - Unauthorized package listing
   - Inventory count tampering
   - Package status manipulation

4. **Driver Impersonation**
   - Fake driver credentials
   - Unauthorized package access
   - Route hijacking

5. **Supply Chain Attacks**
   - Malicious package insertion
   - Warehouse security bypass
   - Third-party integration vulnerabilities

6. **Physical Security Gaps**
   - QR code manipulation
   - Package tampering detection bypass
   - Unsecured package storage

## Technical Architecture

### Frontend (React)
```
src/
├── components/
│   ├── common/
│   ├── customer/
│   ├── driver/
│   └── admin/
├── pages/
├── hooks/
├── utils/
├── services/
└── context/
```

### Backend (Node.js)
```
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
└── config/
```

### Database Design
- **Users**: customers, drivers, admins
- **Packages**: shipment details, status, tracking
- **Addresses**: pickup/delivery locations
- **Routes**: driver assignments, delivery schedules
- **Transactions**: payments, billing
- **Audit_Logs**: security events, access logs

### Tech Stack
- **Frontend**: React 18, React Router, Axios, Material-UI/Tailwind
- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: PostgreSQL with Sequelize ORM
- **Security**: Helmet.js, CORS, rate limiting
- **Development**: Docker Compose, ESLint, Prettier
- **Testing**: Jest, React Testing Library

## Development Environment Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Quick Start
```bash
git clone <repo>
cd broken-logistics
docker-compose up -d
npm run seed-data
```

## Security Learning Objectives

### Students Will Learn:
1. Common web application vulnerabilities
2. Logistics-specific security risks
3. Secure coding practices
4. Security testing methodologies
5. Incident response procedures
6. Compliance requirements (GDPR, PCI DSS)

### Exploitation Scenarios
1. **Package Theft**: Using IDOR to access others' packages
2. **Data Breach**: SQL injection to extract customer data
3. **Identity Theft**: XSS to steal session tokens
4. **GPS Spoofing**: Manipulating delivery locations
5. **Privilege Escalation**: Becoming admin through broken access control

## Success Metrics
- Comprehensive vulnerability coverage
- Clear learning progression
- Realistic logistics workflow
- Easy deployment and setup
- Detailed documentation
- Community adoption

## Timeline Summary
- **Total Duration**: 8 weeks
- **MVP Completion**: Week 5
- **Full Feature Set**: Week 7
- **Documentation & Polish**: Week 8

## Next Immediate Steps
1. Finalize branding and design system
2. Create detailed wireframes
3. Set up development environment
4. Begin basic application structure 