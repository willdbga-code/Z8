import fs from 'fs';

for (const file of ['conceito/index.html', 'conceito-2/index.html']) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('--- ' + file + ' ---');
  for (const id of ['z8-q11', 'z8-q10']) {
    const idx = content.indexOf(`data-model-id="${id}"`);
    if (idx !== -1) {
      const slice = content.substring(idx, idx + 4000);
      const rev = slice.match(/helmet-grid-item-reveal-img[^\"]*\"[^\>]*src=\"([^\"]+)\"/) || slice.match(/src=\"([^\"]+)\"[^\>]*class=\"[^\"]*helmet-grid-item-reveal-img/);
      const cut = slice.match(/helmet-grid-item-img-helmet[^\"]*\"[^\>]*src=\"([^\"]+)\"/) || slice.match(/src=\"([^\"]+)\"[^\>]*class=\"[^\"]*helmet-grid-item-img-helmet/);
      console.log(id, 'Reveal:', rev ? rev[1] : '?', 'Cutout:', cut ? cut[1] : '?');
    }
  }
}
