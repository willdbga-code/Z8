import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Detectar Edge Headless
const possibleEdgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
let edgePath = possibleEdgePaths.find(p => fs.existsSync(p));
if (!edgePath) {
  edgePath = possibleEdgePaths[0]; // fallback
}

console.log(`[INIT] Usando executável Edge: ${edgePath}`);

// 2. Setup e Sincronização de Bases Fotográficas
const postersPubDir = path.resolve(rootDir, 'public', 'assets', 'cria', 'posters');
const postersDistDir = path.resolve(rootDir, 'dist', 'assets', 'cria', 'posters');
const criaPubDir = path.resolve(rootDir, 'public', 'assets', 'cria');
const criaDistDir = path.resolve(rootDir, 'dist', 'assets', 'cria');

fs.mkdirSync(postersPubDir, { recursive: true });
fs.mkdirSync(postersDistDir, { recursive: true });
fs.mkdirSync(criaPubDir, { recursive: true });
fs.mkdirSync(criaDistDir, { recursive: true });

// Sincronizar bases canônicas de public para dist
const baseFiles = [
  'base_inauguracao_z8.jpg',
  'base_inauguracao_z8_4x5.jpg',
  'base_inauguracao_z8_1x1.jpg',
  'bike_cutout_z8.png',
  'bike_cutout_z8_1x1.png'
];

for (const file of baseFiles) {
  const pubFile = path.join(postersPubDir, file);
  const distFile = path.join(postersDistDir, file);
  if (fs.existsSync(pubFile)) {
    fs.copyFileSync(pubFile, distFile);
    console.log(`✓ Base fotográfica sincronizada: ${file}`);
  }
}

// 3. Formatos para Renderização
const formats = [
  {
    name: 'Inauguração Reels / Stories (9:16)',
    width: 1080,
    height: 1920,
    html: path.resolve(__dirname, 'poster_inauguracao_reels.html'),
    output: path.resolve(criaPubDir, 'story_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'story_inauguracao_preco_fabrica_final.png')
  },
  {
    name: 'Inauguração Feed Retrato (4:5)',
    width: 1080,
    height: 1350,
    html: path.resolve(__dirname, 'poster_inauguracao_portrait.html'),
    output: path.resolve(criaPubDir, 'feed_portrait_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'feed_portrait_inauguracao_preco_fabrica_final.png')
  },
  {
    name: 'Inauguração Feed Quadrado (1:1)',
    width: 1080,
    height: 1080,
    html: path.resolve(__dirname, 'poster_inauguracao_square.html'),
    output: path.resolve(criaPubDir, 'feed_square_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'feed_square_inauguracao_preco_fabrica_final.png')
  }
];

console.log('\n=== INICIANDO RENDERIZAÇÃO DO PACOTE DE INAUGURAÇÃO Z8 (DALE CARNEGIE) ===');

for (const fmt of formats) {
  console.log(`\nRenderizando ${fmt.name} (${fmt.width}x${fmt.height})...`);
  const fileUrl = `file:///${fmt.html.replace(/\\/g, '/')}`;
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=${fmt.width},${fmt.height} --virtual-time-budget=3000 --screenshot="${fmt.output}" "${fileUrl}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(fmt.output)) {
      const stats = fs.statSync(fmt.output);
      console.log(`✓ Renderizado com sucesso (${(stats.size / 1024 / 1024).toFixed(2)} MB): ${fmt.output}`);
      fs.copyFileSync(fmt.output, fmt.dist);
      console.log(`✓ Sincronizado com dist: ${fmt.dist}`);
    } else {
      console.error(`✗ Erro: Arquivo final não encontrado para ${fmt.name}`);
    }
  } catch (err) {
    console.error(`✗ Erro na renderização de ${fmt.name}:`, err.message);
  }
}

console.log('\n=== PACOTE DE INAUGURAÇÃO Z8 FINALIZADO COM SUCESSO! ===\n');
