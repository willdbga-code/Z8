import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('TRANSMITIR PEDIDO OFICIAL')
print(c[idx-400:idx+600])
