import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
matches = [m.start() for m in re.finditer(r'innerWidth\s*(?:>=|>|<=|<)\s*99[12]', c)]
print(f"Total occurrences of innerWidth 991/992: {len(matches)}")
for idx in matches:
    print("---")
    print(c[max(0, idx-60):idx+120])
