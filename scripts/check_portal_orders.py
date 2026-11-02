import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
matches = [m.start() for m in re.finditer(r'firestore|api/orders|saveOrder|pushOrder|database', c, re.IGNORECASE)]
print(f"Total occurrences in portal-lojista-laf.js: {len(matches)}")
for idx in matches[:10]:
    print("---")
    print(c[max(0, idx-50):idx+350])
