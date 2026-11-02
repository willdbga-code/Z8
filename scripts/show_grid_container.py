import sys
with open('conceito/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
print(c[45450:45950])
