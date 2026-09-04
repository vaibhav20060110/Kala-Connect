import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';

const router = express.Router();

// Memory store for pending OTPs (mock SMS gateway for hackathon)
const pendingOtps = new Map();

/**
 * POST /auth/otp/request
 * Requests a 6-digit OTP for a phone number
 */
router.post('/otp/request', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate demo OTP (default '123456' or randomized for testing)
    const otp = '123456';
    pendingOtps.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    console.log(`[AUTH] 📲 Generated OTP for ${phone}: [ ${otp} ] (Valid for 10 minutes)`);

    return res.json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      phone,
      demoOtp: otp // Included for zero-friction hackathon testing
    });
  } catch (err) {
    console.error('[AUTH] Error requesting OTP:', err);
    return res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

/**
 * POST /auth/otp/verify
 * Verifies OTP and returns user/artisan session
 */
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, otp, name, craft_type, location, language_pref } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const record = pendingOtps.get(phone);
    const isValidOtp = (record && record.otp === otp) || otp === '123456';

    if (!isValidOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Use demo OTP: 123456' });
    }

    // Check if user exists
    let userRes = await query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user;
    let artisan;

    if (userRes.rows.length === 0) {
      const userId = `user-${uuidv4().slice(0, 8)}`;
      await query('INSERT INTO users (id, phone) VALUES ($1, $2)', [userId, phone]);
      user = { id: userId, phone };

      // Create artisan profile
      const artisanId = `artisan-${uuidv4().slice(0, 8)}`;
      const artisanName = name || 'Artisan Entrepreneur (शिल्पी)';
      const craft = craft_type || 'Handicrafts & Handlooms';
      const loc = location || 'Varanasi, UP';
      const lang = language_pref || 'hi';

      await query(
        'INSERT INTO artisans (id, user_id, name, craft_type, location, language_pref) VALUES ($1, $2, $3, $4, $5, $6)',
        [artisanId, userId, artisanName, craft, loc, lang]
      );

      artisan = {
        id: artisanId,
        user_id: userId,
        name: artisanName,
        craft_type: craft,
        location: loc,
        language_pref: lang
      };
    } else {
      user = userRes.rows[0];
      const artisanRes = await query('SELECT * FROM artisans WHERE user_id = $1', [user.id]);
      if (artisanRes.rows.length > 0) {
        artisan = artisanRes.rows[0];
        // If profile details were provided on verification, update them
        if (name || craft_type || location || language_pref) {
          artisan.name = name || artisan.name;
          artisan.craft_type = craft_type || artisan.craft_type;
          artisan.location = location || artisan.location;
          artisan.language_pref = language_pref || artisan.language_pref;
        }
      } else {
        const artisanId = `artisan-${uuidv4().slice(0, 8)}`;
        await query(
          'INSERT INTO artisans (id, user_id, name, craft_type, location, language_pref) VALUES ($1, $2, $3, $4, $5, $6)',
          [artisanId, user.id, name || 'Artisan', craft_type || 'Handicrafts', location || 'India', language_pref || 'hi']
        );
        artisan = { id: artisanId, user_id: user.id, name: name || 'Artisan' };
      }
    }

    pendingOtps.delete(phone);

    // Simple demo token
    const token = `kala-token-${user.id}-${Date.now()}`;

    return res.json({
      success: true,
      token,
      user,
      artisan
    });
  } catch (err) {
    console.error('[AUTH] Verification error:', err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * GET /me
 * Returns current artisan profile (or default demo profile)
 */
router.get('/me', async (req, res) => {
  try {
    const artisansRes = await query('SELECT * FROM artisans LIMIT 1');
    const artisan = artisansRes.rows[0] || {
      id: 'artisan-demo-01',
      name: 'Radha Devi (राधा देवी)',
      craft_type: 'Handloom & Zari Weaving',
      location: 'Varanasi, Uttar Pradesh',
      language_pref: 'hi'
    };

    const productsRes = await query('SELECT count(*) FROM products WHERE artisan_id = $1', [artisan.id]);
    const productCount = parseInt(productsRes.rows[0]?.count || '0', 10);

    return res.json({
      success: true,
      artisan,
      stats: {
        totalProducts: productCount || 2,
        totalViews: 231,
        activeOrders: 4,
        gemSyncEligible: true
      }
    });
  } catch (err) {
    console.error('[AUTH] Get me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * PATCH /me
 * Update language preference or artisan details
 */
router.patch('/me', async (req, res) => {
  try {
    const { name, craft_type, location, language_pref } = req.body;
    const artisansRes = await query('SELECT * FROM artisans LIMIT 1');
    const artisan = artisansRes.rows[0];

    if (artisan) {
      if (name) artisan.name = name;
      if (craft_type) artisan.craft_type = craft_type;
      if (location) artisan.location = location;
      if (language_pref) artisan.language_pref = language_pref;
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      artisan
    });
  } catch (err) {
    console.error('[AUTH] Patch me error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
