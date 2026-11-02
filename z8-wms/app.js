/**
 * Z8 E-MOTION // WMS COCKPIT ORCHESTRATION ENGINE
 * High-performance, reactive, bilingual, offline-first.
 */

import { wmsDb } from './db.js';
import { i18n } from './i18n.js';
import { WmsAlgorithms } from './algorithms.js';
import { ThermalLabelEngine } from './labels.js';

class Z8WmsApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.activeVehicleForModal = null;
    this.activeVehicleForLabel = null;
    this.currentLabelSize = '100x50';
    this.cachedVehicles = [];
    this.cachedModels = [];
    this.cachedParts = [];
    this.cachedRepairs = [];
    this.cachedMovements = [];
  }

  async init() {
    console.log('[Z8-WMS] Initializing Warehouse Management Cockpit...');
    i18n.init();
    await wmsDb.init();

    this.bindEvents();
    await this.refreshAllData();
    this.setupNetworkInfo();

    window.addEventListener('z8-lang-changed', () => {
      this.renderCurrentView();
    });
  }

  // ================= EVENT BINDINGS =================
  bindEvents() {
    // 1. Tab Navigation
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // 2. Language Toggle
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        i18n.toggleLanguage();
      });
    }

    // 3. Export Backup JSON
    const exportBtn = document.getElementById('btn-export-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const fullBackup = await wmsDb.exportFullDatabaseJson();
        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Z8_WMS_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // 4. Modal Close Handlers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // Close on overlay backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeAllModals();
      });
    });

    // 5. Container Batch Modal Triggers
    const triggerContainer1 = document.getElementById('btn-quick-container');
    const triggerContainer2 = document.getElementById('btn-open-container-modal-2');
    if (triggerContainer1) triggerContainer1.addEventListener('click', () => this.openContainerModal());
    if (triggerContainer2) triggerContainer2.addEventListener('click', () => this.openContainerModal());

    // 6. Submit Container Batch
    const btnSubmitContainer = document.getElementById('btn-submit-container-batch');
    if (btnSubmitContainer) {
      btnSubmitContainer.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleProcessContainerBatch();
      });
    }

    // Container model select change -> updates tire spec and prefix
    const cbModelSelect = document.getElementById('cb-model-select');
    if (cbModelSelect) {
      cbModelSelect.addEventListener('change', () => {
        const modelId = cbModelSelect.value;
        const model = this.cachedModels.find(m => m.id === modelId);
        if (model) {
          document.getElementById('cb-tire-spec').value = `${model.tireFront} / ${model.tireRear} (${model.tireType || 'Vácuo'})`;
          document.getElementById('cb-prefix').value = `Z8-${model.code}-2026-`;
        }
      });
    }

    // 7. Search & Filters for Vehicles
    const searchInput = document.getElementById('search-chassis-input');
    if (searchInput) searchInput.addEventListener('input', () => this.renderVehiclesTable());

    const filterModel = document.getElementById('filter-model-select');
    if (filterModel) filterModel.addEventListener('change', () => this.renderVehiclesTable());

    const filterStatus = document.getElementById('filter-status-select');
    if (filterStatus) filterStatus.addEventListener('change', () => this.renderVehiclesTable());

    const filterColor = document.getElementById('filter-color-select');
    if (filterColor) filterColor.addEventListener('change', () => this.renderVehiclesTable());

    // 8. Open OS Modal Trigger
    const triggerOs = document.getElementById('btn-create-os-trigger');
    if (triggerOs) triggerOs.addEventListener('click', () => this.openCreateOsModal());

    const btnSubmitOs = document.getElementById('btn-submit-create-os');
    if (btnSubmitOs) {
      btnSubmitOs.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmitServiceOrder();
      });
    }

    // 9. Form New Model Submit
    const formNewModel = document.getElementById('form-new-model');
    if (formNewModel) {
      formNewModel.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveNewModel();
      });
    }

    // 10. Thermal Label Size Toggle & Print Trigger
    const sizeSelect = document.getElementById('thermal-size-select');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', () => {
        this.currentLabelSize = sizeSelect.value;
        if (this.activeVehicleForLabel) {
          this.renderThermalLabelModal(this.activeVehicleForLabel, this.currentLabelSize);
        }
      });
    }

    const printTrigger = document.getElementById('btn-trigger-print');
    if (printTrigger) {
      printTrigger.addEventListener('click', () => {
        ThermalLabelEngine.print();
      });
    }

    // 11. Mobile Connect Modal Trigger
    const btnMobileConnect = document.getElementById('btn-mobile-connect');
    if (btnMobileConnect) {
      btnMobileConnect.addEventListener('click', () => {
        this.openMobileConnectModal();
      });
    }

    // 12. Refresh Dashboard Button
    const refreshDash = document.getElementById('btn-refresh-dashboard');
    if (refreshDash) {
      refreshDash.addEventListener('click', async () => {
        await this.refreshAllData();
      });
    }
  }

  // ================= TAB SWITCHING =================
  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabName}`);
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    switch (this.currentTab) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'vehicles':
        this.renderVehiclesTable();
        break;
      case 'movements':
        this.renderMovementsTable();
        break;
      case 'workshop':
        this.renderWorkshopTable();
        break;
      case 'parts':
        this.renderPartsTable();
        break;
      default:
        break;
    }
  }

  // ================= DATA REFRESH =================
  async refreshAllData() {
    this.cachedVehicles = await wmsDb.getAllVehicles();
    this.cachedModels = await wmsDb.getAllModels();
    this.cachedParts = await wmsDb.getAllParts();
    this.cachedRepairs = await wmsDb.getAllRepairs();
    this.cachedMovements = await wmsDb.getAllMovements();

    this.populateSelectFilters();
    this.renderDashboard();
    this.renderVehiclesTable();
    this.renderMovementsTable();
    this.renderWorkshopTable();
    this.renderPartsTable();
  }

  populateSelectFilters() {
    const filterModel = document.getElementById('filter-model-select');
    const cbModelSelect = document.getElementById('cb-model-select');

    if (filterModel) {
      filterModel.innerHTML = `<option value="">${i18n.t('filterAllModels')}</option>` +
        this.cachedModels.map(m => {
          const name = i18n.currentLang === 'zh-CN' && m.nameCn ? m.nameCn : m.name;
          return `<option value="${m.id}">${name} (${m.code})</option>`;
        }).join('');
    }

    if (cbModelSelect) {
      cbModelSelect.innerHTML = this.cachedModels.map(m => {
        const name = i18n.currentLang === 'zh-CN' && m.nameCn ? m.nameCn : m.name;
        return `<option value="${m.id}">${name} [${m.code}] - 40HQ: ${m.containerCapacity40HQ || 85} pcs</option>`;
      }).join('');

      // Trigger initial selection update
      if (this.cachedModels.length > 0) {
        cbModelSelect.value = this.cachedModels[0].id;
        cbModelSelect.dispatchEvent(new Event('change'));
      }
    }

    // Populate Colors filter
    const filterColor = document.getElementById('filter-color-select');
    if (filterColor) {
      const uniqueColors = [...new Set(this.cachedVehicles.map(v => v.color).filter(Boolean))];
      filterColor.innerHTML = `<option value="">${i18n.t('filterAllColors')}</option>` +
        uniqueColors.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  }

  // ================= 1. DASHBOARD & KPIS =================
  renderDashboard() {
    const vehicles = this.cachedVehicles;
    const repairs = this.cachedRepairs;
    const parts = this.cachedParts;

    const totalCount = vehicles.length;
    const pdiCount = vehicles.filter(v => v.status === 'pdi_inspection').length;
    const serviceCount = vehicles.filter(v => v.status === 'in_service').length;
    const readyCount = vehicles.filter(v => v.status === 'ready_to_ship' || v.status === 'in_stock').length;

    // Calculate Turnover and Aging using WmsAlgorithms
    const completedOutflows = this.cachedMovements.filter(m => m.type.startsWith('outflow')).length;
    const turnoverRate = WmsAlgorithms.calculateTurnoverRate(completedOutflows, totalCount);

    // DMR - Dias Médios de Retenção
    let totalDays = 0;
    vehicles.forEach(v => {
      const aging = WmsAlgorithms.calculatePatioAging(v.entryDate);
      totalDays += aging.daysInPatio;
    });
    const avgDays = totalCount > 0 ? Math.round(totalDays / totalCount) : 0;

    // Inventory Value
    const totalInventoryValue = vehicles.reduce((sum, v) => sum + (v.wholesalePrice || 0), 0);

    // Update Top KPIs
    document.getElementById('kpi-total-vehicles').textContent = totalCount;
    document.getElementById('kpi-pdi-count').textContent = pdiCount;
    document.getElementById('kpi-service-count').textContent = serviceCount;
    document.getElementById('kpi-ready-count').textContent = readyCount;
    document.getElementById('kpi-turnover-rate').textContent = `${turnoverRate}x`;
    document.getElementById('kpi-avg-retention').textContent = `${avgDays} ${i18n.currentLang === 'zh-CN' ? '天' : 'dias'}`;
    document.getElementById('kpi-inventory-value').textContent = `R$ ${totalInventoryValue.toLocaleString('pt-BR')}`;

    // Curva ABC & Model Breakdown Table
    const modelStats = this.cachedModels.map(model => {
      const inPatio = vehicles.filter(v => v.modelId === model.id && v.status === 'in_stock').length;
      const inProcess = vehicles.filter(v => v.modelId === model.id && (v.status === 'pdi_inspection' || v.status === 'in_service')).length;
      const totalUnits = inPatio + inProcess;
      return {
        ...model,
        inPatio,
        inProcess,
        quantity: totalUnits,
        totalValue: totalUnits * model.wholesalePrice
      };
    });

    const abcClassified = WmsAlgorithms.calculateAbcClassification(modelStats);

    const tbody = document.getElementById('dashboard-models-tbody');
    if (!tbody) return;

    tbody.innerHTML = abcClassified.map(item => {
      const modelDisplayName = i18n.currentLang === 'zh-CN' && item.nameCn ? item.nameCn : item.name;
      const baseDisplayName = i18n.currentLang === 'zh-CN' && item.factoryBaseCn ? item.factoryBaseCn : item.factoryBase;
      const abcBadgeClass = item.abcClass === 'A' ? 'status-in-stock' : item.abcClass === 'B' ? 'status-pdi' : 'status-ready';

      return `
        <tr>
          <td><span class="chassis-vin-cell">${item.code}</span></td>
          <td><strong>${modelDisplayName}</strong></td>
          <td><span style="font-size: 11px; color: var(--text-muted);">${baseDisplayName}</span></td>
          <td><code>${item.tireFront} / ${item.tireRear}</code></td>
          <td><strong style="color: var(--color-cyan);">${item.inPatio}</strong></td>
          <td><span style="color: var(--color-amber);">${item.inProcess}</span></td>
          <td><span class="status-pill status-in-stock">${item.inPatio} disp.</span></td>
          <td><code>${item.containerCapacity40HQ || 85} pcs</code></td>
          <td>R$ ${item.wholesalePrice.toLocaleString('pt-BR')}</td>
          <td><strong>R$ ${(item.totalValue || 0).toLocaleString('pt-BR')}</strong></td>
          <td><span class="status-pill ${abcBadgeClass}">CLASSE ${item.abcClass}</span></td>
        </tr>
      `;
    }).join('');
  }

  // ================= 2. VEHICLES & CHASSIS TABLE =================
  renderVehiclesTable() {
    const tbody = document.getElementById('vehicles-table-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('search-chassis-input')?.value || '').toLowerCase().trim();
    const selectedModel = document.getElementById('filter-model-select')?.value || '';
    const selectedStatus = document.getElementById('filter-status-select')?.value || '';
    const selectedColor = document.getElementById('filter-color-select')?.value || '';

    const filtered = this.cachedVehicles.filter(v => {
      const matchSearch = !searchTerm ||
        v.chassisVin.toLowerCase().includes(searchTerm) ||
        (v.modelName && v.modelName.toLowerCase().includes(searchTerm)) ||
        (v.factoryCode && v.factoryCode.toLowerCase().includes(searchTerm)) ||
        (v.containerLot && v.containerLot.toLowerCase().includes(searchTerm));

      const matchModel = !selectedModel || v.modelId === selectedModel;
      const matchStatus = !selectedStatus || v.status === selectedStatus;
      const matchColor = !selectedColor || v.color === selectedColor;

      return matchSearch && matchModel && matchStatus && matchColor;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">${i18n.t('noDataFound')}</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(v => {
      const aging = WmsAlgorithms.calculatePatioAging(v.entryDate);
      const agingBadge = `<span class="aging-badge aging-${aging.level}">${i18n.currentLang === 'zh-CN' ? aging.labelCn : aging.labelPt}</span>`;

      let statusBadge = '';
      if (v.status === 'in_stock') statusBadge = `<span class="status-pill status-in-stock">${i18n.t('statusInStock')}</span>`;
      else if (v.status === 'pdi_inspection') statusBadge = `<span class="status-pill status-pdi">${i18n.t('statusPdiInspection')}</span>`;
      else if (v.status === 'in_service') statusBadge = `<span class="status-pill status-service">${i18n.t('statusInService')}</span>`;
      else if (v.status === 'ready_to_ship') statusBadge = `<span class="status-pill status-ready">${i18n.t('statusReadyToShip')}</span>`;
      else statusBadge = `<span class="status-pill status-delivered">${i18n.t('statusDelivered')}</span>`;

      const formattedEntry = v.entryDate ? new Date(v.entryDate).toLocaleDateString('pt-BR') : '-';

      return `
        <tr>
          <td>
            <div class="chassis-vin-cell">
              <span>${v.chassisVin}</span>
            </div>
          </td>
          <td>
            <div class="model-name-cell">${v.modelName || v.modelId}</div>
            <div class="model-sub-code">${v.factoryCode || 'DB-STD'} // ${v.factoryBase || ''}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="color-dot" style="background-color: ${v.colorHex || '#444'};"></span>
              <span>${v.color || 'Padrão'}</span>
            </div>
          </td>
          <td>
            <code>${v.tireFront || '3.00-10'} / ${v.tireRear || '3.00-10'}</code>
          </td>
          <td>
            <div style="font-size: 11px;">${v.motor || '1200W'}</div>
            <div style="font-size: 10px; color: var(--text-dim);">${v.battery || '60V'}</div>
          </td>
          <td>${formattedEntry}</td>
          <td>${agingBadge}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn-bauhaus btn-secondary btn-sm" data-action="passport" data-vin="${v.chassisVin}" title="${i18n.t('btnViewDetails')}">
                📄 Ficha
              </button>
              <button class="btn-bauhaus btn-primary btn-sm" data-action="label" data-vin="${v.chassisVin}" title="${i18n.t('btnPrintSticker')}">
                🏷️ Etiqueta
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row action listeners
    tbody.querySelectorAll('[data-action="passport"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const vin = btn.getAttribute('data-vin');
        const v = this.cachedVehicles.find(item => item.chassisVin === vin);
        if (v) this.openVehiclePassportModal(v);
      });
    });

    tbody.querySelectorAll('[data-action="label"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const vin = btn.getAttribute('data-vin');
        const v = this.cachedVehicles.find(item => item.chassisVin === vin);
        if (v) this.openThermalLabelModal(v);
      });
    });
  }

  // ================= 3. MOVEMENTS TABLE =================
  renderMovementsTable() {
    const tbody = document.getElementById('movements-table-tbody');
    if (!tbody) return;

    if (this.cachedMovements.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">${i18n.t('noDataFound')}</td></tr>`;
      return;
    }

    tbody.innerHTML = this.cachedMovements.map(m => {
      let typeLabel = m.type;
      let badgeClass = 'status-in-stock';
      if (m.type === 'inflow_container') {
        typeLabel = i18n.t('typeInflowContainer');
        badgeClass = 'status-in-stock';
      } else if (m.type === 'inflow_single') {
        typeLabel = i18n.t('typeInflowSingle');
        badgeClass = 'status-pdi';
      } else if (m.type === 'outflow_franchise') {
        typeLabel = i18n.t('typeOutflowFranchise');
        badgeClass = 'status-ready';
      } else if (m.type === 'outflow_retail') {
        typeLabel = i18n.t('typeOutflowRetail');
        badgeClass = 'status-delivered';
      }

      const formattedDate = m.date ? new Date(m.date).toLocaleString('pt-BR') : '-';

      return `
        <tr>
          <td><code>${m.id}</code></td>
          <td><span class="status-pill ${badgeClass}">${typeLabel}</span></td>
          <td>${formattedDate}</td>
          <td><strong style="color: var(--color-cyan);">${m.chassisVin}</strong></td>
          <td>${m.modelId}</td>
          <td><span style="font-family: var(--font-mono);">${m.refDoc || '-'}</span></td>
          <td>${m.originDest || '-'}</td>
          <td>${m.user || 'Admin'}</td>
        </tr>
      `;
    }).join('');
  }

  // ================= 4. WORKSHOP (OFICINA & OS) =================
  renderWorkshopTable() {
    const tbody = document.getElementById('repairs-table-tbody');
    if (!tbody) return;

    if (this.cachedRepairs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">${i18n.t('noDataFound')}</td></tr>`;
      return;
    }

    tbody.innerHTML = this.cachedRepairs.map(r => {
      let statusBadge = '';
      if (r.status === 'analyzing') statusBadge = `<span class="status-pill status-pdi">${i18n.t('osStatusAnalyzing')}</span>`;
      else if (r.status === 'in_progress') statusBadge = `<span class="status-pill status-service">${i18n.t('osStatusInProgress')}</span>`;
      else if (r.status === 'waiting_parts') statusBadge = `<span class="status-pill status-ready">${i18n.t('osStatusWaitingParts')}</span>`;
      else if (r.status === 'completed') statusBadge = `<span class="status-pill status-in-stock">${i18n.t('osStatusCompleted')}</span>`;
      else statusBadge = `<span class="status-pill status-pdi">${r.status}</span>`;

      const partsList = (r.partsUsed && r.partsUsed.length > 0)
        ? r.partsUsed.map(p => `${p.namePt || p.partNumber} (x${p.qty || 1})`).join(', ')
        : 'Mão de obra / Ajuste';

      const openedFormatted = r.openedAt ? new Date(r.openedAt).toLocaleDateString('pt-BR') : '-';

      return `
        <tr>
          <td><strong>${r.osNumber}</strong></td>
          <td>
            <div style="font-family: var(--font-mono); color: var(--color-cyan);">${r.chassisVin}</div>
            <div style="font-size: 10px; color: var(--text-dim);">${r.modelName || r.modelId}</div>
          </td>
          <td><strong>${r.faultType}</strong></td>
          <td>${r.mechanicName || 'Mecânico'}</td>
          <td style="font-size: 11px; color: var(--text-muted);">${partsList}</td>
          <td>${openedFormatted}</td>
          <td>${statusBadge}</td>
          <td>
            ${r.status !== 'completed' ? `
              <button class="btn-bauhaus btn-emerald btn-sm" data-complete-os="${r.osNumber}">
                Concluir OS
              </button>
            ` : '<span style="color: var(--color-emerald); font-weight: 700;">OK</span>'}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-complete-os]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const osNum = btn.getAttribute('data-complete-os');
        await wmsDb.updateServiceOrderStatus(osNum, 'completed', 'Serviço finalizado com sucesso.');
        await this.refreshAllData();
      });
    });
  }

  // ================= 5. SPARE PARTS & TIRES =================
  renderPartsTable() {
    const tbody = document.getElementById('parts-table-tbody');
    if (!tbody) return;

    if (this.cachedParts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">${i18n.t('noDataFound')}</td></tr>`;
      return;
    }

    tbody.innerHTML = this.cachedParts.map(p => {
      const isCritical = p.currentStock <= p.minStock / 2;
      const isLow = p.currentStock <= p.minStock;

      let statusPill = `<span class="status-pill status-in-stock">${i18n.t('stockSufficient')}</span>`;
      if (isCritical) {
        statusPill = `<span class="status-pill status-service" style="background: var(--color-crimson-dim); color: var(--color-crimson);">${i18n.t('stockCritical')}</span>`;
      } else if (isLow) {
        statusPill = `<span class="status-pill status-ready">${i18n.t('stockLow')}</span>`;
      }

      const partName = i18n.currentLang === 'zh-CN' && p.nameCn ? p.nameCn : p.namePt;
      const categoryName = i18n.currentLang === 'zh-CN' && p.categoryCn ? p.categoryCn : p.category;

      return `
        <tr>
          <td><code style="color: var(--color-cyan); font-weight: 700;">${p.partNumber}</code></td>
          <td><strong>${partName}</strong></td>
          <td><span style="font-size: 11px; text-transform: uppercase;">${categoryName}</span></td>
          <td>${p.tireDimensions ? `<code>${p.tireDimensions}</code>` : '-'}</td>
          <td style="font-size: 11px; color: var(--text-muted);">${(p.compatibleModels || []).join(', ')}</td>
          <td><strong style="font-size: 14px; color: ${isLow ? 'var(--color-crimson)' : 'var(--text-main)'};">${p.currentStock}</strong></td>
          <td>${p.minStock}</td>
          <td><strong>${p.eoq || 20} pcs</strong></td>
          <td>R$ ${p.unitCost}</td>
          <td>${statusPill}</td>
        </tr>
      `;
    }).join('');
  }

  // ================= MODAL MANAGERS =================
  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  openContainerModal() {
    const modal = document.getElementById('modal-container-batch');
    if (!modal) return;
    modal.classList.add('active');
  }

  async handleProcessContainerBatch() {
    const containerNumber = document.getElementById('cb-number').value.trim();
    const modelId = document.getElementById('cb-model-select').value;
    const quantity = parseInt(document.getElementById('cb-quantity').value, 10);
    const chassisPrefix = document.getElementById('cb-prefix').value.trim();
    const startSeq = parseInt(document.getElementById('cb-start-seq').value, 10);
    const notes = document.getElementById('cb-notes').value.trim();

    if (!containerNumber || !modelId || isNaN(quantity) || quantity <= 0) {
      alert('Por favor preencha todos os campos obrigatórios do lote.');
      return;
    }

    const model = this.cachedModels.find(m => m.id === modelId);
    if (!model) return;

    await wmsDb.importContainerBatch({
      containerNumber,
      model,
      quantity,
      chassisPrefix,
      startSeq,
      colorsRatio: model.colors,
      notes
    });

    this.closeAllModals();
    await this.refreshAllData();
    alert(`Lote de ${quantity} unidades do modelo ${model.name} importado com sucesso!`);
  }

  // VEHICLE PASSPORT / DETAILS
  openVehiclePassportModal(vehicle) {
    this.activeVehicleForModal = vehicle;
    const modal = document.getElementById('modal-vehicle-passport');
    const modalTitle = document.getElementById('vp-modal-title');
    const modalBody = document.getElementById('vp-modal-body');

    modalTitle.textContent = `FICHA TÉCNICA // ${vehicle.chassisVin}`;

    const aging = WmsAlgorithms.calculatePatioAging(vehicle.entryDate);

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <img src="${vehicle.photos && vehicle.photos[0] ? vehicle.photos[0] : '/assets/models/z8_tank_studio.jpg'}" 
               alt="${vehicle.modelName}" 
               style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--card-radius); border: 1px solid var(--border-subtle); margin-bottom: 12px;">

          <div style="background: #0B0E15; border: 1px solid var(--border-subtle); padding: 12px; border-radius: var(--card-radius);">
            <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">HISTÓRICO NO PÁTIO</div>
            <div style="font-size: 12px;"><strong>Entrada:</strong> ${new Date(vehicle.entryDate).toLocaleString('pt-BR')}</div>
            <div style="font-size: 12px;"><strong>Container / Lote:</strong> <code>${vehicle.containerLot || 'AVULSO'}</code></div>
            <div style="font-size: 12px; margin-top: 4px;"><strong>Permanência:</strong> <span class="aging-badge aging-${aging.level}">${aging.daysInPatio} dias (${aging.labelPt})</span></div>
            <div style="font-size: 12px; margin-top: 4px;"><strong>Status:</strong> <span class="status-pill status-${vehicle.status}">${vehicle.status}</span></div>
          </div>
        </div>

        <div>
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">${vehicle.modelName}</h3>
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--color-cyan); margin-bottom: 14px;">
            PN: ${vehicle.factoryCode} // ORIGEM: ${vehicle.factoryBase || 'Fábrica'}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 16px;">
            <div style="background: #141A24; padding: 8px; border-radius: var(--btn-radius);">
              <span style="display: block; font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">PNEUS DIANT./TRAS.</span>
              <strong>${vehicle.tireFront} / ${vehicle.tireRear}</strong>
            </div>
            <div style="background: #141A24; padding: 8px; border-radius: var(--btn-radius);">
              <span style="display: block; font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">COR DE FÁBRICA</span>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span class="color-dot" style="background-color: ${vehicle.colorHex || '#444'};"></span>
                <strong>${vehicle.color}</strong>
              </div>
            </div>
            <div style="background: #141A24; padding: 8px; border-radius: var(--btn-radius);">
              <span style="display: block; font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">MOTORIZAÇÃO</span>
              <strong>${vehicle.motor || '1200W'}</strong>
            </div>
            <div style="background: #141A24; padding: 8px; border-radius: var(--btn-radius);">
              <span style="display: block; font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">BATERIA</span>
              <strong>${vehicle.battery || '60V'}</strong>
            </div>
          </div>

          <div style="background: #0B0E15; border: 1px solid var(--border-subtle); padding: 12px; border-radius: var(--card-radius); margin-bottom: 12px;">
            <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">OBSERVAÇÕES TÉCNICAS // PDI</div>
            <p style="font-size: 12px; color: var(--text-main);">${vehicle.notes || 'Nenhuma avaria registrada. Veículo em conformidade de fábrica.'}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('vp-btn-print-label').onclick = () => {
      this.closeAllModals();
      this.openThermalLabelModal(vehicle);
    };

    document.getElementById('vp-btn-open-os').onclick = () => {
      this.closeAllModals();
      this.openCreateOsModal(vehicle.chassisVin);
    };

    modal.classList.add('active');
  }

  // THERMAL LABEL PRINT
  openThermalLabelModal(vehicle) {
    this.activeVehicleForLabel = vehicle;
    const modal = document.getElementById('modal-thermal-label');
    this.renderThermalLabelModal(vehicle, this.currentLabelSize);
    modal.classList.add('active');
  }

  renderThermalLabelModal(vehicle, size) {
    const mount = document.getElementById('thermal-preview-mount');
    if (!mount) return;

    mount.innerHTML = ThermalLabelEngine.generateLabelHtml(vehicle, size);
    ThermalLabelEngine.renderCodes(vehicle, size);
  }

  // CREATE OS MODAL
  openCreateOsModal(presetVin = '') {
    const modal = document.getElementById('modal-create-os');
    const chassisSelect = document.getElementById('os-chassis-select');
    const partSelect = document.getElementById('os-part-select');

    if (chassisSelect) {
      chassisSelect.innerHTML = this.cachedVehicles.map(v => `
        <option value="${v.chassisVin}" ${v.chassisVin === presetVin ? 'selected' : ''}>
          ${v.chassisVin} - ${v.modelName} (${v.color})
        </option>
      `).join('');
    }

    if (partSelect) {
      partSelect.innerHTML = '<option value="">Nenhuma peça (Apenas mão de obra / inspeção)</option>' +
        this.cachedParts.map(p => `
          <option value="${p.partNumber}">${p.namePt} [${p.partNumber}] (Estoque: ${p.currentStock})</option>
        `).join('');
    }

    modal.classList.add('active');
  }

  async handleSubmitServiceOrder() {
    const chassisVin = document.getElementById('os-chassis-select').value;
    const mechanicName = document.getElementById('os-mechanic').value.trim();
    const faultType = document.getElementById('os-fault-type').value;
    const partNumber = document.getElementById('os-part-select').value;
    const description = document.getElementById('os-description').value.trim();

    const vehicle = this.cachedVehicles.find(v => v.chassisVin === chassisVin);
    if (!vehicle) return;

    const partsUsed = [];
    if (partNumber) {
      const part = this.cachedParts.find(p => p.partNumber === partNumber);
      if (part) {
        partsUsed.push({ partNumber: part.partNumber, namePt: part.namePt, qty: 1 });
      }
    }

    await wmsDb.createServiceOrder({
      chassisVin,
      modelId: vehicle.modelId,
      modelName: vehicle.modelName,
      mechanicName,
      faultType,
      faultDescription: description,
      status: 'analyzing',
      partsUsed
    });

    this.closeAllModals();
    await this.refreshAllData();
    alert(`Ordem de Serviço aberta com sucesso para o chassi ${chassisVin}!`);
  }

  // NEW MODEL SUBMIT
  async handleSaveNewModel() {
    const name = document.getElementById('nm-name').value.trim();
    const nameCn = document.getElementById('nm-name-cn').value.trim();
    const code = document.getElementById('nm-code').value.trim();
    const base = document.getElementById('nm-base').value;
    const category = document.getElementById('nm-category').value;
    const motor = document.getElementById('nm-motor').value.trim();
    const controller = document.getElementById('nm-controller').value.trim();
    const battery = document.getElementById('nm-battery').value.trim();
    const tireFront = document.getElementById('nm-tire-front').value.trim();
    const tireRear = document.getElementById('nm-tire-rear').value.trim();
    const wholesalePrice = parseFloat(document.getElementById('nm-wholesale').value);
    const retailPrice = parseFloat(document.getElementById('nm-retail').value);
    const containerCapacity40HQ = parseInt(document.getElementById('nm-40hq').value, 10) || 85;
    const colorsRaw = document.getElementById('nm-colors').value;
    const featuresRaw = document.getElementById('nm-features').value;

    const id = `z8-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const colors = colorsRaw.split(',').map(c => c.trim()).filter(Boolean).map(c => ({
      namePt: c,
      nameCn: c,
      hex: '#333333'
    }));

    const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);

    const newModel = {
      id,
      name,
      nameCn,
      code,
      factoryBase: base,
      factoryBaseCn: base.includes('Norte') ? '北方基地' : '佛山与惠州基地',
      category,
      motor,
      controller,
      battery,
      tireFront,
      tireRear,
      tireType: `${tireFront} Pneu de Vácuo`,
      wholesalePrice,
      retailPrice,
      profit: retailPrice - wholesalePrice,
      containerCapacity40HQ,
      colors: colors.length > 0 ? colors : [{ namePt: 'Preto Padrão', nameCn: '黑色', hex: '#111' }],
      features,
      image: '/assets/models/z8_tank_studio.jpg'
    };

    await wmsDb.addNewModel(newModel);
    await this.refreshAllData();
    alert(`Modelo ${name} (${code}) homologado e cadastrado no WMS com sucesso!`);
    this.switchTab('dashboard');
  }

  // MOBILE CONNECT MODAL & LAN QR CODE
  async setupNetworkInfo() {
    try {
      const res = await fetch('/api/network-info');
      const data = await res.json();
      if (data && data.mobileUrl) {
        this.mobileUrl = data.mobileUrl;
      } else {
        this.mobileUrl = `${window.location.origin}/mobile-scanner/`;
      }
    } catch (e) {
      this.mobileUrl = `${window.location.origin}/mobile-scanner/`;
    }
  }

  openMobileConnectModal() {
    const modal = document.getElementById('modal-mobile-connect');
    const textUrl = document.getElementById('mobile-scanner-url-text');
    const qrCanvas = document.getElementById('qr-mobile-connect');

    const urlToEncode = this.mobileUrl || `${window.location.origin}/mobile-scanner/`;
    textUrl.textContent = urlToEncode;

    if (window.qrcode && qrCanvas) {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(urlToEncode);
        qr.make();

        const ctx = qrCanvas.getContext('2d');
        const moduleCount = qr.getModuleCount();
        const cellSize = qrCanvas.width / moduleCount;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
        ctx.fillStyle = '#000000';

        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }
      } catch (err) {
        console.warn('QR Mobile generation error:', err);
      }
    }

    modal.classList.add('active');
  }
}

// Instantiate and initialize
const app = new Z8WmsApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
