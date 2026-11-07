const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });

  await page.addStyleTag({
    content: `
      @media screen and (max-width: 991px) {
        .horizontal-pin-sticky {
          position: sticky !important;
          top: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
          display: flex !important;
        }
        .horizontal-track {
          display: flex !important;
          flex-flow: row nowrap !important;
          height: 100vh !important;
          width: max-content !important;
          gap: 5vw !important;
          padding-left: 50vw !important;
          padding-right: 20vw !important;
          padding-top: calc(var(--vh, 1vh) * 6) !important;
          padding-bottom: calc(var(--vh, 1vh) * 4) !important;
          align-items: center !important;
        }
        .horizontal-grid-col {
          display: flex !important;
          flex-flow: column nowrap !important;
          justify-content: center !important;
          align-items: center !important;
          flex-shrink: 0 !important;
          width: 82vw !important;
          max-width: 82vw !important;
          height: 85vh !important;
          gap: 2vh !important;
          margin: 0 !important;
        }
        .horizontal-grid-spacer {
          width: 4vw !important;
          min-width: 4vw !important;
          flex: 0 0 4vw !important;
        }
        .horizontal-item-w {
          width: 100% !important;
          max-width: 100% !important;
          position: relative !important;
          left: auto !important;
          right: auto !important;
          margin: 0 !important;
        }
        .horizontal-item-img-w {
          width: 100% !important;
          max-width: 100% !important;
          height: 28vh !important;
          max-height: 28vh !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        .image.is-horizontal-scroll {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transform: none !important;
        }
        .horizontal-item-w.is-text-callout {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        .horizontal-item-text {
          font-size: 1.15rem !important;
          line-height: 1.35 !important;
        }
      }
    `
  });

  const secInfo = await page.evaluate(() => {
    window.qp();
    window.Gp();
    window.D7();
    window.E7();
    window.HP();
    window.rW();
    window.ScrollTrigger.refresh();

    const sec = document.querySelector('[data-horizontal-section]');
    const track = document.querySelector('.horizontal-track');
    return {
      secTop: sec?.offsetTop,
      secHeight: sec?.offsetHeight,
      trackW: track?.offsetWidth,
      trackScrollW: track?.scrollWidth
    };
  });
  console.log('Sec Info with 50vw padding-left:', secInfo);

  // Check at secTop, secTop + 400, secTop + 800, secTop + 1200
  for (let offset = 0; offset <= 1200; offset += 400) {
    const scrollTarget = secInfo.secTop + offset;
    await page.evaluate((val) => {
      window.lenis.scrollTo(val, { immediate: true });
      window.ScrollTrigger.update();
    }, scrollTarget);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `public/assets/cria/mobile_horiz_offset_${offset}.png` });
  }

  await browser.close();
})();
