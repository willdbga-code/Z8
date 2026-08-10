import { z8Models } from './data/models.js';
import { franchiseTiers, complianceInfo } from './data/franchiseInfo.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNav();
  renderShowroom(z8Models);
  initFilters();
  renderFranchiseTiers();
  renderOrderDesk();
  renderCompliance();
  initCalculator();
  initModals();
  initForm();
});

/* --------------------------------------------------------------------------
   1. SKEUOMORPHIC THEME TOGGLE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Restore stored theme or default to dark
  const savedTheme = localStorage.getItem('z8-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  toggle.checked = savedTheme === 'dark';

  toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('z8-theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. NAVIGATION SCROLL & TAB ACTIVE
   -------------------------------------------------------------------------- */
function initNav() {
  const navBtns = document.querySelectorAll('.skeuo-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      const targetSec = document.getElementById(`${targetId}-section`);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.getElementById('btn-open-franchise')?.addEventListener('click', () => {
    document.getElementById('franchise-form-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('btn-explore-models')?.addEventListener('click', () => {
    document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   3. SHOWROOM MODELS GRID RENDER
   -------------------------------------------------------------------------- */
function renderShowroom(models) {
  const container = document.getElementById('models-grid-container');
  if (!container) return;

  container.innerHTML = models.map(model => `
    <div class="model-card skeuo-card">
      <div class="card-top-tag">
        <span class="tag-badge ${model.isExclusiveFranchise ? 'tag-exclusive' : 'tag-standard'}">
          ${model.isExclusiveFranchise ? '<i class="fa-solid fa-crown"></i> Exclusivo Franquia' : model.tag}
        </span>
        <span class="price-margin">${model.marginPct}% Margem B2B</span>
      </div>

      <div class="model-img-wrapper">
        <img src="${model.image}" alt="${model.name}" class="model-img" loading="lazy" />
      </div>

      <div>
        <h3 class="model-title">${model.name}</h3>
        <p class="model-code">Cód. Fábrica: <strong>${model.code}</strong> | Motor: ${model.motor}</p>
        
        <div class="model-specs-list">
          <div class="spec-item"><i class="fa-solid fa-gauge-high"></i> ${model.speed}</div>
          <div class="spec-item"><i class="fa-solid fa-battery-full"></i> ${model.range.split('/')[0]}</div>
          <div class="spec-item"><i class="fa-solid fa-compact-disc"></i> ${model.brakes.split(' ')[0]}</div>
          <div class="spec-item"><i class="fa-solid fa-microchip"></i> ${model.features[0] || 'NFC Keyless'}</div>
        </div>

        <div class="model-price-box">
          <div class="price-wholesale">
            <span class="price-label">Preço Atacado Franqueado</span>
            <span class="price-val">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</span>
          </div>
          <div class="price-wholesale" style="text-align: right;">
            <span class="price-label">Sugerido Varejo</span>
            <span class="price-val" style="font-size: 1rem; color: var(--text-muted);">R$ ${model.retailPrice.toLocaleString('pt-BR')},00</span>
          </div>
        </div>

        <button class="skeuo-button secondary-metal-btn full-width btn-detail" data-id="${model.id}">
          <i class="fa-solid fa-circle-info"></i> Ver Ficha Técnica Completa
        </button>
      </div>
    </div>
  `).join('');

  // Attach modal detail click
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelId = btn.getAttribute('data-id');
      openModelModal(modelId);
    });
  });
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderShowroom(z8Models);
      } else if (filter === 'exclusive') {
        renderShowroom(z8Models.filter(m => m.isExclusiveFranchise));
      } else {
        renderShowroom(z8Models.filter(m => m.category === filter));
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. FRANCHISE TIERS & COMPLIANCE RENDER
   -------------------------------------------------------------------------- */
function renderFranchiseTiers() {
  const container = document.getElementById('tiers-grid-container');
  if (!container) return;

  container.innerHTML = franchiseTiers.map(tier => `
    <div class="tier-card skeuo-card">
      <div>
        <div class="tier-header">
          <h4 class="tier-title">${tier.name}</h4>
          <span class="tier-badge">${tier.badge}</span>
        </div>
        <div class="tier-moq"><i class="fa-solid fa-boxes-stacked"></i> ${tier.moq}</div>
        <div class="tier-discount">${tier.discount}</div>
        <p class="tier-support"><strong>Suporte & Vantagens:</strong> ${tier.support}</p>
      </div>
      <button class="skeuo-button primary-metal-btn full-width btn-select-tier" style="margin-top: 16px;">
        <i class="fa-solid fa-check-circle"></i> Escolher Este Nível
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.btn-select-tier').forEach(b => {
    b.addEventListener('click', () => {
      document.getElementById('franchise-form-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderCompliance() {
  const container = document.getElementById('compliance-grid-container');
  if (!container) return;

  container.innerHTML = complianceInfo.map(item => `
    <div class="compliance-card skeuo-card">
      <div class="pillar-icon"><i class="fa-solid fa-file-contract"></i></div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   5. ORDER DESK TABLE RENDER
   -------------------------------------------------------------------------- */
function renderOrderDesk() {
  const tbody = document.getElementById('orderdesk-tbody');
  if (!tbody) return;

  tbody.innerHTML = z8Models.map(m => `
    <tr>
      <td><strong>${m.name}</strong></td>
      <td><code>${m.code}</code></td>
      <td>
        <span class="tag-badge ${m.isExclusiveFranchise ? 'tag-exclusive' : 'tag-standard'}">
          ${m.isExclusiveFranchise ? 'Exclusivo Franquia' : 'Linha Aberta'}
        </span>
      </td>
      <td>R$ ${m.retailPrice.toLocaleString('pt-BR')},00</td>
      <td><strong style="color: var(--accent-neon);">R$ ${m.wholesalePrice.toLocaleString('pt-BR')},00</strong></td>
      <td><span class="price-margin">+${m.marginPct}%</span></td>
      <td>
        <button class="skeuo-button secondary-metal-btn btn-order-sim" style="padding: 6px 12px; font-size: 0.8rem;">
          <i class="fa-solid fa-cart-plus"></i> Simular Lote
        </button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.btn-order-sim').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   6. SKEUOMORPHIC ROI CALCULATOR LOGIC
   -------------------------------------------------------------------------- */
function initCalculator() {
  const inputMoq = document.getElementById('input-moq');
  const displayMoq = document.getElementById('display-moq-val');
  const selectModel = document.getElementById('select-model-mix');
  const displayTierDiscount = document.getElementById('display-tier-discount');
  const badgeText = document.getElementById('discount-badge-text');

  const resCost = document.getElementById('res-cost-total');
  const resRevenue = document.getElementById('res-revenue-total');
  const resProfit = document.getElementById('res-profit-total');
  const resMargin = document.getElementById('res-margin-pct');
  const resPayback = document.getElementById('res-payback');

  function calculate() {
    const moq = parseInt(inputMoq.value, 10);
    displayMoq.innerText = `${moq} Motos`;

    // Determine Tier Discount & Badge
    let discountPct = 35;
    let tierName = 'Franquia Standard';
    if (moq >= 25) {
      discountPct = 55;
      tierName = 'Distribuidor Regional (Hub Contêiner)';
    } else if (moq >= 10) {
      discountPct = 45;
      tierName = 'Franquia Master Z8 E-motion';
    }

    displayTierDiscount.innerText = `${discountPct}% OFF`;
    if (badgeText) badgeText.innerText = `Nível Ativo: ${tierName}`;

    // Get selected model base wholesale and retail price
    const modelObj = z8Models.find(m => m.id === selectModel.value) || z8Models[0];
    
    // Apply tier discount dynamically if applicable
    const unitCost = modelObj.wholesalePrice * (1 - (discountPct - 35) * 0.005);
    const unitRetail = modelObj.retailPrice;

    const totalCost = unitCost * moq;
    const totalRevenue = unitRetail * moq;
    const totalProfit = totalRevenue - totalCost;
    const marginPct = ((totalProfit / totalRevenue) * 100).toFixed(1);
    
    // Payback calculation (assuming avg sales of 6 motos/month for small, 15/month for medium, 30/month for large)
    const monthlySalesRate = Math.max(4, Math.round(moq * 0.6));
    const monthlyProfitRate = (totalProfit / moq) * monthlySalesRate;
    const paybackMonths = (totalCost / monthlyProfitRate).toFixed(1);

    // Update LCD Screen
    resCost.innerText = `R$ ${Math.round(totalCost).toLocaleString('pt-BR')},00`;
    resRevenue.innerText = `R$ ${Math.round(totalRevenue).toLocaleString('pt-BR')},00`;
    resProfit.innerText = `R$ ${Math.round(totalProfit).toLocaleString('pt-BR')},00`;
    resMargin.innerText = `${marginPct}%`;
    resPayback.innerText = `${paybackMonths} Meses`;
  }

  inputMoq.addEventListener('input', calculate);
  selectModel.addEventListener('change', calculate);
  calculate(); // Initial trigger

  document.getElementById('btn-request-proposal')?.addEventListener('click', () => {
    document.getElementById('franchise-form-section')?.scrollIntoView({ behavior: 'smooth' });
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
        <span class="tag-badge ${model.isExclusiveFranchise ? 'tag-exclusive' : 'tag-standard'}">
          ${model.isExclusiveFranchise ? '<i class="fa-solid fa-crown"></i> Exclusivo Franquia Z8 E-motion' : model.tag}
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
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">PREÇO DE ATACADO FRANQUEADO</span>
            <strong style="font-size: 1.4rem; color: var(--accent-neon);">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</strong>
          </div>
          <button class="skeuo-button primary-metal-btn" onclick="document.getElementById('modal-model-detail').classList.add('hidden'); document.getElementById('franchise-form-section').scrollIntoView({behavior:'smooth'});">
            <i class="fa-solid fa-file-invoice"></i> Solicitar Lote
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

/* --------------------------------------------------------------------------
   8. FORM SUBMIT HANDLER
   -------------------------------------------------------------------------- */
function initForm() {
  const form = document.getElementById('franchise-lead-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('lead-name').value;
    const city = document.getElementById('lead-city').value;

    alert(`✅ CADASTRO RECEBIDO COM SUCESSO!\n\nObrigado, ${name}. Registramos seu interesse de franquia para a região de ${city}.\n\nEm instantes, nossa equipe de expansão Z8 E-motion enviará por WhatsApp e E-mail a Tabela de Preços de Importação e a Minuta do Contrato de Franquia com Proteção Territorial.`);
    form.reset();
  });
}
