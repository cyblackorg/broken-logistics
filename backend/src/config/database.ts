import { Sequelize, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Intentionally expose database configuration for educational purposes
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/brokenlogistics',
  {
    logging: console.log, // Intentionally verbose logging
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Intentionally vulnerable settings
    define: {
      timestamps: true,
      underscored: false,
      paranoid: false, // No soft deletes
    },
  }
);

export { sequelize, QueryTypes }; 