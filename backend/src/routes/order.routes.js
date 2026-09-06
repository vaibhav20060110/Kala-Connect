import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';

const router = express.Router();

/**
 * GET /orders
 * Retrieve list of orders, optionally filtered by artisan_id or customer_phone
 */
router.get('/', async (req, res) => {
  try {
    const { artisan_id, customer_phone, status } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (artisan_id) {
      sql += ' WHERE artisan_id = $1';
      params.push(artisan_id);
    } else if (customer_phone) {
      sql += ' WHERE customer_phone = $1';
      params.push(customer_phone);
    }

    const result = await query(sql, params);
    let orders = result.rows || [];

    if (status) {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('[ORDERS] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

/**
 * GET /orders/stats/summary
 * Aggregated revenue and order metrics for the artisan business studio
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { artisan_id } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];
    if (artisan_id) {
      sql += ' WHERE artisan_id = $1';
      params.push(artisan_id);
    }

    const result = await query(sql, params);
    const orders = result.rows || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

    return res.json({
      success: true,
      total_orders: orders.length,
      total_revenue: totalRevenue,
      active_orders: activeOrders,
      recent_orders: orders.slice(0, 5)
    });
  } catch (err) {
    console.error('[ORDERS] Stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve order statistics' });
  }
});

/**
 * POST /orders
 * Place a new craft order
 */
router.post('/', async (req, res) => {
  try {
    const {
      artisan_id = 'artisan-demo-01',
      customer_name,
      customer_phone,
      customer_address,
      items,
      total_amount,
      payment_method = 'upi',
      notes = ''
    } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({
        error: 'Missing customer details',
        message: 'Customer name and phone are required to place an order.'
      });
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const itemsJson = typeof items === 'string' ? items : JSON.stringify(items || []);

    const sql = `
      INSERT INTO orders (
        id, artisan_id, customer_name, customer_phone, customer_address,
        items, total_amount, payment_method, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const params = [
      orderId,
      artisan_id,
      customer_name,
      customer_phone,
      customer_address || 'Standard Delivery',
      itemsJson,
      parseFloat(total_amount || 0),
      payment_method,
      'confirmed',
      notes
    ];

    const result = await query(sql, params);
    const createdOrder = result.rows[0];

    console.log(`[ORDERS] 🛍️ New Order Placed: ${orderId} by ${customer_name} for ₹${total_amount}`);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! कारीगर को आपकी मांग प्राप्त हो गई है।',
      order: createdOrder
    });
  } catch (err) {
    console.error('[ORDERS] Create error:', err);
    return res.status(500).json({ error: 'Failed to place order' });
  }
});

/**
 * PATCH /orders/:id/status
 * Update fulfillment state of an order
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;';
    const result = await query(sql, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({
      success: true,
      message: `Order ${id} status updated to ${status}`,
      order: result.rows[0]
    });
  } catch (err) {
    console.error('[ORDERS] Status update error:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
