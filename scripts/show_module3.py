import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    text = f.read()

idx = text.find('laf-block-pedidos')
if idx != -1:
    print(text[idx:idx+2500])
else:
    print('laf-block-pedidos not found')
