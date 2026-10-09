import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawImagesDir = path.resolve(rootDir, 'docs', 'laf_extracted', 'raw_images');
const cutoutsDir = path.resolve(rootDir, 'docs', 'laf_extracted', 'clean_cutouts');
const logosDir = path.resolve(rootDir, 'public', 'assets', 'logos');
const modelsDir = path.resolve(rootDir, 'public', 'assets', 'models');
const n95cHeroDir = path.resolve(rootDir, 'public', 'assets', 'n95c', 'hero');

const outputHtmlPath = path.resolve(rootDir, 'docs', 'catalogo_z8_2026_temp.html');
const outputPdfPath = path.resolve(rootDir, 'docs', 'Z8_Oficial_2026.pdf');
const mirrorPdfPath = path.resolve(rootDir, 'public', 'docs', 'Z8_Oficial_2026.pdf');
const mirrorPdfPath2 = path.resolve(rootDir, 'docs', 'CATALOGO_OFICIAL_PRODUTOS_E_GARANTIA_Z8_2026.pdf');
const mirrorPdfPath3 = path.resolve(rootDir, 'public', 'docs', 'CATALOGO_OFICIAL_PRODUTOS_E_GARANTIA_Z8_2026.pdf');

// Browser detection
function getBrowserPath() {
  const paths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Navegador Chrome ou Edge não encontrado.');
}

// Convert local path to file:/// URL
function toFileUrl(absPath) {
  if (!absPath) return '';
  return `file:///${absPath.replace(/\\/g, '/')}`;
}

const logoZ8MainUrl = toFileUrl(path.join(logosDir, 'logo_z8_main.png'));
const logoMinimalistaUrl = toFileUrl(path.join(logosDir, 'logo minimalista.png'));
const logoImpactoUrl = toFileUrl(path.join(logosDir, 'Logo com impacto.png'));
const patternUrl = toFileUrl(path.join(logosDir, 'Repetição em padrão.png'));

// Wide photographic assets for spreads
const heroCoverImgUrl = toFileUrl(path.join(n95cHeroDir, 'hero_02_ignite.jpg'));
const warehouseImgUrl = toFileUrl(path.join(modelsDir, 'z8_u2_warehouse_wide.jpg'));
const sjcImgUrl = toFileUrl(path.join(modelsDir, 'z8_fx10_sjc_wide.jpg'));
const tankPaulistaImgUrl = toFileUrl(path.join(modelsDir, 'z8_tank_paulista_wide.jpg'));
const n710FariaLimaImgUrl = toFileUrl(path.join(modelsDir, 'z8_n710_farialima_wide.jpg'));
const q10MadalenaImgUrl = toFileUrl(path.join(modelsDir, 'z8_q10_madalena_wide.jpg'));
const gs005StudioImgUrl = toFileUrl(path.join(modelsDir, 'z8_gs005_studio.jpg'));
const harleyCarvalhoImgUrl = toFileUrl(path.join(modelsDir, 'z8_harley_carvalho_wide.jpg'));
const n95cSideImgUrl = toFileUrl(path.join(n95cHeroDir, 'hero_04_side.jpg'));

// Load product catalog and asset mappings
const productsCatalogPath = path.resolve(rootDir, 'docs', 'laf_extracted', 'products_catalog.json');
const productsCatalog = JSON.parse(fs.readFileSync(productsCatalogPath, 'utf8'));

const vehicleAssetsMapPath = path.resolve(rootDir, 'docs', 'laf_extracted', 'vehicle_assets_map.json');
const vehicleAssetsMap = JSON.parse(fs.readFileSync(vehicleAssetsMapPath, 'utf8'));

// Build mapping of page number to product
const productsByPage = {};
for (const prod of productsCatalog) {
  productsByPage[prod.page] = prod;
}

// Z8 counterparts map
const Z8_COUNTERPARTS = {
  10: "Z8 SKYLEGE GT // PERFORMANCE",
  11: "Z8 X-ONE Q // FLAGSHIP DUAL-SHOCK",
  12: "Z8 THUNDER // SPORT PROJECTOR",
  14: "Z8 N95C MAX COMFORT (DB039) // EXECUTIVA",
  15: "Z8 N710 URBAN PLUS (DB045) // SPORT",
  16: "Z8 DRIFT 72V // EXTENDED RANGE",
  17: "Z8 T5 COMPACT // AGILIDADE URBANA",
  18: "Z8 SPEED // HYDRAULIC TWIN DISC",
  19: "Z8 NAVIGATOR // DIGITAL COCKPIT",
  20: "Z8 COWBOY // ADVENTURE SCOOTER",
  21: "Z8 GT-S // AERO LINE",
  22: "Z8 VISIONARY // NFC KEYLESS",
  23: "Z8 STORM // GAS MONOSHOCK",
  25: "Z8 DIAMOND LUXE (DB050) // VINTAGE",
  26: "Z8 Q11 COMPACT (DB043-Q11) // PASTEL",
  27: "Z8 Q10 VINTAGE (DB038) // HERITAGE",
  29: "Z8 GS-005 BASE NORTE // TRICICLO DE CARGA",
  30: "Z8 Q-STAR III // TRICICLO URBANO",
  32: "Z8 L10 MAX // SHIMANO 7V FAT-TIRE",
  33: "Z8 L10 MAX S // DUAL BATTERY 120KM",
  34: "Z8 TANK HIGH-SPEED (DB018) // TRAIL OFF-ROAD",
  35: "Z8 L40 PLUS // 2 SEATS EXTENDED",
  36: "Z8 FX-10 SPORT (DB043) // ALUMÍNIO AERO",
  37: "Z8 HAPPY CITY // COMPACT UTILITY",
  38: "Z8 STREET // SOM BLUETOOTH NATIVO",
  39: "Z8 STREET-S // DUAL BATTERY + BLUETOOTH",
  40: "Z8 STREET MINI // CHASSI COMPACTO",
  41: "Z8 URBAN SCRAMBLER // SOM BLUETOOTH",
  42: "Z8 URBAN-S DUAL // 120KM AUTONOMIA",
  43: "Z8 STAR SPORT // RACK TRASEIRO",
  44: "Z8 HARLEY X21 CUSTOM (XB-024) // CHOPPER",
  45: "Z8 V20 ULTRA S // BATERIA GIGANTE 30AH",
  46: "Z8 U2 DELIVERY CARGO (XB-026) // FROTAS"
};

const CSS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@page {
  size: 297mm 210mm;
  margin: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #080a0e;
  color: #ffffff;
  font-family: 'Syne', sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.catalog-page {
  position: relative;
  width: 297mm;
  height: 210mm;
  box-sizing: border-box;
  overflow: hidden;
  page-break-after: always;
  background: #080a0e;
}

/* Background image helper */
.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.bg-dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(8, 10, 14, 0.95) 0%, rgba(8, 10, 14, 0.6) 50%, rgba(8, 10, 14, 0.92) 100%);
  z-index: 2;
}

.page-content-wrap {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  padding: 14mm 16mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header & Badges */
.brand-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid #00f0ff;
  border-radius: 9999px;
  padding: 4px 12px;
  font-family: 'Orbitron', sans-serif;
  font-size: 7pt;
  font-weight: 800;
  color: #00f0ff;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* Monumental Typography */
.monumental-headline {
  font-size: 34pt;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -1.2px;
  line-height: 1.05;
  text-transform: uppercase;
}

.monumental-headline span {
  color: #00f0ff;
}

.monumental-sub {
  font-family: 'Inter', sans-serif;
  font-size: 9.5pt;
  color: #cbd5e1;
  line-height: 1.5;
  max-width: 680px;
}

/* Dynamic Rounded Pills (EGIKE style) */
.dynamic-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.dynamic-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0e121a;
  border: 1px solid rgba(0, 240, 255, 0.35);
  border-radius: 9999px;
  padding: 6px 14px;
  font-family: 'Orbitron', sans-serif;
  font-size: 6.5pt;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.8px;
}

.dynamic-pill.accent {
  background: #00f0ff;
  border-color: #00f0ff;
  color: #080a0e;
  font-weight: 900;
}

/* Cards & Grids */
.editorial-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 14px;
}

.editorial-card {
  background: rgba(14, 18, 26, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px 16px;
  backdrop-filter: blur(10px);
}

.editorial-card.highlight {
  border-color: #00f0ff;
  background: rgba(0, 240, 255, 0.04);
}

.card-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 6.5pt;
  font-weight: 800;
  color: #00f0ff;
  letter-spacing: 0.8px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.card-title {
  font-size: 11pt;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  color: #94a3b8;
  line-height: 1.45;
}

/* Footer clean */
.footer-clean {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 6.5pt;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 6px;
}

.footer-clean .domain {
  color: #00f0ff;
  font-family: 'Orbitron', sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
}

/* ========================================================
   PRODUCT PAGE LAYOUT (33 Vehicle Pages)
======================================================== */
.product-page-layout {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 14mm;
  padding: 12mm 14mm;
}

/* Left Hero Column */
.product-left-col {
  width: 32%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.brand-logo {
  height: 20px;
}

.cat-badge {
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 6pt;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  letter-spacing: 1px;
}

.model-title {
  font-size: 28pt;
  font-weight: 900;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1;
  text-transform: uppercase;
}

.model-sub {
  font-family: 'Orbitron', sans-serif;
  font-size: 7pt;
  font-weight: 700;
  color: #00f0ff;
  letter-spacing: 0.8px;
  margin-top: 2px;
  margin-bottom: 8px;
}

.hero-box {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  background: #0d1117;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.colors-pill {
  margin-top: 6px;
  background: rgba(14, 18, 26, 0.9);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 9999px;
  padding: 4px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 5.5pt;
  color: #94a3b8;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Right Column: Visuals, Telemetry, Warranty */
.product-right-col {
  width: 68%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Visual Details Strip: Cutout + Vignettes + Badge */
.visuals-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(14, 18, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 6px 12px;
  min-height: 84px;
}

.vignettes-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.vignette-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 240, 255, 0.5);
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  background: #000;
}

.vignette-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cutout-box {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cutout-box img {
  max-height: 72px;
  max-width: 150px;
  object-fit: contain;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.8));
}

.homolog-badge {
  text-align: right;
  font-family: 'Orbitron', sans-serif;
}

.homolog-tag {
  background: #00f0ff;
  color: #080a0e;
  font-size: 5.5pt;
  font-weight: 900;
  padding: 3px 7px;
  border-radius: 3px;
  letter-spacing: 0.8px;
  display: inline-block;
  margin-bottom: 3px;
}

.homolog-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 5.5pt;
  color: #64748b;
  display: block;
}

/* Telemetry Grid (12 Items) */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin: 6px 0;
}

.spec-card {
  background: #0d121c;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 5px;
  padding: 5px 7px;
}

.spec-lbl {
  font-family: 'Orbitron', sans-serif;
  font-size: 5pt;
  font-weight: 700;
  color: #00f0ff;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.spec-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 6.5pt;
  font-weight: 600;
  color: #ffffff;
}

/* Master Warranty Box */
.warranty-card {
  background: linear-gradient(135deg, rgba(10, 15, 25, 0.98), rgba(15, 23, 42, 0.98));
  border: 1.5px solid #00f0ff;
  border-radius: 7px;
  padding: 7px 11px;
  box-shadow: 0 4px 14px rgba(0, 240, 255, 0.12);
}

.warranty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
  padding-bottom: 3px;
  margin-bottom: 5px;
}

.warranty-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 7pt;
  font-weight: 800;
  color: #00f0ff;
  letter-spacing: 0.8px;
}

.warranty-chip {
  background: #10b981;
  color: #080a0e;
  font-family: 'Orbitron', sans-serif;
  font-size: 5pt;
  font-weight: 900;
  padding: 2px 5px;
  border-radius: 3px;
}

.warranty-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px 10px;
  margin-bottom: 5px;
}

.w-row {
  display: flex;
  justify-content: space-between;
  font-size: 6pt;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  padding-bottom: 2px;
}

.w-k { color: #94a3b8; font-family: 'Inter', sans-serif; }
.w-v { color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-weight: 700; }

.warranty-note {
  font-family: 'Inter', sans-serif;
  font-size: 4.8pt;
  color: #64748b;
  line-height: 1.3;
}

/* Index Page Table */
.index-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;
}

.index-cat-card {
  background: rgba(14, 18, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}

.index-cat-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 7pt;
  font-weight: 800;
  color: #00f0ff;
  letter-spacing: 1px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 3px;
}

.index-item-row {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 6.5pt;
  color: #cbd5e1;
  padding: 2px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.index-item-pno {
  color: #00f0ff;
  font-weight: 700;
}
`;

function buildCoverPage() {
  return `
  <div class="catalog-page" id="page-1">
    <img src="${heroCoverImgUrl}" alt="Z8 Cover Hero" class="bg-layer">
    <div class="bg-dark-overlay" style="background: linear-gradient(135deg, rgba(8, 10, 14, 0.94) 0%, rgba(8, 10, 14, 0.4) 50%, rgba(8, 10, 14, 0.95) 100%);"></div>

    <div class="page-content-wrap" style="justify-content: space-between;">
      <div class="brand-top-row">
        <img src="${logoZ8MainUrl}" alt="Z8 E-Motion" style="height: 38px;">
        <span class="brand-badge-pill">⚡ CONCESSÕES 2026 // LINHA COMPLETA</span>
      </div>

      <div style="max-width: 720px; margin-top: 20px;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <span class="dynamic-pill accent">CATÁLOGO OFICIAL DE PRODUTOS 2026</span>
          <span class="dynamic-pill">SENATRAN RES. 996</span>
        </div>

        <h1 class="monumental-headline" style="font-size: 42pt;">
          MOBILIDADE<br>
          <span>ELÉTRICA DE ALTA</span><br>
          PERFORMANCE
        </h1>

        <p class="monumental-sub" style="margin-top: 14px; font-size: 11pt;">
          Engenharia de precisão, baterias automotivas LiFePO4 de 5.000 ciclos e cobertura integral de garantia legal nacional (CDC).
          A linha mais completa do mercado brasileiro com padrão internacional de qualidade.
        </p>

        <div class="dynamic-pills-row" style="margin-top: 18px;">
          <span class="dynamic-pill">✦ 100% REGULAMENTADO CONTRAN 996</span>
          <span class="dynamic-pill">⚡ REDE DE CONCESSIONÁRIAS</span>
          <span class="dynamic-pill">🛡️ PDI E REVISÕES HOMOLOGADAS</span>
          <span class="dynamic-pill">🔋 BATERIAS LiFePO4 DE ALTA DENSIDADE</span>
        </div>
      </div>

      <div class="footer-clean" style="background: rgba(8, 10, 14, 0.85); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 6px;">
        <span>Z8 EMOTION LTDA. • SÃO JOSÉ DOS CAMPOS - SP • CNPJ 68.774.164/0001-00</span>
        <span class="domain">Z8EMOTION.COM</span>
      </div>
    </div>
  </div>`;
}

function buildSpreadPage(pageNumber, bgImgUrl, tagText, titleHtml, textDesc, cardsArray) {
  const cardsHtml = cardsArray.map((c, i) => `
    <div class="editorial-card ${i === 0 ? 'highlight' : ''}">
      <div class="card-label">PILAR ${String(i + 1).padStart(2, '0')} // Z8</div>
      <div class="card-title">${c.title}</div>
      <div class="card-desc">${c.desc}</div>
    </div>
  `).join('');

  return `
  <div class="catalog-page" id="page-${pageNumber}">
    ${bgImgUrl ? `<img src="${bgImgUrl}" alt="Background" class="bg-layer">` : ''}
    <div class="bg-dark-overlay"></div>

    <div class="page-content-wrap">
      <div class="brand-top-row">
        <img src="${logoZ8MainUrl}" alt="Z8 E-Motion" style="height: 28px;">
        <span class="brand-badge-pill">PÁG. ${String(pageNumber).padStart(2, '0')} // DIRETRIZES OFICIAIS</span>
      </div>

      <div style="max-width: 780px;">
        <span class="dynamic-pill accent" style="margin-bottom: 10px;">${tagText}</span>
        <h2 class="monumental-headline" style="font-size: 32pt; margin-top: 8px; margin-bottom: 12px;">
          ${titleHtml}
        </h2>
        <p class="monumental-sub">
          ${textDesc}
        </p>

        <div class="editorial-cards-grid">
          ${cardsHtml}
        </div>
      </div>

      <div class="footer-clean" style="background: rgba(8, 10, 14, 0.85); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 6px;">
        <span>Z8 E-MOTION // SISTEMA NACIONAL DE CONCESSÕES • POLÍTICA DE GARANTIA 2026</span>
        <span class="domain">Z8EMOTION.COM</span>
      </div>
    </div>
  </div>`;
}

function buildIndexPage(pageNumber) {
  return `
  <div class="catalog-page" id="page-${pageNumber}">
    <img src="${tankPaulistaImgUrl}" alt="Performance" class="bg-layer">
    <div class="bg-dark-overlay"></div>

    <div class="page-content-wrap">
      <div class="brand-top-row">
        <img src="${logoZ8MainUrl}" alt="Z8 E-Motion" style="height: 28px;">
        <span class="brand-badge-pill">ÍNDICE GERAL // LINE-UP 2026</span>
      </div>

      <div>
        <span class="dynamic-pill accent" style="margin-bottom: 8px;">CATÁLOGO COMPLETO</span>
        <h2 class="monumental-headline" style="font-size: 28pt; margin-top: 6px; margin-bottom: 10px;">
          ÍNDICE DE <span>VEÍCULOS & HOMOLOGAÇÕES</span>
        </h2>

        <div class="index-grid">
          <div class="index-cat-card">
            <div class="index-cat-title">LINHA PERFORMANCE (PÁGS. 10 - 12)</div>
            <div class="index-item-row"><span>SKYLEGE GT</span><span class="index-item-pno">PAG 10</span></div>
            <div class="index-item-row"><span>X-ONE Q FLAGSHIP</span><span class="index-item-pno">PAG 11</span></div>
            <div class="index-item-row"><span>THUNDER PROJECTOR</span><span class="index-item-pno">PAG 12</span></div>
          </div>

          <div class="index-cat-card">
            <div class="index-cat-title">LINHA URBANA (PÁGS. 14 - 23)</div>
            <div class="index-item-row"><span>MAX COMFORT (DB039)</span><span class="index-item-pno">PAG 14</span></div>
            <div class="index-item-row"><span>BLITZ SPORT (DB045)</span><span class="index-item-pno">PAG 15</span></div>
            <div class="index-item-row"><span>DRIFT 72V</span><span class="index-item-pno">PAG 16</span></div>
            <div class="index-item-row"><span>T5 COMPACT</span><span class="index-item-pno">PAG 17</span></div>
            <div class="index-item-row"><span>SPEED HYDRAULIC</span><span class="index-item-pno">PAG 18</span></div>
            <div class="index-item-row"><span>NAVIGATOR COCKPIT</span><span class="index-item-pno">PAG 19</span></div>
            <div class="index-item-row"><span>COWBOY ADVENTURE</span><span class="index-item-pno">PAG 20</span></div>
            <div class="index-item-row"><span>GT-S AERO</span><span class="index-item-pno">PAG 21</span></div>
            <div class="index-item-row"><span>VISIONARY NFC</span><span class="index-item-pno">PAG 22</span></div>
            <div class="index-item-row"><span>STORM MONOSHOCK</span><span class="index-item-pno">PAG 23</span></div>
          </div>

          <div class="index-cat-card">
            <div class="index-cat-title">LINHA RETRÔ & TRICICLOS (25 - 30)</div>
            <div class="index-item-row"><span>DIAMOND LUXE (DB050)</span><span class="index-item-pno">PAG 25</span></div>
            <div class="index-item-row"><span>Q11 COMPACT</span><span class="index-item-pno">PAG 26</span></div>
            <div class="index-item-row"><span>Q10 VINTAGE (DB038)</span><span class="index-item-pno">PAG 27</span></div>
            <div class="index-item-row"><span>GS-005 BASE NORTE</span><span class="index-item-pno">PAG 29</span></div>
            <div class="index-item-row"><span>Q-STAR III CARGO</span><span class="index-item-pno">PAG 30</span></div>
          </div>

          <div class="index-cat-card" style="grid-column: span 3;">
            <div class="index-cat-title">LINHA BIKES & CARGO ELÉTRICO (PÁGS. 32 - 46)</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
              <div class="index-item-row"><span>L10 MAX FAT-TIRE</span><span class="index-item-pno">PAG 32</span></div>
              <div class="index-item-row"><span>L10 MAX S DUAL</span><span class="index-item-pno">PAG 33</span></div>
              <div class="index-item-row"><span>TANK HIGH-SPEED</span><span class="index-item-pno">PAG 34</span></div>
              <div class="index-item-row"><span>L40 PLUS EXTENDED</span><span class="index-item-pno">PAG 35</span></div>
              <div class="index-item-row"><span>FX-10 SPORT (DB043)</span><span class="index-item-pno">PAG 36</span></div>
              <div class="index-item-row"><span>HAPPY CITY</span><span class="index-item-pno">PAG 37</span></div>
              <div class="index-item-row"><span>STREET BLUETOOTH</span><span class="index-item-pno">PAG 38</span></div>
              <div class="index-item-row"><span>STREET-S DUAL</span><span class="index-item-pno">PAG 39</span></div>
              <div class="index-item-row"><span>STREET MINI</span><span class="index-item-pno">PAG 40</span></div>
              <div class="index-item-row"><span>URBAN SCRAMBLER</span><span class="index-item-pno">PAG 41</span></div>
              <div class="index-item-row"><span>URBAN-S 120KM</span><span class="index-item-pno">PAG 42</span></div>
              <div class="index-item-row"><span>STAR SPORT RACK</span><span class="index-item-pno">PAG 43</span></div>
              <div class="index-item-row"><span>HARLEY X21 CUSTOM</span><span class="index-item-pno">PAG 44</span></div>
              <div class="index-item-row"><span>V20 ULTRA S 30AH</span><span class="index-item-pno">PAG 45</span></div>
              <div class="index-item-row"><span>U2 DELIVERY CARGO</span><span class="index-item-pno">PAG 46</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-clean" style="background: rgba(8, 10, 14, 0.85); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 6px;">
        <span>Z8 E-MOTION // SISTEMA NACIONAL DE CONCESSÕES • POLÍTICA DE GARANTIA 2026</span>
        <span class="domain">Z8EMOTION.COM</span>
      </div>
    </div>
  </div>`;
}

function buildProductPage(prod) {
  const pageNum = prod.page;
  const pKey = String(pageNum);
  const assets = vehicleAssetsMap[pKey] || { hero: null, details: [], vignettes: [] };

  // Fallback hero if needed
  const heroUrl = assets.hero ? toFileUrl(assets.hero) : toFileUrl(path.join(rawImagesDir, `p${String(pageNum).padStart(2, '0')}_img02_728x1269.jpeg`));
  const detailUrl = assets.details.length > 0 ? toFileUrl(assets.details[0]) : '';
  const vigUrls = assets.vignettes.map(v => toFileUrl(v));

  const z8Alias = Z8_COUNTERPARTS[pageNum] || `Z8 ${prod.name} // LINHA ${prod.family}`;

  return `
  <div class="catalog-page" id="page-${pageNum}">
    <div class="product-page-layout">
      <!-- Left Column: Hero & Model Title -->
      <div class="product-left-col">
        <div>
          <div class="brand-header">
            <img src="${logoZ8MainUrl}" alt="Z8" class="brand-logo">
            <span class="cat-badge">LINHA ${prod.family}</span>
          </div>
          <h2 class="model-title">${prod.name}</h2>
          <div class="model-sub">${z8Alias}</div>
        </div>

        <div class="hero-box">
          <img src="${heroUrl}" alt="${prod.name}" class="hero-img">
        </div>

        <div class="colors-pill">
          ⚡ CONSULTE AS CORES DISPONÍVEIS NA REDE Z8 • TEST-RIDE VIP AGENDADO
        </div>
      </div>

      <!-- Right Column: Visuals Strip, Telemetry Grid & Official Warranty Box -->
      <div class="product-right-col">
        <!-- Visuals Strip -->
        <div class="visuals-strip">
          <div class="vignettes-group">
            ${vigUrls.map(u => `<div class="vignette-circle"><img src="${u}"></div>`).join('')}
          </div>

          ${detailUrl ? `<div class="cutout-box"><img src="${detailUrl}"></div>` : ''}

          <div class="homolog-badge">
            <span class="homolog-tag">PADRÃO OFICIAL 2026</span>
            <span class="homolog-sub">SENATRAN RES. 996 // CHASSI RASTREÁVEL</span>
            <span class="homolog-sub" style="color: #00f0ff;">REDE OFICIAL COM 2 ELEVADORES</span>
          </div>
        </div>

        <!-- 12-Item Technical Specs Grid -->
        <div class="specs-grid">
          <div class="spec-card"><span class="spec-lbl">⚡ MOTOR</span><span class="spec-val">${prod.motor}</span></div>
          <div class="spec-card"><span class="spec-lbl">🔋 BATERIA</span><span class="spec-val">${prod.bateria}</span></div>
          <div class="spec-card"><span class="spec-lbl">🕹️ CONTROLADOR</span><span class="spec-val">${prod.controlador}</span></div>
          <div class="spec-card"><span class="spec-lbl">🛑 FREIO</span><span class="spec-val">${prod.freio}</span></div>
          <div class="spec-card"><span class="spec-lbl">🛞 PNEU</span><span class="spec-val">${prod.pneu}</span></div>
          <div class="spec-card"><span class="spec-lbl">⏱️ VELOCIDADE</span><span class="spec-val">${prod.velocidade}</span></div>
          <div class="spec-card"><span class="spec-lbl">🔌 CARREGADOR</span><span class="spec-val">${prod.carregador}</span></div>
          <div class="spec-card"><span class="spec-lbl">🛣️ AUTONOMIA</span><span class="spec-val">${prod.autonomia}</span></div>
          <div class="spec-card"><span class="spec-lbl">🏋️ CARGA</span><span class="spec-val">${prod.carga}</span></div>
          <div class="spec-card"><span class="spec-lbl">📐 TAMANHO</span><span class="spec-val">${prod.tamanho}</span></div>
          <div class="spec-card"><span class="spec-lbl">📏 ENTRE-EIXOS</span><span class="spec-val">${prod.entre_eixos}</span></div>
          <div class="spec-card"><span class="spec-lbl">📶 CHAVE / ALARME</span><span class="spec-val">NFC Presencial + Alarme</span></div>
        </div>

        <!-- Z8 Official Legal Warranty Box -->
        <div class="warranty-card">
          <div class="warranty-header">
            <div class="warranty-title">🛡️ GARANTIA LEGAL Z8 EMOTION LTDA.</div>
            <div class="warranty-chip">ART. 26, II - LEI 8.078/90 (CDC)</div>
          </div>
          <div class="warranty-grid">
            <div class="w-row"><span class="w-k">Quadro & Chassi:</span><span class="w-v">90 Dias (Legal)</span></div>
            <div class="w-row"><span class="w-k">Motor BLDC:</span><span class="w-v">90 Dias (Legal)</span></div>
            <div class="w-row"><span class="w-k">Bateria LiFePO4:</span><span class="w-v">90 Dias (Legal)</span></div>
            <div class="w-row"><span class="w-k">Controlador FOC:</span><span class="w-v">90 Dias (Legal)</span></div>
            <div class="w-row"><span class="w-k">Carregador Inteligente:</span><span class="w-v">90 Dias (Legal)</span></div>
            <div class="w-row"><span class="w-k">Montagem / PDI:</span><span class="w-v">90 Dias (Legal)</span></div>
          </div>
          <p class="warranty-note">
            *Garantia estritamente legal de 90 dias corridos nos termos do Art. 26, II da Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor). Válida mediante apresentação da Nota Fiscal com Chassi e Checklist de PDI assinado. Exclusões expressas: Shunt mod/P-settings, corte de chicote, lavagem sob alta pressão e inanição por abandono.
          </p>
        </div>

        <div class="footer-clean" style="padding-top: 4px;">
          <span>Z8 E-MOTION MOBILIDADE ELÉTRICA BRASIL • CNPJ 68.774.164/0001-00</span>
          <span class="domain">Z8EMOTION.COM</span>
        </div>
      </div>
    </div>
  </div>`;
}

function buildAllPagesHtml() {
  const pagesHtml = [];

  // P01: Cover
  pagesHtml.push(buildCoverPage());

  // P02: A Força por Trás da Marca
  pagesHtml.push(buildSpreadPage(
    2,
    warehouseImgUrl,
    'ENGENHARIA E OPERAÇÃO INDUSTRIAL',
    'A FORÇA POR TRÁS DA <span>MARCA Z8</span>',
    'Enquanto muitos vendem produtos, nós construímos uma operação nacional sólida. Nossa cadeia produtiva conecta engenharia mecatrônica, tecnologia de ponta, controle rigoroso de qualidade (PDI) e capacidade industrial de alta escala.',
    [
      { title: 'PRODUÇÃO HOMOLOGADA', desc: 'Linhas automatizadas com controle de qualidade em 25 pontos de inspeção mecânica e elétrica.' },
      { title: 'PÓS-VENDA DEDICADO', desc: 'Oficinas credenciadas com padrão de 2 elevadores hidráulicos/pneumáticos obrigatórios por loja.' },
      { title: 'MATRIZ SÃO JOSÉ DOS CAMPOS', desc: 'Sede corporativa no maior polo aeroespacial e tecnológico do Brasil (Av. Dr. Adhemar de Barros, 566).' }
    ]
  ));

  // P03: Números que Movem o Futuro & Concessionárias
  pagesHtml.push(buildSpreadPage(
    3,
    sjcImgUrl,
    'ESCALA E CREDIBILIDADE',
    'NÚMEROS QUE <span>MOVEM O FUTURO</span>',
    'Mais do que veículos elétricos, entregamos autonomia, rentabilidade comprovada e inovação para transformar a mobilidade urbana no Brasil com segurança jurídica e pós-venda impecável.',
    [
      { title: '+30 MODELOS HOMOLOGADOS', desc: 'Linha completa desenvolvida para todas as necessidades urbanas, recreativas e comerciais.' },
      { title: 'ESTOQUE CENTRAL DE PEÇAS', desc: 'Chicotes, módulos BMS, controladores FOC e baterias LiFePO4 a pronta entrega.' },
      { title: 'RECARGA R$ 1,80 A R$ 2,50', desc: 'Economia brutal de até R$ 5.400/ano comparado a veículos convencionais a gasolina.' }
    ]
  ));

  // P04: Quem Somos
  pagesHtml.push(buildSpreadPage(
    4,
    n95cSideImgUrl,
    'PROPÓSITO E TECNOLOGIA',
    'QUEM SOMOS // <span>MOBILIDADE COM PROPÓSITO</span>',
    'A Z8 E-Motion nasceu para transformar o transporte urbano através da tecnologia limpa, do design esportivo e da liberdade sustentável. Parceria de engenharia global com mais de 25 anos de tradição em veículos elétricos.',
    [
      { title: 'CAPACIDADE GLOBAL', desc: 'Milhões de veículos elétricos montados com certificação técnica e padrão mundial de manufatura.' },
      { title: 'CONTRAN 996 INTEGRAL', desc: 'Veículos 100% harmonizados com a legislação de trânsito brasileira para circulação segura.' },
      { title: 'SUSTENTABILIDADE REAL', desc: 'Zero emissão de poluentes na atmosfera e emissão de ruído nula para cidades limpas.' }
    ]
  ));

  // P05: Bateria LiFePO4
  pagesHtml.push(buildSpreadPage(
    5,
    '',
    'ENGENHARIA DE BATERIAS',
    'POR QUE A BATERIA <span>LiFePO4 É SUPERIOR?</span>',
    'Utilizamos exclusivamente células automotivas de Fosfato de Ferro-Lítio (LiFePO4). Máxima densidade de potência, resistência térmica comprovada e a maior vida útil do mercado.',
    [
      { title: '2.000 A 5.000 CICLOS', desc: 'Até 5x mais vida útil que o lítio comum (2 a 4 anos vs 5 a 10 anos de uso contínuo).' },
      { title: 'SEGURANÇA TÉRMICA TOTAL', desc: 'Química estável imune a superaquecimento e fuga térmica, mesmo em altas temperaturas.' },
      { title: 'DESEMPENHO ESTÁVEL', desc: 'Entrega de voltagem linear sem perdas bruscas de aceleração ou velocidade em aclives.' }
    ]
  ));

  // P06: Suporte e Pós-Venda
  pagesHtml.push(buildSpreadPage(
    6,
    '',
    'SUPORTE E REDE AUTORIZADA',
    'PÓS-VENDA DEDICADO // <span>SEMPRE COM VOCÊ</span>',
    'Oferecemos confiança em cada etapa da jornada. Nossa rede de oficinas conta com mecânicos treinados na fábrica e suporte técnico permanente com laudos em 72h.',
    [
      { title: 'ATENDIMENTO ESPECIALIZADO', desc: 'Consultoria ágil via plataforma digital e concierge de suporte ao proprietário e frotista.' },
      { title: 'OFICINA COM 2 ELEVADORES', desc: 'Estrutura técnica padronizada para diagnóstico elétrico e manutenção rápida de PDI.' },
      { title: 'RASTREABILIDADE DE CHASSI', desc: 'Controle individual de cada motocicleta com histórico completo de revisões no sistema.' }
    ]
  ));

  // P07: Filosofia Z8
  pagesHtml.push(buildSpreadPage(
    7,
    harleyCarvalhoImgUrl,
    'FILOSOFIA DA MARCA',
    'O PODER DA <span>ENERGIA LIMPA</span>',
    'Mais do que veículos, entregamos uma nova forma de viver a cidade. Eficiência financeira incomparável, zero emissões e a emoção da aceleração instantânea silenciosa.',
    [
      { title: 'LIBERDADE URBANA', desc: 'Fuja do trânsito com agilidade, sem depender de postos de combustível ou combustíveis fósseis.' },
      { title: 'EFICIÊNCIA MÁXIMA', desc: 'Recarregue na tomada comum de casa (110V/220V) enquanto descansa por centavos de real.' },
      { title: 'LIDERANÇA REGIONAL', desc: 'Seja parte da revolução sustentável com a marca que mais cresce no setor de mobilidade.' }
    ]
  ));

  // P08: Divisor Linha Performance
  pagesHtml.push(buildSpreadPage(
    8,
    tankPaulistaImgUrl,
    'CATEGORIA EXECUTIVA',
    'LINHA <span>PERFORMANCE</span>',
    'Modelos de alta cilindrada equivalente, suspensões pressurizadas duplas, iluminação full LED de alta intensidade e aceleração instantânea de nível esportivo.',
    [
      { title: 'SKYLEGE GT', desc: 'Maxi-scooter de alta velocidade com chassi reforçado e bauleto executivo.' },
      { title: 'X-ONE Q', desc: 'Design agressivo com amortecedores duplos e frenagem a disco ventilado.' },
      { title: 'THUNDER', desc: 'Projetor esportivo e cockpit digital completo com autonomia estendida.' }
    ]
  ));

  // P09: Índice Geral
  pagesHtml.push(buildIndexPage(9));

  // P10, P11, P12: Performance Models
  pagesHtml.push(buildProductPage(productsByPage[10]));
  pagesHtml.push(buildProductPage(productsByPage[11]));
  pagesHtml.push(buildProductPage(productsByPage[12]));

  // P13: Divisor Linha Urbana
  pagesHtml.push(buildSpreadPage(
    13,
    n710FariaLimaImgUrl,
    'USO DIÁRIO & AGILIDADE',
    'LINHA <span>URBANA</span>',
    'Scooters compactas, leves e manobráveis. A solução definitiva para o trânsito das grandes capitais e cidades médias do Brasil com autonomia de sobra.',
    [
      { title: 'MAX COMFORT', desc: 'Design executivo com assento anatômico duplo e encosto de passageiro.' },
      { title: 'BLITZ SPORT', desc: 'Ciclística ágil com grafismos esportivos e chave presencial NFC.' },
      { title: 'NAVIGATOR & DRIFT', desc: 'Alta tecnologia embarcada com painéis digitais de última geração.' }
    ]
  ));

  // P14 a P23: Urbana Models
  for (let p = 14; p <= 23; p++) {
    pagesHtml.push(buildProductPage(productsByPage[p]));
  }

  // P24: Divisor Linha Retrô
  pagesHtml.push(buildSpreadPage(
    24,
    q10MadalenaImgUrl,
    'ESTILO CLÁSSICO & ELEGÂNCIA',
    'LINHA <span>RETRÔ</span>',
    'Linhas curvas clássicas inspiradas na era de ouro do design europeu, unidas à propulsão 100% elétrica silenciosa e tecnologia moderna.',
    [
      { title: 'DIAMOND LUXE', desc: 'Acabamentos cromados, farol arredondado clássico e assento premium.' },
      { title: 'Q11 COMPACT', desc: 'Cores pastéis contemporâneas com pintura perolizada de alto brilho.' },
      { title: 'Q10 VINTAGE', desc: 'O charme retrô autêntico com autonomia moderna de até 80 km.' }
    ]
  ));

  // P25 a P27: Retrô Models
  for (let p = 25; p <= 27; p++) {
    pagesHtml.push(buildProductPage(productsByPage[p]));
  }

  // P28: Divisor Linha Triciclos
  pagesHtml.push(buildSpreadPage(
    28,
    gs005StudioImgUrl,
    'ESTABILIDADE & UTILIDADE',
    'LINHA <span>TRICICLOS</span>',
    'Segurança máxima com 3 rodas, caçamba de transporte ou assentos ampliados para mobilidade sênior, condomínios fechados e pequenas cargas.',
    [
      { title: 'EQUILÍBRIO TOTAL', desc: 'Zero risco de tombamento com marcha ré elétrica e freio de estacionamento.' },
      { title: 'CAPACIDADE DE CARGA', desc: 'Espaço versátil para compras, ferramentas ou transporte de passageiros.' },
      { title: 'FÁCIL CONDUÇÃO', desc: 'Controle de aceleração suave com modos de velocidade pré-configurados.' }
    ]
  ));

  // P29 a P30: Triciclos Models
  pagesHtml.push(buildProductPage(productsByPage[29]));
  pagesHtml.push(buildProductPage(productsByPage[30]));

  // P31: Divisor Linha Bikes
  pagesHtml.push(buildSpreadPage(
    31,
    harleyCarvalhoImgUrl,
    'LIBERDADE, AUTONOMIA & ESTILO',
    'LINHA <span>BIKES & CHOPPERS</span>',
    'Fat-tires todo-terreno, pedaleiras custom, caixas de som bluetooth integradas e baterias duplas para até 120 km de autonomia.',
    [
      { title: 'FAT-TIRE SCRAMBLER', desc: 'Pneus largos 20x4.0 para rodar com maciez no asfalto, areia ou terra.' },
      { title: 'HARLEY X21 CUSTOM', desc: 'Visual chopper americano com guidão elevado e presença imponente.' },
      { title: 'U2 DELIVERY CARGO', desc: 'Plataforma reforçada para frotas de logística e entregas de último quilômetro.' }
    ]
  ));

  // P32 a P46: Bikes Models
  for (let p = 32; p <= 46; p++) {
    pagesHtml.push(buildProductPage(productsByPage[p]));
  }

  // P47: Equipamentos Homologados & Conclusão
  pagesHtml.push(buildSpreadPage(
    47,
    warehouseImgUrl,
    'EQUIPAMENTOS HOMOLOGADOS',
    'SEGURANÇA INTEGRAL // <span>ACESSÓRIOS Z8</span>',
    'Para rodar com tranquilidade, a Z8 homologa uma linha completa de capacetes certificados pelo INMETRO, capas de proteção e carregadores inteligentes originais.',
    [
      { title: 'CERTIFICAÇÃO INMETRO', desc: 'Capacetes abertos e fechados das melhores marcas homologadas pelo trânsito.' },
      { title: 'CARREGADORES INTELIGENTES', desc: 'Sistemas com desligamento automático e proteção contra surtos elétricos.' },
      { title: 'REDE AUTORIZADA NACIONAL', desc: 'Acesso prioritário a revisões periódicas com carimbo de PDI no manual do proprietário.' }
    ]
  ));

  // P48: Contracapa Oficial
  pagesHtml.push(`
  <div class="catalog-page" id="page-48">
    <div class="bg-dark-overlay" style="background: radial-gradient(circle at 50% 50%, #0d121c 0%, #080a0e 100%);"></div>

    <div class="page-content-wrap" style="align-items: center; justify-content: center; text-align: center;">
      <div style="max-width: 600px;">
        <img src="${logoMinimalistaUrl}" alt="Z8 Logo 3D" style="height: 70px; margin-bottom: 24px; filter: drop-shadow(0 10px 20px rgba(0, 240, 255, 0.2));">
        
        <div style="display: inline-block; margin-bottom: 14px;">
          <span class="dynamic-pill accent">MOBILIDADE ELÉTRICA BRASIL</span>
        </div>

        <h2 class="monumental-headline" style="font-size: 36pt; margin-bottom: 16px;">
          A ESCOLHA <span>INTELIGENTE</span>
        </h2>

        <p class="monumental-sub" style="margin: 0 auto 24px auto; font-size: 10pt; color: #94a3b8;">
          Z8 EMOTION LTDA. • CNPJ 68.774.164/0001-00<br>
          Avenida Doutor Adhemar de Barros, nº 566, Jardim São Dimas<br>
          São José dos Campos - SP • CEP 12.245-010<br>
          Foro de Eleição: Comarca de São José dos Campos - SP
        </p>

        <div style="display: flex; justify-content: center; gap: 16px; align-items: center;">
          <span class="dynamic-pill">📷 @Z8EMOTION</span>
          <span class="dynamic-pill accent">Z8EMOTION.COM</span>
        </div>

        <div style="margin-top: 36px; font-family: 'JetBrains Mono', monospace; font-size: 6pt; color: #475569;">
          © 2026 Z8 E-MOTION LTDA. • TODOS OS DIREITOS RESERVADOS • POLÍTICA NACIONAL DE GARANTIA & PÓS-VENDA
        </div>
      </div>
    </div>
  </div>`);

  return pagesHtml.join('\n');
}

async function run() {
  console.log('🚀 Iniciando compilação do Catálogo Oficial Z8 E-Motion 2026 (48 Páginas Paisagem)...');

  const allPages = buildAllPagesHtml();
  const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Catálogo Oficial de Produtos & Garantia 2026 - Z8 E-Motion</title>
  <style>
    ${CSS_STYLES}
  </style>
</head>
<body>
  ${allPages}
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, fullHtml, 'utf8');
  console.log(`✅ HTML do Catálogo compilado (${(fs.statSync(outputHtmlPath).size / 1024).toFixed(1)} KB)`);

  const browserPath = getBrowserPath();
  console.log(`🖨️ Renderizando PDF via Edge/Chrome Headless (${browserPath})...`);

  // Render to primary destination
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "${outputHtmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  const pdfSize = fs.statSync(outputPdfPath).size;
  console.log(`🎉 PDF Principal Gerado com Sucesso: ${outputPdfPath} (${(pdfSize / 1024).toFixed(1)} KB)`);

  // Mirror to public/docs and secondary paths
  fs.copyFileSync(outputPdfPath, mirrorPdfPath);
  console.log(`   -> Espelhado para: ${mirrorPdfPath}`);

  fs.copyFileSync(outputPdfPath, mirrorPdfPath2);
  console.log(`   -> Espelhado para: ${mirrorPdfPath2}`);

  fs.copyFileSync(outputPdfPath, mirrorPdfPath3);
  console.log(`   -> Espelhado para: ${mirrorPdfPath3}`);

  console.log('✨ Operação Concluída com Sucesso!');
}

run().catch(err => {
  console.error('❌ Erro na execução:', err);
  process.exit(1);
});
