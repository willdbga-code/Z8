import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
matches = [m.start() for m in re.finditer(r'DOMContentLoaded', c)]
for idx in matches:
    print("--- DOMContentLoaded ---")
    print(c[idx-100:idx+400])
