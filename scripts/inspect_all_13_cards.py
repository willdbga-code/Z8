import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

# Find all cards with class helmet-grid-item-w or data-helmet-item
card_matches = re.findall(r'<div[^>]*class="[^"]*helmet-grid-item-w[^"]*"[^>]*id="([^"]+)"[\s\S]*?(?=<div[^>]*class="[^"]*helmet-grid-item-w|$)', html)

print(f"Total cards found with helmet-grid-item-w: {len(card_matches)}")

# Let's inspect each card block
pattern = r'(<div[^>]*class="[^"]*helmet-grid-item-w[^"]*"[^>]*id="([^"]+)"[\s\S]*?)(?=<div[^>]*class="[^"]*helmet-grid-item-w|<!-- ==================== VIABILIDADE|$)'

for m in re.finditer(pattern, html):
    card_html = m.group(1)
    card_id = m.group(2)
    
    # Extract reveal img
    reveal_match = re.search(r'<img[^>]*class="[^"]*helmet-grid-item-reveal-img[^"]*"[^>]*src="([^"]+)"', card_html)
    reveal_src = reveal_match.group(1) if reveal_match else 'NONE'
    
    # Extract cutout img
    cutout_match = re.search(r'<img[^>]*class="[^"]*helmet-grid-item-img-helmet[^"]*"[^>]*src="([^"]+)"', card_html)
    cutout_src = cutout_match.group(1) if cutout_match else 'NONE'
    
    # Extract model title / text
    title_match = re.search(r'<div class="helmet-grid-item-title-w">[\s\S]*?<div[^>]*>([^<]+)</div>', card_html)
    title = title_match.group(1).strip() if title_match else 'NO_TITLE'
    
    # Check if files exist
    reveal_exists = os.path.exists(reveal_src.lstrip('/')) if reveal_src != 'NONE' else False
    cutout_exists = os.path.exists(cutout_src.lstrip('/')) if cutout_src != 'NONE' else False

    print(f"Card: {card_id.ljust(15)} | Title: {title.ljust(25)}")
    print(f"   Reveal: {reveal_src} (exists: {reveal_exists})")
    print(f"   Cutout: {cutout_src} (exists: {cutout_exists})")
