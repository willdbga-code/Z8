with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# Find functions that have data-anim-high or split-text or text animation
funcs = re.findall(r'function ([a-zA-Z0-9_]+)\([^)]*\)\{[^}]*data-anim-high[^}]*\}', c)
print("Funcs with data-anim-high:", funcs)

# Search for window.innerWidth or mobile checks in lando-engine.js
mobile_checks = re.findall(r'.{0,50}(?:innerWidth|matchMedia|min-width|max-width|isMobile|mobile).{0,100}', c)
print(f"Total mobile/media checks: {len(mobile_checks)}")
for m in mobile_checks[:15]:
    print("MATCH:", m)
