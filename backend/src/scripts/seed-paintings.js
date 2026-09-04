import { query } from '../db/index.js';

async function seedPaintings() {
  try {
    const artisanRes = await query('SELECT id FROM artisans LIMIT 1');
    const artisanId = artisanRes.rows[0]?.id || 'artisan-demo-01';

    await query(`
      INSERT INTO products (id, artisan_id, title_en, title_hi, description_en, description_hi, raw_image_url, enhanced_image_url, price, category, material_cost, hours_spent, status, views)
      VALUES
      ('prod-painting-01', $1, 'Mithila Tree of Life (Madhubani Folk Painting on Canvas)', 'मिथिला जीवन वृक्ष (पारंपरिक मधुबनी लोक चित्रकला)', 'Hand-painted with fine bamboo twigs and natural mineral pigments on organic khadi canvas.', 'प्राकृतिक वानस्पतिक रंगों व बारीक बांस की तीली से खादी कैनवास पर निर्मित।', '/uploads/sample_painting_raw.jpg', '/uploads/sample_painting_enhanced.jpg', 3450.00, 'Paintings', 650.00, 18.0, 'published', 142),
      ('prod-painting-02', $1, 'Warli Village Harvest Celebration (Tarpa Dance)', 'वारली ग्राम कटाई उत्सव (पारंपरिक तारपा नृत्य)', 'Authentic tribal art from Maharashtra hand-painted with white rice paste on earthy terracotta mud-cloth.', 'महाराष्ट्र की पारंपरिक आदिवासी कला, लाल गेरू की पृष्ठभूमि पर चावल के लेप से उकेरा गया।', '/uploads/sample_painting_warli.jpg', '/uploads/sample_painting_warli.jpg', 2200.00, 'Paintings', 420.00, 12.0, 'published', 98)
      ON CONFLICT (id) DO NOTHING;
    `, [artisanId]);

    console.log('✅ Successfully seeded traditional paintings into PostgreSQL database!');
  } catch (err) {
    console.error('Error seeding paintings into DB:', err.message);
  } finally {
    process.exit(0);
  }
}

seedPaintings();
