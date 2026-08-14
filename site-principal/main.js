import { z8Models } from './data/models.js';
import { franchiseTiers, complianceInfo } from './data/franchiseInfo.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  renderShowroom();
  renderOrderDesk();
  renderCompliance();
  initCalculator();
  initModals();
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
