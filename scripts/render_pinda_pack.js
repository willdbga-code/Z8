import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const formats = [
  {
    name: 'Pindamonhangaba Reels (9:16)',
    width: 1080,
    height: 1920,
    html: path.resolve(__dirname, 'poster_pinda_reels.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_pinda_franquia_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_pinda_franquia_final.png')
  },
  {
    name: 'Pindamonhangaba Feed Retrato (4:5)',
    width: 1080,
    height: 1350,
    html: path.resolve(__dirname, 'poster_pinda_portrait.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_portrait_pinda_franquia_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_portrait_pinda_franquia_final.png')
  },
  {
    name: 'Pindamonhangaba Feed Quadrado (1:1)',
    width: 1080,
    height: 1080,
    html: path.resolve(__dirname, 'poster_pinda_square.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'feed_square_pinda_franquia_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'feed_square_pinda_franquia_final.png')
  }
];

console.log('Iniciando renderização do Pacote Pindamonhangaba via Edge Headless...');

for (const fmt of formats) {
  console.log(`\nRenderizando ${fmt.name} (${fmt.width}x${fmt.height})...`);
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=${fmt.width},${fmt.height} --screenshot="${fmt.output}" "file:///${fmt.html.replace(/\\/g, '/')}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(fmt.output)) {
      console.log(`✓ Renderizado com sucesso: ${fmt.output}`);
      fs.mkdirSync(path.dirname(fmt.dist), { recursive: true });
      fs.copyFileSync(fmt.output, fmt.dist);
      console.log(`✓ Sincronizado com dist: ${fmt.dist}`);
    } else {
      console.error(`✗ Erro: Arquivo não encontrado para ${fmt.name}`);
    }
  } catch (err) {
    console.error(`✗ Erro na renderização de ${fmt.name}:`, err.message);
  }
}

console.log('\nPacote Pindamonhangaba finalizado com sucesso!');
