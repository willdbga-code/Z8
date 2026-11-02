with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
for m in re.finditer(r'.{0,40}window\.innerWidth>=992\)\s*(?:setTimeout\([^)]+\),\s*)?E7\(\),D7\(\),k7\(\).{0,40}', c):
    print("---")
    print(m.group(0))
