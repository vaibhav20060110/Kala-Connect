import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';

const router = express.Router();

/**
 * GET /products
 * Returns list of products for the active artisan
 */
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let sql = 'SELECT * FROM products';
    const params = [];

    const productsRes = await query(sql, params);
    let products = productsRes.rows;

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (status) {
      products = products.filter(p => p.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('[PRODUCTS] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

/**
 * POST /products
 * Creates a new product draft or published catalog item
 */
router.post('/', async (req, res) => {
  try {
    const {
      artisan_id,
      title_en,
      title_hi,
      description_en,
      description_hi,
      raw_image_url,
      enhanced_image_url,
      audio_notes_url,
      price,
      category,
      material_cost,
      hours_spent,
      status
    } = req.body;

    // Default to first artisan if not provided
    let aid = artisan_id;
    if (!aid) {
      const artRes = await query('SELECT id FROM artisans LIMIT 1');
      aid = artRes.rows[0]?.id || 'artisan-demo-01';
    }

    const productId = `prod-${uuidv4().slice(0, 8)}`;
    const finalStatus = status || 'draft';

    const insertSql = `
      INSERT INTO products (
        id, artisan_id, title_en, title_hi, description_en, description_hi,
        raw_image_url, enhanced_image_url, audio_notes_url, price, category,
        material_cost, hours_spent, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;

    const params = [
      productId,
      aid,
      title_en || 'Handmade Craft',
      title_hi || 'हस्तनिर्मित शिल्प',
      description_en || '',
      description_hi || '',
      raw_image_url || null,
      enhanced_image_url || null,
      audio_notes_url || null,
      parseFloat(price || 0),
      category || 'Textiles',
      parseFloat(material_cost || 0),
      parseFloat(hours_spent || 1),
      finalStatus
    ];

    await query(insertSql, params);

    // Fetch the created product
    const createdRes = await query('SELECT * FROM products WHERE id = $1', [productId]);
    const createdProduct = createdRes.rows[0] || {
      id: productId,
      artisan_id: aid,
      title_en,
      title_hi,
      description_en,
      description_hi,
      raw_image_url,
      enhanced_image_url,
      price,
      category,
      material_cost,
      hours_spent,
      status: finalStatus
    };

    console.log(`[PRODUCTS] Created product: ${productId} [${createdProduct.title_en}] - ₹${createdProduct.price}`);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct
    });
  } catch (err) {
    console.error('[PRODUCTS] Create error:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * GET /products/:id
 * Fetches single product details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prodRes = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (prodRes.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = prodRes.rows[0];
    return res.json({
      success: true,
      product
    });
  } catch (err) {
    console.error('[PRODUCTS] Get by id error:', err);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * PATCH /products/:id
 * Updates product details (publish, accept price, update titles, sync to GeM)
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, title_en, title_hi, description_en, description_hi } = req.body;

    const prodRes = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (prodRes.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = prodRes.rows[0];
    if (status !== undefined) product.status = status;
    if (price !== undefined) product.price = parseFloat(price);
    if (title_en !== undefined) product.title_en = title_en;
    if (title_hi !== undefined) product.title_hi = title_hi;
    if (description_en !== undefined) product.description_en = description_en;
    if (description_hi !== undefined) product.description_hi = description_hi;

    // Execute update
    await query('UPDATE products SET status = $1, price = $2 WHERE id = $3', [product.status, product.price, id]);

    console.log(`[PRODUCTS] Updated product ${id} - Status: ${product.status}, Price: ₹${product.price}`);

    return res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error('[PRODUCTS] Patch error:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

export default router;
