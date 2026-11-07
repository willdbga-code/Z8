import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'window.adjustLafQty =' in l:
        print(''.join(lines[i:i+25]))
        break
