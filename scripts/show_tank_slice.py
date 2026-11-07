import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'(<div[^>]*id="z8-tank"[\s\S]*?)(?=<div[^>]*id="z8-tank-2")', html)
if m:
    print(m.group(1)[:1500])
else:
    print("z8-tank block not matched")
