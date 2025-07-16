import express from 'express';
import { sequelize } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Vulnerable: Update driver location (GPS spoofing possible)
router.put('/location', async (req: any, res: any) => {
  try {
    const { latitude, longitude, driverId = 1 } = req.body;

    // Vulnerable: No validation of GPS coordinates
    // Vulnerable: Trust client-side data
    logger.warn('DRIVER_LOCATION_UPDATE', {
      driver_id: driverId,
      coordinates: { latitude, longitude },
      ip: req.ip,
      warning: 'GPS coordinates not validated - spoofing possible'
    });

    res.json({
      message: 'Location updated',
      coordinates: { latitude, longitude },
      driver_id: driverId,
      vulnerability: 'GPS spoofing possible - no validation'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 