import { Sequelize, QueryTypes } from 'sequelize';
import { DB_CONFIG, APP_CONFIG } from './environment';

// Intentionally expose database configuration for educational purposes
const sequelize = new Sequelize(
  DB_CONFIG.url,
  {
    logging: console.log, // Intentionally verbose logging
    dialect: 'postgres',
    dialectOptions: {
      ssl: APP_CONFIG.nodeEnv === 'production' ? {
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