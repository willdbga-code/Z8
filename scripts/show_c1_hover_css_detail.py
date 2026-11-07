import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/style.css', encoding='utf-8') as f:
    lines = f.readlines()

print(''.join(lines[11565:11640]))
