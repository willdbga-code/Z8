const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const logs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    logs.push('[' + msg.type() + '] ' + msg.text());
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message + '\n' + err.stack);
  });

  page.on('requestfailed', req => {
    failedRequests.push(req.method() + ' ' + req.url() + ' - ' + (req.failure() ? req.failure().errorText : 'unknown'));
  });

  console.log('Navigating to http://localhost:3000/conceito/ ...');
  try {
    await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.log('Navigation note:', e.message);
  }

  // Wait 4 seconds for WebGL / Rive
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'public/assets/cria/debug_conceito_puppeteer.png', fullPage: false });

  console.log('--- FAILED REQUESTS ---');
  console.log(failedRequests.length ? failedRequests.join('\n') : 'None');

  console.log('--- ERRORS ---');
  console.log(errors.length ? errors.join('\n') : 'None');

  console.log('--- ALL LOGS (first 30) ---');
  console.log(logs.slice(0, 30).join('\n'));

  // Check canvas elements and DOM state
  const debugInfo = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      className: c.className,
      id: c.id,
      width: c.width,
      height: c.height,
      style: c.getAttribute('style'),
      rect: c.getBoundingClientRect()
    }));
    return {
      canvases,
      hasLandoGL: typeof window.landoGL !== 'undefined',
      landoGLKeys: window.landoGL ? Object.keys(window.landoGL) : [],
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className
    };
  });
  console.log('--- DEBUG INFO ---', JSON.stringify(debugInfo, null, 2));

  await browser.close();
})();
