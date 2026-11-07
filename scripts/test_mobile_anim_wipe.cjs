const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 900 });

  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Inject the mobile kinetic text function and run it
  await page.evaluate(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap) return;

    const elements = document.querySelectorAll('[data-anim-high]');
    const Q = 0.6;
    const Z = 0.6;
    const stagger = 0.12;

    elements.forEach((W) => {
      if (W._highLinesInstance) return;

      const animAttr = W.getAttribute('data-anim-high') || 'right, lime, 0';
      const [dir, colorName, delayMs] = animAttr.split(',').map((s) => s.trim());
      const isRight = dir !== 'left';
      const delay = parseFloat(delayMs || '0') / 1000;

      const colorMap = {
        lime: 'var(--color--lime, #00F0FF)',
        'lime-off': 'var(--color--lime-off, #00D4FF)',
        'dark-green': 'var(--color--dark-green, #0A1628)',
        'dark-green-tint-1': 'var(--color--dark-green-tint-1, #1E293B)',
        black: 'var(--color--black, #111112)',
        white: 'var(--color--white, #F4F5F7)'
      };
      const barBg = colorMap[colorName] || 'var(--color--lime, #00F0FF)';

      const lines = W.querySelectorAll('.line');
      if (!lines.length) return;

      const tl = gsap.timeline({ paused: true, delay });

      lines.forEach((M, idx) => {
        M.style.position = 'relative';
        if (isRight) {
          gsap.set(M, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 });
        } else {
          gsap.set(M, { clipPath: 'inset(0 0 0 100%)', autoAlpha: 1 });
        }

        let bar = M.querySelector('.high-line-reveal');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'high-line-reveal';
          bar.style.position = 'absolute';
          bar.style.top = '0';
          bar.style.left = '0';
          bar.style.width = '100%';
          bar.style.height = '100%';
          bar.style.backgroundColor = barBg;
          bar.style.transformOrigin = isRight ? 'right center' : 'left center';
          bar.style.zIndex = '5';
          M.appendChild(bar);
        }
        gsap.set(bar, { scaleX: 1 });

        const startTime = idx * stagger;
        if (isRight) {
          tl.to(M, { clipPath: 'inset(0 0% 0 0)', duration: Q, ease: 'power2.out' }, startTime);
        } else {
          tl.to(M, { clipPath: 'inset(0 0 0 0%)', duration: Q, ease: 'power2.out' }, startTime);
        }
        tl.to(bar, { scaleX: 0, duration: Z, ease: 'power2.inOut' }, startTime + Q / 2);
      });

      W._highLinesInstance = { timeline: tl };

      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: W,
          start: 'top 92%',
          once: true,
          onEnter: () => tl.play()
        });
      }
    });

    if (ScrollTrigger) ScrollTrigger.refresh();
  });

  // Now scroll to 1200
  await page.evaluate(() => {
    window.scrollTo(0, 1100);
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: 'public/assets/cria/test_mobile_anim_wiped.png', fullPage: false });

  console.log('Mobile anim test screenshot saved.');
  await browser.close();
})();
