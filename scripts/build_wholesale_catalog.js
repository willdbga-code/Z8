import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { z8Models } from '../site-principal/data/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pagesDir = path.resolve(rootDir, 'scratch', 'wholesale_catalog_html_pages');
const outputImgDir = path.resolve(rootDir, 'public', 'assets', 'catalogo_atacado');

fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(outputImgDir, { recursive: true });

function toFileUrl(relPath) {
  const absPath = path.resolve(rootDir, relPath).replace(/\\/g, '/');
  return `file:///${absPath}`;
}

const logoMinimalistaUrl = toFileUrl('public/assets/logos/logo minimalista.png');
const logoMainUrl = toFileUrl('public/assets/logos/logo_z8_main.png');

const ICONS = {
  motor: `<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  battery: `<svg viewBox="0 0 24 24"><path d="M16 20H8V6h8m0-2h-1V2h-6v2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M10 9h4v2h-4zm0 4h4v2h-4z"/></svg>`,
  range: `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  speed: `<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.66L8.41 15.6A5.98 5.98 0 0 1 6 12a6 6 0 0 1 11.23-2.92l1.66-1.66A7.96 7.96 0 0 0 12 4zm0 4a4 4 0 0 0-4 4c0 .77.22 1.49.6 2.1l2.4-2.4V8h2v3.7l2.4 2.4c.38-.61.6-1.33.6-2.1a4 4 0 0 0-4-4z"/></svg>`,
  brakes: `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8zm0-12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
  light: `<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10h2v4h-2zm0 6h2v2h-2z"/></svg>`,
  margin: `<svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
  shipping: `<svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`
};

function formatCurrency(val) {
  return val.toLocaleString('pt-BR');
}

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

    /* Top Left Dynamic Sports Stripes */
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
      padding-top: 96px;
      padding-bottom: 156px;
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
      height: 700px;
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
      bottom: 24px;
      left: 24px;
      background: rgba(10, 11, 14, 0.92);
      backdrop-filter: blur(8px);
      border: 1.5px solid #22C55E;
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
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
      z-index: 8;
    }

    .bike-badge-overlay .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 8px #22C55E;
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
      margin-bottom: 20px;
      position: relative;
    }

    .model-tag-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }

    .pill-modelo {
      background: #00E5FF;
      color: #0A0B0E;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 6px 18px;
      border-radius: 9999px;
      box-shadow: 0 2px 10px rgba(0, 229, 255, 0.35);
    }

    .pill-b2b-exclusive {
      background: #22C55E;
      color: #0A0B0E;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    .model-line-accent {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, #00E5FF 0%, #22C55E 100%);
      opacity: 0.8;
    }

    .model-title-monumental {
      font-size: 74px;
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
      font-size: 14px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .specs-bar {
      background: #0A0B0E;
      border-radius: 9999px;
      padding: 8px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 5px solid #00E5FF;
    }

    .specs-bar-title {
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .specs-bar-slashes {
      color: #00E5FF;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid rgba(0, 140, 168, 0.2);
    }

    .spec-icon-box {
      width: 44px;
      height: 44px;
      min-width: 44px;
      background: #0A0B0E;
      border: 1px solid rgba(0, 229, 255, 0.35);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }

    .spec-icon-box svg {
      width: 24px;
      height: 24px;
      fill: #00E5FF;
    }

    .spec-text-block {
      display: flex;
      flex-direction: column;
    }

    .spec-label {
      font-size: 12px;
      font-weight: 900;
      color: #008CA8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .spec-val {
      font-size: 16px;
      font-weight: 800;
      color: #0A0B0E;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Wholesale Bottom Bar */
    .wholesale-bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 144px;
      background: #0A0B0E;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 60px;
      border-top: 4px solid #00E5FF;
      z-index: 50;
    }

    .b2b-trust-badges {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .b2b-trust-item {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .b2b-trust-icon {
      width: 42px;
      height: 42px;
      border: 2px solid #00E5FF;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.05);
    }

    .b2b-trust-icon svg {
      width: 22px;
      height: 22px;
      fill: #00E5FF;
    }

    .b2b-trust-text {
      display: flex;
      flex-direction: column;
    }

    .b2b-t1 {
      font-size: 13px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .b2b-t2 {
      font-size: 11px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* 3-Tier Financial Cards Block */
    .financial-grid {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .fin-card {
      background: #14171F;
      border-radius: 18px;
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 200px;
    }

    .fin-card.wholesale-primary {
      background: #141C2B;
      border: 2px solid #00E5FF;
      box-shadow: 0 0 25px rgba(0, 229, 255, 0.25);
    }

    .fin-card.profit-highlight {
      background: #12231A;
      border: 2px solid #22C55E;
      box-shadow: 0 0 25px rgba(34, 197, 94, 0.25);
    }

    .fin-label {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fin-label.cyan {
      color: #00E5FF;
    }

    .fin-label.gray {
      color: #94A3B8;
    }

    .fin-label.green {
      color: #22C55E;
    }

    .fin-val-wrap {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .fin-currency {
      font-size: 16px;
      font-weight: 900;
      color: #FFFFFF;
    }

    .fin-amount {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1;
      color: #FFFFFF;
    }

    .fin-amount.cyan {
      color: #00E5FF;
    }

    .fin-amount.green {
      color: #22C55E;
    }

    .fin-badge-tag {
      background: rgba(34, 197, 94, 0.2);
      color: #22C55E;
      border: 1px solid #22C55E;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
    }
  </style>
`;

// 1. Cover Page HTML (Wholesale Edition)
function buildCoverHtml() {
  const heroTank = toFileUrl('public/assets/models/z8_tank_studio.jpg');
  const heroFx10 = toFileUrl('public/assets/models/z8_fx10_studio.jpg');
  const heroHarley = toFileUrl('public/assets/models/z8_harley_studio.jpg');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Tabela Oficial Atacado & Revenda 2026</title>
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
      margin-bottom: 20px;
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
      font-size: 84px;
      font-weight: 900;
      line-height: 0.95;
      color: #0A0B0E;
      text-transform: uppercase;
      letter-spacing: -2px;
      margin-bottom: 14px;
    }

    .cover-headline .text-brand {
      color: #008CA8;
    }

    .cover-headline .text-green {
      color: #16A34A;
    }

    .cover-subheadline {
      font-size: 18px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 3px;
      max-width: 1300px;
      margin-bottom: 26px;
    }

    .cover-pills-row {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 30px;
    }

    .cover-pill {
      background: #FFFFFF;
      border: 2px solid #E2E8F0;
      color: #0A0B0E;
      font-size: 14px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 9999px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      letter-spacing: 1px;
    }

    .cover-pill.green {
      border-color: #22C55E;
      background: #F0FDF4;
      color: #166534;
      font-weight: 900;
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
      background: rgba(10, 11, 14, 0.94);
      color: #FFFFFF;
      padding: 10px 16px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: 1.5px solid #22C55E;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cover-card-label .profit {
      color: #22C55E;
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
        <span class="cover-badge-text">Z8 E-MOTION // TABELA OFICIAL DE ATACADO 2026</span>
      </div>

      <h1 class="cover-headline">
        VALORES DE COMPRA<br>
        <span class="text-brand">ATACADO & </span><span class="text-green">RENTABILIDADE</span>
      </h1>

      <p class="cover-subheadline">
        CONDIÇÕES ESPECIAIS PARA LOJISTAS E REVENDEDORES CREDENCIADOS • FATURAMENTO DIRETO DA MONTADORA
      </p>

      <div class="cover-pills-row">
        <div class="cover-pill green">💰 LUCRO DE ATÉ R$ 4.200 POR MOTO</div>
        <div class="cover-pill">📈 MARKUP DE ATÉ 100%</div>
        <div class="cover-pill">📦 LOTE MÍNIMO 10 UNIDADES</div>
        <div class="cover-pill">🛡️ PEÇAS & GARANTIA NACIONAL</div>
      </div>

      <div class="cover-cards-trio">
        <div class="cover-card">
          <img src="${heroTank}" alt="Z8 Tank">
          <div class="cover-card-label">
            <span>Z8 TANK HIGH-SPEED</span>
            <span class="profit">+ R$ 4.000 LUCRO</span>
          </div>
        </div>
        <div class="cover-card featured">
          <img src="${heroFx10}" alt="Z8 FX-10">
          <div class="cover-card-label">
            <span>Z8 FX-10 SPORT</span>
            <span class="profit">+ R$ 4.000 LUCRO</span>
          </div>
        </div>
        <div class="cover-card">
          <img src="${heroHarley}" alt="Z8 Harley">
          <div class="cover-card-label">
            <span>Z8 HARLEY X21</span>
            <span class="profit">+ R$ 3.500 LUCRO</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cover-footer-bar">
      <div class="footer-legal">
        <strong>Z8 EMOTION LTDA.</strong> • CNPJ: 68.774.164/0001-00 • MATRIZ: SÃO JOSÉ DOS CAMPOS - SP
      </div>
      <div class="footer-portal">
        DEPARTAMENTO DE EXPANSÃO & REVENDAS
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

// 2. Product Page HTML (Wholesale Edition)
function buildProductPageHtml(model, index) {
  const modelImgUrl = toFileUrl(`public${model.image}`);
  const profitVal = model.profit ?? (model.retailPrice - model.wholesalePrice);
  const markupPct = model.markupPct ?? (((profitVal) / model.wholesalePrice) * 100).toFixed(1);

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
  <title>Z8 E-Motion Atacado - ${model.name}</title>
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
      <span class="top-brand-sub">TABELA ATACADO REVENDEDOR // 2026</span>
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
          <span>RETORNO ESTIMADO: + R$ ${formatCurrency(profitVal)},00 / MOTO</span>
        </div>
      </div>
    </div>

    <!-- Right: Telemetry & Specs -->
    <div class="telemetry-column">
      <div class="model-header">
        <div class="model-tag-row">
          <div class="pill-modelo">MODELO</div>
          <div class="pill-b2b-exclusive">MARKUP ${markupPct}%</div>
          <div class="model-line-accent"></div>
        </div>
        <h1 class="model-title-monumental">${titleP1} <span>${titleP2}</span></h1>
        <div class="model-tag-sub">${model.tag.toUpperCase()} // CÓDIGO FABRICANTE ${model.code}</div>
      </div>

      <div class="specs-bar">
        <span class="specs-bar-title">FICHA TÉCNICA HOMOLOGADA</span>
        <span class="specs-bar-slashes">///</span>
      </div>

      <div class="specs-list">
        <!-- 1. Motor -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.motor}</div>
          <div class="spec-text-block">
            <span class="spec-label">MOTORIZAÇÃO ELÉTRICA</span>
            <span class="spec-val">${model.motor.toUpperCase()}</span>
          </div>
        </div>

        <!-- 2. Bateria -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.battery}</div>
          <div class="spec-text-block">
            <span class="spec-label">SISTEMA DE BATERIA</span>
            <span class="spec-val">${model.battery.toUpperCase()}</span>
          </div>
        </div>

        <!-- 3. Autonomia -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.range}</div>
          <div class="spec-text-block">
            <span class="spec-label">AUTONOMIA POR CARGA</span>
            <span class="spec-val">${model.range.toUpperCase()}</span>
          </div>
        </div>

        <!-- 4. Velocidade -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.speed}</div>
          <div class="spec-text-block">
            <span class="spec-label">VELOCIDADE MÁXIMA REGULAMENTADA</span>
            <span class="spec-val">${model.speed.toUpperCase()}</span>
          </div>
        </div>

        <!-- 5. Freios -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.brakes}</div>
          <div class="spec-text-block">
            <span class="spec-label">SISTEMA DE FRENAGEM</span>
            <span class="spec-val">${model.brakes.toUpperCase()}</span>
          </div>
        </div>

        <!-- 6. Tecnologia -->
        <div class="spec-item">
          <div class="spec-icon-box">${ICONS.light}</div>
          <div class="spec-text-block">
            <span class="spec-label">ITENS DE SÉRIE & ACABAMENTO</span>
            <span class="spec-val">${featureHighlight}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Wholesale Bottom Bar: 3-Tier Financial Analysis -->
  <div class="wholesale-bottom-bar">
    <div class="b2b-trust-badges">
      <div class="b2b-trust-item">
        <div class="b2b-trust-icon">${ICONS.margin}</div>
        <div class="b2b-trust-text">
          <span class="b2b-t1">MARGEM GARANTIDA</span>
          <span class="b2b-t2">MARKUP DE ATÉ 100%</span>
        </div>
      </div>

      <div class="b2b-trust-item">
        <div class="b2b-trust-icon">${ICONS.shipping}</div>
        <div class="b2b-trust-text">
          <span class="b2b-t1">PRONTA EXPEDIÇÃO</span>
          <span class="b2b-t2">DIRETO DA MONTADORA</span>
        </div>
      </div>

      <div class="b2b-trust-item">
        <div class="b2b-trust-icon">${ICONS.shield}</div>
        <div class="b2b-trust-text">
          <span class="b2b-t1">PDI & SUPORTE</span>
          <span class="b2b-t2">PEÇAS EM ESTOQUE</span>
        </div>
      </div>
    </div>

    <!-- Financial Breakdown Cards -->
    <div class="financial-grid">
      <!-- 1. Wholesale Purchase Price -->
      <div class="fin-card wholesale-primary">
        <div class="fin-label cyan">
          <span>PREÇO ATACADO (COMPRA)</span>
          <span>LOTE 10+</span>
        </div>
        <div class="fin-val-wrap">
          <span class="fin-currency">R$</span>
          <span class="fin-amount cyan">${formatCurrency(model.wholesalePrice)}</span>
          <span style="color: #94A3B8; font-size: 16px; font-weight: 800;">,00</span>
        </div>
      </div>

      <!-- 2. Retail Suggested Price -->
      <div class="fin-card">
        <div class="fin-label gray">
          <span>SUGERIDO VAREJO (VENDA)</span>
        </div>
        <div class="fin-val-wrap">
          <span class="fin-currency">R$</span>
          <span class="fin-amount">${formatCurrency(model.retailPrice)}</span>
          <span style="color: #64748B; font-size: 16px; font-weight: 800;">,00</span>
        </div>
      </div>

      <!-- 3. Profit Per Unit -->
      <div class="fin-card profit-highlight">
        <div class="fin-label green">
          <span>LUCRO LÍQUIDO / MOTO</span>
          <span class="fin-badge-tag">+${markupPct}%</span>
        </div>
        <div class="fin-val-wrap">
          <span class="fin-currency" style="color: #22C55E;">R$</span>
          <span class="fin-amount green">${formatCurrency(profitVal)}</span>
          <span style="color: #22C55E; font-size: 16px; font-weight: 800;">,00</span>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;
}

// 3. Back Cover HTML (Wholesale Edition)
function buildBackCoverHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Z8 E-Motion - Condições Comerciais Atacado</title>
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
          <span class="back-pill-sub">BRASIL // DIRETORIA DE EXPANSÃO & ATACADO</span>
        </div>
      </div>
      <div class="back-sub">CONDIÇÕES COMERCIAIS & DIRETRIZES DE FORNECIMENTO DIRETO</div>
    </div>

    <div class="back-grid">
      <div class="back-card">
        <div class="back-card-icon">📦</div>
        <h3>LOTE MÍNIMO DE ATACADO (10 MOTOS)</h3>
        <p>Faturamento direto de montadora com lote a partir de 10 unidades mistas. Margem líquida média entre R$ 35.000,00 e R$ 42.000,00 por lote faturado.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">📍</div>
        <h3>MONOPÓLIO & PROTEÇÃO TERRITORIAL</h3>
        <p>Concessão oficial de raio geográfico protegido para lojistas credenciados. Evite concorrência desleal e domine as vendas na sua microrregião.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">⚙️</div>
        <h3>RETROALIMENTAÇÃO DE PEÇAS & PDI</h3>
        <p>Centro de distribuição nacional com mais de 3.000 SKUs em estoque. Suporte técnico direto para mecânicos e protocolo de entrega técnica de 38 itens.</p>
      </div>

      <div class="back-card">
        <div class="back-card-icon">⚖️</div>
        <h3>BLINDAGEM REGULATÓRIA CONTRAN 996</h3>
        <p>Veículos 100% autopropelidos em total conformidade com a Resolução CONTRAN 996/2023. Segurança jurídica plena para você e seus clientes.</p>
      </div>
    </div>

    <div class="back-contact-box">
      <div class="contact-col">
        <div class="contact-label">EXPANSÃO DE CONCESSIONÁRIAS & ATACADO</div>
        <div class="contact-val">📱 (12) 99800-8818 &bull; Christian Hideyuki (Diretoria)</div>
      </div>
      <div class="contact-col">
        <div class="contact-label">MATRIZ CORPORATIVA Z8</div>
        <div class="contact-val">📍 Av. Dr. Adhemar de Barros, 566 - São José dos Campos - SP</div>
      </div>
      <div class="contact-col">
        <div class="contact-label">CREDENCIAMENTO B2B</div>
        
      </div>
    </div>

    <div class="cover-footer-bar">
      <div class="footer-legal">
        DOCUMENTO CONFIDENCIAL B2B • Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • PROIBIDA REPRODUÇÃO NÃO AUTORIZADA
      </div>
      <div class="footer-portal">
        TABELA OFICIAL VÁLIDA PARA O EXERCÍCIO 2026
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Iniciando geração da TABELA DE COMPRA / ATACADO Z8 E-Motion 2026...');

  const pages = [];

  // Page 1: Cover
  pages.push({
    num: 1,
    id: 'capa',
    title: 'Capa Oficial Atacado',
    html: buildCoverHtml(),
    filenameHtml: 'page_01_capa.html',
    filenamePng: 'pagina_01_capa_atacado.png'
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
      filenamePng: `pagina_${String(pageNum).padStart(2, '0')}_${model.id.replace(/-/g, '_')}_atacado.png`
    });
  });

  // Page 13: Back Cover
  pages.push({
    num: 13,
    id: 'contracapa',
    title: 'Diretrizes Comerciais Atacado',
    html: buildBackCoverHtml(),
    filenameHtml: 'page_13_contracapa.html',
    filenamePng: 'pagina_13_contracapa_atacado.png'
  });

  // 1. Write HTML files
  console.log(`📝 Escrevendo 13 arquivos HTML em ${pagesDir}...`);
  for (const page of pages) {
    const htmlPath = path.join(pagesDir, page.filenameHtml);
    fs.writeFileSync(htmlPath, page.html, 'utf8');
  }

  // 2. Render each HTML file to 1754x1240 PNG using Microsoft Edge Headless
  console.log('🖼️ Renderizando cada uma das 13 páginas de Atacado com Microsoft Edge Headless (1754x1240)...');
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

  console.log(`[SUCESSO] ${renderedImages.length} de 13 páginas de Atacado renderizadas.`);

  // 3. Merge PNGs into Wholesale PDF using PyMuPDF
  console.log('📄 Unificando páginas no PDF de Atacado para Revendedores...');
  const pythonMergeScript = path.resolve(rootDir, 'scripts', 'merge_wholesale_catalog_pdf.py');
  fs.writeFileSync(pythonMergeScript, `
import fitz
import os

root_dir = r"${rootDir.replace(/\\/g, '\\\\')}"
img_dir = os.path.join(root_dir, "public", "assets", "catalogo_atacado")
pdf_docs = os.path.join(root_dir, "docs", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")
pdf_public = os.path.join(root_dir, "public", "docs", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")

doc = fitz.open()

img_files = sorted([f for f in os.listdir(img_dir) if f.startswith("pagina_") and f.endswith("_atacado.png")])
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
print(f"[OK] PDF de Atacado gravado com {len(doc)} paginas:")
print(f"   -> {pdf_docs} ({os.path.getsize(pdf_docs)/1024/1024:.2f} MB)")
print(f"   -> {pdf_public} ({os.path.getsize(pdf_public)/1024/1024:.2f} MB)")
`, 'utf8');

  execSync(`python3 "${pythonMergeScript}"`, { stdio: 'inherit' });
  console.log('[FINALIZADO] PDF de Atacado e Revenda gerado com sucesso!');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
