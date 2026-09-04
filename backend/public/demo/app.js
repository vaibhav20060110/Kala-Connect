// KalaConnect Interactive Mobile Demo Controller

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

// UI Translations
const i18n = {
  hi: {
    app_title: 'कला कनेक्ट',
    continue: 'आगे बढ़ें',
    phone_title: 'मोबाइल नंबर दर्ज करें',
    phone_sub: 'अपने हस्तशिल्प को डिजिटाइज़ करें और सीधे खरीदारों को बेचें',
    otp_title: 'ओटीपी सत्यापन (OTP Verification)',
    send_otp: 'एसएमएस द्वारा ओटीपी भेजें',
    verify_otp: 'सत्यापित करें और शुरू करें',
    tap_speak: 'बोलने के लिए माइक दबाएं',
    listening: 'सुन रहे हैं... समाप्त करने के लिए टैप करें',
    publish: 'कैटलॉग में प्रकाशित करें'
  },
  en: {
    app_title: 'KalaConnect',
    continue: 'Continue',
    phone_title: 'Enter Mobile Number',
    phone_sub: 'Digitize your crafts and sell year-round directly to buyers',
    otp_title: 'Enter Verification Code',
    send_otp: 'Send OTP via SMS',
    verify_otp: 'Verify & Enter Studio',
    tap_speak: 'Tap Mic to Speak',
    listening: 'Listening... Tap to Finish',
    publish: 'Publish to Catalog'
  }
};

// Navigation
function navigateTo(screenId) {
  document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
window.navigateTo = navigateTo;

// Language Toggle
function setLanguage(lang) {
  state.language = lang;
  document.getElementById('langToggleText').textContent = (lang === 'hi') ? 'English' : 'हिंदी';
  document.getElementById('headerTitle').textContent = i18n[lang].app_title;

  document.querySelectorAll('.lang-card').forEach(card => {
    card.classList.toggle('active', card.dataset.lang === lang);
    card.querySelector('.check-radio').textContent = (card.dataset.lang === lang) ? '✓' : '';
  });

  renderProductsGrid();
}

// 1. Language Selection Listeners
document.getElementById('langCardHi').addEventListener('click', () => setLanguage('hi'));
document.getElementById('langCardEn').addEventListener('click', () => setLanguage('en'));
document.getElementById('langToggleBtn').addEventListener('click', () => {
  setLanguage(state.language === 'hi' ? 'en' : 'hi');
});
document.getElementById('btnContinueLanguage').addEventListener('click', () => navigateTo('screen-auth'));

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

  const filtered = state.activeFilter === 'all'
    ? state.products
    : state.products.filter(p => p.status === state.activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: span 2; text-align: center; padding: 30px; color: #718096;">
      <p style="font-size: 32px;">🧵</p>
      <p><strong>कोई उत्पाद नहीं मिला</strong></p>
    </div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const title = (state.language === 'hi' && p.title_hi) ? p.title_hi : p.title_en;
    const imgSrc = p.enhanced_image_url || p.raw_image_url || '/uploads/sample_enhanced_1.jpg';

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${imgSrc}" alt="${title}" onerror="this.src='/uploads/sample_enhanced_1.svg'" />
        <span class="badge-studio">✨ AI Studio</span>
        <span class="badge-status">${p.status.toUpperCase()}</span>
      </div>
      <div class="product-info-box">
        <div class="product-title">${title}</div>
        <div class="product-price-row">
          <span class="product-price">₹${Math.round(p.price)}</span>
          <span class="product-views">👁️ ${p.views || 89}</span>
        </div>
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

// 5. Camera & Shutter
document.getElementById('btnBackFromCam').addEventListener('click', () => navigateTo('screen-home'));

async function processCapturedImage(fileOrMock) {
  try {
    let rawUrl = '/uploads/sample_raw_1.jpg';
    let enhancedUrl = '/uploads/sample_enhanced_1.jpg';

    if (fileOrMock instanceof File) {
      const formData = new FormData();
      formData.append('image', fileOrMock);
      const res = await fetch(`${API_BASE}/ai/image-enhance`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        rawUrl = data.original_url;
        enhancedUrl = data.enhanced_url;
      }
    }

    state.capturedImage = { rawUrl, enhancedUrl };
    document.getElementById('imgRaw').src = rawUrl;
    document.getElementById('imgEnhanced').src = enhancedUrl;
    navigateTo('screen-enhancer');
  } catch (e) {
    navigateTo('screen-enhancer');
  }
}

document.getElementById('btnShutter').addEventListener('click', () => processCapturedImage(null));
document.getElementById('btnSampleSnap').addEventListener('click', () => processCapturedImage(null));
document.getElementById('fileImagePicker').addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    processCapturedImage(e.target.files[0]);
  }
});

// 6. Before / After Comparison Slider
const compareSlider = document.getElementById('compareSlider');
const compAfter = document.getElementById('compAfter');
if (compareSlider && compAfter) {
  compareSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    compAfter.style.clipPath = `inset(0 0 0 ${val}%)`;
  });
}

document.getElementById('btnAcceptEnhanced').addEventListener('click', () => navigateTo('screen-voice'));
document.getElementById('btnRetakePhoto').addEventListener('click', () => navigateTo('screen-camera'));

// 7. Voice Recording Simulation & Speech Synthesis
let isRecording = false;
let recordTimer = null;
let recordSeconds = 0;

const btnBigMic = document.getElementById('btnBigMic');
const micTimer = document.getElementById('micTimer');
const micPromptText = document.getElementById('micPromptText');

btnBigMic.addEventListener('click', () => {
  if (!isRecording) {
    // Start Recording
    isRecording = true;
    btnBigMic.classList.add('recording');
    recordSeconds = 0;
    micPromptText.textContent = state.language === 'hi' ? 'सुन रहे हैं... समाप्त करने के लिए टैप करें' : 'Listening... Tap to finish';
    recordTimer = setInterval(() => {
      recordSeconds++;
      const s = recordSeconds.toString().padStart(2, '0');
      micTimer.textContent = `00:${s}`;
    }, 1000);
  } else {
    // Stop Recording & call AI
    clearInterval(recordTimer);
    isRecording = false;
    btnBigMic.classList.remove('recording');
    executeVoiceCataloging();
  }
});

document.getElementById('btnDemoVoice').addEventListener('click', () => executeVoiceCataloging());

async function executeVoiceCataloging() {
  document.getElementById('voiceProcessingBox').classList.remove('hidden');
  try {
    const res = await fetch(`${API_BASE}/ai/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: state.language })
    });
    const data = await res.json();
    if (data.success) {
      state.catalogData = data;
      document.getElementById('reviewTitleHi').value = data.title_hi;
      document.getElementById('reviewTitleEn').value = data.title_en;
      document.getElementById('reviewDescHi').value = data.description_hi;
      document.getElementById('reviewDescEn').value = data.description_en;
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
  alert(state.language === 'hi' ? '📢 ऑडियो विवरण सुनाया जा रहा है...' : '📢 Playing audio description...');
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
  document.getElementById('valHoursSpent').textContent = `${state.hoursSpent} घंटे`;
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
      document.getElementById('displayMarketRange').textContent = `बाजार दायरा: ₹${data.suggested_min} – ₹${data.suggested_max}`;
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
    alert(status === 'published' ? '🎉 शिल्प कैटलॉग में सफलतापूर्वक प्रकाशित हुआ!' : 'ड्राफ्ट सहेज लिया गया!');
    await loadProducts();
    navigateTo('screen-home');
  } catch (err) {
    alert('उत्पाद सहेजा गया!');
    loadProducts();
    navigateTo('screen-home');
  }
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
  alert('🏛️ आपके उत्पाद GeM पोर्टल और ODOP कैटलॉग से सफलतापूर्वक सिंक कर दिए गए हैं!');
  closeGeMModal();
});

// Initialize on page load
loadProducts();
