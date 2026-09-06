import { initDatabase, query, closeDatabase } from '../db/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const curatedCatalog = [
  {
    id: 'prod-demo-1',
    artisan_id: 'artisan-demo-01',
    title_en: 'Banarasi Kadwa Silk Dupatta',
    title_hi: 'बनारसी कड़वा सिल्क दुपट्टा',
    description_en: 'Hand-woven pure mulberry silk dupatta with delicate floral gold zari motifs along the border.',
    description_hi: 'शुद्ध शहतूत रेशम पर हाथ से बुना पारंपरिक दुपट्टा, किनारों पर सोने की बारीक जरी का काम।',
    raw_image_url: '/uploads/sample_raw_1.jpg',
    enhanced_image_url: '/uploads/sample_enhanced_1.jpg',
    audio_notes_url: null,
    price: 2450.00,
    category: 'Textiles',
    material_cost: 950.00,
    hours_spent: 16.0,
    status: 'published',
    views: 242
  },
  {
    id: 'prod-demo-2',
    artisan_id: 'artisan-demo-01',
    title_en: 'Jaipur Hand-painted Blue Ceramic Vase',
    title_hi: 'जयपुर हस्तनिर्मित ब्लू पॉटरी फूलदान',
    description_en: 'Traditional lead-free blue pottery vase with Persian cobalt floral designs.',
    description_hi: 'पारंपरिक नीली मिट्टी का फूलदान, हस्तनिर्मित फारसी कोबाल्ट फूलों की कलाकृति।',
    raw_image_url: '/uploads/sample_raw_2.jpg',
    enhanced_image_url: '/uploads/sample_enhanced_2.jpg',
    audio_notes_url: null,
    price: 1150.00,
    category: 'Pottery',
    material_cost: 380.00,
    hours_spent: 8.0,
    status: 'published',
    views: 189
  },
  {
    id: 'prod-painting-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Mithila Tree of Life (Madhubani Folk Painting on Canvas)',
    title_hi: 'मिथिला जीवन वृक्ष (पारंपरिक मधुबनी लोक चित्रकला)',
    description_en: 'Hand-painted with fine bamboo twigs and natural mineral pigments on organic khadi canvas. Portrays the sacred Tree of Life and Matsya symbols of abundance.',
    description_hi: 'प्राकृतिक वानस्पतिक रंगों व बारीक बांस की तीली से खादी कैनवास पर निर्मित। जीवन वृक्ष व मत्स्य समृद्धि के प्रतीक।',
    raw_image_url: '/uploads/sample_painting_raw.jpg',
    enhanced_image_url: '/uploads/sample_painting_enhanced.jpg',
    audio_notes_url: null,
    price: 3450.00,
    category: 'Paintings',
    material_cost: 650.00,
    hours_spent: 18.0,
    status: 'published',
    views: 310
  },
  {
    id: 'prod-painting-02',
    artisan_id: 'artisan-demo-01',
    title_en: 'Warli Village Harvest Celebration (Tarpa Dance)',
    title_hi: 'वारली ग्राम कटाई उत्सव (पारंपरिक तारपा नृत्य)',
    description_en: 'Authentic tribal art from Maharashtra hand-painted with white rice paste on earthy terracotta mud-cloth depicting community joy and nature harmony.',
    description_hi: 'महाराष्ट्र की पारंपरिक आदिवासी कला, लाल गेरू की पृष्ठभूमि पर चावल के लेप से उकेरा गया।',
    raw_image_url: '/uploads/sample_painting_warli.jpg',
    enhanced_image_url: '/uploads/sample_painting_warli.jpg',
    audio_notes_url: null,
    price: 2200.00,
    category: 'Paintings',
    material_cost: 420.00,
    hours_spent: 12.0,
    status: 'published',
    views: 198
  },
  {
    id: 'prod-pot-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Handcrafted Terracotta Water Pot (Matka)',
    title_hi: 'मिट्टी का नक्काशीदार पारंपरिक जल पात्र (मटका)',
    description_en: 'Handcrafted unglazed terracotta clay pot with traditional etched floral neck patterns. Naturally keeps water cool through porous micro-evaporation.',
    description_hi: 'पारंपरिक नक्काशीदार प्राकृतिक लाल मिट्टी का मटका। सूक्ष्म वाष्पीकरण से जल को स्वाभाविक रूप से ठंडा व शुद्ध रखने वाला।',
    raw_image_url: '/uploads/sample_terracotta_pot_raw.svg',
    enhanced_image_url: '/uploads/sample_terracotta_pot_enhanced.svg',
    audio_notes_url: null,
    price: 850.00,
    category: 'Pottery',
    material_cost: 240.00,
    hours_spent: 7.0,
    status: 'published',
    views: 186
  },
  {
    id: 'prod-clay-02',
    artisan_id: 'artisan-demo-01',
    title_en: 'Terracotta Chai Kulhad & Tableware Set (Set of 6)',
    title_hi: 'पारंपरिक मिट्टी के कुल्हड़ व पात्र सेट (6 कुल्हड़ व ढक्कनदार हांडी)',
    description_en: 'Set of authentic kiln-baked terracotta clay kulhad tea cups and clay serving pots with lid. Enhances chai aroma with natural earthy notes.',
    description_hi: 'पारंपरिक भट्टी में पके मिट्टी के कुल्हड़ और ढक्कनदार पात्रों का सेट। चाय की सोंधी खुशबू व प्राकृतिक स्वाद से भरपूर।',
    raw_image_url: '/uploads/sample_clay_items_raw.svg',
    enhanced_image_url: '/uploads/sample_clay_items_enhanced.svg',
    audio_notes_url: null,
    price: 650.00,
    category: 'Pottery',
    material_cost: 180.00,
    hours_spent: 5.0,
    status: 'published',
    views: 124
  },
  {
    id: 'prod-mat-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Handwoven Natural River Grass Floor Mat (Madur Chatai)',
    title_hi: 'पारंपरिक हस्तनिर्मित मादुर घास फर्श चटाई',
    description_en: 'Eco-friendly handwoven Madur Kathi river grass floor mat with traditional geometric borders. Breathable, cooling, organic, and long-lasting.',
    description_hi: 'प्राकृतिक मादुर काठी नदी घास से बुनी पारंपरिक फर्श चटाई, बारीक ज्यामितीय बॉर्डर के साथ। ग्रीष्मकालीन शीतलता प्रदायक व टिकाऊ।',
    raw_image_url: '/uploads/sample_grass_mat_raw.svg',
    enhanced_image_url: '/uploads/sample_grass_mat_enhanced.svg',
    audio_notes_url: null,
    price: 1450.00,
    category: 'Fiber',
    material_cost: 450.00,
    hours_spent: 14.0,
    status: 'published',
    views: 158
  },
  {
    id: 'prod-cottage-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Cottage Industry Handcrafted Sabai Grass Basket',
    title_hi: 'सबाई घास और प्राकृतिक बेंत कॉटेज भंडारण टोकरी',
    description_en: 'Multi-purpose handcrafted cottage storage basket made from braided wild Sabai grass and treated cane with fitted woven lid. Sustainable home utility.',
    description_hi: 'ग्रामीण कुटीर उद्योग द्वारा निर्मित सबाई घास और बेंत की मजबूत ढक्कनदार भंडारण टोकरी। 100% पर्यावरण अनुकूल व बहुउपयोगी।',
    raw_image_url: '/uploads/sample_cottage_basket_raw.svg',
    enhanced_image_url: '/uploads/sample_cottage_basket_enhanced.svg',
    audio_notes_url: null,
    price: 1150.00,
    category: 'Fiber',
    material_cost: 320.00,
    hours_spent: 9.0,
    status: 'published',
    views: 112
  },
  {
    id: 'prod-ikat-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Pochampally Ikat Handloom Silk Stole',
    title_hi: 'पोचमपल्ली इकत हथकरघा सिल्क दुपट्टा',
    description_en: 'Geographical Indication certified pure handloom silk stole featuring distinctive geometric Ikat tie-and-dye motifs created by Telangana master weavers.',
    description_hi: 'तेलंगाना के बुनकरों द्वारा टाई-एंड-डाई तकनीक से हाथ से बुना गया शुद्ध रेशम इकत स्टोल। जीआई प्रमाणित।',
    raw_image_url: '/uploads/sample_raw_1.jpg',
    enhanced_image_url: '/uploads/sample_enhanced_1.jpg',
    audio_notes_url: null,
    price: 1850.00,
    category: 'Textiles',
    material_cost: 680.00,
    hours_spent: 11.0,
    status: 'published',
    views: 174
  },
  {
    id: 'prod-brass-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Bastar Lost-Wax Brass Dhokra Figurine (Dancing Tribal Deer)',
    title_hi: 'बस्तर ढोकरा पीतल शिल्प (नृत्यरत जनजातीय हिरण)',
    description_en: 'Ancient 4000-year-old lost-wax casting technique (cire perdue) by tribal metalsmiths of Chhattisgarh. Solid brass figurine with exquisite wire filigree texture.',
    description_hi: 'प्राचीन मोम-सांचा (Lost-Wax) ढलाई तकनीक से निर्मित शुद्ध पीतल ढोकरा कलाकृति। जनजातीय संस्कृति का अमूल्य प्रतीक।',
    raw_image_url: '/uploads/sample_raw_2.jpg',
    enhanced_image_url: '/uploads/sample_raw_2.jpg',
    audio_notes_url: null,
    price: 2150.00,
    category: 'Metal',
    material_cost: 720.00,
    hours_spent: 15.0,
    status: 'published',
    views: 205
  },
  {
    id: 'prod-wood-01',
    artisan_id: 'artisan-demo-01',
    title_en: 'Kashmiri Hand-carved Walnut Wood Keepsake Box',
    title_hi: 'कश्मीरी अखरोट की लकड़ी पर नक्काशीदार बॉक्स',
    description_en: 'Masterfully carved from seasoned Kashmir walnut wood featuring intricate floral dragon and chinar leaf fretwork with velvet lining.',
    description_hi: 'कश्मीर की प्राचीन अखरोट की लकड़ी पर चिनार के पत्तों की नक्काशी युक्त पारंपरिक हस्तशिल्प डिब्बा।',
    raw_image_url: '/uploads/sample_cottage_basket_enhanced.svg',
    enhanced_image_url: '/uploads/sample_cottage_basket_enhanced.svg',
    audio_notes_url: null,
    price: 1650.00,
    category: 'Woodcraft',
    material_cost: 540.00,
    hours_spent: 10.0,
    status: 'published',
    views: 140
  },
  {
    id: 'prod-blue-02',
    artisan_id: 'artisan-demo-01',
    title_en: 'Jaipur Cobalt Blue Pottery Planter Bowl',
    title_hi: 'जयपुर कोबाल्ट ब्लू पॉटरी पुष्प पात्र',
    description_en: 'Hand-shaped quartz and glass-powder blue pottery planter hand-painted with radiant indigo floral arabesques and glazed finish.',
    description_hi: 'पारंपरिक क्वार्ट्ज़ चूर्ण से हस्तनिर्मित और फारसी कोबाल्ट रंगों से सुसज्जित प्रसिद्ध जयपुर ब्लू पॉटरी पात्र।',
    raw_image_url: '/uploads/sample_raw_2.jpg',
    enhanced_image_url: '/uploads/sample_enhanced_2.jpg',
    audio_notes_url: null,
    price: 1280.00,
    category: 'Pottery',
    material_cost: 410.00,
    hours_spent: 8.5,
    status: 'published',
    views: 162
  }
];

async function cleanAndSeed() {
  try {
    console.log('[CLEAN] Connecting to database...');
    await initDatabase();

    console.log('[CLEAN] Clearing out noisy test products...');
    await query("DELETE FROM products WHERE id NOT IN ('prod-demo-1', 'prod-demo-2', 'prod-painting-01', 'prod-painting-02', 'prod-pot-01', 'prod-clay-02', 'prod-mat-01', 'prod-cottage-01', 'prod-ikat-01', 'prod-brass-01', 'prod-wood-01', 'prod-blue-02');");

    console.log('[CLEAN] Upserting 12 authentic, curated master crafts...');
    for (const p of curatedCatalog) {
      const sql = `
        INSERT INTO products (
          id, artisan_id, title_en, title_hi, description_en, description_hi,
          raw_image_url, enhanced_image_url, audio_notes_url, price, category,
          material_cost, hours_spent, status, views
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          title_en = EXCLUDED.title_en,
          title_hi = EXCLUDED.title_hi,
          description_en = EXCLUDED.description_en,
          description_hi = EXCLUDED.description_hi,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          material_cost = EXCLUDED.material_cost,
          hours_spent = EXCLUDED.hours_spent,
          status = EXCLUDED.status,
          raw_image_url = EXCLUDED.raw_image_url,
          enhanced_image_url = EXCLUDED.enhanced_image_url;
      `;
      await query(sql, [
        p.id, p.artisan_id, p.title_en, p.title_hi, p.description_en, p.description_hi,
        p.raw_image_url, p.enhanced_image_url, p.audio_notes_url, p.price, p.category,
        p.material_cost, p.hours_spent, p.status, p.views
      ]);
    }

    const countRes = await query('SELECT count(*) FROM products;');
    console.log(`[CLEAN] Catalog successfully cleaned and updated! Total active crafts: ${countRes.rows[0].count}`);
    await closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[CLEAN] Error cleaning catalog:', err);
    process.exit(1);
  }
}

cleanAndSeed();
