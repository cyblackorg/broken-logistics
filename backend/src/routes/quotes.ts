import express from 'express';
import { calculateShippingCost, getAvailableStates, getPackageSizes, getSpeedOptions } from '../utils/pricing';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/quotes/calculate:
 *   post:
 *     summary: Calculate shipping cost
 *     tags: [Quotes]
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
 * /api/quotes/states:
 *   get:
 *     summary: Get available states
 *     tags: [Quotes]
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
 * /api/quotes/package-sizes:
 *   get:
 *     summary: Get package size options
 *     tags: [Quotes]
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
 * /api/quotes/speed-options:
 *   get:
 *     summary: Get speed options
 *     tags: [Quotes]
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

export default router; 