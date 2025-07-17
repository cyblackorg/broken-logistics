import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize, QueryTypes } from '../config/database';
import { logger, logSensitiveOperation } from '../utils/logger';

const router = express.Router();

// Intentionally weak JWT secret and configuration
const JWT_SECRET = process.env.JWT_SECRET || 'super_weak_secret_123';
const JWT_EXPIRES_IN = '24h'; // Long expiration time

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (vulnerable to various attacks)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'customer' } = req.body;

    // Log sensitive registration data (vulnerable)
    logSensitiveOperation('USER_REGISTRATION', req.body, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Vulnerable: No input validation
    // Vulnerable: SQL injection possible
    const checkUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
          const existingUsers = await sequelize.query(checkUserQuery, {
        type: QueryTypes.SELECT
      });

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: 'User already exists',
        debug: {
          query: checkUserQuery,
          results: existingUsers // Exposes user data
        }
      });
    }

    // Vulnerable: Store password in plain text
    // In a real app, NEVER do this - always hash passwords!
    const insertUserQuery = `
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ('${email}', '${password}', '${firstName}', '${lastName}', '${role}')
      RETURNING *
    `;

          const newUsers = await sequelize.query(insertUserQuery, {
        type: QueryTypes.INSERT
      });

    const user = (newUsers[0] as any)[0];

    // Generate JWT token (weak algorithm)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        // Intentionally include sensitive data in JWT
        password: user.password
      },
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256' // Weak algorithm
      }
    );

    // Log successful registration with token (vulnerable)
    logger.info('USER_REGISTERED', {
      user: user,
      token: token,
      jwt_secret: JWT_SECRET
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        // Vulnerable: Expose password in response
        password: user.password
      },
      token,
      // Debug info that should never be exposed
      debug: {
        jwt_secret: JWT_SECRET,
        sql_query: insertUserQuery,
        environment: process.env.NODE_ENV
      }
    });

  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      details: error.message,
      stack: error.stack // Vulnerable: Expose stack trace
    });
    return;
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (vulnerable to SQL injection and brute force)
 *     tags: [Authentication]
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log login attempt with credentials (vulnerable)
    logSensitiveOperation('LOGIN_ATTEMPT', {
      email,
      password, // NEVER log passwords!
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Vulnerable: SQL injection possible - no parameterized queries
    const loginQuery = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    logger.info('LOGIN_QUERY', { query: loginQuery });

          const users = await sequelize.query(loginQuery, {
        type: QueryTypes.SELECT
      });

    if (users.length === 0) {
      // Vulnerable: Detailed error message reveals system information
      return res.status(401).json({
        error: 'Invalid credentials',
        debug: {
          query: loginQuery,
          attempted_email: email,
          attempted_password: password,
          hint: 'Try SQL injection: admin@brokenlogistics.com\' OR \'1\'=\'1\' --'
        }
      });
    }

    const user = users[0] as any;

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        password: user.password, // Vulnerable: Include password in JWT
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last login (vulnerable query)
    const updateQuery = `UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`;
    await sequelize.query(updateQuery);

    // Set cookie (insecure)
    res.cookie('auth_token', token, {
      httpOnly: false, // Vulnerable: Accessible via JavaScript
      secure: false, // Vulnerable: No HTTPS requirement
      sameSite: 'none', // Vulnerable: CSRF possible
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    logger.info('LOGIN_SUCCESS', {
      user: user,
      token: token,
      ip: req.ip
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        // Vulnerable: Expose password
        password: user.password,
        isActive: user.is_active
      },
      token,
      // Vulnerable debug information
      debug: {
        jwt_secret: JWT_SECRET,
        sql_query: loginQuery,
        session_info: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message,
      stack: error.stack,
      // Vulnerable: Expose environment
      environment: process.env
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile (vulnerable to JWT manipulation)
 */
router.get('/profile', async (req, res) => {
  try {
    // Vulnerable: No proper JWT verification
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        hint: 'Include Authorization header or auth_token cookie'
      });
    }

    // Vulnerable: No error handling for JWT verification
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Vulnerable: Trust JWT data without database verification
    // This allows token manipulation attacks
    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      password: decoded.password, // Vulnerable: Password in JWT
      loginTime: decoded.loginTime
    };

    logger.info('PROFILE_ACCESS', {
      user: user,
      token: token,
      decoded: decoded
    });

    res.json({
      user: user,
      // Vulnerable: Expose JWT details
      jwt_info: {
        token: token,
        decoded: decoded,
        secret: JWT_SECRET,
        algorithm: 'HS256'
      }
    });

  } catch (error: any) {
    res.status(401).json({
      error: 'Invalid token',
      details: error.message,
      // Vulnerable: Expose JWT secret in error
      jwt_secret: JWT_SECRET,
      hint: 'Try manipulating the JWT token'
    });
  }
});

/**
 * @swagger
 * /api/auth/reset:
 *   post:
 *     summary: Password reset (vulnerable implementation)
 */
router.post('/reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Vulnerable: No verification of user identity
    // Vulnerable: SQL injection possible
    const resetQuery = `
      UPDATE users 
      SET password = '${newPassword}' 
      WHERE email = '${email}'
    `;

          const result = await sequelize.query(resetQuery, {
        type: QueryTypes.UPDATE
      });

    logger.warn('PASSWORD_RESET', {
      email: email,
      newPassword: newPassword, // NEVER log passwords!
      query: resetQuery,
      result: result
    });

    res.json({
      message: 'Password reset successfully',
      debug: {
        query: resetQuery,
        affected_rows: result[1],
        new_password: newPassword
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message,
      stack: error.stack
    });
  }
});

// Vulnerable: Admin backdoor (should never exist!)
router.post('/admin-backdoor', async (req, res) => {
  const { secret } = req.body;
  
  // Weak secret check
  if (secret === 'admin123' || secret === process.env.ADMIN_SECRET) {
    const adminToken = jwt.sign(
      { 
        id: 1, 
        email: 'admin@brokenlogistics.com', 
        role: 'admin',
        backdoor: true
      },
      JWT_SECRET,
      { expiresIn: '30d' } // Long expiration
    );

    logger.warn('ADMIN_BACKDOOR_USED', {
      secret: secret,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      token: adminToken
    });

    res.json({
      message: 'Admin access granted',
      token: adminToken,
      user: {
        id: 1,
        email: 'admin@brokenlogistics.com',
        role: 'admin',
        backdoor: true
      }
    });
  } else {
    res.status(401).json({
      error: 'Invalid secret',
      hint: 'Try common passwords like admin123'
    });
  }
});

export default router; 