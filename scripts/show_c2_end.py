import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/app.js', encoding='utf-8') as f:
    lines = f.readlines()

print(''.join(lines[1220:1270]))
