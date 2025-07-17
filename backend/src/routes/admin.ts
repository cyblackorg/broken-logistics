import express from 'express';
import jwt from 'jsonwebtoken';
import { sequelize, QueryTypes } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Vulnerable: No authentication required for admin functions
router.get('/users', async (req: any, res: any) => {
  try {
    // Vulnerable: Expose all user data including passwords
    const query = 'SELECT * FROM users';
          const users = await sequelize.query(query, {
        type: QueryTypes.SELECT
      });

    logger.warn('ADMIN_USER_ACCESS', {
      total_users: users.length,
      ip: req.ip,
      warning: 'No authentication check for admin endpoint'
    });

    res.json({
      users: users,
      total: users.length,
      warning: 'Admin endpoint accessed without authentication!',
      debug: { query }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerable: User impersonation
router.post('/impersonate/:userId', async (req: any, res: any) => {
  const { userId } = req.params;
  
  logger.warn('USER_IMPERSONATION', {
    target_user_id: userId,
    ip: req.ip,
    warning: 'User impersonation without proper authorization'
  });

  res.json({
    message: `Impersonating user ${userId}`,
    vulnerability: 'No authorization check for impersonation'
  });
});

export default router; 