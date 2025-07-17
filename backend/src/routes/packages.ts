import express from 'express';
import jwt from 'jsonwebtoken';
import { sequelize, QueryTypes } from '../config/database';
import { logger, logSQLInjectionAttempt } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: List packages (vulnerable to IDOR and SQL injection)
 *     tags: [Packages]
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { search, userId, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM packages';
    const conditions: string[] = [];

    // Vulnerable: SQL injection in search parameter
    if (search) {
      logSQLInjectionAttempt(
        `WHERE contents LIKE '%${search}%'`,
        { search },
        'packages_search'
      );
      conditions.push(`contents LIKE '%${search}%' OR recipient_name LIKE '%${search}%'`);
    }

    // Vulnerable: No access control - users can see others' packages
    if (userId) {
      conditions.push(`sender_id = ${userId}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Vulnerable: No limit validation - could cause DoS
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    logger.info('PACKAGES_QUERY', { 
      query,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const packages = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    res.json({
      packages: packages,
      meta: {
        total: packages.length,
        query: query, // Vulnerable: Expose SQL query
        search_term: search
      }
    });

  } catch (error: any) {
    logger.error('Packages fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch packages',
      details: error.message,
      stack: error.stack,
      sql_error: error.original // Expose database errors
    });
  }
});

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get package by ID (vulnerable to IDOR)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Vulnerable: No access control - any user can access any package
    // Vulnerable: SQL injection possible
    const query = `SELECT * FROM packages WHERE id = ${id}`;

    logger.info('PACKAGE_ACCESS', {
      package_id: id,
      query: query,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const packages = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    if (packages.length === 0) {
      return res.status(404).json({
        error: 'Package not found',
        debug: {
          query: query,
          attempted_id: id,
          hint: 'Try different IDs: 1, 2, 3, etc.'
        }
      });
    }

    const packageData = packages[0] as any;

    // Fetch package events (vulnerable query)
    const eventsQuery = `SELECT * FROM package_events WHERE package_id = ${id} ORDER BY timestamp`;
    const events = await sequelize.query(eventsQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      package: packageData,
      events: events,
      debug: {
        queries: [query, eventsQuery],
        access_control: 'NONE - Anyone can access any package!'
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch package',
      details: error.message,
      stack: error.stack
    });
  }
});

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create new package (vulnerable to XSS and missing validation)
 *     tags: [Packages]
 */
router.post('/', async (req: any, res: any) => {
  try {
    const {
      recipientName,
      recipientEmail,
      contents,
      packageType = 'small',
      weight,
      dimensions,
      declaredValue = 0,
      deliveryInstructions
    } = req.body;

    // Generate tracking number (predictable pattern - vulnerable)
    const trackingNumber = `BL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Vulnerable: No input validation or sanitization
    // Vulnerable: XSS possible in contents and instructions
    const insertQuery = `
      INSERT INTO packages (
        tracking_number, sender_id, recipient_name, recipient_email,
        contents, package_type, weight, dimensions, declared_value,
        delivery_instructions, status
      ) VALUES (
        '${trackingNumber}', 1, '${recipientName}', '${recipientEmail}',
        '${contents}', '${packageType}', ${weight || 0}, '${dimensions}',
        ${declaredValue}, '${deliveryInstructions}', 'created'
      ) RETURNING *
    `;

    logger.info('PACKAGE_CREATION', {
      query: insertQuery,
      data: req.body,
      tracking_number: trackingNumber
    });

    const result = await sequelize.query(insertQuery, {
      type: QueryTypes.INSERT
    });

    const newPackage = (result[0] as any)[0];

    // Create initial event
    const eventQuery = `
      INSERT INTO package_events (package_id, event_type, event_description, location)
      VALUES (${newPackage.id}, 'created', 'Package created and labeled', 'Warehouse')
    `;
    await sequelize.query(eventQuery);

    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage,
      tracking_number: trackingNumber,
      debug: {
        sql_query: insertQuery,
        vulnerabilities: [
          'XSS possible in contents field',
          'SQL injection in all string fields',
          'No input validation',
          'Predictable tracking numbers'
        ]
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create package',
      details: error.message,
      stack: error.stack,
      request_body: req.body // Vulnerable: Expose request data
    });
  }
});

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update package (vulnerable to unauthorized modifications)
 *     tags: [Packages]
 */
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vulnerable: No authorization check - anyone can update any package
    // Vulnerable: SQL injection possible
    const updateFields = Object.keys(updateData)
      .map(key => `${key} = '${updateData[key]}'`)
      .join(', ');

    const updateQuery = `UPDATE packages SET ${updateFields} WHERE id = ${id}`;

    logger.warn('PACKAGE_UPDATE', {
      package_id: id,
      query: updateQuery,
      update_data: updateData,
      ip: req.ip
    });

    const result = await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE
    });

    res.json({
      message: 'Package updated successfully',
      affected_rows: result[1],
      debug: {
        query: updateQuery,
        update_data: updateData,
        warning: 'No authorization check performed!'
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to update package',
      details: error.message,
      stack: error.stack
    });
  }
});

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Delete package (no authorization)
 *     tags: [Packages]
 */
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Vulnerable: No authorization - anyone can delete any package
    const deleteQuery = `DELETE FROM packages WHERE id = ${id}`;

    logger.warn('PACKAGE_DELETE', {
      package_id: id,
      query: deleteQuery,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const result = await sequelize.query(deleteQuery, {
      type: QueryTypes.DELETE
    });

    res.json({
      message: 'Package deleted successfully',
      affected_rows: (result as any)[1],
      debug: {
        query: deleteQuery,
        warning: 'No authorization check - anyone can delete packages!'
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to delete package',
      details: error.message,
      stack: error.stack
    });
  }
});

/**
 * @swagger
 * /api/packages/bulk-export:
 *   get:
 *     summary: Export all packages (data exposure vulnerability)
 *     tags: [Packages]
 */
router.get('/bulk-export', async (req: any, res: any) => {
  try {
    // Vulnerable: No authentication required for sensitive data export
    const exportQuery = `
      SELECT 
        p.*,
        u.email as sender_email,
        u.password as sender_password
      FROM packages p
      LEFT JOIN users u ON p.sender_id = u.id
    `;

    logger.warn('BULK_EXPORT', {
      query: exportQuery,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      warning: 'Sensitive data export without authentication'
    });

    const packages = await sequelize.query(exportQuery, {
      type: QueryTypes.SELECT
    });

    res.json({
      message: 'Package export complete',
      total_packages: packages.length,
      packages: packages,
      warning: 'This export contains sensitive data including passwords!',
      debug: {
        query: exportQuery,
        data_exposed: ['package contents', 'user emails', 'passwords']
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Export failed',
      details: error.message,
      stack: error.stack
    });
  }
});

export default router; 