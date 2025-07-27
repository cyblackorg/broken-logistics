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
        p.*
      FROM packages p
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

    const packageData = packages[0] as any;

    // Get events (vulnerable query)
    const eventsQuery = `SELECT * FROM package_events WHERE package_id = ${(packageData as any).id}`;
    const events = await sequelize.query(eventsQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      package: {
        id: packageData.id,
        trackingNumber: packageData.tracking_number,
        status: packageData.status,
        sender: packageData.sender_name,
        recipient: packageData.recipient_name,
        origin: packageData.origin_state,
        destination: packageData.destination_state,
        estimatedDelivery: packageData.estimated_delivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        currentLocation: packageData.current_location,
        events: (events as any[]).map((event: any) => ({
          timestamp: event.timestamp,
          status: event.event_type,
          location: event.location,
          description: event.event_description
        }))
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