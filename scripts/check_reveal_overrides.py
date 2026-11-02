with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'helmet-grid-item-reveal-img', c)]
print(f"Total occurrences of helmet-grid-item-reveal-img: {len(matches)}")
for idx in matches:
    print("---")
    print(c[max(0, idx-60):idx+300])
