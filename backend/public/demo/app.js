// kalaSetu Interactive Mobile Demo Controller

const API_BASE = window.location.origin;

const state = {
  language: 'hi', // 'hi' or 'en'
  currentScreen: 'screen-language',
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
    your_voice: 'आपकी आवाज़'
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
    your_voice: 'Your Spoken Words'
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

  // 1. Update Header Segmented Control
  const btnHi = document.getElementById('btnLangHi');
  const btnEn = document.getElementById('btnLangEn');
  if (btnHi && btnEn) {
    btnHi.classList.toggle('active', lang === 'hi');
    btnEn.classList.toggle('active', lang === 'en');
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

  // 5. Update Dynamic Form Placeholders & Input Texts
  const hoursVal = document.getElementById('valHoursSpent');
  if (hoursVal) {
    hoursVal.textContent = lang === 'en' ? `${state.hoursSpent} hours` : `${state.hoursSpent} घंटे`;
  }

  const micHint = document.getElementById('micPromptText');
  if (micHint && !micHint.classList.contains('recording')) {
    micHint.textContent = dict.tap_speak;
  }

  // 6. Update Profile defaults if untouched
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

  // 7. Re-render product catalog in chosen language
  renderProductsGrid();
}
window.setLanguage = setLanguage;

// 1. Language Listeners (Header Segmented Control + Cards)
document.getElementById('btnLangHi')?.addEventListener('click', () => setLanguage('hi'));
document.getElementById('btnLangEn')?.addEventListener('click', () => setLanguage('en'));
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
      document.getElementById('statProductCount').textContent = state.products.length;
      renderProductsGrid();
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

// Initialize on page load
loadProducts();
setLanguage('hi');
