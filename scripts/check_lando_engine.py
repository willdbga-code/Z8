with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'reveal-img', c)]
print(f"Total occurrences of reveal-img in lando-engine.js: {len(matches)}")
for idx in matches[:5]:
    print("---")
    print(c[max(0, idx-50):idx+350])

matches2 = [m.start() for m in re.finditer(r'helmet-grid', c)]
print(f"Total occurrences of helmet-grid in lando-engine.js: {len(matches2)}")
for idx in matches2[:5]:
    print("---")
    print(c[max(0, idx-50):idx+350])
