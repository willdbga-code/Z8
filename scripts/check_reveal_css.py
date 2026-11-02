with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'reveal-img', c)]
for idx in matches:
    print("---")
    print(c[idx-50:idx+350])
