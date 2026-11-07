import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    lines = f.readlines()

print(''.join(lines[260:320]))
