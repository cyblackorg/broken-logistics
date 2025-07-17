import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Log the error for debugging
  logger.error('Error caught by middleware:', err);

  // Determine status code
  const status = err.statusCode || err.status || 500;

  // Create enhanced error response (intentionally exposing sensitive info)
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name || 'UnknownError',
      status: status
    },
    // Intentionally expose sensitive debugging information (VULNERABLE)
    debug: {
      stack: err.stack,
      type: err.name,
      code: (err as any).code,
      errno: (err as any).errno,
      syscall: (err as any).syscall,
      path: (err as any).path,
      sql: (err as any).sql,
      parameters: (err as any).parameters,
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      timestamp: req.timestamp,
      vulnerabilityType: req.vulnerabilityType,
      environment: process.env.NODE_ENV
    }
  };

  // Additional vulnerability indicators
  const vulnerabilityHints = {
    sqlInjection: req.body && JSON.stringify(req.body).includes("'") ? 'SQL injection attempted' : null,
    xss: req.body && typeof req.body === 'object' ? 'Try XSS payloads in form fields' : null,
    pathTraversal: req.url.includes('..') ? 'Path traversal detected' : null,
    authentication: status === 401 ? 'Weak authentication detected' : null
  };

  // Add vulnerability hints to response
  (errorResponse.debug as any).vulnerabilityHints = vulnerabilityHints;

  // Additional error types with specific vulnerabilities
  if (err.name === 'SequelizeDatabaseError') {
    (errorResponse.debug as any).databaseError = {
      original: err.original,
      sql: err.sql,
      parameters: err.parameters
    };
  }

  if (err.name === 'JsonWebTokenError') {
    (errorResponse.debug as any).jwtError = {
      original: err.message,
      // Expose JWT secret (NEVER do this!)
      secret: process.env.JWT_SECRET,
      algorithm: 'HS256'
    };
  }

  if (err.name === 'ValidationError') {
    (errorResponse.debug as any).validationErrors = err.errors;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler; 