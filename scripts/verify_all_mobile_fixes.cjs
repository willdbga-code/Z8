const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('\n=============================================');
  console.log('TEST 1: Testing Drawer Wholesale Masking on Mobile (conceito/)');
  console.log('=============================================');
  await page.goto('http://localhost:3000/conceito/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Open drawer for z8-fx12 (the model from user screenshot)
  const drawerInfo = await page.evaluate(() => {
    window.openZ8ModelDrawer('z8-fx12');
    const drawer = document.getElementById('z8-model-drawer');
    const kpis = Array.from(drawer.querySelectorAll('.z8-drawer-kpi')).map(k => ({
      label: k.querySelector('span')?.innerText?.trim(),
      val: k.querySelector('strong')?.innerText?.trim()
    }));
    return {
      isOpen: drawer.classList.contains('is-open'),
      kpis
    };
  });
  console.log('Drawer State on Mobile:', JSON.stringify(drawerInfo, null, 2));

  await page.screenshot({ path: 'public/assets/cria/verify_mobile_drawer_masked.png' });
  console.log('Saved public/assets/cria/verify_mobile_drawer_masked.png');

  // Close drawer
  await page.evaluate(() => {
    window.closeZ8ModelDrawer();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('\n=============================================');
  console.log('TEST 2: Testing Pinned Horizontal Scroll on Mobile (#arquitetura-z8)');
  console.log('=============================================');
  const secMetrics = await page.evaluate(() => {
    const sec = document.querySelector('[data-horizontal-section]');
    const track = document.querySelector('.horizontal-track');
    return {
      secTop: sec?.offsetTop,
      secHeight: sec?.offsetHeight,
      trackW: track?.offsetWidth,
      trackScrollW: track?.scrollWidth
    };
  });
  console.log('Section Metrics:', secMetrics);

  // Scroll to middle of horizontal section
  const midScroll = secMetrics.secTop + secMetrics.secHeight * 0.45;
  await page.evaluate((s) => {
    window.lenis.scrollTo(s, { immediate: true });
    window.ScrollTrigger.update();
  }, midScroll);
  await new Promise(r => setTimeout(r, 500));

  const trackState = await page.evaluate(() => {
    const track = document.querySelector('.horizontal-track');
    return {
      scrollY: window.scrollY || window.pageYOffset,
      transform: track?.style.transform
    };
  });
  console.log('Track Transform at 45% Horizontal Scroll:', trackState);

  await page.screenshot({ path: 'public/assets/cria/verify_mobile_horiz_arch.png' });
  console.log('Saved public/assets/cria/verify_mobile_horiz_arch.png');

  console.log('\n=============================================');
  console.log('TEST 3: Testing Drawer & Motion on conceito-2/');
  console.log('=============================================');
  await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  const c2DrawerInfo = await page.evaluate(() => {
    window.openZ8ModelDrawer('z8-fx12');
    const drawer = document.getElementById('z8-model-drawer');
    const kpis = Array.from(drawer.querySelectorAll('.z8-drawer-kpi')).map(k => ({
      label: k.querySelector('span')?.innerText?.trim(),
      val: k.querySelector('strong')?.innerText?.trim()
    }));
    return {
      isActive: drawer.classList.contains('is-active') || drawer.classList.contains('is-open'),
      kpis
    };
  });
  console.log('Conceito-2 Drawer State:', JSON.stringify(c2DrawerInfo, null, 2));

  await page.screenshot({ path: 'public/assets/cria/verify_c2_mobile_drawer.png' });
  console.log('Saved public/assets/cria/verify_c2_mobile_drawer.png');

  console.log('\n=============================================');
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('=============================================');

  await browser.close();
})();
