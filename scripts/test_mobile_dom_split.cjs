const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  // Surface Duo closed is 540x720, open is 1114x720
  await page.setViewport({ width: 540, height: 720 });

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const highEls = Array.from(document.querySelectorAll('[data-anim-high]'));
    return highEls.map(el => ({
      text: el.textContent.trim().substring(0, 40),
      attr: el.getAttribute('data-anim-high'),
      hasLines: el.querySelectorAll('.line').length,
      hasReveal: el.querySelectorAll('.high-line-reveal').length,
      style: el.getAttribute('style')
    }));
  });

  console.log('Mobile view elements info:', JSON.stringify(info, null, 2));

  await browser.close();
})();
