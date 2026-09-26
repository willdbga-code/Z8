import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const tests = [
  {
    name: 'Opção 1: Tech Avant-Garde (Unbounded)',
    html: path.resolve(__dirname, 'poster_jacarei_reels_opt1.html'),
    outPub: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_jacarei_reels_opt1_avantgarde.png'),
    outDist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_jacarei_reels_opt1_avantgarde.png')
  },
  {
    name: 'Opção 2: Sculptural Luxury (Syne)',
    html: path.resolve(__dirname, 'poster_jacarei_reels_opt2.html'),
    outPub: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_jacarei_reels_opt2_luxury.png'),
    outDist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_jacarei_reels_opt2_luxury.png')
  }
];

console.log('=== RENDERIZANDO AS 2 NOVAS PERSPECTIVAS PARA REELS ===\n');

for (const t of tests) {
  console.log(`Renderizando ${t.name}...`);
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1920 --screenshot="${t.outPub}" "file:///${t.html.replace(/\\/g, '/')}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(t.outPub)) {
      fs.copyFileSync(t.outPub, t.outDist);
      console.log(`Sucesso: ${t.outPub}\n`);
    }
  } catch (e) {
    console.error(`Erro em ${t.name}:`, e.message);
  }
}

console.log('=== CONCLUÍDO ===');
