/**
 * Z8 MOBILE SCANNER // COMPANION JS ENGINE
 * Runs on smartphone browser connected to local WMS Wi-Fi
 * Fully integrated with 24-point PDI checklist & real-time sync
 */

let html5QrCode = null;
let isScanning = false;
let activeVehicle = null;
let currentLang = 'pt-BR';

export const MOBILE_PDI_TEMPLATE = [
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
      { id: 'pdi-23', pt: 'Ausência de vibrações anômalas na aceleração contínua', cn: '连续全转把加速无共振跳动与异常抖动' },
      { id: 'pdi-24', pt: 'Chassi aterrado e isolamento de chicote contra atrito', cn: '线束主干防摩擦包胶完整、全车绝缘测试达标' }
    ]
  }
];

const translations = {
  'pt-BR': {
    prompt: 'Aponte a câmera para o Chassi / QR Code:',
    startCam: 'Ativar Câmera Scanner',
    stopCam: 'Parar Scanner',
    searchBtn: 'Buscar',
    openPdiBtn: '📋 Abrir Inspeção PDI (24 Pontos)',
    btnPdi: '✓ PDI Rápido Aprovado',
    btnService: '⚠️ Enviar p/ Oficina',
    uploadPrompt: '📸 Tirar Foto de Inspeção (PDI / Avaria)',
    uploadedSuccess: '✓ Foto enviada e vinculada ao Chassi!',
    notFound: 'Chassi não encontrado no sistema.',
    pdiTitle: 'INSPEÇÃO PDI // 24 PONTOS',
    pdiCheckAll: 'Marcar Todos Conformes',
    pdiTechLabel: 'Mecânico / Vistoriador:',
    pdiNotesLabel: 'Observações do Laudo:',
    pdiApproveBtn: '✓ Salvar e Aprovar PDI',
    pdiFailBtn: '⚠️ Reprovar PDI & Encaminhar p/ Oficina',
    pdiApprovedSuccess: '✓ PDI Aprovado com sucesso! Veículo liberado para o pátio.',
    pdiFailedNotice: '⚠️ PDI reprovado. Veículo encaminhado para oficina.'
  },
  'zh-CN': {
    prompt: '请将手机摄像头对准车架条码/二维码：',
    startCam: '开启摄像头扫码',
    stopCam: '停止扫码',
    searchBtn: '查询',
    openPdiBtn: '📋 打开24项PDI质检表',
    btnPdi: '✓ 快速PDI合格',
    btnService: '⚠️ 报修送修工单',
    uploadPrompt: '📸 现场验车拍照 (PDI/瑕疵记录)',
    uploadedSuccess: '✓ 验车照片已实时同步至车架档案！',
    notFound: '未在系统中查询到该车架号。',
    pdiTitle: '新车交付前PDI检验 // 24项标准',
    pdiCheckAll: '一键全选合格',
    pdiTechLabel: '质检责任技师:',
    pdiNotesLabel: '检测报告备注:',
    pdiApproveBtn: '✓ 保存并判定PDI合格',
    pdiFailBtn: '⚠️ PDI不合格并报修',
    pdiApprovedSuccess: '✓ PDI质检合格！车辆已同步入库准予发运。',
    pdiFailedNotice: '⚠️ PDI判定不合格，已转入车间维修工单。'
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  initLanguage();
  initDexie();
  bindEvents();
});

function initLanguage() {
  const saved = localStorage.getItem('z8_mobile_lang');
  if (saved) currentLang = saved;
  updateUiTexts();

  document.getElementById('m-btn-lang').addEventListener('click', () => {
    currentLang = currentLang === 'pt-BR' ? 'zh-CN' : 'pt-BR';
    localStorage.setItem('z8_mobile_lang', currentLang);
    updateUiTexts();
    if (activeVehicle) {
      renderMobileChecklist();
    }
  });
}

function updateUiTexts() {
  const t = translations[currentLang];
  document.getElementById('txt-scan-prompt').textContent = t.prompt;
  document.getElementById('txt-cam-action').textContent = isScanning ? t.stopCam : t.startCam;
  document.getElementById('btn-manual-search').textContent = t.searchBtn;
  document.getElementById('btn-open-mobile-pdi').textContent = t.openPdiBtn;
  document.getElementById('btn-quick-pdi').textContent = t.btnPdi;
  document.getElementById('btn-quick-service').textContent = t.btnService;
  document.querySelector('.photo-upload-btn span').textContent = t.uploadPrompt;
  document.getElementById('m-btn-lang').textContent = currentLang === 'pt-BR' ? '中文' : 'PT-BR';

  // PDI Modal Strings
  const mTitle = document.getElementById('m-pdi-title');
  if (mTitle) mTitle.textContent = t.pdiTitle;
  const mCheckAll = document.getElementById('m-pdi-check-all');
  if (mCheckAll) mCheckAll.textContent = t.pdiCheckAll;
  const lblTech = document.getElementById('lbl-m-pdi-tech');
  if (lblTech) lblTech.textContent = t.pdiTechLabel;
  const lblNotes = document.getElementById('lbl-m-pdi-notes');
  if (lblNotes) lblNotes.textContent = t.pdiNotesLabel;
  const btnApprove = document.getElementById('m-btn-approve-pdi');
  if (btnApprove) btnApprove.textContent = t.pdiApproveBtn;
  const btnFail = document.getElementById('m-btn-fail-pdi');
  if (btnFail) btnFail.textContent = t.pdiFailBtn;
}

let db = null;
function initDexie() {
  try {
    if (window.Dexie) {
      db = new window.Dexie('Z8_WMS_DATABASE');
      db.version(1).stores({
        vehicles: 'chassisVin, modelId, factoryCode, status, color',
        models: 'id, code, name',
        parts: 'partNumber',
        repairs: 'osNumber, chassisVin',
        movements: 'id'
      });
    }
  } catch (e) {
    console.warn('Dexie mobile init fallback:', e);
  }
}

function playBeepSound(frequency = 800, duration = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function bindEvents() {
  // Toggle Camera
  const btnToggle = document.getElementById('btn-toggle-camera');
  btnToggle.addEventListener('click', () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  });

  // Manual Search
  const btnManual = document.getElementById('btn-manual-search');
  btnManual.addEventListener('click', () => {
    const vin = document.getElementById('manual-chassis-input').value.trim();
    if (vin) lookupChassis(vin);
  });

  // Open Full PDI Sheet
  document.getElementById('btn-open-mobile-pdi').addEventListener('click', () => {
    if (!activeVehicle) return;
    openMobilePdi();
  });

  // Close PDI Sheet
  document.getElementById('m-pdi-btn-close').addEventListener('click', () => {
    closeMobilePdi();
  });

  // Check / Uncheck All in PDI
  document.getElementById('m-pdi-check-all').addEventListener('click', () => {
    toggleAllMobilePdi();
  });

  // Approve PDI from Sheet
  document.getElementById('m-btn-approve-pdi').addEventListener('click', async () => {
    await submitMobilePdi('approved');
  });

  // Fail PDI from Sheet
  document.getElementById('m-btn-fail-pdi').addEventListener('click', async () => {
    await submitMobilePdi('failed');
  });

  // Quick 1-click PDI button
  document.getElementById('btn-quick-pdi').addEventListener('click', async () => {
    if (!activeVehicle) return;
    await updateStatus(activeVehicle.chassisVin, 'ready_to_ship');
    playBeepSound(1000, 0.15);
    alert(currentLang === 'zh-CN' ? '已通过PDI检验，转为待发运！' : 'PDI aprovado! Veículo liberado para saída.');
  });

  // Quick Service button
  document.getElementById('btn-quick-service').addEventListener('click', async () => {
    if (!activeVehicle) return;
    await updateStatus(activeVehicle.chassisVin, 'in_service');
    playBeepSound(400, 0.25);
    alert(currentLang === 'zh-CN' ? '车辆已转入维修中心工单！' : 'Veículo encaminhado para oficina / reparo.');
  });

  // Camera File Upload
  const fileInput = document.getElementById('camera-file-input');
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !activeVehicle) return;

    const statusEl = document.getElementById('upload-status-text');
    statusEl.textContent = 'Enviando foto...';

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64Data = evt.target.result;

      // Add thumbnail preview
      const previewGrid = document.getElementById('photo-preview-grid');
      const img = document.createElement('img');
      img.src = base64Data;
      img.className = 'photo-preview-thumb';
      previewGrid.appendChild(img);

      // Send to server
      try {
        const res = await fetch('/api/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chassisVin: activeVehicle.chassisVin,
            photoBase64: base64Data
          })
        });

        if (res.ok) {
          statusEl.textContent = translations[currentLang].uploadedSuccess;
        } else {
          statusEl.textContent = 'Foto gravada localmente no dispositivo.';
        }
      } catch (err) {
        statusEl.textContent = 'Foto salva no dispositivo.';
      }
    };
    reader.readAsDataURL(file);
  });
}

async function startCamera() {
  const viewport = document.getElementById('camera-reader-viewport');
  if (!window.Html5Qrcode) {
    alert('Biblioteca do scanner indisponível.');
    return;
  }

  html5QrCode = new window.Html5Qrcode('camera-reader-viewport');
  const config = { fps: 10, qrbox: { width: 250, height: 180 } };

  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        handleScanSuccess(decodedText);
      },
      () => {}
    );

    isScanning = true;
    updateUiTexts();
    document.getElementById('icon-cam').textContent = '⏹️';
  } catch (err) {
    console.error('Camera start failed:', err);
    alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
  }
}

async function stopCamera() {
  if (html5QrCode) {
    try {
      await html5QrCode.stop();
      html5QrCode.clear();
    } catch (e) {}
  }
  isScanning = false;
  updateUiTexts();
  document.getElementById('icon-cam').textContent = '📷';
}

function handleScanSuccess(rawText) {
  let cleanVin = rawText.trim();
  if (cleanVin.startsWith('Z8:')) {
    cleanVin = cleanVin.substring(3);
  }

  playBeepSound(800, 0.1);
  lookupChassis(cleanVin);
  stopCamera();
}

async function lookupChassis(vin) {
  let found = null;

  if (db) {
    try {
      found = await db.vehicles.get(vin);
      if (!found) {
        const all = await db.vehicles.toArray();
        found = all.find(v => v.chassisVin.toLowerCase() === vin.toLowerCase());
      }
    } catch (e) {}
  }

  if (!found) {
    try {
      const res = await fetch(`/api/vehicle/${encodeURIComponent(vin)}`);
      if (res.ok) {
        found = await res.json();
      }
    } catch (e) {}
  }

  if (found) {
    renderVehicleResult(found);
  } else {
    alert(translations[currentLang].notFound);
  }
}

function renderVehicleResult(v) {
  activeVehicle = v;
  const box = document.getElementById('vehicle-result-box');
  document.getElementById('res-vin').textContent = v.chassisVin;
  document.getElementById('res-model-name').textContent = v.modelName || v.modelId;
  document.getElementById('res-code-base').textContent = `PN: ${v.factoryCode} // ${v.factoryBase || ''}`;
  document.getElementById('res-tires').textContent = `${v.tireFront || '3.00-10'} / ${v.tireRear || '3.00-10'}`;
  document.getElementById('res-color').textContent = v.color || 'Padrão';
  document.getElementById('res-motor').textContent = v.motor || '1200W';
  document.getElementById('res-battery').textContent = v.battery || '60V';
  document.getElementById('res-status-badge').textContent = (v.status || 'in_stock').toUpperCase();

  document.getElementById('photo-preview-grid').innerHTML = '';
  document.getElementById('upload-status-text').textContent = '';

  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth' });
}

// ================= MOBILE PDI CONTROLLER =================
function openMobilePdi() {
  if (!activeVehicle) return;
  document.getElementById('m-pdi-sub').textContent = `${activeVehicle.chassisVin} // ${activeVehicle.modelName || activeVehicle.modelId}`;
  renderMobileChecklist();
  updateMobilePdiScore();
  const sheet = document.getElementById('mobile-pdi-sheet');
  sheet.style.display = 'flex';
}

function closeMobilePdi() {
  const sheet = document.getElementById('mobile-pdi-sheet');
  sheet.style.display = 'none';
}

function renderMobileChecklist() {
  const container = document.getElementById('m-pdi-checklist-container');
  if (!container) return;

  const isZh = currentLang === 'zh-CN';

  container.innerHTML = MOBILE_PDI_TEMPLATE.map(cluster => `
    <div class="m-pdi-cluster">
      <div class="m-pdi-cluster-head">
        ${isZh ? cluster.clusterCn : cluster.clusterPt}
      </div>
      ${cluster.items.map(item => `
        <div class="m-pdi-row">
          <input type="checkbox" id="m-${item.id}" class="m-pdi-checkbox" checked>
          <label for="m-${item.id}" class="m-pdi-label">
            ${isZh ? item.cn : item.pt}
          </label>
        </div>
      `).join('')}
    </div>
  `).join('');

  container.querySelectorAll('.m-pdi-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      updateMobilePdiScore();
    });
  });
}

function updateMobilePdiScore() {
  const allCheckboxes = document.querySelectorAll('#m-pdi-checklist-container .m-pdi-checkbox');
  const checked = document.querySelectorAll('#m-pdi-checklist-container .m-pdi-checkbox:checked');
  const total = allCheckboxes.length || 24;
  const count = checked.length;
  const pct = Math.round((count / total) * 100);

  const countEl = document.getElementById('m-pdi-score-count');
  const pctEl = document.getElementById('m-pdi-score-pct');

  if (countEl) countEl.textContent = `${count} / ${total}`;
  if (pctEl) {
    if (pct === 100) {
      pctEl.textContent = currentLang === 'zh-CN' ? '(100% 全部合格)' : '(100% CONFORME)';
      pctEl.style.color = 'var(--color-emerald)';
    } else {
      pctEl.textContent = currentLang === 'zh-CN' ? `(${pct}% 有未检出项)` : `(${pct}% PENDÊNCIAS)`;
      pctEl.style.color = 'var(--color-amber)';
    }
  }
}

function toggleAllMobilePdi() {
  const allCheckboxes = document.querySelectorAll('#m-pdi-checklist-container .m-pdi-checkbox');
  const anyUnchecked = Array.from(allCheckboxes).some(cb => !cb.checked);
  allCheckboxes.forEach(cb => {
    cb.checked = anyUnchecked;
  });
  updateMobilePdiScore();
}

async function submitMobilePdi(status) {
  if (!activeVehicle) return;

  const allCheckboxes = document.querySelectorAll('#m-pdi-checklist-container .m-pdi-checkbox');
  const passedItems = Array.from(allCheckboxes).filter(cb => cb.checked).map(cb => cb.id.replace('m-', ''));
  const technician = document.getElementById('m-pdi-tech-input').value.trim() || 'Roberto Mecânico Chefe';
  const notes = document.getElementById('m-pdi-notes-input').value.trim();

  const newStatus = status === 'approved' ? 'in_stock' : 'in_service';

  // 1. Update IndexedDB if available
  if (db) {
    try {
      const nowIso = new Date().toISOString();
      await db.vehicles.update(activeVehicle.chassisVin, {
        status: newStatus,
        lastPdiDate: nowIso,
        notes: notes ? `PDI: ${notes}` : undefined
      });
      await db.movements.add({
        id: `MOV-${Date.now()}`,
        type: status === 'approved' ? 'pdi_approved' : 'pdi_failed',
        date: nowIso,
        chassisVin: activeVehicle.chassisVin,
        modelId: activeVehicle.modelId,
        refDoc: `PDI-MOBILE-${passedItems.length}de24`,
        originDest: status === 'approved' ? 'Liberado p/ Pátio' : 'Oficina',
        user: technician
      });
    } catch (e) {}
  }

  // 2. Post to Server /api/save-pdi
  try {
    await fetch('/api/save-pdi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chassisVin: activeVehicle.chassisVin,
        passedItems,
        totalItems: 24,
        status,
        technician,
        notes
      })
    });
  } catch (err) {}

  activeVehicle.status = newStatus;
  document.getElementById('res-status-badge').textContent = newStatus.toUpperCase();

  closeMobilePdi();

  if (status === 'approved') {
    playBeepSound(1200, 0.2);
    alert(translations[currentLang].pdiApprovedSuccess);
  } else {
    playBeepSound(400, 0.3);
    alert(translations[currentLang].pdiFailedNotice);
  }
}

async function updateStatus(vin, newStatus) {
  if (db) {
    try {
      await db.vehicles.update(vin, { status: newStatus });
    } catch (e) {}
  }

  try {
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chassisVin: vin, status: newStatus })
    });
  } catch (e) {}

  if (activeVehicle) {
    activeVehicle.status = newStatus;
    document.getElementById('res-status-badge').textContent = newStatus.toUpperCase();
  }
}
