import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'ADICIONAR AO PEDIDO DE ATACADO' in l:
        print(''.join(lines[max(0, i-20):min(len(lines), i+30)]))
        break
