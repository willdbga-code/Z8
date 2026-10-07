import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { z8Models } from '../site-principal/data/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pagesDir = path.resolve(rootDir, 'scratch', 'catalog_html_pages');
const outputImgDir = path.resolve(rootDir, 'public', 'assets', 'catalogo');

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
  'z8-harley-x21': 'SOM BLUETOOTH NATIVO // CHOPPER CUSTOM',
  'z8-u2-delivery': 'BASE REFORÇADA P/ BAÚ // HEAVY-DUTY CARGA',
  'z8-n95c': 'ASSENTO DUPLO MACIO // PNEUS LARGOS 130MM',
  'z8-n7': 'MAIOR GIRO COMERCIAL // FÁCIL PILOTAGEM',
  'z8-q10': 'INSPIRAÇÃO ITALIANA // DESIGN CLÁSSICO RETRÔ',
  'z8-n710': 'LANÇAMENTO 2026 // TECNOLOGIA INTEGRADA',
  'z8-q11': 'BAÚ TRASEIRO INTEGRADO // LEVE & ÁGIL',
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
  quality: `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`,
  economy: `<svg viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
  eco: `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.75C6.2 7.58 4.7 9.4 4.09 11.41 7.2 9.5 13 8 17 8z"/></svg>`
};

function formatCurrency(val) {
  return val.toLocaleString('pt-BR');
}

// Common CSS Header com as Cores Oficiais da Marca Z8
const COMMON_CSS = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800;1,900&family=Orbitron:wght@700;800;900&display=swap" rel="stylesheet">
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
    }

    /* Top Left Dynamic Sports Stripes - Paleta Oficial Z8 (Cyan, Lime Green & Black Piano) */
    .top-stripes {
      position: absolute;
      top: 0;
      left: 0;
      width: 480px;
      height: 160px;
      overflow: hidden;
      z-index: 10;
      pointer-events: none;
    }

    .stripe-thick-cyan {
      position: absolute;
      width: 500px;
      height: 48px;
      background: #00E5FF;
      transform: rotate(-35deg) translate(-100px, 30px);
      box-shadow: 0 4px 18px rgba(0, 229, 255, 0.4);
    }

    .stripe-thin-lime {
      position: absolute;
      width: 500px;
      height: 10px;
      background: #22C55E;
      transform: rotate(-35deg) translate(-120px, 78px);
      box-shadow: 0 2px 10px rgba(34, 197, 94, 0.4);
    }

    .stripe-thin-dark {
      position: absolute;
      width: 500px;
      height: 6px;
      background: #0A0B0E;
      transform: rotate(-35deg) translate(-130px, 98px);
    }

    /* Top Left Logo Area */
    .top-logo-badge {
      position: absolute;
      top: 28px;
      left: 160px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 16px;
      background: #FFFFFF;
      padding: 10px 24px;
      border-radius: 9999px;
      box-shadow: 0 4px 20px rgba(0, 44, 95, 0.08);
      border: 1.5px solid #E2E8F0;
    }

    .top-logo-img {
      height: 44px;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
    }

    .top-brand-text {
      display: flex;
      flex-direction: column;
    }

    .top-brand-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #0A0B0E;
      letter-spacing: 2px;
      line-height: 1.1;
    }

    .top-brand-sub {
      font-size: 10px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    /* Top Right Halftone Matrix */
    .top-halftone {
      position: absolute;
      top: 0;
      right: 0;
      width: 320px;
      height: 220px;
      background-image: radial-gradient(circle, #CBD5E1 1.8px, transparent 2px);
      background-size: 14px 14px;
      mask-image: radial-gradient(ellipse at top right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%);
      -webkit-mask-image: radial-gradient(ellipse at top right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%);
      z-index: 5;
      pointer-events: none;
    }

    .page-indicator {
      position: absolute;
      top: 36px;
      right: 60px;
      z-index: 20;
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #94A3B8;
      letter-spacing: 2px;
    }

    /* Main Container */
    .catalog-main {
      display: flex;
      width: 100%;
      height: 100%;
      padding-top: 100px;
      padding-bottom: 140px;
    }

    /* Left Column: Motorcycle Hero */
    .hero-stage {
      flex: 1.15;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 55px;
      padding-right: 25px;
    }

    .bike-showcase-container {
      position: relative;
      width: 760px;
      height: 720px;
      border-radius: 32px;
      overflow: hidden;
      background: radial-gradient(circle at center, #1A212E 0%, #0A0B0E 100%);
      border: 2px solid rgba(0, 229, 255, 0.4);
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 35px rgba(0, 229, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bike-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transform: scale(1.04);
    }

    .bike-badge-overlay {
      position: absolute;
      bottom: 28px;
      left: 28px;
      background: rgba(10, 11, 14, 0.92);
      backdrop-filter: blur(8px);
      border: 1.5px solid #00E5FF;
      color: #FFFFFF;
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 8;
    }

    .bike-badge-overlay .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00E5FF;
      box-shadow: 0 0 8px #00E5FF;
    }

    /* Right Column: Telemetry & Specs */
    .telemetry-column {
      flex: 1;
      padding-right: 70px;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 10;
    }

    .model-header {
      margin-bottom: 24px;
      position: relative;
    }

    .model-tag-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .pill-modelo {
      background: #00E5FF;
      color: #0A0B0E;
      font-size: 15px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 6px 20px;
      border-radius: 9999px;
      box-shadow: 0 2px 10px rgba(0, 229, 255, 0.35);
    }

    .model-line-accent {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, #00E5FF 0%, #22C55E 100%);
      opacity: 0.8;
    }

    .model-title-monumental {
      font-size: 78px;
      font-weight: 900;
      line-height: 0.95;
      text-transform: uppercase;
      letter-spacing: -1px;
      color: #0A0B0E;
      margin-top: 4px;
    }

    .model-title-monumental span {
      color: #008CA8;
    }

    .model-tag-sub {
      font-size: 15px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 8px;
    }

    .specs-bar {
      background: #0A0B0E;
      border-radius: 9999px;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 5px solid #00E5FF;
    }

    .specs-bar-title {
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .specs-bar-slashes {
      color: #00E5FF;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 18px;
      padding-bottom: 10px;
      border-bottom: 1.5px solid rgba(0, 140, 168, 0.2);
    }

    .spec-icon-box {
      width: 48px;
      height: 48px;
      min-width: 48px;
      background: #0A0B0E;
      border: 1px solid rgba(0, 229, 255, 0.35);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }

    .spec-icon-box svg {
      width: 26px;
      height: 26px;
      fill: #00E5FF;
    }

    .spec-text-block {
      display: flex;
      flex-direction: column;
    }

    .spec-label {
      font-size: 13px;
      font-weight: 900;
      color: #008CA8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .spec-val {
      font-size: 17px;
      font-weight: 800;
      color: #0A0B0E;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Bottom Bar */
    .bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120px;
      background: #0A0B0E;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 70px 0 60px;
      border-top: 4px solid #00E5FF;
      z-index: 50;
    }

    .trust-badges {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .trust-badge-item {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .trust-icon-wrap {
      width: 42px;
      height: 42px;
      border: 2px solid #00E5FF;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.05);
    }

    .trust-icon-wrap svg {
      width: 22px;
      height: 22px;
      fill: #00E5FF;
    }

    .trust-text {
      display: flex;
      flex-direction: column;
    }

    .trust-t1 {
      font-size: 13px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .trust-t2 {
      font-size: 11px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .price-tag-container {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #14171F;
      padding: 8px 24px 8px 12px;
      border-radius: 20px;
      border: 1.5px solid rgba(0, 229, 255, 0.4);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
    }

    .price-pill-label {
      background: #00E5FF;
      color: #0A0B0E;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 10px 18px;
      border-radius: 14px;
      transform: skewX(-10deg);
    }

    .price-value-wrap {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .price-currency {
      font-size: 26px;
      font-weight: 900;
      color: #FFFFFF;
    }

    .price-amount {
      font-size: 52px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -1px;
      line-height: 1;
    }

    .price-cents {
      font-size: 26px;
      font-weight: 800;
      color: #94A3B8;
    }
  </style>
`;

// 1. Generate Cover HTML
function buildCoverHtml() {
  const heroTank = toFileUrl('public/assets/models/z8_tank_studio.jpg');
  const heroFx10 = toFileUrl('public/assets/models/z8_fx10_studio.jpg');
  const heroHarley = toFileUrl('public/assets/models/z8_harley_studio.jpg');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Capa do Catálogo</title>
  ${COMMON_CSS}
  <style>
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 60px 80px 40px 80px;
      background: radial-gradient(circle at top right, #FFFFFF 0%, #F8FAFC 100%);
    }

    .cover-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 10px;
      z-index: 20;
    }

    .cover-badge-top {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #0A0B0E;
      color: #FFFFFF;
      padding: 10px 30px;
      border-radius: 9999px;
      border: 2px solid #00E5FF;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0, 229, 255, 0.25);
    }

    .cover-logo-icon {
      height: 36px;
    }

    .cover-badge-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #00E5FF;
    }

    .cover-headline {
      font-size: 92px;
      font-weight: 900;
      line-height: 0.95;
      color: #0A0B0E;
      text-transform: uppercase;
      letter-spacing: -2px;
      margin-bottom: 16px;
    }

    .cover-headline .text-brand {
      color: #008CA8;
    }

    .cover-subheadline {
      font-size: 19px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 4px;
      max-width: 1200px;
      margin-bottom: 28px;
    }

    .cover-pills-row {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 34px;
    }

    .cover-pill {
      background: #FFFFFF;
      border: 2px solid #E2E8F0;
      color: #0A0B0E;
      font-size: 15px;
      font-weight: 800;
      padding: 10px 24px;
      border-radius: 9999px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      letter-spacing: 1px;
    }

    .cover-cards-trio {
      display: flex;
      gap: 30px;
      justify-content: center;
      width: 100%;
      max-width: 1450px;
    }

    .cover-card {
      flex: 1;
      height: 380px;
      border-radius: 28px;
      overflow: hidden;
      background: radial-gradient(circle at center, #1A212E 0%, #0A0B0E 100%);
      border: 2px solid rgba(0, 229, 255, 0.35);
      position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .cover-card.featured {
      transform: translateY(-16px);
      border-color: #00E5FF;
      box-shadow: 0 30px 60px rgba(0, 229, 255, 0.25);
    }

    .cover-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-card-label {
      position: absolute;
      bottom: 18px;
      left: 18px;
      right: 18px;
      background: rgba(10, 11, 14, 0.92);
      color: #FFFFFF;
      padding: 12px 18px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: 1px solid rgba(0, 229, 255, 0.5);
      text-align: center;
    }

    .cover-footer-bar {
      width: 100%;
      border-top: 2px solid #E2E8F0;
      padding-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 1.5px;
      z-index: 20;
    }

    .cover-footer-bar strong {
      color: #0A0B0E;
    }
  </style>
</head>
<body>
  <div class="top-stripes">
    <div class="stripe-thick-cyan"></div>
    <div class="stripe-thin-lime"></div>
    <div class="stripe-thin-dark"></div>
  </div>
  <div class="top-halftone"></div>

  <div class="cover-container">
    <div class="cover-content">
      <div class="cover-badge-top">
        <img src="${logoMinimalistaUrl}" class="cover-logo-icon" alt="Z8">
        <span class="cover-badge-text">Z8 E-MOTION // LINHA NACIONAL 2026</span>
      </div>

      <h1 class="cover-headline">
        CATÁLOGO OFICIAL<br>
        <span class="text-brand">DE PRODUTOS</span>
      </h1>

      <p class="cover-subheadline">
        O FUTURO DA MOBILIDADE ELÉTRICA URBANA • ALTA PERFORMANCE • ZERO EMISSÃO • CONTRAN 996
      </p>

      <div class="cover-pills-row">
        <div class="cover-pill">✦ 11 MODELOS EXCLUSIVOS</div>
        <div class="cover-pill">⚡ RECARGA DE R$ 1,80 NA TOMADA</div>
        <div class="cover-pill">🛡️ GARANTIA NACIONAL Z8</div>
        <div class="cover-pill">🔋 BATERIAS LÍTIO REMOVÍVEIS</div>
      </div>

      <div class="cover-cards-trio">
        <div class="cover-card">
          <img src="${heroTank}" alt="Z8 Tank">
          <div class="cover-card-label">Z8 TANK HIGH-SPEED</div>
        </div>
        <div class="cover-card featured">
          <img src="${heroFx10}" alt="Z8 FX-10">
          <div class="cover-card-label">Z8 FX-10 SPORT</div>
        </div>
        <div class="cover-card">
          <img src="${heroHarley}" alt="Z8 Harley">
          <div class="cover-card-label">Z8 HARLEY X21 CUSTOM</div>
        </div>
      </div>
    </div>

    <div class="cover-footer-bar">
      <div class="footer-legal">
        <strong>Z8 EMOTION LTDA.</strong> • CNPJ: 68.774.164/0001-00 • MATRIZ: SÃO JOSÉ DOS CAMPOS - SP
      </div>
      <div class="footer-portal">
        
      </div>
    </div>
  </div>

      <div style="position: absolute; bottom: 80px; left: 0; width: 100%; text-align: center; z-index: 999;">
        <div style="display: inline-block; background: #FF0055; color: #FFF; padding: 20px 40px; font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; border-radius: 12px; letter-spacing: 2px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255,0,85,0.4); border: 2px solid rgba(255,255,255,0.2);">
          ⚠️ PROMOÇÃO VÁLIDA SOMENTE NESSE MÊS DE OUTUBRO ⚠️
        </div>
      </div>
</body>
</html>`;
}

// 2. Generate Product Page HTML
function buildProductPageHtml(model, index) {
  const modelImgUrl = toFileUrl(`public${model.image}`);
  const overlayText = modelOverlays[model.id] || `${model.category.toUpperCase()} // HIGH PERFORMANCE`;

  const words = model.name.replace(/^Z8\s+/, '').split(' ');
  const titleP1 = words[0];
  const titleP2 = words.slice(1).join(' ');

  const featureHighlight = (model.features && model.features.length > 0) 
    ? model.features.slice(0, 2).join(' • ').toUpperCase() 
    : 'PARTIDA KEYLESS NFC • ILUMINAÇÃO LED';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - ${model.name}</title>
  ${COMMON_CSS}
</head>
<body>

  <!-- Top Left Stripes -->
  <div class="top-stripes">
    <div class="stripe-thick-cyan"></div>
    <div class="stripe-thin-lime"></div>
    <div class="stripe-thin-dark"></div>
  </div>

  <!-- Top Left Logo -->
  <div class="top-logo-badge">
    <img class="top-logo-img" src="${logoMinimalistaUrl}" alt="Z8 Logo">
    <div class="top-brand-text">
      <span class="top-brand-title">Z8 E-MOTION</span>
      <span class="top-brand-sub">MOBILIDADE ELÉTRICA // CATÁLOGO 2026</span>
    </div>
  </div>

  <!-- Top Right Halftone -->
  <div class="top-halftone"></div>

  <!-- Page Indicator -->
  <div class="page-indicator">
    ${String(index + 2).padStart(2, '0')} / 13
  </div>

  <!-- Main Content -->
  <div class="catalog-main">
    
    <!-- Left: Motorcycle Showcase Frame -->
    <div class="hero-stage">
      <div class="bike-showcase-container">
        <img class="bike-image" src="${modelImgUrl}" alt="${model.name}">
        <div class="bike-badge-overlay">
          <span class="dot"></span>
          <span>${overlayText}</span>
        </div>
      </div>
    </div>

    <!-- Right: Telemetry & Specs -->
    <div class="telemetry-column">
      <div class="model-header">
        <div class="model-tag-row">
          <div class="pill-modelo">MODELO</div>
          <div class="model-line-accent"></div>
        </div>
        <h1 class="model-title-monumental">${titleP1} <span>${titleP2}</span></h1>
        <div class="model-tag-sub">${model.tag.toUpperCase()} // CÓDIGO ${model.code}</div>
      </div>

      <div class="specs-bar">
        <span class="specs-bar-title">ESPECIFICAÇÕES TÉCNICAS</span>
        <span class="specs-bar-slashes">///</span>
      </div>

      <div class="specs-list">
        <!-- 1. Motor -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.motor}</div>
          <div class="spec-text-block">
            <span class="spec-label">MOTOR</span>
            <span class="spec-val">${model.motor.toUpperCase()}</span>
          </div>
        </div>

        <!-- 2. Bateria -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.battery}</div>
          <div class="spec-text-block">
            <span class="spec-label">BATERIA</span>
            <span class="spec-val">${model.battery.toUpperCase()}</span>
          </div>
        </div>

        <!-- 3. Autonomia -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.range}</div>
          <div class="spec-text-block">
            <span class="spec-label">AUTONOMIA</span>
            <span class="spec-val">${model.range.toUpperCase()}</span>
          </div>
        </div>

        <!-- 4. Velocidade -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.speed}</div>
          <div class="spec-text-block">
            <span class="spec-label">VELOCIDADE MÁXIMA</span>
            <span class="spec-val">${model.speed.toUpperCase()}</span>
          </div>
        </div>

        <!-- 5. Freios -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.brakes}</div>
          <div class="spec-text-block">
            <span class="spec-label">SISTEMA DE FREIOS</span>
            <span class="spec-val">${model.brakes.toUpperCase()}</span>
          </div>
        </div>

        <!-- 6. Tecnologia -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.light}</div>
          <div class="spec-text-block">
            <span class="spec-label">TECNOLOGIA & ILUMINAÇÃO</span>
            <span class="spec-val">${featureHighlight}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom Bar -->
  <div class="bottom-bar">
    <div class="trust-badges">
      <div class="trust-badge-item">
        <div class="trust-icon-wrap">${ICONS.quality}</div>
        <div class="trust-text">
          <span class="trust-t1">QUALIDADE</span>
          <span class="trust-t2">QUE VOCÊ CONFIA</span>
        </div>
      </div>

      <div class="trust-badge-item">
        <div class="trust-icon-wrap">${ICONS.economy}</div>
        <div class="trust-text">
          <span class="trust-t1">ECONOMIA</span>
          <span class="trust-t2">R$ 1,80 POR RECARGA</span>
        </div>
      </div>

      <div class="trust-badge-item">
        <div class="trust-icon-wrap">${ICONS.eco}</div>
        <div class="trust-text">
          <span class="trust-t1">SUSTENTÁVEL</span>
          <span class="trust-t2">100% ELÉTRICA // ZERO CO₂</span>
        </div>
      </div>
    </div>

    <!-- Price Tag -->
    <div class="price-tag-container">
      <div class="price-pill-label">VALOR</div>
      <div class="price-value-wrap">
        <span class="price-currency">R$</span>
        <span class="price-amount">${formatCurrency(model.retailPrice)}</span>
        <span class="price-cents">,00</span>
      </div>
    </div>
  </div>

</body>
</html>`;
}

// 3. Generate Back Cover HTML
function buildBackCoverHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Contracapa</title>
  ${COMMON_CSS}
  <style>
    .back-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 60px 80px 40px 80px;
      background: #FFFFFF;
    }

    .back-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 10px;
      z-index: 20;
    }

    .back-brand-pill {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #0A0B0E;
      color: #FFFFFF;
      padding: 12px 36px;
      border-radius: 9999px;
      border: 2px solid #00E5FF;
      box-shadow: 0 4px 25px rgba(0, 229, 255, 0.25);
      margin-bottom: 16px;
    }

    .back-pill-logo {
      height: 44px;
      filter: drop-shadow(0 2px 8px rgba(0, 229, 255, 0.5));
    }

    .back-pill-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .back-pill-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 3px;
      color: #FFFFFF;
      line-height: 1.1;
    }

    .back-pill-sub {
      font-size: 11px;
      font-weight: 800;
      color: #00E5FF;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .back-sub {
      font-size: 16px;
      font-weight: 800;
      color: #008CA8;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .back-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      max-width: 1400px;
      margin: 30px auto;
      z-index: 20;
    }

    .back-card {
      background: #F8FAFC;
      border: 2px solid #E2E8F0;
      border-left: 6px solid #00E5FF;
      border-radius: 24px;
      padding: 32px 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }

    .back-card:nth-child(even) {
      border-left-color: #22C55E;
    }

    .back-card-icon {
      font-size: 38px;
      line-height: 1;
    }

    .back-card h3 {
      font-size: 20px;
      font-weight: 900;
      color: #0A0B0E;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .back-card p {
      font-size: 15px;
      font-weight: 600;
      color: #475569;
      line-height: 1.5;
    }

    .back-contact-box {
      background: #0A0B0E;
      border: 2px solid #00E5FF;
      border-radius: 24px;
      padding: 24px 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px auto 25px auto;
      width: 100%;
      max-width: 1400px;
      z-index: 20;
      box-shadow: 0 15px 40px rgba(0, 229, 255, 0.15);
    }

    .contact-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .contact-label {
      font-size: 11px;
      font-weight: 800;
      color: #00E5FF;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .contact-val {
      font-size: 15px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }

    .cover-footer-bar {
      width: 100%;
      border-top: 2px solid #E2E8F0;
      padding-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 1.5px;
      z-index: 20;
    }

    .cover-footer-bar strong {
      color: #0A0B0E;
    }
  </style>
</head>
<body>
  <div class="top-stripes">
    <div class="stripe-thick-cyan"></div>
    <div class="stripe-thin-lime"></div>
    <div class="stripe-thin-dark"></div>
  </div>
  <div class="top-halftone"></div>

  <div class="back-container">
    <div class="back-header">
      <div class="back-brand-pill">
        <img src="${logoMinimalistaUrl}" class="back-pill-logo" alt="Z8">
        <div class="back-pill-text">
          <span class="back-pill-title">Z8 E-MOTION</span>
          <span class="back-pill-sub">BRASIL // MOBILIDADE ELÉTRICA</span>
        </div>
      </div>
      <div class="back-sub">AUTORIDADE & LIDERANÇA EM MOBILIDADE ELÉTRICA NO BRASIL</div>
    </div>

    <div class="back-grid">
      <div class="back-card">
        <div class="back-card-icon">🛡️</div>
        <h3>GARANTIA NACIONAL Z8</h3>
        <p>Cobertura integral para motor elétrico, bateria e estrutura de chassi com suporte técnico direto de fábrica em todo o Brasil.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">🔧</div>
        <h3>PDI & ENTREGA TÉCNICA</h3>
        <p>Inspeção pré-entrega rigorosa de 38 itens mecânicos e elétricos, garantindo segurança absoluta e calibragem milimétrica.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">⚡</div>
        <h3>ECONOMIA SEM IGUAL</h3>
        <p>Recarga completa na tomada comum residencial (110V/220V) por apenas R$ 1,80 a R$ 2,50. Economize até R$ 5.000 ao ano vs gasolina.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">🚀</div>
        <h3>REDE DE CONCESSIONÁRIAS</h3>
        <p>Mais de 5 cidades atendidas com showroom oficial, test-ride guiado, pronta entrega de motos e estoque garantido de peças de reposição.</p>
      </div>
    </div>

    <div class="back-contact-box">
      <div class="contact-col">
        <div class="contact-label">CENTRAL DE VENDAS & ATENDIMENTO</div>
        <div class="contact-val">📱 (12) 99800-8818 &bull; (12) 98813-0316</div>
      </div>
      <div class="contact-col">
        <div class="contact-label">SEDE CORPORATIVA / MATRIZ Z8</div>
        <div class="contact-val">📍 Av. Dr. Adhemar de Barros, 566 - Jd. São Dimas, São José dos Campos - SP</div>
      </div>
      <div class="contact-col">
        <div class="contact-label">PORTAL INSTITUCIONAL</div>
        
      </div>
    </div>

    <div class="cover-footer-bar">
      <div class="footer-legal">
        © 2026 Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • TODOS OS DIREITOS RESERVADOS
      </div>
      <div class="footer-portal">
        CONTRAN 996 // BLINDAGEM REGULATÓRIA
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Iniciando geração robusta das 13 páginas do Catálogo Z8 E-Motion 2026...');

  const pages = [];

  // Page 1: Cover
  pages.push({
    num: 1,
    id: 'capa',
    title: 'Capa Oficial Z8',
    html: buildCoverHtml(),
    filenameHtml: 'page_01_capa.html',
    filenamePng: 'pagina_01_capa.png'
  });

  // Pages 2 - 12: The 11 models
  z8Models.forEach((model, idx) => {
    const pageNum = idx + 2;
    pages.push({
      num: pageNum,
      id: model.id,
      title: model.name,
      html: buildProductPageHtml(model, idx),
      filenameHtml: `page_${String(pageNum).padStart(2, '0')}_${model.id.replace(/-/g, '_')}.html`,
      filenamePng: `pagina_${String(pageNum).padStart(2, '0')}_${model.id.replace(/-/g, '_')}.png`
    });
  });

  // Page 13: Back Cover
  pages.push({
    num: 13,
    id: 'contracapa',
    title: 'Contracapa e Rede Oficial',
    html: buildBackCoverHtml(),
    filenameHtml: 'page_13_contracapa.html',
    filenamePng: 'pagina_13_contracapa.png'
  });

  // 1. Write HTML files
  console.log(`📝 Escrevendo 13 arquivos HTML em ${pagesDir}...`);
  for (const page of pages) {
    const htmlPath = path.join(pagesDir, page.filenameHtml);
    fs.writeFileSync(htmlPath, page.html, 'utf8');
  }

  // 2. Render each HTML file to 1754x1240 PNG using Microsoft Edge Headless
  console.log('🖼️ Renderizando cada uma das 13 páginas com Microsoft Edge Headless (1754x1240)...');
  const renderedImages = [];

  for (const page of pages) {
    const htmlPath = path.join(pagesDir, page.filenameHtml);
    const pngPath = path.join(outputImgDir, page.filenamePng);
    const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1754,1240 "--screenshot=${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;

    try {
      execSync(cmd, { stdio: 'ignore' });
      if (fs.existsSync(pngPath)) {
        console.log(`[OK] [${page.num}/13] ${page.filenamePng} renderizado com sucesso!`);
        renderedImages.push(pngPath);
      } else {
        console.error(`[ERRO] [${page.num}/13] Falha ao gerar ${page.filenamePng}`);
      }
    } catch (e) {
      console.error(`Erro ao renderizar ${page.filenamePng}:`, e.message);
    }
  }

  console.log(`[SUCESSO] ${renderedImages.length} de 13 páginas renderizadas com perfeição.`);

  // 3. Merge PNGs into Official PDF using Python PyMuPDF
  console.log('📄 Unificando páginas no PDF Oficial via PyMuPDF...');
  const pythonMergeScript = path.resolve(rootDir, 'scripts', 'merge_catalog_pdf.py');
  fs.writeFileSync(pythonMergeScript, `
import fitz
import os

root_dir = r"${rootDir.replace(/\\/g, '\\\\')}"
img_dir = os.path.join(root_dir, "public", "assets", "catalogo")
pdf_docs = os.path.join(root_dir, "scratch", "CATALOGO_OFICIAL_Z8_EMOTION_2026.pdf")
pdf_public = os.path.join(root_dir, "scratch", "CATALOGO_OFICIAL_Z8_EMOTION_2026_COPIA.pdf")

doc = fitz.open()

# Ordered image list
img_files = sorted([f for f in os.listdir(img_dir) if f.startswith("pagina_") and f.endswith(".png")])
print(f"Total de paginas a unificar: {len(img_files)}")

for f in img_files:
    img_path = os.path.join(img_dir, f)
    img_doc = fitz.open(img_path)
    pdf_bytes = img_doc.convert_to_pdf()
    img_pdf = fitz.open("pdf", pdf_bytes)
    doc.insert_pdf(img_pdf)
    print(f"  + Inserida: {f}")

doc.save(pdf_docs)
doc.save(pdf_public)
print(f"[OK] PDF Oficial gravado com {len(doc)} paginas:")
print(f"   -> {pdf_docs} ({os.path.getsize(pdf_docs)/1024/1024:.2f} MB)")
print(f"   -> {pdf_public} ({os.path.getsize(pdf_public)/1024/1024:.2f} MB)")
`, 'utf8');

  execSync(`python3 "${pythonMergeScript}"`, { stdio: 'inherit' });
  console.log('[FINALIZADO] Catalogo Z8 2026 gerado e unificado com sucesso!');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
