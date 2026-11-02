with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'scrollTrigger', c, re.IGNORECASE)]
print(f"Total occurrences of scrollTrigger: {len(matches)}")
for idx in matches[:10]:
    print("---")
    print(c[max(0, idx-50):idx+350])
