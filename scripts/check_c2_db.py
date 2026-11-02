import sys
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
print("Length of conceito-2/app.js:", len(c))
matches = [m.start() for m in re.finditer(r'firebase|firestore|saveOrder|createOS|loadOS|catalog_users|service_orders', c, re.IGNORECASE)]
print(f"Total occurrences in conceito-2/app.js: {len(matches)}")
for idx in matches[:10]:
    print("---")
    print(c[max(0, idx-50):idx+350])
