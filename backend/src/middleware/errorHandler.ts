import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error with sensitive information (vulnerable)
  logger.error('ERROR_HANDLER', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers, // Exposes all headers including authorization
      body: req.body, // May contain passwords or sensitive data
      query: req.query,
      params: req.params,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    user: (req as any).user || null,
    timestamp: new Date().toISOString()
  });

  // Determine error status
  const status = err.statusCode || err.status || 500;

  // Intentionally verbose error responses (vulnerable)
  const errorResponse = {
    error: true,
    message: err.message || 'Internal Server Error',
    status,
    timestamp: new Date().toISOString(),
    
    // NEVER expose these in production!
    debug: {
      stack: err.stack,
      type: err.constructor.name,
      code: err.code,
      errno: err.errno,
      syscall: err.syscall,
      path: err.path,
      // Database error details
      sql: err.sql,
      parameters: err.parameters,
      // Express request details
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      // System information
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    },
    
    // Suggest potential exploits (educational)
    hints: {
      sqlInjection: err.message.includes('syntax error') ? 'Try SQL injection payloads' : null,
      xss: req.body && typeof req.body === 'object' ? 'Try XSS payloads in form fields' : null,
      pathTraversal: req.url.includes('..') ? 'Path traversal detected' : null,
      authentication: status === 401 ? 'Weak authentication detected' : null
    }
  };

  // Additional error types with specific vulnerabilities
  if (err.name === 'SequelizeDatabaseError') {
    errorResponse.debug.databaseError = {
      original: err.original,
      sql: err.sql,
      parameters: err.parameters
    };
  }

  if (err.name === 'JsonWebTokenError') {
    errorResponse.debug.jwtError = {
      original: err.message,
      // Expose JWT secret (NEVER do this!)
      secret: process.env.JWT_SECRET,
      algorithm: 'HS256'
    };
  }

  if (err.name === 'ValidationError') {
    errorResponse.debug.validationErrors = err.errors;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler; 