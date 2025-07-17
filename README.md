# 📦 BrokenLogistics

> **An intentionally vulnerable logistics and delivery application for security education**

BrokenLogistics is a full-stack web application that simulates a real-world logistics platform (similar to FedEx or DHL) with intentionally implemented security vulnerabilities. It's designed for educational purposes to teach web application security, OWASP Top 10 vulnerabilities, and logistics-specific security risks.

![BrokenLogistics Logo](./assets/logo-primary.svg)

**⚠️ SECURITY WARNING: This application contains intentional security vulnerabilities. Never deploy this in a production environment or on public networks without proper isolation.**

## ⚡ Quick Start

**TL;DR:** Clone the repo, run `docker-compose up --build`, then visit http://localhost:3000

## 🎯 Educational Objectives

This application helps students and security professionals learn about:

- **OWASP Top 10 Web Application Vulnerabilities**
- **Logistics-specific security risks** (package spoofing, GPS manipulation, etc.)
- **Secure coding practices** through vulnerability analysis
- **Security testing methodologies**
- **Real-world attack scenarios** in logistics systems

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15
- **Infrastructure**: Docker Compose

### User Roles
- **👤 Customers**: Ship and track packages
- **🚚 Drivers**: Manage routes and deliveries
- **👔 Administrators**: Oversee operations and users
- **🎓 Students**: Learn about vulnerabilities

## 🚀 How to Run

### Prerequisites
- **Docker** and **Docker Compose** (recommended)
- **Node.js 18+** (for local development only)
- **Git**

### Option 1: Docker Compose (Recommended)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd broken-logistics
```

2. **Start all services with Docker Compose:**
```bash
docker-compose up --build
```

3. **Access the application:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 🗄️ **Database**: localhost:5432
- 📊 **pgAdmin**: http://localhost:8080

4. **Stop all services:**
```bash
docker-compose down
```

### Option 2: Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start development environment:**
```bash
npm run dev
```

### Option 3: Individual Services

**Start only the database:**
```bash
docker-compose up db -d
```

**Run backend locally:**
```bash
cd backend
npm install
npm run dev
```

**Run frontend locally:**
```bash
cd frontend
npm install
npm run dev
```

### Useful Docker Commands

**View running containers:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f [service-name]
```

**Rebuild specific service:**
```bash
docker-compose up --build [service-name]
```

**Reset everything (remove volumes):**
```bash
docker-compose down -v
docker-compose up --build
```

### Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@brokenlogistics.com | admin123 |
| Driver | driver@brokenlogistics.com | driver123 |
| Customer | customer@brokenlogistics.com | customer123 |
| Support | support@brokenlogistics.com | support123 |

## 🔥 Implemented Vulnerabilities

### OWASP Top 10 Web Vulnerabilities

1. **💉 Injection (SQL/NoSQL)**
   - Package search functionality
   - User authentication
   - Location: `GET /api/packages?search=<payload>`

2. **🔐 Broken Authentication**
   - Weak password policies
   - Predictable session tokens
   - Location: Login and session management

3. **📊 Sensitive Data Exposure**
   - Plain text passwords in database
   - Unencrypted package contents
   - GPS coordinates in API responses

4. **🔗 XML External Entities (XXE)**
   - Shipping label XML processing
   - Location: `POST /api/packages/import`

5. **🚫 Broken Access Control**
   - Insecure Direct Object References (IDOR)
   - Missing function level access control
   - Location: `GET /api/packages/:id`

6. **⚙️ Security Misconfiguration**
   - Default credentials
   - Verbose error messages
   - Missing security headers

7. **🎭 Cross-Site Scripting (XSS)**
   - Stored XSS in package descriptions
   - Reflected XSS in search results
   - Location: Package creation and search

8. **📦 Insecure Deserialization**
   - Vulnerable session handling
   - Package data serialization
   - Location: Session tokens

9. **🔧 Using Components with Known Vulnerabilities**
   - Outdated dependencies
   - Vulnerable npm packages

10. **📝 Insufficient Logging & Monitoring**
    - Missing audit trails
    - Poor security event logging

### Logistics-Specific Vulnerabilities

1. **📍 GPS Spoofing**
   - Driver location manipulation
   - Route tampering
   - Location: `PUT /api/driver/location`

2. **📦 Package Spoofing**
   - Fake tracking numbers
   - Package interception
   - Identity theft for pickup

3. **📋 Inventory Manipulation**
   - Unauthorized package listing
   - Status manipulation
   - Route hijacking

4. **🎭 Driver Impersonation**
   - Weak driver verification
   - Unauthorized package access

## 🎓 Learning Scenarios

### Scenario 1: Package Theft via IDOR
1. Login as a customer
2. Create a package shipment
3. Note the package ID in the URL
4. Try accessing other package IDs
5. **Goal**: Access packages belonging to other users

### Scenario 2: Admin Account Takeover
1. Attempt SQL injection on login form
2. Use payload: `admin@brokenlogistics.com' OR '1'='1' --`
3. **Goal**: Bypass authentication and gain admin access

### Scenario 3: GPS Manipulation
1. Login as a driver
2. Use browser dev tools to modify GPS coordinates
3. Send fake location updates
4. **Goal**: Spoof delivery locations

### Scenario 4: Package Content Exposure
1. Search for packages with XSS payload
2. View package details that expose sensitive contents
3. **Goal**: Extract confidential information from packages

## 🔧 Development

### Project Structure
```
broken-logistics/
├── frontend/           # React application
├── backend/           # Node.js API
├── database/          # Database schemas and migrations
├── assets/           # Brand assets and images
├── docs/             # Documentation
└── docker-compose.yml # Development environment
```

### Running Individual Services

#### Backend Only
```bash
cd backend
npm install
npm run dev
```

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

#### Database Only
```bash
docker-compose up db -d
```

### Testing

#### Run All Tests
```bash
npm test
```

#### Run Specific Tests
```bash
npm run test:frontend
npm run test:backend
```

#### Security Testing
```bash
npm run security:scan
```

## 🔍 API Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **API Health**: http://localhost:5000/health

### Key Endpoints

#### Authentication
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile
```

#### Packages
```
GET    /api/packages
POST   /api/packages
GET    /api/packages/:id
PUT    /api/packages/:id
DELETE /api/packages/:id
```

#### Tracking
```
GET /api/track/:trackingNumber
```

## 🛡️ Security Learning Resources

### Exploitation Examples
Each vulnerability includes:
- **Description**: What the vulnerability is
- **Location**: Where to find it in the application
- **Exploitation**: Step-by-step attack instructions
- **Impact**: Real-world consequences
- **Mitigation**: How to fix the vulnerability

### Learning Paths
1. **Beginner**: Start with XSS and IDOR vulnerabilities
2. **Intermediate**: Progress to SQL injection and authentication bypasses
3. **Advanced**: Explore logistics-specific vulnerabilities and chained attacks

## 🎯 Instructor Guide

### Classroom Setup
1. Deploy application in isolated environment
2. Provide student accounts with different privilege levels
3. Use scenarios for hands-on exercises
4. Monitor student progress through audit logs

### Assessment Ideas
- **Vulnerability Discovery**: Find and document all OWASP Top 10 issues
- **Exploit Development**: Create working proof-of-concept exploits
- **Security Assessment**: Write a comprehensive penetration test report
- **Fix Implementation**: Remediate vulnerabilities and explain fixes

## 🔒 Production Security Notice

**⚠️ CRITICAL: This application is intentionally vulnerable and should NEVER be deployed in production environments.**

For educational deployment:
- Use isolated networks only
- Implement network segmentation
- Monitor all access and activities
- Use synthetic data only (no real PII)
- Regularly reset environments

## 🤝 Contributing

We welcome contributions to improve the educational value:

1. **New Vulnerabilities**: Add more security issues
2. **Learning Scenarios**: Create guided exercises
3. **Documentation**: Improve explanations and guides
4. **Bug Fixes**: Fix non-intentional bugs

### Contribution Guidelines
- Follow the intentionally vulnerable design philosophy
- Document all new vulnerabilities clearly
- Provide educational context for security issues
- Maintain realistic logistics industry workflows

## 📚 Additional Resources

### Security Learning
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

### Logistics Security
- [NIST Cybersecurity Framework for Logistics](https://www.nist.gov/cybersecurity)
- [Supply Chain Security Best Practices](https://www.cisa.gov/supply-chain-security)

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is for educational purposes only. The vulnerabilities are intentional and designed for learning about application security. The authors are not responsible for any misuse of this software or any damages that may result from its use.

---

**🎓 Happy Learning! Remember: Break things safely to learn how to build them securely.** 