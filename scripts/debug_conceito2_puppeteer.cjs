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

  page.on('console', msg => {
    logs.push('[' + msg.type() + '] ' + msg.text());
    if (msg.type() === 'error') errors.push(msg.text());
  });

  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message);
  });

  console.log('Navigating to http://localhost:3000/conceito-2/ ...');
  try {
    await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.log('Navigation note:', e.message);
  }

  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'public/assets/cria/debug_conceito2_puppeteer.png', fullPage: false });

  console.log('--- CONCEITO-2 ERRORS ---');
  console.log(errors.length ? errors.join('\n') : 'None');

  console.log('--- CONCEITO-2 LOGS (last 15) ---');
  console.log(logs.slice(-15).join('\n'));

  await browser.close();
})();
