import fs from 'fs';

const html = fs.readFileSync('conceito/index.html', 'utf8');

const modelIds = [
  'z8-tank', 'z8-tank-2', 'z8-fx10', 'z8-fx12', 'z8-harley', 'z8-u2',
  'z8-n95c', 'z8-n7', 'z8-q11', 'z8-n710', 'z8-q10', 'z8-gs005', 'z8-diamond'
];

console.log('--- AUDITING ALL 13 MODELS IN CONCEITO/INDEX.HTML ---');

modelIds.forEach(id => {
  const startIdx = html.indexOf(`data-model-id="${id}"`);
  if (startIdx === -1) {
    console.log('[NOT FOUND]', id);
    return;
  }
  const nextStart = html.indexOf('data-model-id="', startIdx + 20);
  const chunk = html.substring(startIdx, nextStart !== -1 ? nextStart : startIdx + 8000);

  const revealMatch = chunk.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*helmet-grid-item-reveal-img[^"]*"/);
  const cutoutMatch = chunk.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*helmet-grid-item-img-helmet[^"]*"/);

  const revealSrc = revealMatch ? revealMatch[1] : 'NONE';
  const cutoutSrc = cutoutMatch ? cutoutMatch[1] : 'NONE';

  const revealExists = revealSrc !== 'NONE' && fs.existsSync(revealSrc.replace(/^\//, ''));
  const cutoutExists = cutoutSrc !== 'NONE' && fs.existsSync(cutoutSrc.replace(/^\//, ''));

  console.log(id.padEnd(14), '| Reveal:', revealSrc.padEnd(38), revealExists ? '✓' : '✗ MISSING', '| Cutout:', cutoutSrc.padEnd(38), cutoutExists ? '✓' : '✗ MISSING');
});
