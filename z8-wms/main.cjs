/**
 * Z8 E-MOTION // WMS ELECTRON DESKTOP RUNNER
 * Creates native desktop application window with official branding.
 */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow = null;
let serverProcess = null;
const PORT = 3300;

function isServerRunning(port) {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:${port}/api/status`, res => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => {
      req.abort();
      resolve(false);
    });
  });
}

async function startServerIfNeeded() {
  const running = await isServerRunning(PORT);
  if (!running) {
    console.log('[Z8-WMS-ELECTRON] Starting local HTTP server...');
    require('./server.cjs');
    // Wait a brief moment for server to listen
    await new Promise(r => setTimeout(r, 400));
  } else {
    console.log(`[Z8-WMS-ELECTRON] Server already listening on port ${PORT}.`);
  }
}

async function createWindow() {
  await startServerIfNeeded();

  const iconPath = path.join(__dirname, 'assets', 'logos', 'z8_minimal_cropped.png');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#080B10',
    title: 'Z8 WMS // WAREHOUSE MANAGEMENT SYSTEM // 仓储管理系统',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load local cockpit
  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Custom minimal application menu
  const menuTemplate = [
    {
      label: 'Z8 E-Motion',
      submenu: [
        { label: 'Sobre Z8 WMS // 关于系统', click: () => {
          const { dialog } = require('electron');
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Z8 WMS // 仓储管理系统',
            message: 'Z8 E-MOTION // WMS 2026.1\nSistema Oficial de Estoque, Chassis e Oficina Técnica\nCNPJ: 68.774.164/0001-00\nSão José dos Campos - SP'
          });
        }},
        { type: 'separator' },
        { label: 'Reiniciar Cockpit (F5)', role: 'reload' },
        { label: 'Tela Cheia (F11)', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Sair // 退出', role: 'quit' }
      ]
    },
    {
      label: 'Visualização // 视图',
      submenu: [
        { label: 'Zoom +', role: 'zoomIn' },
        { label: 'Zoom -', role: 'zoomOut' },
        { label: 'Restaurar Zoom', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Ferramentas do Desenvolvedor', role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
