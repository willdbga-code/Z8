const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to #portal-lojista
  const portalExists = await page.evaluate(() => {
    const el = document.getElementById('portal-lojista');
    if (!el) return { found: false };
    el.scrollIntoView();
    return {
      found: true,
      innerHTML_length: el.innerHTML.length,
      hasLafGrid: !!document.getElementById('laf-catalog-grid'),
      hasQuickButtons: !!document.querySelector('.z8-laf-quick-batches'),
      hasOSSection: !!document.getElementById('portal-os-section'),
      first100Chars: el.innerHTML.substring(0, 100)
    };
  });

  console.log('Portal exists check:', portalExists);

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'public/assets/cria/debug_conceito2_scrolled.png', fullPage: false });

  await browser.close();
})();
