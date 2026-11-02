with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'helmet-grid-item', c)]
print(f"Total occurrences of helmet-grid-item in style.css: {len(matches)}")
for idx in matches[:5]:
    print("---")
    print(c[idx:idx+400])
