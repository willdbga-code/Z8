import { z8Models } from './data/models.js';
import { franchiseTiers, complianceInfo } from './data/franchiseInfo.js';
import {
  getStoredWarrantyOrders,
  getWarrantyOrdersForUser,
  saveWarrantyOrder,
  updateWarrantyOrderStatus,
  deleteWarrantyOrder,
  getWarrantyOrderById,
  fetchWarrantyOrdersFromFirestore
} from './data/warranty-db.js';
import {
  getRegisteredUsers,
  createPartnerByAdmin,
  registerCatalogUser,
  loginCatalogUser,
  updateUserStatus,
  deleteCatalogUser,
  getCurrentCatalogUser,
  isCatalogApproved,
  logoutCatalogUser,
  checkUrlApproval,
  fetchUsersFromCloud,
  resetCatalogUserPassword
} from './catalog-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const approvedViaUrl = checkUrlApproval();
  if (approvedViaUrl) {
    setTimeout(() => {
      alert(`🎉 Acesso comercial liberado com sucesso para o parceiro: ${approvedViaUrl}`);
    }, 500);
  }

  // Cloud sync on startup
  fetchUsersFromCloud();
  fetchWarrantyOrdersFromFirestore();

  initThemeToggle();
  initNavigation();
  initFilterBar();
  renderShowroom();
  renderOrderDesk();
  renderCompliance();
  initCalculator();
  renderDownloads();
  initModals();
  initCatalogAuth();
  initWarrantyPortal();
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

  const approved = isCatalogApproved();
  const currentUser = getCurrentCatalogUser();

  const filtered = filterCategory === 'todos'
    ? z8Models
    : z8Models.filter(m => {
        if (filterCategory === 'alta-velocidade' || filterCategory === 'performance' || filterCategory === 'esportiva') {
          return m.category === 'alta-velocidade' || m.category === 'custom' || m.category === 'performance';
        }
        if (filterCategory === 'urbana' || filterCategory === 'urbanas') {
          return m.category === 'urbana';
        }
        if (filterCategory === 'vintage') {
          return m.category === 'vintage';
        }
        if (filterCategory === 'utilitaria' || filterCategory === 'utilitarias') {
          return m.category === 'utilitaria';
        }
        return m.category === filterCategory;
      });

  grid.innerHTML = filtered.map(model => {
    const profit = model.profit ?? (model.retailPrice - model.wholesalePrice);
    const markupPct = model.markupPct ?? (((model.retailPrice - model.wholesalePrice) / model.wholesalePrice) * 100).toFixed(1);
    const rankText = model.rank ? `#${model.rank} Ranking` : '';

    const priceBoxHtml = approved
      ? `
        <div class="model-price-box">
          <div class="price-wholesale">
            <span class="price-label">Preço Atacado Parceiro</span>
            <span class="price-val">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</span>
          </div>
          <div class="price-margin">
            Lucro R$ ${profit.toLocaleString('pt-BR')}
          </div>
        </div>
      `
      : `
        <div class="model-price-box" style="border-color: rgba(251,191,36,0.3); background: rgba(251,191,36,0.05);">
          <div class="price-wholesale">
            <span class="price-label">Preço Atacado Fábrica</span>
            <span class="price-val" style="color: #fbbf24; font-size: 0.85rem;"><i class="fa-solid fa-lock"></i> Sob Consulta</span>
          </div>
          <button type="button" class="price-margin btn-unlock-price" data-model="${model.name}" data-code="${model.code}" style="background: rgba(251,191,36,0.18); color: #fbbf24; border: 1px solid rgba(251,191,36,0.4); cursor: pointer; border-radius: 6px; padding: 5px 12px; font-weight: 700; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-brands fa-whatsapp"></i> Liberar Acesso
          </button>
        </div>
      `;

    const specMarkup = approved
      ? `<div class="spec-item"><i class="fa-solid fa-chart-line"></i> ${markupPct}% Markup</div>`
      : `<div class="spec-item btn-unlock-price" data-model="${model.name}" data-code="${model.code}" style="color: #fbbf24; cursor: pointer;"><i class="fa-solid fa-lock"></i> Tabela Restrita</div>`;

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
          ${specMarkup}
        </div>

        ${priceBoxHtml}

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

  // Wire up 'Liberar Acesso' and 'Tabela Restrita' unlock buttons
  grid.querySelectorAll('.btn-unlock-price').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modelName = btn.getAttribute('data-model') || 'Z8 E-Motion';
      const user = getCurrentCatalogUser();
      const cleanPhone = '5512998008818';

      let msg = '';
      if (user) {
        msg = `Olá Christian! Sou ${user.name || user.company} da empresa ${user.company || 'Parceira'} (e-mail: ${user.email}). Solicitei cadastro no catálogo Z8 e gostaria de liberar meu acesso para visualizar os preços de atacado e margens do modelo ${modelName}.`;
      } else {
        msg = `Olá Christian! Estou visualizando o catálogo da Z8 E-Motion e gostaria de liberar meu acesso para consultar os preços e condições de atacado do modelo ${modelName}.`;
      }

      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  });
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
   5. ORDER DESK TABLE RENDER (RESTRICTED TO APPROVED USERS)
   -------------------------------------------------------------------------- */
function renderOrderDesk() {
  const tbody = document.getElementById('orderdesk-table-body');
  if (!tbody) return;

  const approved = isCatalogApproved();

  tbody.innerHTML = z8Models.map((model, idx) => {
    const profit = model.profit ?? (model.retailPrice - model.wholesalePrice);
    const markupPct = model.markupPct ?? (((model.retailPrice - model.wholesalePrice) / model.wholesalePrice) * 100).toFixed(1);
    const marginPct = model.marginPct ?? (((model.retailPrice - model.wholesalePrice) / model.retailPrice) * 100).toFixed(1);
    const rank = model.rank ?? (idx + 1);

    const wholesaleCol = approved
      ? `<span style="color: var(--accent-neon); font-weight: 700;">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</span>`
      : `<span style="color: #fbbf24; font-size: 0.82rem;"><i class="fa-solid fa-lock"></i> Sob Consulta</span>`;

    const profitCol = approved
      ? `<strong style="color: var(--accent-emerald);">R$ ${profit.toLocaleString('pt-BR')},00</strong>`
      : `<span style="color: #fbbf24; font-size: 0.82rem;"><i class="fa-solid fa-lock"></i> Restrito</span>`;

    const markupCol = approved
      ? `<span style="color: var(--accent-gold); font-weight: 700;">${markupPct}%</span>`
      : `<span style="color: #fbbf24; font-size: 0.82rem;"><i class="fa-solid fa-lock"></i> Restrito</span>`;

    const marginCol = approved
      ? `${marginPct}%`
      : `<span style="color: #fbbf24; font-size: 0.82rem;"><i class="fa-solid fa-lock"></i> Restrito</span>`;

    const actionCol = approved
      ? `<button class="skeuo-button secondary-metal-btn btn-table-order" data-id="${model.id}" style="padding: 6px 12px; font-size: 0.8rem;">
           <i class="fa-solid fa-cart-plus"></i> Pedir Lote
         </button>`
      : `<button class="skeuo-button secondary-metal-btn btn-unlock-table-order" data-model="${model.name}" style="padding: 6px 12px; font-size: 0.78rem; background: rgba(251,191,36,0.16); color: #fbbf24; border: 1px solid rgba(251,191,36,0.35); font-weight: 700; cursor: pointer;">
           <i class="fa-brands fa-whatsapp"></i> Liberar Acesso
         </button>`;

    return `
    <tr>
      <td><strong>${rank}º</strong></td>
      <td><strong>${model.name}</strong></td>
      <td><code style="background: var(--bg-inset); padding: 2px 6px; border-radius: 4px;">${model.code}</code></td>
      <td>${wholesaleCol}</td>
      <td>R$ ${model.retailPrice.toLocaleString('pt-BR')},00</td>
      <td>${profitCol}</td>
      <td>${markupCol}</td>
      <td>${marginCol}</td>
      <td>${actionCol}</td>
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

  tbody.querySelectorAll('.btn-unlock-table-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelName = btn.getAttribute('data-model');
      const user = getCurrentCatalogUser();
      const cleanPhone = '5512998008818';
      let msg = '';
      if (user) {
        msg = `Olá Christian! Sou ${user.name || user.company} (${user.email}). Solicitei cadastro no catálogo Z8 e gostaria de liberar o acesso para visualizar a tabela de atacado do modelo ${modelName}.`;
      } else {
        msg = `Olá Christian! Gostaria de solicitar a liberação da tabela de atacado e margens do modelo ${modelName} no portal Z8.`;
      }
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
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
   6. CALCULATOR SKEUOMORPHIC LOGIC (RESTRICTED TO APPROVED USERS)
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
  const btnProposal = document.getElementById('btn-request-proposal');

  function populateSelect() {
    if (!selectModel) return;
    const approved = isCatalogApproved();
    const currentVal = selectModel.value || z8Models[0].id;

    selectModel.innerHTML = z8Models.map((m, idx) => {
      const label = approved
        ? `${idx + 1}º ${m.name} (R$ ${m.wholesalePrice.toLocaleString('pt-BR')} / R$ ${m.retailPrice.toLocaleString('pt-BR')})`
        : `${idx + 1}º ${m.name} (R$ ${m.retailPrice.toLocaleString('pt-BR')} Varejo - Atacado Sob Consulta)`;
      return `<option value="${m.id}" ${m.id === currentVal ? 'selected' : ''}>${label}</option>`;
    }).join('');
  }

  function calculate() {
    if (!inputMoq || !selectModel) return;
    const approved = isCatalogApproved();
    const moq = parseInt(inputMoq.value, 10);
    if (displayMoq) displayMoq.innerText = `${moq} Motos`;

    const modelObj = z8Models.find(m => m.id === selectModel.value) || z8Models[0];
    
    const unitCost = modelObj.wholesalePrice;
    const unitRetail = modelObj.retailPrice;

    const totalCost = unitCost * moq;
    const totalRevenue = unitRetail * moq;
    const totalProfit = totalRevenue - totalCost;
    const markupPct = ((totalProfit / totalCost) * 100).toFixed(2).replace('.', ',');

    if (approved) {
      if (displayTierDiscount) displayTierDiscount.innerHTML = `${markupPct}% MARKUP`;
      if (resCost) resCost.innerHTML = `R$ ${Math.round(totalCost).toLocaleString('pt-BR')},00`;
      if (resRevenue) resRevenue.innerHTML = `R$ ${Math.round(totalRevenue).toLocaleString('pt-BR')},00`;
      if (resProfit) resProfit.innerHTML = `R$ ${Math.round(totalProfit).toLocaleString('pt-BR')},00`;
      if (resMargin) resMargin.innerHTML = `${markupPct}% Markup`;
      if (btnProposal) {
        btnProposal.style.background = '';
        btnProposal.innerHTML = `<i class="fa-solid fa-file-invoice-dollar"></i> Solicitar Proposta Oficial para meu Lote`;
      }
    } else {
      if (displayTierDiscount) displayTierDiscount.innerHTML = `<i class="fa-solid fa-lock"></i> RESTRITO`;
      if (resCost) resCost.innerHTML = `<span style="color: #fbbf24; font-size: 1.05rem;"><i class="fa-solid fa-lock"></i> Sob Consulta</span>`;
      if (resRevenue) resRevenue.innerHTML = `R$ ${Math.round(totalRevenue).toLocaleString('pt-BR')},00`;
      if (resProfit) resProfit.innerHTML = `<span style="color: #fbbf24; font-size: 1.05rem;"><i class="fa-solid fa-lock"></i> Restrito</span>`;
      if (resMargin) resMargin.innerHTML = `<span style="color: #fbbf24; font-size: 0.9rem;"><i class="fa-solid fa-lock"></i> Restrito aos Franqueados</span>`;
      if (btnProposal) {
        btnProposal.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        btnProposal.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Solicitar Liberação dos Custos de Atacado`;
      }
    }
  }

  populateSelect();
  calculate();

  inputMoq?.addEventListener('input', calculate);
  selectModel?.addEventListener('change', calculate);

  btnProposal?.addEventListener('click', () => {
    const approved = isCatalogApproved();
    const moq = parseInt(inputMoq.value, 10);
    const modelObj = z8Models.find(m => m.id === selectModel.value) || z8Models[0];
    const totalCost = modelObj.wholesalePrice * moq;
    const totalProfit = (modelObj.retailPrice - modelObj.wholesalePrice) * moq;
    const currentUser = getCurrentCatalogUser();

    const clientName = currentUser?.name || 'Parceiro Z8';
    const clientCompany = currentUser?.company || 'Minha Loja';
    const clientCity = currentUser?.city || 'SP';
    const clientPhone = currentUser?.phone || 'Não informado';

    if (approved) {
      const propMsg = 
        `📋 *SOLICITAÇÃO DE PROPOSTA OFICIAL DE LOTE (SIMULADOR)*\n\n` +
        `🏍️ *Modelo Principal:* ${modelObj.name} (${modelObj.code})\n` +
        `🔢 *Quantidade Solicitada:* ${moq} Motos\n` +
        `💰 *Custo Total Estimado:* R$ ${Math.round(totalCost).toLocaleString('pt-BR')},00\n` +
        `📈 *Projeção de Lucro Bruto:* R$ ${Math.round(totalProfit).toLocaleString('pt-BR')},00\n\n` +
        `👤 *DADOS DO COMPRADOR:*\n` +
        `• *Nome:* ${clientName}\n` +
        `• *Empresa / Loja:* ${clientCompany}\n` +
        `• *Cidade / UF:* ${clientCity}\n` +
        `• *WhatsApp:* ${clientPhone}\n\n` +
        `_Olá! Gostaria de receber a formalização comercial deste lote com as opções de frete e prazos de entrega._`;

      const propUrl = `https://wa.me/5512998008818?text=${encodeURIComponent(propMsg)}`;
      window.open(propUrl, '_blank');
    } else {
      let unlockMsg = '';
      if (currentUser) {
        unlockMsg = `Olá Christian! Sou ${currentUser.name || currentUser.company} (${currentUser.email}). Gostaria de liberar meu acesso para visualizar a simulação e custos de atacado do lote de ${moq} unidades do modelo ${modelObj.name}.`;
      } else {
        unlockMsg = `Olá Christian! Gostaria de liberar o acesso para visualizar a simulação de rentabilidade e custos de atacado para um lote de ${moq} unidades do modelo ${modelObj.name}.`;
      }
      window.open(`https://wa.me/5512998008818?text=${encodeURIComponent(unlockMsg)}`, '_blank');
    }
  });
}

/* --------------------------------------------------------------------------
   6.1 OFFICIAL MANUALS & DOWNLOADS (RESTRICTED TO APPROVED USERS)
   -------------------------------------------------------------------------- */
const OFFICIAL_MANUALS = [
  {
    badge: 'Brandbook Oficial',
    badgeClass: '',
    icon: 'fa-palette',
    iconColor: 'text-cyan',
    title: 'Manual de Identidade Visual & Arquitetura Z8',
    desc: 'Padrões de letreiro em ACM, iluminação Backlight LED 6500K, planta baixa do showroom em 4 zonas, paleta de cores e uniformes oficiais.',
    pdfUrl: '/docs/manuais/MANUAL_DE_IDENTIDADE_VISUAL_E_ARQUITETURA_Z8.pdf'
  },
  {
    badge: 'Gestão Comercial',
    badgeClass: 'gold',
    icon: 'fa-briefcase',
    iconColor: 'text-gold',
    title: 'Manual de Operações & Vendas Consultivas',
    desc: 'Procedimentos Operacionais Padrão (POP), protocolo obrigatório de Test-Ride, cálculo de economia de combustível (R$ 0,025/km) e quebra de objeções.',
    pdfUrl: '/docs/manuais/MANUAL_DE_OPERACOES_E_VENDAS_CONSULTIVAS.pdf'
  },
  {
    badge: 'Oficina & Pós-Venda',
    badgeStyle: 'border-color: #10B981; color: #10B981; background: rgba(16,185,129,0.1);',
    icon: 'fa-wrench',
    iconColor: 'text-emerald',
    title: 'Manual de Assistência Técnica, PDI & Manutenção',
    desc: 'Ferramental mínimo obrigatório da oficina, Checklist de PDI em 32 pontos, plano de revisões programadas (300km a 5.000km) e tabela de torques em Nm.',
    pdfUrl: '/docs/manuais/MANUAL_DE_ASSISTENCIA_TECNICA_E_MANUTENCAO_PREVENTIVA.pdf'
  },
  {
    badge: 'Capacitação Técnica',
    badgeStyle: 'border-color: #a855f7; color: #c084fc; background: rgba(168,85,247,0.1);',
    icon: 'fa-bolt',
    iconCustomStyle: 'color: #c084fc;',
    title: 'Treinamento Técnico Inicial Homologado (16H)',
    desc: 'Apostila completa dos 4 módulos técnicos: Baterias Lítio/LiFePO4 & BMS, Controladores FOC, Motores BLDC de Cubo e Diagnóstico de Falhas com Osciloscópio.',
    pdfUrl: '/docs/manuais/TREINAMENTO_TECNICO_INICIAL_16H.pdf'
  },
  {
    badge: 'Termo & Checklist',
    badgeClass: '',
    icon: 'fa-clipboard-check',
    iconColor: 'text-emerald',
    title: 'Termo de Entrega Técnica & Checklist de PDI',
    desc: 'Instrumento formal de entrega ao consumidor final com checklist de 32 itens de segurança para assinatura e validação da garantia de fábrica.',
    pdfUrl: '/docs/juridico/TERMO_DE_ENTREGA_TECNICA_E_PDI.pdf'
  },
  {
    badge: 'Segurança Jurídica',
    badgeClass: 'gold',
    icon: 'fa-scale-balanced',
    iconColor: 'text-gold',
    title: 'Parecer Regulatório Resolução CONTRAN 996/2023',
    desc: 'Dossiê jurídico detalhado atestando a legalidade da circulação dos veículos elétricos leves autopropelidos em ciclovias e vias públicas no território nacional.',
    pdfUrl: '/docs/juridico/PARECER_REGULATORIO_CONTRAN_996.pdf'
  }
];

function renderDownloads() {
  const container = document.getElementById('official-manuals-grid');
  if (!container) return;

  const approved = isCatalogApproved();

  container.innerHTML = OFFICIAL_MANUALS.map(m => {
    const badgeStyleAttr = m.badgeStyle ? `style="${m.badgeStyle}"` : '';
    const iconStyleAttr = m.iconCustomStyle ? `style="${m.iconCustomStyle}"` : '';
    const iconClass = m.iconColor || '';

    const btnHtml = approved
      ? `
        <a href="${m.pdfUrl}" target="_blank" rel="noopener" class="skeuo-button secondary-metal-btn full-width manual-btn">
          <i class="fa-solid fa-download"></i> Baixar Manual em PDF
        </a>
      `
      : `
        <button type="button" class="skeuo-button secondary-metal-btn full-width manual-btn btn-unlock-manual" data-title="${m.title}" style="background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.35); font-weight: 700; cursor: pointer;">
          <i class="fa-brands fa-whatsapp"></i> Liberar Acesso ao Material
        </button>
      `;

    return `
      <div class="skeuo-card manual-showcase-card">
        <div class="manual-badge-header">
          <span class="skeuo-badge ${m.badgeClass || ''}" ${badgeStyleAttr}>${m.badge}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-file-pdf text-cyan"></i> PDF</span>
        </div>
        <div class="manual-showcase-icon ${iconClass}" ${iconStyleAttr}><i class="fa-solid ${m.icon}"></i></div>
        <h3 class="manual-showcase-title">${m.title}</h3>
        <p class="manual-showcase-desc">${m.desc}</p>
        ${btnHtml}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-unlock-manual').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const user = getCurrentCatalogUser();
      const cleanPhone = '5512998008818';
      let msg = '';
      if (user) {
        msg = `Olá Christian! Sou ${user.name || user.company} (${user.email}). Solicitei cadastro no catálogo Z8 e gostaria de liberar o download do material oficial: ${title}.`;
      } else {
        msg = `Olá Christian! Gostaria de solicitar a liberação para download do material oficial da Franquia Z8: ${title}.`;
      }
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    });
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
  const approved = isCatalogApproved();
  const currentUser = getCurrentCatalogUser();

  const clientName = currentUser?.name || 'Parceiro Z8';
  const clientCompany = currentUser?.company || 'Não informada';
  const clientCity = currentUser?.city || 'SP';
  const clientPhone = currentUser?.phone || 'Não informado';
  const clientEmail = currentUser?.email || '';

  const whatsappLoteMsg = 
    `📦 *SOLICITAÇÃO DE LOTE DE ATACADO - Z8 E-MOTION*\n\n` +
    `🏍️ *Modelo Escolhido:* ${model.name} (${model.code})\n` +
    `💰 *Preço Unitário Atacado:* R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00\n` +
    `⚡ *Configuração:* ${model.motor} • ${model.speed} • Autonomia ${model.range}\n` +
    `🔋 *Bateria:* ${model.battery}\n\n` +
    `👤 *DADOS DO CLIENTE / COMPRADOR:*\n` +
    `• *Nome:* ${clientName}\n` +
    `• *Empresa / Loja:* ${clientCompany}\n` +
    `• *Cidade / UF:* ${clientCity}\n` +
    `• *WhatsApp:* ${clientPhone}\n` +
    (clientEmail ? `• *E-mail:* ${clientEmail}\n` : '') +
    `\n_Olá! Gostaria de cotar o faturamento e prazo de envio de um lote deste modelo para minha loja._`;

  const whatsappLoteUrl = `https://wa.me/5512998008818?text=${encodeURIComponent(whatsappLoteMsg)}`;

  const priceFooterHtml = approved
    ? `
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-inset); padding: 14px; border-radius: 10px; border: 1px solid var(--border-metal); flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">PREÇO DE ATACADO PARCEIRO</span>
          <strong style="font-size: 1.4rem; color: var(--accent-neon);">R$ ${model.wholesalePrice.toLocaleString('pt-BR')},00</strong>
        </div>
        <a href="${whatsappLoteUrl}" target="_blank" rel="noopener" class="skeuo-button primary-metal-btn" style="background: linear-gradient(135deg, #10B981, #059669); color: #fff; font-weight: 800; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
          <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> Solicitar Lote
        </a>
      </div>
    `
    : `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(251, 191, 36, 0.08); padding: 14px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.35); flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-size: 0.75rem; color: #fcd34d; display: block; font-weight: 700;"><i class="fa-solid fa-lock"></i> TABELA DE ATACADO RESTRITA</span>
          <span style="font-size: 0.85rem; color: #94a3b8;">Preços e margens liberados após aprovação comercial.</span>
        </div>
        <a href="${whatsappLoteUrl}" target="_blank" rel="noopener" class="skeuo-button primary-metal-btn" style="background: linear-gradient(135deg, #10B981, #059669); color: #fff; font-weight: 800; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-brands fa-whatsapp"></i> Solicitar Acesso no WhatsApp
        </a>
      </div>
    `;

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

        ${priceFooterHtml}
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
    const pendingBanner = document.getElementById('pending-approval-banner');
    const pendingName = document.getElementById('pending-user-name');
    const pendingCta = document.getElementById('pending-whatsapp-cta');

    if (user) {
      if (loginGate) loginGate.style.display = 'none';
      if (mainContent) mainContent.style.display = 'block';
      if (badgeText) badgeText.textContent = `Sair (${(user.name || user.email).split(' ')[0]})`;
      if (openAdminBtn) {
        openAdminBtn.style.display = (user.email.toLowerCase() === 'christian.tkh@gmail.com') ? 'inline-flex' : 'none';
      }

      if (approved) {
        if (pendingBanner) pendingBanner.style.display = 'none';
      } else {
        if (pendingBanner) pendingBanner.style.display = 'block';
        if (pendingName) pendingName.textContent = user.name || user.email;
        if (pendingCta) {
          const approvalLink = `${window.location.origin}${window.location.pathname}?approve_user=${encodeURIComponent(user.email)}`;
          const msg = encodeURIComponent(
            `🔐 *SOLICITAÇÃO DE LIBERAÇÃO DE ACESSO AO CATÁLOGO Z8*\n\n` +
            `Olá Christian! Solicitei cadastro no Portal Z8 e gostaria de liberar meu acesso para visualizar as tabelas de atacado:\n\n` +
            `👤 *Nome*: ${user.name || 'Parceiro'}\n` +
            `🏢 *Empresa*: ${user.company || 'Minha Loja'}\n` +
            `📍 *Cidade/UF*: ${user.city || 'SP'}\n` +
            `📧 *E-mail*: ${user.email}\n` +
            `📱 *WhatsApp*: ${user.phone || 'Não informado'}\n\n` +
            `👉 *Clique no link abaixo para liberar meu acesso em 1 clique*:\n${approvalLink}`
          );
          pendingCta.href = `https://wa.me/5512998008818?text=${msg}`;
        }
      }
    } else {
      if (loginGate) loginGate.style.display = 'flex';
      if (mainContent) mainContent.style.display = 'none';
      if (badgeText) badgeText.textContent = 'Área de Login';
      if (openAdminBtn) openAdminBtn.style.display = 'none';
      if (pendingBanner) pendingBanner.style.display = 'none';
    }
  }

  updateHeaderAuth();

  window.addEventListener('z8-catalog-auth-changed', () => {
    updateHeaderAuth();
    renderShowroom();
    renderOrderDesk();
    initCalculator();
    renderDownloads();
    renderOSDashboard();
  });

  window.addEventListener('z8-catalog-users-updated', () => {
    renderAdminUsersList();
    renderShowroom();
    renderOrderDesk();
    initCalculator();
    renderDownloads();
    renderOSDashboard();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#open-catalog-login-btn') || e.target.closest('.open-catalog-login-trigger')) {
      const user = getCurrentCatalogUser();
      if (user) {
        if (confirm(`Você está conectado como ${user.name || user.email}. Deseja sair da conta?`)) {
          logoutCatalogUser();
        }
      } else {
        if (loginGate) loginGate.style.display = 'flex';
      }
    }
  });

  let adminSyncInterval = null;
  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', async () => {
      renderAdminUsersList();
      if (adminModal) adminModal.classList.remove('hidden');
      await fetchUsersFromCloud();
      renderAdminUsersList();

      if (!adminSyncInterval) {
        adminSyncInterval = setInterval(async () => {
          if (adminModal && !adminModal.classList.contains('hidden')) {
            await fetchUsersFromCloud();
            renderAdminUsersList();
          }
        }, 6000);
      }
    });
  }

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal?.classList.add('hidden');
      if (adminSyncInterval) {
        clearInterval(adminSyncInterval);
        adminSyncInterval = null;
      }
    });
  }

  if (tabLoginBtn && tabRegBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.style.background = '#00F2FE';
      tabLoginBtn.style.color = '#0b0e14';
      tabRegBtn.style.background = 'transparent';
      tabRegBtn.style.color = '#94a3b8';
      if (boxLogin) boxLogin.style.display = 'block';
      if (boxReg) boxReg.style.display = 'none';
      if (boxForgot) boxForgot.style.display = 'none';
    });

    tabRegBtn.addEventListener('click', () => {
      tabRegBtn.style.background = '#10B981';
      tabRegBtn.style.color = '#ffffff';
      tabLoginBtn.style.background = 'transparent';
      tabLoginBtn.style.color = '#94a3b8';
      if (boxReg) boxReg.style.display = 'block';
      if (boxLogin) boxLogin.style.display = 'none';
      if (boxForgot) boxForgot.style.display = 'none';
    });
  }

  const boxForgot = document.getElementById('cat-box-forgot');
  const forgotForm = document.getElementById('cat-forgot-form');
  const forgotMsg = document.getElementById('cat-forgot-msg');
  const btnForgotTrigger = document.getElementById('btn-forgot-password-trigger');
  const btnForgotBack = document.getElementById('btn-forgot-back-to-login');

  if (btnForgotTrigger) {
    btnForgotTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (boxLogin) boxLogin.style.display = 'none';
      if (boxReg) boxReg.style.display = 'none';
      if (boxForgot) boxForgot.style.display = 'block';
      if (tabLoginBtn) {
        tabLoginBtn.style.background = 'transparent';
        tabLoginBtn.style.color = '#94a3b8';
      }
      if (tabRegBtn) {
        tabRegBtn.style.background = 'transparent';
        tabRegBtn.style.color = '#94a3b8';
      }
      const forgotEmailInput = document.getElementById('cat-forgot-email');
      const loginUserInput = document.getElementById('cat-login-user');
      if (forgotEmailInput && loginUserInput && loginUserInput.value) {
        forgotEmailInput.value = loginUserInput.value;
      }
    });
  }

  if (btnForgotBack) {
    btnForgotBack.addEventListener('click', (e) => {
      e.preventDefault();
      if (boxForgot) boxForgot.style.display = 'none';
      if (boxLogin) boxLogin.style.display = 'block';
      if (tabLoginBtn) {
        tabLoginBtn.style.background = '#00F2FE';
        tabLoginBtn.style.color = '#0b0e14';
      }
      if (tabRegBtn) {
        tabRegBtn.style.background = 'transparent';
        tabRegBtn.style.color = '#94a3b8';
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('cat-forgot-email')?.value || '';
      const phone = document.getElementById('cat-forgot-phone')?.value || '';
      const newPass = document.getElementById('cat-forgot-pass')?.value || '';

      const res = resetCatalogUserPassword(email, phone, newPass);
      if (res.success) {
        if (forgotMsg) {
          forgotMsg.style.display = 'block';
          forgotMsg.style.background = 'rgba(16,185,129,0.15)';
          forgotMsg.style.border = '1px solid rgba(16,185,129,0.3)';
          forgotMsg.style.color = '#6ee7b7';
          forgotMsg.innerHTML = `🎉 <strong>${res.message}</strong>`;
        }
        setTimeout(() => {
          updateHeaderAuth();
          renderShowroom();
          const loginModal = document.getElementById('catalog-login-modal');
          if (loginModal) loginModal.classList.add('hidden');
        }, 1000);
      } else {
        if (forgotMsg) {
          forgotMsg.style.display = 'block';
          forgotMsg.style.background = 'rgba(239,68,68,0.15)';
          forgotMsg.style.border = '1px solid rgba(239,68,68,0.3)';
          forgotMsg.style.color = '#fca5a5';
          forgotMsg.textContent = res.error;
        }
      }
    });
  }

  // Password visibility eye toggle
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.btn-toggle-pass-view');
    if (toggleBtn) {
      const targetId = toggleBtn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = toggleBtn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        }
      }
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('cat-login-user').value;
      const passVal = document.getElementById('cat-login-pass').value;

      const res = loginCatalogUser(userVal, passVal);
      if (res.success) {
        if (loginMsg) loginMsg.style.display = 'none';
        updateHeaderAuth();
        renderShowroom();
      } else {
        if (loginMsg) {
          loginMsg.style.display = 'block';
          loginMsg.style.background = 'rgba(239,68,68,0.15)';
          loginMsg.style.border = '1px solid rgba(239,68,68,0.3)';
          loginMsg.style.color = '#fca5a5';
          loginMsg.textContent = res.error;
        }
      }
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('cat-reg-name')?.value || '';
      const company = document.getElementById('cat-reg-company')?.value || '';
      const city = document.getElementById('cat-reg-city')?.value || '';
      const state = document.getElementById('cat-reg-state')?.value || 'SP';
      const email = document.getElementById('cat-reg-email')?.value || '';
      const phone = document.getElementById('cat-reg-phone')?.value || '';
      const password = document.getElementById('cat-reg-pass')?.value || '';

      const locationStr = city ? `${city} - ${state}` : (company.includes('-') ? company.split('-').pop().trim() : 'São Paulo - SP');

      const res = await registerCatalogUser({
        name,
        company,
        city: locationStr,
        email,
        phone,
        password
      });
      if (res.success) {
        regForm.reset();
        if (regMsg) {
          regMsg.style.display = 'block';
          regMsg.style.background = 'rgba(16,185,129,0.15)';
          regMsg.style.border = '1px solid rgba(16,185,129,0.3)';
          regMsg.style.color = '#6ee7b7';
          regMsg.innerHTML = `🎉 <strong>Conta criada com sucesso!</strong> Acessando o Portal Z8...`;
        }
        setTimeout(() => {
          updateHeaderAuth();
          renderShowroom();
        }, 800);
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

  /* --------------------------------------------------------------------------
     MASTER ADMIN APPROVAL PANEL CONTROLLER
     -------------------------------------------------------------------------- */
  let currentAdminFilter = 'all';
  let currentAdminSearch = '';

  const statTotal = document.getElementById('adm-stat-total');
  const statPending = document.getElementById('adm-stat-pending');
  const statApproved = document.getElementById('adm-stat-approved');
  const statBlocked = document.getElementById('adm-stat-blocked');

  const pillAll = document.getElementById('adm-pill-all');
  const pillPending = document.getElementById('adm-pill-pending');
  const pillApproved = document.getElementById('adm-pill-approved');
  const pillBlocked = document.getElementById('adm-pill-blocked');

  const searchInput = document.getElementById('adm-user-search');
  const filterPills = document.querySelectorAll('.admin-filter-pill');

  const btnToggleAdd = document.getElementById('btn-toggle-add-partner');
  const btnCancelAdd = document.getElementById('btn-cancel-add-partner');
  const btnSyncCloud = document.getElementById('btn-sync-cloud-users');
  const addPartnerBox = document.getElementById('admin-add-partner-box');
  const manualPartnerForm = document.getElementById('admin-manual-partner-form');

  if (btnSyncCloud) {
    btnSyncCloud.addEventListener('click', async () => {
      const icon = btnSyncCloud.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      btnSyncCloud.disabled = true;
      try {
        await fetchUsersFromCloud();
        renderAdminUsersList();
      } finally {
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
          btnSyncCloud.disabled = false;
        }, 600);
      }
    });
  }

  if (btnToggleAdd && addPartnerBox) {
    btnToggleAdd.addEventListener('click', () => {
      addPartnerBox.style.display = addPartnerBox.style.display === 'none' ? 'block' : 'none';
      if (addPartnerBox.style.display === 'block') {
        document.getElementById('adm-field-name')?.focus();
      }
    });
  }

  if (btnCancelAdd && addPartnerBox) {
    btnCancelAdd.addEventListener('click', () => {
      addPartnerBox.style.display = 'none';
    });
  }

  if (manualPartnerForm) {
    manualPartnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('adm-field-name')?.value || '';
      const company = document.getElementById('adm-field-company')?.value || '';
      const city = document.getElementById('adm-field-city')?.value || '';
      const email = document.getElementById('adm-field-email')?.value || '';
      const phone = document.getElementById('adm-field-phone')?.value || '';
      const status = document.getElementById('adm-field-status')?.value || 'approved';

      createPartnerByAdmin({
        name,
        company,
        city,
        email,
        phone,
        status
      });

      manualPartnerForm.reset();
      addPartnerBox.style.display = 'none';
      renderAdminUsersList();
      alert(`✅ Parceiro ${name} (${company}) cadastrado com status ${status === 'approved' ? 'LIBERADO' : 'PENDENTE'} com sucesso!`);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentAdminSearch = e.target.value.toLowerCase().trim();
      renderAdminUsersList();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.style.background = 'rgba(255,255,255,0.05)';
        p.style.borderColor = 'rgba(255,255,255,0.15)';
        p.style.color = '#94a3b8';
      });
      pill.classList.add('active');
      pill.style.background = 'rgba(0, 242, 254, 0.15)';
      pill.style.borderColor = '#00F2FE';
      pill.style.color = '#00F2FE';
      currentAdminFilter = pill.getAttribute('data-status') || 'all';
      renderAdminUsersList();
    });
  });

  function renderAdminUsersList() {
    if (!adminUsersList) return;
    const users = getRegisteredUsers();

    // Stats calculations
    const totalCount = users.length;
    const pendingCount = users.filter(u => u.status === 'pending' && u.email.toLowerCase() !== 'christian.tkh@gmail.com').length;
    const approvedCount = users.filter(u => (u.status === 'approved' || !u.status) || u.email.toLowerCase() === 'christian.tkh@gmail.com').length;
    const blockedCount = users.filter(u => u.status === 'blocked').length;

    if (statTotal) statTotal.textContent = totalCount;
    if (statPending) statPending.textContent = pendingCount;
    if (statApproved) statApproved.textContent = approvedCount;
    if (statBlocked) statBlocked.textContent = blockedCount;

    if (pillAll) pillAll.textContent = totalCount;
    if (pillPending) pillPending.textContent = pendingCount;
    if (pillApproved) pillApproved.textContent = approvedCount;
    if (pillBlocked) pillBlocked.textContent = blockedCount;

    // Filter by search & status
    const filtered = users.filter(u => {
      const isMaster = u.email.toLowerCase() === 'christian.tkh@gmail.com';
      let matchStatus = true;
      if (currentAdminFilter === 'pending') matchStatus = (u.status === 'pending' && !isMaster);
      else if (currentAdminFilter === 'approved') matchStatus = (u.status === 'approved' || isMaster || !u.status);
      else if (currentAdminFilter === 'blocked') matchStatus = (u.status === 'blocked');

      let matchSearch = true;
      if (currentAdminSearch) {
        const query = currentAdminSearch;
        matchSearch = (
          (u.name || '').toLowerCase().includes(query) ||
          (u.company || '').toLowerCase().includes(query) ||
          (u.city || '').toLowerCase().includes(query) ||
          (u.email || '').toLowerCase().includes(query) ||
          (u.phone || '').toLowerCase().includes(query)
        );
      }

      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      adminUsersList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: #64748b; font-style: italic;">
            <i class="fa-solid fa-users-slash" style="font-size: 1.5rem; display: block; margin-bottom: 6px; color: #475569;"></i>
            Nenhuma conta encontrada com os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    adminUsersList.innerHTML = filtered.map(u => {
      const isMaster = u.email.toLowerCase() === 'christian.tkh@gmail.com';
      const statusBadge = isMaster
        ? '<span style="color: #00F2FE; font-weight: 700;"><i class="fa-solid fa-crown"></i> Admin Master</span>'
        : u.status === 'approved'
          ? '<span style="color: #10B981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Liberado</span>'
          : u.status === 'blocked'
            ? '<span style="color: #EF4444; font-weight: 700;"><i class="fa-solid fa-ban"></i> Bloqueado</span>'
            : '<span style="color: #F59E0B; font-weight: 700; background: rgba(245,158,11,0.15); padding: 2px 6px; border-radius: 4px;"><i class="fa-solid fa-clock"></i> Aguardando Liberação</span>';

      const cleanPhone = (u.phone || '').replace(/\D/g, '');
      const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá ${u.name}! Sou Christian da Z8 E-Motion. Vi seu cadastro no portal como representante da loja ${u.company}...`)}` : '#';

      let actionButtons = '';
      if (isMaster) {
        actionButtons = '<span style="font-size: 0.75rem; color: #64748b;">Proprietário Master</span>';
      } else if (u.status === 'approved') {
        actionButtons = `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn-revoke-user" data-id="${u.id}" title="Bloquear visualização de atacado" style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #fcd34d; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              <i class="fa-solid fa-lock"></i> Bloquear
            </button>
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" rel="noopener" title="Chamar no WhatsApp" style="background: rgba(16,185,129,0.15); border: 1px solid #10B981; color: #34d399; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            ` : ''}
            <button type="button" class="btn-del-user" data-id="${u.id}" title="Excluir cadastro" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
      } else if (u.status === 'blocked') {
        actionButtons = `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn-approve-user" data-id="${u.id}" title="Desbloquear acesso" style="background: linear-gradient(135deg, #10B981, #059669); border: none; color: #fff; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(16,185,129,0.3);">
              <i class="fa-solid fa-lock-open"></i> Desbloquear
            </button>
            <button type="button" class="btn-del-user" data-id="${u.id}" title="Excluir cadastro" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
      } else {
        // Pending
        actionButtons = `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn-approve-user" data-id="${u.id}" style="background: linear-gradient(135deg, #10B981, #059669); border: none; color: #fff; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(16,185,129,0.4);">
              <i class="fa-solid fa-check"></i> Liberar Acesso
            </button>
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" rel="noopener" title="Chamar no WhatsApp" style="background: rgba(16,185,129,0.15); border: 1px solid #10B981; color: #34d399; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            ` : ''}
            <button type="button" class="btn-del-user" data-id="${u.id}" title="Excluir cadastro" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
      }

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 12px 10px;">
            <strong style="color: #f8fafc;">${u.name}</strong><br>
            <span style="font-size: 0.75rem; color: #94a3b8;"><i class="fa-solid fa-building"></i> ${u.company} (${u.city || 'SP'})</span>
          </td>
          <td style="padding: 12px 10px;"><a href="mailto:${u.email}" style="color: #38bdf8; text-decoration: none;">${u.email}</a></td>
          <td style="padding: 12px 10px;">
            ${cleanPhone ? `
              <a href="https://wa.me/55${cleanPhone}" target="_blank" rel="noopener" style="color: #10B981; text-decoration: none; font-weight: 600;">
                <i class="fa-brands fa-whatsapp"></i> ${u.phone}
              </a>
            ` : '<span style="color: #64748b;">N/A</span>'}
          </td>
          <td style="padding: 12px 10px;">${statusBadge}</td>
          <td style="padding: 12px 10px;">${actionButtons}</td>
        </tr>
      `;
    }).join('');
  }

  if (adminUsersList) {
    adminUsersList.addEventListener('click', (e) => {
      const approveBtn = e.target.closest('.btn-approve-user');
      if (approveBtn) {
        const id = approveBtn.getAttribute('data-id');
        updateUserStatus(id, 'approved');
        renderAdminUsersList();
        renderShowroom();
        renderOrderDesk();
        initCalculator();
        renderDownloads();
        renderOSDashboard();
        return;
      }

      const revokeBtn = e.target.closest('.btn-revoke-user');
      if (revokeBtn) {
        const id = revokeBtn.getAttribute('data-id');
        updateUserStatus(id, 'blocked');
        renderAdminUsersList();
        renderShowroom();
        renderOrderDesk();
        initCalculator();
        renderDownloads();
        renderOSDashboard();
        return;
      }

      const delBtn = e.target.closest('.btn-del-user');
      if (delBtn) {
        const id = delBtn.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir o cadastro deste cliente?')) {
          deleteCatalogUser(id);
          renderAdminUsersList();
          renderShowroom();
          renderOrderDesk();
          initCalculator();
          renderDownloads();
          renderOSDashboard();
        }
        return;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. WARRANTY & OS DATABASE ENGINE & REAL-TIME DASHBOARD (ACCOUNT ISOLATION)
   -------------------------------------------------------------------------- */
let currentOSFilter = 'all';
let currentOSSearch = '';
let currentAdminUnitFilter = 'all';

function initWarrantyPortal() {
  const form = document.getElementById('warranty-os-form');
  const osListContainer = document.getElementById('warranty-os-list');
  const badgeCount = document.getElementById('os-count-badge');
  const autoCodeBadge = document.getElementById('auto-os-code');
  const msgBox = document.getElementById('warranty-form-msg');
  const techNameInput = document.getElementById('os-tech-name');
  const techPhoneInput = document.getElementById('os-tech-phone');
  const searchInput = document.getElementById('os-search-input');
  const filterPills = document.querySelectorAll('.os-filter-pill');
  const sessionBar = document.getElementById('os-account-session-bar');

  // Pre-fill user data if logged in
  function prefillUser() {
    const currentUser = getCurrentCatalogUser();
    if (currentUser) {
      if (techNameInput && !techNameInput.value) techNameInput.value = currentUser.name || currentUser.company || '';
      if (techPhoneInput && !techPhoneInput.value) techPhoneInput.value = currentUser.phone || '';
    }
  }
  prefillUser();
  window.addEventListener('z8-catalog-auth-changed', () => {
    prefillUser();
    renderOSDashboard();
  });

  function renderOSSessionBar() {
    if (!sessionBar) return;
    const user = getCurrentCatalogUser();
    const isMaster = user && (user.role === 'admin' || user.email?.toLowerCase() === 'christian.tkh@gmail.com');
    const allOrders = getStoredWarrantyOrders();

    if (!user) {
      sessionBar.className = 'os-account-bar anonymous';
      sessionBar.innerHTML = `
        <div class="os-account-info-left">
          <div class="os-account-avatar" style="border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.12);">
            <i class="fa-solid fa-user-lock"></i>
          </div>
          <div>
            <div style="font-size: 0.88rem; color: #f59e0b; font-weight: 700;">Sessão Não Identificada</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">Faça login na sua conta de Franqueado para visualizar e gerenciar as Ordens de Serviço da sua unidade.</div>
          </div>
        </div>
        <div>
          <button type="button" class="skeuo-button primary-metal-btn trigger-catalog-login-action" style="padding: 8px 16px; font-size: 0.78rem;">
            <i class="fa-solid fa-right-to-bracket"></i> Identificar Minha Conta
          </button>
        </div>
      `;
    } else if (isMaster) {
      // Extrai unidades únicas para o filtro do Administrador Master
      const unitsMap = {};
      allOrders.forEach(o => {
        const key = o.company || o.userEmail;
        if (key) unitsMap[key] = (unitsMap[key] || 0) + 1;
      });

      const unitOptions = Object.keys(unitsMap).map(u => {
        const sel = currentAdminUnitFilter === u ? 'selected' : '';
        return `<option value="${u}" ${sel}>🏢 ${u} (${unitsMap[u]} OS)</option>`;
      }).join('');

      sessionBar.className = 'os-account-bar master-admin';
      sessionBar.innerHTML = `
        <div class="os-account-info-left">
          <div class="os-account-avatar gold">
            <i class="fa-solid fa-crown"></i>
          </div>
          <div>
            <div style="font-size: 0.88rem; color: #fbbf24; font-weight: 700;">
              Sessão Master • Central Nacional de Garantia & Engenharia Z8
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              Acesso irrestrito a todas as concessionárias do Brasil • Matriz Z8 (${user.email})
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 0.78rem; color: #cbd5e1; white-space: nowrap;"><i class="fa-solid fa-filter text-gold"></i> Unidade:</label>
          <select id="os-admin-unit-filter-select" class="os-input" style="padding: 6px 12px; font-size: 0.78rem; width: auto; background: #0b0e14; border-color: rgba(251,191,36,0.4); color: #fff;">
            <option value="all" ${currentAdminUnitFilter === 'all' ? 'selected' : ''}>🏢 Todas as Concessionárias (${allOrders.length} Total)</option>
            ${unitOptions}
          </select>
        </div>
      `;

      const unitSelect = document.getElementById('os-admin-unit-filter-select');
      if (unitSelect) {
        unitSelect.addEventListener('change', (e) => {
          currentAdminUnitFilter = e.target.value;
          renderOSDashboard();
        });
      }
    } else {
      sessionBar.className = 'os-account-bar logged-in';
      sessionBar.innerHTML = `
        <div class="os-account-info-left">
          <div class="os-account-avatar">
            <i class="fa-solid fa-user-check"></i>
          </div>
          <div>
            <div style="font-size: 0.88rem; color: var(--accent-cyan); font-weight: 700;">
              Sessão Ativa: ${user.name || user.company} (${user.company || 'Concessionária Autorizada'})
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              ${user.email} • Exibindo exclusivamente os chamados e garantias da sua unidade
            </div>
          </div>
        </div>
        <div>
          <span class="skeuo-badge" style="font-size: 0.76rem; border-color: #10B981; color: #10B981; background: rgba(16,185,129,0.1);">
            <i class="fa-solid fa-lock"></i> Seus Pedidos Isolados
          </span>
        </div>
      `;
    }

    // Bind login buttons inside session bar
    sessionBar.querySelectorAll('.trigger-catalog-login-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const loginModal = document.getElementById('catalog-auth-modal');
        if (loginModal) loginModal.classList.remove('hidden');
      });
    });
  }

  function updateCounters(orders) {
    const total = orders.length;
    const analyzing = orders.filter(o => o.status === 'analyzing').length;
    const approved = orders.filter(o => o.status === 'approved').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    const elTotal = document.getElementById('stat-total-os');
    const elAnalyzing = document.getElementById('stat-analyzing-os');
    const elApproved = document.getElementById('stat-approved-os');
    const elCompleted = document.getElementById('stat-completed-os');

    if (elTotal) elTotal.textContent = total;
    if (elAnalyzing) elAnalyzing.textContent = analyzing;
    if (elApproved) elApproved.textContent = approved;
    if (elCompleted) elCompleted.textContent = completed;

    const allStored = getStoredWarrantyOrders();
    const nextIdNum = (allStored.length + 104).toString().padStart(4, '0');
    if (autoCodeBadge) autoCodeBadge.textContent = `OS-2026-${nextIdNum}`;
  }

  function renderOSDashboard() {
    renderOSSessionBar();

    const user = getCurrentCatalogUser();
    const isMaster = user && (user.role === 'admin' || user.email?.toLowerCase() === 'christian.tkh@gmail.com');

    // Recupera somente as OS permitidas para este usuário
    const userOrders = getWarrantyOrdersForUser(user, currentAdminUnitFilter);
    updateCounters(userOrders);

    let filtered = userOrders;

    if (currentOSFilter !== 'all') {
      filtered = filtered.filter(o => o.status === currentOSFilter);
    }

    if (currentOSSearch) {
      const q = currentOSSearch.toLowerCase().trim();
      filtered = filtered.filter(o => 
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.chassi && o.chassi.toLowerCase().includes(q)) ||
        (o.model && o.model.toLowerCase().includes(q)) ||
        (o.techName && o.techName.toLowerCase().includes(q)) ||
        (o.company && o.company.toLowerCase().includes(q)) ||
        (o.component && o.component.toLowerCase().includes(q))
      );
    }

    if (badgeCount) {
      if (!user) {
        badgeCount.textContent = `0 chamados (faça login)`;
      } else if (isMaster) {
        badgeCount.textContent = `${filtered.length} chamado(s) na Matriz`;
      } else {
        badgeCount.textContent = `${filtered.length} chamado(s) da sua conta`;
      }
    }

    if (!osListContainer) return;

    if (!user) {
      osListContainer.innerHTML = `
        <div style="text-align: center; padding: 32px 18px; background: rgba(0,0,0,0.25); border: 1px dashed rgba(0,240,255,0.2); border-radius: 10px;">
          <i class="fa-solid fa-shield-halved" style="font-size: 2.2rem; color: var(--accent-cyan); margin-bottom: 10px; display: block;"></i>
          <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.98rem; color: #fff; margin-bottom: 6px;">
            Sessão Exclusiva de Garantia
          </h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); max-width: 360px; margin: 0 auto 16px auto; line-height: 1.45;">
            Cada conta tem acesso exclusivo aos seus próprios chamados, prazos de 48h e rastreio de peças.
          </p>
          <button type="button" class="skeuo-button primary-metal-btn trigger-login-direct" style="padding: 10px 18px; font-size: 0.8rem;">
            <i class="fa-solid fa-lock-open"></i> Entrar na Minha Conta de Franqueado
          </button>
        </div>
      `;
      osListContainer.querySelectorAll('.trigger-login-direct').forEach(b => {
        b.onclick = () => document.getElementById('catalog-auth-modal')?.classList.remove('hidden');
      });
      return;
    }

    if (filtered.length === 0) {
      osListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 28px; background: rgba(0,0,0,0.2); border-radius: 8px;">
          <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; margin-bottom: 8px; color: var(--text-muted); display: block;"></i>
          Nenhuma Ordem de Serviço encontrada para esta sessão.
        </div>
      `;
      return;
    }

    osListContainer.innerHTML = filtered.map(os => {
      let statusClass = 'analyzing';
      let statusIcon = '<i class="fa-solid fa-hourglass-half"></i>';

      if (os.status === 'approved') {
        statusClass = 'approved';
        statusIcon = '<i class="fa-solid fa-truck-ramp-box"></i>';
      } else if (os.status === 'completed') {
        statusClass = 'completed';
        statusIcon = '<i class="fa-solid fa-circle-check"></i>';
      } else if (os.status === 'rejected') {
        statusClass = 'rejected';
        statusIcon = '<i class="fa-solid fa-triangle-exclamation"></i>';
      }

      const dateStr = os.createdAt ? new Date(os.createdAt).toLocaleDateString('pt-BR') : 'Hoje';

      const cleanPhone = '5512998008818';
      const waText = encodeURIComponent(
        `🛠️ *CONSULTA DE ORDEM DE SERVIÇO (GARANTIA Z8)*\n\n` +
        `📋 *OS*: ${os.id}\n` +
        `🏢 *Unidade*: ${os.company || 'Concessionária'}\n` +
        `🏍️ *Modelo*: ${os.model}\n` +
        `🔢 *Chassi*: ${os.chassi}\n` +
        `⚡ *Componente*: ${os.component}\n` +
        `👨‍🔧 *Técnico*: ${os.techName} (${os.techPhone})\n` +
        `📊 *Status Atual*: ${os.statusText}\n` +
        (os.trackingCode ? `🚚 *Rastreio*: ${os.trackingCode}\n` : '') +
        `\nOlá suporte técnico Z8, gostaria de obter atualização sobre esta OS.`
      );
      const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

      return `
        <div class="os-ticket-item">
          <div class="os-ticket-header">
            <span class="os-ticket-title">${os.id}</span>
            <span class="os-ticket-status ${statusClass}">${statusIcon} ${os.statusText}</span>
          </div>

          <div style="font-size: 0.85rem; color: #f8fafc; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-motorcycle text-cyan"></i> ${os.model}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${dateStr}</span>
          </div>

          <div style="font-size: 0.76rem; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
            <span>Chassi: <code style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px; color: var(--accent-cyan);">${os.chassi}</code></span>
            <span>Avaria: <strong style="color: #cbd5e1;">${os.component}</strong></span>
          </div>

          ${isMaster ? `
            <div style="font-size: 0.73rem; color: #fbbf24; background: rgba(251,191,36,0.06); padding: 3px 6px; border-radius: 4px; display: inline-block;">
              <i class="fa-solid fa-building"></i> ${os.company || 'Unidade'} (${os.userEmail || 'E-mail não informado'})
            </div>
          ` : ''}

          <div style="font-size: 0.74rem; color: #64748b; line-height: 1.35; margin-top: 2px;">
            <i class="fa-solid fa-stethoscope"></i> ${os.diagnosis.substring(0, 85)}${os.diagnosis.length > 85 ? '...' : ''}
          </div>

          ${os.trackingCode ? `<div style="font-size: 0.73rem; color: #10B981; font-weight: 600;"><i class="fa-solid fa-truck"></i> Rastreio Peça: <code>${os.trackingCode}</code></div>` : ''}

          <div class="os-actions-row">
            <button class="os-action-btn btn-view-os-detail" data-id="${os.id}">
              <i class="fa-solid fa-eye text-cyan"></i> Ficha Técnica
            </button>
            <a href="${waLink}" target="_blank" rel="noopener" class="os-action-btn" style="color: #10B981;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            ${isMaster ? `
              <button class="os-action-btn btn-admin-status-os" data-id="${os.id}" style="color: #fbbf24; border-color: rgba(251,191,36,0.3);">
                <i class="fa-solid fa-pen-to-square"></i> Gerenciar Status
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Wire up detail buttons
    osListContainer.querySelectorAll('.btn-view-os-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openOSDetailModal(id);
      });
    });

    // Wire up admin status buttons
    osListContainer.querySelectorAll('.btn-admin-status-os').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openOSDetailModal(id, true);
      });
    });
  }

  // Filter Pills listener
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentOSFilter = pill.getAttribute('data-status') || 'all';
      renderOSDashboard();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentOSSearch = e.target.value;
      renderOSDashboard();
    });
  }

  // Live real-time event listener
  window.addEventListener('z8-warranty-os-updated', () => {
    renderOSDashboard();
  });

  renderOSDashboard();

  // Form submission logic
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = getCurrentCatalogUser();
      const approved = isCatalogApproved();

      if (!user) {
        alert('Por favor, faça login ou cadastre sua unidade para registrar uma Ordem de Serviço vinculada à sua conta.');
        document.getElementById('catalog-auth-modal')?.classList.remove('hidden');
        return;
      }

      if (!approved) {
        alert('Seu cadastro está aguardando aprovação do Administrador Master (christian.tkh@gmail.com). A abertura de O.S e requisição de garantia é liberada mediante autorização comercial.');
        const cleanPhone = '5512998008818';
        const msg = `Olá Christian! Sou ${user.name || user.company} (${user.email}). Gostaria de solicitar a aprovação do meu cadastro para abrir uma Ordem de Serviço (Garantia) no Portal Z8.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        return;
      }

      const techName = techNameInput?.value || user.name || 'Técnico Homologado';
      const techPhone = techPhoneInput?.value || user.phone || '';
      const model = document.getElementById('os-model-select')?.value || '';
      const chassi = document.getElementById('os-chassi')?.value || '';
      const odometer = document.getElementById('os-odometer')?.value || '';
      const component = document.getElementById('os-component')?.value || '';
      const diagnosis = document.getElementById('os-diagnosis')?.value || '';
      const evidenceLink = document.getElementById('os-evidence-link')?.value || 'WhatsApp';

      const newOrder = saveWarrantyOrder({
        techName,
        company: user?.company || 'Concessionária Autorizada',
        city: user?.city || 'Brasil',
        techPhone,
        model,
        chassi,
        odometer,
        component,
        diagnosis,
        evidenceLink
      }, user);

      // Build structured WhatsApp notification
      const cleanPhone = '5512998008818';
      const waMsg = encodeURIComponent(
        `🚨 *NOVA ORDEM DE SERVIÇO (GARANTIA DE FÁBRICA) - Z8 E-MOTION*\n\n` +
        `📋 *Número da OS*: ${newOrder.id}\n` +
        `📅 *Data de Abertura*: ${new Date(newOrder.createdAt).toLocaleDateString('pt-BR')}\n\n` +
        `🏢 *Unidade*: ${user.company || 'Concessionária Autorizada'} (${user.email})\n` +
        `👤 *Técnico/Franqueado*: ${techName}\n` +
        `📱 *WhatsApp do Responsável*: ${techPhone}\n\n` +
        `🏍️ *Modelo do Veículo*: ${model}\n` +
        `🔢 *Número do Chassi (VIN)*: ${chassi.toUpperCase()}\n` +
        `⏱️ *Quilometragem (Hodômetro)*: ${odometer} km\n` +
        `⚡ *Componente Avariado*: ${component}\n\n` +
        `🔍 *Diagnóstico & Medições Elétricas*:\n${diagnosis}\n\n` +
        `📎 *Vídeo de Teste / Evidência*:\n${evidenceLink}\n\n` +
        `⏱️ *SLA de Análise*: 48 horas úteis para aprovação e despacho da peça genuína.`
      );

      const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.style.background = 'rgba(16,185,129,0.15)';
        msgBox.style.border = '1px solid rgba(16,185,129,0.3)';
        msgBox.style.color = '#6ee7b7';
        msgBox.innerHTML = `
          ✅ <strong>Ordem de Serviço ${newOrder.id} gravada na sua conta (${user.company}) com sucesso!</strong><br>
          A equipe de suporte técnico da Z8 Matriz foi acionada. <br>
          <a href="${waUrl}" target="_blank" rel="noopener" style="color: #38bdf8; font-weight: 700; text-decoration: underline; display: inline-block; margin-top: 6px;">
            <i class="fa-brands fa-whatsapp"></i> Clique aqui para notificar no WhatsApp Oficial
          </a>
        `;
      }

      form.reset();
      prefillUser();
      renderOSDashboard();

      // Open WhatsApp automatically
      window.open(waUrl, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   9. OS DETAIL & STATUS MANAGEMENT MODAL
   -------------------------------------------------------------------------- */
function openOSDetailModal(osId, focusAdmin = false) {
  const modal = document.getElementById('modal-os-detail');
  const body = document.getElementById('modal-os-detail-body');
  const closeBtn = document.getElementById('close-os-modal-btn');

  if (!modal || !body) return;

  const os = getWarrantyOrderById(osId);
  if (!os) {
    alert('Ordem de Serviço não encontrada.');
    return;
  }

  const user = getCurrentCatalogUser();
  const isMaster = user && (user.role === 'admin' || user.email?.toLowerCase() === 'christian.tkh@gmail.com');

  const createdStr = os.createdAt ? new Date(os.createdAt).toLocaleString('pt-BR') : 'N/A';
  const slaStr = os.slaDeadline ? new Date(os.slaDeadline).toLocaleString('pt-BR') : '48 horas';

  let statusBadgeHtml = `<span class="os-ticket-status analyzing"><i class="fa-solid fa-hourglass-half"></i> ${os.statusText}</span>`;
  if (os.status === 'approved') {
    statusBadgeHtml = `<span class="os-ticket-status approved"><i class="fa-solid fa-truck-ramp-box"></i> ${os.statusText}</span>`;
  } else if (os.status === 'completed') {
    statusBadgeHtml = `<span class="os-ticket-status completed"><i class="fa-solid fa-circle-check"></i> ${os.statusText}</span>`;
  } else if (os.status === 'rejected') {
    statusBadgeHtml = `<span class="os-ticket-status rejected"><i class="fa-solid fa-triangle-exclamation"></i> ${os.statusText}</span>`;
  }

  body.innerHTML = `
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span class="skeuo-badge" style="font-size: 0.85rem; padding: 4px 12px;">${os.id}</span>
        ${statusBadgeHtml}
      </div>
      <h2 style="font-family: 'Orbitron', sans-serif; color: #00F2FE; font-size: 1.3rem; margin-top: 10px;">
        ${os.model}
      </h2>
      <p style="font-size: 0.82rem; color: #94a3b8;">
        Abertura: <strong>${createdStr}</strong> • Prazo SLA: <strong>${slaStr}</strong>
      </p>
    </div>

    <!-- GRID DE INFORMAÇÕES TÉCNICAS -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 0.84rem;">
      <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; font-size: 0.75rem; margin-bottom: 2px;">CHASSI (VIN):</strong>
        <span style="color: #f8fafc; font-family: monospace; font-size: 0.95rem; font-weight: 700;">${os.chassi}</span>
      </div>

      <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; font-size: 0.75rem; margin-bottom: 2px;">HODÔMETRO:</strong>
        <span style="color: #f8fafc; font-weight: 700;">${os.odometer} km rodados</span>
      </div>

      <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; font-size: 0.75rem; margin-bottom: 2px;">COMPONENTE AVARIADO:</strong>
        <span style="color: var(--accent-gold); font-weight: 700;">${os.component}</span>
      </div>

      <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; font-size: 0.75rem; margin-bottom: 2px;">TÉCNICO / FRANQUEADO:</strong>
        <span style="color: #f8fafc; font-weight: 600;">${os.techName} (${os.techPhone})</span>
      </div>
    </div>

    <!-- LAUDO & DIAGNÓSTICO -->
    <div style="background: var(--bg-inset); padding: 14px; border-radius: 8px; border: 1px solid var(--border-metal); margin-bottom: 16px;">
      <strong style="color: var(--accent-cyan); display: flex; align-items: center; gap: 6px; font-size: 0.85rem; margin-bottom: 6px;">
        <i class="fa-solid fa-stethoscope"></i> Diagnóstico Técnico & Medições Elétricas:
      </strong>
      <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; white-space: pre-wrap;">${os.diagnosis}</p>
    </div>

    <!-- EVIDÊNCIA EM VÍDEO & RASTREAMENTO -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 0.82rem;">
      <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; margin-bottom: 4px;"><i class="fa-solid fa-video"></i> Evidência de Teste:</strong>
        ${os.evidenceLink && os.evidenceLink.startsWith('http') 
          ? `<a href="${os.evidenceLink}" target="_blank" rel="noopener" style="color: #00F2FE; text-decoration: underline; word-break: break-all;">Abrir Link do Vídeo <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
          : `<span style="color: #cbd5e1;">${os.evidenceLink || 'Anexo via WhatsApp'}</span>`}
      </div>

      <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <strong style="color: #94a3b8; display: block; margin-bottom: 4px;"><i class="fa-solid fa-truck-fast"></i> Código de Rastreamento:</strong>
        <span style="color: #10B981; font-weight: 700;">${os.trackingCode || 'Aguardando despacho de peça'}</span>
      </div>
    </div>

    ${os.adminNotes ? `
      <div style="background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); padding: 12px; border-radius: 8px; font-size: 0.82rem; margin-bottom: 20px;">
        <strong style="color: #fbbf24; display: block; margin-bottom: 4px;"><i class="fa-solid fa-clipboard-user"></i> Parecer do Suporte Técnico Z8 Matriz:</strong>
        <span style="color: #fef08a;">${os.adminNotes}</span>
      </div>
    ` : ''}

    <!-- PAINEL DE GESTÃO DO ADMINISTRADOR MASTER / SUPORTE -->
    ${isMaster ? `
      <div style="background: rgba(0,240,255,0.05); border: 1px solid rgba(0,240,255,0.25); padding: 16px; border-radius: 10px; margin-top: 14px;">
        <h4 style="font-family: 'Orbitron', sans-serif; font-size: 0.88rem; color: #fbbf24; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-user-shield"></i> Gestão de Status da O.S (Administrador)
        </h4>

        <div style="margin-bottom: 10px;">
          <label style="display: block; font-size: 0.78rem; color: #cbd5e1; margin-bottom: 4px;">Código de Rastreio (Transportadora / Correios):</label>
          <input type="text" id="modal-edit-tracking" class="os-input" value="${os.trackingCode || ''}" placeholder="Ex: BR894201948SP ou Jadlog 00921" style="padding: 8px 10px; font-size: 0.82rem;" />
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.78rem; color: #cbd5e1; margin-bottom: 4px;">Parecer / Laudo Técnico da Fábrica:</label>
          <input type="text" id="modal-edit-notes" class="os-input" value="${os.adminNotes || ''}" placeholder="Ex: Peça testada e despachada via Sedex prioritário." style="padding: 8px 10px; font-size: 0.82rem;" />
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="skeuo-button primary-metal-btn btn-set-status" data-status="approved" style="flex: 1; padding: 8px; font-size: 0.78rem; background: linear-gradient(135deg, #10B981, #059669);">
            <i class="fa-solid fa-check"></i> Aprovar & Despachar
          </button>
          <button type="button" class="skeuo-button secondary-metal-btn btn-set-status" data-status="completed" style="flex: 1; padding: 8px; font-size: 0.78rem;">
            <i class="fa-solid fa-circle-check"></i> Concluir OS
          </button>
          <button type="button" class="skeuo-button secondary-metal-btn btn-set-status" data-status="rejected" style="flex: 1; padding: 8px; font-size: 0.78rem; color: #f87171;">
            <i class="fa-solid fa-xmark"></i> Recusar
          </button>
        </div>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
      <button type="button" id="btn-close-os-modal-bottom" class="skeuo-button secondary-metal-btn" style="padding: 10px 24px; font-size: 0.85rem;">
        Fechar
      </button>
    </div>
  `;

  modal.classList.remove('hidden');

  // Close handlers
  if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  const bottomClose = document.getElementById('btn-close-os-modal-bottom');
  if (bottomClose) bottomClose.onclick = () => modal.classList.add('hidden');

  // Admin status updater buttons
  if (isMaster) {
    body.querySelectorAll('.btn-set-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const newSt = btn.getAttribute('data-status');
        const tracking = document.getElementById('modal-edit-tracking')?.value || '';
        const notes = document.getElementById('modal-edit-notes')?.value || '';

        updateWarrantyOrderStatus(osId, newSt, tracking, notes);
        openOSDetailModal(osId);
      });
    });
  }
}


