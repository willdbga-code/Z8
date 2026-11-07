import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

card_ids = [
    'z8-tank', 'z8-tank-2', 'z8-fx10', 'z8-fx12', 'z8-harley', 'z8-u2',
    'z8-n95c', 'z8-n7', 'z8-q11', 'z8-n710', 'z8-q10', 'z8-gs005', 'z8-diamond'
]

print(f"Checking all {len(card_ids)} models in conceito/index.html:")

for cid in card_ids:
    pattern = rf'(<div[^>]*data-model-id="{cid}"[\s\S]*?)(?=<div[^>]*data-model-id="z8-|<section id="viabilidade"|$)'
    m = re.search(pattern, html)
    if not m:
        print(f"[X] {cid:15} -> NOT FOUND in HTML!")
        continue
    card_text = m.group(1)

    reveal_m = re.search(r'class="[^"]*helmet-grid-item-reveal-img[^"]*"[^>]*src="([^"]+)"', card_text)
    cutout_m = re.search(r'class="[^"]*helmet-grid-item-img-helmet[^"]*"[^>]*src="([^"]+)"', card_text)
    title_m = re.search(r'<div class="helmet-grid-item-title-w">[\s\S]*?<div[^>]*>([^<]+)<\/div>', card_text)

    reveal_src = reveal_m.group(1) if reveal_m else "MISSING"
    cutout_src = cutout_m.group(1) if cutout_m else "MISSING"
    title = title_m.group(1).strip() if title_m else cid

    reveal_path = reveal_src.lstrip('/')
    cutout_path = cutout_src.lstrip('/')

    reveal_ok = os.path.exists(reveal_path)
    cutout_ok = os.path.exists(cutout_path)

    status = "OK" if reveal_ok and cutout_ok else "FAIL"
    print(f"[{status}] {cid:15} | {title:22} | Reveal: {reveal_src} ({reveal_ok}) | Cutout: {cutout_src} ({cutout_ok})")
