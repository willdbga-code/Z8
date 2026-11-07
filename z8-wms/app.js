/**
 * Z8 E-MOTION // WMS COCKPIT ORCHESTRATION ENGINE
 * High-performance, reactive, bilingual, offline-first.
 */

import { wmsDb } from './db.js';
import { i18n } from './i18n.js';
import { WmsAlgorithms } from './algorithms.js';
import { ThermalLabelEngine } from './labels.js';

// Official 24-point PDI Technical Inspection Protocol
export const PDI_CHECKLIST_TEMPLATE = [
  {
    clusterId: 'c1',
    clusterPt: '1. BATERIA, BMS & SISTEMA ELÉTRICO',
    clusterCn: '第一组：电池系统、BMS与电气控制',
    items: [
      { id: 'pdi-01', pt: 'Tensão da bateria dentro da faixa nominal (60V / 72V)', cn: '电池静态电压符合标称范围 (60V/72V)' },
      { id: 'pdi-02', pt: 'Comunicação BMS & proteção contra subtensão ativa', cn: 'BMS电池保护板通信与低压切断保护正常' },
      { id: 'pdi-03', pt: 'Painel digital LCD/TFT (velocímetro, hodômetro, carga)', cn: '高清LCD/TFT仪表显示、电量与故障码自检' },
      { id: 'pdi-04', pt: 'Faróis LED Halo duplo e lanterna traseira de freio', cn: '双LED天使眼大灯与高亮刹车尾灯测试' },
      { id: 'pdi-05', pt: 'Setas direcionais dianteiras/traseiras e buzina 12V', cn: '前后转向灯频闪与12V高分贝喇叭响应' },
      { id: 'pdi-06', pt: 'Sistema Keyless NFC, controle remoto e alarme sonoro', cn: 'NFC无钥匙刷卡启动、遥控与震动防盗' }
    ]
  },
  {
    clusterId: 'c2',
    clusterPt: '2. CHASSI, SUSPENSÃO & PNEUS',
    clusterCn: '第二组：高碳钢车架、减震系统与轮胎规格',
    items: [
      { id: 'pdi-07', pt: 'Gravação nítida do Chassi VIN conforme nota fiscal', cn: '车架管上VIN打刻钢印清晰无遮挡' },
      { id: 'pdi-08', pt: 'Pressão dos pneus dianteiro e traseiro conforme manual', cn: '前后真空胎气压校准 (冷态标准PSI)' },
      { id: 'pdi-09', pt: 'Banda de rodagem, válvulas e ausência de deformidades', cn: '轮胎胎面花纹深度、气门嘴密封性无漏气' },
      { id: 'pdi-10', pt: 'Aperto e torque das porcas dos eixos dianteiro e traseiro', cn: '前后主轴紧固螺母扭矩达到出厂力矩标准' },
      { id: 'pdi-11', pt: 'Garfos dianteiros hidráulicos sem vazamentos de óleo', cn: '加粗前减震液压密封无油渍、下压回弹顺畅' },
      { id: 'pdi-12', pt: 'Amortecedores traseiros duplo damping e alinhamento', cn: '后置双液压弹簧减震预载与后摇臂对称度' }
    ]
  },
  {
    clusterId: 'c3',
    clusterPt: '3. FREIOS HIDRÁULICOS & SEGURANÇA',
    clusterCn: '第三组：双油压碟刹、油位与制动断电',
    items: [
      { id: 'pdi-13', pt: 'Nível e transparência do fluido de freio DOT4 nos manetes', cn: '左右刹把上视油镜DOT4制动液位适中无气泡' },
      { id: 'pdi-14', pt: 'Sangria de ar e pressão firme das manetes de freio', cn: '刹把行程适中、无海绵感及制动拖滞' },
      { id: 'pdi-15', pt: 'Discos de freio dianteiro e traseiro sem empenamento', cn: '前浮动大碟盘与后碟刹盘平整无擦碰刮痕' },
      { id: 'pdi-16', pt: 'Pastilhas de freio 100% íntegras e alinhadas aos discos', cn: '前后刹车来令片贴合无偏移、制动静音' },
      { id: 'pdi-17', pt: 'Microswitch de corte elétrico do motor ao acionar freios', cn: '轻捏左右刹把即时切断电机动力输出' },
      { id: 'pdi-18', pt: 'Descanso lateral com sensor de segurança de partida', cn: '边撑未收起时禁止电机动力输出 (驻车断电)' }
    ]
  },
  {
    clusterId: 'c4',
    clusterPt: '4. MOTOR BRUSHLESS & TRANSMISSÃO',
    clusterCn: '第四组：无刷轮毂电机、FOC矢量控制器与动力输出',
    items: [
      { id: 'pdi-19', pt: 'Resposta progressiva do acelerador eletrônico hall', cn: '电子转把加速线性顺滑、无卡滞回弹自如' },
      { id: 'pdi-20', pt: 'Rotação livre do motor no cavalete sem ruídos magnéticos', cn: '大撑架起空转测试、电机平稳无电磁异响' },
      { id: 'pdi-21', pt: 'Sensores Hall do motor e chicote trifásico sem folgas', cn: '电机霍尔信号与三相粗电缆连接牢固防水' },
      { id: 'pdi-22', pt: 'Modos de potência (Eco, Standard, Sport) operacionais', cn: '高低速档位切换灵敏、三档限速准确' },
      { id: 'pdi-23', pt: 'Carregador inteligente bivolt e porta de recarga protegida', cn: '配套原厂智能充电器通电正常、充电口防尘盖完好' },
      { id: 'pdi-24', pt: 'Manual do proprietário, certificado CONTRAN e 2 chaves', cn: '随车用户手册、CONTRAN 996 合格证及原装钥匙交付' }
    ]
  }
];

class Z8WmsApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.activeVehicleForModal = null;
    this.activeVehicleForLabel = null;
    this.currentLabelSize = '100x50';
    this.batchLabelSize = '100x50';
    this.activeVehicleForPdi = null;
    this.activeVehicleForDispatch = null;
    this.selectedVehiclesForBatchLabels = [];
    this.selectedVins = new Set();
    this.activeVehicleViewMode = 'table';
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

    // 13. Single Vehicle Inflow Triggers
    const triggerInflowQuick = document.getElementById('btn-quick-inflow');
    const triggerInflowModal = document.getElementById('btn-open-single-vehicle-modal');
    if (triggerInflowQuick) triggerInflowQuick.addEventListener('click', () => this.openSingleVehicleModal());
    if (triggerInflowModal) triggerInflowModal.addEventListener('click', () => this.openSingleVehicleModal());

    const btnSvGenVin = document.getElementById('btn-sv-generate-vin');
    if (btnSvGenVin) btnSvGenVin.addEventListener('click', () => this.generateNextVinForSingleVehicle());

    const btnSubmitSingleVehicle = document.getElementById('btn-submit-single-vehicle');
    if (btnSubmitSingleVehicle) {
      btnSubmitSingleVehicle.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSaveSingleVehicle();
      });
    }

    // 14. Dispatch / Outflow Triggers
    const triggerQuickOutflow = document.getElementById('btn-quick-outflow');
    if (triggerQuickOutflow) triggerQuickOutflow.addEventListener('click', () => this.openDispatchModal());

    const btnSubmitDispatch = document.getElementById('btn-submit-dispatch');
    if (btnSubmitDispatch) {
      btnSubmitDispatch.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleConfirmDispatch();
      });
    }

    // 15. Add Spare Part Modal Trigger
    const triggerOpenPart = document.getElementById('btn-open-part-modal');
    if (triggerOpenPart) triggerOpenPart.addEventListener('click', () => this.openAddPartModal());

    const apDemand = document.getElementById('ap-demand');
    const apCost = document.getElementById('ap-unit-cost');
    if (apDemand) apDemand.addEventListener('input', () => this.updateAddPartEoqPreview());
    if (apCost) apCost.addEventListener('input', () => this.updateAddPartEoqPreview());

    const btnSubmitAddPart = document.getElementById('btn-submit-add-part');
    if (btnSubmitAddPart) {
      btnSubmitAddPart.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSaveNewPart();
      });
    }

    // 16. PDI Checklist Modal Actions
    const btnApprovePdi = document.getElementById('btn-approve-pdi');
    if (btnApprovePdi) btnApprovePdi.addEventListener('click', () => this.handleApprovePdi());

    const btnFailPdi = document.getElementById('btn-fail-pdi');
    if (btnFailPdi) btnFailPdi.addEventListener('click', () => this.handleFailPdi());

    // 17. View Mode Switcher
    const btnViewTable = document.getElementById('btn-view-table');
    const btnViewYard = document.getElementById('btn-view-yard');
    if (btnViewTable) btnViewTable.addEventListener('click', () => this.switchVehicleViewMode('table'));
    if (btnViewYard) btnViewYard.addEventListener('click', () => this.switchVehicleViewMode('yard'));

    // 18. Batch Actions
    const thSelectAll = document.getElementById('th-select-all-vehicles');
    if (thSelectAll) {
      thSelectAll.addEventListener('change', () => {
        if (thSelectAll.checked) {
          this.cachedVehicles.forEach(v => this.selectedVins.add(v.chassisVin));
        } else {
          this.selectedVins.clear();
        }
        this.updateBatchBar();
        this.renderVehiclesTable();
      });
    }

    const btnBatchLabelsTrigger = document.getElementById('btn-batch-labels-trigger');
    if (btnBatchLabelsTrigger) btnBatchLabelsTrigger.addEventListener('click', () => this.openBatchLabelsModal());

    const btnTriggerBatchPrint = document.getElementById('btn-trigger-batch-print');
    if (btnTriggerBatchPrint) btnTriggerBatchPrint.addEventListener('click', () => ThermalLabelEngine.print());

    const btnBatchDispatchTrigger = document.getElementById('btn-batch-dispatch-trigger');
    if (btnBatchDispatchTrigger) btnBatchDispatchTrigger.addEventListener('click', () => this.handleBatchDispatch());

    const btnBatchPdiTrigger = document.getElementById('btn-batch-pdi-trigger');
    if (btnBatchPdiTrigger) btnBatchPdiTrigger.addEventListener('click', () => this.handleBatchPdi());

    const btnBatchCsvTrigger = document.getElementById('btn-batch-csv-trigger');
    if (btnBatchCsvTrigger) btnBatchCsvTrigger.addEventListener('click', () => this.handleBatchCsv());

    // 19. Export CSV Top Header Trigger
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        this.handleExportCsv('vehicles');
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
        if (this.activeVehicleViewMode === 'yard') {
          this.renderYardMap();
        } else {
          this.renderVehiclesTable();
        }
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

  switchVehicleViewMode(mode) {
    this.activeVehicleViewMode = mode;
    const btnTable = document.getElementById('btn-view-table');
    const btnYard = document.getElementById('btn-view-yard');
    const tableWrapper = document.getElementById('vehicles-table-wrapper');
    const yardContainer = document.getElementById('yard-map-container');

    if (mode === 'yard') {
      if (btnTable) btnTable.classList.remove('active');
      if (btnYard) btnYard.classList.add('active');
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (yardContainer) {
        yardContainer.style.display = 'flex';
        this.renderYardMap();
      }
    } else {
      if (btnTable) btnTable.classList.add('active');
      if (btnYard) btnYard.classList.remove('active');
      if (yardContainer) yardContainer.style.display = 'none';
      if (tableWrapper) {
        tableWrapper.style.display = 'block';
        this.renderVehiclesTable();
      }
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
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">${i18n.t('noDataFound')}</td></tr>`;
      this.updateBatchBar();
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
      const isChecked = this.selectedVins.has(v.chassisVin);

      return `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="vehicle-select-chk" data-vin="${v.chassisVin}" ${isChecked ? 'checked' : ''}>
          </td>
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
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn-bauhaus btn-secondary btn-sm" data-action="passport" data-vin="${v.chassisVin}" title="${i18n.t('btnViewDetails')}">
                📄 Ficha
              </button>
              <button class="btn-bauhaus btn-primary btn-sm" data-action="label" data-vin="${v.chassisVin}" title="${i18n.t('btnPrintSticker')}">
                🏷️ Etiqueta
              </button>
              <button class="btn-bauhaus btn-secondary btn-sm" data-action="pdi" data-vin="${v.chassisVin}" title="${i18n.t('btnActionPdi')}">
                📋 PDI
              </button>
              ${v.status !== 'delivered' ? `
                <button class="btn-bauhaus btn-amber btn-sm" data-action="dispatch" data-vin="${v.chassisVin}" title="${i18n.t('btnActionDispatch')}">
                  🚚 Despachar
                </button>
              ` : ''}
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

    tbody.querySelectorAll('[data-action="pdi"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const vin = btn.getAttribute('data-vin');
        const v = this.cachedVehicles.find(item => item.chassisVin === vin);
        if (v) this.openPdiChecklistModal(v);
      });
    });

    tbody.querySelectorAll('[data-action="dispatch"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const vin = btn.getAttribute('data-vin');
        this.openDispatchModal(vin);
      });
    });

    // Row selection checkboxes
    tbody.querySelectorAll('.vehicle-select-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const vin = chk.getAttribute('data-vin');
        if (chk.checked) {
          this.selectedVins.add(vin);
        } else {
          this.selectedVins.delete(vin);
        }
        this.updateBatchBar();
      });
    });

    this.updateBatchBar();
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

    const modalFooter = document.querySelector('#modal-vehicle-passport .modal-footer');
    if (modalFooter && !document.getElementById('vp-btn-open-pdi')) {
      const pdiBtn = document.createElement('button');
      pdiBtn.id = 'vp-btn-open-pdi';
      pdiBtn.className = 'btn-bauhaus btn-secondary';
      pdiBtn.innerHTML = '📋 PDI';
      pdiBtn.onclick = () => {
        this.closeAllModals();
        this.openPdiChecklistModal(vehicle);
      };
      modalFooter.appendChild(pdiBtn);
    }

    if (modalFooter && !document.getElementById('vp-btn-open-dispatch') && vehicle.status !== 'delivered') {
      const dispBtn = document.createElement('button');
      dispBtn.id = 'vp-btn-open-dispatch';
      dispBtn.className = 'btn-bauhaus btn-amber';
      dispBtn.innerHTML = '🚚 Despachar';
      dispBtn.onclick = () => {
        this.closeAllModals();
        this.openDispatchModal(vehicle.chassisVin);
      };
      modalFooter.appendChild(dispBtn);
    }

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

  // ================= BATCH BAR UPDATE =================
  updateBatchBar() {
    const bar = document.getElementById('vehicles-batch-bar');
    const countText = document.getElementById('batch-selected-count');
    const selectAllChk = document.getElementById('th-select-all-vehicles');

    if (!bar || !countText) return;

    const count = this.selectedVins.size;
    if (count > 0) {
      bar.style.display = 'inline-flex';
      countText.textContent = `${count} ${i18n.currentLang === 'zh-CN' ? '台车辆已选中' : 'motos selecionadas'}`;
    } else {
      bar.style.display = 'none';
    }

    if (selectAllChk) {
      selectAllChk.checked = count > 0 && count === this.cachedVehicles.length;
    }
  }

  // ================= YARD MAP 2D VISUAL LAYOUT =================
  renderYardMap() {
    const container = document.getElementById('yard-map-container');
    if (!container) return;

    const vehicles = this.cachedVehicles;

    const sectors = [
      {
        id: 'A',
        titlePt: 'SETOR A // PRONTAS P/ SAÍDA & EXPEDIÇÃO (FATURADAS)',
        titleCn: 'A区 // 待交付出库与开单发货区',
        badgeColor: 'var(--color-emerald)',
        filterFn: (v) => v.status === 'ready_to_ship' || v.status === 'delivered' || (v.yardBay && v.yardBay.startsWith('A'))
      },
      {
        id: 'B',
        titlePt: 'SETOR B // ESTOQUE REGULAR EM PÁTIO (ARMAZENAGEM GERAL)',
        titleCn: 'B区 // 常规整车库存区 (标准仓储)',
        badgeColor: 'var(--color-cyan)',
        filterFn: (v) => v.status === 'in_stock' || (v.yardBay && v.yardBay.startsWith('B'))
      },
      {
        id: 'C',
        titlePt: 'SETOR C // TRIAGEM & INSPEÇÃO TÉCNICA PDI',
        titleCn: 'C区 // PDI质检与新车初检待验区',
        badgeColor: 'var(--color-amber)',
        filterFn: (v) => v.status === 'pdi_inspection' || (v.yardBay && v.yardBay.startsWith('C'))
      },
      {
        id: 'D',
        titlePt: 'SETOR D // OFICINA TÉCNICA & ELEVADORES DE MANUTENÇÃO',
        titleCn: 'D区 // 售后技术维修工位 (含1号与2号举升机)',
        badgeColor: 'var(--color-crimson)',
        filterFn: (v) => v.status === 'in_service' || (v.yardBay && v.yardBay.startsWith('D'))
      }
    ];

    container.innerHTML = sectors.map(sec => {
      const secTitle = i18n.currentLang === 'zh-CN' ? sec.titleCn : sec.titlePt;
      const sectorVehicles = vehicles.filter(sec.filterFn);
      const totalBays = 10;
      const bayCards = [];

      for (let i = 1; i <= totalBays; i++) {
        const bayId = `${sec.id}-${String(i).padStart(2, '0')}`;
        const parkedVehicle = sectorVehicles[i - 1] || null;

        if (parkedVehicle) {
          const aging = WmsAlgorithms.calculatePatioAging(parkedVehicle.entryDate);
          bayCards.push(`
            <div class="yard-bay-card" data-action="passport" data-vin="${parkedVehicle.chassisVin}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="bay-id-badge" style="color: ${sec.badgeColor};">${bayId}</span>
                <span class="color-dot" style="background-color: ${parkedVehicle.colorHex || '#444'}; width: 10px; height: 10px;"></span>
              </div>
              <div>
                <div class="bay-model-name">${parkedVehicle.modelName || parkedVehicle.modelId}</div>
                <div class="bay-vin-text">${parkedVehicle.chassisVin}</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <span style="font-size: 10px; color: var(--text-dim);">${parkedVehicle.tireFront}</span>
                <span class="aging-badge aging-${aging.level}" style="font-size: 9px; padding: 1px 4px;">${aging.daysInPatio}d</span>
              </div>
            </div>
          `);
        } else {
          bayCards.push(`
            <div class="yard-bay-card bay-empty" data-bay-id="${bayId}">
              <div class="bay-id-badge">${bayId}</div>
              <div style="font-size: 11px; color: var(--text-dim); text-align: center; margin: auto 0;">
                + Baía Livre
              </div>
              <div style="font-size: 9px; color: var(--text-dim); text-align: right;">Vazio</div>
            </div>
          `);
        }
      }

      return `
        <div class="yard-sector-block">
          <div class="yard-sector-header">
            <span class="yard-sector-title" style="color: ${sec.badgeColor};">
              ■ ${secTitle}
            </span>
            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">
              ${sectorVehicles.length} / ${totalBays} ocupados
            </span>
          </div>
          <div class="yard-bays-grid">
            ${bayCards.join('')}
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to parked vehicles
    container.querySelectorAll('.yard-bay-card[data-vin]').forEach(card => {
      card.addEventListener('click', () => {
        const vin = card.getAttribute('data-vin');
        const v = this.cachedVehicles.find(item => item.chassisVin === vin);
        if (v) this.openVehiclePassportModal(v);
      });
    });

    // Attach click listeners to empty bays
    container.querySelectorAll('.yard-bay-card.bay-empty').forEach(card => {
      card.addEventListener('click', () => {
        const bayId = card.getAttribute('data-bay-id');
        this.openSingleVehicleModal(bayId);
      });
    });
  }

  // ================= SINGLE VEHICLE INFLOW =================
  openSingleVehicleModal(presetBay = 'B-01') {
    const modal = document.getElementById('modal-single-vehicle');
    const modelSelect = document.getElementById('sv-model-select');
    const colorSelect = document.getElementById('sv-color-select');
    const baySelect = document.getElementById('sv-bay-select');

    if (!modal) return;

    if (modelSelect) {
      modelSelect.innerHTML = this.cachedModels.map(m => {
        const name = i18n.currentLang === 'zh-CN' && m.nameCn ? m.nameCn : m.name;
        return `<option value="${m.id}">${name} (${m.code})</option>`;
      }).join('');

      modelSelect.onchange = () => {
        const selModel = this.cachedModels.find(m => m.id === modelSelect.value);
        if (selModel && colorSelect) {
          colorSelect.innerHTML = (selModel.colors || []).map(c => `
            <option value="${c.namePt}">${c.namePt} ${c.nameCn ? '(' + c.nameCn + ')' : ''}</option>
          `).join('');
          this.generateNextVinForSingleVehicle(selModel);
        }
      };

      if (this.cachedModels.length > 0) {
        modelSelect.value = this.cachedModels[0].id;
        modelSelect.onchange();
      }
    }

    if (baySelect && presetBay) {
      baySelect.value = presetBay;
    }

    modal.classList.add('active');
  }

  generateNextVinForSingleVehicle(model = null) {
    const modelSelect = document.getElementById('sv-model-select');
    const targetModel = model || this.cachedModels.find(m => m.id === modelSelect?.value) || this.cachedModels[0];
    if (!targetModel) return;

    const existing = this.cachedVehicles.filter(v => v.modelId === targetModel.id || (v.factoryCode && v.factoryCode === targetModel.code));
    const nextNum = existing.length + 1;
    const seqStr = String(nextNum).padStart(4, '0');
    const nextVin = `Z8-${targetModel.code}-2026-${seqStr}`;

    const vinInput = document.getElementById('sv-vin');
    if (vinInput) vinInput.value = nextVin;
  }

  async handleSaveSingleVehicle() {
    const modelId = document.getElementById('sv-model-select').value;
    const chassisVin = document.getElementById('sv-vin').value.trim();
    const color = document.getElementById('sv-color-select').value;
    const status = document.getElementById('sv-status-select').value;
    const engineSerial = document.getElementById('sv-engine-serial').value.trim();
    const batterySerial = document.getElementById('sv-battery-serial').value.trim();
    const docRef = document.getElementById('sv-doc').value.trim();
    const yardBay = document.getElementById('sv-bay-select').value;
    const notes = document.getElementById('sv-notes').value.trim();

    if (!chassisVin || !modelId) {
      alert('Por favor informe o Chassi VIN e selecione o modelo.');
      return;
    }

    const existing = this.cachedVehicles.find(v => v.chassisVin.toLowerCase() === chassisVin.toLowerCase());
    if (existing) {
      alert(`O Chassi VIN ${chassisVin} já está cadastrado no sistema.`);
      return;
    }

    const model = this.cachedModels.find(m => m.id === modelId);
    if (!model) return;

    const matchedColor = (model.colors || []).find(c => c.namePt === color);

    const newVehicle = {
      chassisVin,
      modelId: model.id,
      modelName: model.name,
      factoryCode: model.code,
      factoryBase: model.factoryBase,
      category: model.category,
      color: color || 'Padrão',
      colorHex: matchedColor ? matchedColor.hex : '#333333',
      tireFront: model.tireFront,
      tireRear: model.tireRear,
      tireType: model.tireType,
      motor: model.motor,
      battery: model.battery,
      engineSerial,
      batterySerial,
      wholesalePrice: model.wholesalePrice,
      retailPrice: model.retailPrice,
      status: status || 'pdi_inspection',
      entryDate: new Date().toISOString(),
      containerLot: docRef || 'AVULSO',
      yardBay,
      notes: notes || 'Entrada manual individual.',
      photos: [model.image || '/assets/models/z8_tank_studio.jpg'],
      repairsHistory: [],
      pdiHistory: []
    };

    await wmsDb.addVehicle(newVehicle);
    this.closeAllModals();
    await this.refreshAllData();
    alert(`Veículo ${newVehicle.modelName} (Chassi: ${chassisVin}) registrado com sucesso!`);
  }

  // ================= DISPATCH / OUTFLOW =================
  openDispatchModal(preselectedVin = '') {
    const modal = document.getElementById('modal-dispatch-vehicle');
    const selectChassis = document.getElementById('disp-chassis-select');
    const dateInput = document.getElementById('disp-date');

    if (!modal) return;

    if (selectChassis) {
      const availableVehicles = this.cachedVehicles.filter(v => v.status !== 'delivered');
      selectChassis.innerHTML = availableVehicles.map(v => `
        <option value="${v.chassisVin}" ${v.chassisVin === preselectedVin ? 'selected' : ''}>
          ${v.chassisVin} - ${v.modelName} [${v.color}] (${v.status})
        </option>
      `).join('');
    }

    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    modal.classList.add('active');
  }

  async handleConfirmDispatch() {
    const chassisVin = document.getElementById('disp-chassis-select').value;
    const dispatchType = document.getElementById('disp-type-select').value;
    const destination = document.getElementById('disp-destination').value.trim();
    const invoiceDoc = document.getElementById('disp-invoice').value.trim();
    const carrier = document.getElementById('disp-carrier').value.trim();
    const trackingCode = document.getElementById('disp-tracking').value.trim();
    const dispatchDate = document.getElementById('disp-date').value;
    const notes = document.getElementById('disp-notes').value.trim();

    if (!chassisVin || !destination || !invoiceDoc) {
      alert('Por favor informe o Chassi, o Destino e o número da Nota Fiscal.');
      return;
    }

    await wmsDb.dispatchVehicle({
      chassisVin,
      destination,
      dispatchType,
      invoiceDoc,
      carrier,
      trackingCode,
      dispatchDate: dispatchDate ? new Date(dispatchDate).toISOString() : new Date().toISOString(),
      notes,
      user: 'Diretoria Z8'
    });

    this.closeAllModals();
    await this.refreshAllData();
    alert(`Veículo ${chassisVin} faturado e despachado com sucesso para ${destination}!`);
  }

  // ================= ADD SPARE PART / TIRE =================
  openAddPartModal() {
    const modal = document.getElementById('modal-add-part');
    if (!modal) return;

    this.updateAddPartEoqPreview();
    modal.classList.add('active');
  }

  updateAddPartEoqPreview() {
    const demand = parseFloat(document.getElementById('ap-demand')?.value) || 120;
    const unitCost = parseFloat(document.getElementById('ap-unit-cost')?.value) || 150;
    const holdingCost = Math.max(15, unitCost * 0.15);
    const eoq = WmsAlgorithms.calculateEOQ(demand, 1500, holdingCost);

    const preview = document.getElementById('ap-eoq-preview');
    if (preview) {
      preview.textContent = `${eoq} pcs`;
    }
  }

  async handleSaveNewPart() {
    const partNumber = document.getElementById('ap-part-number').value.trim();
    const category = document.getElementById('ap-category').value;
    const namePt = document.getElementById('ap-name-pt').value.trim();
    const nameCn = document.getElementById('ap-name-cn').value.trim();
    const tireDimensions = document.getElementById('ap-tire-dim').value.trim();
    const compatibleRaw = document.getElementById('ap-compatible').value.trim();
    const stock = parseInt(document.getElementById('ap-stock').value, 10) || 0;
    const minStock = parseInt(document.getElementById('ap-min-stock').value, 10) || 10;
    const demand = parseInt(document.getElementById('ap-demand').value, 10) || 120;
    const unitCost = parseFloat(document.getElementById('ap-unit-cost').value) || 100;

    if (!partNumber || !namePt) {
      alert('Por favor informe o Código da Peça e o Nome em Português.');
      return;
    }

    const holdingCost = Math.max(15, unitCost * 0.15);
    const eoq = WmsAlgorithms.calculateEOQ(demand, 1500, holdingCost);
    const compatibleModels = compatibleRaw.split(',').map(s => s.trim()).filter(Boolean);

    const partData = {
      partNumber,
      category,
      categoryCn: category === 'tires' ? '轮胎' : '原厂备件',
      namePt,
      nameCn: nameCn || namePt,
      tireDimensions: tireDimensions || '',
      compatibleModels: compatibleModels.length > 0 ? compatibleModels : ['Todos os Modelos'],
      currentStock: stock,
      minStock,
      annualDemand: demand,
      eoq,
      unitCost,
      unitPrice: Math.round(unitCost * 1.8)
    };

    await wmsDb.addPart(partData);
    this.closeAllModals();
    await this.refreshAllData();
    alert(`Peça/Pneu ${namePt} [${partNumber}] cadastrado com sucesso!`);
  }

  // ================= PDI CHECKLIST MODAL =================
  openPdiChecklistModal(vehicle) {
    this.activeVehicleForPdi = vehicle;
    const modal = document.getElementById('modal-pdi-checklist');
    const modalBody = document.getElementById('pdi-modal-body');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="pdi-layout-grid">
        <div class="pdi-vehicle-header">
          <div>
            <span style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">CHASSI / VIN</span>
            <strong style="color: var(--color-cyan); font-family: var(--font-mono); font-size: 13px; display: block;">${vehicle.chassisVin}</strong>
          </div>
          <div>
            <span style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">MODELO & PN</span>
            <strong style="display: block;">${vehicle.modelName} [${vehicle.factoryCode}]</strong>
          </div>
          <div>
            <span style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">PNEUS HOMOLOGADOS</span>
            <strong style="display: block;">${vehicle.tireFront} / ${vehicle.tireRear}</strong>
          </div>
          <div>
            <span style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">BATERIA & MOTOR</span>
            <strong style="display: block;">${vehicle.battery} // ${vehicle.motor}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <span style="font-size: 12px; color: var(--text-muted);">
            Selecione os 24 itens verificados fisicamente na rampa/elevador:
          </span>
          <button type="button" class="btn-bauhaus btn-secondary btn-sm" id="pdi-check-all-btn">
            ✓ Marcar Todos Conformes
          </button>
        </div>

        ${PDI_CHECKLIST_TEMPLATE.map(cluster => `
          <div class="pdi-cluster-card">
            <div class="pdi-cluster-title">
              ${i18n.currentLang === 'zh-CN' ? cluster.clusterCn : cluster.clusterPt}
            </div>
            <div class="pdi-items-list">
              ${cluster.items.map(item => `
                <label class="pdi-item-row" for="${item.id}">
                  <input type="checkbox" id="${item.id}" class="pdi-checkbox" checked>
                  <span>${i18n.currentLang === 'zh-CN' ? item.cn : item.pt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div class="form-grid">
          <div class="form-group">
            <label data-i18n="lblPdiTech">Técnico Responsável pelo PDI:</label>
            <input type="text" class="form-input" id="pdi-tech-name" required value="Roberto Mecânico Chefe">
          </div>
          <div class="form-group">
            <label>Posição no Pátio após Liberação:</label>
            <select class="form-select" id="pdi-target-bay">
              <option value="A-01">Setor A - Baía A-01 (Pronta p/ Expedição)</option>
              <option value="A-02">Setor A - Baía A-02 (Pronta p/ Expedição)</option>
              <option value="B-01">Setor B - Baía B-01 (Estoque Geral)</option>
            </select>
          </div>
          <div class="form-group form-group-full">
            <label data-i18n="lblPdiNotes">Laudo Técnico / Observações da Entrega Técnica:</label>
            <textarea class="form-textarea" id="pdi-notes" placeholder="Pressão dos pneus aferida a frio, faróis alinhados, chaveiro e manual anexados..."></textarea>
          </div>
        </div>
      </div>
    `;

    document.getElementById('pdi-check-all-btn').onclick = () => {
      modalBody.querySelectorAll('.pdi-checkbox').forEach(chk => chk.checked = true);
    };

    modal.classList.add('active');
  }

  async handleApprovePdi() {
    if (!this.activeVehicleForPdi) return;

    const modalBody = document.getElementById('pdi-modal-body');
    const checkboxes = modalBody.querySelectorAll('.pdi-checkbox');
    const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
    const totalCount = checkboxes.length;

    const techName = document.getElementById('pdi-tech-name').value.trim();
    const notes = document.getElementById('pdi-notes').value.trim();
    const targetBay = document.getElementById('pdi-target-bay').value;

    await wmsDb.savePdiInspection({
      chassisVin: this.activeVehicleForPdi.chassisVin,
      passedItems: checkedCount,
      totalItems: totalCount,
      status: 'approved',
      technician: techName,
      notes: notes || 'PDI 100% aprovado conforme Resolução CONTRAN 996.'
    });

    if (targetBay) {
      await wmsDb.updateVehicle(this.activeVehicleForPdi.chassisVin, { yardBay: targetBay });
    }

    this.closeAllModals();
    await this.refreshAllData();
    alert(`PDI do Chassi ${this.activeVehicleForPdi.chassisVin} APROVADO com sucesso (${checkedCount}/${totalCount} itens conformes)! Veículo liberado para pátio.`);
  }

  async handleFailPdi() {
    if (!this.activeVehicleForPdi) return;

    const modalBody = document.getElementById('pdi-modal-body');
    const checkboxes = modalBody.querySelectorAll('.pdi-checkbox');
    const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
    const totalCount = checkboxes.length;

    const techName = document.getElementById('pdi-tech-name').value.trim();
    const notes = document.getElementById('pdi-notes').value.trim() || 'Avarias detectadas no checklist de PDI.';

    await wmsDb.savePdiInspection({
      chassisVin: this.activeVehicleForPdi.chassisVin,
      passedItems: checkedCount,
      totalItems: totalCount,
      status: 'failed',
      technician: techName,
      notes: `REPROVADO (${checkedCount}/${totalCount} conformes). ${notes}`
    });

    const vin = this.activeVehicleForPdi.chassisVin;
    this.closeAllModals();
    await this.refreshAllData();
    this.openCreateOsModal(vin);
  }

  // ================= BATCH THERMAL LABELS PRINT =================
  openBatchLabelsModal() {
    if (this.selectedVins.size === 0) {
      alert('Nenhum veículo selecionado. Marque as caixas de seleção na tabela primeiro.');
      return;
    }

    const modal = document.getElementById('modal-batch-labels');
    const mount = document.getElementById('batch-thermal-preview-mount');
    const countText = document.getElementById('batch-labels-count-text');
    const sizeSelect = document.getElementById('batch-thermal-size-select');

    if (!modal || !mount) return;

    this.selectedVehiclesForBatchLabels = this.cachedVehicles.filter(v => this.selectedVins.has(v.chassisVin));
    this.batchLabelSize = sizeSelect?.value || '100x50';

    countText.textContent = `${this.selectedVehiclesForBatchLabels.length} ${i18n.currentLang === 'zh-CN' ? '张标签已就绪' : 'etiquetas prontas'}`;

    mount.innerHTML = ThermalLabelEngine.generateBatchHtml(this.selectedVehiclesForBatchLabels, this.batchLabelSize);
    ThermalLabelEngine.renderBatchCodes(this.selectedVehiclesForBatchLabels, this.batchLabelSize);

    if (sizeSelect) {
      sizeSelect.onchange = () => {
        this.batchLabelSize = sizeSelect.value;
        mount.innerHTML = ThermalLabelEngine.generateBatchHtml(this.selectedVehiclesForBatchLabels, this.batchLabelSize);
        ThermalLabelEngine.renderBatchCodes(this.selectedVehiclesForBatchLabels, this.batchLabelSize);
      };
    }

    modal.classList.add('active');
  }

  // ================= BATCH DISPATCH & ACTIONS =================
  async handleBatchDispatch() {
    if (this.selectedVins.size === 0) return;
    const dest = prompt('Informe a Concessionária ou Destino do Lote:', 'Z8 Vale do Paraíba (Taubaté - SP)');
    if (!dest) return;
    const invoice = prompt('Informe a Nota Fiscal / Pedido do Lote:', `NF-e LOTE-${Date.now().toString().slice(-4)}`);
    if (!invoice) return;

    for (const vin of this.selectedVins) {
      await wmsDb.dispatchVehicle({
        chassisVin: vin,
        destination: dest,
        dispatchType: 'outflow_franchise',
        invoiceDoc: invoice,
        carrier: 'Transporte Oficial Z8',
        trackingCode: `LOTE-${Date.now()}`,
        dispatchDate: new Date().toISOString(),
        notes: `Despacho em lote de ${this.selectedVins.size} motos.`,
        user: 'Diretoria Z8'
      });
    }

    this.selectedVins.clear();
    this.updateBatchBar();
    await this.refreshAllData();
    alert(`Lote despachado com sucesso para ${dest}!`);
  }

  async handleBatchPdi() {
    if (this.selectedVins.size === 0) return;
    if (confirm(`Deseja mover as ${this.selectedVins.size} motos selecionadas para Inspeção PDI?`)) {
      await wmsDb.batchUpdateStatus(Array.from(this.selectedVins), 'pdi_inspection');
      this.selectedVins.clear();
      this.updateBatchBar();
      await this.refreshAllData();
    }
  }

  async handleBatchCsv() {
    if (this.selectedVins.size === 0) return;
    const selectedVehicles = this.cachedVehicles.filter(v => this.selectedVins.has(v.chassisVin));
    const headers = ['Chassi VIN', 'Modelo', 'Codigo Fabrica', 'Cor', 'Pneus', 'Motor', 'Bateria', 'Data Entrada', 'Status'];
    const rows = selectedVehicles.map(v => [
      `"${v.chassisVin}"`,
      `"${v.modelName || v.modelId}"`,
      `"${v.factoryCode || ''}"`,
      `"${v.color || ''}"`,
      `"${v.tireFront || ''} / ${v.tireRear || ''}"`,
      `"${v.motor || ''}"`,
      `"${v.battery || ''}"`,
      `"${v.entryDate ? new Date(v.entryDate).toLocaleDateString('pt-BR') : ''}"`,
      `"${v.status || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");
    this.downloadCsvFile(csvContent, `Z8_WMS_LOTE_SELECIONADO_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  // ================= CSV EXPORT =================
  async handleExportCsv(tableType = 'vehicles') {
    const csvContent = await wmsDb.exportToCsv(tableType);
    this.downloadCsvFile(csvContent, `Z8_WMS_RELATORIO_${tableType.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  downloadCsvFile(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }


  // ================= 20. ELEVADORES DA OFICINA (TWIN-BAY LIFTS) =================
  renderElevatorsCockpit() {
    const container = document.getElementById('elevators-container');
    if (!container || !this.cachedElevators) return;

    const isZh = i18n.currentLang === 'zh-CN';
    const bays = [this.cachedElevators.bay1, this.cachedElevators.bay2];

    container.innerHTML = bays.map(bay => {
      const isOccupied = bay.status === 'occupied';
      const statusClass = isOccupied ? 'occupied' : 'available';
      const statusText = isOccupied ? i18n.t('elevatorStatusOccupied') : i18n.t('elevatorStatusAvailable');
      const bayName = isZh
        ? (bay.id === 'bay1' ? i18n.t('elevatorBay1') : i18n.t('elevatorBay2'))
        : (bay.id === 'bay1' ? 'Elevador 01 (Bay A - Primário)' : 'Elevador 02 (Bay B - Secundário)');

      let durationText = '-';
      if (bay.startedAt) {
        const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(bay.startedAt).getTime()) / (1000 * 60)));
        durationText = isZh ? `${diffMinutes} 分钟` : `${diffMinutes} min`;
      }

      let vehicleImg = 'assets/models/z8_tank_studio.jpg';
      if (isOccupied && bay.chassisVin) {
        const found = this.cachedVehicles.find(v => v.chassisVin === bay.chassisVin);
        if (found && found.photos && found.photos.length > 0) {
          vehicleImg = found.photos[0];
        }
      }

      return `
        <div class="elevator-card ${statusClass}" id="elevator-card-${bay.id}">
          <div class="elevator-head">
            <div class="elevator-name">
              <span>🏗️</span>
              <span>${bayName}</span>
            </div>
            <span class="elevator-status-tag ${statusClass}">${statusText}</span>
          </div>

          ${isOccupied ? `
            <div class="elevator-vehicle-row">
              <img src="${vehicleImg}" alt="${bay.modelName || 'Moto'}" class="elevator-vehicle-thumb" onerror="this.src='assets/logos/logo_z8_main.png'">
              <div class="elevator-vehicle-meta">
                <span class="elevator-vin">${bay.chassisVin}</span>
                <span class="elevator-model">${bay.modelName || 'Z8 E-Motion'}</span>
              </div>
            </div>

            <div class="elevator-details-grid">
              <div class="elevator-d-item">
                <span class="elevator-d-k">${i18n.t('elevatorDuration')}</span>
                <span class="elevator-d-v" style="color: var(--color-cyan);">${durationText}</span>
              </div>
              <div class="elevator-d-item">
                <span class="elevator-d-k">${i18n.t('elevatorMechanic')}</span>
                <span class="elevator-d-v">${bay.mechanicName || 'Roberto Mecânico'}</span>
              </div>
              <div class="elevator-d-item" style="grid-column: span 2;">
                <span class="elevator-d-k">${i18n.t('elevatorOperation')}</span>
                <span class="elevator-d-v" style="color: var(--color-emerald);">${bay.operation || 'Revisão Técnica'}</span>
              </div>
            </div>

            <div class="elevator-actions">
              <button class="btn-bauhaus btn-amber btn-sm" data-release-elevator="${bay.id}" style="width: 100%;">
                ${i18n.t('btnReleaseElevator')}
              </button>
            </div>
          ` : `
            <div class="elevator-empty-state">
              <span style="font-size: 26px;">🟢</span>
              <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700;">ELEVADOR LIVRE // AGUARDANDO MOTOCICLETA</span>
              <span style="font-size: 10px; color: var(--text-dim);">Pronto para receber entrada de PDI ou reparo elétrico 72V</span>
            </div>

            <div class="elevator-actions">
              <button class="btn-bauhaus btn-emerald btn-sm" data-allocate-elevator="${bay.id}" style="width: 100%;">
                ${i18n.t('btnAllocateElevator')}
              </button>
            </div>
          `}
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-release-elevator]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bayId = btn.getAttribute('data-release-elevator');
        await this.handleReleaseElevator(bayId);
      });
    });

    container.querySelectorAll('[data-allocate-elevator]').forEach(btn => {
      btn.addEventListener('click', () => {
        const bayId = btn.getAttribute('data-allocate-elevator');
        this.openAllocateElevatorModal(bayId);
      });
    });
  }

  openAllocateElevatorModal(bayId = 'bay1') {
    const modal = document.getElementById('modal-allocate-elevator');
    const selectBay = document.getElementById('alloc-elevator-select');
    const selectVeh = document.getElementById('alloc-vehicle-select');
    if (!modal || !selectBay || !selectVeh) return;

    selectBay.value = bayId;

    // Filter available vehicles in yard
    const availableVehicles = this.cachedVehicles.filter(v => v.status !== 'delivered');
    selectVeh.innerHTML = availableVehicles.map(v => `
      <option value="${v.chassisVin}">${v.chassisVin} // ${v.modelName || v.modelId} (Status: ${v.status})</option>
    `).join('');

    modal.classList.add('active');
  }

  async handleConfirmElevatorAllocation() {
    const bayId = document.getElementById('alloc-elevator-select').value;
    const chassisVin = document.getElementById('alloc-vehicle-select').value;
    const mechanicName = document.getElementById('alloc-tech-name').value.trim() || 'Roberto Mecânico Chefe';
    const operation = document.getElementById('alloc-operation-type').value;

    const vehicle = this.cachedVehicles.find(v => v.chassisVin === chassisVin);
    const modelName = vehicle ? (vehicle.modelName || vehicle.modelId) : 'Z8 E-Motion';

    await wmsDb.allocateElevator(bayId, {
      chassisVin,
      modelName,
      mechanicName,
      operation
    });

    this.closeAllModals();
    await this.refreshAllData();
    alert(`Motocicleta ${chassisVin} subida no ${bayId === 'bay1' ? 'Elevador 01' : 'Elevador 02'} com sucesso!`);
  }

  async handleReleaseElevator(bayId) {
    if (confirm(i18n.currentLang === 'zh-CN' ? '确认工单已完工并降下举升机？' : 'Deseja realmente descer a moto e liberar o elevador?')) {
      await wmsDb.releaseElevator(bayId);
      await this.refreshAllData();
    }
  }

  // ================= 21. ROMANEIO DE DESEMBARAÇO ADUANEIRO (CUSTOMS MANIFEST) =================
  openCustomsManifestModal() {
    const modal = document.getElementById('modal-customs-manifest');
    const select = document.getElementById('customs-container-select');
    if (!modal || !select) return;

    const containers = new Set();
    this.cachedMovements.forEach(m => {
      if (m.refDoc && (m.refDoc.includes('CN-') || m.refDoc.includes('40HQ'))) {
        containers.add(m.refDoc);
      }
    });
    if (containers.size === 0) {
      containers.add('CN-40HQ-2026-089');
      containers.add('CN-40HQ-2026-090');
      containers.add('CN-40HQ-2026-091');
    }

    select.innerHTML = Array.from(containers).map(c => `
      <option value="${c}">${c} (Porto de Santos)</option>
    `).join('');

    this.renderCustomsManifestTable();
    modal.classList.add('active');
  }

  renderCustomsManifestTable() {
    const select = document.getElementById('customs-container-select');
    const tbody = document.getElementById('customs-chassis-tbody');
    const containerNo = select ? select.value : 'CN-40HQ-2026-089';

    const containerNoEl = document.getElementById('cm-container-no');
    const invoiceNoEl = document.getElementById('cm-invoice-no');
    if (containerNoEl) containerNoEl.textContent = containerNo;
    if (invoiceNoEl) invoiceNoEl.textContent = `Z8-EXP-2026-${containerNo.replace(/[^0-9]/g, '').slice(-3) || '089'}`;

    let lotVehicles = this.cachedVehicles.filter(v => v.notes && v.notes.includes(containerNo));
    if (lotVehicles.length === 0) {
      lotVehicles = this.cachedVehicles.slice(0, 10);
    }

    const qty = lotVehicles.length || 10;
    const grossWeight = (qty * 120).toLocaleString('pt-BR');
    const netWeight = (qty * 105).toLocaleString('pt-BR');
    const volume = ((qty / 85) * 68.0).toFixed(1);

    const weightsEl = document.getElementById('cm-weights');
    const volumeEl = document.getElementById('cm-volume');
    const lotQtyEl = document.getElementById('cm-lot-qty');

    if (weightsEl) weightsEl.textContent = `${grossWeight} kg / ${netWeight} kg`;
    if (volumeEl) volumeEl.textContent = `${volume} CBM (40HQ Standard)`;
    if (lotQtyEl) lotQtyEl.textContent = `${qty} Unidades em Gaiolas de Aço`;

    if (tbody) {
      tbody.innerHTML = lotVehicles.map((v, idx) => `
        <tr>
          <td><strong>#${String(idx + 1).padStart(2, '0')}</strong></td>
          <td style="font-family: var(--font-mono); color: var(--color-cyan); font-weight: 700;">${v.chassisVin}</td>
          <td><strong>${v.modelName || v.modelId}</strong></td>
          <td><span class="badge-code">${v.factoryCode || 'DB018'}</span></td>
          <td>${v.color || 'Padrão'}</td>
          <td style="font-family: var(--font-mono); font-size: 10px;">${v.motor || '2000W 15G'}</td>
          <td style="font-family: var(--font-mono); font-size: 10px;">${v.battery || '60V/72V Lítio'}</td>
          <td style="font-size: 10px; color: var(--text-muted);">${v.tireFront || '110/70-12'} / ${v.tireRear || '110/70-12'}</td>
        </tr>
      `).join('');
    }
  }

  handlePrintCustomsManifest() {
    window.print();
  }
}

// Instantiate and initialize
const app = new Z8WmsApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
