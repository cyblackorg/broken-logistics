import express from 'express';
import { sequelize, QueryTypes } from '../config/database';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_weak_secret_123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// GET /api/profile - Get user profile
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    const [user] = await sequelize.query(
      `SELECT id, uuid, email, first_name, last_name, phone, role, customer_type, 
              is_active, profile_picture_url, created_at, updated_at
       FROM users WHERE id = $1`,
      {
        type: QueryTypes.SELECT,
        bind: [userId]
      }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
});

// PUT /api/profile - Update user profile
router.put('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;

    // Validate input
    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, uuid, email, first_name, last_name, phone, role, customer_type, 
                is_active, profile_picture_url, created_at, updated_at
    `;

    const [updatedUser] = await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE,
      bind: [first_name, last_name, phone || null, userId]
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
});

// POST /api/profile/change-password - Change password
router.post('/change-password', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current user password
    const [user] = await sequelize.query(
      'SELECT password FROM users WHERE id = $1',
      {
        type: QueryTypes.SELECT,
        bind: [userId]
      }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In this vulnerable app, passwords are stored as plain text
    // In a real app, you would use bcrypt to compare hashed passwords
    if ((user as any).password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password (stored as plain text for vulnerability demonstration)
    await sequelize.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      {
        type: QueryTypes.UPDATE,
        bind: [newPassword, userId]
      }
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to change password', message: error.message });
  }
});

// GET /api/profile/payment-methods - Get user's payment methods
router.get('/payment-methods', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    // Mock payment methods data (in a real app, this would come from a payment_methods table)
    const mockPaymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        brand: 'visa',
        last4: '4242',
        expiry: '12/25',
        name: 'John Doe',
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'card',
        brand: 'mastercard',
        last4: '5555',
        expiry: '08/26',
        name: 'John Doe',
        isDefault: false
      }
    ];

    res.json({
      success: true,
      paymentMethods: mockPaymentMethods
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payment methods', message: error.message });
  }
});

// POST /api/profile/payment-methods - Add new payment method
router.post('/payment-methods', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { cardNumber, expiryMonth, expiryYear, cvv, name } = req.body;

    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !name) {
      return res.status(400).json({ error: 'All card details are required' });
    }

    // Mock payment method creation (in a real app, this would integrate with Stripe/PayPal)
    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'card',
      brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardNumber.slice(-4),
      expiry: `${expiryMonth}/${expiryYear}`,
      name: name,
      isDefault: false
    };

    res.json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethod: newPaymentMethod
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add payment method', message: error.message });
  }
});

// DELETE /api/profile/payment-methods/:id - Remove payment method
router.delete('/payment-methods/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const paymentMethodId = req.params.id;

    // Mock payment method deletion
    res.json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove payment method', message: error.message });
  }
});

// PUT /api/profile/payment-methods/:id/default - Set default payment method
router.put('/payment-methods/:id/default', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const paymentMethodId = req.params.id;

    // Mock setting default payment method
    res.json({
      success: true,
      message: 'Default payment method updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update default payment method', message: error.message });
  }
});

// GET /api/profile/addresses - Get user's addresses
router.get('/addresses', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    const addresses = await sequelize.query(
      `SELECT id, type, street_address, city, state, postal_code, country, 
              latitude, longitude, is_default, created_at
       FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
      {
        type: QueryTypes.SELECT,
        bind: [userId]
      }
    );

    res.json({
      success: true,
      addresses: addresses
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch addresses', message: error.message });
  }
});

// POST /api/profile/addresses - Add new address
router.post('/addresses', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { type, street_address, city, state, postal_code, country, is_default } = req.body;

    if (!street_address || !city || !state || !postal_code) {
      return res.status(400).json({ error: 'Address details are required' });
    }

    // If this is the default address, unset other defaults
    if (is_default) {
      await sequelize.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        {
          type: QueryTypes.UPDATE,
          bind: [userId]
        }
      );
    }

    const insertQuery = `
      INSERT INTO addresses (user_id, type, street_address, city, state, postal_code, country, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const [newAddress] = await sequelize.query(insertQuery, {
      type: QueryTypes.INSERT,
      bind: [userId, type || 'delivery', street_address, city, state, postal_code, country || 'US', is_default || false]
    });

    res.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add address', message: error.message });
  }
});

// PUT /api/profile/addresses/:id - Update address
router.put('/addresses/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { type, street_address, city, state, postal_code, country, is_default } = req.body;

    // Verify address belongs to user
    const [existingAddress] = await sequelize.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      {
        type: QueryTypes.SELECT,
        bind: [addressId, userId]
      }
    );

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is the default address, unset other defaults
    if (is_default) {
      await sequelize.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        {
          type: QueryTypes.UPDATE,
          bind: [userId, addressId]
        }
      );
    }

    const updateQuery = `
      UPDATE addresses 
      SET type = $1, street_address = $2, city = $3, state = $4, postal_code = $5, 
          country = $6, is_default = $7
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `;

    const [updatedAddress] = await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE,
      bind: [type, street_address, city, state, postal_code, country, is_default, addressId, userId]
    });

    res.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update address', message: error.message });
  }
});

// DELETE /api/profile/addresses/:id - Remove address
router.delete('/addresses/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Verify address belongs to user
    const [existingAddress] = await sequelize.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      {
        type: QueryTypes.SELECT,
        bind: [addressId, userId]
      }
    );

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await sequelize.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      {
        type: QueryTypes.DELETE,
        bind: [addressId, userId]
      }
    );

    res.json({
      success: true,
      message: 'Address removed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove address', message: error.message });
  }
});

export default router; 