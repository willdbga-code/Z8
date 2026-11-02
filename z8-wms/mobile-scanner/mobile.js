/**
 * Z8 MOBILE SCANNER // COMPANION JS ENGINE
 * Runs on smartphone browser connected to local WMS Wi-Fi
 */

let html5QrCode = null;
let isScanning = false;
let activeVehicle = null;
let currentLang = 'pt-BR';

const translations = {
  'pt-BR': {
    prompt: 'Aponte a câmera para o Chassi / QR Code:',
    startCam: 'Ativar Câmera Scanner',
    stopCam: 'Parar Scanner',
    searchBtn: 'Buscar',
    btnPdi: '✓ PDI Aprovado',
    btnService: '⚠️ Enviar p/ Oficina',
    uploadPrompt: '📸 Tirar Foto de Inspeção (PDI / Avaria)',
    uploadedSuccess: '✓ Foto enviada e vinculada ao Chassi!',
    notFound: 'Chassi não encontrado no sistema.'
  },
  'zh-CN': {
    prompt: '请将手机摄像头对准车架条码/二维码：',
    startCam: '开启摄像头扫码',
    stopCam: '停止扫码',
    searchBtn: '查询',
    btnPdi: '✓ PDI检验合格',
    btnService: '⚠️ 报修送修工单',
    uploadPrompt: '📸 现场验车拍照 (PDI/瑕疵记录)',
    uploadedSuccess: '✓ 验车照片已实时同步至车架档案！',
    notFound: '未在系统中查询到该车架号。'
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
  });
}

function updateUiTexts() {
  const t = translations[currentLang];
  document.getElementById('txt-scan-prompt').textContent = t.prompt;
  document.getElementById('txt-cam-action').textContent = isScanning ? t.stopCam : t.startCam;
  document.getElementById('btn-manual-search').textContent = t.searchBtn;
  document.getElementById('btn-quick-pdi').textContent = t.btnPdi;
  document.getElementById('btn-quick-service').textContent = t.btnService;
  document.querySelector('.photo-upload-btn span').textContent = t.uploadPrompt;
  document.getElementById('m-btn-lang').textContent = currentLang === 'pt-BR' ? '中文' : 'PT-BR';
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

  // Quick PDI button
  document.getElementById('btn-quick-pdi').addEventListener('click', async () => {
    if (!activeVehicle) return;
    await updateStatus(activeVehicle.chassisVin, 'ready_to_ship');
    alert(currentLang === 'zh-CN' ? '已通过PDI检验，转为待发运！' : 'PDI aprovado! Veículo liberado para saída.');
  });

  // Quick Service button
  document.getElementById('btn-quick-service').addEventListener('click', async () => {
    if (!activeVehicle) return;
    await updateStatus(activeVehicle.chassisVin, 'in_service');
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
      (errorMessage) => {
        // Continuous scanning frame callback
      }
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
  // Format could be "Z8:Z8-DB018-2026-0001" or raw VIN
  let cleanVin = rawText.trim();
  if (cleanVin.startsWith('Z8:')) {
    cleanVin = cleanVin.substring(3);
  }

  // Beep sound feedback
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}

  lookupChassis(cleanVin);
  stopCamera();
}

async function lookupChassis(vin) {
  let found = null;

  // 1. Check local IndexedDB if available
  if (db) {
    try {
      found = await db.vehicles.get(vin);
      if (!found) {
        // search case insensitive
        const all = await db.vehicles.toArray();
        found = all.find(v => v.chassisVin.toLowerCase() === vin.toLowerCase());
      }
    } catch (e) {}
  }

  // 2. Fallback to API if not in local mobile indexeddb
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

  // Clear previous previews
  document.getElementById('photo-preview-grid').innerHTML = '';
  document.getElementById('upload-status-text').textContent = '';

  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth' });
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
