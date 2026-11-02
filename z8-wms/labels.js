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
   * @returns {string} HTML string of the label
   */
  generateLabelHtml(vehicle, size = '100x50') {
    const isLarge = size === '100x50';
    const qrSize = isLarge ? 84 : 64;
    const barcodeHeight = isLarge ? 34 : 26;

    const qrPayload = JSON.stringify({
      vin: vehicle.chassisVin,
      model: vehicle.modelName || vehicle.modelId,
      code: vehicle.factoryCode,
      color: vehicle.color,
      tires: `${vehicle.tireFront}/${vehicle.tireRear}`,
      battery: vehicle.battery,
      motor: vehicle.motor
    });

    return `
      <div class="thermal-label ${isLarge ? 'label-100x50' : 'label-80x40'}" id="printable-thermal-label">
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
            <canvas id="label-qr-canvas" width="${qrSize}" height="${qrSize}"></canvas>
            <span class="qr-sub">SCAN PDI</span>
          </div>
        </div>

        <div class="label-barcode-row">
          <svg id="label-barcode-svg"></svg>
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
   */
  renderCodes(vehicle, size = '100x50') {
    // 1. Render Barcode Code-128 using JsBarcode
    if (window.JsBarcode) {
      try {
        window.JsBarcode('#label-barcode-svg', vehicle.chassisVin, {
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
        const qrCanvas = document.getElementById('label-qr-canvas');
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
   * Trigger print window with thermal layout
   */
  print() {
    window.print();
  }
};
