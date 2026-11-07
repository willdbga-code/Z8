const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Find the first card (z8-tank)
  const cardSelector = '[data-model-id="z8-tank"]';
  await page.waitForSelector(cardSelector);

  // Scroll into view
  await page.evaluate(sel => {
    document.querySelector(sel).scrollIntoView({ behavior: 'instant', block: 'center' });
  }, cardSelector);

  await new Promise(r => setTimeout(r, 1000));

  // Screenshot before hover
  await page.screenshot({ path: 'public/assets/cria/hover_test_before.png', fullPage: false });

  // Hover over the card
  await page.hover(cardSelector);
  await new Promise(r => setTimeout(r, 800)); // wait for hover transition (0.6s)

  // Screenshot after hover
  await page.screenshot({ path: 'public/assets/cria/hover_test_after.png', fullPage: false });

  console.log('Hover visual test screenshots saved.');
  await browser.close();
})();
