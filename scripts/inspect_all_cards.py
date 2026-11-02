import re

with open('conceito/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_blocks = re.findall(r'<div class="helmet-grid-item-w"(.*?)<!-- END HELMET', html, re.DOTALL)
if not card_blocks:
    # try splitting by helmet-grid-item-w
    card_blocks = html.split('<div class="helmet-grid-item-w"')[1:]

print(f"Total cards found: {len(card_blocks)}")

for idx, b in enumerate(card_blocks):
    title_m = re.search(r'<h3 class="text-title-small-label text">(.*?)</h3>', b)
    title = title_m.group(1) if title_m else "N/A"
    
    cutout_m = re.search(r'<img[^>]+class="[^"]*helmet-grid-item-img-helmet[^"]*"[^>]+src="([^"]+)"', b)
    if not cutout_m:
        cutout_m = re.search(r'class="helmet-grid-item-img-helmet-w"[^>]*>\s*<img[^>]+src="([^"]+)"', b)
    cutout = cutout_m.group(1) if cutout_m else "N/A"
    
    hover_m = re.search(r'<img[^>]+class="[^"]*helmet-grid-item-reveal-img[^"]*"[^>]+src="([^"]+)"', b)
    hover = hover_m.group(1) if hover_m else "N/A"
    
    date_m = re.search(r'<div class="text-title-small-label date">(.*?)</div>', b)
    date_val = date_m.group(1) if date_m else "N/A"
    
    chip_m = re.search(r'<span class="z8-tel-chip">(.*?)</span>', b)
    chip = chip_m.group(1) if chip_m else "N/A"

    profit_m = re.search(r'<span class="z8-tel-profit">(.*?)</span>', b)
    profit = profit_m.group(1) if profit_m else "N/A"

    print(f"Card {idx+1}: [{title}] | Cutout: {cutout} | Hover: {hover} | Profit: {profit} | Date: {date_val} | Chip: {chip}")
