import express from 'express';
import { sequelize, QueryTypes } from '../config/database';
import { calculateShippingCost, getAvailableStates, getPackageSizes, getSpeedOptions } from '../utils/pricing';
import { logger } from '../utils/logger';

const router = express.Router();

// ===== STATIC ROUTES (MUST COME FIRST) =====

/**
 * @swagger
 * /api/shipping/states:
 *   get:
 *     summary: Get available states
 *     tags: [Shipping]
 */
router.get('/states', async (req: any, res: any) => {
  try {
    const states = getAvailableStates();
    res.json({
      success: true,
      states
    });
  } catch (error: any) {
    logger.error('States fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch states'
    });
  }
});

/**
 * @swagger
 * /api/shipping/package-sizes:
 *   get:
 *     summary: Get package size options
 *     tags: [Shipping]
 */
router.get('/package-sizes', async (req: any, res: any) => {
  try {
    const packageSizes = getPackageSizes();
    res.json({
      success: true,
      packageSizes
    });
  } catch (error: any) {
    logger.error('Package sizes fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch package sizes'
    });
  }
});

/**
 * @swagger
 * /api/shipping/speed-options:
 *   get:
 *     summary: Get speed options
 *     tags: [Shipping]
 */
router.get('/speed-options', async (req: any, res: any) => {
  try {
    const speedOptions = getSpeedOptions();
    res.json({
      success: true,
      speedOptions
    });
  } catch (error: any) {
    logger.error('Speed options fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch speed options'
    });
  }
});

/**
 * @swagger
 * /api/shipping/calculate:
 *   post:
 *     summary: Calculate shipping cost
 *     tags: [Shipping]
 */
router.post('/calculate', async (req: any, res: any) => {
  try {
    const {
      originState,
      destinationState,
      packageSize,
      weight,
      speed
    } = req.body;

    // Validate required fields
    if (!originState || !destinationState || !packageSize || !weight || !speed) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['originState', 'destinationState', 'packageSize', 'weight', 'speed']
      });
    }

    // Calculate shipping cost
    const quote = calculateShippingCost(originState, destinationState, packageSize, weight, speed);

    logger.info('QUOTE_CALCULATED', {
      origin: originState,
      destination: destinationState,
      packageSize,
      weight,
      speed,
      totalCost: quote.totalCost
    });

    res.json({
      success: true,
      quote: {
        ...quote,
        originState,
        destinationState,
        packageSize,
        weight,
        speed
      }
    });

  } catch (error: any) {
    logger.error('Quote calculation error:', error);
    res.status(400).json({
      error: 'Failed to calculate quote',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/shipping/create:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipping]
 */
router.post('/create', async (req: any, res: any) => {
  try {
    const {
      senderName,
      senderEmail,
      senderPhone,
      recipientName,
      recipientEmail,
      recipientPhone,
      originState,
      destinationState,
      packageSize,
      weight,
      speed,
      contents,
      declaredValue = 0,
      deliveryInstructions = ''
    } = req.body;

    // Get user ID from request (if authenticated)
    const userId = req.user?.id || null;

    // Validate required fields
    if (!senderName || !senderEmail || !recipientName || !recipientEmail || 
        !originState || !destinationState || !packageSize || !weight || !speed) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['senderName', 'senderEmail', 'recipientName', 'recipientEmail', 
                  'originState', 'destinationState', 'packageSize', 'weight', 'speed']
      });
    }

    // Calculate shipping cost
    const quote = calculateShippingCost(originState, destinationState, packageSize, weight, speed);

    // Generate tracking number
    const trackingNumber = `BL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create shipment record
    const insertQuery = `
      INSERT INTO packages (
        tracking_number, sender_id, sender_name, sender_email, sender_phone,
        recipient_name, recipient_email, recipient_phone,
        origin_state, destination_state, package_size, weight,
        speed_option, contents, declared_value, delivery_instructions,
        status, total_cost, estimated_days, distance_miles
      ) VALUES (
        '${trackingNumber}', ${userId || 1}, '${senderName}', '${senderEmail}', '${senderPhone || ''}',
        '${recipientName}', '${recipientEmail}', '${recipientPhone || ''}',
        '${originState}', '${destinationState}', '${packageSize}', ${weight},
        '${speed}', '${contents || ''}', ${declaredValue}, '${deliveryInstructions}',
        'created', ${quote.totalCost}, ${quote.estimatedDays}, ${quote.distance}
      ) RETURNING *
    `;

    const result = await sequelize.query(insertQuery, {
      type: QueryTypes.INSERT
    });

    const newShipment = (result[0] as any)[0];

    // Create initial tracking event
    const eventQuery = `
      INSERT INTO package_events (package_id, event_type, event_description, location, timestamp)
      VALUES (${newShipment.id}, 'created', 'Shipment created and labeled', '${originState}', NOW())
    `;
    await sequelize.query(eventQuery);

    logger.info('SHIPMENT_CREATED', {
      trackingNumber,
      senderEmail,
      recipientEmail,
      totalCost: quote.totalCost
    });

    res.status(201).json({
      success: true,
      shipment: {
        id: newShipment.id,
        trackingNumber,
        status: 'created',
        totalCost: quote.totalCost,
        estimatedDays: quote.estimatedDays,
        distance: quote.distance
      },
      quote: {
        baseCost: quote.baseCost,
        distanceCost: quote.distanceCost,
        weightCost: quote.weightCost,
        speedCost: quote.speedCost,
        totalCost: quote.totalCost
      }
    });

  } catch (error: any) {
    logger.error('Shipment creation error:', error);
    res.status(500).json({
      error: 'Failed to create shipment',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/shipping/user/{userId}:
 *   get:
 *     summary: Get user's shipments
 *     tags: [Shipping]
 */
router.get('/user/:userId', async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    // Get user's shipments
    const shipmentsQuery = `
      SELECT * FROM packages 
      WHERE sender_id = ${userId}
      ORDER BY created_at DESC
    `;
    const shipments = await sequelize.query(shipmentsQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      shipments: shipments.map((shipment: any) => ({
        id: shipment.id,
        trackingNumber: shipment.tracking_number,
        status: shipment.status,
        recipientName: shipment.recipient_name,
        destination: shipment.destination_state,
        totalCost: shipment.total_cost,
        estimatedDays: shipment.estimated_days,
        createdAt: shipment.created_at,
        estimatedDelivery: shipment.estimated_delivery
      }))
    });

  } catch (error: any) {
    logger.error('User shipments fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user shipments',
      message: error.message
    });
  }
});

// ===== DYNAMIC ROUTES (MUST COME LAST) =====

/**
 * @swagger
 * /api/shipping/{trackingNumber}/confirm-delivery:
 *   post:
 *     summary: Confirm delivery (for drivers)
 *     tags: [Shipping]
 */
router.post('/:trackingNumber/confirm-delivery', async (req: any, res: any) => {
  try {
    const { trackingNumber } = req.params;
    const { signature, notes } = req.body;

    // Get shipment
    const shipmentQuery = `SELECT * FROM packages WHERE tracking_number = '${trackingNumber}'`;
    const shipments = await sequelize.query(shipmentQuery, {
      type: QueryTypes.SELECT
    });

    if (shipments.length === 0) {
      return res.status(404).json({
        error: 'Shipment not found'
      });
    }

    const shipment = shipments[0] as any;

    // Update to delivered status
    const updateQuery = `
      UPDATE packages 
      SET status = 'delivered', delivered_at = NOW(), signature = '${signature || 'N/A'}', delivery_notes = '${notes || ''}'
      WHERE tracking_number = '${trackingNumber}'
    `;
    await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE
    });

    // Add delivery event
    const eventQuery = `
      INSERT INTO package_events (package_id, event_type, event_description, location, timestamp)
      VALUES (${shipment.id}, 'delivered', 'Package delivered successfully', '${shipment.destination_state}', NOW())
    `;
    await sequelize.query(eventQuery);

    logger.info('DELIVERY_CONFIRMED', {
      trackingNumber,
      signature,
      notes
    });

    res.json({
      success: true,
      message: 'Delivery confirmed successfully',
      deliveredAt: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Delivery confirmation error:', error);
    res.status(500).json({
      error: 'Failed to confirm delivery',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/shipping/{trackingNumber}/update-status:
 *   post:
 *     summary: Update package status and location
 *     tags: [Shipping]
 */
router.post('/:trackingNumber/update-status', async (req: any, res: any) => {
  try {
    const { trackingNumber } = req.params;
    const { status, description } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    // Get shipment
    const shipmentQuery = `SELECT * FROM packages WHERE tracking_number = '${trackingNumber}'`;
    const shipments = await sequelize.query(shipmentQuery, {
      type: QueryTypes.SELECT
    });

    if (shipments.length === 0) {
      return res.status(404).json({
        error: 'Shipment not found'
      });
    }

    const shipment = shipments[0] as any;

    // Update package status
    const updateQuery = `
      UPDATE packages 
      SET status = '${status}', updated_at = NOW()
      WHERE tracking_number = '${trackingNumber}'
    `;
    await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE
    });

    // Add status update event
    const eventQuery = `
      INSERT INTO package_events (package_id, event_type, event_description, location, timestamp)
      VALUES (${shipment.id}, '${status}', '${description || status.replace('_', ' ')}', '${shipment.destination_state}', NOW())
    `;
    await sequelize.query(eventQuery);

    logger.info('STATUS_UPDATED', {
      trackingNumber,
      status,
      description
    });

    res.json({
      success: true,
      message: 'Status updated successfully',
      updatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Status update error:', error);
    res.status(500).json({
      error: 'Failed to update status',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/shipping/{trackingNumber}:
 *   get:
 *     summary: Get shipment details by tracking number
 *     tags: [Shipping]
 */
router.get('/:trackingNumber', async (req: any, res: any) => {
  try {
    const { trackingNumber } = req.params;

    // Get shipment details
    const shipmentQuery = `SELECT * FROM packages WHERE tracking_number = '${trackingNumber}'`;
    const shipments = await sequelize.query(shipmentQuery, {
      type: QueryTypes.SELECT
    });

    if (shipments.length === 0) {
      return res.status(404).json({
        error: 'Shipment not found',
        trackingNumber
      });
    }

    const shipment = shipments[0] as any;

    // Get tracking events
    const eventsQuery = `
      SELECT * FROM package_events 
      WHERE package_id = ${shipment.id} 
      ORDER BY timestamp DESC
    `;
    const events = await sequelize.query(eventsQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      shipment: {
        trackingNumber: shipment.tracking_number,
        status: shipment.status,
        sender: {
          name: shipment.sender_name,
          email: shipment.sender_email,
          phone: shipment.sender_phone
        },
        recipient: {
          name: shipment.recipient_name,
          email: shipment.recipient_email,
          phone: shipment.recipient_phone
        },
        origin: shipment.origin_state,
        destination: shipment.destination_state,
        packageSize: shipment.package_size,
        weight: shipment.weight,
        speed: shipment.speed_option,
        contents: shipment.contents,
        declaredValue: shipment.declared_value,
        deliveryInstructions: shipment.delivery_instructions,
        totalCost: shipment.total_cost,
        estimatedDays: shipment.estimated_days,
        distance: shipment.distance_miles,
        createdAt: shipment.created_at
      },
      events: events.map((event: any) => ({
        type: event.event_type,
        description: event.event_description,
        location: event.location,
        timestamp: event.timestamp
      }))
    });

  } catch (error: any) {
    logger.error('Shipment fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch shipment',
      message: error.message
    });
  }
});

export default router; 