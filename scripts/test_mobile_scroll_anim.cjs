const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  // Duo closed / mobile viewport
  await page.setViewport({ width: 540, height: 900 });

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot at hero
  await page.screenshot({ path: 'public/assets/cria/mobile_scroll_1_hero.png', fullPage: false });

  // Scroll down to text section "Grandes negócios..."
  await page.evaluate(() => {
    window.scrollTo(0, 1200);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'public/assets/cria/mobile_scroll_2_quote.png', fullPage: false });

  // Scroll down to SHOWROOM / OFICINA
  await page.evaluate(() => {
    window.scrollTo(0, 2200);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'public/assets/cria/mobile_scroll_3_showroom.png', fullPage: false });

  console.log('Mobile scroll screenshots captured.');
  await browser.close();
})();
