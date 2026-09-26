import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const html = path.resolve(__dirname, 'poster_taubate_square.html');
const output = path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_square_taubate_franquia_final.png');
const dist = path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_square_taubate_franquia_final.png');

console.log('Renderizando Taubaté Feed Quadrado (1:1 - 1080x1080)...');
const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1080 --screenshot="${output}" "file:///${html.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(output)) {
    console.log(`✓ Renderizado com sucesso: ${output}`);
    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.copyFileSync(output, dist);
    console.log(`✓ Sincronizado com dist: ${dist}`);
  } else {
    console.error('✗ Erro ao gerar feed quadrado.');
  }
} catch (e) {
  console.error('Erro na renderização:', e.message);
}
