import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const execAsync = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve(distDir, 'test-screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  if (req.url.startsWith('/log-overflow')) {
    console.log('\n[OVERFLOW REPORT]:', decodeURIComponent(req.url), '\n');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.url.startsWith('/mobile-view')) {
    const parsed = new URL(req.url, 'http://127.0.0.1:51730');
    const w = parsed.searchParams.get('w') || '360';
    const h = parsed.searchParams.get('h') || '1800';
    const target = parsed.searchParams.get('url') || '/site-principal/';
    const iframeHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 0; background: #CBD5E1; overflow: hidden; }
  iframe { width: ${w}px; height: ${h}px; border: none; display: block; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.15); background: #fff; }
</style>
</head>
<body>
  <iframe src="${target}"></iframe>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(iframeHtml);
    return;
  }

  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  if (ext === '.html') {
    let content = fs.readFileSync(filePath, 'utf8');
    const detector = `
    <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const vw = window.innerWidth;
        const bodyScroll = document.body.scrollWidth;
        const docScroll = document.documentElement.scrollWidth;
        const stretchers = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.closest('.comparator-table-wrap') || el.closest('.orderdesk-table-wrapper') || el.closest('.hero-stage-switcher-dock') || el.closest('.hero-stage-switcher') || el.closest('.skeuo-filter-bar') || el.closest('.skeuo-nav') || el.closest('.catalog-grid.mode-slide') || el.closest('.catalog-nav-tabs')) {
            return;
          }
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1 || el.offsetWidth > vw + 1) {
            stretchers.push({
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 40),
              id: el.id,
              offW: el.offsetWidth,
              rectR: Math.round(rect.right),
              rectW: Math.round(rect.width)
            });
          }
        });
        const results = {
          vw,
          innerWidth: window.innerWidth,
          bodyScrollWidth: bodyScroll,
          docScrollWidth: docScroll,
          stretcherCount: stretchers.length,
          stretchers: stretchers.slice(0, 15)
        };
        fetch('/log-overflow?report=' + encodeURIComponent(JSON.stringify(results)));
      }, 500);
    });
    </script>
    `;
    content = content.replace('</body>', detector + '</body>');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    return;
  }

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(51730, '127.0.0.1', async () => {
  console.log('Dist HTTP Server running on http://127.0.0.1:51730');

  const tests = [
    { name: 'site_principal_360', url: 'http://127.0.0.1:51730/mobile-view?w=360&h=1800&url=/site-principal/', winW: 800, winH: 1800 },
    { name: 'site_principal_375', url: 'http://127.0.0.1:51730/mobile-view?w=375&h=1800&url=/site-principal/', winW: 800, winH: 1800 },
    { name: 'site_principal_414', url: 'http://127.0.0.1:51730/mobile-view?w=414&h=1800&url=/site-principal/', winW: 800, winH: 1800 },
    { name: 'site_principal_768', url: 'http://127.0.0.1:51730/site-principal/', winW: 768, winH: 1400 },
    { name: 'site_principal_1280', url: 'http://127.0.0.1:51730/site-principal/', winW: 1280, winH: 1200 },
    { name: 'vendas_360', url: 'http://127.0.0.1:51730/mobile-view?w=360&h=1800&url=/vendas/', winW: 800, winH: 1800 },
    { name: 'vendas_hero_360', url: 'http://127.0.0.1:51730/mobile-view?w=360&h=1800&url=/vendas/%3Fnomodal=1', winW: 800, winH: 1800 },
    { name: 'vendas_768', url: 'http://127.0.0.1:51730/vendas/', winW: 768, winH: 1400 },
    { name: 'vendas_1280', url: 'http://127.0.0.1:51730/vendas/', winW: 1280, winH: 1200 }
  ];

  try {
    for (const t of tests) {
      const outPng = path.resolve(outDir, `${t.name}.png`);
      console.log(`Testing ${t.name} (${t.winW}x${t.winH})...`);
      const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=${t.winW},${t.winH} --screenshot="${outPng}" "${t.url}"`;
      await execAsync(cmd);
      if (fs.existsSync(outPng)) {
        const stats = fs.statSync(outPng);
        console.log(`Success: ${t.name}.png (${stats.size} bytes)`);
      }
    }
  } catch (err) {
    console.error('Error during render test:', err.message);
  } finally {
    server.close(() => {
      console.log('Dist HTTP Server stopped.');
      process.exit(0);
    });
  }
});
