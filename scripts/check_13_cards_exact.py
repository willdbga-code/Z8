import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

# Let's find each div with class containing helmet-grid-item-w
matches = list(re.finditer(r'<div[^>]*class="[^"]*helmet-grid-item-w[^"]*"[^>]*id="([^"]+)"', html))
print(f"Total helmet-grid-item-w found: {len(matches)}")

for i, m in enumerate(matches):
    start = m.start()
    end = matches[i+1].start() if i+1 < len(matches) else html.find('<!-- ==================== VIABILIDADE', start)
    card_text = html[start:end]
    card_id = m.group(1)

    reveal_m = re.search(r'class="[^"]*helmet-grid-item-reveal-img[^"]*"[^>]*src="([^"]+)"', card_text)
    cutout_m = re.search(r'class="[^"]*helmet-grid-item-img-helmet[^"]*"[^>]*src="([^"]+)"', card_text)
    title_m = re.search(r'<div class="helmet-grid-item-title-w">[\s\S]*?<div[^>]*>([^<]+)<\/div>', card_text)

    reveal_src = reveal_m.group(1) if reveal_m else "MISSING"
    cutout_src = cutout_m.group(1) if cutout_m else "MISSING"
    title = title_m.group(1).strip() if title_m else card_id

    reveal_path = reveal_src.lstrip('/')
    cutout_path = cutout_src.lstrip('/')

    reveal_ok = os.path.exists(reveal_path)
    cutout_ok = os.path.exists(cutout_path)

    print(f"[{i+1}] ID: {card_id:15} | Title: {title:22}")
    print(f"     Reveal: {reveal_src} (exists: {reveal_ok})")
    print(f"     Cutout: {cutout_src} (exists: {cutout_ok})")
