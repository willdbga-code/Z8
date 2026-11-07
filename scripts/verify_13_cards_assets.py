import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

# Match each card by id="z8-..."
cards = re.findall(r'<div[^>]*id="(z8-[a-z0-9\-]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/div>', html)
print(f"Total cards matched: {len(cards)}")

for card_id, card_body in cards:
    reveal_m = re.search(r'class="[^"]*helmet-grid-item-reveal-img[^"]*"[^>]*src="([^"]+)"', card_body)
    cutout_m = re.search(r'class="[^"]*helmet-grid-item-img-helmet[^"]*"[^>]*src="([^"]+)"', card_body)
    title_m = re.search(r'class="helmet-grid-item-title-w"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>', card_body)

    reveal_src = reveal_m.group(1) if reveal_m else "MISSING"
    cutout_src = cutout_m.group(1) if cutout_m else "MISSING"
    title = title_m.group(1).strip() if title_m else card_id

    reveal_path = reveal_src.lstrip('/')
    cutout_path = cutout_src.lstrip('/')

    reveal_ok = os.path.exists(reveal_path)
    cutout_ok = os.path.exists(cutout_path)

    print(f"ID: {card_id:15} | Title: {title:25}")
    print(f"   Reveal: {reveal_src} -> {reveal_ok}")
    print(f"   Cutout: {cutout_src} -> {cutout_ok}")
    if not reveal_ok or not cutout_ok:
        print(f"   [!] WARNING: Missing asset!")
