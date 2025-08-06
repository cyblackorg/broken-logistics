import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { sequelize } from './config/database';
import { logger } from './utils/logger';
import { APP_CONFIG, validateEnvironment } from './config/environment';
import authRoutes from './routes/auth';
import packageRoutes from './routes/packages';
import userRoutes from './routes/users';

import adminRoutes from './routes/admin';
import trackingRoutes from './routes/tracking';
import analyticsRoutes from './routes/analytics';

import shippingRoutes from './routes/shipping';
import chatbotRoutes from './routes/chatbot';
import profileRoutes from './routes/profile';
import { errorHandler } from './middleware/errorHandler';
import { vulnerabilityLogger } from './middleware/vulnerabilityLogger';

const app = express();

// Intentionally weak security configuration for educational purposes
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for XSS vulnerabilities
  crossOriginEmbedderPolicy: false,
  frameguard: false, // Allows clickjacking
  hsts: false, // No HTTPS enforcement
  xssFilter: false // XSS protection disabled
}));

// CORS configuration - overly permissive (vulnerable)
app.use(cors({
  origin: true, // Allows any origin
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' })); // Large limit for potential DoS
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Custom vulnerability logging middleware
app.use(vulnerabilityLogger);

// Static file serving (vulnerable to directory traversal)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: APP_CONFIG.nodeEnv,
    version: '1.0.0',
    database: 'Connected',
    // Intentionally expose sensitive info
    secrets: {
      jwtSecret: APP_CONFIG.jwtSecret,
      dbUrl: process.env.DATABASE_URL
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/users', userRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api/shipping', shippingRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/profile', profileRoutes);

// Vulnerable debug endpoint (intentional)
app.get('/debug', (req, res) => {
  res.json({
    environment: process.env,
    request: {
      headers: req.headers,
      ip: req.ip,
      ips: req.ips,
      query: req.query,
      body: req.body
    },
    system: {
      platform: process.platform,
      version: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

// Catch-all route with verbose error information (vulnerable)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/packages',
      'GET /debug'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
async function startServer() {
  try {
    // Validate environment configuration
    validateEnvironment();
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database models (force: true recreates tables - dangerous in production)
    await sequelize.sync({ force: APP_CONFIG.nodeEnv === 'development' });
    logger.info('Database synchronized');

    // Start server
    app.listen(APP_CONFIG.port, () => {
  logger.info(`🚀 BrokenLogistics API Server started on port ${APP_CONFIG.port}`);
  // logger.info(`📖 Health Check: http://localhost:${APP_CONFIG.port}/health`);
  // logger.info(`🔧 Debug Endpoint: http://localhost:${APP_CONFIG.port}/debug`);
  logger.info(`📖 Health Check: http://logistics.fezzant.com:${APP_CONFIG.port}/health`);
  logger.info(`🔧 Debug Endpoint: http://logistics.fezzant.com:${APP_CONFIG.port}/debug`);
      logger.warn('⚠️  SECURITY WARNING: This server contains intentional vulnerabilities');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

export default app; 