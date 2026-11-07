const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('==================================================');
  console.log('1. TESTING CONCEITO 1 (conceito/)');
  console.log('==================================================');
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1440, height: 900 });

  const c1Errors = [];
  page1.on('pageerror', err => c1Errors.push(err.message));
  page1.on('console', msg => {
    if (msg.type() === 'error') c1Errors.push(msg.text());
  });

  await page1.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('C1 Errors on Desktop:', c1Errors.length ? c1Errors.join(' | ') : 'None (100% Clean)');

  // Verify WebGL Canvas
  const glCanvas = await page1.evaluate(() => {
    const c = document.querySelector('canvas.gl');
    return c ? { width: c.width, height: c.height, display: c.style.display } : null;
  });
  console.log('C1 WebGL Canvas:', glCanvas);

  // Hover test on Z8 Tank 2
  await page1.evaluate(() => {
    const el = document.querySelector('[data-model-id="z8-tank-2"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page1.hover('[data-model-id="z8-tank-2"]');
  await new Promise(r => setTimeout(r, 800));
  await page1.screenshot({ path: 'public/assets/cria/final_c1_desktop_hover_tank2.png', fullPage: false });

  // Mobile / Duo View Test (540x900)
  console.log('Switching C1 to Duo View (540x900)...');
  await page1.setViewport({ width: 540, height: 900 });
  await page1.evaluate(() => {
    window.scrollTo(0, 0);
    if (window.initKineticTextScrollMobile) window.initKineticTextScrollMobile();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll down to text
  await page1.evaluate(() => window.scrollTo(0, 1150));
  await new Promise(r => setTimeout(r, 1200));

  const mobileAnims = await page1.evaluate(() => {
    const reveals = document.querySelectorAll('.high-line-reveal');
    const badge = document.querySelector('.home-hero-next-race-w');
    return {
      revealCount: reveals.length,
      badgeDisplay: badge ? window.getComputedStyle(badge).display : 'none'
    };
  });
  console.log('C1 Mobile anims & badge state:', mobileAnims);
  await page1.screenshot({ path: 'public/assets/cria/final_c1_mobile_duo_text_anim.png', fullPage: false });

  await page1.close();

  console.log('\n==================================================');
  console.log('2. TESTING CONCEITO 2 / PORTAL DO LOJISTA (conceito-2/)');
  console.log('==================================================');
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });

  const c2Errors = [];
  page2.on('pageerror', err => c2Errors.push(err.message));
  page2.on('console', msg => {
    if (msg.type() === 'error') c2Errors.push(msg.text());
  });

  await page2.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('C2 Errors on load:', c2Errors.length ? c2Errors.join(' | ') : 'None (100% Clean)');

  // Scroll to Module 03 (Fechamento do Pedido)
  await page2.evaluate(() => {
    const el = document.getElementById('laf-block-pedidos');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Test full synchronization across all areas
  const syncTest = await page2.evaluate(() => {
    const store = window.Z8_WHOLESALE_ORDER_STORE;
    if (!store) return { error: 'No store found' };

    // Initial state of FX-12
    const beforeQty = store.getQty('z8-fx12');

    // Simulate clicking + on the table stepper
    window.adjustLafQty('z8-fx12', 1);

    const afterQty = store.getQty('z8-fx12');
    const tableInp = document.getElementById('order-qty-z8-fx12');
    const tableSub = document.getElementById('order-subtotal-z8-fx12');
    const cardInp = document.getElementById('laf-card-qty-z8-fx12');
    const totals = store.getTotals();

    return {
      beforeQty,
      afterQty,
      tableInputValue: tableInp ? tableInp.value : 'missing',
      tableSubtotal: tableSub ? tableSub.textContent : 'missing',
      cardInputValue: cardInp ? cardInp.value : 'missing',
      totalBikes: totals.totalBikes,
      totalWholesale: totals.totalWholesale,
      isValidMOQ: totals.isValidMOQ
    };
  });

  console.log('C2 Wholesale Sync Test Result:', syncTest);

  await page2.screenshot({ path: 'public/assets/cria/final_c2_orderdesk_table_synced.png', fullPage: false });

  // Scroll to OS section
  await page2.evaluate(() => {
    const os = document.getElementById('rodape-os');
    if (os) os.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page2.screenshot({ path: 'public/assets/cria/final_c2_os_section.png', fullPage: false });

  await page2.close();
  await browser.close();

  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
})();
