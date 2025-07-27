import express from 'express';
import jwt from 'jsonwebtoken';
import { sequelize, QueryTypes } from '../config/database';

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get('/', async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (search) {
      whereClause += ' AND (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)';
      params.push(`%${search}%`);
    }
    
    if (role) {
      whereClause += ` AND role = $${params.length + 1}`;
      params.push(role);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      bind: params
    });
    const total = (countResult[0] as any).total;
    
    // Get users with pagination
    const query = `
      SELECT 
        id, uuid, email, first_name, last_name, phone, role, 
        customer_type, company_name, is_active, created_at, updated_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const users = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: [...params, limit, offset]
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// GET /api/users/:id - Get specific user
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const query = `SELECT * FROM users WHERE id = $1`;
    const users = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: [id]
    });

    if ((users as any[]).length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: any, res: any) => {
  try {
    const { 
      email, password, first_name, last_name, phone, 
      role = 'customer', customer_type = 'individual', 
      company_name, is_active = true 
    } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await sequelize.query(
      'SELECT id FROM users WHERE email = $1',
      { type: QueryTypes.SELECT, bind: [email] }
    );
    
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const insertQuery = `
      INSERT INTO users (
        email, password, first_name, last_name, phone, 
        role, customer_type, company_name, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, uuid, email, first_name, last_name, phone, 
                role, customer_type, company_name, is_active, created_at
    `;
    
    const newUser = await sequelize.query(insertQuery, {
      type: QueryTypes.INSERT,
      bind: [
        email, 
        password, 
        first_name || null, 
        last_name || null, 
        phone || null, 
        role, 
        customer_type, 
        company_name || null, 
        is_active
      ]
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user: newUser[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create user', message: error.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { 
      email, first_name, last_name, phone, 
      role, customer_type, company_name, is_active 
    } = req.body;
    
    // Check if user exists
    const existingUser = await sequelize.query(
      'SELECT id FROM users WHERE id = $1',
      { type: QueryTypes.SELECT, bind: [id] }
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email is being changed and if it's already taken
    if (email) {
      const emailCheck = await sequelize.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        { type: QueryTypes.SELECT, bind: [email, id] }
      );
      
      if (emailCheck.length > 0) {
        return res.status(409).json({ error: 'Email is already taken by another user' });
      }
    }
    
    // Build update query dynamically
    const updateFields = [];
    const bindValues = [];
    let paramIndex = 1;
    
    if (email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      bindValues.push(email);
    }
    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex++}`);
      bindValues.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex++}`);
      bindValues.push(last_name);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramIndex++}`);
      bindValues.push(phone);
    }
    if (role !== undefined) {
      updateFields.push(`role = $${paramIndex++}`);
      bindValues.push(role);
    }
    if (customer_type !== undefined) {
      updateFields.push(`customer_type = $${paramIndex++}`);
      bindValues.push(customer_type);
    }
    if (company_name !== undefined) {
      updateFields.push(`company_name = $${paramIndex++}`);
      bindValues.push(company_name);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      bindValues.push(is_active);
    }
    
    updateFields.push(`updated_at = NOW()`);
    bindValues.push(id);
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, uuid, email, first_name, last_name, phone, 
                role, customer_type, company_name, is_active, updated_at
    `;
    
    const updatedUser = await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE,
      bind: bindValues
    });

    res.json({ 
      message: 'User updated successfully',
      user: updatedUser[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await sequelize.query(
      'SELECT id FROM users WHERE id = $1',
      { type: QueryTypes.SELECT, bind: [id] }
    );
    
    if ((existingUser as any[]).length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user has any packages
    const packagesCheck = await sequelize.query(
      'SELECT COUNT(*) as count FROM packages WHERE sender_id = $1',
      { type: QueryTypes.SELECT, bind: [id] }
    );
    
    if ((packagesCheck[0] as any).count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user with existing packages. Consider deactivating instead.' 
      });
    }
    
    // Delete user
    await sequelize.query(
      'DELETE FROM users WHERE id = $1',
      { type: QueryTypes.DELETE, bind: [id] }
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

// PATCH /api/users/:id/activate - Activate user
router.patch('/:id/activate', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const result = await sequelize.query(
      'UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING id, email, is_active',
      { type: QueryTypes.UPDATE, bind: [id] }
    );
    
    if ((result as any[]).length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User activated successfully',
      user: (result as any[])[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to activate user', message: error.message });
  }
});

// PATCH /api/users/:id/deactivate - Deactivate user
router.patch('/:id/deactivate', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const result = await sequelize.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id, email, is_active',
      { type: QueryTypes.UPDATE, bind: [id] }
    );
    
    if ((result as any[]).length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User deactivated successfully',
      user: (result as any[])[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to deactivate user', message: error.message });
  }
});

export default router; 