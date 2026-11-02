import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
forms = re.findall(r'<form[^>]*id="([^"]+)"', c)
print("Forms in portal-lojista-laf.js:", forms)

submits = re.findall(r'addEventListener\(["\']submit["\']', c)
print("Submit listeners:", len(submits))
