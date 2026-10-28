/**
 * Z8 E-MOTION // CONCEITO 2 — INTEGRATED AUTH & ADVANCED MOTION ENGINE
 * Replaces Main Site with Integrated Pre/Post Login + Full Technical Data
 */

import { z8Models } from '../site-principal/data/models.js';
import { franchiseTiers, complianceInfo } from '../site-principal/data/franchiseInfo.js';
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

// ==========================================================================
// 1. DATA ENRICHMENT: 11 MODELS FLEET (TECH DATA + STUDIO COLOR SWATCHES)
// ==========================================================================
const MODEL_COLORS_MAP = {
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
  'z8-harley-x21': [
    { name: 'Crimson Red', hex: '#8B1E28', img: '/assets/models/z8_harley_red.jpg' },
    { name: 'Brushed Silver', hex: '#A8AFB7', img: '/assets/models/z8_harley_silver.jpg' }
  ],
  'z8-u2-delivery': [
    { name: 'Fleet Yellow', hex: '#D4A017', img: '/assets/models/z8_u2_yellow.jpg' },
    { name: 'Industrial White', hex: '#E8EAED', img: '/assets/models/z8_u2_white.jpg' },
    { name: 'Matte Grey', hex: '#5A6068', img: '/assets/models/z8_u2_grey.jpg' }
  ],
  'z8-n710': [
    { name: 'Faria Lima Silver', hex: '#9AA0A6', img: '/assets/models/z8_n710_silver.jpg' },
    { name: 'Carbon Black', hex: '#1C1D21', img: '/assets/models/z8_n710_black.jpg' }
  ],
  'z8-q10': [
    { name: 'Matcha Green', hex: '#7A9A74', img: '/assets/models/z8_q10_green.jpg' },
    { name: 'Vintage Cream', hex: '#E6DFC8', img: '/assets/models/z8_q10_cream.jpg' }
  ],
  'z8-q11': [
    { name: 'Pastel Mint', hex: '#88B8A6', img: '/assets/models/z8_q11_mint.jpg' },
    { name: 'Soft Peach', hex: '#E29E84', img: '/assets/models/z8_q11_peach.jpg' }
  ],
  'z8-diamond': [
    { name: 'Titanium Grey', hex: '#63686E', img: '/assets/models/z8_diamond_grey.jpg' },
    { name: 'Gloss White', hex: '#F4F5F7', img: '/assets/models/z8_diamond_white.jpg' }
  ],
  'z8-n7': [
    { name: 'Midnight Blue', hex: '#1E2D4A', img: '/assets/models/z8_n7_blue.jpg' },
    { name: 'Charcoal Black', hex: '#212328', img: '/assets/models/z8_n7_black.jpg' }
  ],
  'z8-gs005': [
    { name: 'Classic Black', hex: '#18191C', img: '/assets/models/z8_gs005_black.jpg' },
    { name: 'Polar White', hex: '#EDEDED', img: '/assets/models/z8_gs005_white.jpg' }
  ]
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

// ==========================================================================
// 2. CORE REACTIVE AUTH STATE ENGINE
// ==========================================================================
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
  const menuLoginText = document.getElementById('nav-menu-link-login-text');
  if (menuLoginText) {
    if (user) {
      menuLoginText.textContent = admin ? 'Painel Master (Admin)' : `${user.company || user.name || 'Parceiro'} // Sair`;
    } else {
      menuLoginText.textContent = 'Área do Parceiro';
    }
  }
  const pendingBanner = document.getElementById('pending-approval-banner');

  if (user) {
    if (franquiaBtn) franquiaBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    if (partnerBadge && partnerName) {
      partnerBadge.style.display = 'inline-flex';
      partnerName.textContent = user.company || user.name || 'Parceiro Z8';
      partnerBadge.classList.toggle('is-pending', !approved);
    }

    if (adminBtn) {
      adminBtn.style.display = admin ? 'inline-flex' : 'none';
    }

    if (pendingBanner) {
      pendingBanner.style.display = !approved ? 'flex' : 'none';
      const pendingUserName = document.getElementById('pending-user-name');
      if (pendingUserName) pendingUserName.textContent = user.name || 'Parceiro';
    }
  } else {
    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (partnerBadge) partnerBadge.style.display = 'none';
    if (pendingBanner) pendingBanner.style.display = 'none';
  }

  // 2. Update Vitrine Showcase Cards
  document.querySelectorAll('.helmet-grid-item-w[data-model-id]').forEach((card) => {
    const modelId = card.getAttribute('data-model-id');
    const model = Z8_FLEET.find((m) => m.id === modelId);
    if (!model) return;

    const profitChip = card.querySelector('.z8-tel-profit');
    const hudWholesale = card.querySelector('.z8-hud-wholesale');
    const hudRetail = card.querySelector('.z8-hud-retail');
    const hudProfit = card.querySelector('.z8-hud-profit');

    if (approved) {
      if (profitChip) profitChip.textContent = `+${fmtBRL(model.profit)}/un`;
      if (hudWholesale) hudWholesale.innerHTML = `<span>ATACADO B2B</span><strong>${fmtBRL(model.wholesale)}</strong>`;
      if (hudRetail) hudRetail.innerHTML = `<span>VAREJO SUG.</span><strong>${fmtBRL(model.retail)}</strong>`;
      if (hudProfit) hudProfit.innerHTML = `<span>LUCRO LÍQUIDO</span><strong>+${fmtBRL(model.profit)} (${model.tag})</strong>`;
    } else {
      if (profitChip) profitChip.textContent = `${model.tag} Markup`;
      if (hudWholesale) {
        hudWholesale.innerHTML = `<span>ATACADO B2B</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong>`;
      }
      if (hudRetail) {
        hudRetail.innerHTML = `<span>VAREJO SUG.</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong>`;
      }
      if (hudProfit) {
        hudProfit.innerHTML = `<span>MARKUP COMERCIAL</span><strong>${model.tag} (Margem ${model.marginPct}%)</strong>`;
      }
    }
  });

  // 3. Update Order Desk (Mesa de Atacado)
  const lockedTeaser = document.getElementById('orderdesk-locked-teaser');
  const unlockedCard = document.getElementById('orderdesk-unlocked-card');
  if (lockedTeaser && unlockedCard) {
    if (approved) {
      lockedTeaser.style.display = 'none';
      unlockedCard.style.display = 'block';
      updateOrderDeskCalculations();
    } else {
      lockedTeaser.style.display = 'block';
      unlockedCard.style.display = 'none';
    }
  }

  // 4. Update Comparador Técnico Row
  const compWholesaleRow = document.getElementById('comp-wholesale-row');
  if (compWholesaleRow) {
    updateComparatorTable();
  }

  // 5. Update Downloads Section
  document.querySelectorAll('.z8-download-card.requires-auth').forEach((card) => {
    if (approved) {
      card.classList.remove('is-locked');
      const badge = card.querySelector('.z8-download-badge');
      if (badge) badge.textContent = 'Liberado';
      card.removeAttribute('onclick');
    } else {
      card.classList.add('is-locked');
      const badge = card.querySelector('.z8-download-badge');
      if (badge) badge.textContent = 'Restrito (Franqueado)';
      card.setAttribute('onclick', 'event.preventDefault(); window.openAuthModal && window.openAuthModal("login");');
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
    }
  });

  // Header Triggers
  document.getElementById('btn-header-login')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('btn-header-logout')?.addEventListener('click', () => {
    logoutCatalogUser();
    syncAuthState();
  });
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
export function openZ8ModelDrawer(modelId) {
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
      <div class="z8-drawer-kpi is-confidential">
        <span>CUSTO ATACADO B2B</span>
        <strong>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Sob Consulta
        </strong>
      </div>
      <div class="z8-drawer-kpi is-confidential">
        <span>PREÇO VAREJO SUG.</span>
        <strong>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Sob Consulta
        </strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM LÍQUIDA ESTIMADA</span>
        <strong>${model.marginPct}%</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARKUP COMERCIAL</span>
        <strong>${model.tag}</strong>
      </div>
    `;
  }

  const ctaBtnText = approved
    ? 'RESERVAR LOTE DESTE MODELO VIA WHATSAPP ↱'
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
// 5. MESA DE ATACADO (ORDER DESK) SIMULATOR
// ==========================================================================
function updateOrderDeskCalculations() {
  const slider = document.getElementById('orderdesk-lot-slider');
  const lotSize = parseInt(slider?.value || '10', 10);
  const lotSizeDisplay = document.getElementById('orderdesk-lot-size');
  if (lotSizeDisplay) lotSizeDisplay.textContent = `${lotSize} Motos`;

  const tbody = document.getElementById('orderdesk-table-body');
  if (tbody) {
    tbody.innerHTML = Z8_FLEET.map((m) => {
      const lotWholesale = m.wholesale * lotSize;
      const lotRetail = m.retail * lotSize;
      const lotProfit = m.profit * lotSize;
      return `
        <tr>
          <td><strong>${m.name}</strong></td>
          <td>${m.tag}</td>
          <td>${fmtBRL(m.wholesale)}</td>
          <td>${fmtBRL(m.retail)}</td>
          <td><strong style="color:#00F0FF;">+${fmtBRL(m.profit)}</strong></td>
          <td><strong style="color:#10B981;">+${fmtBRL(lotProfit)}</strong></td>
        </tr>
      `;
    }).join('');
  }

  // Monthly summary (assuming average profit per bike R$ 2.850 + workshop R$ 6.400)
  const avgProfitPerUnit = 2850;
  const workshopMonthly = 6400;
  const totalMonthlyNet = (lotSize * avgProfitPerUnit) + workshopMonthly;
  const totalAnnualNet = totalMonthlyNet * 12;

  const elMonthly = document.getElementById('orderdesk-res-monthly');
  const elAnnual = document.getElementById('orderdesk-res-annual');
  if (elMonthly) elMonthly.textContent = fmtBRL(totalMonthlyNet);
  if (elAnnual) elAnnual.textContent = fmtBRL(totalAnnualNet);
}

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

  if (approved) {
    fillCell('comp-wholesale-a', `<strong>${fmtBRL(modelA.wholesale)}</strong>`);
    fillCell('comp-wholesale-b', `<strong>${fmtBRL(modelB.wholesale)}</strong>`);
    fillCell('comp-profit-a', `<strong style="color:#00F0FF;">+${fmtBRL(modelA.profit)} (${modelA.tag})</strong>`);
    fillCell('comp-profit-b', `<strong style="color:#00F0FF;">+${fmtBRL(modelB.profit)} (${modelB.tag})</strong>`);
  } else {
    fillCell('comp-wholesale-a', `<span style="color:#F59E0B;">🔒 Sob Consulta</span>`);
    fillCell('comp-wholesale-b', `<span style="color:#F59E0B;">🔒 Sob Consulta</span>`);
    fillCell('comp-profit-a', `<strong style="color:#00F0FF;">${modelA.tag} Markup</strong>`);
    fillCell('comp-profit-b', `<strong style="color:#00F0FF;">${modelB.tag} Markup</strong>`);
  }
}

// ==========================================================================
// 7. ADMIN MASTER MODAL CONTROLLER (CHRISTIAN HIDEYUKI)
// ==========================================================================
export function openAdminModal() {
  const modal = document.getElementById('z8-admin-modal');
  if (!modal) return;
  modal.classList.add('is-active');
  window.lenis?.stop();
  loadAdminUsersList();
}

export function closeAdminModal() {
  const modal = document.getElementById('z8-admin-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  window.lenis?.start();
}

function loadAdminUsersList() {
  subscribeToUsersRealtime((users) => {
    const listEl = document.getElementById('admin-users-container');
    const totalEl = document.getElementById('admin-stat-total');
    const pendingEl = document.getElementById('admin-stat-pending');
    const approvedEl = document.getElementById('admin-stat-approved');

    if (!listEl) return;

    let pendingCount = 0;
    let approvedCount = 0;

    users.forEach((u) => {
      if (u.status === 'pending') pendingCount++;
      if (u.status === 'approved') approvedCount++;
    });

    if (totalEl) totalEl.textContent = users.length;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (approvedEl) approvedEl.textContent = approvedCount;

    listEl.innerHTML = users
      .map((u) => {
        const isApp = u.status === 'approved';
        return `
        <div class="z8-admin-user-row">
          <div>
            <strong>${u.name || 'Sem Nome'}</strong> (${u.company || 'Empresa'}) — ${u.city || 'SP'}/${u.state || 'SP'}
            <div style="font-size:0.72rem; color:rgba(244,244,237,0.6);">${u.email} • WhatsApp: ${u.phone || 'N/A'}</div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <span style="font-size:0.72rem; padding:2px 8px; border-radius:4px; font-weight:700; ${isApp ? 'background:rgba(16,185,129,0.15); color:#10B981;' : 'background:rgba(245,158,11,0.15); color:#F59E0B;'}">
              ${isApp ? 'Aprovado' : 'Pendente'}
            </span>
            ${
              !isApp
                ? `<button type="button" class="z8-admin-btn-approve" onclick="window.approveUser && window.approveUser('${u.id || u.email}')">Aprovar</button>`
                : `<button type="button" class="z8-admin-btn-reject" onclick="window.rejectUser && window.rejectUser('${u.id || u.email}')">Suspender</button>`
            }
          </div>
        </div>
      `;
      })
      .join('');
  });
}

// Expose Admin Actions to window
window.approveUser = async (idOrEmail) => {
  await updateUserStatus(idOrEmail, 'approved');
};
window.rejectUser = async (idOrEmail) => {
  await updateUserStatus(idOrEmail, 'pending');
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
// 8. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuthModalEvents();
  syncAuthState();

  // Populate Comparador Selects
  const selA = document.getElementById('comp-select-a');
  const selB = document.getElementById('comp-select-b');
  if (selA && selB) {
    selA.innerHTML = Z8_FLEET.map((m, i) => `<option value="${m.id}" ${i === 0 ? 'selected' : ''}>${m.name}</option>`).join('');
    selB.innerHTML = Z8_FLEET.map((m, i) => `<option value="${m.id}" ${i === 1 ? 'selected' : ''}>${m.name}</option>`).join('');
    selA.addEventListener('change', updateComparatorTable);
    selB.addEventListener('change', updateComparatorTable);
    updateComparatorTable();
  }

  // Order Desk Slider Event
  const slider = document.getElementById('orderdesk-lot-slider');
  slider?.addEventListener('input', updateOrderDeskCalculations);

  // Proposal Button on Order Desk
  document.getElementById('btn-orderdesk-whatsapp')?.addEventListener('click', () => {
    const lotSize = document.getElementById('orderdesk-lot-slider')?.value || '10';
    const user = getCurrentCatalogUser();
    const text = encodeURIComponent(
      `Olá Christian! Sou o parceiro credenciado ${user?.name || ''} (${user?.company || ''} - ${user?.city || ''}) e gostaria de fechar a minuta de encomenda de um lote inicial de fábrica de *${lotSize} motocicletas elétricas Z8*.`
    );
    window.open(`https://wa.me/5512998008818?text=${text}`, '_blank');
  });

  // Drawer Close Button
  document.getElementById('z8-drawer-close-btn')?.addEventListener('click', closeZ8ModelDrawer);
  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeAdminModal);
});
