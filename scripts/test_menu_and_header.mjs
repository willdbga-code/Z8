import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/LENOVO/.gemini/antigravity/brain/64cd8590-e30a-466c-b62c-044e35cff8ac';

async function bypassTransition(page) {
  await page.evaluate(() => {
    const transW = document.querySelector('.transition-w');
    if (transW) {
      transW.style.display = 'none';
      transW.style.opacity = '0';
      transW.style.pointerEvents = 'none';
    }
    const pageW = document.querySelector('.page-w');
    if (pageW) {
      pageW.removeAttribute('data-start');
      pageW.style.opacity = '1';
      pageW.style.visibility = 'visible';
    }
  });
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Navigate first to set origin
  await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });

  // Set Christian as admin user in localStorage with correct key: z8_catalog_auth_user
  await page.evaluate(() => {
    const adminUser = {
      id: 'usr-admin-christian',
      email: 'christian.tkh@gmail.com',
      name: 'Christian Hideyuki',
      company: 'Z8 E-Motion Brasil (Matriz)',
      role: 'admin',
      status: 'approved',
      city: 'São Paulo',
      state: 'SP',
      token: 'admin-token-123'
    };
    localStorage.setItem('z8_catalog_auth_user', JSON.stringify(adminUser));
    localStorage.setItem('z8_catalog_auth_token', 'admin-token-123');
  });

  // Reload page so syncAuthState runs with the logged in user
  await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });
  await bypassTransition(page);
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot of top navbar area
  const headerShot = path.join(ARTIFACTS_DIR, 'header_admin_no_redundant_badge.png');
  await page.screenshot({ path: headerShot, clip: { x: 0, y: 0, width: 1440, height: 90 } });
  console.log('Saved:', headerShot);

  // Also open hamburger menu when admin is logged in (matching media_1793652447714_4983d149.png)
  await page.evaluate(() => {
    const navMenu = document.querySelector('[data-nav-m]');
    if (navMenu) {
      navMenu.style.display = 'flex';
      navMenu.style.opacity = '1';
      navMenu.style.visibility = 'visible';
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const menuWithAdminShot = path.join(ARTIFACTS_DIR, 'menu_with_admin_logged_in.png');
  await page.screenshot({ path: menuWithAdminShot });
  console.log('Saved:', menuWithAdminShot);

  await browser.close();
  console.log('Admin header test completed successfully!');
}

run().catch(console.error);
