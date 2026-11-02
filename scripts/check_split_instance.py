with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'splitTextInstance', c)]
print(f"Total occurrences of splitTextInstance: {len(matches)}")
for idx in matches:
    print("---")
    print(c[max(0, idx-50):idx+350])
