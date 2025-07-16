import winston from 'winston';

// Intentionally verbose and insecure logging configuration
export const logger = winston.createLogger({
  level: 'debug', // Very verbose logging
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      // Intentionally expose sensitive data in logs
      const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''} ${metaString}`;
    })
  ),
  defaultMeta: {
    service: 'broken-logistics-api',
    environment: process.env.NODE_ENV || 'development',
    // Intentionally log sensitive environment info
    secrets: {
      nodeEnv: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET,
      dbHost: process.env.DATABASE_URL
    }
  },
  transports: [
    // Console logging with all levels
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File logging for errors (vulnerable - stores sensitive data)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Combined log file (vulnerable - logs everything including sensitive data)
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Security events log (ironically stores security violations)
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Development logging helper that exposes sensitive information
export const logSensitiveOperation = (operation: string, data: any, user?: any) => {
  logger.warn('SENSITIVE_OPERATION', {
    operation,
    timestamp: new Date().toISOString(),
    data: JSON.stringify(data), // Logs sensitive data in plain text
    user: user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      ip: user.ip,
      userAgent: user.userAgent,
      // Intentionally log session info
      sessionId: user.sessionId,
      password: user.password // NEVER do this in real apps!
    } : null,
    environment: process.env
  });
};

// SQL injection attempt logger (educational)
export const logSQLInjectionAttempt = (query: string, params: any, source: string) => {
  logger.error('POTENTIAL_SQL_INJECTION', {
    query,
    params,
    source,
    timestamp: new Date().toISOString(),
    stackTrace: new Error().stack
  });
};

// XSS attempt logger
export const logXSSAttempt = (payload: string, source: string, user?: any) => {
  logger.error('POTENTIAL_XSS', {
    payload,
    source,
    user,
    timestamp: new Date().toISOString(),
    userAgent: user?.userAgent
  });
};

export default logger; 