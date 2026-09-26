import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve(__dirname, 'poster_guaratingueta_reels.html');
const outputPng = path.resolve(rootDir, 'public', 'assets', 'cria', 'story_guaratingueta_franquia_final.png');
const distPng = path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_guaratingueta_franquia_final.png');

console.log('Renderizando Guaratinguetá Reels (1080x1920)...');
const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1920 --screenshot="${outputPng}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPng)) {
    console.log(`Renderizado com sucesso: ${outputPng}`);
    fs.copyFileSync(outputPng, distPng);
    console.log(`Sincronizado com dist: ${distPng}`);
  } else {
    console.error('Falha: arquivo não encontrado.');
  }
} catch (e) {
  console.error('Erro na renderização:', e.message);
}
