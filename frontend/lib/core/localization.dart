import 'package:flutter/material.dart';

class KalaLocalization extends ChangeNotifier {
  String _currentLanguage = 'hi'; // Default to Hindi (literacy-first)

  String get currentLanguage => _currentLanguage;
  bool get isHindi => _currentLanguage == 'hi';

  void setLanguage(String lang) {
    if (_currentLanguage != lang) {
      _currentLanguage = lang;
      notifyListeners();
    }
  }

  void toggleLanguage() {
    _currentLanguage = (_currentLanguage == 'hi') ? 'en' : 'hi';
    notifyListeners();
  }

  // Bilingual Dictionary
  static const Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_title': 'kalaSetu',
      'app_subtitle': 'AI Business Manager for Artisans',
      'select_language': 'Select Your Language',
      'welcome': 'Welcome, Artisan',
      'welcome_sub': 'Digitize your crafts and sell year-round directly to buyers.',
      'phone_number': 'Mobile Number',
      'phone_hint': 'Enter 10-digit mobile number',
      'send_otp': 'Send OTP via SMS',
      'enter_otp': 'Enter Verification Code',
      'otp_sub': 'Enter the 6-digit code sent to your phone',
      'verify_and_login': 'Verify & Enter Studio',
      'demo_otp_hint': 'For demo test, enter: 123456',
      'profile_setup': 'Artisan Profile',
      'artisan_name': 'Your Name',
      'craft_type': 'Your Craft Specialization',
      'location': 'City / Village & State',
      'save_profile': 'Save Profile & Start',
      
      // Navigation & Dashboard
      'catalog': 'My Crafts',
      'dashboard': 'Business Hub',
      'add_new_craft': 'Digitize New Craft',
      'products_listed': 'Crafts Listed',
      'total_views': 'Buyer Views',
      'orders': 'Inquiries',
      'filter_all': 'All',
      'filter_published': 'Published',
      'filter_draft': 'Drafts',
      'filter_gem': 'GeM Sync',
      
      // Camera & AI Image Studio
      'camera_title': 'Photograph Your Craft',
      'camera_guide_hint': 'Center product inside the guide box for best AI studio result',
      'capture_btn': 'Take Photo',
      'enhancing_image': 'Enhancing with Gemini AI...',
      'enhancing_sub': 'Removing shadows, cleaning background, studio lighting balance',
      'before_after_title': 'AI Studio Comparison',
      'before_label': 'Original',
      'after_label': 'AI Studio Enhanced',
      'accept_photo': 'Use Studio Photo',
      'retake_photo': 'Retake Photo',
      
      // Voice Auto-Cataloger
      'voice_title': 'Describe Your Craft (Speak)',
      'voice_prompt': 'Press the button and describe your craft in your native language.',
      'tap_to_speak': 'Tap Mic to Speak',
      'recording': 'Listening... Tap to Finish',
      'processing_voice': 'Gemini AI is generating catalog...',
      'processing_voice_sub': 'Transcribing speech & translating into SEO titles in English & Hindi',
      'catalog_review_title': 'Review Catalog Info',
      'listen_tts': 'Listen to Description (Audio)',
      'title_en_label': 'Title (English)',
      'title_hi_label': 'Title (Hindi)',
      'desc_en_label': 'Story & Dimensions (English)',
      'desc_hi_label': 'Story & Dimensions (Hindi)',
      'continue_to_pricing': 'Next: Fair Dynamic Pricing',
      
      // Dynamic Pricing
      'pricing_title': 'AI Fair-Trade Pricing',
      'pricing_sub': 'Calculate fair price based on your materials, time & market data',
      'material_cost': 'Raw Material Expense (₹)',
      'hours_spent': 'Hours of Handcrafting',
      'craft_category': 'Category',
      'calculate_price_btn': 'Calculate Fair Price',
      'calculating_price': 'Gemini AI is analyzing market comparables...',
      'gemini_recommendation': 'Recommended Fair Price',
      'price_range': 'Market Selling Range',
      'justification': 'AI Livelihood Reasoning',
      'custom_price_hint': 'You can accept this or adjust with slider',
      'publish_product': 'Publish Craft to Catalog',
      'save_as_draft': 'Save as Draft',
      
      // GeM & B2B
      'gem_title': 'Government e-Marketplace (GeM)',
      'gem_sub': 'Sell directly to Government departments, PSUs & corporate buyers',
      'sync_to_gem': '1-Click Sync to GeM Crafts',
      'synced_badge': 'Synced to GeM',
      'odop_eligible': 'ODOP (One District One Product) Certified',
    },
    'hi': {
      'app_title': 'कला सेतु (kalaSetu)',
      'app_subtitle': 'हस्तशिल्पियों का डिजिटल व्यापार साथी',
      'select_language': 'अपनी भाषा चुनें',
      'welcome': 'नमस्ते, शिल्पी साथी',
      'welcome_sub': 'अपने हस्तशिल्प को डिजिटाइज़ करें और पूरे साल सीधे खरीदारों को बेचें।',
      'phone_number': 'मोबाइल नंबर',
      'phone_hint': '10 अंकों का मोबाइल नंबर दर्ज करें',
      'send_otp': 'एसएमएस द्वारा ओटीपी भेजें',
      'enter_otp': 'सत्यापन कोड (OTP) दर्ज करें',
      'otp_sub': 'आपके फोन पर भेजा गया 6 अंकों का कोड दर्ज करें',
      'verify_and_login': 'सत्यापित करें और स्टूडियो में प्रवेश करें',
      'demo_otp_hint': 'डेमो परीक्षण के लिए कोड: 123456',
      'profile_setup': 'शिल्पी विवरण (Profile)',
      'artisan_name': 'आपका शुभ नाम',
      'craft_type': 'आपकी शिल्प कला (जैसे: हथकरघा, मिट्टी के बर्तन)',
      'location': 'गाँव/शहर और राज्य',
      'save_profile': 'विवरण सहेजें और शुरू करें',
      
      // Navigation & Dashboard
      'catalog': 'मेरी कलाकृतियाँ',
      'dashboard': 'व्यापार केंद्र',
      'add_new_craft': 'नया शिल्प जोड़ें',
      'products_listed': 'कुल कलाकृतियाँ',
      'total_views': 'ग्राहकों द्वारा देखी गईं',
      'orders': 'पूछताछ व ऑर्डर',
      'filter_all': 'सभी',
      'filter_published': 'प्रकाशित',
      'filter_draft': 'ड्राफ्ट',
      'filter_gem': 'GeM पोर्टल',
      
      // Camera & AI Image Studio
      'camera_title': 'शिल्प की तस्वीर लें',
      'camera_guide_hint': 'उत्पाद को बीच के बॉक्स में रखें ताकि AI सबसे अच्छी स्टूडियो फोटो बना सके',
      'capture_btn': 'तस्वीर खींचें',
      'enhancing_image': 'जेमिनी AI फोटो सुधार रहा है...',
      'enhancing_sub': 'परछाई हटाना, पृष्ठभूमि साफ करना और स्टूडियो रोशनी संतुलित करना',
      'before_after_title': 'AI स्टूडियो फोटो तुलना',
      'before_label': 'मूल फोटो',
      'after_label': 'AI स्टूडियो परिष्कृत',
      'accept_photo': 'यह फोटो चुनें',
      'retake_photo': 'दोबारा फोटो लें',
      
      // Voice Auto-Cataloger
      'voice_title': 'शिल्प के बारे में बोलकर बताएं',
      'voice_prompt': 'माइक दबाएं और अपनी भाषा में उत्पाद के बारे में बताएं।',
      'tap_to_speak': 'बोलने के लिए माइक दबाएं',
      'recording': 'सुन रहे हैं... समाप्त करने के लिए टैप करें',
      'processing_voice': 'जेमिनी AI विवरण तैयार कर रहा है...',
      'processing_voice_sub': 'आवाज को समझकर हिंदी और अंग्रेजी में विवरण बनाया जा रहा है',
      'catalog_review_title': 'उत्पाद विवरण की समीक्षा करें',
      'listen_tts': 'विवरण को आवाज में सुनें (Audio)',
      'title_en_label': 'शीर्षक (अंग्रेजी)',
      'title_hi_label': 'शीर्षक (हिंदी)',
      'desc_en_label': 'शिल्प कथा व नाप (अंग्रेजी)',
      'desc_hi_label': 'शिल्प कथा व नाप (हिंदी)',
      'continue_to_pricing': 'आगे: सही मूल्य निर्धारण',
      
      // Dynamic Pricing
      'pricing_title': 'AI सही मूल्य निर्धारण',
      'pricing_sub': 'कच्चे माल की लागत, समय और बाजार भाव के आधार पर उचित मूल्य पाएं',
      'material_cost': 'कच्चे माल का खर्च (₹)',
      'hours_spent': 'हाथ से बनाने में लगे घंटे',
      'craft_category': 'शिल्प वर्ग',
      'calculate_price_btn': 'उचित मूल्य की गणना करें',
      'calculating_price': 'जेमिनी AI बाजार भाव का विश्लेषण कर रहा है...',
      'gemini_recommendation': 'अनुशंसित उचित मूल्य',
      'price_range': 'बाजार बिक्री दायरा',
      'justification': 'AI आजीविका तर्क',
      'custom_price_hint': 'आप इसे स्वीकार कर सकते हैं या स्लाइडर से बदल सकते हैं',
      'publish_product': 'कैटलॉग में प्रकाशित करें',
      'save_as_draft': 'ड्राफ्ट के रूप में सहेजें',
      
      // GeM & B2B
      'gem_title': 'सरकारी ई-मार्केटप्लेस (GeM)',
      'gem_sub': 'सरकारी विभागों और बड़े कॉर्पोरेट खरीदारों को सीधे बेचें',
      'sync_to_gem': '1-क्लिक में GeM पोर्टल से जोड़ें',
      'synced_badge': 'GeM पर जुड़ा हुआ',
      'odop_eligible': 'ओडीओपी (एक जिला एक उत्पाद) प्रमाणित',
    }
  };

  String text(String key) {
    return _localizedValues[_currentLanguage]?[key] ??
           _localizedValues['en']?[key] ??
           key;
  }
}
