const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  page.on('console', msg => console.log('PAGE:', msg.text()));

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });

  const animReport = await page.evaluate(() => {
    // Run desktop animation engines on mobile
    if (typeof window.D7 === 'function') window.D7();
    if (typeof window.E7 === 'function') window.E7();
    if (typeof window.HP === 'function') window.HP();
    if (typeof window.rW === 'function') window.rW();
    window.ScrollTrigger?.refresh();

    // Check how many anim-high elements have lines and trigger attached
    const animHighEls = Array.from(document.querySelectorAll('[data-anim-high]')).map(el => ({
      text: el.innerText.trim().slice(0, 30),
      hasInstance: !!el._highLinesInstance,
      bars: el.querySelectorAll('.high-lines-bar').length,
      lines: el.querySelectorAll('.line').length
    }));

    return {
      totalAnimHigh: animHighEls.length,
      sample: animHighEls.slice(0, 8)
    };
  });

  console.log('Anim Report:', JSON.stringify(animReport, null, 2));

  // Scroll to first anim-high element and take screenshot
  await page.evaluate(() => {
    const el = document.querySelector('[data-anim-high]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    window.ScrollTrigger?.update();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'public/assets/cria/mobile_text_anim_test.png' });
  console.log('Saved mobile_text_anim_test.png');

  await browser.close();
})();
