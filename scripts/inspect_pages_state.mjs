import fs from 'fs';

const c1Html = fs.readFileSync('conceito/index.html', 'utf8');
const c2Html = fs.readFileSync('conceito-2/index.html', 'utf8');

console.log('--- CONCEITO 1 (conceito/index.html) ---');
console.log('Title:', c1Html.match(/<title>(.*?)<\/title>/)?.[1]);
const c1Cards = [...c1Html.matchAll(/id="(z8-[a-z0-9\-]+)"/g)].map(m => m[1]);
console.log('C1 Card IDs found:', [...new Set(c1Cards)]);

console.log('\n--- CONCEITO 2 (conceito-2/index.html) ---');
console.log('Title:', c2Html.match(/<title>(.*?)<\/title>/)?.[1]);
const c2Cards = [...c2Html.matchAll(/id="(z8-[a-z0-9\-]+)"/g)].map(m => m[1]);
console.log('C2 Card IDs found:', [...new Set(c2Cards)]);
console.log('Has laf container in C2:', c2Html.includes('portal-lojista-container') || c2Html.includes('portal-laf-root'));
console.log('Has OS section in C2:', c2Html.includes('portal-os-section') || c2Html.includes('tabela-os') || c2Html.includes('gestao-os'));
