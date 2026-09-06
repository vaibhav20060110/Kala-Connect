// kalaSetu Interactive Mobile Demo Controller

const API_BASE = window.location.origin;

const state = {
  language: 'hi', // 'hi' or 'en'
  currentScreen: 'screen-language',
  portal: 'marketplace', // 'marketplace' | 'artisan-studio' | 'phone-demo'
  viewMode: 'full-app', // 'full-app' | 'phone-sim'
  cart: [],
  searchQuery: '',
  activeCategory: 'all',
  giOnly: false,
  sortOrder: 'recommended',
  activeProductDetail: null,
  wizStep: 1,
  webcamStream: null,
  selectedCraft: 'Textiles',
  materialCost: 350,
  hoursSpent: 6,
  calculatedPrice: 950,
  products: [],
  activeFilter: 'all',
  capturedImage: {
    rawUrl: '/uploads/sample_raw_1.jpg',
    enhancedUrl: '/uploads/sample_enhanced_1.jpg'
  },
  catalogData: {
    title_en: 'Banarasi Kadwa Silk Dupatta',
    title_hi: 'बनारसी कड़वा सिल्क दुपट्टा',
    description_en: 'Hand-woven pure mulberry silk dupatta with delicate floral gold zari motifs along the border.',
    description_hi: 'शुद्ध शहतूत रेशम पर हाथ से बुना पारंपरिक दुपट्टा, किनारों पर सोने की बारीक जरी का काम।',
    category: 'Textiles'
  }
};

// Sleek In-App Toast Notification (Replaces native browser alerts)
function showToast(message, type = 'info', duration = 3200) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  const icon = type === 'success' ? '✅' : type === 'whatsapp' ? '💬' : type === 'warning' ? '⚠️' : '📢';
  toast.innerHTML = `<span style="font-size:16px;">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fadeOut');
    setTimeout(() => toast.remove(), 320);
  }, duration);
}
window.showToast = showToast;

// UI Translations (Pure Hindi & Pure English - No mixed phrases)
const i18n = {
  hi: {
    // Header & Brand
    app_title: 'कला सेतु',
    tagline: 'हस्तशिल्पियों का डिजिटल व्यापार साथी',
    tagline_sub: 'भारतीय कारीगरों के लिए AI वर्चुअल बिजनेस मैनेजर',
    select_language: 'अपनी पसंदीदा भाषा चुनें',
    lang_card_hi_title: 'हिंदी',
    lang_card_hi_sub: 'अपनी मातृभाषा में बोलकर उत्पाद दर्ज करें',
    lang_card_en_title: 'English',
    lang_card_en_sub: 'अंग्रेजी भाषा में टूल्स और बोलकर कैटलॉग बनाएं',
    continue: 'आगे बढ़ें',

    // Screen 2: Auth
    auth_title: 'मोबाइल नंबर दर्ज करें',
    auth_sub: 'अपने हस्तशिल्प को डिजिटाइज़ करें और सीधे खरीदारों को बेचें',
    phone_number: 'मोबाइल नंबर',
    send_otp: 'एसएमएस द्वारा ओटीपी भेजें',
    enter_otp: 'ओटीपी कोड दर्ज करें',
    demo_otp_badge: '💡 डेमो कोड: <strong>123456</strong>',
    verify_otp: 'सत्यापित करें और शुरू करें',
    change_phone: 'नंबर बदलें',

    // Screen 3: Profile Setup
    profile_title: 'शिल्पी प्रोफाइल',
    profile_sub: 'अपनी कला और क्षेत्र का विवरण दें',
    artisan_name: 'आपका नाम',
    craft_type: 'शिल्प प्रकार चुनें',
    craft_textiles: '🧵 हथकरघा',
    craft_pottery: '🏺 मिट्टी के बर्तन',
    craft_woodcraft: '🪵 काष्ठ कला',
    craft_metal: '🔔 ढोकरा/धातु',
    craft_paintings: '🎨 लोक चित्रकला',
    craft_leather: '👡 चमड़ा शिल्प',
    location: 'स्थान (शहर / गाँव व राज्य)',
    enter_studio: 'बिजनेस स्टूडियो में प्रवेश करें',

    // Screen 4: Home Dashboard
    dash_title: '📊 व्यापार डैशबोर्ड',
    gem_active: '🏛️ GeM सक्रिय',
    stat_crafts: 'कलाकृतियाँ',
    stat_views: 'देखी गईं',
    stat_orders: 'ऑर्डर / पूछताछ',
    filter_all: 'सभी',
    filter_pottery: '🏺 मिट्टी के बर्तन',
    filter_fiber: '🌾 चटाई व रेशे',
    filter_cottage: '🧺 कुटीर शिल्प',
    filter_paintings: '🎨 चित्रकला',
    filter_textiles: '🧵 हथकरघा',
    filter_published: 'प्रकाशित',
    filter_draft: 'ड्राफ्ट',
    btn_digitize: 'नया शिल्प जोड़ें',

    // Screen 5: Camera
    cam_title: 'शिल्प की तस्वीर लें',
    cam_caption: 'उत्पाद को गाइड बॉक्स के बीच में रखें',
    sample_pot: 'मिट्टी का मटका',
    sample_clay: 'कुल्हड़ व पात्र',
    sample_mat: 'मादुर चटाई',
    sample_cottage: 'कुटीर टोकरी',
    sample_textile: 'सिल्क दुपट्टा',
    sample_painting: 'मधुबनी पेंटिंग',

    // Screen 6: Enhancer
    enhancer_title: '✨ AI स्टूडियो सुधार',
    enhancer_sub: 'जेमिनी AI ने पृष्ठभूमि साफ की और प्रकाश संतुलित किया',
    badge_raw: '📷 मूल फोटो',
    badge_enhanced: '✨ AI स्टूडियो',
    insights_title: '🔍 जेमिनी AI स्टूडियो सुधार:',
    insight_bg: '✓ <strong>पृष्ठभूमि:</strong> अव्यवस्था हटाकर स्टूडियो सफेद रंग लगाया',
    insight_light: '✓ <strong>रोशनी:</strong> प्राकृतिक रंग और चमक को निखारा',
    insight_frame: '✓ <strong>आकार:</strong> 1:1 ई-कॉमर्स मानक फ्रेमिंग',
    use_enhanced: 'यह स्टूडियो फोटो चुनें',
    retake_photo: 'दोबारा तस्वीर लें',

    // Screen 7: Voice Cataloger
    voice_title: '🎙️ बोलकर बताएं',
    voice_sub: 'माइक दबाएं और अपनी भाषा में उत्पाद के बारे में बताएं',
    tap_speak: 'बोलने के लिए माइक दबाएं',
    listening: 'सुन रहे हैं... समाप्त करने के लिए टैप करें',
    voice_proc_title: 'जेमिनी AI विवरण तैयार कर रहा है...',
    voice_proc_sub: 'आवाज समझकर आकर्षक शीर्षक व विवरण तैयार हो रहा है',
    load_demo_voice: '✨ नमूना आवाज विवरण लोड करें',

    // Screen 8: Catalog Review
    review_title: '📝 विवरण की समीक्षा करें',
    review_sub: 'AI द्वारा तैयार शीर्षक व विवरण देखें या संपादित करें',
    tts_title: 'विवरण को आवाज में सुनें',
    tts_sub: 'ऑडियो सुनने के लिए यहाँ टैप करें',
    lbl_title_hi: 'उत्पाद शीर्षक (हिंदी)',
    lbl_title_en: 'उत्पाद शीर्षक (अंग्रेजी)',
    lbl_desc_hi: 'शिल्प कथा (हिंदी)',
    lbl_desc_en: 'शिल्प कथा (अंग्रेजी)',
    goto_pricing: 'अगला: सही मूल्य निर्धारण',

    // Screen 9: Pricing
    pricing_title: '⚖️ AI सही मूल्य निर्धारण',
    pricing_sub: 'लागत, समय और बाजार भाव के आधार पर उचित मूल्य',
    mat_cost: 'कच्चे माल का खर्च',
    hours_spent: 'हाथ से बनाने में लगे घंटे',
    ai_price_header: '✨ जेमिनी AI अनुशंसित मूल्य',
    fair_badge: 'फेयर ट्रेड प्रमाणित',
    market_range_prefix: 'बाजार बिक्री दायरा:',
    adjust_price_lbl: 'मूल्य समायोजन:',
    publish: 'कैटलॉग में प्रकाशित करें',
    share_whatsapp: 'व्हाट्सएप पर शेयर करें (WhatsApp)',
    save_draft: 'ड्राफ्ट के रूप में सहेजें',

    // Modals: Living Room Wall Art Visualizer
    vis_title: 'कमरे में वॉल प्रीव्यू',
    vis_sub: 'लिविंग रूम की दीवार पर पेंटिंग का वास्तविक आकार व फ्रेम देखें',
    vis_select_frame: '🖼️ फ्रेम का प्रकार चुनें:',
    frame_teak: '🪵 सागौन फ्रेम',
    frame_gold: '👑 शाही स्वर्ण',
    frame_black: '⚫ आधुनिक मैट',
    frame_canvas: '🖼️ बिना फ्रेम',
    vis_wall_color: '🎨 दीवार का रंग बदलकर देखें:',
    vis_total_lbl: 'फ्रेम सहित कुल मूल्य:',
    btn_order_framed: 'इस फ्रेम के साथ बुक करें',

    // Modals: Certificate of Authenticity (COA)
    coa_title: 'प्रामाणिकता प्रमाण पत्र',
    coa_sub: 'सरकारी व जीआई सत्यापित शिल्पी प्रामाणिकता पासपोर्ट',
    coa_main_title: 'कला सेतु प्रामाणिकता गारंटी',
    coa_sub_title: 'हस्तनिर्मित पारंपरिक कला प्रामाणिकता प्रमाण पत्र',
    coa_lbl_artwork: 'कलाकृति:',
    coa_lbl_artist: 'कलाकार:',
    coa_lbl_school: 'कला शैली:',
    coa_lbl_medium: 'माध्यम:',
    coa_lbl_dim: 'आकार:',
    coa_lbl_date: 'जारी करने की तिथि:',
    coa_statement: '"यह मूल कलाकृति भारतीय उस्ताद कलाकारों की पीढ़ियों से चली आ रही पारंपरिक शैली, प्राकृतिक रंगों और पारंपरिक प्रतीकों का उपयोग करके पूरी तरह से हाथ से बनाई गई प्रमाणित है।"',
    coa_sig_artisan: 'शिल्पी हस्ताक्षर',
    coa_sig_qr: 'QR डिजिटल सत्यापन',
    coa_btn_download: '🖨️ प्रमाण पत्र डाउनलोड / प्रिंट करें',

    // Modals: GeM & ODOP
    gem_modal_title: 'सरकारी ई-मार्केटप्लेस (GeM Portal)',
    gem_modal_sub: 'ओडीओपी और सरकारी खरीद पोर्टल सिंक्रोनाइज़ेशन',
    gem_odop_title: 'ओडीओपी (One District One Product) प्रमाणित',
    gem_odop_desc: 'आपका शिल्प वाराणसी हथकरघा क्लस्टर के अंतर्गत पंजीकृत है।',
    gem_inq_header: '🏢 सक्रिय B2B थोक पूछताछ:',
    gem_inq_1_title: 'रेलवे खानपान एवं पर्यटन निगम (IRCTC) - 50 सिल्क दुपट्टे',
    gem_inq_1_status: 'प्रक्रियाधीन',
    gem_inq_2_title: 'केंद्रीय कुटीर उद्योग एम्पोरियम (CCIE) - 100 कलाकृतियाँ',
    gem_inq_2_status: 'प्रस्तावित',
    gem_btn_sync: '🏛️ 1-क्लिक में GeM कैटलॉग से सिंक करें',

    // Navigation & Voice Additions
    btn_back: '‹ पीछे जाएं',
    btn_back_lang: '‹ भाषा चयन पर वापस जाएं',
    btn_back_pricing: '‹ विवरण की समीक्षा पर वापस जाएं',
    btn_back_rerecord: '‹ दोबारा बोलें / पीछे जाएं',
    listening_live: 'लाइव आवाज़ पहचानी जा रही है...',
    your_voice: 'आपकी आवाज़',

    // Full Web Application Keys
    nav_tagline: 'कला सेतु',
    nav_subtext: 'राष्ट्रीय हस्तशिल्प एवं हथकरघा डिजिटल सेतु',
    nav_marketplace: 'हस्तशिल्प बाज़ार',
    nav_studio: 'शिल्पी स्टूडियो',
    nav_gem: 'GeM व ODOP',
    btn_install_app: 'ऐप इंस्टॉल करें',
    search_placeholder: 'शिल्प, कलाकार या सामग्री खोजें (Search pottery, silk, Madhubani)...',
    mode_phone_sim: 'फ़ोन डेमो',
    mode_full_app: 'पूर्ण ऐप',
    cart_title: 'कार्ट',
    cart_drawer_title: 'आपकी टोकरी (Shopping Cart)',
    cart_fair_impact: '100% शिल्पी आजीविका गारंटी',
    cart_fair_sub: 'आपकी पूरी राशि सीधे स्थानीय भारतीय कारीगर परिवार को प्राप्त होती है।',
    cart_subtotal: 'उप-योग (Subtotal):',
    cart_shipping: 'शिल्प सुरक्षित डिलीवरी:',
    cart_free_delivery: 'मुफ़्त (Free)',
    cart_total: 'कुल देय राशि:',
    btn_checkout: 'सुरक्षित चेकआउट करें',
    hero_badge: '100% प्रामाणिक पारंपरिक भारतीय हस्तकला • निष्पक्ष आजीविका गारंटी',
    hero_title: 'भारत की समृद्ध हस्तकला विरासत <br /><span class="hero-highlight">सीधे उस्ताद कारीगरों के हाथों से</span>',
    hero_desc: 'जेमिनी AI द्वारा संचालित निष्पक्ष मूल्य निर्धारण, डिजिटल जीआई प्रामाणिकता प्रमाणपत्र (COA), तथा आपके घर की दीवार पर लाइव एआर (AR) पेंटिंग प्रीव्यू के साथ खरीदारी करें।',
    pillar_fair_title: 'निष्पक्ष आजीविका',
    pillar_fair_sub: 'सामग्री व श्रम की पूरी पारदर्शिता',
    pillar_coa_title: 'जीआई प्रामाणिकता',
    pillar_coa_sub: 'नकल-मुक्त क्रिप्टोग्राफिक पासपोर्ट',
    pillar_ar_title: 'कमरे में वॉल प्रीव्यू',
    pillar_ar_sub: 'फ्रेम व दीवार के रंग के साथ देखें',
    pillar_wa_title: 'सीधा व्हाट्सएप संपर्क',
    pillar_wa_sub: 'कारीगर से सीधे बातचीत व ऑर्डर',
    filter_gi_only: '🌟 केवल जीआई (GI) प्रमाणित शिल्प',
    sort_label: 'क्रमबद्ध करें:',
    sort_rec: 'लोकप्रिय व अनुशंसित',
    sort_asc: 'मूल्य: कम से ज्यादा',
    sort_desc: 'मूल्य: ज्यादा से कम',
    sort_hours: 'कारीगरी श्रम समय (अधिकतम)',
    btn_add_to_cart: 'कार्ट में जोड़ें',
    btn_whatsapp_inquire: 'व्हाट्सएप पर बात करें',
    btn_digitize_new: '✨ नया शिल्प जोड़ें (AI डिजिटाइज़)',
    btn_gem_sync_hub: 'GeM पोर्टल सिंक',
    stat_active_crafts: 'सक्रिय कैटलॉग शिल्प',
    stat_earnings: 'कुल निष्पक्ष शिल्पी आय',
    quick_samples_title: '⚡ 1-टैप डेमो शिल्प चुनें (त्वरित परीक्षण हेतु):',
    quick_samples_sub: 'स्वचालित फोटो, विवरण, मूल्य निर्धारण व विश्लेषण लोड करें',
    my_inventory_title: '📦 मेरी शिल्प सूची एवं प्रबंधन',
    my_inventory_sub: 'मूल्य समायोजित करें, प्रमाणपत्र देखें, या व्हाट्सएप कैटलॉग साझा करें',
    col_craft: 'शिल्प',
    col_category: 'श्रेणी',
    col_cost: 'लागत विभाजन',
    col_price: 'विक्रय मूल्य',
    col_status: 'स्थिति',
    col_actions: 'कार्रवाई',
    checkout_title: 'शिल्प ऑर्डर चेकआउट',
    checkout_sub: 'डिलीवरी पता व भुगतान विकल्प चुनें',
    delivery_details: '📍 डिलीवरी विवरण',
    chk_name: 'ग्राहक का पूरा नाम',
    chk_phone: 'मोबाइल नंबर (WhatsApp)',
    chk_address: 'मकान नंबर, सड़क व इलाका',
    chk_city: 'शहर / ज़िला',
    chk_pincode: 'पिनकोड',
    payment_method: '💳 भुगतान का माध्यम',
    order_items_summary: '📋 ऑर्डर सारांश:',
    total_payable: 'कुल देय राशि:',
    btn_confirm_order: 'ऑर्डर की पुष्टि करें',
    order_success_title: '🎉 बधाई! आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है',
    order_success_msg: 'शिल्पकार को ऑर्डर का विवरण भेज दिया गया है। कारीगर आपकी कलाकृति को प्यार और सावधानी से पैक करके 2 कार्य दिवसों में प्रेषित करेंगे।',
    craft_story_title: '📖 शिल्प की विरासत एवं निर्माण कथा:',
    fair_breakdown_title: 'पारदर्शी शिल्पी मूल्य निर्धारण (Fair-Trade Breakdown)',
    raw_materials: 'कच्ची प्राकृतिक सामग्री:',
    artisan_labor: 'हस्तनिर्मित कारीगरी श्रम:',
    heritage_premium: 'पारंपरिक जीआई कला अधिशेष:',
    fair_sale_price: 'उचित विक्रय मूल्य:',
    wizard_title: 'AI शिल्पी बिजनेस स्टूडियो',
    wizard_sub: 'फ़ोटो सुधारें, बोलकर कैटलॉग बनाएं, और उचित मूल्य तय करें',
    step_photo: 'फ़ोटो',
    step_ai: 'AI स्टूडियो',
    step_voice: 'बोलें (Voice)',
    step_pricing: 'मूल्य (Price)',
    pane1_title: '📸 शिल्प की तस्वीर लें या फ़ाइल चुनें',
    pane1_sub: 'कैमरा खोलें या अपनी गैलरी से वास्तविक शिल्प की तस्वीर अपलोड करें',
    wiz_preset_lbl: 'त्वरित शिल्प नमूने (1-टैप चयन):',
    next_step_ai: 'अगला: AI स्टूडियो सुधार ➔',
    pane2_title: '✨ जेमिनी AI स्टूडियो सुधार',
    pane2_sub: 'पृष्ठभूमि साफ की गई, प्रकाश संतुलित किया गया, और 1:1 ई-कॉमर्स फ्रेमिंग तैयार',
    next_step_voice: 'अगला: बोलकर विवरण तैयार करें ➔',
    pane3_title: '🎙️ अपनी भाषा में बोलकर बताएं (Voice-First)',
    pane3_sub: 'माइक दबाएं और अपने शिल्प के बारे में बताएं। AI स्वतः आकर्षक शीर्षक व विवरण तैयार करेगा।',
    next_step_pricing: 'अगला: सही मूल्य निर्धारण ➔'
  },
  en: {
    // Header & Brand
    app_title: 'kalaSetu',
    tagline: 'Digital Business Partner for Artisans',
    tagline_sub: 'AI Virtual Business Manager for Indian Artisans',
    select_language: 'Choose Your Preferred Language',
    lang_card_hi_title: 'Hindi',
    lang_card_hi_sub: 'Voice cataloging and studio tools in Hindi',
    lang_card_en_title: 'English',
    lang_card_en_sub: 'Voice-assisted cataloging and tools in English',
    continue: 'Continue',

    // Screen 2: Auth
    auth_title: 'Enter Mobile Number',
    auth_sub: 'Digitize your crafts and sell directly to buyers',
    phone_number: 'Mobile Number',
    send_otp: 'Send OTP via SMS',
    enter_otp: 'Enter Verification OTP',
    demo_otp_badge: '💡 Demo Code: <strong>123456</strong>',
    verify_otp: 'Verify & Get Started',
    change_phone: 'Change Number',

    // Screen 3: Profile Setup
    profile_title: 'Artisan Profile',
    profile_sub: 'Tell us about your craft and region',
    artisan_name: 'Your Full Name',
    craft_type: 'Select Craft Type',
    craft_textiles: '🧵 Handloom & Textiles',
    craft_pottery: '🏺 Pottery & Ceramics',
    craft_woodcraft: '🪵 Woodcraft',
    craft_metal: '🔔 Metal & Dhokra Art',
    craft_paintings: '🎨 Folk Paintings',
    craft_leather: '👡 Leather Crafts',
    location: 'Location (City / Village & State)',
    enter_studio: 'Enter Business Studio',

    // Screen 4: Home Dashboard
    dash_title: '📊 Business Dashboard',
    gem_active: '🏛️ GeM Active',
    stat_crafts: 'Crafts Listed',
    stat_views: 'Views',
    stat_orders: 'Orders / Inquiries',
    filter_all: 'All',
    filter_pottery: '🏺 Pottery & Clay',
    filter_fiber: '🌾 Mats & Fiber',
    filter_cottage: '🧺 Cottage Crafts',
    filter_paintings: '🎨 Paintings',
    filter_textiles: '🧵 Textiles',
    filter_published: 'Published',
    filter_draft: 'Draft',
    btn_digitize: 'Add New Craft',

    // Screen 5: Camera
    cam_title: 'Capture Craft Photo',
    cam_caption: 'Keep product centered inside the guide box',
    sample_pot: 'Terracotta Pot',
    sample_clay: 'Clay Kulhad',
    sample_mat: 'Grass Mat',
    sample_cottage: 'Cottage Basket',
    sample_textile: 'Silk Dupatta',
    sample_painting: 'Madhubani Art',

    // Screen 6: Enhancer
    enhancer_title: '✨ AI Studio Enhancement',
    enhancer_sub: 'Gemini AI cleaned background & balanced studio lighting',
    badge_raw: '📷 Original Photo',
    badge_enhanced: '✨ AI Studio',
    insights_title: '🔍 Gemini AI Studio Enhancements:',
    insight_bg: '✓ <strong>Background:</strong> Clutter removed, studio white backdrop applied',
    insight_light: '✓ <strong>Lighting:</strong> Balanced natural colors, texture & luster',
    insight_frame: '✓ <strong>Framing:</strong> 1:1 e-commerce ready standard crop',
    use_enhanced: 'Use This Studio Photo',
    retake_photo: 'Retake Photo',

    // Screen 7: Voice Cataloger
    voice_title: '🎙️ Speak About Your Craft',
    voice_sub: 'Tap the mic and describe your craft in your own words',
    tap_speak: 'Tap Mic to Speak',
    listening: 'Listening... Tap to finish',
    voice_proc_title: 'Gemini AI is crafting your catalog...',
    voice_proc_sub: 'Transcribing speech into bilingual titles & stories',
    load_demo_voice: '✨ Load Sample Voice Story',

    // Screen 8: Catalog Review
    review_title: '📝 Review Craft Catalog',
    review_sub: 'Inspect or edit AI-generated titles and descriptions',
    tts_title: 'Listen to Description (Audio)',
    tts_sub: 'Tap here to hear spoken audio read-back',
    lbl_title_hi: 'Product Title (Hindi)',
    lbl_title_en: 'Product Title (English)',
    lbl_desc_hi: 'Craft Story (Hindi)',
    lbl_desc_en: 'Craft Story (English)',
    goto_pricing: 'Next: Fair Price Calculation',

    // Screen 9: Pricing
    pricing_title: '⚖️ AI Fair Price Calculation',
    pricing_sub: 'Fair price based on raw materials, artisan labor & market rates',
    mat_cost: 'Raw Material Cost',
    hours_spent: 'Hours Spent Crafting',
    ai_price_header: '✨ Gemini AI Recommended Price',
    fair_badge: 'Fair Trade Certified',
    market_range_prefix: 'Market Selling Range:',
    adjust_price_lbl: 'Adjust Price:',
    publish: 'Publish to Catalog',
    share_whatsapp: 'Share on WhatsApp',
    save_draft: 'Save as Draft',

    // Modals: Living Room Wall Art Visualizer
    vis_title: 'Living Room Wall Preview',
    vis_sub: 'Visualize artwork dimensions and frames on a living room wall',
    vis_select_frame: '🖼️ Select Frame Finish:',
    frame_teak: '🪵 Teakwood Finish',
    frame_gold: '👑 Royal Gold Leaf',
    frame_black: '⚫ Modern Matte Black',
    frame_canvas: '🖼️ Stretched Canvas (Frameless)',
    vis_wall_color: '🎨 Preview On Different Wall Colors:',
    vis_total_lbl: 'Total with Frame:',
    btn_order_framed: 'Order With This Frame',

    // Modals: Certificate of Authenticity (COA)
    coa_title: 'Certificate of Authenticity',
    coa_sub: 'GI-Verified Artisan Provenance Passport',
    coa_main_title: 'kalaSetu Authenticity Guarantee',
    coa_sub_title: 'Certified Handmade Indigenous Folk Art',
    coa_lbl_artwork: 'Artwork Title:',
    coa_lbl_artist: 'Master Artist:',
    coa_lbl_school: 'Art Style & GI Tag:',
    coa_lbl_medium: 'Medium & Materials:',
    coa_lbl_dim: 'Dimensions:',
    coa_lbl_date: 'Date of Issue:',
    coa_statement: '"This original work is certified to have been entirely hand-painted using authentic indigenous traditions, natural pigments, and sacred motifs passed down through generations of Indian master artisans."',
    coa_sig_artisan: 'Artisan Signature',
    coa_sig_qr: 'Digital QR Verification',
    coa_btn_download: '🖨️ Download / Print Certificate',

    // Modals: GeM & ODOP
    gem_modal_title: 'Government e-Marketplace (GeM)',
    gem_modal_sub: 'ODOP & Government Procurement Synchronization',
    gem_odop_title: 'ODOP (One District One Product) Certified',
    gem_odop_desc: 'Your artisan craft is registered under the Varanasi Handloom Cluster.',
    gem_inq_header: '🏢 Active B2B Bulk Inquiries:',
    gem_inq_1_title: 'Indian Railway Catering & Tourism Corp (IRCTC) - 50 Silk Dupattas',
    gem_inq_1_status: 'In Progress',
    gem_inq_2_title: 'Central Cottage Industries Emporium (CCIE) - 100 Pieces',
    gem_inq_2_status: 'Quote Submitted',
    gem_btn_sync: '🏛️ 1-Click Sync to GeM Procurement Portal',

    // Navigation & Voice Additions
    btn_back: '‹ Go Back',
    btn_back_lang: '‹ Change Language',
    btn_back_pricing: '‹ Back to Review Story',
    btn_back_rerecord: '‹ Re-record / Go Back',
    listening_live: 'Listening to your speech...',
    your_voice: 'Your Spoken Words',

    // Full Web Application Keys
    nav_tagline: 'कला सेतु',
    nav_subtext: 'National Artisans & Handlooms Digital Network',
    nav_marketplace: 'Handicraft Market',
    nav_studio: 'Artisan Studio',
    nav_gem: 'GeM & ODOP',
    search_placeholder: 'Search handmade pottery, silk, Madhubani...',
    mode_phone_sim: 'Phone Demo',
    mode_full_app: 'Full Web App',
    cart_title: 'Cart',
    cart_drawer_title: 'Your Shopping Cart',
    cart_fair_impact: '100% Direct Artisan Livelihood Guarantee',
    cart_fair_sub: '100% of the craft value goes straight to traditional artisan families.',
    cart_subtotal: 'Subtotal:',
    cart_shipping: 'Secure Handcrafted Delivery:',
    cart_free_delivery: 'Free',
    cart_total: 'Total Amount:',
    btn_checkout: 'Proceed to Checkout',
    hero_badge: '100% Authentic Indian Craft • Fair Trade Living Wage',
    hero_title: 'India\'s Rich Craft Heritage <br /><span class="hero-highlight">Directly from Master Artisans</span>',
    hero_desc: 'Discover fair-trade certified crafts, verifiable GI-tag authenticity passports, and AR room wall visualizer powered by Google Gemini AI.',
    pillar_fair_title: 'Fair Livelihood',
    pillar_fair_sub: 'Full transparency in materials & labor',
    pillar_coa_title: 'GI Authenticity',
    pillar_coa_sub: 'Counterfeit-proof cryptographic passport',
    pillar_ar_title: 'Living Room Preview',
    pillar_ar_sub: 'Visualize with frame & wall paint colors',
    pillar_wa_title: 'Direct WhatsApp Connect',
    pillar_wa_sub: 'Chat and order directly with artisans',
    filter_gi_only: '🌟 GI Tagged Crafts Only',
    sort_label: 'Sort by:',
    sort_rec: 'Popular & Recommended',
    sort_asc: 'Price: Low to High',
    sort_desc: 'Price: High to Low',
    sort_hours: 'Craft Labor Hours (Highest)',
    btn_add_to_cart: 'Add to Cart',
    btn_whatsapp_inquire: 'Chat on WhatsApp',
    btn_digitize_new: '✨ Digitize New Craft (AI)',
    btn_gem_sync_hub: 'Sync GeM Portal',
    stat_active_crafts: 'Active Crafts in Catalog',
    stat_earnings: 'Total Artisan Revenue',
    quick_samples_title: '⚡ 1-Tap Demo Crafts (Instant Test):',
    quick_samples_sub: 'Auto-load sample photos, voice descriptions & pricing',
    my_inventory_title: '📦 My Crafts Inventory & Management',
    my_inventory_sub: 'Adjust prices, view authenticity certificate, or share catalog',
    col_craft: 'Craft',
    col_category: 'Category',
    col_cost: 'Cost Breakdown',
    col_price: 'Selling Price',
    col_status: 'Status',
    col_actions: 'Actions',
    checkout_title: 'Craft Order Checkout',
    checkout_sub: 'Enter delivery address and payment choice',
    delivery_details: '📍 Delivery Address',
    chk_name: 'Customer Full Name',
    chk_phone: 'Mobile Number (WhatsApp)',
    chk_address: 'Street & Flat Address',
    chk_city: 'City / District',
    chk_pincode: 'PIN Code',
    payment_method: '💳 Payment Method',
    order_items_summary: '📋 Order Summary:',
    total_payable: 'Total Payable:',
    btn_confirm_order: 'Confirm Order',
    order_success_title: '🎉 Congratulations! Your Order is Confirmed',
    order_success_msg: 'Order details have been dispatched to the master artisan. Handcrafted packaging will commence immediately.',
    craft_story_title: '📖 Craft Heritage & Provenance Story:',
    fair_breakdown_title: 'Transparent Artisan Fair-Trade Breakdown',
    raw_materials: 'Raw Natural Materials:',
    artisan_labor: 'Handcrafted Artisan Labor:',
    heritage_premium: 'Traditional GI Art Premium:',
    fair_sale_price: 'Fair Selling Price:',
    wizard_title: 'AI Artisan Business Studio',
    wizard_sub: 'Enhance photos, create voice catalogs, and calculate fair prices',
    step_photo: 'Photo',
    step_ai: 'AI Studio',
    step_voice: 'Voice',
    step_pricing: 'Price',
    pane1_title: '📸 Take Photo or Upload Image',
    pane1_sub: 'Open device camera or select a photograph from your gallery',
    wiz_preset_lbl: 'Quick Sample Crafts (1-Tap):',
    next_step_ai: 'Next: AI Studio Enhancement ➔',
    pane2_title: '✨ Gemini AI Studio Image Enhancement',
    pane2_sub: 'Workshop clutter removed, studio highlights balanced, and 1:1 e-commerce ready',
    next_step_voice: 'Next: Voice Storytelling ➔',
    pane3_title: '🎙️ Speak in Your Native Language (Voice-First)',
    pane3_sub: 'Tap mic and describe your craft. AI will generate SEO titles and stories automatically.',
    next_step_pricing: 'Next: Fair-Trade Pricing ➔'
  }
};

// Navigation with History Stack
const navigationHistory = [];

function navigateTo(screenId, isBack = false) {
  if (!isBack && state.currentScreen && state.currentScreen !== screenId) {
    navigationHistory.push(state.currentScreen);
  }
  document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Universal Header Back Button
    const headerBackBtn = document.getElementById('headerBackBtn');
    if (headerBackBtn) {
      if (screenId === 'screen-language') {
        headerBackBtn.classList.add('hidden');
      } else {
        headerBackBtn.classList.remove('hidden');
      }
    }
  }
}
window.navigateTo = navigateTo;

function goBack() {
  if (navigationHistory.length > 0) {
    const prev = navigationHistory.pop();
    navigateTo(prev, true);
  } else {
    // Logical fallback map
    const fallbacks = {
      'screen-auth': 'screen-language',
      'screen-profile': 'screen-auth',
      'screen-home': 'screen-profile',
      'screen-camera': 'screen-home',
      'screen-enhancer': 'screen-camera',
      'screen-voice': 'screen-enhancer',
      'screen-review': 'screen-voice',
      'screen-pricing': 'screen-review'
    };
    const target = fallbacks[state.currentScreen] || 'screen-home';
    navigateTo(target, true);
  }
}
window.goBack = goBack;

// Unified Language Switcher: 100% Pure Hindi or 100% Pure English
function setLanguage(lang) {
  state.language = lang;

  // 1. Update Header Segmented Control & Global Navbar Language Control
  const btnHi = document.getElementById('btnLangHi');
  const btnEn = document.getElementById('btnLangEn');
  if (btnHi && btnEn) {
    btnHi.classList.toggle('active', lang === 'hi');
    btnEn.classList.toggle('active', lang === 'en');
  }
  const btnGlobalHi = document.getElementById('btnGlobalLangHi');
  const btnGlobalEn = document.getElementById('btnGlobalLangEn');
  if (btnGlobalHi && btnGlobalEn) {
    btnGlobalHi.classList.toggle('active', lang === 'hi');
    btnGlobalEn.classList.toggle('active', lang === 'en');
  }

  // 2. Legacy Toggle Text if present
  const toggleText = document.getElementById('langToggleText');
  if (toggleText) {
    toggleText.textContent = (lang === 'hi') ? 'English' : 'हिंदी';
  }

  // 3. Update Screen 1 Language Selection Cards
  document.querySelectorAll('.lang-card').forEach(card => {
    const isSelected = card.dataset.lang === lang;
    card.classList.toggle('active', isSelected);
    const radio = card.querySelector('.check-radio');
    if (radio) radio.textContent = isSelected ? '✓' : '';
  });

  // 4. Update ALL DOM elements with [data-i18n]
  const dict = i18n[lang] || i18n.hi;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // 5. Update Elements with [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 6. Update Dynamic Form Placeholders & Input Texts
  const hoursVal = document.getElementById('valHoursSpent');
  if (hoursVal) {
    hoursVal.textContent = lang === 'en' ? `${state.hoursSpent} hours` : `${state.hoursSpent} घंटे`;
  }

  const micHint = document.getElementById('micPromptText');
  if (micHint && !micHint.classList.contains('recording')) {
    micHint.textContent = dict.tap_speak;
  }

  // 7. Update Profile defaults if untouched
  const nameInput = document.getElementById('inputArtisanName');
  if (nameInput) {
    if (nameInput.value === 'Radha Devi (राधा देवी)' || nameInput.value === 'Radha Devi' || nameInput.value === 'राधा देवी') {
      nameInput.value = lang === 'en' ? 'Radha Devi' : 'राधा देवी';
    }
  }
  const locInput = document.getElementById('inputArtisanLocation');
  if (locInput) {
    if (locInput.value === 'Varanasi, Uttar Pradesh' || locInput.value === 'वाराणसी, उत्तर प्रदेश') {
      locInput.value = lang === 'en' ? 'Varanasi, Uttar Pradesh' : 'वाराणसी, उत्तर प्रदेश';
    }
  }

  // 8. Re-render product catalogs in chosen language
  renderProductsGrid();
  if (typeof renderMarketplace === 'function') renderMarketplace();
  if (typeof renderStudioInventory === 'function') renderStudioInventory();
  if (typeof renderCart === 'function') renderCart();
}
window.setLanguage = setLanguage;

// 1. Language Listeners (Header Segmented Control + Cards + Global Navbar)
document.getElementById('btnLangHi')?.addEventListener('click', () => setLanguage('hi'));
document.getElementById('btnLangEn')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('btnGlobalLangHi')?.addEventListener('click', () => setLanguage('hi'));
document.getElementById('btnGlobalLangEn')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('langCardHi')?.addEventListener('click', () => setLanguage('hi'));
document.getElementById('langCardEn')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('langToggleBtn')?.addEventListener('click', () => {
  setLanguage(state.language === 'hi' ? 'en' : 'hi');
});
document.getElementById('btnContinueLanguage')?.addEventListener('click', () => navigateTo('screen-auth'));

// 2. Auth Flow Listeners
document.getElementById('btnRequestOtp').addEventListener('click', async () => {
  const phone = document.getElementById('inputPhone').value.trim();
  try {
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: `+91${phone}` })
    });
    const data = await res.json();
    document.getElementById('groupPhone').classList.add('hidden');
    document.getElementById('groupOtp').classList.remove('hidden');
  } catch (err) {
    document.getElementById('groupPhone').classList.add('hidden');
    document.getElementById('groupOtp').classList.remove('hidden');
  }
});

document.getElementById('btnChangePhone').addEventListener('click', () => {
  document.getElementById('groupOtp').classList.add('hidden');
  document.getElementById('groupPhone').classList.remove('hidden');
});

document.getElementById('btnVerifyOtp').addEventListener('click', async () => {
  const phone = document.getElementById('inputPhone').value.trim();
  const otp = document.getElementById('inputOtp').value.trim();
  try {
    await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: `+91${phone}`, otp })
    });
  } catch (e) {}
  navigateTo('screen-profile');
});

// 3. Profile Setup Listeners
document.querySelectorAll('.craft-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.craft-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.selectedCraft = chip.dataset.craft;
  });
});

document.getElementById('btnSaveProfile').addEventListener('click', () => {
  loadProducts();
  navigateTo('screen-home');
});

// 4. Products & Catalog
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (data.success && Array.isArray(data.products)) {
      state.products = data.products;
      const cnt = document.getElementById('statProductCount');
      if (cnt) cnt.textContent = state.products.length;
      renderProductsGrid();
      if (typeof renderMarketplace === 'function') renderMarketplace();
      if (typeof renderStudioInventory === 'function') renderStudioInventory();
    }
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const isEn = state.language === 'en';

  const filtered = state.activeFilter === 'all'
    ? state.products
    : state.activeFilter === 'paintings'
      ? state.products.filter(p => (p.category && p.category.toLowerCase().includes('paint')) || (p.title_en && p.title_en.toLowerCase().includes('paint')))
      : state.activeFilter === 'pottery'
        ? state.products.filter(p => (p.category && p.category.toLowerCase().includes('pot')) || (p.title_en && (p.title_en.toLowerCase().includes('pot') || p.title_en.toLowerCase().includes('clay') || p.title_en.toLowerCase().includes('vase') || (p.title_hi && (p.title_hi.includes('मटका') || p.title_hi.includes('मिट्टी'))))))
        : state.activeFilter === 'fiber'
          ? state.products.filter(p => (p.category && (p.category.toLowerCase().includes('fiber') || p.category.toLowerCase().includes('grass'))) || (p.title_en && (p.title_en.toLowerCase().includes('mat') || p.title_en.toLowerCase().includes('grass') || (p.title_hi && p.title_hi.includes('चटाई')))))
          : state.activeFilter === 'cottage'
            ? state.products.filter(p => (p.category && p.category.toLowerCase().includes('cottage')) || (p.title_en && (p.title_en.toLowerCase().includes('basket') || p.title_en.toLowerCase().includes('cottage') || p.title_en.toLowerCase().includes('sabai') || (p.title_hi && p.title_hi.includes('कुटीर')))))
            : state.activeFilter === 'textiles'
              ? state.products.filter(p => (p.category && p.category.toLowerCase().includes('textil')) || (p.title_en && (p.title_en.toLowerCase().includes('saree') || p.title_en.toLowerCase().includes('dupatta') || p.title_en.toLowerCase().includes('silk'))))
              : state.products.filter(p => p.status === state.activeFilter);

  if (filtered.length === 0) {
    const emptyMsg = isEn ? 'No craft items found' : 'कोई कलाकृति नहीं मिली';
    grid.innerHTML = `<div style="grid-column: span 2; text-align: center; padding: 30px; color: #718096;">
      <p style="font-size: 32px;">🎨</p>
      <p><strong>${emptyMsg}</strong></p>
    </div>`;
    return;
  }

  const wallPreviewText = isEn ? '🖼️ Wall Preview' : '🖼️ वॉल प्रीव्यू';
  const coaText = isEn ? '📜 Certificate' : '📜 प्रमाणपत्र';

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const title = (isEn || !p.title_hi) ? p.title_en : p.title_hi;
    const imgSrc = p.enhanced_image_url || p.raw_image_url || '/uploads/sample_enhanced_1.jpg';
    const isPainting = (p.category && p.category.toLowerCase().includes('paint')) || (p.title_en && p.title_en.toLowerCase().includes('paint'));
    const statusLabel = isEn 
      ? (p.status === 'published' ? 'PUBLISHED' : 'DRAFT')
      : (p.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट');

    const paintingButtons = isPainting
      ? `<div class="painting-actions-row">
          <button class="btn-card-action btn-card-room" onclick="window.openWallVisualizer('${imgSrc}', '${p.title_en.replace(/'/g, "\\'")}', '${p.price}')">${wallPreviewText}</button>
          <button class="btn-card-action btn-card-coa" onclick="window.openCoaModal('${p.id}')">${coaText}</button>
         </div>`
      : '';

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${imgSrc}" alt="${title}" onerror="this.src='/uploads/sample_enhanced_1.svg'" />
        <span class="badge-studio">✨ AI Studio</span>
        <span class="badge-status">${statusLabel}</span>
      </div>
      <div class="product-info-box">
        <div class="product-title">${title}</div>
        <div class="product-price-row">
          <span class="product-price">₹${Math.round(p.price)}</span>
          <span class="product-views">👁️ ${p.views || 89}</span>
        </div>
        ${paintingButtons}
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeFilter = btn.dataset.filter;
    renderProductsGrid();
  });
});

document.getElementById('btnStartDigitize').addEventListener('click', () => {
  navigateTo('screen-camera');
});

// 5. Camera, Real Studio Image Enhancement & Shutter
document.getElementById('btnBackFromCam').addEventListener('click', () => navigateTo('screen-home'));

// Real HTML5 Canvas Studio Enhancer Engine
async function generateStudioEnhancedCanvas(rawSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 600;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // 1. Studio Lighting Radial Gradient (Eliminates messy workshop backgrounds)
        const grad = ctx.createRadialGradient(size / 2, size * 0.42, 50, size / 2, size * 0.42, size * 0.72);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.65, '#F7FAFC');
        grad.addColorStop(1, '#EDF2F7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // 2. Soft Studio Pedestal / Tabletop Shadow
        ctx.save();
        ctx.fillStyle = 'rgba(160, 174, 192, 0.42)';
        ctx.beginPath();
        ctx.ellipse(size / 2, size * 0.78, size * 0.36, size * 0.045, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Draw Enhanced Subject with balanced contrast, brightness & studio sheen
        ctx.save();
        ctx.filter = 'brightness(1.10) contrast(1.22) saturate(1.25) drop-shadow(0 14px 28px rgba(0,0,0,0.18))';

        const maxDim = 450;
        let w = img.width || 450;
        let h = img.height || 450;
        if (w > h) {
          h = (h / w) * maxDim;
          w = maxDim;
        } else {
          w = (w / h) * maxDim;
          h = maxDim;
        }
        const x = (size - w) / 2;
        const y = Math.max(30, size * 0.74 - h);
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();

        // 4. Studio Guarantee Badge Accent
        ctx.save();
        ctx.fillStyle = '#2B6CB0';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(size - 186, 24, 162, 34, 17);
        } else {
          ctx.rect(size - 186, 24, 162, 34);
        }
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨ AI STUDIO READY', size - 105, 41);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        console.warn('[Studio Enhancer] Canvas processing fallback:', err);
        resolve(rawSrc);
      }
    };

    img.onerror = () => resolve('/uploads/sample_enhanced_1.svg');
    img.src = rawSrc;
  });
}

async function processCapturedImage(fileOrMock) {
  try {
    let rawUrl = '/uploads/sample_raw_1.svg';
    let enhancedUrl = '/uploads/sample_enhanced_1.svg';

    if (fileOrMock instanceof File) {
      // 1. Read file as Data URL for instant, reliable display in imgRaw
      const reader = new FileReader();
      const rawDataUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(fileOrMock);
      });
      rawUrl = rawDataUrl;

      // 2. Generate client-side studio enhancement on HTML5 Canvas
      enhancedUrl = await generateStudioEnhancedCanvas(rawDataUrl);

      // 3. Upload to server asynchronously for persistence
      const formData = new FormData();
      formData.append('image', fileOrMock);
      fetch(`${API_BASE}/ai/image-enhance`, { method: 'POST', body: formData }).catch(e => console.warn(e));
    }

    state.capturedImage = { rawUrl, enhancedUrl };
    document.getElementById('imgRaw').src = rawUrl;
    document.getElementById('imgEnhanced').src = enhancedUrl;

    // Reset slider to 50%
    if (compareSlider) compareSlider.value = 50;
    if (compAfter) compAfter.style.clipPath = 'inset(0 0 0 50%)';
    const divider = document.getElementById('sliderDividerLine');
    if (divider) divider.style.left = '50%';

    navigateTo('screen-enhancer');
  } catch (e) {
    console.warn('Image processing error:', e);
    navigateTo('screen-enhancer');
  }
}

const CRAFT_SAMPLES = {
  pot: {
    craft: 'Pottery',
    matCost: 240,
    hours: 7,
    price: 850,
    catalog: {
      title_en: 'Handcrafted Terracotta Water Pot (Matka)',
      title_hi: 'मिट्टी का नक्काशीदार पारंपरिक जल पात्र (मटका)',
      description_en: 'Handcrafted unglazed terracotta clay pot with traditional etched floral neck patterns. Naturally keeps water cool through porous micro-evaporation.',
      description_hi: 'पारंपरिक नक्काशीदार प्राकृतिक लाल मिट्टी का मटका। सूक्ष्म वाष्पीकरण से जल को स्वाभाविक रूप से ठंडा व शुद्ध रखने वाला।',
      category: 'Pottery'
    },
    images: {
      rawUrl: '/uploads/sample_terracotta_pot_raw.svg',
      enhancedUrl: '/uploads/sample_terracotta_pot_enhanced.svg'
    }
  },
  clay: {
    craft: 'Pottery',
    matCost: 180,
    hours: 5,
    price: 650,
    catalog: {
      title_en: 'Terracotta Chai Kulhad & Tableware Set (Set of 6)',
      title_hi: 'पारंपरिक मिट्टी के कुल्हड़ व पात्र सेट',
      description_en: 'Set of authentic kiln-baked terracotta clay kulhad tea cups and clay serving pots with lid. Enhances chai aroma with natural earthy notes.',
      description_hi: 'पारंपरिक भट्टी में पके मिट्टी के कुल्हड़ और ढक्कनदार पात्रों का सेट। चाय की सोंधी खुशबू व प्राकृतिक स्वाद से भरपूर।',
      category: 'Pottery'
    },
    images: {
      rawUrl: '/uploads/sample_clay_items_raw.svg',
      enhancedUrl: '/uploads/sample_clay_items_enhanced.svg'
    }
  },
  mat: {
    craft: 'Fiber',
    matCost: 450,
    hours: 14,
    price: 1450,
    catalog: {
      title_en: 'Handwoven Natural River Grass Floor Mat (Madur Chatai)',
      title_hi: 'पारंपरिक हस्तनिर्मित मादुर घास फर्श चटाई',
      description_en: 'Eco-friendly handwoven Madur Kathi river grass floor mat with traditional geometric borders. Breathable, cooling, organic, and long-lasting.',
      description_hi: 'प्राकृतिक मादुर काठी नदी घास से बुनी पारंपरिक फर्श चटाई, बारीक ज्यामितीय बॉर्डर के साथ। ग्रीष्मकालीन शीतलता प्रदायक व टिकाऊ।',
      category: 'Fiber'
    },
    images: {
      rawUrl: '/uploads/sample_grass_mat_raw.svg',
      enhancedUrl: '/uploads/sample_grass_mat_enhanced.svg'
    }
  },
  cottage: {
    craft: 'Cottage',
    matCost: 320,
    hours: 9,
    price: 1150,
    catalog: {
      title_en: 'Cottage Industry Handcrafted Sabai Grass Basket',
      title_hi: 'सबाई घास और प्राकृतिक बेंत कॉटेज भंडारण टोकरी',
      description_en: 'Multi-purpose handcrafted cottage storage basket made from braided wild Sabai grass and treated cane with fitted woven lid. Sustainable home utility.',
      description_hi: 'ग्रामीण कुटीर उद्योग द्वारा निर्मित सबाई घास और बेंत की मजबूत ढक्कनदार भंडारण टोकरी। 100% पर्यावरण अनुकूल व बहुउपयोगी।',
      category: 'Cottage'
    },
    images: {
      rawUrl: '/uploads/sample_cottage_basket_raw.svg',
      enhancedUrl: '/uploads/sample_cottage_basket_enhanced.svg'
    }
  },
  textile: {
    craft: 'Textiles',
    matCost: 950,
    hours: 16,
    price: 2450,
    catalog: {
      title_en: 'Banarasi Kadwa Pure Silk Dupatta',
      title_hi: 'बनारसी कड़वा शुद्ध सिल्क दुपट्टा',
      description_en: 'Hand-woven pure mulberry silk dupatta with delicate floral gold zari motifs along the border.',
      description_hi: 'शुद्ध शहतूत रेशम पर हाथ से बुना पारंपरिक दुपट्टा, किनारों पर सोने की बारीक जरी का काम।',
      category: 'Textiles'
    },
    images: {
      rawUrl: '/uploads/sample_raw_1.svg',
      enhancedUrl: '/uploads/sample_enhanced_1.svg'
    }
  },
  painting: {
    craft: 'Paintings',
    matCost: 650,
    hours: 18,
    price: 3450,
    catalog: {
      title_en: 'Mithila Tree of Life (Madhubani Folk Painting on Canvas)',
      title_hi: 'मिथिला जीवन वृक्ष (पारंपरिक मधुबनी लोक चित्रकला)',
      description_en: 'Hand-painted with fine bamboo twigs and natural mineral pigments on organic khadi canvas. Portrays the sacred Tree of Life and Matsya symbols of abundance.',
      description_hi: 'प्राकृतिक वानस्पतिक रंगों व बारीक बांस की तीली से खादी कैनवास पर निर्मित। जीवन वृक्ष व मत्स्य समृद्धि के प्रतीक।',
      category: 'Paintings'
    },
    images: {
      rawUrl: '/uploads/sample_painting_raw.svg',
      enhancedUrl: '/uploads/sample_painting_enhanced.svg'
    }
  }
};

function selectCraftSample(sampleKey) {
  const s = CRAFT_SAMPLES[sampleKey] || CRAFT_SAMPLES.pot;
  state.selectedCraft = s.craft;
  state.materialCost = s.matCost;
  state.hoursSpent = s.hours;
  state.calculatedPrice = s.price;
  state.catalogData = { ...s.catalog };
  state.capturedImage = { ...s.images };

  document.getElementById('imgRaw').src = state.capturedImage.rawUrl;
  document.getElementById('imgEnhanced').src = state.capturedImage.enhancedUrl;

  if (compareSlider) compareSlider.value = 50;
  if (compAfter) compAfter.style.clipPath = 'inset(0 0 0 50%)';
  const divider = document.getElementById('sliderDividerLine');
  if (divider) divider.style.left = '50%';

  navigateTo('screen-enhancer');
}

// Quick Sample Buttons Wiring
const btnSamplePot = document.getElementById('btnSamplePot');
if (btnSamplePot) btnSamplePot.addEventListener('click', () => selectCraftSample('pot'));

const btnSampleClay = document.getElementById('btnSampleClay');
if (btnSampleClay) btnSampleClay.addEventListener('click', () => selectCraftSample('clay'));

const btnSampleMat = document.getElementById('btnSampleMat');
if (btnSampleMat) btnSampleMat.addEventListener('click', () => selectCraftSample('mat'));

const btnSampleCottage = document.getElementById('btnSampleCottage');
if (btnSampleCottage) btnSampleCottage.addEventListener('click', () => selectCraftSample('cottage'));

const btnSampleSnap = document.getElementById('btnSampleSnap');
if (btnSampleSnap) btnSampleSnap.addEventListener('click', () => selectCraftSample('textile'));

const btnSamplePaintingSnap = document.getElementById('btnSamplePaintingSnap');
if (btnSamplePaintingSnap) btnSamplePaintingSnap.addEventListener('click', () => selectCraftSample('painting'));

// Cycle Button (🔄)
let cycleIndex = 0;
const sampleKeys = ['pot', 'clay', 'mat', 'cottage', 'textile', 'painting'];
const btnCycleSample = document.getElementById('btnCycleSample');
if (btnCycleSample) {
  btnCycleSample.addEventListener('click', () => {
    cycleIndex = (cycleIndex + 1) % sampleKeys.length;
    selectCraftSample(sampleKeys[cycleIndex]);
  });
}

window.selectCraftSample = selectCraftSample;

document.getElementById('btnShutter').addEventListener('click', () => selectCraftSample('pot'));

document.getElementById('fileImagePicker').addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    processCapturedImage(e.target.files[0]);
  }
});

// 6. Before / After Comparison Slider with Visual Divider
const compareSlider = document.getElementById('compareSlider');
const compAfter = document.getElementById('compAfter');
const sliderDividerLine = document.getElementById('sliderDividerLine');

if (compareSlider && compAfter) {
  compareSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    compAfter.style.clipPath = `inset(0 0 0 ${val}%)`;
    if (sliderDividerLine) {
      sliderDividerLine.style.left = `${val}%`;
    }
  });
}

document.getElementById('btnAcceptEnhanced').addEventListener('click', () => navigateTo('screen-voice'));
document.getElementById('btnRetakePhoto').addEventListener('click', () => navigateTo('screen-camera'));

// 7. Voice Recording & Real Speech Recognition
let isRecording = false;
let recordTimer = null;
let recordSeconds = 0;
let speechRecognizer = null;
let liveTranscript = '';
let mediaStream = null;
let mediaRecorder = null;
let recordedAudioChunks = [];
let recordedAudioBlob = null;

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  try {
    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = state.language === 'hi' ? 'hi-IN' : 'en-IN';

    recognizer.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) liveTranscript += final;
      const current = (liveTranscript + ' ' + interim).trim();
      const box = document.getElementById('liveTranscriptBox');
      const txt = document.getElementById('liveTranscriptText');
      if (box && txt && current) {
        box.classList.remove('hidden');
        txt.textContent = `"${current}"`;
      }
    };

    recognizer.onerror = (e) => {
      console.warn('SpeechRecognition warning:', e.error);
    };

    return recognizer;
  } catch (err) {
    console.warn('SpeechRecognition init error:', err);
    return null;
  }
}

const btnBigMic = document.getElementById('btnBigMic');
const micTimer = document.getElementById('micTimer');
const micPromptText = document.getElementById('micPromptText');

btnBigMic.addEventListener('click', async () => {
  if (!isRecording) {
    // START RECORDING
    isRecording = true;
    btnBigMic.classList.add('recording');
    recordSeconds = 0;
    liveTranscript = '';
    recordedAudioChunks = [];
    recordedAudioBlob = null;

    const liveBox = document.getElementById('liveTranscriptBox');
    const liveTxt = document.getElementById('liveTranscriptText');
    if (liveBox && liveTxt) {
      liveBox.classList.remove('hidden');
      liveTxt.textContent = state.language === 'hi' ? 'बोलिए, हम सुन रहे हैं...' : 'Speak now, listening...';
    }

    micPromptText.textContent = state.language === 'hi' ? 'सुन रहे हैं... समाप्त करने के लिए टैप करें' : 'Listening... Tap to finish';

    // Start Visual Timer
    recordTimer = setInterval(() => {
      recordSeconds++;
      const s = recordSeconds.toString().padStart(2, '0');
      micTimer.textContent = `00:${s}`;
    }, 1000);

    // 1. Start Browser Speech Recognition
    try {
      speechRecognizer = setupSpeechRecognition();
      if (speechRecognizer) {
        speechRecognizer.start();
      }
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
    }

    // 2. Start Real Microphone Stream & MediaRecorder
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedAudioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          recordedAudioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
        };
        mediaRecorder.start(250);
      }
    } catch (err) {
      console.warn('MediaRecorder error or permission denied:', err);
    }

  } else {
    // STOP RECORDING & CALL AI CATALOG
    clearInterval(recordTimer);
    isRecording = false;
    btnBigMic.classList.remove('recording');
    micPromptText.textContent = state.language === 'hi' ? 'बोलने के लिए माइक दबाएं' : 'Tap Mic to Speak';

    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch (e) {}
    }

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (e) {}
    }

    if (mediaStream) {
      try {
        mediaStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
    }

    // Brief delay to allow recognition buffer to flush
    setTimeout(() => {
      executeVoiceCataloging(liveTranscript.trim());
    }, 400);
  }
});

document.getElementById('btnDemoVoice').addEventListener('click', () => {
  const sample = state.language === 'hi'
    ? 'यह शुद्ध रेशम पर हाथ से बुना पारंपरिक बनारसी दुपट्टा है, जिसमें सोने की जरी का काम किया गया है।'
    : 'This is a hand-woven pure mulberry silk dupatta with delicate golden zari motifs.';
  executeVoiceCataloging(sample);
});

async function executeVoiceCataloging(spokenTranscript = '') {
  document.getElementById('voiceProcessingBox').classList.remove('hidden');
  try {
    const formData = new FormData();
    formData.append('language', state.language);
    formData.append('transcript', spokenTranscript);
    formData.append('craft_type', state.selectedCraft || '');
    if (recordedAudioBlob) {
      formData.append('audio', recordedAudioBlob, 'voice.webm');
    }

    const res = await fetch(`${API_BASE}/ai/catalog`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      state.catalogData = data;
      document.getElementById('reviewTitleHi').value = data.title_hi;
      document.getElementById('reviewTitleEn').value = data.title_en;
      document.getElementById('reviewDescHi').value = data.description_hi;
      document.getElementById('reviewDescEn').value = data.description_en;

      // Update Spoken Words banner
      const wordsEl = document.getElementById('spokenTranscriptWords');
      if (wordsEl) {
        wordsEl.textContent = `"${data.transcript || spokenTranscript || (state.language === 'hi' ? 'हस्तशिल्प उत्पाद विवरण' : 'Artisan craft description')}"`;
      }
    }
  } catch (err) {
    console.warn('Voice catalog error:', err);
  } finally {
    document.getElementById('voiceProcessingBox').classList.add('hidden');
    navigateTo('screen-review');
  }
}

// 8. Review Screen & Literacy TTS Read-Back
document.getElementById('btnPlayTts').addEventListener('click', () => {
  const textToRead = state.language === 'hi'
    ? document.getElementById('reviewTitleHi').value + '. ' + document.getElementById('reviewDescHi').value
    : document.getElementById('reviewTitleEn').value + '. ' + document.getElementById('reviewDescEn').value;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = state.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
  showToast(state.language === 'hi' ? '📢 ऑडियो विवरण सुनाया जा रहा है...' : '📢 Playing audio description...', 'info');
});

document.getElementById('btnGoToPricing').addEventListener('click', () => {
  state.catalogData.title_hi = document.getElementById('reviewTitleHi').value;
  state.catalogData.title_en = document.getElementById('reviewTitleEn').value;
  state.catalogData.description_hi = document.getElementById('reviewDescHi').value;
  state.catalogData.description_en = document.getElementById('reviewDescEn').value;
  calculatePricing();
  navigateTo('screen-pricing');
});

// 9. Dynamic Pricing Assistant
document.getElementById('btnMatMinus').addEventListener('click', () => {
  if (state.materialCost > 50) {
    state.materialCost -= 50;
    updatePricingInputs();
    calculatePricing();
  }
});
document.getElementById('btnMatPlus').addEventListener('click', () => {
  state.materialCost += 50;
  updatePricingInputs();
  calculatePricing();
});

document.getElementById('btnHoursMinus').addEventListener('click', () => {
  if (state.hoursSpent > 1) {
    state.hoursSpent -= 1;
    updatePricingInputs();
    calculatePricing();
  }
});
document.getElementById('btnHoursPlus').addEventListener('click', () => {
  state.hoursSpent += 1;
  updatePricingInputs();
  calculatePricing();
});

function updatePricingInputs() {
  document.getElementById('valMaterialCost').textContent = `₹${state.materialCost}`;
  document.getElementById('valHoursSpent').textContent = state.language === 'en'
    ? `${state.hoursSpent} hours`
    : `${state.hoursSpent} घंटे`;
}

async function calculatePricing() {
  try {
    const res = await fetch(`${API_BASE}/ai/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: state.selectedCraft,
        material_cost: state.materialCost,
        hours_spent: state.hoursSpent,
        title_en: state.catalogData.title_en
      })
    });
    const data = await res.json();
    if (data.success) {
      state.calculatedPrice = data.suggested_price;
      document.getElementById('displaySuggestedPrice').textContent = `₹${data.suggested_price}`;
      const rangePrefix = state.language === 'en' ? 'Market Range:' : 'बाजार दायरा:';
      document.getElementById('displayMarketRange').textContent = `${rangePrefix} ₹${data.suggested_min} – ₹${data.suggested_max}`;
      document.getElementById('displayJustification').textContent = (state.language === 'hi' && data.justification_hi)
        ? data.justification_hi
        : data.justification;

      const slider = document.getElementById('priceAdjustSlider');
      slider.min = Math.round(data.suggested_min * 0.8);
      slider.max = Math.round(data.suggested_max * 1.3);
      slider.value = data.suggested_price;
      document.getElementById('sliderPriceLabel').textContent = `₹${data.suggested_price}`;
    }
  } catch (err) {
    console.error('Pricing error:', err);
  }
}

document.getElementById('priceAdjustSlider').addEventListener('input', (e) => {
  state.calculatedPrice = parseInt(e.target.value, 10);
  document.getElementById('displaySuggestedPrice').textContent = `₹${state.calculatedPrice}`;
  document.getElementById('sliderPriceLabel').textContent = `₹${state.calculatedPrice}`;
});

document.getElementById('btnPublishProduct').addEventListener('click', () => saveProduct('published'));
document.getElementById('btnSaveDraft').addEventListener('click', () => saveProduct('draft'));

async function saveProduct(status) {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_en: state.catalogData.title_en,
        title_hi: state.catalogData.title_hi,
        description_en: state.catalogData.description_en,
        description_hi: state.catalogData.description_hi,
        raw_image_url: state.capturedImage.rawUrl,
        enhanced_image_url: state.capturedImage.enhancedUrl,
        price: state.calculatedPrice,
        category: state.selectedCraft,
        material_cost: state.materialCost,
        hours_spent: state.hoursSpent,
        status: status
      })
    });
    await res.json();
    const pubMsg = state.language === 'en' ? '🎉 Craft successfully published to the catalog!' : '🎉 शिल्प कैटलॉग में सफलतापूर्वक प्रकाशित हुआ!';
    const draftMsg = state.language === 'en' ? 'Draft saved successfully!' : 'ड्राफ्ट सहेज लिया गया!';
    showToast(status === 'published' ? pubMsg : draftMsg, 'success');
    await loadProducts();
    navigateTo('screen-home');
  } catch (err) {
    showToast(state.language === 'en' ? 'Product saved!' : 'उत्पाद सहेजा गया!', 'success');
    loadProducts();
    navigateTo('screen-home');
  }
}

// WhatsApp 1-Click Catalog Sharing
const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
if (btnShareWhatsApp) {
  btnShareWhatsApp.addEventListener('click', () => {
    const isEn = state.language === 'en';
    const title = isEn ? state.catalogData.title_en : state.catalogData.title_hi;
    const price = state.calculatedPrice;
    const desc = isEn ? state.catalogData.description_en : state.catalogData.description_hi;
    
    const text = isEn
      ? `🎨 *${title}*\n🏷️ Fair-Trade Artisan Price: ₹${price}\n✨ Certified Handcrafted on *kalaSetu*\n\n"${desc}"\n\nVerified Digital Catalog: https://kalasetu.gov.in/p/${Date.now().toString(36)}`
      : `🎨 *${title}*\n🏷️ उचित शिल्पी मूल्य: ₹${price}\n✨ *कला सेतु* द्वारा प्रमाणित पारंपरिक हस्तशिल्प\n\n"${desc}"\n\nसत्यापित डिजिटल कैटलॉग: https://kalasetu.gov.in/p/${Date.now().toString(36)}`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(isEn ? '💬 WhatsApp sharing link opened!' : '💬 व्हाट्सएप शेयरिंग लिंक खुल गया!', 'whatsapp');
  });
}

// 10. GeM Modal
const gemModal = document.getElementById('gemModal');
function openGeMModal() {
  gemModal.classList.remove('hidden');
}
function closeGeMModal() {
  gemModal.classList.add('hidden');
}
window.openGeMModal = openGeMModal;

document.getElementById('headerGemBtn').addEventListener('click', openGeMModal);
document.getElementById('dashGemTag').addEventListener('click', openGeMModal);
document.getElementById('btnCloseGem').addEventListener('click', closeGeMModal);
document.getElementById('btnDoGemSync').addEventListener('click', () => {
  const msg = state.language === 'en'
    ? '🏛️ Your craft catalog has been successfully synced with the Government e-Marketplace (GeM) and ODOP portal!'
    : '🏛️ आपके उत्पाद GeM पोर्टल और ODOP कैटलॉग से सफलतापूर्वक सिंक कर दिए गए हैं!';
  showToast(msg, 'success');
  closeGeMModal();
});

// 11. Wall Art Room Visualizer Controller
let currentArtBasePrice = 3450;
let currentFrameSurcharge = 600; // Teak default

const roomVisualizerModal = document.getElementById('roomVisualizerModal');
const mountedArtwork = document.getElementById('mountedArtwork');
const visualizerArtImg = document.getElementById('visualizerArtImg');
const roomStage = document.getElementById('roomStage');
const visualizerTotalPrice = document.getElementById('visualizerTotalPrice');
const visualizerTitle = document.getElementById('visualizerTitle');

function openWallVisualizer(imgUrl, title, basePrice) {
  if (!roomVisualizerModal) return;
  currentArtBasePrice = parseFloat(basePrice) || 3450;
  if (visualizerArtImg) visualizerArtImg.src = imgUrl || '/uploads/sample_painting_enhanced.jpg';
  const suffix = state.language === 'en' ? 'Wall Preview' : 'वॉल प्रीव्यू';
  if (visualizerTitle && title) visualizerTitle.textContent = `${title} - ${suffix}`;
  updateVisualizerTotal();
  roomVisualizerModal.classList.remove('hidden');
}
window.openWallVisualizer = openWallVisualizer;

function closeWallVisualizer() {
  if (roomVisualizerModal) roomVisualizerModal.classList.add('hidden');
}
window.closeWallVisualizer = closeWallVisualizer;

document.getElementById('btnCloseVisualizer')?.addEventListener('click', closeWallVisualizer);

const frameStyles = {
  teak: { border: '14px solid #633B19', shadow: '0 16px 36px rgba(0,0,0,0.38)', surcharge: 600 },
  gold: { border: '14px solid #D4AF37', shadow: '0 18px 40px rgba(212,175,55,0.4)', surcharge: 850 },
  black: { border: '12px solid #1A202C', shadow: '0 12px 28px rgba(0,0,0,0.32)', surcharge: 500 },
  canvas: { border: '4px solid #FAF5EE', shadow: '0 8px 22px rgba(0,0,0,0.22)', surcharge: 0 }
};

document.querySelectorAll('.frame-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.frame-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const frameKey = pill.dataset.frame || 'teak';
    const conf = frameStyles[frameKey] || frameStyles.teak;
    if (mountedArtwork) {
      mountedArtwork.style.border = conf.border;
      mountedArtwork.style.boxShadow = conf.shadow;
    }
    currentFrameSurcharge = conf.surcharge;
    updateVisualizerTotal();
  });
});

document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    const color = dot.dataset.color || '#FAF8F5';
    if (roomStage) roomStage.style.backgroundColor = color;
  });
});

function updateVisualizerTotal() {
  if (visualizerTotalPrice) {
    const total = currentArtBasePrice + currentFrameSurcharge;
    visualizerTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
  }
}

document.getElementById('btnOrderFramedArt')?.addEventListener('click', () => {
  const msg = state.language === 'en'
    ? '🎨 Your customized framed artwork order inquiry has been saved!'
    : '🎨 आपकी फ्रेम की गई पेंटिंग सफलतापूर्वक ऑर्डर सूची में जोड़ दी गई है!';
  showToast(msg, 'success');
  closeWallVisualizer();
});

// 12. Certificate of Authenticity (COA) Modal Controller
const coaModal = document.getElementById('coaModal');
async function openCoaModal(productId) {
  if (!coaModal) return;
  const isEn = state.language === 'en';
  const prod = state.products.find(p => p.id === productId) || {
    title_en: 'Mithila Tree of Life (Madhubani Folk Painting on Canvas)',
    title_hi: 'मिथिला जीवन वृक्ष (पारंपरिक मधुबनी लोक चित्रकला)',
    artisan_name: isEn ? 'Radha Devi' : 'राधा देवी',
    art_style: isEn ? 'Madhubani (Mithila Art)' : 'मधुबनी (मिथिला कला)',
    medium: isEn ? 'Natural Vegetable & Mineral Dyes on Khadi Canvas' : 'खादी कैनवास पर प्राकृतिक वानस्पतिक एवं खनिज रंग',
    dimensions: '18" × 24"',
    location: isEn ? 'Madhubani, Bihar, India' : 'मधुबनी, बिहार, भारत'
  };

  try {
    const res = await fetch(`${API_BASE}/ai/painting-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    });
    const data = await res.json();
    if (data.success && data.certificate) {
      const c = data.certificate;
      document.getElementById('coaCertId').textContent = `ID: ${c.certificate_id}`;
      document.getElementById('coaArtTitle').textContent = (state.language === 'hi' && prod.title_hi) ? prod.title_hi : c.artwork.title_en;
      document.getElementById('coaArtisanName').textContent = isEn ? 'Radha Devi' : 'राधा देवी';
      document.getElementById('coaArtSchool').textContent = isEn 
        ? `${c.artwork.art_school} • ${c.artwork.region_origin}`
        : 'मधुबनी (मिथिला कला) • बिहार';
      document.getElementById('coaMedium').textContent = isEn 
        ? c.artwork.medium
        : 'खादी कैनवास पर प्राकृतिक वानस्पतिक एवं खनिज रंग';
      document.getElementById('coaDimensions').textContent = c.artwork.dimensions;
      document.getElementById('coaDate').textContent = c.issued_date;
    }
  } catch (e) {
    // Keep pre-filled default
  }

  coaModal.classList.remove('hidden');
}
window.openCoaModal = openCoaModal;

function closeCoaModal() {
  if (coaModal) coaModal.classList.add('hidden');
}
window.closeCoaModal = closeCoaModal;
document.getElementById('btnCloseCoa')?.addEventListener('click', closeCoaModal);

window.printCoa = function() {
  window.print();
};

// ========================================================
// 13. FULL WEB APPLICATION CONTROLLER & MARKETPLACE
// ========================================================

// Portal Switching: 'marketplace' | 'artisan-studio' | 'phone-demo'
function switchPortal(portalName) {
  state.portal = portalName;
  
  // Update Tab Buttons
  document.getElementById('tabMarketplace')?.classList.toggle('active', portalName === 'marketplace');
  document.getElementById('tabArtisanStudio')?.classList.toggle('active', portalName === 'artisan-studio');
  document.getElementById('mobTabMarketplace')?.classList.toggle('active', portalName === 'marketplace');
  document.getElementById('mobTabStudio')?.classList.toggle('active', portalName === 'artisan-studio');
  
  // Toggle Portal Views
  const viewMarketplace = document.getElementById('viewMarketplace');
  const viewStudio = document.getElementById('viewArtisanStudio');
  const viewPhone = document.getElementById('viewPhoneDemo');
  
  if (viewMarketplace) viewMarketplace.classList.toggle('active', portalName === 'marketplace');
  if (viewStudio) viewStudio.classList.toggle('active', portalName === 'artisan-studio');
  if (viewPhone) viewPhone.classList.toggle('active', portalName === 'phone-demo');
  
  if (portalName === 'marketplace') {
    renderMarketplace();
  } else if (portalName === 'artisan-studio') {
    renderStudioInventory();
  }
}
window.switchPortal = switchPortal;

// View Mode Toggle: 'full-app' vs 'phone-sim'
function toggleViewMode() {
  const isSim = document.body.classList.contains('mode-phone-sim');
  const icon = document.getElementById('modeIcon');
  const text = document.getElementById('modeText');
  
  if (isSim) {
    document.body.classList.remove('mode-phone-sim');
    document.body.classList.add('mode-full-app');
    state.viewMode = 'full-app';
    if (icon) icon.textContent = '📱';
    if (text) text.textContent = state.language === 'en' ? 'Phone Demo' : 'फ़ोन डेमो';
    switchPortal(state.portal === 'phone-demo' ? 'marketplace' : state.portal);
    showToast(state.language === 'en' ? '🖥️ Switched to Full Web App Mode' : '🖥️ पूर्ण वेब ऐप मोड सक्रिय', 'info');
  } else {
    document.body.classList.remove('mode-full-app');
    document.body.classList.add('mode-phone-sim');
    state.viewMode = 'phone-sim';
    if (icon) icon.textContent = '🖥️';
    if (text) text.textContent = state.language === 'en' ? 'Full App' : 'पूर्ण ऐप';
    switchPortal('phone-demo');
    showToast(state.language === 'en' ? '📱 Switched to Phone Simulator Mode' : '📱 फ़ोन सिम्युलेटर मोड सक्रिय', 'info');
  }
}
window.toggleViewMode = toggleViewMode;
document.getElementById('btnToggleViewMode')?.addEventListener('click', toggleViewMode);

// Marketplace Rendering
function renderMarketplace() {
  const grid = document.getElementById('marketplaceGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const isEn = state.language === 'en';
  let list = [...state.products];
  
  // Category Filter
  if (state.activeCategory !== 'all') {
    const filter = state.activeCategory;
    if (filter === 'paintings') {
      list = list.filter(p => (p.category && p.category.toLowerCase().includes('paint')) || (p.title_en && p.title_en.toLowerCase().includes('paint')));
    } else if (filter === 'pottery') {
      list = list.filter(p => (p.category && p.category.toLowerCase().includes('pot')) || (p.title_en && (p.title_en.toLowerCase().includes('pot') || p.title_en.toLowerCase().includes('clay') || p.title_en.toLowerCase().includes('vase') || (p.title_hi && (p.title_hi.includes('मटका') || p.title_hi.includes('मिट्टी'))))));
    } else if (filter === 'fiber') {
      list = list.filter(p => (p.category && (p.category.toLowerCase().includes('fiber') || p.category.toLowerCase().includes('grass'))) || (p.title_en && (p.title_en.toLowerCase().includes('mat') || p.title_en.toLowerCase().includes('grass') || (p.title_hi && p.title_hi.includes('चटाई')))));
    } else if (filter === 'cottage') {
      list = list.filter(p => (p.category && p.category.toLowerCase().includes('cottage')) || (p.title_en && (p.title_en.toLowerCase().includes('basket') || p.title_en.toLowerCase().includes('cottage') || p.title_en.toLowerCase().includes('sabai') || (p.title_hi && p.title_hi.includes('कुटीर')))));
    } else if (filter === 'textiles') {
      list = list.filter(p => (p.category && p.category.toLowerCase().includes('textil')) || (p.title_en && (p.title_en.toLowerCase().includes('saree') || p.title_en.toLowerCase().includes('dupatta') || p.title_en.toLowerCase().includes('silk'))));
    }
  }
  
  // GI Tag Only Filter
  if (state.giOnly) {
    list = list.filter(p => {
      const t = ((p.title_en || '') + (p.category || '')).toLowerCase();
      return t.includes('madhubani') || t.includes('banarasi') || t.includes('mithila') || t.includes('terracotta') || t.includes('sabai');
    });
  }
  
  // Search Query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p => 
      (p.title_en && p.title_en.toLowerCase().includes(q)) ||
      (p.title_hi && p.title_hi.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description_en && p.description_en.toLowerCase().includes(q)) ||
      (p.description_hi && p.description_hi.toLowerCase().includes(q))
    );
  }
  
  // Sorting
  if (state.sortOrder === 'price-asc') {
    list.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
  } else if (state.sortOrder === 'price-desc') {
    list.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
  } else if (state.sortOrder === 'hours') {
    list.sort((a, b) => (parseFloat(b.hours_spent) || 0) - (parseFloat(a.hours_spent) || 0));
  }
  
  // Update count
  const countText = document.getElementById('marketplaceCountText');
  if (countText) {
    countText.textContent = isEn ? `${list.length} Crafts Available` : `${list.length} कलाकृतियाँ उपलब्ध`;
  }
  
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #718096;">
      <p style="font-size: 44px; margin-bottom: 12px;">🔍</p>
      <h3>${isEn ? 'No crafts match your search criteria' : 'आपकी खोज के अनुसार कोई कलाकृति नहीं मिली'}</h3>
      <p style="margin-top: 6px;">${isEn ? 'Try clearing filters or search for "silk", "pottery", or "Madhubani".' : 'फ़िल्टर हटाएं या "सिल्क", "मटका" या "मधुबनी" खोजें।'}</p>
    </div>`;
    return;
  }
  
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'marketplace-card';
    const title = (isEn || !p.title_hi) ? p.title_en : p.title_hi;
    const imgSrc = p.enhanced_image_url || p.raw_image_url || '/uploads/sample_enhanced_1.jpg';
    const isPainting = (p.category && p.category.toLowerCase().includes('paint')) || (p.title_en && p.title_en.toLowerCase().includes('paint'));
    const isHomeDecor = isPainting || (p.category && (p.category.toLowerCase().includes('cottage') || p.category.toLowerCase().includes('pot')));
    const matCost = p.material_cost ? `₹${p.material_cost}` : '₹350';
    const hours = p.hours_spent ? `${p.hours_spent} hrs` : '6 hrs';
    const hoursText = isEn ? `${hours} labor` : `${p.hours_spent || 6} घंटे श्रम`;
    const matText = isEn ? `${matCost} raw mat.` : `${matCost} सामग्री`;
    
    const quickViewText = isEn ? 'Quick View' : 'विस्तार देखें';
    const addCartText = isEn ? 'Add to Cart' : 'कार्ट में जोड़ें';
    const wallPreviewText = isEn ? '🖼️ Wall Preview' : '🖼️ वॉल प्रीव्यू';
    const coaText = isEn ? '📜 Certificate' : '📜 प्रमाणपत्र';
    const waText = isEn ? '💬 WhatsApp Order' : '💬 व्हाट्सएप ऑर्डर';
    
    const wallBtn = isHomeDecor 
      ? `<button class="btn-card-vis-sm" onclick="window.openWallVisualizer('${imgSrc}', '${p.title_en.replace(/'/g, "\\'")}', '${p.price}')">${wallPreviewText}</button>`
      : '';
    const coaBtn = `<button class="btn-card-coa-sm" onclick="window.openCoaModal('${p.id}')">${coaText}</button>`;
    
    card.innerHTML = `
      <div class="market-img-wrap" onclick="window.openProductDetail('${p.id}')">
        <img src="${imgSrc}" alt="${title}" onerror="this.src='/uploads/sample_enhanced_1.svg'" />
        <div class="market-badges-strip">
          <span class="badge-studio">✨ AI Studio</span>
          <span class="badge-gi">🏛️ GI Certified</span>
        </div>
      </div>
      <div class="market-card-body">
        <span class="market-cat-tag">${p.category || 'Handicraft'}</span>
        <h3 class="market-card-title" onclick="window.openProductDetail('${p.id}')" title="${title}">${title}</h3>
        <div class="market-artisan-byline">
          <span>👩‍🎨</span>
          <span>${isEn ? 'Radha Devi • Varanasi Cluster' : 'राधा देवी • वाराणसी क्लस्टर'}</span>
        </div>
        <div class="market-breakdown-pill">
          <span>${matText} + ${hoursText}</span>
          <strong>✓ 100% Fair</strong>
        </div>
        <div class="market-price-row">
          <span class="market-price-val">₹${parseFloat(p.price || 0).toLocaleString('en-IN')}</span>
          <span class="market-fair-badge">Fair Trade Verified</span>
        </div>
        <div class="market-card-actions">
          <button class="btn-card-quick" onclick="window.openProductDetail('${p.id}')">👁️ ${quickViewText}</button>
          <button class="btn-card-cart" onclick="window.addToCart('${p.id}')">🛒 ${addCartText}</button>
          <div class="market-full-actions">
            ${wallBtn}
            ${coaBtn}
          </div>
          <button class="btn-card-wa-sm" onclick="window.orderDirectWhatsApp('${p.id}')">${waText}</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
window.renderMarketplace = renderMarketplace;

// Marketplace Category Pills
document.querySelectorAll('.category-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.activeCategory = pill.dataset.filter || 'all';
    renderMarketplace();
  });
});

// Search input
const searchInput = document.getElementById('globalSearchInput');
const clearSearchBtn = document.getElementById('btnClearSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    if (clearSearchBtn) clearSearchBtn.classList.toggle('hidden', !state.searchQuery);
    renderMarketplace();
  });
}
if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderMarketplace();
  });
}

// Sort & GI Checkbox
document.getElementById('sortMarketplace')?.addEventListener('change', (e) => {
  state.sortOrder = e.target.value;
  renderMarketplace();
});
document.getElementById('filterGiOnly')?.addEventListener('change', (e) => {
  state.giOnly = e.target.checked;
  renderMarketplace();
});

// ========================================================
// 14. SHOPPING CART & CHECKOUT CONTROLLER
// ========================================================
function addToCart(productId, qty = 1) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;
  
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    state.cart.push({
      id: prod.id,
      title_en: prod.title_en,
      title_hi: prod.title_hi || prod.title_en,
      price: parseFloat(prod.price || 0),
      image_url: prod.enhanced_image_url || prod.raw_image_url || '/uploads/sample_enhanced_1.jpg',
      category: prod.category || 'Handicraft',
      quantity: qty
    });
  }
  
  updateCartBadge();
  const isEn = state.language === 'en';
  const name = isEn ? prod.title_en : (prod.title_hi || prod.title_en);
  showToast(isEn ? `🛒 Added "${name}" to your cart!` : `🛒 "${name}" कार्ट में जोड़ा गया!`, 'success');
}
window.addToCart = addToCart;

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  updateCartBadge();
  renderCart();
}
window.removeFromCart = removeFromCart;

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartBadge();
    renderCart();
  }
}
window.updateCartQty = updateCartQty;

function updateCartBadge() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.transform = 'scale(1.25)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }
  const mobBadge = document.getElementById('mobCartBadge');
  if (mobBadge) {
    mobBadge.textContent = totalCount;
  }
}

function openCart() {
  renderCart();
  document.getElementById('cartOverlay')?.classList.remove('hidden');
  document.getElementById('cartDrawer')?.classList.remove('hidden');
}
window.openCart = openCart;

function closeCart() {
  document.getElementById('cartOverlay')?.classList.add('hidden');
  document.getElementById('cartDrawer')?.classList.add('hidden');
}
window.closeCart = closeCart;

document.getElementById('btnOpenCart')?.addEventListener('click', openCart);

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;
  container.innerHTML = '';
  
  const isEn = state.language === 'en';
  const subtitle = document.getElementById('cartItemsSubtitle');
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (subtitle) {
    subtitle.textContent = isEn ? `${totalCount} items` : `${totalCount} वस्तुएँ`;
  }
  
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px 20px; color: #718096;">
        <p style="font-size: 48px; margin-bottom: 12px;">🛒</p>
        <h4>${isEn ? 'Your cart is empty' : 'आपकी टोकरी खाली है'}</h4>
        <p style="font-size: 13px; margin-top: 6px;">${isEn ? 'Discover authentic Indian artisan crafts and add them to your cart.' : 'कारीगरों के हस्तशिल्प खोजें और उन्हें कार्ट में जोड़ें।'}</p>
      </div>
    `;
    const st = document.getElementById('cartSubtotal');
    const tp = document.getElementById('cartTotalPrice');
    if (st) st.textContent = '₹0';
    if (tp) tp.textContent = '₹0';
    return;
  }
  
  let subtotal = 0;
  state.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const title = (isEn || !item.title_hi) ? item.title_en : item.title_hi;
    
    const row = document.createElement('div');
    row.className = 'cart-item-card';
    row.innerHTML = `
      <img src="${item.image_url}" alt="${title}" class="cart-item-thumb" onerror="this.src='/uploads/sample_enhanced_1.svg'" />
      <div class="cart-item-meta">
        <h4 class="cart-item-name">${title}</h4>
        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
      </div>
      <div class="cart-qty-ctrl">
        <button class="btn-qty" onclick="window.updateCartQty('${item.id}', -1)">-</button>
        <span style="font-weight: 800; font-size: 13px;">${item.quantity}</span>
        <button class="btn-qty" onclick="window.updateCartQty('${item.id}', 1)">+</button>
      </div>
      <button class="btn-cart-remove" onclick="window.removeFromCart('${item.id}')" title="Remove">🗑️</button>
    `;
    container.appendChild(row);
  });
  
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotalPrice');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

// CHECKOUT MODAL
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast(state.language === 'en' ? 'Your cart is empty!' : 'आपकी टोकरी खाली है!', 'warning');
    return;
  }
  closeCart();
  
  const isEn = state.language === 'en';
  const listContainer = document.getElementById('checkoutItemsList');
  if (listContainer) {
    listContainer.innerHTML = '';
    let total = 0;
    state.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      const title = (isEn || !item.title_hi) ? item.title_en : item.title_hi;
      const itemRow = document.createElement('div');
      itemRow.className = 'checkout-item-mini';
      itemRow.innerHTML = `
        <span>${title} × ${item.quantity}</span>
        <strong>₹${itemTotal.toLocaleString('en-IN')}</strong>
      `;
      listContainer.appendChild(itemRow);
    });
    const finalTot = document.getElementById('chkFinalTotal');
    if (finalTot) finalTot.textContent = `₹${total.toLocaleString('en-IN')}`;
  }
  
  document.getElementById('checkoutBody')?.classList.remove('hidden');
  document.getElementById('checkoutFooter')?.classList.remove('hidden');
  document.getElementById('orderConfirmedBox')?.classList.add('hidden');
  document.getElementById('checkoutModal')?.classList.remove('hidden');
}
window.openCheckoutModal = openCheckoutModal;

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.add('hidden');
}
window.closeCheckoutModal = closeCheckoutModal;

async function processPlaceOrder() {
  const name = document.getElementById('chkInputName')?.value || 'Valued Customer';
  const phone = document.getElementById('chkInputPhone')?.value || '9812345678';
  const address = document.getElementById('chkInputAddress')?.value || 'India';
  const city = document.getElementById('chkInputCity')?.value || '';
  const isEn = state.language === 'en';
  
  let orderId = `KS-ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Real Database Persistence to /orders
  try {
    const orderPayload = {
      customer_name: name,
      customer_phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      customer_address: `${address}, ${city}`,
      items: state.cart.map(i => ({
        product_id: i.id,
        title_en: i.title_en,
        title_hi: i.title_hi,
        price: i.price,
        qty: i.quantity
      })),
      total_amount: total,
      payment_method: 'upi',
      notes: 'Order placed via kalaSetu Web PWA'
    };

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (data.success && data.order) {
      orderId = data.order.id;
    }
  } catch (err) {
    console.warn('[ORDER] Offline fallback order generated:', err);
  }

  const confirmedTag = document.getElementById('confirmedOrderIdTag');
  if (confirmedTag) confirmedTag.textContent = `ऑर्डर ID: ${orderId}`;
  
  document.getElementById('checkoutBody')?.classList.add('hidden');
  document.getElementById('checkoutFooter')?.classList.add('hidden');
  document.getElementById('orderConfirmedBox')?.classList.remove('hidden');
  
  const cartLines = state.cart.map(i => `- ${i.title_en} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`).join('\n');
  
  const waMsg = encodeURIComponent(
    `🙏 *कला सेतु (kalaSetu) नया ऑर्डर!*\n\n` +
    `*ऑर्डर ID:* ${orderId}\n` +
    `*ग्राहक:* ${name} (+91 ${phone})\n` +
    `*पता:* ${address}, ${city}\n\n` +
    `*ऑर्डर की गई कलाकृतियाँ:*\n${cartLines}\n\n` +
    `*कुल देय राशि:* ₹${total.toLocaleString('en-IN')}\n` +
    `*भुगतान माध्यम:* UPI / COD (सत्यापित)\n\n` +
    `_कृपया पैकिंग व प्रेषण की पुष्टि करें।_`
  );
  
  const waBtn = document.getElementById('btnShareOrderToArtisanWhatsApp');
  if (waBtn) {
    waBtn.onclick = () => {
      window.open(`https://wa.me/919876543210?text=${waMsg}`, '_blank');
    };
  }
  
  // Clear cart & update studio
  state.cart = [];
  updateCartBadge();
  if (typeof renderStudioInventory === 'function') renderStudioInventory();
  showToast(isEn ? '🎉 Order Placed & Saved to Database!' : '🎉 आपका ऑर्डर सफलतापूर्वक दर्ज व सुरक्षित हुआ!', 'success');
}
window.processPlaceOrder = processPlaceOrder;

function sendCartToWhatsApp() {
  if (state.cart.length === 0) return;
  const cartLines = state.cart.map(i => `- ${i.title_en} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`).join('\n');
  const total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const waMsg = encodeURIComponent(
    `नमस्ते राधा देवी जी! मैं कला सेतु (kalaSetu) से निम्नलिखित हस्तशिल्प सीधे ऑर्डर करना चाहता हूँ:\n\n` +
    `${cartLines}\n\n` +
    `*कुल मूल्य:* ₹${total.toLocaleString('en-IN')}\n\n` +
    `कृपया उपलब्धता व प्रेषण की जानकारी साझा करें। धन्यवाद!`
  );
  window.open(`https://wa.me/919876543210?text=${waMsg}`, '_blank');
}
window.sendCartToWhatsApp = sendCartToWhatsApp;

function orderDirectWhatsApp(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;
  const title = prod.title_en;
  const price = prod.price;
  const waMsg = encodeURIComponent(
    `नमस्ते राधा देवी जी! मुझे आपकी यह कलाकृति बेहद पसंद आई:\n\n` +
    `🎨 *${title}*\n` +
    `💰 *मूल्य:* ₹${price}\n\n` +
    `कृपया इसकी प्रामाणिकता व डिलीवरी की जानकारी दें। धन्यवाद!`
  );
  window.open(`https://wa.me/919876543210?text=${waMsg}`, '_blank');
}
window.orderDirectWhatsApp = orderDirectWhatsApp;

// ========================================================
// 15. PRODUCT DETAIL INSPECTOR
// ========================================================
function openProductDetail(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;
  state.activeProductDetail = prod;
  
  const isEn = state.language === 'en';
  const title = (isEn || !prod.title_hi) ? prod.title_en : prod.title_hi;
  const story = (isEn || !prod.description_hi) ? prod.description_en : prod.description_hi;
  const imgSrc = prod.enhanced_image_url || prod.raw_image_url || '/uploads/sample_enhanced_1.jpg';
  const isPainting = (prod.category && prod.category.toLowerCase().includes('paint')) || (prod.title_en && prod.title_en.toLowerCase().includes('paint'));
  const isHomeDecor = isPainting || (prod.category && (prod.category.toLowerCase().includes('cottage') || prod.category.toLowerCase().includes('pot')));
  
  document.getElementById('detailProductTitle').textContent = title;
  document.getElementById('detailProductCategory').textContent = prod.category || 'Handicraft';
  document.getElementById('detailMainImg').src = imgSrc;
  document.getElementById('detailProductStory').textContent = story || (isEn ? 'Authentic handcrafted heritage craft.' : 'पारंपरिक हस्तनिर्मित भारतीय कलाकृति।');
  
  const matCost = prod.material_cost || 350;
  const hours = prod.hours_spent || 6;
  document.getElementById('detailMatCost').textContent = `₹${matCost}`;
  document.getElementById('detailLaborCost').textContent = isEn ? `${hours} hrs (₹${hours * 75})` : `${hours} घंटे (₹${hours * 75})`;
  document.getElementById('detailPriceDisplay').textContent = `₹${parseFloat(prod.price || 0).toLocaleString('en-IN')}`;
  
  const visBtn = document.getElementById('btnDetailWallPreview');
  if (visBtn) {
    visBtn.style.display = isHomeDecor ? 'block' : 'none';
  }
  
  document.getElementById('productDetailModal')?.classList.remove('hidden');
}
window.openProductDetail = openProductDetail;

function closeProductDetail() {
  document.getElementById('productDetailModal')?.classList.add('hidden');
}
window.closeProductDetail = closeProductDetail;

function triggerDetailWallPreview() {
  if (!state.activeProductDetail) return;
  closeProductDetail();
  openWallVisualizer(
    state.activeProductDetail.enhanced_image_url || state.activeProductDetail.raw_image_url,
    state.activeProductDetail.title_en,
    state.activeProductDetail.price
  );
}
window.triggerDetailWallPreview = triggerDetailWallPreview;

function triggerDetailCoa() {
  if (!state.activeProductDetail) return;
  closeProductDetail();
  openCoaModal(state.activeProductDetail.id);
}
window.triggerDetailCoa = triggerDetailCoa;

function addActiveDetailToCart() {
  if (!state.activeProductDetail) return;
  addToCart(state.activeProductDetail.id);
  closeProductDetail();
}
window.addActiveDetailToCart = addActiveDetailToCart;

function inquireActiveDetailWhatsApp() {
  if (!state.activeProductDetail) return;
  orderDirectWhatsApp(state.activeProductDetail.id);
}
window.inquireActiveDetailWhatsApp = inquireActiveDetailWhatsApp;

// ========================================================
// 16. ARTISAN STUDIO & WIZARD CONTROLLER
// ========================================================
function renderStudioInventory() {
  const tbody = document.getElementById('studioInventoryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const isEn = state.language === 'en';
  
  const craftCnt = document.getElementById('studioCraftsCount');
  if (craftCnt) craftCnt.textContent = state.products.length;
  
  let totalRevenue = 0;
  state.products.forEach(p => totalRevenue += parseFloat(p.price || 0));
  const earnCnt = document.getElementById('studioEarningsCount');
  if (earnCnt) earnCnt.textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;

  // Fetch Live Orders Stats from /orders/stats/summary
  fetch(`${API_BASE}/orders/stats/summary`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const inqCnt = document.getElementById('studioInquiriesCount');
        if (inqCnt) inqCnt.textContent = data.total_orders;
        const activeOrdersBadge = document.getElementById('statActiveOrders');
        if (activeOrdersBadge) activeOrdersBadge.textContent = data.active_orders;
        if (data.total_revenue > 0 && earnCnt) {
          earnCnt.textContent = `₹${(totalRevenue + data.total_revenue).toLocaleString('en-IN')}`;
        }
      }
    })
    .catch(() => {});
  
  state.products.forEach(p => {
    const tr = document.createElement('tr');
    const title = (isEn || !p.title_hi) ? p.title_en : p.title_hi;
    const imgSrc = p.enhanced_image_url || p.raw_image_url || '/uploads/sample_enhanced_1.jpg';
    const isPublished = p.status === 'published';
    const statusLabel = isEn 
      ? (isPublished ? 'Published' : 'Draft')
      : (isPublished ? 'प्रकाशित' : 'ड्राफ्ट');
    const statusClass = isPublished ? 'published' : 'draft';
    
    tr.innerHTML = `
      <td>
        <div class="inventory-craft-cell">
          <img src="${imgSrc}" class="inventory-craft-thumb" onerror="this.src='/uploads/sample_enhanced_1.svg'" />
          <div>
            <strong class="inventory-craft-title">${title}</strong>
            <div class="inventory-craft-code">ID: ${p.id}</div>
          </div>
        </div>
      </td>
      <td><strong>${p.category || 'Craft'}</strong></td>
      <td>
        <small style="color:#718096;">₹${p.material_cost || 350} mat. + ${p.hours_spent || 6}h labor</small>
      </td>
      <td>
        <strong style="color:#C05621; font-size:15px;">₹${parseFloat(p.price || 0).toLocaleString('en-IN')}</strong>
      </td>
      <td>
        <span class="badge-inv-status ${statusClass}">${statusLabel}</span>
      </td>
      <td>
        <div class="inv-actions-row">
          <button class="btn-inv-action" onclick="window.openProductDetail('${p.id}')">👁️ View</button>
          <button class="btn-inv-action" onclick="window.openCoaModal('${p.id}')">📜 COA</button>
          <button class="btn-inv-action" onclick="window.orderDirectWhatsApp('${p.id}')">💬 Share</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
window.renderStudioInventory = renderStudioInventory;

function openStudioWizard() {
  state.wizStep = 1;
  advanceWizStep(1);
  document.getElementById('studioWizardModal')?.classList.remove('hidden');
}
window.openStudioWizard = openStudioWizard;

function closeStudioWizard() {
  document.getElementById('studioWizardModal')?.classList.add('hidden');
  if (state.webcamStream) {
    state.webcamStream.getTracks().forEach(track => track.stop());
    state.webcamStream = null;
  }
}
window.closeStudioWizard = closeStudioWizard;

function advanceWizStep(stepNum) {
  state.wizStep = stepNum;
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`wizStep${i}`);
    const paneEl = document.getElementById(`wizPane${i}`);
    if (stepEl) stepEl.classList.toggle('active', i === stepNum);
    if (paneEl) paneEl.classList.toggle('active', i === stepNum);
  }
}
window.advanceWizStep = advanceWizStep;

function wizSelectCraft(craftKey) {
  selectCraftSample(craftKey);
  const sample = craftSamples[craftKey];
  if (!sample) return;
  
  const preview = document.getElementById('wizSelectedImgPreview');
  if (preview) preview.src = sample.raw;
  
  const rawImg = document.getElementById('wizImgRaw');
  if (rawImg) rawImg.src = sample.raw;
  const enhImg = document.getElementById('wizImgEnhanced');
  if (enhImg) enhImg.src = sample.enhanced;
  
  const tHi = document.getElementById('wizTitleHi');
  if (tHi) tHi.value = sample.catalog.title_hi;
  const tEn = document.getElementById('wizTitleEn');
  if (tEn) tEn.value = sample.catalog.title_en;
  const dHi = document.getElementById('wizDescHi');
  if (dHi) dHi.value = sample.catalog.description_hi;
  const dEn = document.getElementById('wizDescEn');
  if (dEn) dEn.value = sample.catalog.description_en;
  
  state.materialCost = sample.pricing.matCost;
  state.hoursSpent = sample.pricing.hours;
  state.calculatedPrice = sample.pricing.suggestedPrice;
  
  updateWizPricingDisplay();
  showToast(`✨ Loaded preset: ${sample.catalog.title_en}`, 'info');
}
window.wizSelectCraft = wizSelectCraft;

function loadCraftSampleAndOpen(craftKey) {
  openStudioWizard();
  wizSelectCraft(craftKey);
}
window.loadCraftSampleAndOpen = loadCraftSampleAndOpen;

function handleWizFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const preview = document.getElementById('wizSelectedImgPreview');
    if (preview) preview.src = dataUrl;
    const rawImg = document.getElementById('wizImgRaw');
    if (rawImg) rawImg.src = dataUrl;
    const enhImg = document.getElementById('wizImgEnhanced');
    if (enhImg) enhImg.src = dataUrl;
    showToast('📸 Custom image uploaded!', 'success');
  };
  reader.readAsDataURL(file);
}
window.handleWizFileUpload = handleWizFileUpload;

async function toggleDeviceWebcam() {
  const video = document.getElementById('webcamVideo');
  const previewBox = document.getElementById('cameraPreviewBox');
  const btn = document.getElementById('btnToggleCamera');
  
  if (state.webcamStream) {
    state.webcamStream.getTracks().forEach(t => t.stop());
    state.webcamStream = null;
    if (video) video.classList.add('hidden');
    if (previewBox) previewBox.classList.remove('hidden');
    if (btn) btn.innerHTML = '<span>📹 लाइव कैमरा ऑन करें</span>';
    return;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    state.webcamStream = stream;
    if (video) {
      video.srcObject = stream;
      video.classList.remove('hidden');
    }
    if (previewBox) previewBox.classList.add('hidden');
    if (btn) btn.innerHTML = '<span>⏹️ कैमरा बंद करें</span>';
  } catch (err) {
    showToast('Camera permission denied or camera not accessible.', 'warning');
  }
}
window.toggleDeviceWebcam = toggleDeviceWebcam;

function updateWizCompareSlider(val) {
  const compAfter = document.getElementById('wizCompAfter');
  const line = document.getElementById('wizSliderDividerLine');
  if (compAfter) compAfter.style.clipPath = `inset(0 0 0 ${val}%)`;
  if (line) line.style.left = `${val}%`;
}
window.updateWizCompareSlider = updateWizCompareSlider;

function toggleWizVoiceRecording() {
  const btn = document.getElementById('btnWizBigMic');
  const hint = document.getElementById('wizMicPromptText');
  const pulseBox = document.getElementById('wizLiveTranscriptBox');
  const transcriptText = document.getElementById('wizLiveTranscriptText');
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Speech recognition not supported in this browser. Loading sample speech.', 'info');
    document.getElementById('btnDemoVoice')?.click();
    return;
  }
  
  if (!window.wizRecognizer) {
    window.wizRecognizer = new SpeechRecognition();
    window.wizRecognizer.continuous = true;
    window.wizRecognizer.interimResults = true;
    window.wizRecognizer.lang = state.language === 'en' ? 'en-IN' : 'hi-IN';
    
    window.wizRecognizer.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        interim += e.results[i][0].transcript;
      }
      if (transcriptText) transcriptText.textContent = interim;
    };
    
    window.wizRecognizer.onerror = () => {
      stopWizVoiceRecording();
    };
  }
  
  if (btn.classList.contains('recording')) {
    stopWizVoiceRecording();
  } else {
    btn.classList.add('recording');
    if (pulseBox) pulseBox.classList.remove('hidden');
    if (hint) hint.textContent = state.language === 'en' ? 'Listening... Speak clearly.' : 'सुन रहे हैं... बोलें।';
    try { window.wizRecognizer.start(); } catch (e) {}
  }
}
window.toggleWizVoiceRecording = toggleWizVoiceRecording;

function stopWizVoiceRecording() {
  const btn = document.getElementById('btnWizBigMic');
  const hint = document.getElementById('wizMicPromptText');
  const pulseBox = document.getElementById('wizLiveTranscriptBox');
  if (btn) btn.classList.remove('recording');
  if (pulseBox) pulseBox.classList.add('hidden');
  if (hint) hint.textContent = state.language === 'en' ? 'Tap mic to speak' : 'बोलने के लिए माइक दबाएं';
  try { if (window.wizRecognizer) window.wizRecognizer.stop(); } catch (e) {}
}

function playWizTts() {
  const t = document.getElementById('wizDescHi')?.value || document.getElementById('wizDescEn')?.value;
  if (!t || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(t);
  utter.lang = state.language === 'en' ? 'en-IN' : 'hi-IN';
  window.speechSynthesis.speak(utter);
  showToast('🔊 Playing audio description...', 'info');
}
window.playWizTts = playWizTts;

function stepWizMat(delta) {
  state.materialCost = Math.max(50, state.materialCost + delta);
  recalcWizPricing();
}
window.stepWizMat = stepWizMat;

function stepWizHours(delta) {
  state.hoursSpent = Math.max(1, state.hoursSpent + delta);
  recalcWizPricing();
}
window.stepWizHours = stepWizHours;

function recalcWizPricing() {
  const laborRate = 75; // ₹75/hr fair livelihood rate
  const laborCost = state.hoursSpent * laborRate;
  const craftMarkup = 150;
  state.calculatedPrice = Math.round((state.materialCost + laborCost + craftMarkup) / 50) * 50;
  updateWizPricingDisplay();
}

function updateWizPricingDisplay() {
  const matEl = document.getElementById('wizValMaterialCost');
  if (matEl) matEl.textContent = `₹${state.materialCost}`;
  const hrEl = document.getElementById('wizValHoursSpent');
  if (hrEl) hrEl.textContent = state.language === 'en' ? `${state.hoursSpent} hrs` : `${state.hoursSpent} घंटे`;
  const priceEl = document.getElementById('wizDisplayPrice');
  if (priceEl) priceEl.textContent = `₹${state.calculatedPrice.toLocaleString('en-IN')}`;
  const sliderLbl = document.getElementById('wizSliderPriceLabel');
  if (sliderLbl) sliderLbl.textContent = `₹${state.calculatedPrice.toLocaleString('en-IN')}`;
  const slider = document.getElementById('wizPriceSlider');
  if (slider) slider.value = state.calculatedPrice;
  const justEl = document.getElementById('wizJustification');
  if (justEl) {
    justEl.textContent = state.language === 'en'
      ? `Material cost (₹${state.materialCost}) + ${state.hoursSpent} hrs labor supports sustainable rural livelihood at ₹${state.calculatedPrice}.`
      : `आपकी सामग्री लागत (₹${state.materialCost}) और ${state.hoursSpent} घंटे के श्रम के अनुसार ₹${state.calculatedPrice} उचित मूल्य है।`;
  }
}

function updateWizPriceSlider(val) {
  state.calculatedPrice = parseInt(val);
  const sliderLbl = document.getElementById('wizSliderPriceLabel');
  if (sliderLbl) sliderLbl.textContent = `₹${state.calculatedPrice.toLocaleString('en-IN')}`;
  const priceEl = document.getElementById('wizDisplayPrice');
  if (priceEl) priceEl.textContent = `₹${state.calculatedPrice.toLocaleString('en-IN')}`;
}
window.updateWizPriceSlider = updateWizPriceSlider;

async function publishWizProduct() {
  const titleHi = document.getElementById('wizTitleHi')?.value || 'हस्तनिर्मित शिल्प';
  const titleEn = document.getElementById('wizTitleEn')?.value || 'Handmade Craft';
  const descHi = document.getElementById('wizDescHi')?.value || '';
  const descEn = document.getElementById('wizDescEn')?.value || '';
  const rawUrl = document.getElementById('wizImgRaw')?.src || '/uploads/sample_raw_1.svg';
  const enhancedUrl = document.getElementById('wizImgEnhanced')?.src || '/uploads/sample_enhanced_1.svg';
  
  const newProduct = {
    title_en: titleEn,
    title_hi: titleHi,
    description_en: descEn,
    description_hi: descHi,
    raw_image_url: rawUrl,
    enhanced_image_url: enhancedUrl,
    price: state.calculatedPrice,
    category: state.selectedCraft || 'Craft',
    material_cost: state.materialCost,
    hours_spent: state.hoursSpent,
    status: 'published'
  };
  
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const data = await res.json();
    if (data.success && data.product) {
      state.products.unshift(data.product);
    }
  } catch (err) {
    newProduct.id = `prod-${Date.now().toString().slice(-6)}`;
    state.products.unshift(newProduct);
  }
  
  closeStudioWizard();
  renderProductsGrid();
  renderMarketplace();
  renderStudioInventory();
  switchPortal('marketplace');
  showToast(state.language === 'en' ? '🏪 Product Published to Live Catalog!' : '🏪 शिल्प कैटलॉग में प्रकाशित हुआ!', 'success');
}
window.publishWizProduct = publishWizProduct;

function shareFullCatalogOnWhatsApp() {
  const count = state.products.length;
  const waMsg = encodeURIComponent(
    `🙏 *नमस्ते! मैं राधा देवी (शिल्पी, वाराणसी)*\n\n` +
    `कला सेतु (kalaSetu) पर मेरा डिजिटल शिल्प कैटलॉग अब लाइव है।\n` +
    `कुल शिल्प: ${count} प्रामाणिक हस्तकला आइटम (जीआई प्रमाणित व फेयर-ट्रेड मूल्य)।\n\n` +
    `🌐 *कैटलॉग देखें व ऑर्डर करें:* ${window.location.origin}/demo\n\n` +
    `सीधे हस्तशिल्पियों का समर्थन करें!`
  );
  window.open(`https://wa.me/?text=${waMsg}`, '_blank');
}
window.shareFullCatalogOnWhatsApp = shareFullCatalogOnWhatsApp;

// ========================================================
// 17. PROGRESSIVE WEB APP (PWA) & SERVICE WORKER LIFECYCLE
// ========================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/demo/sw.js')
      .then(reg => console.log('[PWA] Service Worker active:', reg.scope))
      .catch(err => console.warn('[PWA] SW register warning:', err));
  });
}

let pwaDeferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  pwaDeferredPrompt = e;
  const btn = document.getElementById('btnPwaInstall');
  if (btn) btn.classList.remove('hidden');
});

const btnPwa = document.getElementById('btnPwaInstall');
if (btnPwa) {
  btnPwa.addEventListener('click', async () => {
    if (pwaDeferredPrompt) {
      pwaDeferredPrompt.prompt();
      const { outcome } = await pwaDeferredPrompt.userChoice;
      console.log('[PWA] User response to installation:', outcome);
      pwaDeferredPrompt = null;
      btnPwa.classList.add('hidden');
    } else {
      showToast(state.language === 'en' ? '📱 To install: Tap your browser menu > "Add to Home Screen"' : '📱 इंस्टॉल हेतु: ब्राउज़र मेनू में जाएं > "Add to Home Screen" चुनें', 'info', 4500);
    }
  });
}

function toggleLanguageQuick() {
  const target = state.language === 'hi' ? 'en' : 'hi';
  setLanguage(target);
  const lbl = document.getElementById('mobLangLabel');
  if (lbl) lbl.textContent = target === 'hi' ? 'EN' : 'हिं';
}
window.toggleLanguageQuick = toggleLanguageQuick;

// Initialize on page load
loadProducts();
setLanguage('hi');
switchPortal('marketplace');


