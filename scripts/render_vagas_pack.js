import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const vagas = [
  {
    name: 'Vaga Mecânico (9:16)',
    html: path.resolve(__dirname, 'poster_vaga_mecanico.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_vaga_mecanico_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_vaga_mecanico_final.png')
  },
  {
    name: 'Vaga Vendedora (9:16)',
    html: path.resolve(__dirname, 'poster_vaga_vendas.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_vaga_vendas_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_vaga_vendas_final.png')
  },
  {
    name: 'Vaga Zeladoria (9:16)',
    html: path.resolve(__dirname, 'poster_vaga_zeladoria.html'),
    output: path.resolve(rootDir, 'public', 'assets', 'cria', 'story_vaga_zeladoria_final.png'),
    dist: path.resolve(rootDir, 'dist', 'assets', 'cria', 'story_vaga_zeladoria_final.png')
  }
];

console.log('Iniciando renderização do Pacote de Recrutamento Z8 (3 Vagas)...');

for (const v of vagas) {
  console.log(`\nRenderizando ${v.name}...`);
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1920 --screenshot="${v.output}" "file:///${v.html.replace(/\\/g, '/')}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(v.output)) {
      console.log(`✓ Renderizado com sucesso: ${v.output}`);
      fs.mkdirSync(path.dirname(v.dist), { recursive: true });
      fs.copyFileSync(v.output, v.dist);
      console.log(`✓ Sincronizado com dist: ${v.dist}`);
    } else {
      console.error(`✗ Erro: Arquivo não encontrado para ${v.name}`);
    }
  } catch (err) {
    console.error(`✗ Erro na renderização de ${v.name}:`, err.message);
  }
}

console.log('\nPacote de Vagas Z8 Matriz finalizado com sucesso!');
