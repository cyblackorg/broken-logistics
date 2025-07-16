import express from 'express';
import { sequelize } from '../config/database';

const router = express.Router();

// Vulnerable: No authentication required
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Vulnerable: IDOR - any user can access any user's data
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const users = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: users[0],
      debug: { query, warning: 'No authorization check!' }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 