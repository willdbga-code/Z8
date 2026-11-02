import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('saveWholesaleOrderLocal(orderPayload);')
print(c[idx:idx+2000])
