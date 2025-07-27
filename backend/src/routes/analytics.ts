import express from 'express';
import { sequelize, QueryTypes } from '../config/database';

const router = express.Router();

// GET /api/analytics/overview - Overall business metrics
router.get('/overview', async (req: any, res: any) => {
  try {
    // Get basic counts
    const [userStats] = await sequelize.query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN role = 'customer' THEN 1 END) as customers,

        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users`,
      { type: QueryTypes.SELECT }
    );

    const [packageStats] = await sequelize.query(
      `SELECT 
        COUNT(*) as total_packages,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_packages,
        COUNT(CASE WHEN status = 'in_transit' THEN 1 END) as in_transit_packages,
        COUNT(CASE WHEN status = 'created' THEN 1 END) as pending_packages,
        COUNT(CASE WHEN status = 'exception' THEN 1 END) as exception_packages,
        COALESCE(SUM(total_cost), 0) as total_revenue,
        COALESCE(AVG(total_cost), 0) as avg_package_value,
        COALESCE(SUM(distance_miles), 0) as total_distance
      FROM packages`,
      { type: QueryTypes.SELECT }
    );

    // Calculate delivery success rate
    const deliveryRate = (packageStats as any).total_packages > 0 
      ? (((packageStats as any).delivered_packages / (packageStats as any).total_packages) * 100).toFixed(2)
      : '0.00';

    res.json({
      users: userStats,
      packages: packageStats,
      metrics: {
        delivery_success_rate: deliveryRate,
        avg_delivery_distance: (packageStats as any).total_packages > 0 
          ? ((packageStats as any).total_distance / (packageStats as any).total_packages).toFixed(2)
          : '0.00'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch overview analytics', message: error.message });
  }
});

// GET /api/analytics/revenue - Revenue analytics over time
router.get('/revenue', async (req: any, res: any) => {
  try {
    const { period = '30' } = req.query; // days
    
    // Daily revenue for the past period
    const dailyRevenue = await sequelize.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as package_count,
        COALESCE(SUM(total_cost), 0) as revenue
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      { type: QueryTypes.SELECT }
    );

    // Revenue by package size
    const revenueBySize = await sequelize.query(
      `SELECT 
        package_size,
        COUNT(*) as package_count,
        COALESCE(SUM(total_cost), 0) as revenue
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY package_size
      ORDER BY revenue DESC`,
      { type: QueryTypes.SELECT }
    );

    // Revenue by speed option
    const revenueBySpeed = await sequelize.query(
      `SELECT 
        speed_option,
        COUNT(*) as package_count,
        COALESCE(SUM(total_cost), 0) as revenue
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY speed_option
      ORDER BY revenue DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      daily_revenue: dailyRevenue,
      revenue_by_size: revenueBySize,
      revenue_by_speed: revenueBySpeed,
      period_days: parseInt(period)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch revenue analytics', message: error.message });
  }
});

// GET /api/analytics/packages - Package analytics
router.get('/packages', async (req: any, res: any) => {
  try {
    const { period = '30' } = req.query; // days

    // Package status distribution
    const statusDistribution = await sequelize.query(
      `SELECT 
        status,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()) as percentage
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY status
      ORDER BY count DESC`,
      { type: QueryTypes.SELECT }
    );

    // Packages created per day
    const dailyPackages = await sequelize.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as packages_created
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      { type: QueryTypes.SELECT }
    );

    // Top routes by package count
    const topRoutes = await sequelize.query(
      `SELECT 
        origin_state,
        destination_state,
        COUNT(*) as package_count,
        COALESCE(SUM(total_cost), 0) as total_revenue
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
        AND origin_state IS NOT NULL 
        AND destination_state IS NOT NULL
      GROUP BY origin_state, destination_state
      ORDER BY package_count DESC
      LIMIT 10`,
      { type: QueryTypes.SELECT }
    );

    // Average delivery times by status progression
    const deliveryMetrics = await sequelize.query(
      `SELECT 
        speed_option,
        COUNT(*) as total_packages,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
        AVG(CASE WHEN status = 'delivered' AND delivered_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (delivered_at - created_at))/86400 END) as avg_delivery_days
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY speed_option
      ORDER BY avg_delivery_days ASC`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      status_distribution: statusDistribution,
      daily_packages: dailyPackages,
      top_routes: topRoutes,
      delivery_metrics: deliveryMetrics,
      period_days: parseInt(period)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch package analytics', message: error.message });
  }
});

// GET /api/analytics/users - User analytics
router.get('/users', async (req: any, res: any) => {
  try {
    const { period = '30' } = req.query; // days

    // User registrations over time
    const userRegistrations = await sequelize.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users,
        COUNT(CASE WHEN role = 'customer' THEN 1 END) as new_customers
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      { type: QueryTypes.SELECT }
    );

    // User activity (packages sent)
    const userActivity = await sequelize.query(
      `SELECT 
        u.role,
        u.customer_type,
        COUNT(p.id) as packages_sent,
        COUNT(DISTINCT u.id) as active_users
      FROM users u
      LEFT JOIN packages p ON u.id = p.sender_id 
        AND p.created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY u.role, u.customer_type
      ORDER BY packages_sent DESC`,
      { type: QueryTypes.SELECT }
    );

    // Top customers by revenue
    const topCustomers = await sequelize.query(
      `SELECT 
        u.first_name,
        u.last_name,
        u.email,
        u.customer_type,
        COUNT(p.id) as package_count,
        COALESCE(SUM(p.total_cost), 0) as total_revenue
      FROM users u
      INNER JOIN packages p ON u.id = p.sender_id
      WHERE p.created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.customer_type
      ORDER BY total_revenue DESC
      LIMIT 10`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      user_registrations: userRegistrations,
      user_activity: userActivity,
      top_customers: topCustomers,
      period_days: parseInt(period)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user analytics', message: error.message });
  }
});

// GET /api/analytics/performance - Performance metrics
router.get('/performance', async (req: any, res: any) => {
  try {
    // System performance indicators
    const performanceMetrics = await sequelize.query(
      `SELECT 
        COUNT(CASE WHEN status = 'delivered' AND delivered_at <= estimated_delivery THEN 1 END) as on_time_deliveries,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as total_deliveries,
        COUNT(CASE WHEN status = 'exception' THEN 1 END) as exception_count,
        AVG(CASE WHEN status = 'delivered' AND delivered_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (delivered_at - created_at))/86400 END) as avg_delivery_time_days,
        AVG(distance_miles) as avg_shipment_distance
      FROM packages 
      WHERE created_at >= NOW() - INTERVAL '90 days'`,
      { type: QueryTypes.SELECT }
    );

    const [metrics] = performanceMetrics;
    
    // Calculate performance percentages
    const onTimeRate = (metrics as any).total_deliveries > 0 
      ? (((metrics as any).on_time_deliveries / (metrics as any).total_deliveries) * 100).toFixed(2)
      : '0.00';
    
    const exceptionRate = (metrics as any).total_deliveries > 0 
      ? (((metrics as any).exception_count / ((metrics as any).total_deliveries + (metrics as any).exception_count)) * 100).toFixed(2)
      : '0.00';

    res.json({
      on_time_delivery_rate: onTimeRate,
      exception_rate: exceptionRate,
      avg_delivery_time_days: (metrics as any).avg_delivery_time_days ? Number((metrics as any).avg_delivery_time_days).toFixed(2) : '0.00',
      avg_shipment_distance: (metrics as any).avg_shipment_distance ? Number((metrics as any).avg_shipment_distance).toFixed(2) : '0.00',
      total_deliveries: (metrics as any).total_deliveries,
      on_time_deliveries: (metrics as any).on_time_deliveries,
      exception_count: (metrics as any).exception_count
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch performance analytics', message: error.message });
  }
});

export default router; 