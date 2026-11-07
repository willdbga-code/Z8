const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  await page.goto('http://localhost:3000/conceito/index.html', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // Dismiss transition curtain
  await page.evaluate(() => {
    const tw = document.querySelector('.transition-w');
    if (tw) tw.style.display = 'none';
    const pw = document.querySelector('.page-w');
    if (pw) {
      pw.removeAttribute('data-start');
      pw.style.opacity = '1';
      pw.style.visibility = 'visible';
    }
  });

  // Check texts at initial load
  const animElements = await page.evaluate(() => {
    const els = document.querySelectorAll('[data-anim-high], [split-text], .horizontal-item-text');
    return Array.from(els).map(el => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const lines = el.querySelectorAll('.line');
      return {
        tag: el.tagName,
        class: el.className,
        attrHigh: el.getAttribute('data-anim-high'),
        linesCount: lines.length,
        linesSampleStyle: lines[0] ? {
          clipPath: window.getComputedStyle(lines[0]).clipPath,
          opacity: window.getComputedStyle(lines[0]).opacity,
          visibility: window.getComputedStyle(lines[0]).visibility
        } : null,
        barsCount: el.querySelectorAll('.high-line-reveal').length,
        rect: { y: rect.y, height: rect.height }
      };
    });
  });
  console.log('Sample anim elements on mobile:', JSON.stringify(animElements.slice(0, 8), null, 2));

  // Take screenshot of Section 3 (Colossal Manifesto) on mobile
  await page.evaluate(() => {
    const sec3 = document.querySelector('.impact-content-w');
    if (sec3) sec3.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'mobile_sec3_manifesto.png' });
  console.log('Saved mobile_sec3_manifesto.png');

  // Take screenshot of Section 4 (Architecture) on mobile
  await page.evaluate(() => {
    const sec4 = document.querySelector('#arquitetura-z8');
    if (sec4) sec4.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'mobile_sec4_arch.png' });
  console.log('Saved mobile_sec4_arch.png');

  // Take screenshot of Section 5 (On Showroom / Off Oficina) on mobile
  await page.evaluate(() => {
    const sec5 = document.querySelector('.s.is-otot-home');
    if (sec5) sec5.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'mobile_sec5_otot.png' });
  console.log('Saved mobile_sec5_otot.png');

  await browser.close();
})();
