import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { z8Models } from '../site-principal/data/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getBrowserPath() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'msedge';
}

const edgePath = getBrowserPath();
const pagesDir = path.resolve(rootDir, 'scratch', 'minimalist_catalog_html_pages');
const outputImgDir = path.resolve(rootDir, 'public', 'assets', 'catalogo_minimalista');

fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(outputImgDir, { recursive: true });

function toFileUrl(relPath) {
  const absPath = path.resolve(rootDir, relPath).replace(/\\/g, '/');
  return `file:///${absPath}`;
}

const logoMinimalistaUrl = toFileUrl('public/assets/logos/logo minimalista.png');
const logoMainUrl = toFileUrl('public/assets/logos/logo_z8_main.png');

const modelOverlays = {
  'z8-tank': 'CHASSI TUBULAR DUPLO // OFF-ROAD READY',
  'z8-fx10': 'AERODINÂMICA ESPORTIVA // URBAN SPORT',
  'z8-harley-x12': 'SOM BLUETOOTH NATIVO // CHOPPER CUSTOM',
  'z8-harley-x21': 'SOM BLUETOOTH NATIVO // CHOPPER CUSTOM',
  'z8-u2-delivery': 'BASE REFORÇADA P/ BAÚ // HEAVY-DUTY CARGA',
  'z8-n95c': 'ASSENTO DUPLO MACIO // PNEUS LARGOS 130MM',
  'z8-h26': 'MAIOR GIRO COMERCIAL // FÁCIL PILOTAGEM',
  'z8-n7': 'MAIOR GIRO COMERCIAL // FÁCIL PILOTAGEM',
  'z8-q11': 'BAÚ TRASEIRO INTEGRADO // CANDY STYLE',
  'z8-n710': 'LANÇAMENTO 2026 // TECNOLOGIA INTEGRADA',
  'z8-q10': 'INSPIRAÇÃO ITALIANA // RETRÔ XIAO Q',
  'z8-gs005': 'CESTA FRONTAL REFORÇADA // UTILITÁRIA PEDELEC',
  'z8-diamond': 'ACABAMENTO DIAMOND LUXE // MÁXIMO CONFORTO'
};

const ICONS = {
  motor: `<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  battery: `<svg viewBox="0 0 24 24"><path d="M16 20H8V6h8m0-2h-1V2h-6v2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M10 9h4v2h-4zm0 4h4v2h-4z"/></svg>`,
  range: `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  speed: `<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.66L8.41 15.6A5.98 5.98 0 0 1 6 12a6 6 0 0 1 11.23-2.92l1.66-1.66A7.96 7.96 0 0 0 12 4zm0 4a4 4 0 0 0-4 4c0 .77.22 1.49.6 2.1l2.4-2.4V8h2v3.7l2.4 2.4c.38-.61.6-1.33.6-2.1a4 4 0 0 0-4-4z"/></svg>`,
  brakes: `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8zm0-12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
  light: `<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10h2v4h-2zm0 6h2v2h-2z"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  economy: `<svg viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.75C6.2 7.58 4.7 9.4 4.09 11.41 7.2 9.5 13 8 17 8z"/></svg>`
};

function formatCurrency(val) {
  return val.toLocaleString('pt-BR');
}

const COMMON_CSS = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800;1,900&family=Orbitron:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      width: 1754px;
      height: 1240px;
      background: #FFFFFF;
      font-family: 'Montserrat', sans-serif;
      position: relative;
      overflow: hidden;
      margin: 0;
      padding: 0;
      color: #0A0B0E;
    }

    /* Subtle Architectural Framing */
    .catalog-frame {
      position: absolute;
      top: 24px;
      left: 24px;
      right: 24px;
      bottom: 24px;
      border: 1px solid #E2E8F0;
      pointer-events: none;
      z-index: 5;
    }

    /* Top Left Bauhaus Minimalist Badge */
    .header-bar {
      position: absolute;
      top: 48px;
      left: 64px;
      right: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 20;
    }

    .brand-pill {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #FFFFFF;
      padding: 8px 20px;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }

    .brand-pill img {
      height: 32px;
      width: auto;
    }

    .brand-pill-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #0A0B0E;
      letter-spacing: 2px;
    }

    .brand-pill-divider {
      width: 1px;
      height: 18px;
      background: #CBD5E1;
    }

    .brand-pill-sub {
      font-size: 11px;
      font-weight: 700;
      color: #008CA8;
      letter-spacing: 2.5px;
      text-transform: uppercase;
    }

    .page-index-pill {
      font-family: 'Orbitron', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 3px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 8px 18px;
      border-radius: 6px;
    }

    /* Bottom Status Bar */
    .footer-bar {
      position: absolute;
      bottom: 48px;
      left: 64px;
      right: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 20;
      border-top: 1px solid #E2E8F0;
      padding-top: 16px;
    }

    .footer-tags {
      display: flex;
      gap: 24px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748B;
    }

    .footer-tag-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-tag-item svg {
      width: 14px;
      height: 14px;
      fill: #00B4D8;
    }

    .footer-right-url {
      font-family: 'Orbitron', sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: #0A0B0E;
      letter-spacing: 2px;
    }
  </style>
`;

// ==========================================
// 1. PAGE 1: COVER (CAPA MINIMALISTA)
// ==========================================
function buildCoverHtml() {
  const heroTank = toFileUrl('public/assets/models/z8_tank_studio.jpg');
  const heroN95c = toFileUrl('public/assets/models/z8_n95c_studio.jpg');
  const heroQ10 = toFileUrl('public/assets/models/z8_q10_studio.jpg');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Catálogo de Vendas 2026</title>
  ${COMMON_CSS}
  <style>
    .cover-container {
      position: absolute;
      top: 140px;
      left: 64px;
      right: 64px;
      bottom: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-header-group {
      max-width: 1100px;
    }

    .cover-kicker {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0A0B0E;
      color: #00E5FF;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 4px;
      margin-bottom: 24px;
    }

    .cover-headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 80px;
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -2px;
      color: #0A0B0E;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .cover-headline span {
      color: #00A3C4;
    }

    .cover-lead {
      font-size: 18px;
      font-weight: 500;
      color: #475569;
      line-height: 1.5;
      max-width: 820px;
      letter-spacing: 0.2px;
    }

    /* 3 Vehicles Gallery Showcase */
    .cover-showcase-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 32px;
    }

    .showcase-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 360px;
      overflow: hidden;
    }

    .showcase-card:hover {
      border-color: #00E5FF;
    }

    .showcase-tag {
      font-size: 10px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .showcase-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #0A0B0E;
      margin-top: 4px;
    }

    .showcase-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 6px;
      margin: 12px 0;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06));
    }

    .showcase-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #E2E8F0;
      padding-top: 12px;
    }

    .showcase-spec {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
    }

    .showcase-price {
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 900;
      color: #0A0B0E;
    }
  </style>
</head>
<body>

  <div class="catalog-frame"></div>

  <div class="header-bar">
    <div class="brand-pill">
      <img src="${logoMinimalistaUrl}" alt="Z8 Logo">
      <span class="brand-pill-title">Z8 E-MOTION</span>
      <div class="brand-pill-divider"></div>
      <span class="brand-pill-sub">Catálogo de Vendas // Edição 2026</span>
    </div>
    <div class="page-index-pill">01 / 14</div>
  </div>

  <div class="cover-container">
    <div class="cover-header-group">
      <div class="cover-kicker">Mobilidade Urbana 100% Elétrica</div>
      <h1 class="cover-headline">Engenharia, Estilo e <span>Liberdade.</span></h1>
      <p class="cover-lead">
        Conheça a linha completa de scooters e motocicletas elétricas Z8 E-Motion. Veículos homologados pelo CONTRAN 996, com recarga econômica em qualquer tomada comum e zero poluição.
      </p>
    </div>

    <div class="cover-showcase-grid">
      <div class="showcase-card">
        <div>
          <div class="showcase-tag">Scooter Executiva</div>
          <div class="showcase-name">Z8 N95C MAX</div>
        </div>
        <img class="showcase-img" src="${heroN95c}" alt="Z8 N95C">
        <div class="showcase-foot">
          <span class="showcase-spec">1200W • Até 50 km</span>
          <span class="showcase-price">R$ 10.000,00</span>
        </div>
      </div>

      <div class="showcase-card">
        <div>
          <div class="showcase-tag">Trail Performance</div>
          <div class="showcase-name">Z8 TANK</div>
        </div>
        <img class="showcase-img" src="${heroTank}" alt="Z8 Tank">
        <div class="showcase-foot">
          <span class="showcase-spec">2000W • Chassi Tubular</span>
          <span class="showcase-price">R$ 11.500,00</span>
        </div>
      </div>

      <div class="showcase-card">
        <div>
          <div class="showcase-tag">Vintage Baú Candy</div>
          <div class="showcase-name">Z8 Q10 VINTAGE</div>
        </div>
        <img class="showcase-img" src="${heroQ10}" alt="Z8 Q10">
        <div class="showcase-foot">
          <span class="showcase-spec">1000W • Baú de Série</span>
          <span class="showcase-price">R$ 9.800,00</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-tags">
      <div class="footer-tag-item">${ICONS.leaf} 100% Elétrico Zero Emissões</div>
      <div class="footer-tag-item">${ICONS.economy} R$ 1,80 Custo Médio por Recarga</div>
      <div class="footer-tag-item">${ICONS.shield} Garantia Nacional Z8</div>
    </div>
    <div class="footer-right-url">Z8EMOTION.COM</div>
  </div>

</body>
</html>`;
}

// ==========================================
// 2. PAGE 2: BRAND PRESENTATION & MANIFESTO
// ==========================================
function buildBrandPresentationHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Apresentação da Marca - Z8 E-Motion</title>
  ${COMMON_CSS}
  <style>
    .brand-content {
      position: absolute;
      top: 140px;
      left: 64px;
      right: 64px;
      bottom: 100px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }

    .brand-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .section-kicker {
      font-size: 11px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .brand-headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 54px;
      font-weight: 900;
      line-height: 1.05;
      color: #0A0B0E;
      letter-spacing: -1.5px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .brand-headline span {
      color: #00A3C4;
    }

    .brand-manifesto-p {
      font-size: 16px;
      line-height: 1.7;
      color: #334155;
      margin-bottom: 20px;
      text-align: justify;
    }

    .brand-metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 24px;
      border-top: 1px solid #E2E8F0;
      padding-top: 24px;
    }

    .metric-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 16px;
    }

    .metric-val {
      font-family: 'Orbitron', sans-serif;
      font-size: 28px;
      font-weight: 900;
      color: #0A0B0E;
      line-height: 1;
      margin-bottom: 6px;
    }

    .metric-val span {
      color: #22C55E;
      font-size: 20px;
    }

    .metric-lbl {
      font-size: 10px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Right Column - 4 Pillars */
    .brand-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pillar-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #00E5FF;
      border-radius: 6px;
      padding: 24px 28px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
      transition: all 0.2s ease;
    }

    .pillar-card:nth-child(2) { border-left-color: #22C55E; }
    .pillar-card:nth-child(3) { border-left-color: #0A0B0E; }
    .pillar-card:nth-child(4) { border-left-color: #008CA8; }

    .pillar-top {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 8px;
    }

    .pillar-icon-box {
      width: 36px;
      height: 36px;
      background: #F8FAFC;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E2E8F0;
    }

    .pillar-icon-box svg {
      width: 20px;
      height: 20px;
      fill: #0A0B0E;
    }

    .pillar-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #0A0B0E;
      letter-spacing: 1px;
    }

    .pillar-desc {
      font-size: 13px;
      color: #64748B;
      line-height: 1.6;
    }
  </style>
</head>
<body>

  <div class="catalog-frame"></div>

  <div class="header-bar">
    <div class="brand-pill">
      <img src="${logoMinimalistaUrl}" alt="Z8 Logo">
      <span class="brand-pill-title">Z8 E-MOTION</span>
      <div class="brand-pill-divider"></div>
      <span class="brand-pill-sub">Apresentação da Marca // Manifesto 2026</span>
    </div>
    <div class="page-index-pill">02 / 14</div>
  </div>

  <div class="brand-content">
    <div class="brand-left">
      <div class="section-kicker">Manifesto de Engenharia</div>
      <h2 class="brand-headline">O Futuro não espera.<br>Ele anda em <span>Silêncio.</span></h2>
      <p class="brand-manifesto-p">
        A <strong>Z8 E-Motion Ltda.</strong> é referência nacional na transição para a micromobilidade elétrica inteligente. Nascemos com a convicção de que você não precisa mais ser refém do preço da gasolina, da manutenção mecânica complexa ou do trânsito travado.
      </p>
      <p class="brand-manifesto-p">
        Cada veículo Z8 é projetado com chassi em ligas estruturais reforçadas, baterias de lítio com gestão inteligente BMS e motores elétricos sem escovas (Brushless) de alto rendimento. Entregamos design sofisticado, zero emissões e a menor despesa por quilômetro rodado do mercado brasileiro.
      </p>

      <div class="brand-metrics-grid">
        <div class="metric-card">
          <div class="metric-val">R$ 1,80</div>
          <div class="metric-lbl">Recarga Completa</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">+90<span>%</span></div>
          <div class="metric-lbl">Economia vs Gasolina</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">100<span>%</span></div>
          <div class="metric-lbl">Resolução CONTRAN 996</div>
        </div>
      </div>
    </div>

    <div class="brand-right">
      <div class="pillar-card">
        <div class="pillar-top">
          <div class="pillar-icon-box">${ICONS.battery}</div>
          <div class="pillar-title">Tecnologia de Bateria & BMS</div>
        </div>
        <div class="pillar-desc">
          Baterias de Lítio leves e removíveis, protegidas por circuito BMS contra sobrecarga, aquecimento e descarga profunda. Recarregue em qualquer tomada 110V ou 220V em 4 a 6 horas.
        </div>
      </div>

      <div class="pillar-card">
        <div class="pillar-top">
          <div class="pillar-icon-box">${ICONS.shield}</div>
          <div class="pillar-title">Pós-Venda & Oficina Padrão</div>
        </div>
        <div class="pillar-desc">
          Rede nacional com estoque centralizado de peças de reposição e assistência técnica homologada com elevadores hidráulicos exclusivos para manutenção ágil e segura.
        </div>
      </div>

      <div class="pillar-card">
        <div class="pillar-top">
          <div class="pillar-icon-box">${ICONS.brakes}</div>
          <div class="pillar-title">Segurança & Condução Confortável</div>
        </div>
        <div class="pillar-desc">
          Freios a disco hidráulicos dianteiros e traseiros, suspensão dimensionada para a pavimentação urbana brasileira e iluminação full LED com visibilidade máxima diurna e noturna.
        </div>
      </div>

      <div class="pillar-card">
        <div class="pillar-top">
          <div class="pillar-icon-box">${ICONS.leaf}</div>
          <div class="pillar-title">Sustentabilidade sem Burocracia</div>
        </div>
        <div class="pillar-desc">
          Veículos ecológicos com emissão zero de gases do efeito estufa e poluição sonora zero, prontos para rodar em vias urbanas de acordo com a legislação federal vigente.
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-tags">
      <div class="footer-tag-item">${ICONS.check} Matriz Corporativa São José dos Campos - SP</div>
      <div class="footer-tag-item">${ICONS.check} Suporte Técnico e Peças a Pronta Entrega</div>
    </div>
    <div class="footer-right-url">Z8EMOTION.COM</div>
  </div>

</body>
</html>`;
}

// ==========================================
// 3. PRODUCT PAGES (PAGES 3 TO 13)
// ==========================================
function buildProductPageHtml(model, index) {
  const pageNum = index + 3;
  const modelImgUrl = toFileUrl(`public${model.image}`);
  const overlayText = modelOverlays[model.id] || 'TECNOLOGIA INTEGRADA // 100% ELÉTRICA';

  const words = model.name.replace(/^Z8\s+/, '').split(' ');
  const titleP1 = words[0];
  const titleP2 = words.slice(1).join(' ');

  const featuresList = (model.features && model.features.length > 0)
    ? model.features.map(f => `<div class="feat-pill">${ICONS.check} ${f}</div>`).join('')
    : `<div class="feat-pill">${ICONS.check} Partida Keyless NFC</div><div class="feat-pill">${ICONS.check} Iluminação Full LED</div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - ${model.name}</title>
  ${COMMON_CSS}
  <style>
    .product-grid {
      position: absolute;
      top: 130px;
      left: 64px;
      right: 64px;
      bottom: 95px;
      display: grid;
      grid-template-columns: 980px 1fr;
      gap: 56px;
      align-items: center;
    }

    /* Left Vehicle Showcase */
    .vehicle-display-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      height: 900px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      overflow: hidden;
    }

    .vehicle-display-card::before {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, rgba(248, 250, 252, 0) 70%);
      pointer-events: none;
    }

    .vehicle-photo {
      max-width: 920px;
      max-height: 620px;
      width: auto;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.12));
      z-index: 2;
    }

    .vehicle-floating-badge {
      position: absolute;
      bottom: 32px;
      left: 36px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #0A0B0E;
      color: #FFFFFF;
      padding: 10px 22px;
      border-radius: 4px;
      border-left: 4px solid #00E5FF;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      z-index: 3;
    }

    /* Right Specs & Sales Column */
    .specs-sales-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 900px;
      padding: 10px 0;
    }

    .model-header-block {
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 24px;
    }

    .model-category-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .model-title-main {
      font-family: 'Montserrat', sans-serif;
      font-size: 44px;
      font-weight: 900;
      line-height: 1.05;
      color: #0A0B0E;
      letter-spacing: -1px;
      text-transform: uppercase;
    }

    .model-title-main span {
      color: #00A3C4;
    }

    .model-code-kicker {
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 2px;
      margin-top: 6px;
    }

    .model-desc-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin-top: 14px;
    }

    /* Technical Specs Table */
    .telemetry-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 18px 0;
    }

    .spec-item-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .spec-item-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .spec-item-label svg {
      width: 14px;
      height: 14px;
      fill: #008CA8;
    }

    .spec-item-value {
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #0A0B0E;
    }

    /* Features Pills */
    .features-section-title {
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .features-pills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .feat-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #1E293B;
    }

    .feat-pill svg {
      width: 12px;
      height: 12px;
      fill: #22C55E;
    }

    /* Sales Box */
    .sales-cta-box {
      background: #0A0B0E;
      border-radius: 6px;
      padding: 24px 28px;
      color: #FFFFFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 24px rgba(10, 11, 14, 0.15);
    }

    .sales-price-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sales-price-label {
      font-size: 10px;
      font-weight: 800;
      color: #94A3B8;
      letter-spacing: 2.5px;
      text-transform: uppercase;
    }

    .sales-price-val {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: 1px;
    }

    .sales-price-val span {
      color: #00E5FF;
      font-size: 20px;
      margin-right: 4px;
    }

    .sales-badge-side {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .sales-economy-pill {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.35);
      color: #4ADE80;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .sales-economy-pill svg {
      width: 14px;
      height: 14px;
      fill: #4ADE80;
    }

    .sales-charge-note {
      font-size: 11px;
      color: #94A3B8;
      font-weight: 500;
    }
  </style>
</head>
<body>

  <div class="catalog-frame"></div>

  <div class="header-bar">
    <div class="brand-pill">
      <img src="${logoMinimalistaUrl}" alt="Z8 Logo">
      <span class="brand-pill-title">Z8 E-MOTION</span>
      <div class="brand-pill-divider"></div>
      <span class="brand-pill-sub">${model.category.toUpperCase()} // LINHA 2026</span>
    </div>
    <div class="page-index-pill">${String(pageNum).padStart(2, '0')} / 14</div>
  </div>

  <div class="product-grid">
    <div class="vehicle-display-card">
      <img class="vehicle-photo" src="${modelImgUrl}" alt="${model.name}">
      <div class="vehicle-floating-badge">
        <span>⚡ ${overlayText}</span>
      </div>
    </div>

    <div class="specs-sales-col">
      <div class="model-header-block">
        <span class="model-category-tag">${model.tag.toUpperCase()}</span>
        <h2 class="model-title-main">${titleP1} <span>${titleP2}</span></h2>
        <div class="model-code-kicker">CÓDIGO DE HOMOLOGAÇÃO: ${model.code}</div>
        <p class="model-desc-text">${model.description}</p>
      </div>

      <div>
        <div class="features-section-title">Ficha Técnica Homologada</div>
        <div class="telemetry-grid">
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.motor} Motorização</span>
            <span class="spec-item-value">${model.motor}</span>
          </div>
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.battery} Bateria</span>
            <span class="spec-item-value">${model.battery}</span>
          </div>
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.range} Autonomia</span>
            <span class="spec-item-value">${model.range}</span>
          </div>
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.speed} Velocidade</span>
            <span class="spec-item-value">${model.speed}</span>
          </div>
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.brakes} Freios</span>
            <span class="spec-item-value">${model.brakes}</span>
          </div>
          <div class="spec-item-box">
            <span class="spec-item-label">${ICONS.shield} Chassi</span>
            <span class="spec-item-value">${model.chassis}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="features-section-title">Equipamentos de Série</div>
        <div class="features-pills-wrap">
          ${featuresList}
        </div>
      </div>

      <div class="sales-cta-box">
        <div class="sales-price-wrap">
          <span class="sales-price-label">Preço Sugerido ao Consumidor</span>
          <div class="sales-price-val"><span>R$</span>${formatCurrency(model.retailPrice)},00</div>
        </div>
        <div class="sales-badge-side">
          <div class="sales-economy-pill">
            ${ICONS.leaf} R$ 1,80 por recarga
          </div>
          <span class="sales-charge-note">Economia de ~R$ 450/mês vs Gasolina</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-tags">
      <div class="footer-tag-item">${ICONS.shield} Garantia Nacional Z8 E-Motion</div>
      <div class="footer-tag-item">${ICONS.leaf} Zero Emissões de Carbono</div>
      <div class="footer-tag-item">${ICONS.check} Peças e Acessórios a Pronta Entrega</div>
    </div>
    <div class="footer-right-url">Z8EMOTION.COM</div>
  </div>

</body>
</html>`;
}

// ==========================================
// 4. PAGE 14: BACK COVER (CONTRACAPA)
// ==========================================
function buildBackCoverHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Contracapa e Contato</title>
  ${COMMON_CSS}
  <style>
    .back-container {
      position: absolute;
      top: 140px;
      left: 64px;
      right: 64px;
      bottom: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }

    .back-top-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }

    .back-top-logo img {
      height: 90px;
      width: auto;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .back-headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 58px;
      font-weight: 900;
      color: #0A0B0E;
      line-height: 1.05;
      letter-spacing: -1.5px;
      text-transform: uppercase;
      max-width: 900px;
      margin: 20px 0 12px;
    }

    .back-headline span {
      color: #00A3C4;
    }

    .back-sub {
      font-size: 18px;
      color: #475569;
      max-width: 680px;
      line-height: 1.6;
    }

    /* 3 Corporate Cards */
    .back-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      width: 100%;
      margin: 30px 0;
    }

    .back-info-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 28px 24px;
      text-align: left;
    }

    .back-card-label {
      font-size: 10px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .back-card-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #0A0B0E;
      margin-bottom: 12px;
    }

    .back-card-desc {
      font-size: 13px;
      color: #64748B;
      line-height: 1.6;
    }

    .back-contact-line {
      font-size: 14px;
      font-weight: 700;
      color: #0A0B0E;
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Bottom Trust Bar */
    .back-bottom-trust {
      border-top: 1px solid #E2E8F0;
      padding-top: 24px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>

  <div class="catalog-frame"></div>

  <div class="header-bar">
    <div class="brand-pill">
      <img src="${logoMinimalistaUrl}" alt="Z8 Logo">
      <span class="brand-pill-title">Z8 E-MOTION</span>
      <div class="brand-pill-divider"></div>
      <span class="brand-pill-sub">Rede Oficial & Contato Comercial</span>
    </div>
    <div class="page-index-pill">14 / 14</div>
  </div>

  <div class="back-container">
    <div class="back-top-logo">
      <img src="${logoMinimalistaUrl}" alt="Z8 Logo">
      <h2 class="back-headline">Sua Liberdade Começa com um <span>Test-Ride.</span></h2>
      <p class="back-sub">
        Visite nossa rede de concessionárias credenciadas ou solicite atendimento executivo com um especialista Z8.
      </p>
    </div>

    <div class="back-cards-grid">
      <div class="back-info-card">
        <div class="back-card-label">Matriz Corporativa</div>
        <div class="back-card-title">Z8 EMOTION LTDA.</div>
        <div class="back-card-desc">
          CNPJ: 68.774.164/0001-00<br>
          Av. Dr. Adhemar de Barros, 566<br>
          Jardim São Dimas — São José dos Campos - SP<br>
          CEP: 12.245-010
        </div>
      </div>

      <div class="back-info-card">
        <div class="back-card-label">Atendimento & Vendas</div>
        <div class="back-card-title">Canais Diretos</div>
        <div class="back-card-desc">
          Atendimento comercial para venda direta, frotas e suporte a revendedores autorizados:
        </div>
        <div class="back-contact-line">📱 WhatsApp: (12) 99800-8818</div>
        <div class="back-contact-line">✉️ contato@z8emotion.com</div>
      </div>

      <div class="back-info-card">
        <div class="back-card-label">Garantia & Homologação</div>
        <div class="back-card-title">Segurança Jurídica</div>
        <div class="back-card-desc">
          • Conformidade total Resolução CONTRAN 996<br>
          • Termo de Garantia Nacional Z8<br>
          • Estoque garantido de peças de reposição<br>
          • PDI (Inspeção Pré-Entrega) certificado
        </div>
      </div>
    </div>

    <div class="back-bottom-trust">
      <span>Z8 EMOTION LTDA. © 2026 — TODOS OS DIREITOS RESERVADOS</span>
      <span>FORO EXCLUSIVO: COMARCA DE SÃO JOSÉ DOS CAMPOS - SP</span>
      <span>WWW.Z8EMOTION.COM</span>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-tags">
      <div class="footer-tag-item">${ICONS.check} Mobilidade Sustentável</div>
      <div class="footer-tag-item">${ICONS.check} Alta Performance Elétrica</div>
    </div>
    <div class="footer-right-url">Z8EMOTION.COM</div>
  </div>

</body>
</html>`;
}

// ==========================================
// 5. MAIN ORCHESTRATOR & BUILDER
// ==========================================
async function main() {
  console.log('🚀 Iniciando geração do CATÁLOGO MINIMALISTA DE VENDAS Z8 2026 (14 Páginas)...');

  const pages = [
    { num: 1, id: 'capa', title: 'Capa Minimalista', html: buildCoverHtml(), filenameHtml: 'page_01_capa.html', filenamePng: 'pagina_01_capa_minimalista.png' },
    { num: 2, id: 'apresentacao', title: 'Apresentação da Marca', html: buildBrandPresentationHtml(), filenameHtml: 'page_02_apresentacao.html', filenamePng: 'pagina_02_apresentacao_marca.png' }
  ];

  z8Models.forEach((model, idx) => {
    const pageNum = idx + 3;
    pages.push({
      num: pageNum,
      id: model.id,
      title: model.name,
      html: buildProductPageHtml(model, idx),
      filenameHtml: `page_${String(pageNum).padStart(2, '0')}_${model.id.replace(/-/g, '_')}.html`,
      filenamePng: `pagina_${String(pageNum).padStart(2, '0')}_${model.id.replace(/-/g, '_')}_minimalista.png`
    });
  });

  pages.push({
    num: 14,
    id: 'contracapa',
    title: 'Contracapa e Contato',
    html: buildBackCoverHtml(),
    filenameHtml: 'page_14_contracapa.html',
    filenamePng: 'pagina_14_contracapa_minimalista.png'
  });

  // 1. Write HTML files
  console.log(`📝 Escrevendo 14 arquivos HTML em ${pagesDir}...`);
  for (const page of pages) {
    const htmlPath = path.join(pagesDir, page.filenameHtml);
    fs.writeFileSync(htmlPath, page.html, 'utf8');
  }

  // 2. Render each HTML file to 1754x1240 PNG using Microsoft Edge Headless
  console.log('🖼️ Renderizando cada uma das 14 páginas com Microsoft Edge Headless (1754x1240)...');
  const renderedImages = [];

  for (const page of pages) {
    const htmlPath = path.join(pagesDir, page.filenameHtml);
    const pngPath = path.join(outputImgDir, page.filenamePng);
    const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1754,1240 "--screenshot=${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;

    try {
      execSync(cmd, { stdio: 'ignore' });
      if (fs.existsSync(pngPath)) {
        console.log(`[OK] [${page.num}/14] ${page.filenamePng} renderizado com sucesso!`);
        renderedImages.push(pngPath);
      } else {
        console.error(`[ERRO] [${page.num}/14] Falha ao gerar ${page.filenamePng}`);
      }
    } catch (e) {
      console.error(`Erro ao renderizar ${page.filenamePng}:`, e.message);
    }
  }

  console.log(`[SUCESSO] ${renderedImages.length} de 14 páginas renderizadas com perfeição.`);

  // 3. Merge PNGs into Minimalist PDF using Python PyMuPDF
  console.log('📄 Unificando páginas no PDF Minimalista de Vendas via PyMuPDF...');
  const pythonMergeScript = path.resolve(rootDir, 'scripts', 'merge_minimalist_catalog_pdf.py');
  fs.writeFileSync(pythonMergeScript, `
import fitz
import os

root_dir = r"${rootDir.replace(/\\/g, '\\\\')}"
img_dir = os.path.join(root_dir, "public", "assets", "catalogo_minimalista")
pdf_docs = os.path.join(root_dir, "docs", "CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf")
pdf_public = os.path.join(root_dir, "public", "docs", "CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf")
pdf_dist = os.path.join(root_dir, "dist", "docs", "CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf")
pdf_scratch = os.path.join(root_dir, "scratch", "CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf")

doc = fitz.open()

# Ordered image list
img_files = sorted([f for f in os.listdir(img_dir) if f.startswith("pagina_") and f.endswith("_minimalista.png") or f.endswith("_marca.png")])
print(f"Total de paginas a unificar: {len(img_files)}")

for f in img_files:
    img_path = os.path.join(img_dir, f)
    img_doc = fitz.open(img_path)
    pdf_bytes = img_doc.convert_to_pdf()
    img_pdf = fitz.open("pdf", pdf_bytes)
    doc.insert_pdf(img_pdf)
    print(f"  + Inserida: {f}")

for target in [pdf_docs, pdf_public, pdf_dist, pdf_scratch]:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    doc.save(target)
    print(f"[OK] PDF gravado em: {target} ({os.path.getsize(target)/1024/1024:.2f} MB)")
`, 'utf8');

  const pyCmd = process.platform === 'win32' ? 'python' : 'python3';
  execSync(`${pyCmd} "${pythonMergeScript}"`, { stdio: 'inherit' });
  console.log('[FINALIZADO] Catálogo Minimalista de Vendas gerado e unificado com sucesso!');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
