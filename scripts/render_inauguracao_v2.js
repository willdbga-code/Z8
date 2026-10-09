import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const criaPubDir = path.resolve(rootDir, 'public', 'assets', 'cria');
const criaDistDir = path.resolve(rootDir, 'dist', 'assets', 'cria');
const postersPubDir = path.resolve(rootDir, 'public', 'assets', 'cria', 'posters');
const postersDistDir = path.resolve(rootDir, 'dist', 'assets', 'cria', 'posters');

fs.mkdirSync(criaPubDir, { recursive: true });
fs.mkdirSync(criaDistDir, { recursive: true });
fs.mkdirSync(postersPubDir, { recursive: true });
fs.mkdirSync(postersDistDir, { recursive: true });

const formats = [
  {
    name: 'Reels / Stories (9:16)',
    width: 1080,
    height: 1920,
    html: path.resolve(__dirname, 'poster_inauguracao_reels_v2.html'),
    output: path.resolve(criaPubDir, 'story_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'story_inauguracao_preco_fabrica_final.png')
  },
  {
    name: 'Feed Retrato (4:5)',
    width: 1080,
    height: 1350,
    html: path.resolve(__dirname, 'poster_inauguracao_portrait_v2.html'),
    output: path.resolve(criaPubDir, 'feed_portrait_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'feed_portrait_inauguracao_preco_fabrica_final.png')
  },
  {
    name: 'Feed Quadrado (1:1)',
    width: 1080,
    height: 1080,
    html: path.resolve(__dirname, 'poster_inauguracao_square_v2.html'),
    output: path.resolve(criaPubDir, 'feed_square_inauguracao_preco_fabrica_final.png'),
    dist: path.resolve(criaDistDir, 'feed_square_inauguracao_preco_fabrica_final.png')
  }
];

console.log('=== RENDERIZANDO PACOTE OFICIAL DE INAUGURAÇÃO Z8 (INSPIRADO 30 OUTUBRO) ===\n');

for (const fmt of formats) {
  console.log(`Renderizando ${fmt.name} (${fmt.width}x${fmt.height})...`);
  const fileUrl = `file:///${fmt.html.replace(/\\/g, '/')}`;
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=${fmt.width},${fmt.height} --virtual-time-budget=3000 --screenshot="${fmt.output}" "${fileUrl}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(fmt.output)) {
      const stat = fs.statSync(fmt.output);
      console.log(`✓ ${fmt.name} renderizado (${(stat.size / 1024 / 1024).toFixed(2)} MB): ${fmt.output}`);
      fs.copyFileSync(fmt.output, fmt.dist);
      console.log(`✓ Sincronizado com dist: ${fmt.dist}\n`);
    } else {
      console.error(`✗ Erro: Arquivo de saída não encontrado para ${fmt.name}`);
    }
  } catch (err) {
    console.error(`✗ Erro na renderização de ${fmt.name}:`, err.message);
  }
}

console.log('=== RENDERIZAÇÃO COMPLETA COM SUCESSO! ===');
