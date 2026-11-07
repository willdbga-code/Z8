import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/style.css', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'@media[^{]+', text)]
for pos in matches[-20:]:
    media_str = text[pos:text.find('{', pos)]
    print(media_str.strip())
