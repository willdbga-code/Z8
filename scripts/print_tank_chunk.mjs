import fs from 'fs';

const html = fs.readFileSync('conceito/index.html', 'utf8');
const startIdx = html.indexOf('data-model-id="z8-tank"');
console.log(html.substring(startIdx, startIdx + 800));
