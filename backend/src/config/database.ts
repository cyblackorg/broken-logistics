import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Intentionally expose database configuration for educational purposes
export const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:vulnerable_password@localhost:5432/brokenlogistics',
  {
    dialect: 'postgres',
    logging: console.log, // Logs all SQL queries (vulnerable - exposes data)
    dialectOptions: {
      ssl: false, // No SSL enforcement (vulnerable)
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

export default sequelize; 