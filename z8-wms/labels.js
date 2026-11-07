/**
 * Z8 E-MOTION // THERMAL LABEL GENERATOR ENGINE
 * Formats: 100x50mm (Industrial Zebra / Argox) & 80x40mm (Compact Roll)
 * Generates Code128 1D Barcode & 2D QR Code
 */

export const ThermalLabelEngine = {
  /**
   * Render label HTML inside a target container
   * @param {Object} vehicle - Vehicle object with chassisVin, modelName, factoryCode, etc.
   * @param {string} size - '100x50' or '80x40'
   * @param {number|string} index - Optional identifier for batch rendering
   * @returns {string} HTML string of the label
   */
  generateLabelHtml(vehicle, size = '100x50', index = 'single') {
    const isLarge = size === '100x50';
    const qrSize = isLarge ? 84 : 64;
    const barcodeHeight = isLarge ? 34 : 26;
    const svgId = `label-barcode-svg-${index}`;
    const qrId = `label-qr-canvas-${index}`;

    return `
      <div class="thermal-label ${isLarge ? 'label-100x50' : 'label-80x40'}" id="printable-thermal-label-${index}">
        <div class="label-header">
          <div class="label-brand">
            <span class="brand-text">Z8 E-MOTION</span>
            <span class="brand-sub">ELECTRIC MOTORCYCLES // 巴西电动摩托</span>
          </div>
          <div class="label-factory-tag">
            <span class="tag-code">${vehicle.factoryCode || 'DB-STD'}</span>
            <span class="tag-cat">${vehicle.category || 'EXP'}</span>
          </div>
        </div>

        <div class="label-body">
          <div class="label-info-col">
            <div class="label-model-title">${vehicle.modelName || 'Z8 Electric Motorcycle'}</div>
            <div class="label-vin-box">
              <span class="vin-lbl">CHASSI / VIN:</span>
              <span class="vin-code">${vehicle.chassisVin}</span>
            </div>
            
            <div class="label-telemetry-grid">
              <div class="telem-item">
                <span class="t-k">PNEUS:</span>
                <span class="t-v">${vehicle.tireFront || '3.00-10'} / ${vehicle.tireRear || '3.00-10'}</span>
              </div>
              <div class="telem-item">
                <span class="t-k">MOTOR:</span>
                <span class="t-v">${(vehicle.motor || '1200W').substring(0, 16)}</span>
              </div>
              <div class="telem-item">
                <span class="t-k">COR:</span>
                <span class="t-v">${vehicle.color || 'Padrão'}</span>
              </div>
              <div class="telem-item">
                <span class="t-k">BATERIA:</span>
                <span class="t-v">${(vehicle.battery || '60V').substring(0, 16)}</span>
              </div>
            </div>
          </div>

          <div class="label-qr-col">
            <canvas id="${qrId}" width="${qrSize}" height="${qrSize}"></canvas>
            <span class="qr-sub">SCAN PDI</span>
          </div>
        </div>

        <div class="label-barcode-row">
          <svg id="${svgId}"></svg>
        </div>

        <div class="label-footer">
          <span>HOMOLOGAÇÃO CONTRAN 996</span>
          <span class="dot">•</span>
          <span>CNPJ: 68.774.164/0001-00</span>
          <span class="dot">•</span>
          <span>ORIGEM: ${vehicle.factoryBase || 'FABRICA CHINA'}</span>
        </div>
      </div>
    `;
  },

  /**
   * Render Barcode and QR code onto the generated HTML elements
   * @param {Object} vehicle 
   * @param {string} size 
   * @param {number|string} index 
   */
  renderCodes(vehicle, size = '100x50', index = 'single') {
    const svgSelector = `#label-barcode-svg-${index}`;
    const qrCanvasId = `label-qr-canvas-${index}`;

    // 1. Render Barcode Code-128 using JsBarcode
    if (window.JsBarcode && document.querySelector(svgSelector)) {
      try {
        window.JsBarcode(svgSelector, vehicle.chassisVin, {
          format: 'CODE128',
          width: size === '100x50' ? 1.6 : 1.3,
          height: size === '100x50' ? 32 : 24,
          displayValue: false,
          margin: 0,
          background: '#FFFFFF',
          lineColor: '#000000'
        });
      } catch (e) {
        console.warn('JsBarcode render error:', e);
      }
    }

    // 2. Render 2D QR Code using qrcode-generator
    if (window.qrcode) {
      try {
        const qrCanvas = document.getElementById(qrCanvasId);
        if (qrCanvas) {
          const typeNumber = 0; // auto-detect
          const errorCorrectionLevel = 'M';
          const qr = window.qrcode(typeNumber, errorCorrectionLevel);
          // Encode deep-link or chassis VIN
          qr.addData(`Z8:${vehicle.chassisVin}`);
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
        }
      } catch (e) {
        console.warn('QR code render error:', e);
      }
    }
  },

  /**
   * Generate multiple labels HTML for batch printing
   */
  generateBatchHtml(vehicles, size = '100x50') {
    return vehicles.map((v, idx) => `
      <div class="batch-label-page" style="page-break-after: always; margin-bottom: 20px;">
        ${this.generateLabelHtml(v, size, idx)}
      </div>
    `).join('');
  },

  /**
   * Render all codes in a batch
   */
  renderBatchCodes(vehicles, size = '100x50') {
    vehicles.forEach((v, idx) => {
      this.renderCodes(v, size, idx);
    });
  },

  /**
   * Trigger print window with thermal layout
   */
  print() {
    window.print();
  }
};
