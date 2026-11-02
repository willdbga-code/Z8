import re

with open('conceito/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find each helmet-grid-item
items = re.findall(r'<div class="helmet-grid-item">(.*?)</div>\s*</div>\s*</div>', html, re.DOTALL)
print(f"Total helmet grid items matched: {len(items)}")

titles = re.findall(r'<h3 class="text-title-small-label text">(.*?)</h3>', html)
print(f"Total titles: {len(titles)}")
for idx, t in enumerate(titles):
    print(f"{idx+1}: {t}")
