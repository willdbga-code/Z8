import { z8Models } from './data/models.js';
import { franchiseTiers, complianceInfo } from './data/franchiseInfo.js';
import {
  getRegisteredUsers,
  registerCatalogUser,
  loginCatalogUser,
  updateUserStatus,
  getCurrentCatalogUser,
  isCatalogApproved,
  logoutCatalogUser
} from './catalog-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  renderShowroom();
  renderOrderDesk();
  renderCompliance();
  initCalculator();
  initModals();
  initCatalogAuth();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeSwitch = document.getElementById('theme-toggle-switch');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('z8_theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'light';
  }

  themeSwitch?.addEventListener('change', (e) => {
    const newTheme = e.target.checked ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('z8_theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. SMOOTH SCROLL & NAVIGATION
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navBtns = document.querySelectorAll('.skeuo-nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetSection = document.getElementById(`${targetId}-section`);

      if (targetSection) {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.getElementById('btn-open-franchise')?.addEventListener('click', () => {
    window.location.href = '/vendas/index.html#franchise-form-section';
  });

  document.getElementById('btn-explore-models')?.addEventListener('click', () => {
    document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   3. SHOWROOM MODELS GRID RENDER
   -------------------------------------------------------------------------- */
function renderShowroom(filterCategory = 'todos') {
  const grid = document.getElementById('models-grid-container');
  if (!grid) return;

  const filtered = filterCategory === 'todos'
    ? z8Models
    : z8Models.filter(m => m.category === filterCategory);

  grid.innerHTML = filtered.map(model => {
    const profit = model.profit ?? (model.retailPrice - model.wholesalePrice);
    const markupPct = model.markupPct ?? (((model.retailPrice - model.wholesalePrice) / model.wholesalePrice) * 100).toFixed(1);
    const rankText = model.rank ? `#${model.rank} Ranking` : '';

    return `
    <div class="skeuo-card model-card animate-on-scroll">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span class="skeuo-badge ${model.isExclusiveFranchise ? 'gold' : ''}">
          ${model.tag}
        </span>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">${rankText}</span>
      </div>

      <div class="model-img-wrapper">
        <img src="${model.image}" alt="${model.name}" class="model-img" />
      </div>

      <div>
        <h3 class="model-title">${model.name}</h3>
        <p class="model-code">Código Fábrica: ${model.code}</p>

        <div class="model-specs-list">
          <div class="spec-item"><i class="fa-solid fa-bolt"></i> ${model.motor}</div>
          <div class="spec-item"><i class="fa-solid fa-gauge-high"></i> ${model.speed}</div>
          <div class="spec-item"><i class="fa-solid fa-battery-full"></i> ${model.range}</div>
          <div class="spec-item"><i class="fa-solid fa-chart-line"></i> ${markupPct}% Markup</div>
        </div>

        <div class="model-price-box">
          <div class="price-wholesale">
            <span class="price-label">Preço Atacado Parceiro</span>
            <span class="price-val">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</span>
          </div>
          <div class="price-margin">
            Lucro R$ ${profit.toLocaleString('pt-BR')}
          </div>
        </div>

        <button class="skeuo-button secondary-metal-btn full-width btn-detail" data-id="${model.id}">
          <i class="fa-solid fa-circle-info"></i> Detalhes do Modelo
        </button>
      </div>
    </div>
  `;
  }).join('');

  grid.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelId = btn.getAttribute('data-id');
      openModelModal(modelId);
    });
  });

  initFilterBar();
}

function initFilterBar() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderShowroom(cat);
    });
  });
}



/* --------------------------------------------------------------------------
   5. ORDER DESK TABLE RENDER
   -------------------------------------------------------------------------- */
function renderOrderDesk() {
  const tbody = document.getElementById('orderdesk-table-body');
  if (!tbody) return;

  tbody.innerHTML = z8Models.map((model, idx) => {
    const profit = model.profit ?? (model.retailPrice - model.wholesalePrice);
    const markupPct = model.markupPct ?? (((model.retailPrice - model.wholesalePrice) / model.wholesalePrice) * 100).toFixed(1);
    const marginPct = model.marginPct ?? (((model.retailPrice - model.wholesalePrice) / model.retailPrice) * 100).toFixed(1);
    const rank = model.rank ?? (idx + 1);

    return `
    <tr>
      <td><strong>${rank}º</strong></td>
      <td><strong>${model.name}</strong></td>
      <td><code style="background: var(--bg-inset); padding: 2px 6px; border-radius: 4px;">${model.code}</code></td>
      <td><span style="color: var(--accent-neon); font-weight: 700;">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</span></td>
      <td>R$ ${model.retailPrice.toLocaleString('pt-BR')},00</td>
      <td><strong style="color: var(--accent-emerald);">R$ ${profit.toLocaleString('pt-BR')},00</strong></td>
      <td><span style="color: var(--accent-gold); font-weight: 700;">${markupPct}%</span></td>
      <td>${marginPct}%</td>
      <td>
        <button class="skeuo-button secondary-metal-btn btn-table-order" data-id="${model.id}" style="padding: 6px 12px; font-size: 0.8rem;">
          <i class="fa-solid fa-cart-plus"></i> Pedir Lote
        </button>
      </td>
    </tr>
  `;
  }).join('');

  tbody.querySelectorAll('.btn-table-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelId = btn.getAttribute('data-id');
      const selectModel = document.getElementById('select-model-mix');
      if (selectModel) {
        selectModel.value = modelId;
        selectModel.dispatchEvent(new Event('change'));
        document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5.1 COMPLIANCE GRID RENDER
   -------------------------------------------------------------------------- */
function renderCompliance() {
  const container = document.getElementById('compliance-grid-container');
  if (!container) return;

  container.innerHTML = complianceInfo.map(item => `
    <div class="skeuo-card compliance-card">
      <h3><i class="fa-solid fa-shield-check text-emerald"></i> ${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   6. CALCULATOR SKEUOMORPHIC LOGIC
   -------------------------------------------------------------------------- */
function initCalculator() {
  const inputMoq = document.getElementById('calc-moq-slider');
  const displayMoq = document.getElementById('display-moq-val');
  const selectModel = document.getElementById('select-model-mix');
  const displayTierDiscount = document.getElementById('display-tier-discount');

  const resCost = document.getElementById('res-cost-total');
  const resRevenue = document.getElementById('res-revenue-total');
  const resProfit = document.getElementById('res-profit-total');
  const resMargin = document.getElementById('res-margin-pct');

  function calculate() {
    const moq = parseInt(inputMoq.value, 10);
    displayMoq.innerText = `${moq} Motos`;

    const modelObj = z8Models.find(m => m.id === selectModel.value) || z8Models[0];
    
    const unitCost = modelObj.wholesalePrice;
    const unitRetail = modelObj.retailPrice;

    const totalCost = unitCost * moq;
    const totalRevenue = unitRetail * moq;
    const totalProfit = totalRevenue - totalCost;
    const markupPct = ((totalProfit / totalCost) * 100).toFixed(2).replace('.', ',');
    
    if (displayTierDiscount) {
      displayTierDiscount.innerText = `${markupPct}% MARKUP`;
    }

    resCost.innerText = `R$ ${Math.round(totalCost).toLocaleString('pt-BR')},00`;
    resRevenue.innerText = `R$ ${Math.round(totalRevenue).toLocaleString('pt-BR')},00`;
    resProfit.innerText = `R$ ${Math.round(totalProfit).toLocaleString('pt-BR')},00`;
    resMargin.innerText = `${markupPct}% Markup`;
  }

  inputMoq?.addEventListener('input', calculate);
  selectModel?.addEventListener('change', calculate);
  calculate();

  document.getElementById('btn-request-proposal')?.addEventListener('click', () => {
    window.location.href = '/vendas/index.html#franchise-form-section';
  });
}

/* --------------------------------------------------------------------------
   7. MODEL DETAIL MODAL
   -------------------------------------------------------------------------- */
function initModals() {
  const modal = document.getElementById('modal-model-detail');
  const closeBtn = document.getElementById('modal-close');

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function openModelModal(modelId) {
  const model = z8Models.find(m => m.id === modelId);
  if (!model) return;

  const modal = document.getElementById('modal-model-detail');
  const body = document.getElementById('modal-body-content');

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: center;">
      <div class="skeuo-inset" style="text-align: center;">
        <img src="${model.image}" alt="${model.name}" style="width: 100%; max-height: 300px; object-fit: contain;" />
      </div>

      <div>
        <span class="tag-badge tag-standard">
          ${model.tag}
        </span>
        <h2 style="font-size: 1.6rem; color: var(--text-heading); margin: 10px 0 4px 0;">${model.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">Código da Fábrica: <strong>${model.code}</strong></p>
        
        <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 20px;">${model.description}</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem; background: var(--bg-inset); padding: 14px; border-radius: 10px; margin-bottom: 20px;">
          <div><strong>Motor:</strong> ${model.motor}</div>
          <div><strong>Velocidade Máx:</strong> ${model.speed}</div>
          <div><strong>Autonomia:</strong> ${model.range}</div>
          <div><strong>Bateria:</strong> ${model.battery}</div>
          <div><strong>Freios:</strong> ${model.brakes}</div>
          <div><strong>Pneus:</strong> ${model.tires}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.9rem; color: var(--text-heading); margin-bottom: 8px;">Recursos & Tecnologia Nativa:</h4>
          <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-muted);">
            ${model.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-inset); padding: 14px; border-radius: 10px; border: 1px solid var(--border-metal);">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">PREÇO DE ATACADO PARCEIRO</span>
            <strong style="font-size: 1.4rem; color: var(--accent-neon);">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</strong>
          </div>
          <button class="skeuo-button primary-metal-btn" onclick="document.getElementById('modal-model-detail').classList.add('hidden'); window.location.href='/vendas/index.html#franchise-form-section';">
            <i class="fa-solid fa-file-invoice"></i> Solicitar Lote
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

/* --------------------------------------------------------------------------
   8. CATALOG ACCESS CONTROL & ADMIN APPROVAL MANAGEMENT
   -------------------------------------------------------------------------- */
function initCatalogAuth() {
  const loginGate = document.getElementById('catalog-login-gate');
  const mainContent = document.getElementById('catalog-main-content');
  const adminModal = document.getElementById('catalog-admin-modal');
  const openLoginBtn = document.getElementById('open-catalog-login-btn');
  const openAdminBtn = document.getElementById('open-catalog-admin-btn');
  const closeAdminBtn = document.getElementById('close-catalog-admin-btn');
  const badgeText = document.getElementById('catalog-user-badge');

  const tabLoginBtn = document.getElementById('tab-cat-login');
  const tabRegBtn = document.getElementById('tab-cat-register');
  const boxLogin = document.getElementById('cat-box-login');
  const boxReg = document.getElementById('cat-box-register');

  const loginForm = document.getElementById('cat-login-form');
  const regForm = document.getElementById('cat-register-form');
  const loginMsg = document.getElementById('cat-login-msg');
  const regMsg = document.getElementById('cat-reg-msg');
  const adminUsersList = document.getElementById('cat-admin-users-list');

  function updateHeaderAuth() {
    const user = getCurrentCatalogUser();
    const approved = isCatalogApproved();

    if (user && approved) {
      if (loginGate) loginGate.style.display = 'none';
      if (mainContent) mainContent.style.display = 'block';
      if (badgeText) badgeText.textContent = `Sair (${user.email})`;
      if (openAdminBtn) {
        openAdminBtn.style.display = (user.email.toLowerCase() === 'christian.tkh@gmail.com') ? 'inline-flex' : 'none';
      }
    } else {
      if (loginGate) loginGate.style.display = 'flex';
      if (mainContent) mainContent.style.display = 'none';
      if (badgeText) badgeText.textContent = 'Área de Login';
      if (openAdminBtn) openAdminBtn.style.display = 'none';
    }
  }

  updateHeaderAuth();

  window.addEventListener('z8-catalog-auth-changed', () => {
    updateHeaderAuth();
  });

  window.addEventListener('z8-catalog-users-updated', () => {
    renderAdminUsersList();
    renderShowroom();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#open-catalog-login-btn') || e.target.closest('.open-catalog-login-trigger')) {
      const user = getCurrentCatalogUser();
      if (user && isCatalogApproved()) {
        if (confirm(`Você está conectado como ${user.email}. Deseja sair?`)) {
          logoutCatalogUser();
        }
      } else {
        if (loginGate) loginGate.style.display = 'flex';
      }
    }
  });

  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      renderAdminUsersList();
      if (adminModal) adminModal.classList.remove('hidden');
    });
  }

  if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => adminModal?.classList.add('hidden'));

  if (tabLoginBtn && tabRegBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.style.background = '#00F2FE';
      tabLoginBtn.style.color = '#0b0e14';
      tabRegBtn.style.background = 'transparent';
      tabRegBtn.style.color = '#94a3b8';
      boxLogin.style.display = 'block';
      boxReg.style.display = 'none';
    });

    tabRegBtn.addEventListener('click', () => {
      tabRegBtn.style.background = '#10B981';
      tabRegBtn.style.color = '#ffffff';
      tabLoginBtn.style.background = 'transparent';
      tabLoginBtn.style.color = '#94a3b8';
      boxReg.style.display = 'block';
      boxLogin.style.display = 'none';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('cat-login-user').value;
      const passVal = document.getElementById('cat-login-pass').value;

      const res = loginCatalogUser(userVal, passVal);
      if (res.success) {
        if (loginMsg) loginMsg.style.display = 'none';
        if (loginGate) loginGate.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        renderShowroom();
      } else {
        if (loginMsg) {
          loginMsg.style.display = 'block';
          loginMsg.style.background = res.isPending ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)';
          loginMsg.style.border = res.isPending ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(239,68,68,0.3)';
          loginMsg.style.color = res.isPending ? '#fcd34d' : '#fca5a5';
          loginMsg.textContent = res.error;
        }
      }
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cat-reg-name').value;
      const company = document.getElementById('cat-reg-company').value;
      const email = document.getElementById('cat-reg-email').value;
      const phone = document.getElementById('cat-reg-phone').value;
      const password = document.getElementById('cat-reg-pass').value;

      const res = registerCatalogUser({ name, company, email, phone, password });
      if (res.success) {
        regForm.reset();
        if (regMsg) {
          regMsg.style.display = 'block';
          regMsg.style.background = 'rgba(16,185,129,0.15)';
          regMsg.style.border = '1px solid rgba(16,185,129,0.3)';
          regMsg.style.color = '#6ee7b7';
          regMsg.innerHTML = `🎉 <strong>Cadastro registrado com sucesso!</strong><br>Sua conta (${email}) foi enviada. <strong>Aguarde a aprovação do Administrador Master (christian.tkh@gmail.com)</strong> para seu primeiro acesso!`;
        }
        setTimeout(() => {
          if (tabLoginBtn) tabLoginBtn.click();
        }, 3000);
      } else {
        if (regMsg) {
          regMsg.style.display = 'block';
          regMsg.style.background = 'rgba(239,68,68,0.15)';
          regMsg.style.border = '1px solid rgba(239,68,68,0.3)';
          regMsg.style.color = '#fca5a5';
          regMsg.textContent = res.error;
        }
      }
    });
  }

  function renderAdminUsersList() {
    if (!adminUsersList) return;
    const users = getRegisteredUsers();

    adminUsersList.innerHTML = users.map(u => {
      const isMaster = u.email.toLowerCase() === 'christian.tkh@gmail.com';
      const statusBadge = isMaster
        ? '<span style="color: #00F2FE; font-weight: 700;">👑 Admin Master (Ativo)</span>'
        : u.status === 'approved'
          ? '<span style="color: #10B981; font-weight: 700;">🟢 Acesso Aprovado</span>'
          : u.status === 'blocked'
            ? '<span style="color: #EF4444; font-weight: 700;">🔴 Acesso Bloqueado</span>'
            : '<span style="color: #F59E0B; font-weight: 700;">🟡 Aguardando Aprovação</span>';

      const actionButtons = isMaster
        ? '<span style="font-size: 0.75rem; color: #64748b;">Proprietário Master</span>'
        : `
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn-approve-user" data-id="${u.id}" style="background: rgba(16,185,129,0.2); border: 1px solid #10B981; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 700;">
              <i class="fa-solid fa-check"></i> Aprovar Acesso
            </button>
            <button type="button" class="btn-block-user" data-id="${u.id}" style="background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 700;">
              <i class="fa-solid fa-ban"></i> Bloquear
            </button>
          </div>
        `;

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px;"><strong>${u.name}</strong><br><span style="font-size: 0.75rem; color: #64748b;">${u.company}</span></td>
          <td style="padding: 10px;"><a href="mailto:${u.email}" style="color: #38bdf8; text-decoration: none;">${u.email}</a></td>
          <td style="padding: 10px;">${u.phone || 'N/A'}</td>
          <td style="padding: 10px;">${statusBadge}</td>
          <td style="padding: 10px;">${actionButtons}</td>
        </tr>
      `;
    }).join('');

    adminUsersList.querySelectorAll('.btn-approve-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateUserStatus(id, 'approved');
      });
    });

    adminUsersList.querySelectorAll('.btn-block-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateUserStatus(id, 'blocked');
      });
    });
  }
}
