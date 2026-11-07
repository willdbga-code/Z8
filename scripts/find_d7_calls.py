import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'\bD7\(', text)]
print("Occurrences of D7(:", matches)
for pos in matches:
    print(text[max(0, pos-100):min(len(text), pos+100)])
    print("-" * 50)
