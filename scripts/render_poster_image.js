import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve(__dirname, 'poster_jacarei_v7_desencapsulado.html');
const outputPng = path.resolve(rootDir, 'public', 'assets', 'cria', 'story_jacarei_franquia_final.png');
const distPng = path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_jacarei_franquia_final.png');

console.log(`Renderizando pôster 1080x1920 via Edge Headless...`);
console.log(`Input HTML: ${htmlFile}`);
console.log(`Output PNG: ${outputPng}`);

const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1920 --screenshot="${outputPng}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPng)) {
    console.log(`Pôster renderizado com sucesso: ${outputPng}`);
    fs.copyFileSync(outputPng, distPng);
    console.log(`Sincronizado com dist: ${distPng}`);
  } else {
    console.error(`Falha: arquivo não encontrado após renderização.`);
  }
} catch (err) {
  console.error(`Erro na renderização:`, err.message);
}
