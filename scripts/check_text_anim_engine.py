with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'split-text', c)]
print(f"Total occurrences of split-text in lando-engine.js: {len(matches)}")
for idx in matches[:5]:
    print("---")
    print(c[max(0, idx-50):idx+350])

matches2 = [m.start() for m in re.finditer(r'matchMedia', c)]
print(f"Total occurrences of matchMedia in lando-engine.js: {len(matches2)}")
for idx in matches2[:5]:
    print("---")
    print(c[max(0, idx-50):idx+350])
