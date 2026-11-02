window.handleLogout = function() {
  logoutCatalogUser();
  document.documentElement.classList.remove('is-poslogin-direct');
  document.body.classList.remove('is-poslogin-direct');
  syncConceitoAuthState();
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
};
import {
  loginCatalogUser,
  loginWithGoogle,
  registerCatalogUser,
  requestPasswordResetEmail,
  getCurrentCatalogUser,
  isCatalogApproved,
  isUserAdmin,
  logoutCatalogUser
} from '../site-principal/catalog-auth.js';
import {
  getStoredWarrantyOrders,
  getWarrantyOrdersForUser,
  saveWarrantyOrder,
  updateWarrantyOrderStatus,
  fetchWarrantyOrdersFromFirestore
} from '../site-principal/data/warranty-db.js';
/**
 * Z8 E-MOTION // CONCEITO B2B INTERACTIVE CONTROLLER
 * Works alongside /assets/lando/lando-engine.js (Three.js WebGL + Rive + Lenis + GSAP)
 */
import { doc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../site-principal/services/firebase-service.js';
import { renderPortalLojistaLAF, syncPortalLojistaUser } from '../site-principal/portal-lojista-laf.js';

const Z8_FLEET = [
  {
    id: 'z8-tank',
    name: 'Z8 Tank High-Speed (DB018)',
    tag: '+53,3%',
    marginPct: '34,8%',
    wholesale: 7500,
    retail: 11500,
    profit: 4000,
    power: '2000W High-Torque Brushless',
    range: 'Até 120-240 km (Lítio 72V 125Ah)',
    cnh: 'CONTRAN 996 // High-Speed',
    baseImg: '/assets/models/z8_tank_studio.jpg',
    colors: [
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank_amber.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank_black.jpg' },
      { name: 'Titanium Matte', hex: '#7C8288', img: '/assets/models/z8_tank_titanium.jpg' }
    ]
  },
  {
    id: 'z8-tank-2',
    name: 'Z8 Tank 2 Expedition (DB018-T2)',
    tag: '+47,1%',
    marginPct: '32,0%',
    wholesale: 8500,
    retail: 12500,
    profit: 4000,
    power: '2000W High-Torque + Controlador 15G',
    range: 'Até 70-240 km (Lítio 60V/72V 125Ah)',
    cnh: 'CONTRAN 996 // GPS + NFC + Baú',
    baseImg: '/assets/models/z8_tank2_studio.jpg',
    colors: [
      { name: 'Pearl White Trail', hex: '#F1F5F9', img: '/assets/models/z8_tank2_studio.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank2_black.jpg' },
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank2_amber.jpg' }
    ]
  },
  {
    id: 'z8-n95c',
    name: 'Z8 N95C Max Executive (DB039)',
    tag: '+53,8%',
    marginPct: '35,0%',
    wholesale: 6500,
    retail: 10000,
    profit: 3500,
    power: '1000W a 1200W Brushless FOC',
    range: 'Até 70-100 km (Lítio 60V/72V 125Ah)',
    cnh: 'CONTRAN 996 // Urbano',
    baseImg: '/assets/models/z8_n95c_studio.jpg',
    colors: [
      { name: 'Graphite Orange', hex: '#484C52', img: '/assets/models/z8_n95c_studio.jpg' },
      { name: 'Obsidian Black', hex: '#141518', img: '/assets/models/z8_n95c_black.jpg' },
      { name: 'Pearl White', hex: '#EAECEF', img: '/assets/models/z8_n95c_white.jpg' }
    ]
  },
  {
    id: 'z8-fx10',
    name: 'Z8 FX-10 Sport (DB043)',
    tag: '+34,3%',
    marginPct: '25,6%',
    wholesale: 6700,
    retail: 9000,
    profit: 2300,
    power: '1500W Sport Hub + 12G-38A',
    range: 'Até 100 km (Lítio 60V/72V 125Ah)',
    cnh: 'Autopropelido // Urbano',
    baseImg: '/assets/models/z8_fx10_studio.jpg',
    colors: [
      { name: 'Cyber Silver', hex: '#8A929A', img: '/assets/models/z8_fx10_studio.jpg' },
      { name: 'Stealth Black', hex: '#15171A', img: '/assets/models/z8_fx10_black.jpg' },
      { name: 'Glacier White', hex: '#F0F2F5', img: '/assets/models/z8_fx10_white.jpg' }
    ]
  },
  {
    id: 'z8-fx12',
    name: 'Z8 FX-12 Sport (DB043-FX12)',
    tag: '+35,9%',
    marginPct: '26,4%',
    wholesale: 7800,
    retail: 10600,
    profit: 2800,
    power: '2000W Brushless + Módulo 12G-38A',
    range: 'Até 50-60 km (Lítio 60V 125Ah)',
    cnh: 'CONTRAN 996 // Gaiola + Baú + GPS',
    baseImg: '/assets/models/z8_fx12_studio.jpg',
    colors: [
      { name: 'Titanium Silver', hex: '#94A3B8', img: '/assets/models/z8_fx12_studio.jpg' },
      { name: 'Sunset Copper', hex: '#EA580C', img: '/assets/models/z8_fx12_orange.jpg' },
      { name: 'Obsidian Black', hex: '#181A1D', img: '/assets/models/z8_fx12_black.jpg' }
    ]
  },
  {
    id: 'z8-harley',
    name: 'Z8 Harley X12 Cruiser (XB-024)',
    tag: '+53,8%',
    marginPct: '35,0%',
    wholesale: 6500,
    retail: 10000,
    profit: 3500,
    power: '2000W Fat-Tire Chopper',
    range: 'Até 85 km (Lítio 60V 125Ah)',
    cnh: 'Isento CNH // CONTRAN 996',
    baseImg: '/assets/models/z8_harley_studio.jpg',
    colors: [
      { name: 'Crimson Red', hex: '#A6192E', img: '/assets/models/z8_harley_crimson.jpg' },
      { name: 'Brushed Silver', hex: '#B4B9BE', img: '/assets/models/z8_harley_silver.jpg' }
    ]
  },
  {
    id: 'z8-u2',
    name: 'Z8 U2 Delivery Cargo (XB-010)',
    tag: '+58,3%',
    marginPct: '36,8%',
    wholesale: 6000,
    retail: 9500,
    profit: 3500,
    power: '2000W Heavy Duty + 12G',
    range: 'Até 115 km (Lítio 60V 125Ah)',
    cnh: 'Frota Logística // B2B',
    baseImg: '/assets/models/z8_u2_studio.jpg',
    colors: [
      { name: 'Cargo Black', hex: '#1A1C1E', img: '/assets/models/z8_u2_black.jpg' },
      { name: 'Fleet White', hex: '#F3F5F7', img: '/assets/models/z8_u2_white.jpg' }
    ]
  },
  {
    id: 'z8-n710',
    name: 'Z8 N710 Plus Urban (DB045)',
    tag: '+79,2%',
    marginPct: '44,2%',
    wholesale: 5300,
    retail: 9500,
    profit: 4200,
    power: '1000W Smart CONTRAN + NFC',
    range: 'Até 75 km (Lítio 60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_n710_white.jpg',
    colors: [
      { name: 'Pearl White', hex: '#F2F4F7', img: '/assets/models/z8_n710_white.jpg' },
      { name: 'Piano Black', hex: '#141619', img: '/assets/models/z8_n710_black.jpg' },
      { name: 'British Emerald', hex: '#1E4D3B', img: '/assets/models/z8_n710_green.jpg' }
    ]
  },
  {
    id: 'z8-q10',
    name: 'Z8 Q10 Xiao Q Retro (DB038)',
    tag: '+69,0%',
    marginPct: '40,8%',
    wholesale: 5800,
    retail: 9800,
    profit: 4000,
    power: '1000W Euro Retro + NFC',
    range: 'Até 70-120 km (Lítio 60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_q11_studio.jpg',
    colors: [{ name: 'Amarelo Retrô Vintage', hex: '#DFB847', img: '/assets/models/z8_q11_studio.jpg' }]
  },
  {
    id: 'z8-q11',
    name: 'Z8 Q11 Love Boutique (DB043-Q11)',
    tag: '+78,8%',
    marginPct: '44,1%',
    wholesale: 5200,
    retail: 9300,
    profit: 4100,
    power: '1000W Boutique + 12G',
    range: 'Até 70 km (Lítio 60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_q10_studio.jpg',
    colors: [
      { name: 'Rosa Pastel Candy', hex: '#EAA9BA', img: '/assets/models/z8_q10_studio.jpg' },
      { name: 'Sage Mint', hex: '#769482', img: '/assets/models/z8_q10_green.jpg' },
      { name: 'Onyx Black', hex: '#1A1C1E', img: '/assets/models/z8_q10_black.jpg' }
    ]
  },
  {
    id: 'z8-diamond',
    name: 'Z8 Diamond King Kong (GS-052)',
    tag: '+100,0%',
    marginPct: '50,0%',
    wholesale: 3400,
    retail: 6800,
    profit: 3400,
    power: '500W Cobre Puro + Tela LCD',
    range: 'Até 50 km (Lítio 48V/60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_diamond_studio.jpg',
    colors: [{ name: 'Diamond Silver', hex: '#D0D5DD', img: '/assets/models/z8_diamond_studio.jpg' }]
  },
  {
    id: 'z8-n7',
    name: 'Z8 H26 (N7) Compact (DB001)',
    tag: '+72,7%',
    marginPct: '42,1%',
    wholesale: 5500,
    retail: 9500,
    profit: 4000,
    power: '1000W Compact Urban + NFC',
    range: 'Até 65 km (Lítio 60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_n7_studio.jpg',
    colors: [
      { name: 'Verde Esmeralda Standard', hex: '#1B4D3E', img: '/assets/models/z8_n7_studio.jpg' },
      { name: 'Preto Ônix Paulista', hex: '#141619', img: '/assets/models/z8_n7_black.jpg' },
      { name: 'Prata Titânio Urbano', hex: '#C0C5CA', img: '/assets/models/z8_n7_silver.jpg' }
    ]
  },
  {
    id: 'z8-gs005',
    name: 'Z8 GS-005 Golden Eagle',
    tag: '+93,8%',
    marginPct: '48,4%',
    wholesale: 3200,
    retail: 6200,
    profit: 3000,
    power: '500W Cobre Puro Pedelec',
    range: 'Até 50 km (Lítio 48V/60V 125Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_gs005_studio.jpg',
    colors: [{ name: 'Matte Graphite', hex: '#344054', img: '/assets/models/z8_gs005_studio.jpg' }]
  }
];

const fmtBRL = (val) =>
  Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

let currentLeadOrigin = 'Conceito Lando 1:1';

// 1. Safety Fallback for Page Transition Overlay
function initTransitionSafety() {
  const unlockPage = () => {
    const pageW = document.querySelector('.page-w');
    if (pageW && pageW.getAttribute('data-start') === 'hidden') {
      pageW.removeAttribute('data-start');
      pageW.style.opacity = '1';
      pageW.style.visibility = 'visible';
    }
    const transW = document.querySelector('.transition-w');
    if (transW) {
      transW.style.transition = 'opacity 0.55s ease';
      transW.style.opacity = '0';
      transW.style.pointerEvents = 'none';
      setTimeout(() => {
        transW.style.display = 'none';
      }, 600);
    }
  };

  const transBtn = document.querySelector('.transition-btn');
  if (transBtn) {
    transBtn.addEventListener('click', (e) => {
      e.preventDefault();
      unlockPage();
    });
  }

  setTimeout(unlockPage, 2600);
}

// 2. Z8 Motorcycle Spec & Color Drawer
window.openZ8ModelDrawer = function (modelId) {
  const model = Z8_FLEET.find((m) => m.id === modelId) || Z8_FLEET[0];
  const drawer = document.getElementById('z8-model-drawer');
  const body = document.getElementById('z8-drawer-body');
  if (!drawer || !body) return;

  // Pause smooth scroll engine so modal has full native scroll control
  if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
  if (typeof window.lenisStop === 'function') window.lenisStop();
  document.body.classList.add('z8-modal-active');
  document.documentElement.classList.add('z8-modal-active');

  const firstImg = model.colors?.[0]?.img || model.baseImg;
  const swatchesHtml = (model.colors || [])
    .map(
      (c, i) => `
      <button type="button" class="z8-swatch-btn ${i === 0 ? 'is-active' : ''}" data-img="${c.img}">
        <span class="swatch-dot" style="background:${c.hex}"></span>
        <span>${c.name}</span>
      </button>`
    )
    .join('');

  body.innerHTML = `
    <div class="z8-drawer-grid">
      <div>
        <div class="z8-drawer-img-wrap">
          <img id="z8-drawer-main-img" src="${firstImg}" alt="${model.name}" />
        </div>
        <div class="z8-drawer-swatches">${swatchesHtml}</div>
      </div>
      <div>
        <div class="z8-modal-badge">${model.cnh}</div>
        <h2 class="z8-modal-title">${model.name}</h2>
        <p class="z8-modal-subtitle">${model.power} — ${model.range}</p>
        <div class="z8-drawer-kpis">
          <div class="z8-drawer-kpi is-lime">
            <span>VALOR ATACADO UNITÁRIO (LAF)</span>
            <strong>${fmtBRL(model.wholesale)}</strong>
          </div>
          <div class="z8-drawer-kpi">
            <span>PREÇO VAREJO SUG.</span>
            <strong>${fmtBRL(model.retail)}</strong>
          </div>
          <div class="z8-drawer-kpi is-lime">
            <span>LUCRO LOJISTA / UN.</span>
            <strong>+${fmtBRL(model.profit)} (${model.marginPct})</strong>
          </div>
          <div class="z8-drawer-kpi is-lime">
            <span>MARKUP COMERCIAL</span>
            <strong>${model.tag}</strong>
          </div>
        </div>
        <button type="button" class="z8-drawer-cta" id="z8-drawer-order-portal-btn" style="margin-bottom:0.5rem;">
          VER FICHA LAF COMPLETA &amp; ADICIONAR AO PEDIDO ↱
        </button>
        <button type="button" class="z8-drawer-cta" id="z8-drawer-reserve-btn" style="background:rgba(255,255,255,0.08); color:#F4F5F7; border:1px solid rgba(255,255,255,0.2);">
          RESERVAR EXCLUSIVIDADE DESTA PRAÇA (RAIO 50 KM) ↱
        </button>
      </div>
    </div>
  `;

  body.querySelectorAll('.z8-swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('.z8-swatch-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const mainImg = document.getElementById('z8-drawer-main-img');
      if (mainImg && btn.dataset.img) mainImg.src = btn.dataset.img;
    });
  });

  const portalOrderBtn = document.getElementById('z8-drawer-order-portal-btn');
  if (portalOrderBtn) {
    portalOrderBtn.addEventListener('click', () => {
      window.closeZ8ModelDrawer();
      if (window.adjustLafQty) window.adjustLafQty(model.id, 1);
      const sheetEl = document.getElementById(`laf-sheet-${model.id}`) || document.getElementById('portal-lojista');
      if (sheetEl) sheetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const reserveBtn = document.getElementById('z8-drawer-reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
      window.closeZ8ModelDrawer();
      window.openLeadModal(`Drawer Modelo: ${model.name}`);
    });
  }

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');

  // Reset scroll to top of panel
  const panel = drawer.querySelector('.z8-drawer-panel');
  if (panel) panel.scrollTop = 0;
};

window.closeZ8ModelDrawer = function () {
  const drawer = document.getElementById('z8-model-drawer');
  if (drawer) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }
  const leadModal = document.getElementById('investor-lead-modal');
  const isLeadOpen = leadModal?.classList.contains('is-open');
  if (!isLeadOpen) {
    if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
    if (typeof window.lenisStart === 'function') window.lenisStart();
    document.body.classList.remove('z8-modal-active');
    document.documentElement.classList.remove('z8-modal-active');
  }
};

// 3. Interactive B2B DRE Profit Simulator
function initB2BSimulator() {
  const volInput = document.getElementById('z8-sim-volume');
  const volLabel = document.getElementById('z8-sim-volume-val');
  const modelSelect = document.getElementById('z8-sim-model');
  const revEl = document.getElementById('z8-sim-revenue');
  const workEl = document.getElementById('z8-sim-workshop');
  const profEl = document.getElementById('z8-sim-profit');
  const annEl = document.getElementById('z8-sim-annual');
  const presetBtns = document.querySelectorAll('.z8-preset-btn');

  if (!volInput || !modelSelect) return;

  const updateDRE = () => {
    const vol = parseInt(volInput.value, 10) || 15;
    const opt = modelSelect.options[modelSelect.selectedIndex];
    const unitProfit = parseInt(modelSelect.value, 10) || 2850;
    const unitRetail = parseInt(opt?.dataset?.retail || '9600', 10);
    const workshopNet = Math.round(3800 + vol * 175);
    const grossRevenue = vol * unitRetail + workshopNet;
    const monthlyProfit = vol * unitProfit + workshopNet;
    const annualProfit = monthlyProfit * 12;

    if (volLabel) volLabel.textContent = `${vol} MOTOS / MÊS`;
    if (revEl) revEl.textContent = fmtBRL(grossRevenue);
    if (workEl) workEl.textContent = `+${fmtBRL(workshopNet)}/mês`;
    if (profEl) profEl.textContent = fmtBRL(monthlyProfit);
    if (annEl) annEl.textContent = fmtBRL(annualProfit);

    presetBtns.forEach((b) => {
      b.classList.toggle('is-active', parseInt(b.dataset.vol, 10) === vol);
    });
  };

  volInput.addEventListener('input', updateDRE);
  modelSelect.addEventListener('change', updateDRE);
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      volInput.value = btn.dataset.vol;
      updateDRE();
    });
  });

  updateDRE();
}

// 4. Territorial Exclusivity Radar (Até 50km)
function initTerritoryRadar() {
  const input = document.getElementById('z8-city-input');
  const btn = document.getElementById('z8-city-btn');
  const res = document.getElementById('z8-city-result');
  if (!input || !btn || !res) return;

  const occupiedBases = ['sao jose dos campos', 'pindamonhangaba', 'taubate', 'santana de parnaiba'];

  const checkCity = () => {
    const raw = input.value.trim();
    if (!raw) {
      input.focus();
      return;
    }
    const norm = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const isOccupied = occupiedBases.some((city) => norm.includes(city));
    const leadCityInput = document.getElementById('lead-city');
    if (leadCityInput) leadCityInput.value = raw;

    if (isOccupied) {
      res.innerHTML = `
        <div class="z8-city-status-dot" style="background:#eab308;box-shadow:0 0 0 4px rgba(234,179,8,0.25)"></div>
        <div class="z8-city-status-text">
          <strong>UNIDADE ATIVA // CONSULTAR COTA REGIONAL EM ${raw.toUpperCase()}</strong>
          <span>Já possuímos operação credenciada nesta microrregião. Solicite avaliação de segundo polígono ou cidade adjacente.</span>
        </div>
      `;
    } else {
      res.innerHTML = `
        <div class="z8-city-status-dot" style="background:#16a34a;box-shadow:0 0 0 4px rgba(22,163,74,0.25)"></div>
        <div class="z8-city-status-text">
          <strong>DISPONÍVEL // RAIO DE ATÉ 50 KM LIVRE EM ${raw.toUpperCase()}</strong>
          <span>Praça apta para bloqueio contratual imediato (Art. 784, III CPC). Clique abaixo para receber a COF e reservar.</span>
        </div>
      `;
    }
  };

  btn.addEventListener('click', checkCity);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkCity();
    }
  });
}

// 5. Instagram Impact Lead Modal (#investor-lead-modal)
window.openLeadModal = function (origin = 'Conceito Direct CTA') {
  currentLeadOrigin = origin;
  const modal = document.getElementById('investor-lead-modal');
  if (!modal) return;

  if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
  if (typeof window.lenisStop === 'function') window.lenisStop();
  document.body.classList.add('z8-modal-active');
  document.documentElement.classList.add('z8-modal-active');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  sessionStorage.setItem('z8_conceito_modal_shown', '1');

  const dialog = modal.querySelector('.z8-modal-dialog');
  if (dialog) dialog.scrollTop = 0;
};

window.closeLeadModal = function () {
  const modal = document.getElementById('investor-lead-modal');
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
  const drawer = document.getElementById('z8-model-drawer');
  const isDrawerOpen = drawer?.classList.contains('is-open');
  if (!isDrawerOpen) {
    if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
    if (typeof window.lenisStart === 'function') window.lenisStart();
    document.body.classList.remove('z8-modal-active');
    document.documentElement.classList.remove('z8-modal-active');
  }
};

function initLeadModal() {
  const modal = document.getElementById('investor-lead-modal');
  const drawer = document.getElementById('z8-model-drawer');
  const form = document.getElementById('investor-lead-form');

  // Isolate wheel & touchmove bubbling so Lenis/window never intercepts modal scrolls
  const stopScrollBubbling = (el) => {
    if (!el) return;
    el.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    el.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
  };
  stopScrollBubbling(drawer);
  stopScrollBubbling(modal);
  stopScrollBubbling(drawer?.querySelector('.z8-drawer-panel'));
  stopScrollBubbling(modal?.querySelector('.z8-modal-dialog'));

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeLeadModal();
    });
  }
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) window.closeZ8ModelDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeLeadModal();
      window.closeZ8ModelDrawer();
    }
  });

  // Check URL params (?lead=1 or ?igm=1) or 18-second Instagram impact timer
  const params = new URLSearchParams(window.location.search);
  if (params.get('lead') === '1' || params.get('igm') === '1') {
    setTimeout(() => window.openLeadModal('Instagram Ad Deep-Link'), 1500);
  } else if (!sessionStorage.getItem('z8_conceito_modal_shown')) {
    setTimeout(() => {
      const isDrawerOpen = drawer?.classList.contains('is-open');
      if (!isDrawerOpen && !sessionStorage.getItem('z8_conceito_modal_shown')) {
        window.openLeadModal('Instagram Impact Timer 18s');
      }
    }, 18000);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('lead-submit-btn');
      const name = document.getElementById('lead-name')?.value?.trim() || '';
      const whatsapp = document.getElementById('lead-whatsapp')?.value?.trim() || '';
      const city = document.getElementById('lead-city')?.value?.trim() || '';
      const capital = document.getElementById('lead-capital')?.value || '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SINCRONIZANDO DOSSIÊ COM A MATRIZ Z8...';
      }

      const payload = {
        name,
        whatsapp,
        city,
        capital,
        source: `Conceito Lando 1:1 (${currentLeadOrigin})`,
        createdAt: new Date().toISOString()
      };

      try {
        const { db } = initFirebase();
        if (db) {
          const leadId = 'lead_conceito_' + Date.now();
          await Promise.race([
            setDoc(doc(db, 'leads', leadId), { id: leadId, ...payload }),
            new Promise((r) => setTimeout(r, 2500))
          ]);
        }
      } catch (_) {}

      try {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (_) {}

      const msg = encodeURIComponent(
        `Olá, Christian! Estive conhecendo a proposta da Z8 E-Motion através da página Conceito.\n\n` +
          `*Nome:* ${name}\n` +
          `*Cidade / Região de Interesse:* ${city}\n` +
          `*Capital Previsto para Implantação:* ${capital}\n` +
          `*WhatsApp de Contato:* ${whatsapp}\n\n` +
          `Gostaria de receber o estudo de viabilidade territorial, a Circular de Oferta de Franquia (COF) e conversar sobre os planos para a minha comarca.`
      );

      window.closeLeadModal();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SOLICITAR ESTUDO DE VIABILIDADE TERRITORIAL ↱';
      }
      window.open(`https://wa.me/5512998008818?text=${msg}`, '_blank');
    });
  }
}

function initMarqueeSignatureScroll() {
  const sigTarget = document.querySelector('.marquee-gl-rive-target');
  if (!sigTarget) return;
  const onScroll = () => {
    const threshold = window.innerHeight * 0.42;
    sigTarget.classList.toggle('is-sig-visible', window.scrollY > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Continuous Viewport & Scroll Physics Engine: 1.6x Motorcycle Dynamic Approach Animation
 * Advances left & right motorcycles inward toward the text as the user scrolls down
 */
function initOtotBikesAnimation() {
  const section = document.querySelector('.s.is-otot-home');
  const leftWrap = document.querySelector('.otot-home-img-w.is-1');
  const rightWrap = document.querySelector('.otot-home-img-w.is-2');

  if (!section || !leftWrap || !rightWrap) return;

  // Lock solid opacity and hardware-accelerated transforms
  leftWrap.style.opacity = '1';
  rightWrap.style.opacity = '1';
  leftWrap.style.willChange = 'transform';
  rightWrap.style.willChange = 'transform';

  let isNear = true;
  let lastLeftX = null;
  let lastRightX = null;

  const updateBikes = () => {
    if (!isNear) return;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 800;

    // Start advancing when top of section enters 95% of viewport
    const startY = vh * 0.95;
    // Finish when bottom of section approaches top of viewport
    const endY = -rect.height * 0.15;

    const totalDistance = startY - endY;
    const currentDistance = startY - rect.top;

    // Clamp progress between 0 and 1
    const p = Math.max(0, Math.min(1, currentDistance / totalDistance));

    // Smooth quadratic ease-out deceleration: rapid dynamic entrance, smooth resting clamp
    const ease = 1 - Math.pow(1 - p, 2.0);

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 991;

    // Calibrated travel distances:
    // Advance dynamically from the outer flanks and rest cleanly before touching the copy
    const startOffset = isMobile ? 26 : (isTablet ? 18 : 24);
    const endOffset = isMobile ? 19 : (isTablet ? 9 : 14.5);

    // Left bike: travels from -startOffset to -endOffset (framing ON SHOWROOM without touching text)
    const leftX = (-startOffset + (-endOffset - (-startOffset)) * ease).toFixed(2);
    // Right bike: travels from +startOffset to +endOffset (framing OFF OFICINA without touching text)
    const rightX = (startOffset + (endOffset - startOffset) * ease).toFixed(2);

    if (leftX !== lastLeftX || rightX !== lastRightX) {
      lastLeftX = leftX;
      lastRightX = rightX;
      leftWrap.style.transform = `translate3d(${leftX}vw, 0px, 0px)`;
      rightWrap.style.transform = `translate3d(${rightX}vw, 0px, 0px)`;
    }
  };

  // Continuous frame loop when in view for guaranteed smooth 60fps/120fps motion
  let rafId = null;
  const tickLoop = () => {
    updateBikes();
    rafId = requestAnimationFrame(tickLoop);
  };

  // Optimize performance: only run the RAF loop when section is near the viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isNear = entry.isIntersecting;
          if (isNear) {
            updateBikes();
            if (!rafId) rafId = requestAnimationFrame(tickLoop);
          } else if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { rootMargin: '300px 0px 300px 0px' }
    );
    observer.observe(section);
  } else {
    rafId = requestAnimationFrame(tickLoop);
  }

  // Also hook into scroll, Lenis, and resize events
  window.addEventListener('scroll', updateBikes, { passive: true });
  window.addEventListener('resize', updateBikes, { passive: true });

  const pollLenis = () => {
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', updateBikes);
    } else {
      setTimeout(pollLenis, 150);
    }
  };
  pollLenis();

  // Initial render
  updateBikes();
}

// 8. Mobile Menu Body Scroll Lock & Touch Coordination
function initMobileMenuScrollLock() {
  const navMenu = document.querySelector('[data-nav-m]');
  const navHam = document.querySelector('[data-nav-ham]');
  if (!navMenu || !navHam) return;

  const syncMenuLock = () => {
    const isExpanded = navHam.getAttribute('aria-expanded') === 'true';
    const isDisplayFlex = window.getComputedStyle(navMenu).display === 'flex';
    const isOpen = isExpanded || isDisplayFlex;

    if (isOpen) {
      document.body.classList.add('nav-menu-active');
    } else {
      document.body.classList.remove('nav-menu-active');
    }
  };

  const observer = new MutationObserver(syncMenuLock);
  observer.observe(navHam, { attributes: true, attributeFilter: ['aria-expanded', 'aria-label'] });
  observer.observe(navMenu, { attributes: true, attributeFilter: ['style', 'class'] });

  navHam.addEventListener('click', () => {
    setTimeout(syncMenuLock, 50);
    setTimeout(syncMenuLock, 350);
  });
}


// ==========================================================================
// 9. MENU-STYLED AUTH CONTROLLER & REACTIVE PERMISSIONS
// ==========================================================================
function switchAuthTab(tabName) {
  document.querySelectorAll('#z8-auth-modal .z8-auth-tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === tabName);
  });
  const boxLogin = document.getElementById('z8-auth-box-login');
  const boxRegister = document.getElementById('z8-auth-box-register');
  const boxForgot = document.getElementById('z8-auth-box-forgot');

  if (boxLogin) boxLogin.style.display = tabName === 'login' ? 'block' : 'none';
  if (boxRegister) boxRegister.style.display = tabName === 'register' ? 'block' : 'none';
  if (boxForgot) boxForgot.style.display = tabName === 'forgot' ? 'block' : 'none';
}

export function openZ8AuthModal(tabName = 'login') {
  const modal = document.getElementById('z8-auth-modal');
  if (!modal) return;
  modal.classList.add('is-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('z8-modal-active');
  if (window.lenis) window.lenis.stop();
  switchAuthTab(tabName);
}

export function closeZ8AuthModal() {
  const modal = document.getElementById('z8-auth-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('z8-modal-active');
  if (window.lenis) window.lenis.start();
}

window.openZ8AuthModal = openZ8AuthModal;
window.closeZ8AuthModal = closeZ8AuthModal;

function updateNavMenuAuthText(text) {
  const txtEl = document.getElementById('nav-menu-link-login-text');
  const linkEl = document.getElementById('nav-menu-link-login');
  if (!txtEl || !linkEl) return;

  // If text already matches or unauthenticated on page load, do not touch DOM so lando-engine handles it cleanly
  const currentText = txtEl.getAttribute('data-current-text') || 'Área do Parceiro';
  if (currentText === text && txtEl.querySelector('.char')) {
    return;
  }
  if (!txtEl.hasAttribute('data-current-text') && text === 'Área do Parceiro') {
    txtEl.setAttribute('data-current-text', text);
    return;
  }
  txtEl.setAttribute('data-current-text', text);

  // Rebuild only upon authenticated state transition
  txtEl.innerHTML = '';
  const chars = [];
  for (let ch of text) {
    if (ch === ' ') {
      txtEl.appendChild(document.createTextNode(' '));
    } else {
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch;
      txtEl.appendChild(span);
      chars.push(span);
    }
  }

  const srClone = linkEl.querySelector('[screen-reader]');
  if (srClone) srClone.textContent = text;

  const getShift = () => window.innerWidth < 480 ? "-4.3rem" : "-5.25rem";
  linkEl.onmouseenter = () => {
    if (window.gsap) {
      window.gsap.to(chars, { y: getShift(), duration: 0.6, stagger: 0.02, ease: "power3.out", overwrite: true });
    }
  };
  linkEl.onmouseleave = () => {
    if (window.gsap) {
      window.gsap.to(chars, { y: 0, duration: 0.6, stagger: 0.02, ease: "power3.out", overwrite: true });
    }
  };
}

window.openZ8MenuAuth = function() {
  if (window.openPortalLojista) {
    window.openPortalLojista('all');
  } else {
    document.getElementById('portal-lojista')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function syncConceitoAuthState() {
  const user = getCurrentCatalogUser();
  const approved = isCatalogApproved();
  const admin = isUserAdmin(user);

  // 1. Header Buttons & Partner Badge
  const franquiaBtn = document.getElementById('btn-header-franquia');
  const partnerBadge = document.getElementById('header-partner-badge');
  const partnerName = document.getElementById('header-partner-name');
  const loginBtn = document.getElementById('btn-header-login');
  const logoutBtn = document.getElementById('btn-header-logout');
  const adminBtn = document.getElementById('btn-header-admin');

  if (user) {
    document.documentElement.classList.add('is-poslogin-direct');
    document.body.classList.add('is-poslogin-direct');

    const transitionW = document.querySelector('.transition-w');
    if (transitionW) {
      transitionW.style.display = 'none';
      transitionW.style.pointerEvents = 'none';
      transitionW.style.opacity = '0';
    }
    const pageW = document.querySelector('.page-w');
    if (pageW) {
      pageW.removeAttribute('data-start');
      pageW.style.opacity = '1';
      pageW.style.visibility = 'visible';
    }

    if (franquiaBtn) franquiaBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    if (partnerBadge) { partnerBadge.style.display = "none"; }

    if (adminBtn) {
      adminBtn.style.display = admin ? 'inline-flex' : 'none';
    }
  } else {
    document.documentElement.classList.remove('is-poslogin-direct');
    document.body.classList.remove('is-poslogin-direct');

    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (partnerBadge) partnerBadge.style.display = 'none';
  }

  updateNavMenuAuthText(admin ? 'Portal Lojista' : 'Portal Lojista');
  syncPortalLojistaUser();

  document.querySelectorAll('.helmet-grid-item-w[data-model-index]').forEach((card) => {
    const idx = parseInt(card.getAttribute('data-model-index'), 10);
    const model = Z8_FLEET[idx];
    if (!model) return;

    const pricePill = card.querySelector('.z8-tel-profit');
    if (pricePill) {
      pricePill.textContent = `Atacado ${fmtBRL(model.wholesale)}`;
    }

    const hudRows = card.querySelectorAll('.z8-hud-row');
    if (hudRows && hudRows.length >= 3) {
      hudRows[0].innerHTML = `<span>ATACADO B2B</span><strong style="color:#00F0FF;">${fmtBRL(model.wholesale)}</strong>`;
      hudRows[1].innerHTML = `<span>VAREJO SUG.</span><strong>${fmtBRL(model.retail)}</strong>`;
      hudRows[2].innerHTML = `<span>LUCRO LOJISTA</span><strong>+${fmtBRL(model.profit)} (${model.tag})</strong>`;
    }
  });
}

function initConceitoAuthEvents() {
  // Tabs
  document.querySelectorAll('#z8-auth-modal .z8-auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Close buttons & Backdrop
  document.querySelectorAll('#z8-auth-modal [data-close-auth]').forEach((btn) => {
    btn.addEventListener('click', closeZ8AuthModal);
  });
  const modal = document.getElementById('z8-auth-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeZ8AuthModal();
    });
  }

  // Quick Admin Pre-fill
  document.getElementById('btn-quick-admin-login')?.addEventListener('click', () => {
    const userField = document.getElementById('auth-login-user');
    const passField = document.getElementById('auth-login-pass');
    if (userField) userField.value = 'christian.tkh@gmail.com';
    if (passField) passField.value = '123456';
  });

  // Switch to forgot tab
  document.getElementById('btn-goto-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab('forgot');
  });
  document.getElementById('btn-forgot-back')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab('login');
  });

  // Toggle Password visibility
  document.querySelectorAll('#z8-auth-modal .z8-pass-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  // 1-Click Google Login
  const handleGoogleAuth = async () => {
    try {
      const res = await loginWithGoogle();
      if (res && res.success) {
        closeZ8AuthModal();
        syncConceitoAuthState();
        window.openPortalLojista && window.openPortalLojista('all');
      } else {
        alert(res?.error || res?.message || 'Não foi possível concluir o login com o Google.');
      }
    } catch (err) {
      alert('Erro na autenticação Google: ' + err.message);
    }
  };
  document.getElementById('btn-google-login')?.addEventListener('click', handleGoogleAuth);
  document.getElementById('btn-google-reg')?.addEventListener('click', handleGoogleAuth);

  // Form Submissions
  const loginForm = document.getElementById('z8-auth-form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userVal = document.getElementById('auth-login-user')?.value;
      const passVal = document.getElementById('auth-login-pass')?.value;
      const msgBox = document.getElementById('auth-login-msg');

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.className = 'z8-auth-msg';
        msgBox.textContent = 'Verificando credenciais...';
      }

      const res = await loginCatalogUser(userVal, passVal);
      if (res.success) {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-success';
          msgBox.textContent = 'Acesso validado com sucesso! Redirecionando...';
        }
        setTimeout(() => {
          closeZ8AuthModal();
          syncConceitoAuthState();
          window.openPortalLojista && window.openPortalLojista('all');
        }, 500);
      } else {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-error';
          msgBox.textContent = res.error || res.message || 'Usuário ou senha inválidos.';
        }
      }
    });
  }

  const regForm = document.getElementById('z8-auth-form-register');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-reg-name')?.value;
      const company = document.getElementById('auth-reg-company')?.value;
      const city = document.getElementById('auth-reg-city')?.value;
      const state = document.getElementById('auth-reg-state')?.value;
      const email = document.getElementById('auth-reg-email')?.value;
      const phone = document.getElementById('auth-reg-phone')?.value;
      const password = document.getElementById('auth-reg-pass')?.value;
      const msgBox = document.getElementById('auth-reg-msg');

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.className = 'z8-auth-msg';
        msgBox.textContent = 'Enviando proposta de credenciamento...';
      }

      const res = await registerCatalogUser({ name, company, city, state, email, phone, password });
      if (res.success) {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-success';
          msgBox.textContent = 'Cadastro enviado! Sua solicitação está em análise pela diretoria de expansão.';
        }
        setTimeout(() => {
          closeZ8AuthModal();
          syncConceitoAuthState();
        }, 1200);
      } else {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-error';
          msgBox.textContent = res.error || res.message || 'Erro ao registrar usuário.';
        }
      }
    });
  }

  const forgotForm = document.getElementById('z8-auth-form-forgot');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-forgot-email')?.value;
      const msgBox = document.getElementById('auth-forgot-msg');

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.className = 'z8-auth-msg';
        msgBox.textContent = 'Enviando link de recuperação...';
      }

      const res = await requestPasswordResetEmail(email);
      if (res.success) {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-success';
          msgBox.textContent = 'E-mail de recuperação enviado com sucesso!';
        }
      } else {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-error';
          msgBox.textContent = res.error || 'Erro ao enviar e-mail de recuperação.';
        }
      }
    });
  }

  // Initial Sync
  syncConceitoAuthState();
  window.addEventListener('z8-catalog-auth-changed', syncConceitoAuthState);
}

// 7. PÓS-VENDA & GESTÃO DE ORDENS DE SERVIÇO (OS)
// ==========================================================================
export function loadOSTable(searchTerm = '') {
  const tbody = document.getElementById('posvenda-os-table-body');
  if (!tbody) return;

  const user = getCurrentCatalogUser();
  const isMaster = isUserAdmin(user);
  let orders = isMaster ? getStoredWarrantyOrders() : getWarrantyOrdersForUser(user);

  if (searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    orders = orders.filter((o) =>
      (o.id && o.id.toLowerCase().includes(term)) ||
      (o.chassi && o.chassi.toLowerCase().includes(term)) ||
      (o.model && o.model.toLowerCase().includes(term)) ||
      (o.company && o.company.toLowerCase().includes(term))
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 2rem; text-align: center; color: rgba(244,244,237,0.5);">
          Nenhuma Ordem de Serviço encontrada. Clique em "ABRIR NOVA ORDEM DE SERVIÇO" para registrar um chamado técnico.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders.map((o) => {
    let statusBg = 'rgba(245,158,11,0.15)';
    let statusColor = '#F59E0B';
    let statusText = o.statusText || 'Em Análise';

    if (o.status === 'approved') {
      statusBg = 'rgba(16,185,129,0.15)';
      statusColor = '#10B981';
      statusText = 'Aprovado / Expedição';
    } else if (o.status === 'completed') {
      statusBg = 'rgba(0,240,255,0.15)';
      statusColor = '#00F0FF';
      statusText = 'Concluído';
    } else if (o.status === 'rejected') {
      statusBg = 'rgba(239,68,68,0.15)';
      statusColor = '#EF4444';
      statusText = 'Reprovado';
    }

    const adminActionBtn = isMaster && o.status !== 'approved'
      ? `<button type="button" onclick="window.approveOS('${o.id}')" style="background:#10B981; color:#0A0B0E; border:none; border-radius:3px; padding:3px 8px; font-weight:800; font-size:0.72rem; cursor:pointer;">Aprovar</button>`
      : '';

    return `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <td style="padding: 0.75rem 1rem; font-weight: 800; color: #00F0FF;">${o.id}</td>
        <td style="padding: 0.75rem 1rem; color: #FFF;">${o.model}</td>
        <td style="padding: 0.75rem 1rem; color: rgba(244,244,237,0.7); font-family: monospace;">${o.chassi || '-'}</td>
        <td style="padding: 0.75rem 1rem; color: rgba(244,244,237,0.85);">${o.company || 'Matriz'}</td>
        <td style="padding: 0.75rem 1rem; text-align: center;">
          <span style="background:${statusBg}; color:${statusColor}; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">
            ${statusText}
          </span>
        </td>
        <td style="padding: 0.75rem 1rem; text-align: right;">
          <button type="button" onclick="alert('Laudo Técnico OS ${o.id}:\\n\\nComponente: ${o.component || 'N/A'}\\nDiagnóstico: ${o.diagnosis || 'N/A'}\\nObservações: ${o.adminNotes || 'N/A'}')" style="background:rgba(255,255,255,0.08); color:#FFF; border:1px solid rgba(255,255,255,0.15); border-radius:3px; padding:3px 8px; font-size:0.72rem; cursor:pointer; margin-right:4px;">
            Ver Laudo
          </button>
          ${adminActionBtn}
        </td>
      </tr>
    `;
  }).join('');
}

window.approveOS = function(osId) {
  updateWarrantyOrderStatus(osId, 'approved', 'Aprovado - Peça Despachada');
  loadOSTable();
  alert(`OS ${osId} aprovada com sucesso! Peça de reposição liberada para despacho.`);
};

export function openNewOSModal() {
  const modal = document.getElementById('new-os-modal');
  if (!modal) return;

  const modelSelect = document.getElementById('os-form-model');
  if (modelSelect) {
    modelSelect.innerHTML = Z8_FLEET.map((m) => `<option value="${m.name}">${m.name} (${m.cnh || m.category})</option>`).join('');
  }

  modal.classList.add('is-active');
  modal.style.display = 'flex';
  window.lenis?.stop();
}

export function closeNewOSModal() {
  const modal = document.getElementById('new-os-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.style.display = 'none';
  window.lenis?.start();
}

window.openNewOSModal = openNewOSModal;
window.closeNewOSModal = closeNewOSModal;

window.handleCreateOS = function(event) {
  event.preventDefault();
  const user = getCurrentCatalogUser();
  if (!user) {
    alert('É necessário estar conectado como concessionário para registrar uma Ordem de Serviço.');
    return;
  }

  const model = document.getElementById('os-form-model')?.value;
  const chassi = document.getElementById('os-form-chassis')?.value;
  const km = document.getElementById('os-form-km')?.value;
  const type = document.getElementById('os-form-type')?.value;
  const desc = document.getElementById('os-form-desc')?.value;

  const orderData = {
    model,
    chassi,
    odometer: km,
    component: type === 'pdi' ? 'Revisão Técnica PDI' : (type === 'garantia' ? 'Bateria 72V / Módulo FOC' : 'Revisão Preventiva'),
    diagnosis: desc
  };

  saveWarrantyOrder(orderData, user);
  closeNewOSModal();
  loadOSTable();
  alert(`Ordem de Serviço aberta com sucesso para o chassi ${chassi}! O protocolo técnico foi transmitido à Matriz.`);
};

// ==========================================================================
// 8. ADMIN MASTER MODAL CONTROLLER (CHRISTIAN HIDEYUKI)
// ==========================================================================
export function openAdminModal() {
  const modal = document.getElementById('admin-master-modal');
  if (!modal) return;
  modal.classList.add('is-active');
  modal.style.display = 'flex';
  window.lenis?.stop();
  loadAdminUsersList();
}

export function closeAdminModal() {
  const modal = document.getElementById('admin-master-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.style.display = 'none';
  window.lenis?.start();
}

function loadAdminUsersList() {
  subscribeToUsersRealtime((users) => {
    const listEl = document.getElementById('admin-users-table-body');
    const pendingEl = document.getElementById('admin-stat-pending');
    const approvedEl = document.getElementById('admin-stat-approved');
    const osEl = document.getElementById('admin-stat-os');

    if (!listEl) return;

    let pendingCount = 0;
    let approvedCount = 0;

    users.forEach((u) => {
      if (u.status === 'pending') pendingCount++;
      if (u.status === 'approved') approvedCount++;
    });

    const orders = getStoredWarrantyOrders();

    if (pendingEl) pendingEl.textContent = pendingCount;
    if (approvedEl) approvedEl.textContent = approvedCount;
    if (osEl) osEl.textContent = orders.length;

    listEl.innerHTML = users
      .map((u) => {
        const isApp = u.status === 'approved';
        return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 0.75rem 1rem;">
            <strong style="color: #FFF; display: block;">${u.name || 'Sem Nome'}</strong>
            <span style="font-size: 0.72rem; color: rgba(244,244,237,0.6);">${u.company || 'Empresa'} • ${u.email}</span>
          </td>
          <td style="padding: 0.75rem 1rem; color: rgba(244,244,237,0.8);">${u.city || 'SP'}/${u.state || 'SP'}</td>
          <td style="padding: 0.75rem 1rem; color: #00F0FF;">${u.phone || 'N/A'}</td>
          <td style="padding: 0.75rem 1rem;">
            <span style="font-size:0.72rem; padding:2px 8px; border-radius:4px; font-weight:700; ${isApp ? 'background:rgba(16,185,129,0.15); color:#10B981;' : 'background:rgba(245,158,11,0.15); color:#F59E0B;'}">
              ${isApp ? 'Aprovado' : 'Pendente'}
            </span>
          </td>
          <td style="padding: 0.75rem 1rem; text-align: right;">
            ${
              !isApp
                ? `<button type="button" onclick="window.approveUser && window.approveUser('${u.id || u.email}')" style="background:#10B981; color:#0A0B0E; border:none; padding:4px 10px; border-radius:4px; font-weight:800; font-size:0.74rem; cursor:pointer;">Aprovar 1-Clique</button>`
                : `<button type="button" onclick="window.rejectUser && window.rejectUser('${u.id || u.email}')" style="background:rgba(239,68,68,0.2); color:#EF4444; border:1px solid rgba(239,68,68,0.4); padding:4px 10px; border-radius:4px; font-weight:700; font-size:0.74rem; cursor:pointer;">Suspender</button>`
            }
          </td>
        </tr>
      `;
      })
      .join('');
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // Direct URL parameter for instant Post-Login evaluation: ?poslogin=1 or ?auth=admin
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('poslogin') === '1' || urlParams.get('auth') === 'admin' || urlParams.get('admin') === '1') {
    const adminUser = {
      id: 'user_admin_01',
      name: 'Christian Hideyuki (Admin Master)',
      company: 'Z8 E-Motion Brasil (Matriz)',
      city: 'São Paulo - SP',
      email: 'christian.tkh@gmail.com',
      phone: '(12) 99800-8818',
      role: 'admin',
      status: 'approved',
      updatedAt: Date.now(),
      createdAt: '2026-08-25T16:08:04.281Z'
    };
    sessionStorage.setItem('z8_catalog_auth_session', 'authenticated_active_catalog');
    sessionStorage.setItem('z8_catalog_auth_user', JSON.stringify(adminUser));
    localStorage.setItem('z8_catalog_auth_user', JSON.stringify(adminUser));
  } else if (urlParams.get('logout') === '1') {
    sessionStorage.removeItem('z8_catalog_auth_session');
    sessionStorage.removeItem('z8_catalog_auth_user');
    localStorage.removeItem('z8_catalog_auth_user');
    localStorage.removeItem('z8_catalog_auth_token');
  }

  initTransitionSafety();
  renderPortalLojistaLAF();
  initMarqueeSignatureScroll();
  initOtotBikesAnimation();
  initB2BSimulator();
  initTerritoryRadar();
  initLeadModal();
  initMobileMenuScrollLock();
  initConceitoAuthEvents();
  // Live search for OS
  const searchInput = document.getElementById('os-search-input');
  searchInput?.addEventListener('input', (e) => {
    loadOSTable(e.target.value);
  });
  loadOSTable();
  window.openNewOSModal = openNewOSModal;
  window.closeNewOSModal = closeNewOSModal;
  window.handleCreateOS = handleCreateOS;


  if (urlParams.get('login') === '1' || urlParams.get('modal') === '1' || urlParams.get('auth') === '1') {
    const intro = document.querySelector('.intro');
    if (intro) intro.style.display = 'none';
    unlockPage();
    const modal = document.getElementById('z8-auth-modal');
    if (modal) {
      modal.classList.add('is-active');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
    }
    if (typeof switchAuthTab === 'function') switchAuthTab('login');
  }

  if (urlParams.get('scrollto')) {
    const targetId = urlParams.get('scrollto');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    }, 150);
  }

  if (getCurrentCatalogUser()) {
    setTimeout(() => {
      if (!urlParams.get('scrollto')) {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    }, 50);
  }
});

