/**
 * Z8 E-MOTION // WMS LOCAL HOST SERVER
 * Standalone Node.js HTTP server (Zero external npm dependency required).
 * Serves Desktop WMS Cockpit, Mobile Scanner Companion, Local JSON DB & Photo Uploads.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3300;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'wms-database.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

/**
 * Get local IPv4 address on LAN / Wi-Fi
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

/**
 * Read request body helper
 */
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

const server = http.createServer(async (req, res) => {
  // Enable CORS for LAN access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  // ================= API ENDPOINTS =================

  // 1. Health check & status
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'Z8-WMS', version: '2026.1' }));
    return;
  }

  // 2. Network info (Local Wi-Fi IP for smartphone companion)
  if (pathname === '/api/network-info') {
    const localIp = getLocalIpAddress();
    const mobileUrl = `http://${localIp}:${PORT}/mobile-scanner/`;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ localIp, port: PORT, mobileUrl }));
    return;
  }

  // 3. Database snapshot sync (Save to disk)
  if (pathname === '/api/sync' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req);
      const parsed = JSON.parse(rawBody);
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 4. Database snapshot read
  if (pathname === '/api/db' && req.method === 'GET') {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database file not initialized yet' }));
    }
    return;
  }

  // 5. Photo upload from mobile companion or desktop
  if (pathname === '/api/upload-photo' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req);
      const { chassisVin, photoBase64 } = JSON.parse(rawBody);

      if (!photoBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing photoBase64' }));
        return;
      }

      // Extract binary from base64 data:image/jpeg;base64,...
      const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer = null;
      let ext = '.jpg';

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
        if (matches[1].includes('png')) ext = '.png';
      } else {
        buffer = Buffer.from(photoBase64, 'base64');
      }

      const safeVin = (chassisVin || 'CHASSIS').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeVin}_${Date.now()}${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      const photoUrl = `/uploads/${filename}`;

      // Update in local DB file if exists
      if (fs.existsSync(DB_FILE)) {
        try {
          const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
          if (dbData.data && dbData.data.vehicles) {
            const vehicle = dbData.data.vehicles.find(v => v.chassisVin === chassisVin);
            if (vehicle) {
              if (!vehicle.photos) vehicle.photos = [];
              vehicle.photos.push(photoUrl);
              fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
            }
          }
        } catch (e) {}
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, photoUrl }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 6. Lookup vehicle by VIN
  if (pathname.startsWith('/api/vehicle/') && req.method === 'GET') {
    const vin = pathname.replace('/api/vehicle/', '');
    if (fs.existsSync(DB_FILE)) {
      try {
        const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        if (dbData.data && dbData.data.vehicles) {
          const v = dbData.data.vehicles.find(item => item.chassisVin.toLowerCase() === vin.toLowerCase());
          if (v) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(v));
            return;
          }
        }
      } catch (e) {}
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Vehicle not found' }));
    return;
  }

  // 7. Update status endpoint
  if (pathname === '/api/update-status' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req);
      const { chassisVin, status } = JSON.parse(rawBody);

      if (fs.existsSync(DB_FILE)) {
        const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        if (dbData.data && dbData.data.vehicles) {
          const v = dbData.data.vehicles.find(item => item.chassisVin === chassisVin);
          if (v) {
            v.status = status;
            fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
          }
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, chassisVin, status }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ================= STATIC FILES SERVING =================
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

  // If path is a directory, check for index.html inside
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Security check: prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>404 Not Found</h1><p>Resource ${pathname} not found on Z8-WMS server.</p>`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  console.log('================================================================');
  console.log('   Z8 E-MOTION // WAREHOUSE MANAGEMENT SYSTEM (WMS)');
  console.log('   Official Bilingual Supply Chain & Stock Cockpit');
  console.log('================================================================');
  console.log(` > Desktop Web Cockpit:  http://localhost:${PORT}`);
  console.log(` > Mobile Scanner LAN:   http://${localIp}:${PORT}/mobile-scanner/`);
  console.log(` > Local Database File:  ${DB_FILE}`);
  console.log(` > Photo Uploads Dir:    ${UPLOADS_DIR}`);
  console.log('================================================================');
});
