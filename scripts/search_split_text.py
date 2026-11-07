import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'split-text', text)]
print("Occurrences of split-text:", len(matches))
for pos in matches[:5]:
    print(text[max(0, pos-100):min(len(text), pos+150)])
    print("-" * 50)
