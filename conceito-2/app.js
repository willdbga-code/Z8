/**
 * Z8 E-MOTION // CONCEITO 2 — INTEGRATED AUTH & ADVANCED MOTION ENGINE
 * Combines 1:1 Authentic Lando Norris REA Motion Experience with Full Pre/Post Login Architecture
 * Converted into Wholesale Selling Machine (Lote 10 Motos // Raio de Até 50 km)
 */

import { z8Models } from '../site-principal/data/models.js';
import { franchiseTiers, complianceInfo } from '../site-principal/data/franchiseInfo.js';
import {
  getStoredWarrantyOrders,
  getWarrantyOrdersForUser,
  saveWarrantyOrder,
  updateWarrantyOrderStatus,
  fetchWarrantyOrdersFromFirestore
} from '../site-principal/data/warranty-db.js';
import {
  loginCatalogUser,
  loginWithGoogle,
  registerCatalogUser,
  resetCatalogUserPassword,
  requestPasswordResetEmail,
  getCurrentCatalogUser,
  isCatalogApproved,
  isUserAdmin,
  logoutCatalogUser,
  subscribeToUsersRealtime,
  updateUserStatus,
  deleteCatalogUser,
  getCloudSyncStatus
} from '../site-principal/catalog-auth.js';
import { renderPortalLojistaLAF, syncPortalLojistaUser } from '../site-principal/portal-lojista-laf.js';

// ==========================================================================
// 1. DATA ENRICHMENT: 11 MODELS FLEET (TECH DATA + STUDIO COLOR SWATCHES)
// ==========================================================================
const MODEL_COLORS_MAP = {
  'z8-tank-2': [
    { name: 'Pearl White Trail', hex: '#F1F5F9', img: '/assets/models/z8_tank2_studio.jpg' },
    { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank2_black.jpg' },
    { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank2_amber.jpg' }
  ],
  'z8-fx12': [
    { name: 'Titanium Silver', hex: '#94A3B8', img: '/assets/models/z8_fx12_studio.jpg' },
    { name: 'Sunset Copper', hex: '#EA580C', img: '/assets/models/z8_fx12_orange.jpg' },
    { name: 'Obsidian Black', hex: '#181A1D', img: '/assets/models/z8_fx12_black.jpg' }
  ],
  'z8-tank': [
    { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank_amber.jpg' },
    { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank_black.jpg' },
    { name: 'Titanium Matte', hex: '#7C8288', img: '/assets/models/z8_tank_titanium.jpg' }
  ],
  'z8-n95c': [
    { name: 'Graphite Orange', hex: '#484C52', img: '/assets/models/z8_n95c_studio.jpg' },
    { name: 'Obsidian Black', hex: '#141518', img: '/assets/models/z8_n95c_black.jpg' },
    { name: 'Pearl White', hex: '#EAECEF', img: '/assets/models/z8_n95c_white.jpg' }
  ],
  'z8-fx10': [
    { name: 'Cyber Silver', hex: '#8A929A', img: '/assets/models/z8_fx10_studio.jpg' },
    { name: 'Stealth Black', hex: '#15171A', img: '/assets/models/z8_fx10_black.jpg' },
    { name: 'Glacier White', hex: '#F0F2F5', img: '/assets/models/z8_fx10_white.jpg' }
  ],
  'z8-harley-x12': [
    { name: 'Crimson Red', hex: '#8B1E28', img: '/assets/models/z8_harley_crimson.jpg' },
    { name: 'Brushed Silver', hex: '#A8AFB7', img: '/assets/models/z8_harley_silver.jpg' },
    { name: 'Black Edition', hex: '#141518', img: '/assets/models/z8_harley_studio.jpg' }
  ],
  'z8-u2-delivery': [
    { name: 'Industrial White', hex: '#E8EAED', img: '/assets/models/z8_u2_white.jpg' },
    { name: 'Cargo Black', hex: '#1A1C1E', img: '/assets/models/z8_u2_black.jpg' },
    { name: 'Studio Grey', hex: '#5A6068', img: '/assets/models/z8_u2_studio.jpg' }
  ],
  'z8-n710': [
    { name: 'Pearl White', hex: '#F2F4F7', img: '/assets/models/z8_n710_white.jpg' },
    { name: 'Piano Black', hex: '#141619', img: '/assets/models/z8_n710_black.jpg' },
    { name: 'British Emerald', hex: '#1E4D3B', img: '/assets/models/z8_n710_green.jpg' }
  ],
  'z8-q10': [
    { name: 'Amarelo Retrô Vintage', hex: '#DFB847', img: '/assets/models/z8_q11_studio.jpg' }
  ],
  'z8-q11': [
    { name: 'Rosa Pastel Candy', hex: '#EAA9BA', img: '/assets/models/z8_q10_studio.jpg' },
    { name: 'Sage Mint', hex: '#769482', img: '/assets/models/z8_q10_green.jpg' },
    { name: 'Onyx Black', hex: '#1A1C1E', img: '/assets/models/z8_q10_black.jpg' }
  ],
  'z8-diamond': [
    { name: 'Diamond Silver', hex: '#D0D5DD', img: '/assets/models/z8_diamond_studio.jpg' }
  ],
  'z8-h26': [
    { name: 'Verde Esmeralda Standard', hex: '#1B4D3E', img: '/assets/models/z8_n7_studio.jpg' },
    { name: 'Preto Ônix Paulista', hex: '#141619', img: '/assets/models/z8_n7_black.jpg' },
    { name: 'Prata Titânio Urbano', hex: '#C0C5CA', img: '/assets/models/z8_n7_silver.jpg' }
  ],
  'z8-gs005': [
    { name: 'Matte Graphite', hex: '#344054', img: '/assets/models/z8_gs005_studio.jpg' }
  ]
};

// Aliases dictionary for drawers
const MODEL_ID_ALIASES = {
  'z8-harley': 'z8-harley-x12',
  'z8-u2': 'z8-u2-delivery',
  'z8-n7': 'z8-h26',
  'z8-h26': 'z8-h26',
  'z8-harley-x12': 'z8-harley-x12',
  'z8-u2-delivery': 'z8-u2-delivery'
};

const Z8_FLEET = z8Models.map((m) => {
  const profit = m.profit ?? (m.retailPrice - m.wholesalePrice);
  const markup = m.markupPct ?? (((m.retailPrice - m.wholesalePrice) / m.wholesalePrice) * 100).toFixed(1);
  const margin = m.marginPct ?? (((m.retailPrice - m.wholesalePrice) / m.retailPrice) * 100).toFixed(1);
  return {
    ...m,
    profit,
    markupPct: markup,
    marginPct: margin,
    tag: `+${markup}%`,
    wholesale: m.wholesalePrice,
    retail: m.retailPrice,
    colors: MODEL_COLORS_MAP[m.id] || [{ name: 'Padrão', hex: '#888888', img: m.image }]
  };
});

const fmtBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

// High-Tech Mechanical Synthesizer (Web Audio API)
function playHighTechTick(type = 'up') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = type === 'up' ? 980 : 720;
    const endFreq = type === 'up' ? 1420 : 360;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Audio context may require user gesture
  }
}

// Order Desk Quantities state - dynamically connected to unified wholesaleOrderStore
const orderQuantities = new Proxy({}, {
  get(target, prop) {
    if (window.Z8_WHOLESALE_ORDER_STORE) {
      return window.Z8_WHOLESALE_ORDER_STORE.getQty(prop);
    }
    return target[prop] || 0;
  },
  set(target, prop, val) {
    if (window.Z8_WHOLESALE_ORDER_STORE) {
      window.Z8_WHOLESALE_ORDER_STORE.setQty(prop, val);
      return true;
    }
    target[prop] = val;
    return true;
  }
});

// ==========================================================================
// 2. CORE REACTIVE AUTH STATE ENGINE
// ==========================================================================
export function updateNavMenuAuthText(text) {
  const txtEl = document.getElementById('nav-menu-link-login-text');
  const linkEl = document.getElementById('nav-menu-link-login');
  if (!txtEl || !linkEl) return;

  const currentText = txtEl.getAttribute('data-current-text') || 'Área do Parceiro';
  if (currentText === text && txtEl.querySelector('.char')) {
    return;
  }
  if (!txtEl.hasAttribute('data-current-text') && text === 'Área do Parceiro') {
    txtEl.setAttribute('data-current-text', text);
    return;
  }
  txtEl.setAttribute('data-current-text', text);

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

window.handleLogout = function() {
  logoutCatalogUser();
  document.documentElement.classList.remove('is-poslogin-direct');
  document.body.classList.remove('is-poslogin-direct');
  syncAuthState();
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
};

export function syncAuthState() {
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
  const pendingBanner = document.getElementById('pending-approval-banner');
  const stickyBar = document.getElementById('z8-sticky-order-bar');

  updateNavMenuAuthText('Portal Lojista');
  syncPortalLojistaUser();

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

    if (pendingBanner) {
      pendingBanner.style.display = !approved ? 'flex' : 'none';
      const pendingUserName = document.getElementById('pending-user-name');
      if (pendingUserName) pendingUserName.textContent = user.name || 'Parceiro';
    }

    // Hero Floating KPI: Reactive Cockpit
    const heroEyebrow = document.getElementById('hero-kpi-eyebrow');
    const heroTitle = document.getElementById('hero-kpi-title');
    const heroBtn = document.getElementById('hero-kpi-cta-btn');
    if (heroEyebrow) {
      heroEyebrow.innerHTML = `<span style="color:#00F0FF; font-weight:800;">CONCESSÃO HOMOLOGADA // ${user.city || 'SÃO PAULO'} - ${user.state || 'SP'}</span>`;
    }
    if (heroTitle) {
      heroTitle.innerHTML = `MONOPÓLIO TERRITORIAL: <span>RAIO DE ATÉ 50 KM</span>`;
    }
    if (heroBtn) {
      heroBtn.textContent = 'MONTAR LOTE DE ATACADO (10 MOTOS) ↱';
      heroBtn.onclick = () => document.getElementById('frota-z8')?.scrollIntoView({ behavior: 'smooth' });
    }

    if (stickyBar) {
      stickyBar.style.display = approved ? 'flex' : 'none';
    }
  } else {
    document.documentElement.classList.remove('is-poslogin-direct');
    document.body.classList.remove('is-poslogin-direct');

    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (partnerBadge) partnerBadge.style.display = 'none';
    if (pendingBanner) pendingBanner.style.display = 'none';
    if (stickyBar) stickyBar.style.display = 'none';

    // Hero Floating KPI: Public Teaser
    const heroEyebrow = document.getElementById('hero-kpi-eyebrow');
    const heroTitle = document.getElementById('hero-kpi-title');
    const heroBtn = document.getElementById('hero-kpi-cta-btn');
    if (heroEyebrow) heroEyebrow.textContent = 'EXPANSÃO INSTITUCIONAL // 2026';
    if (heroTitle) heroTitle.innerHTML = 'RAIO PROTEGIDO <span>ATÉ 50 KM</span>';
    if (heroBtn) {
      heroBtn.textContent = 'CONHECER DISPONIBILIDADE NA MINHA REGIÃO ↗';
      heroBtn.onclick = () => window.openLeadModal && window.openLeadModal('Hero Floating KPI');
    }
  }

  // 2. Update Vitrine Showcase Cards
  document.querySelectorAll('.helmet-grid-item-w[data-model-index]').forEach((card) => {
    const idx = parseInt(card.getAttribute('data-model-index'), 10);
    const model = Z8_FLEET[idx];
    if (!model) return;

    const profitChip = card.querySelector('.z8-tel-profit');
    const hudRows = card.querySelectorAll('.z8-hud-row');
    const stepperBox = card.querySelector('.z8-hud-order-stepper');
    const stepQty = card.querySelector(`#card-qty-${model.id}`);

    if (profitChip) {
      profitChip.textContent = approved ? `+${fmtBRL(model.profit)}/un` : `${model.tag} Markup`;
    }

    if (hudRows && hudRows.length >= 3) {
      hudRows[0].innerHTML = `<span>ATACADO B2B</span><strong>${fmtBRL(model.wholesale)}</strong>`;
      hudRows[1].innerHTML = `<span>VAREJO SUG.</span><strong>${fmtBRL(model.retail)}</strong>`;
      hudRows[2].innerHTML = `<span>LUCRO LÍQUIDO</span><strong>+${fmtBRL(model.profit)} (${model.tag})</strong>`;
    }

    if (stepperBox) {
      stepperBox.style.display = approved ? 'flex' : 'none';
    }
    if (stepQty) {
      stepQty.textContent = orderQuantities[model.id] || 0;
    }
  });

  // 3. Update Order Desk (Mesa de Atacado)
  const lockedTeaser = document.getElementById('orderdesk-locked-teaser');
  const unlockedCard = document.getElementById('orderdesk-unlocked-card');
  if (lockedTeaser && unlockedCard) {
    if (approved) {
      lockedTeaser.style.display = 'none';
      unlockedCard.style.display = 'block';
      renderOrderDeskRows();
      updateOrderDeskCalculations();
    } else {
      lockedTeaser.style.display = 'block';
      unlockedCard.style.display = 'none';
    }
  }

  // 4. Update Comparador Técnico
  updateComparatorTable();

  // 5. Update Pós-Venda & OS Section
  const posPreGrid = document.getElementById('posvenda-prelogin-grid');
  const posPostCard = document.getElementById('posvenda-postlogin-card');
  if (posPreGrid && posPostCard) {
    if (approved) {
      posPreGrid.style.display = 'none';
      posPostCard.style.display = 'block';
      loadOSTable();
    } else {
      posPreGrid.style.display = 'grid';
      posPostCard.style.display = 'none';
    }
  }

  // 6. Update Downloads Section
  document.querySelectorAll('.z8-download-card.z8-restricted-doc').forEach((card) => {
    const badge = card.querySelector('.z8-doc-badge');
    const icon = card.querySelector('.z8-doc-icon');
    if (approved) {
      card.style.opacity = '1';
      card.removeAttribute('onclick');
      if (badge) {
        badge.style.color = '#10B981';
        badge.innerHTML = '<i class="fa-solid fa-check"></i> Acesso Liberado';
      }
      if (icon) {
        icon.style.color = '#10B981';
      }
    } else {
      card.style.opacity = '0.75';
      card.setAttribute('onclick', 'event.preventDefault(); window.openZ8AuthModal && window.openZ8AuthModal("login");');
      if (badge) {
        badge.style.color = '#F59E0B';
        badge.innerHTML = '<i class="fa-solid fa-lock"></i> Restrito Concessionário';
      }
      if (icon) {
        icon.style.color = '#F59E0B';
      }
    }
  });
}

// ==========================================================================
// 3. FLUID ANIMATED AUTH MODAL (LANDO NORRIS / REA STYLE)
// ==========================================================================
export function openAuthModal(defaultTab = 'login') {
  const modal = document.getElementById('z8-auth-modal');
  if (!modal) return;
  modal.classList.add('is-active');
  window.lenis?.stop();
  switchAuthTab(defaultTab);
}

export function closeAuthModal() {
  const modal = document.getElementById('z8-auth-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  window.lenis?.start();
}

export function switchAuthTab(tabName) {
  const tabs = document.querySelectorAll('.z8-auth-tab');
  tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tabName));

  const boxLogin = document.getElementById('z8-auth-box-login');
  const boxRegister = document.getElementById('z8-auth-box-register');
  const boxForgot = document.getElementById('z8-auth-box-forgot');

  if (boxLogin) boxLogin.style.display = tabName === 'login' ? 'block' : 'none';
  if (boxRegister) boxRegister.style.display = tabName === 'register' ? 'block' : 'none';
  if (boxForgot) boxForgot.style.display = tabName === 'forgot' ? 'block' : 'none';
}

function initAuthModalEvents() {
  // Tabs
  document.querySelectorAll('.z8-auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Close buttons & Backdrop
  document.querySelectorAll('[data-close-auth]').forEach((btn) => {
    btn.addEventListener('click', closeAuthModal);
  });
  const modal = document.getElementById('z8-auth-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      window.closeZ8ModelDrawer?.();
      window.closeAdminModal?.();
      window.closeNewOSModal?.();
    }
  });

  // Header Triggers
  document.getElementById('btn-header-login')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('btn-header-logout')?.addEventListener('click', window.handleLogout);
  document.getElementById('btn-header-admin')?.addEventListener('click', () => openAdminModal());

  // Quick Admin Pre-fill for Testing
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
  document.querySelectorAll('.z8-pass-toggle').forEach((btn) => {
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
        closeAuthModal();
        syncAuthState();
      } else {
        alert(res?.message || 'Não foi possível concluir o login com o Google.');
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
          closeAuthModal();
          syncAuthState();
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
        msgBox.textContent = 'Processando credenciamento...';
      }

      const res = await registerCatalogUser({ name, company, city, state, email, phone, password });
      if (res.success) {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-success';
          msgBox.textContent = 'Cadastro enviado! Sua solicitação está em análise pela diretoria de expansão.';
        }
        setTimeout(() => {
          closeAuthModal();
          syncAuthState();
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
        msgBox.textContent = 'Enviando link de redefinição...';
      }

      const res = await requestPasswordResetEmail(email);
      if (res.success) {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-success';
          msgBox.textContent = 'Link de redefinição enviado com sucesso! Verifique sua caixa de entrada.';
        }
      } else {
        if (msgBox) {
          msgBox.className = 'z8-auth-msg is-error';
          msgBox.textContent = res.message || 'Não foi possível enviar o e-mail.';
        }
      }
    });
  }
}

// ==========================================================================
// 4. MODEL DRAWER / SPECS CONTROLLER (REACTIVE TO AUTH)
// ==========================================================================
export function openZ8ModelDrawer(rawModelId) {
  const modelId = MODEL_ID_ALIASES[rawModelId] || rawModelId;
  const model = Z8_FLEET.find((m) => m.id === modelId) || Z8_FLEET[0];
  const drawer = document.getElementById('z8-model-drawer');
  const body = document.getElementById('z8-drawer-body');
  if (!drawer || !body) return;

  window.lenis?.stop();
  drawer.classList.add('is-active');

  const approved = isCatalogApproved();
  const firstImg = model.colors?.[0]?.img || model.image;

  const swatchesHtml = (model.colors || [])
    .map(
      (c, i) => `
      <button type="button" class="z8-swatch-btn ${i === 0 ? 'is-active' : ''}" data-img="${c.img}">
        <span class="swatch-dot" style="background:${c.hex}"></span>
        <span>${c.name}</span>
      </button>`
    )
    .join('');

  let kpisHtml = '';
  if (approved) {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong>${fmtBRL(model.wholesale)}</strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong>${fmtBRL(model.retail)}</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>LUCRO LÍQUIDO / UN</span>
        <strong>+${fmtBRL(model.profit)}</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARKUP COMERCIAL</span>
        <strong>${model.tag} (${model.marginPct}% Margem)</strong>
      </div>
    `;
  } else {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong style="color:#00F0FF; display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM ESTIMADA</span>
        <strong style="font-size:0.88rem; color:#00F0FF;">Exclusivo Credenciados</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>DISPONIBILIDADE</span>
        <strong style="font-size:0.88rem;">Lote Concessão 2026</strong>
      </div>
    `;
  }

  const ctaBtnText = approved
    ? 'ENCOMENDAR ESTE MODELO NO WHATSAPP ↱'
    : 'SOLICITAR TABELA DESTE MODELO &amp; RESERVAR CIDADE ↱';

  body.innerHTML = `
    <div class="z8-drawer-grid">
      <div>
        <div class="z8-drawer-img-wrap">
          <img id="z8-drawer-main-img" src="${firstImg}" alt="${model.name}" />
        </div>
        <div class="z8-drawer-swatches">${swatchesHtml}</div>
      </div>
      <div>
        <div class="z8-modal-badge">${model.cnh || model.category}</div>
        <h2 class="z8-modal-title">${model.name}</h2>
        <p class="z8-modal-subtitle">${model.motor} — ${model.range}</p>
        <div class="z8-drawer-kpis">${kpisHtml}</div>
        <button type="button" class="z8-drawer-cta" id="z8-drawer-cta-btn">
          ${ctaBtnText}
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
      playHighTechTick('up');
    });
  });

  const ctaBtn = document.getElementById('z8-drawer-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      closeZ8ModelDrawer();
      if (approved) {
        const user = getCurrentCatalogUser();
        const msg = encodeURIComponent(
          `Olá, Christian! Sou o parceiro homologado ${user?.name || ''} (${user?.company || ''}) e tenho interesse em encomendar um lote do modelo *${model.name}* para minha praça ${user?.city || ''}/${user?.state || ''}.`
        );
        window.open(`https://wa.me/5512998008818?text=${msg}`, '_blank');
      } else {
        openAuthModal('register');
      }
    });
  }
}

export function closeZ8ModelDrawer() {
  const drawer = document.getElementById('z8-model-drawer');
  if (!drawer) return;
  drawer.classList.remove('is-active');
  window.lenis?.start();
}

// ==========================================================================
// 5. MESA DE ATACADO (ORDER DESK) & PERSISTENT HUD CONTROLLER
// ==========================================================================
function renderOrderDeskRows() {
  const tbody = document.getElementById('orderdesk-table-body');
  if (!tbody) return;

  tbody.innerHTML = Z8_FLEET.map((m) => {
    const qty = orderQuantities[m.id] || 0;
    const subtotal = m.wholesale * qty;
    return `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 0.85rem 1rem;">
          <strong style="color: #F4F5F7; display: block;">${m.name}</strong>
          <span style="font-size: 0.72rem; color: rgba(244,244,237,0.6);">${m.cnh || m.category}</span>
        </td>
        <td style="padding: 0.85rem 1rem; color: #00F0FF; font-weight: 700;">${fmtBRL(m.wholesale)}</td>
        <td style="padding: 0.85rem 1rem; color: rgba(244,244,237,0.8);">${fmtBRL(m.retail)}</td>
        <td style="padding: 0.85rem 1rem; color: #10B981; font-weight: 700;">+${fmtBRL(m.profit)}</td>
        <td style="padding: 0.85rem 1rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #06080D; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 2px;">
            <button type="button" onclick="window.changeOrderQty('${m.id}', -1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;">-</button>
            <input type="number" min="0" max="99" value="${qty}" id="order-qty-${m.id}" onchange="window.setOrderQty('${m.id}', this.value)" style="width: 38px; text-align: center; background: none; border: none; color: #FFF; font-weight: 800; font-size: 0.85rem;"/>
            <button type="button" onclick="window.changeOrderQty('${m.id}', 1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;">+</button>
          </div>
        </td>
        <td id="order-subtotal-${m.id}" style="padding: 0.85rem 1rem; text-align: right; color: #F4F5F7; font-weight: 800;">${fmtBRL(subtotal)}</td>
      </tr>
    `;
  }).join('');
}

window.changeOrderQty = function(modelId, delta) {
  playHighTechTick(delta > 0 ? 'up' : 'down');
  if (window.Z8_WHOLESALE_ORDER_STORE) {
    window.Z8_WHOLESALE_ORDER_STORE.adjustQty(modelId, delta);
  }
};

window.setOrderQty = function(modelId, val) {
  playHighTechTick('up');
  if (window.Z8_WHOLESALE_ORDER_STORE) {
    window.Z8_WHOLESALE_ORDER_STORE.setQty(modelId, val);
  }
};

function updateOrderDeskCalculations() {
  if (window.Z8_WHOLESALE_ORDER_STORE) {
    window.Z8_WHOLESALE_ORDER_STORE.syncAllUI();
  }
}
window.updateOrderDeskCalculations = updateOrderDeskCalculations;

// Listen to store updates for reactive updates across components
window.addEventListener('z8-wholesale-order-updated', () => {
  // UI is synchronized automatically by the store
});

window.submitOrderDesk = function() {
  const store = window.Z8_WHOLESALE_ORDER_STORE;
  const totals = store ? store.getTotals() : { totalBikes: 0, totalWholesale: 0, totalProfit: 0 };
  const items = store ? store.getAllItems() : [];

  if (totals.totalBikes < 10) {
    alert(`O lote mínimo de fábrica é de 10 motos. Quantidade atual selecionada: ${totals.totalBikes} motos.`);
    return;
  }

  const user = getCurrentCatalogUser();
  const partnerName = user?.name || 'Parceiro Z8';
  const company = user?.company || 'Concessionária';
  const city = user?.city || 'São Paulo';
  const state = user?.state || 'SP';

  const summary = items.map(it => `• ${it.qty}x ${it.fullName || it.name} (${fmtBRL(it.subtotalWholesale)})`);

  const text = encodeURIComponent(
    `*MINUTA DE PEDIDO DE ATACADO B2B // Z8 E-MOTION*\n` +
    `========================================\n` +
    `*Concessionário:* ${partnerName}\n` +
    `*Empresa / CNPJ:* ${company}\n` +
    `*Praça Protegida:* ${city}/${state} (Raio de até 50 km)\n` +
    `========================================\n\n` +
    `*COMPOSIÇÃO DO LOTE FATURADO (${totals.totalBikes} MOTOS):*\n` +
    summary.join('\n') +
    `\n\n----------------------------------------\n` +
    `*INVESTIMENTO TOTAL ATACADO:* ${fmtBRL(totals.totalWholesale)}\n` +
    `*LUCRO BRUTO NA REVENDA:* +${fmtBRL(totals.totalProfit)}\n` +
    `*EXPEDIÇÃO DIRETA:* Matriz São José dos Campos (D+2)\n` +
    `----------------------------------------\n\n` +
    `Solicito a validação do espelho de faturamento e agendamento de despacho.`
  );

  playHighTechTick('up');
  window.open(`https://wa.me/5512998008818?text=${text}`, '_blank');
};

// ==========================================================================
// 6. COMPARADOR TÉCNICO LADO A LADO
// ==========================================================================
function updateComparatorTable() {
  const selA = document.getElementById('comp-select-a');
  const selB = document.getElementById('comp-select-b');
  if (!selA || !selB) return;

  const modelA = Z8_FLEET.find((m) => m.id === selA.value) || Z8_FLEET[0];
  const modelB = Z8_FLEET.find((m) => m.id === selB.value) || Z8_FLEET[1];
  const approved = isCatalogApproved();

  const fillCell = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };

  fillCell('comp-name-a', modelA.name);
  fillCell('comp-name-b', modelB.name);
  fillCell('comp-motor-a', modelA.motor);
  fillCell('comp-motor-b', modelB.motor);
  fillCell('comp-battery-a', modelA.battery);
  fillCell('comp-battery-b', modelB.battery);
  fillCell('comp-speed-a', modelA.speed);
  fillCell('comp-speed-b', modelB.speed);
  fillCell('comp-range-a', modelA.range);
  fillCell('comp-range-b', modelB.range);
  fillCell('comp-cnh-a', modelA.cnh || modelA.category);
  fillCell('comp-cnh-b', modelB.cnh || modelB.category);

  fillCell('comp-wholesale-a', `<strong>${fmtBRL(modelA.wholesale)}</strong>`);
  fillCell('comp-wholesale-b', `<strong>${fmtBRL(modelB.wholesale)}</strong>`);
  fillCell('comp-profit-a', `<strong style="color:#00F0FF;">+${fmtBRL(modelA.profit)} (${modelA.tag})</strong>`);
  fillCell('comp-profit-b', `<strong style="color:#00F0FF;">+${fmtBRL(modelB.profit)} (${modelB.tag})</strong>`);
}

// ==========================================================================
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

// Expose Admin Actions to window
window.approveUser = async (idOrEmail) => {
  await updateUserStatus(idOrEmail, 'approved');
  syncAuthState();
};
window.rejectUser = async (idOrEmail) => {
  await updateUserStatus(idOrEmail, 'pending');
  syncAuthState();
};
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.openAuthModal = openAuthModal;
window.openZ8AuthModal = openAuthModal;
window.closeZ8AuthModal = closeAuthModal;
window.closeAuthModal = closeAuthModal;
window.openZ8ModelDrawer = openZ8ModelDrawer;
window.closeZ8ModelDrawer = closeZ8ModelDrawer;

// ==========================================================================
// 9. INITIALIZATION ON DOM READY
// ==========================================================================
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


// ==========================================================================
// KINETIC TEXT SCROLL REVEAL ENGINE FOR MOBILE, TABLET & DUO (< 992px)
// ==========================================================================
export function initKineticTextScrollMobile() {
  if (window.innerWidth >= 992) return; // Desktop handled natively by lando-engine

  // 1. Activate authentic Lando Norris text reveal, sweeps, and rich text engines on mobile
  if (typeof window.D7 === 'function') window.D7();
  if (typeof window.E7 === 'function') window.E7();
  if (typeof window.HP === 'function') window.HP();
  if (typeof window.rW === 'function') window.rW();

  // 2. Kill and re-attach Section 4 Architecture pinned horizontal scroll on mobile
  if (typeof window.o6 === 'function') window.o6();
  if (typeof window.qp === 'function') window.qp();
  if (typeof window.Gp === 'function') window.Gp();

  // 3. Fallback sweep engine for any remaining [data-anim-high] elements
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap) {
    const elements = document.querySelectorAll('[data-anim-high]');
    elements.forEach((W) => {
      if (W._highLinesInstance) return;
      const animAttr = W.getAttribute('data-anim-high') || 'right, lime, 0';
      const [dir, colorName, delayMs] = animAttr.split(',').map((s) => s.trim());
      const isRight = dir !== 'left';
      const delay = parseFloat(delayMs || '0') / 1000;
      const colorMap = {
        lime: 'var(--color--lime, #00F0FF)',
        'lime-off': 'var(--color--lime-off, #00D4FF)',
        'dark-green': 'var(--color--dark-green, #0A1628)',
        'dark-green-tint-1': 'var(--color--dark-green-tint-1, #1E293B)',
        black: 'var(--color--black, #111112)',
        white: 'var(--color--white, #F4F5F7)'
      };
      const barBg = colorMap[colorName] || 'var(--color--lime, #00F0FF)';
      const lines = W.querySelectorAll('.line');
      if (!lines.length) return;

      const tl = gsap.timeline({ paused: true, delay });
      lines.forEach((M, idx) => {
        M.style.position = 'relative';
        if (isRight) {
          gsap.set(M, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 });
        } else {
          gsap.set(M, { clipPath: 'inset(0 0 0 100%)', autoAlpha: 1 });
        }
        let bar = M.querySelector('.high-line-reveal');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'high-line-reveal';
          bar.style.position = 'absolute';
          bar.style.top = '0';
          bar.style.left = '0';
          bar.style.width = '100%';
          bar.style.height = '100%';
          bar.style.backgroundColor = barBg;
          bar.style.transformOrigin = isRight ? 'right center' : 'left center';
          bar.style.zIndex = '5';
          M.appendChild(bar);
        }
        gsap.set(bar, { scaleX: 1 });
        const startTime = idx * 0.12;
        if (isRight) {
          tl.to(M, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out' }, startTime);
        } else {
          tl.to(M, { clipPath: 'inset(0 0 0 0%)', duration: 0.6, ease: 'power2.out' }, startTime);
        }
        tl.to(bar, { scaleX: 0, duration: 0.6, ease: 'power2.inOut' }, startTime + 0.3);
      });

      W._highLinesInstance = { timeline: tl, cleanup: () => { tl.kill(); } };
      if (ScrollTrigger) {
        W._highLinesInstance.scrollTrigger = ScrollTrigger.create({
          trigger: W,
          start: 'top 92%',
          once: true,
          onEnter: () => tl.play()
        });
      }
    });
    if (ScrollTrigger) ScrollTrigger.refresh();
  }
}
window.initKineticTextScrollMobile = initKineticTextScrollMobile;

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
  initAuthModalEvents();
  syncAuthState();

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

  // Populate Comparador Selects
  const selA = document.getElementById('comp-select-a');
  const selB = document.getElementById('comp-select-b');
  if (selA && selB) {
    selA.innerHTML = Z8_FLEET.map((m, i) => `<option value="${m.id}" ${i === 0 ? 'selected' : ''}>${m.name}</option>`).join('');
    selB.innerHTML = Z8_FLEET.map((m, i) => `<option value="${m.id}" ${i === 1 ? 'selected' : ''}>${m.name}</option>`).join('');
    selA.addEventListener('change', () => {
      updateComparatorTable();
      playHighTechTick('up');
    });
    selB.addEventListener('change', () => {
      updateComparatorTable();
      playHighTechTick('up');
    });
    updateComparatorTable();
  }

  // Live search for OS
  const searchInput = document.getElementById('os-search-input');
  searchInput?.addEventListener('input', (e) => {
    loadOSTable(e.target.value);
  });

  // Drawer Close Button
  document.getElementById('z8-drawer-close-btn')?.addEventListener('click', closeZ8ModelDrawer);

  // Initial load of Service Orders table & live event listener
  loadOSTable();
  if (typeof fetchWarrantyOrdersFromFirestore === 'function') {
    fetchWarrantyOrdersFromFirestore().then((res) => {
      if (res && res.length) {
        console.log('[Z8 Conceito-2] Ordens de Serviço sincronizadas com Firestore:', res.length);
        loadOSTable();
      }
    }).catch(err => console.warn('[Z8 Conceito-2] Erro na busca de OS do Firestore:', err));
  }
  window.addEventListener('z8-warranty-os-updated', () => {
    loadOSTable();
  });
});

window.scrollToOSFooter = function() {
  const el = document.getElementById('rodape-os');
  if (el) {
    if (window.lenis) {
      window.lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

// Multi-tier initialization for mobile kinetic text & horizontal architecture scroll
const runMobileMotion = () => {
  if (window.innerWidth < 992 && typeof initKineticTextScrollMobile === 'function') {
    initKineticTextScrollMobile();
  }
};

runMobileMotion();
setTimeout(runMobileMotion, 250);
setTimeout(runMobileMotion, 600);
setTimeout(runMobileMotion, 1200);

window.addEventListener('load', () => {
  runMobileMotion();
  setTimeout(runMobileMotion, 300);
});

window.addEventListener('scroll', runMobileMotion, { passive: true, once: true });
window.addEventListener('touchstart', runMobileMotion, { passive: true, once: true });
window.addEventListener('resize', () => {
  if (window.innerWidth < 992) runMobileMotion();
});
