const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Scroll to slide 2 (quote + master flagship) and slide 3 (oficina)
  const secTop = await page.evaluate(() => document.querySelector('[data-horizontal-section]')?.offsetTop || 0);

  // Slide 2: around +600px
  await page.evaluate((top) => {
    window.lenis.scrollTo(top + 500, { immediate: true });
    window.ScrollTrigger.update();
  }, secTop);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'public/assets/cria/verify_mobile_arch_slide2.png' });

  // Slide 3: around +1000px
  await page.evaluate((top) => {
    window.lenis.scrollTo(top + 1000, { immediate: true });
    window.ScrollTrigger.update();
  }, secTop);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'public/assets/cria/verify_mobile_arch_slide3.png' });

  console.log('Saved slides 2 and 3');
  await browser.close();
})();
