import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve(__dirname, 'poster_guaratingueta_portrait.html');
const outputPng = path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_portrait_guaratingueta_franquia_final.png');
const distPng = path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_portrait_guaratingueta_franquia_final.png');

console.log('Renderizando Guaratinguetá Feed Retrato 4:5 (1080x1350)...');
const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1350 --screenshot="${outputPng}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPng)) {
    console.log(`Renderizado com sucesso: ${outputPng}`);
    fs.mkdirSync(path.dirname(distPng), { recursive: true });
    fs.copyFileSync(outputPng, distPng);
    console.log(`Sincronizado com dist: ${distPng}`);
  } else {
    console.error('Falha: arquivo não encontrado.');
  }
} catch (e) {
  console.error('Erro na renderização:', e.message);
}
