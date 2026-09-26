import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const formats = [
  {
    name: 'Stories 9:16',
    width: 1080,
    height: 1920,
    html: path.resolve(__dirname, 'poster_jacarei_v7_desencapsulado.html'),
    outputPub: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_jacarei_franquia_final.png'),
    outputDist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_jacarei_franquia_final.png'),
  },
  {
    name: 'Feed Portrait 4:5',
    width: 1080,
    height: 1350,
    html: path.resolve(__dirname, 'poster_jacarei_v7_portrait.html'),
    outputPub: path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_portrait_jacarei_franquia_final.png'),
    outputDist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_portrait_jacarei_franquia_final.png'),
  },
  {
    name: 'Feed Square 1:1',
    width: 1080,
    height: 1080,
    html: path.resolve(__dirname, 'poster_jacarei_v7_square.html'),
    outputPub: path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_square_jacarei_franquia_final.png'),
    outputDist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_square_jacarei_franquia_final.png'),
  },
];

console.log(`=== INICIANDO RENDERIZAÇÃO DO PACOTE MULTIFORMATO JACAREÍ ===\n`);

for (const fmt of formats) {
  console.log(`[RENDER] ${fmt.name} (${fmt.width}x${fmt.height})...`);
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=${fmt.width},${fmt.height} --screenshot="${fmt.outputPub}" "file:///${fmt.html.replace(/\\/g, '/')}"`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(fmt.outputPub)) {
      console.log(` -> Renderizado com sucesso: ${fmt.outputPub}`);
      fs.copyFileSync(fmt.outputPub, fmt.outputDist);
      console.log(` -> Sincronizado com dist: ${fmt.outputDist}\n`);
    } else {
      console.error(` -> ERRO: Arquivo não encontrado após renderização: ${fmt.outputPub}\n`);
    }
  } catch (err) {
    console.error(` -> Erro ao renderizar ${fmt.name}:`, err.message);
  }
}

console.log(`=== PACOTE MULTIFORMATO CONCLUÍDO COM SUCESSO! ===`);
