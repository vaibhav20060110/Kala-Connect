import express from 'express';
import { upload } from '../services/storageService.js';
import {
  enhanceProductImage,
  catalogVoiceDescription,
  calculateDynamicPricing,
  generateCertificateOfAuthenticity
} from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /ai/image-enhance
 * Uploads a raw craft photograph, cleans the background, corrects studio lighting,
 * and formats for e-commerce cataloging
 */
router.post('/image-enhance', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      // If client sent URL instead of multipart file
      if (req.body.image_url) {
        return res.json({
          success: true,
          original_url: req.body.image_url,
          enhanced_url: req.body.image_url.replace('_raw_', '_enhanced_'),
          insights: {
            lighting: 'Contrast and highlights balanced',
            background: 'Clean e-commerce studio background applied',
            framing: '1:1 ratio standard'
          }
        });
      }
      return res.status(400).json({ error: 'Please upload an image file (image multipart field)' });
    }

    console.log(`[AI] Processing Image Enhancement for: ${req.file.originalname} (${req.file.size} bytes)`);
    const result = await enhanceProductImage(req.file);

    return res.json({
      success: true,
      original_url: result.originalUrl,
      enhanced_url: result.enhancedUrl,
      insights: result.insights
    });
  } catch (err) {
    console.error('[AI] Image enhance error:', err);
    return res.status(500).json({
      error: 'Failed to enhance image',
      details: err.message,
      friendly_retry_prompt: 'Unable to enhance image right now. Please check lighting or retry.'
    });
  }
});

/**
 * POST /ai/catalog
 * Accepts voice recording in Hindi, English, or regional language, transcribes,
 * translates, and generates SEO product titles + descriptions in EN & HI
 */
router.post('/catalog', upload.single('audio'), async (req, res) => {
  try {
    const preferredLang = req.body.language || 'hi';
    const transcript = req.body.transcript || '';
    const craftType = req.body.craft_type || '';
    console.log(`[AI] Processing Voice Auto-Cataloging (Audio size: ${req.file ? req.file.size : 0} bytes, Lang: ${preferredLang}, Transcript: "${transcript}", Craft: "${craftType}")`);

    const result = await catalogVoiceDescription(req.file, preferredLang, transcript, craftType);

    return res.json({
      success: true,
      audio_url: req.file ? `/uploads/${req.file.filename}` : null,
      transcript: result.transcript,
      title_en: result.title_en,
      title_hi: result.title_hi,
      description_en: result.description_en,
      description_hi: result.description_hi,
      category: result.category,
      tags: result.tags
    });
  } catch (err) {
    console.error('[AI] Voice catalog error:', err);
    return res.status(500).json({
      error: 'Failed to catalog voice recording',
      details: err.message,
      friendly_retry_prompt: 'Could not clearly hear your description. Please speak closer to the microphone and try again.'
    });
  }
});

/**
 * POST /ai/price
 * Evaluates craft category, raw materials, labor hours, and market comparables
 * to return fair-trade pricing with plain-language justification
 */
router.post('/price', async (req, res) => {
  try {
    const { category, material_cost, hours_spent, title_en, craft_type } = req.body;

    console.log(`[AI] Calculating Dynamic Pricing for ${category || 'Craft'} (Material: ₹${material_cost}, Hours: ${hours_spent})`);

    const result = await calculateDynamicPricing({
      category,
      material_cost,
      hours_spent,
      title_en,
      craft_type
    });

    return res.json({
      success: true,
      suggested_min: result.suggested_min,
      suggested_max: result.suggested_max,
      suggested_price: result.suggested_price,
      justification: result.justification,
      justification_hi: result.justification_hi,
      comparables_used: result.comparables_used
    });
  } catch (err) {
    console.error('[AI] Pricing calculation error:', err);
    return res.status(500).json({
      error: 'Failed to calculate dynamic pricing',
      details: err.message,
      friendly_retry_prompt: 'Unable to calculate price recommendation. Defaulting to standard craft margin.'
    });
  }
});

/**
 * POST /ai/painting-certificate
 * Generates a formal Digital Certificate of Authenticity (COA) with provenance and verification hash
 */
router.post('/painting-certificate', async (req, res) => {
  try {
    const cert = generateCertificateOfAuthenticity(req.body);
    return res.json({
      success: true,
      certificate: cert
    });
  } catch (err) {
    console.error('[AI] Certificate error:', err);
    return res.status(500).json({ error: 'Failed to generate certificate', details: err.message });
  }
});

/**
 * POST /ai/room-preview
 * Returns room visualization configuration, available frames, and wall palettes
 */
router.post('/room-preview', async (req, res) => {
  try {
    const { image_url } = req.body;
    return res.json({
      success: true,
      backdrop_url: '/uploads/living_room_scene.svg',
      artwork_url: image_url || '/uploads/sample_painting_enhanced.jpg',
      frames: [
        { id: 'teak', name_en: 'Teakwood Frame', name_hi: 'सागौन की लकड़ी का फ्रेम', border: '16px solid #633B19', shadow: '0 14px 30px rgba(0,0,0,0.38)' },
        { id: 'black', name_en: 'Modern Matte Black', name_hi: 'मैट ब्लैक फ्रेम', border: '12px solid #1A202C', shadow: '0 10px 24px rgba(0,0,0,0.32)' },
        { id: 'gold', name_en: 'Gold Leaf Ornate', name_hi: 'शाही स्वर्ण फ्रेम', border: '14px solid #D4AF37', shadow: '0 16px 36px rgba(212,175,55,0.4)' },
        { id: 'canvas', name_en: 'Gallery Stretched Canvas', name_hi: 'बिना फ्रेम (कैनवास रैप)', border: '4px solid #FAF5EE', shadow: '0 8px 20px rgba(0,0,0,0.25)' }
      ],
      wall_palettes: [
        { id: 'ivory', name: 'Warm Ivory', hex: '#FAF8F5' },
        { id: 'sage', name: 'Heritage Sage', hex: '#E2E8DD' },
        { id: 'slate', name: 'Modern Slate', hex: '#DDE2E6' },
        { id: 'terracotta', name: 'Muted Terracotta', hex: '#F0E2DA' }
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to configure room preview' });
  }
});

export default router;
