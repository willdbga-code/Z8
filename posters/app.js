import { franchisePosters } from '../site-principal/data/franchisePostersData.js';

let currentFormat = 'stories'; // 'stories' | 'feed-portrait' | 'feed-square'
let currentRegion = 'all';

const postersGrid = document.getElementById('postersGrid');
const formatButtons = document.getElementById('formatButtons');
const regionChips = document.getElementById('regionChips');
const toast = document.getElementById('toast');

// Format dimensions
const FORMAT_CONFIG = {
  stories: { width: 1080, height: 1920, className: 'format-stories', label: 'Stories (9:16)' },
  'feed-portrait': { width: 1080, height: 1350, className: 'format-feed-portrait', label: 'Feed Retrato (4:5)' },
  'feed-square': { width: 1080, height: 1080, className: 'format-feed-square', label: 'Feed Quadrado (1:1)' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderPosters();
});

function setupEventListeners() {
  formatButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-toggle');
    if (!btn) return;

    formatButtons.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentFormat = btn.dataset.format;
    renderPosters();
  });

  regionChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    regionChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    currentRegion = chip.dataset.region;
    renderPosters();
  });
}

function renderPosters() {
  postersGrid.innerHTML = '';

  const filtered = franchisePosters.filter(p => {
    if (currentRegion === 'all') return true;
    return p.region === currentRegion;
  });

  filtered.forEach(poster => {
    const card = createPosterCard(poster);
    postersGrid.appendChild(card);
    renderCanvas(card.querySelector('canvas'), poster, currentFormat);
  });
}

function createPosterCard(poster) {
  const card = document.createElement('div');
  card.className = `poster-card ${FORMAT_CONFIG[currentFormat].className}`;

  card.innerHTML = `
    <div class="poster-preview-container">
      <div class="poster-canvas-wrapper">
        <canvas class="poster-canvas" id="canvas-${poster.id}"></canvas>
      </div>
    </div>
    <div class="poster-info">
      <div class="poster-meta-bar">
        <span class="meta-region">📍 ${poster.region} • ${poster.cityState}</span>
        <span class="meta-model">${poster.modelName}</span>
      </div>
      <h3 class="poster-card-headline">${poster.franchiseHeadline}</h3>
      <p class="poster-card-subhead">${poster.franchiseSubhead}</p>
      
      <div class="poster-metrics-list">
        <div class="metric-item"><span>⚡</span> ${poster.profitMetric}</div>
        <div class="metric-item"><span>🔧</span> ${poster.liftsMetric}</div>
        <div class="metric-item"><span>📈</span> ${poster.paybackMetric}</div>
        <div class="metric-item"><span>📜</span> ${poster.complianceMetric}</div>
      </div>

      <div class="poster-actions">
        <button class="btn-action btn-download" data-id="${poster.id}">
          <span>📥</span> Baixar (${FORMAT_CONFIG[currentFormat].label.split(' ')[0]})
        </button>
        <button class="btn-action btn-copy" data-caption="${encodeURIComponent(poster.feedCaption)}">
          <span>📋</span> Copiar Legenda
        </button>
      </div>
    </div>
  `;

  // Attach button events
  card.querySelector('.btn-download').addEventListener('click', () => {
    downloadPosterCanvas(card.querySelector('canvas'), poster);
  });

  card.querySelector('.btn-copy').addEventListener('click', (e) => {
    const caption = decodeURIComponent(e.currentTarget.dataset.caption);
    navigator.clipboard.writeText(caption).then(() => {
      showToast('Legenda e hashtags copiadas com sucesso!');
    });
  });

  return card;
}

function renderCanvas(canvas, poster, format) {
  const { width, height } = FORMAT_CONFIG[format];
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Background fallback
  ctx.fillStyle = '#0a0d12';
  ctx.fillRect(0, 0, width, height);

  // Load Hero Image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = poster.image;

  img.onload = () => {
    drawComposite(ctx, img, poster, width, height, format);
  };

  img.onerror = () => {
    // Fallback if image fails to load: gradient background with graphics
    drawFallbackBackground(ctx, width, height);
    drawOverlayGraphics(ctx, poster, width, height, format);
  };
}

function drawComposite(ctx, img, poster, width, height, format) {
  // 1. Draw Image with Cover & Vertical Centering
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let renderWidth, renderHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    renderHeight = height;
    renderWidth = height * imgRatio;
    offsetX = (width - renderWidth) / 2;
    offsetY = 0;
  } else {
    renderWidth = width;
    renderHeight = width / imgRatio;
    offsetX = 0;
    offsetY = (height - renderHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

  // 2. Cinematic Vignettes (Top and Bottom Gradient Masks)
  // Top Vignette (for Headline & Badges)
  const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.45);
  topGradient.addColorStop(0, 'rgba(6, 8, 12, 0.94)');
  topGradient.addColorStop(0.55, 'rgba(6, 8, 12, 0.75)');
  topGradient.addColorStop(1, 'rgba(6, 8, 12, 0.0)');
  ctx.fillStyle = topGradient;
  ctx.fillRect(0, 0, width, height * 0.45);

  // Bottom Vignette (for Metrics & CTA)
  const botGradient = ctx.createLinearGradient(0, height * 0.65, 0, height);
  botGradient.addColorStop(0, 'rgba(6, 8, 12, 0.0)');
  botGradient.addColorStop(0.45, 'rgba(6, 8, 12, 0.85)');
  botGradient.addColorStop(1, 'rgba(6, 8, 12, 0.98)');
  ctx.fillStyle = botGradient;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);

  // 3. Draw Overlay Typography & Graphics
  drawOverlayGraphics(ctx, poster, width, height, format);
}

function drawFallbackBackground(ctx, width, height) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0d131a');
  grad.addColorStop(0.5, '#161f2c');
  grad.addColorStop(1, '#080c10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function drawOverlayGraphics(ctx, poster, width, height, format) {
  const isStories = format === 'stories';
  const isPortrait = format === 'feed-portrait';
  const isSquare = format === 'feed-square';

  ctx.save();

  // Margins
  const paddingX = 70;
  let topCursor = isStories ? 190 : (isPortrait ? 100 : 70);

  // ------------------------------------------------------------------------
  // TOP BRAND BADGE: [ ⚡ Z8 E-MOTION® • EXPANSÃO NACIONAL ]
  // ------------------------------------------------------------------------
  const badgeText = `⚡ Z8 E-MOTION®  •  EXPANSÃO ${poster.regionCode}`;
  ctx.font = '700 24px "Chakra Petch", sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 44;
  const badgeHeight = 46;

  // Badge background pill
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.5;
  roundRect(ctx, paddingX, topCursor, badgeWidth, badgeHeight, 23);
  ctx.fill();
  ctx.stroke();

  // Badge Text
  ctx.fillStyle = '#00f0ff';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, paddingX + 22, topCursor + badgeHeight / 2);

  topCursor += badgeHeight + (isStories ? 35 : 24);

  // ------------------------------------------------------------------------
  // MONUMENTAL HEADLINE DE FRANQUIA
  // ------------------------------------------------------------------------
  const headlineFontSize = isStories ? 56 : (isPortrait ? 50 : 44);
  ctx.font = `800 ${headlineFontSize}px "Outfit", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';

  const headlineLines = wrapText(ctx, poster.franchiseHeadline, width - (paddingX * 2));
  headlineLines.forEach((line) => {
    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(line, paddingX, topCursor);
    topCursor += headlineFontSize * 1.18;
  });

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  topCursor += 12;

  // ------------------------------------------------------------------------
  // SUBHEAD DE RENTABILIDADE & FRANQUIA B2B
  // ------------------------------------------------------------------------
  const subheadFontSize = isStories ? 28 : (isPortrait ? 24 : 22);
  ctx.font = `400 ${subheadFontSize}px "Outfit", sans-serif`;
  ctx.fillStyle = '#cbd5e1';

  const maxSubLines = isSquare ? 2 : 3;
  const subheadLines = wrapText(ctx, poster.franchiseSubhead, width - (paddingX * 2)).slice(0, maxSubLines);
  subheadLines.forEach((line) => {
    ctx.fillText(line, paddingX, topCursor);
    topCursor += subheadFontSize * 1.35;
  });

  // ------------------------------------------------------------------------
  // PRODUCT HERO LABEL (Pequeno selo de exibição do asset em 3/4)
  // ------------------------------------------------------------------------
  const heroLabelText = `VITRINE: ${poster.modelName.toUpperCase()} • ${poster.modelCategory.toUpperCase()}`;
  ctx.font = '600 20px "Chakra Petch", sans-serif';
  const heroLabelWidth = ctx.measureText(heroLabelText).width + 36;
  const heroLabelHeight = 40;
  const heroLabelY = height * 0.58;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, width - paddingX - heroLabelWidth, heroLabelY, heroLabelWidth, heroLabelHeight, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f1f5f9';
  ctx.textBaseline = 'middle';
  ctx.fillText(heroLabelText, width - paddingX - heroLabelWidth + 18, heroLabelY + heroLabelHeight / 2);

  // ------------------------------------------------------------------------
  // BOTTOM SECTION: Selos B2B + CTA + Sede Corporativa
  // ------------------------------------------------------------------------
  let bottomCursor = height - (isStories ? 250 : (isPortrait ? 150 : 100));

  // Badges Bar (Oficina 2 Elevadores | CONTRAN 996 | Margens)
  const badgeTags = [
    poster.liftsMetric.toUpperCase(),
    poster.profitMetric.toUpperCase(),
    'CONTRAN 996'
  ];

  let badgeX = paddingX;
  ctx.font = '700 20px "Chakra Petch", sans-serif';

  badgeTags.forEach(tag => {
    const tagW = ctx.measureText(tag).width + 30;
    const tagH = 38;

    ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    roundRect(ctx, badgeX, bottomCursor, tagW, tagH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, badgeX + 15, bottomCursor + tagH / 2);

    badgeX += tagW + 12;
  });

  bottomCursor += 55;

  // CTA Pill Box
  if (isStories || isPortrait) {
    const ctaBoxHeight = 64;
    const ctaGrad = ctx.createLinearGradient(paddingX, 0, width - paddingX, 0);
    ctaGrad.addColorStop(0, '#00f0ff');
    ctaGrad.addColorStop(1, '#00b8d4');

    ctx.fillStyle = ctaGrad;
    roundRect(ctx, paddingX, bottomCursor, width - (paddingX * 2), ctaBoxHeight, 12);
    ctx.fill();

    ctx.fillStyle = '#050b14';
    ctx.font = '800 26px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ SEJA UM FRANQUEADO Z8  •  TOQUE EM SAIBA MAIS', width / 2, bottomCursor + ctaBoxHeight / 2);

    bottomCursor += ctaBoxHeight + 20;

    // Corporate Legal Baseline
    ctx.font = '400 18px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • SÃO JOSÉ DOS CAMPOS - SP', width / 2, bottomCursor);
  }

  ctx.restore();
}

// Helper: Word Wrap
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Helper: Rounded Rectangle
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper: Download Canvas
function downloadPosterCanvas(canvas, poster) {
  const formatKey = currentFormat;
  const filename = `${poster.id}_${formatKey}_1080p.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();

  showToast(`Download iniciado: ${filename}`);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
