import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('laf-checkout-form')
while idx != -1:
    print("--- Found laf-checkout-form ---")
    print(c[idx:idx+1500])
    idx = c.find('laf-checkout-form', idx+1)
