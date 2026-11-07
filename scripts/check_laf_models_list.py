import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"id:\s*'([^']+)'", text[:4000])
print("LAF_MODELS ids found:", matches)
