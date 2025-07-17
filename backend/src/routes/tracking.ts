import express from 'express';
import { sequelize, QueryTypes } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/track/{trackingNumber}:
 *   get:
 *     summary: Track package by tracking number (vulnerable to SQL injection)
 *     tags: [Tracking]
 */
router.get('/:trackingNumber', async (req: any, res: any) => {
  try {
    const { trackingNumber } = req.params;

    // Vulnerable: SQL injection possible
    const trackingQuery = `
      SELECT 
        p.*,
        u.email as sender_email,
        u.first_name as sender_name
      FROM packages p
      LEFT JOIN users u ON p.sender_id = u.id
      WHERE p.tracking_number = '${trackingNumber}'
    `;

    logger.info('TRACKING_LOOKUP', {
      tracking_number: trackingNumber,
      query: trackingQuery,
      ip: req.ip
    });

    const packages = await sequelize.query(trackingQuery, {
      type: QueryTypes.SELECT
    });

    if (packages.length === 0) {
      return res.status(404).json({
        error: 'Package not found',
        debug: {
          query: trackingQuery,
          attempted_tracking: trackingNumber,
          hint: 'Try SQL injection payloads'
        }
      });
    }

    const packageData = packages[0];

    // Get events (vulnerable query)
    const eventsQuery = `SELECT * FROM package_events WHERE package_id = ${(packageData as any).id}`;
    const events = await sequelize.query(eventsQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      package: packageData,
      events: events,
      debug: {
        queries: [trackingQuery, eventsQuery]
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Tracking failed',
      details: error.message,
      stack: error.stack
    });
  }
});

export default router; 