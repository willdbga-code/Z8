import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('window.transmitLafOrder')
if idx == -1:
    idx = c.find('transmitLafOrder')
print(c[idx:idx+2500])
