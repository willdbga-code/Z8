import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n'):
    if 'SELEÇÃO DE MODELOS' in line or 'order-qty' in line or 'MONTAGEM DE PEDIDO' in line or 'table' in line.lower() and 'order' in line.lower():
        print(line[:120])
