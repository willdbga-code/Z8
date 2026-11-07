import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'(<div[^>]*data-model-id="z8-tank"[\s\S]*?)(?=<div[^>]*data-model-id="z8-tank-2")', html)
if m:
    print(m.group(1)[1200:3200])
