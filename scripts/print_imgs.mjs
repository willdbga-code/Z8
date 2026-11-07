import fs from 'fs';

const html = fs.readFileSync('conceito/index.html', 'utf8');
const startIdx = html.indexOf('data-model-id="z8-tank"');
const chunk = html.substring(startIdx, startIdx + 12000);
const imgMatches = chunk.match(/<img[^>]+>/g);
console.log('Images found:', imgMatches);
