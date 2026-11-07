import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/index.html', encoding='utf-8') as f:
    lines = f.readlines()

print(''.join(lines[1494:1560]))
