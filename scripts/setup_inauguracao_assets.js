import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const hero916 = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\c6fbdf46-708c-4562-9c32-076a8179d72e\\z8_inauguracao_hero_1791385648124.jpg';
const heroSquare = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\c6fbdf46-708c-4562-9c32-076a8179d72e\\z8_inauguracao_square_1791385677451.jpg';

const targetDirPub = path.resolve(rootDir, 'public', 'assets', 'cria', 'posters');
const targetDirDist = path.resolve(rootDir, 'dist', 'assets', 'cria', 'posters');

fs.mkdirSync(targetDirPub, { recursive: true });
fs.mkdirSync(targetDirDist, { recursive: true });

// Copy 9:16 base
const baseReelsPub = path.join(targetDirPub, 'base_inauguracao_z8.jpg');
const baseReelsDist = path.join(targetDirDist, 'base_inauguracao_z8.jpg');
fs.copyFileSync(hero916, baseReelsPub);
fs.copyFileSync(hero916, baseReelsDist);
console.log('✓ Copiado base_inauguracao_z8.jpg (9:16)');

// Copy 1:1 base
const baseSquarePub = path.join(targetDirPub, 'base_inauguracao_z8_1x1.jpg');
const baseSquareDist = path.join(targetDirDist, 'base_inauguracao_z8_1x1.jpg');
fs.copyFileSync(heroSquare, baseSquarePub);
fs.copyFileSync(heroSquare, baseSquareDist);
console.log('✓ Copiado base_inauguracao_z8_1x1.jpg (1:1)');

// For 4:5 base, we can also provide base_inauguracao_z8_4x5.jpg (using 9:16 which is easily cropped via CSS cover)
const base4x5Pub = path.join(targetDirPub, 'base_inauguracao_z8_4x5.jpg');
const base4x5Dist = path.join(targetDirDist, 'base_inauguracao_z8_4x5.jpg');
fs.copyFileSync(hero916, base4x5Pub);
fs.copyFileSync(hero916, base4x5Dist);
console.log('✓ Copiado base_inauguracao_z8_4x5.jpg (4:5)');

console.log('Setup de bases concluído!');
