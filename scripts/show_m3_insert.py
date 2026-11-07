import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    lines = f.readlines()

print(''.join(lines[1635:1670]))
