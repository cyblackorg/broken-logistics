import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database Configuration
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  name: process.env.DB_NAME || 'brokenlogistics',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'vulnerable_password',
  url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'vulnerable_password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'brokenlogistics'}`,
};

// LLM AI Configuration
export const LLM_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-4',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.1'),
};

// Application Configuration
export const APP_CONFIG = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  jwtSecret: process.env.JWT_SECRET || 'super_weak_secret_123',
};

// Frontend Configuration
export const FRONTEND_CONFIG = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  env: process.env.REACT_APP_ENV || 'development',
};

// PGAdmin Configuration
export const PGADMIN_CONFIG = {
  email: process.env.PGADMIN_EMAIL || 'admin@brokenlogistics.com',
  password: process.env.PGADMIN_PASSWORD || 'admin123',
};

// Validation function to check required environment variables
export function validateEnvironment(): void {
  const requiredVars = [
    { name: 'OPENAI_API_KEY', value: LLM_CONFIG.apiKey },
    { name: 'JWT_SECRET', value: APP_CONFIG.jwtSecret },
  ];

  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing required environment variables:');
    missingVars.forEach(v => console.warn(`   - ${v.name}`));
    console.warn('Please check your .env file');
  }
}

// Export all configurations
export default {
  db: DB_CONFIG,
  llm: LLM_CONFIG,
  app: APP_CONFIG,
  frontend: FRONTEND_CONFIG,
  pgadmin: PGADMIN_CONFIG,
}; 