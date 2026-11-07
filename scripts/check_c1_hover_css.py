import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/style.css', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for i, l in enumerate(lines):
    if 'helmet-grid-item' in l or 'reveal-img' in l or 'hover' in l.lower() and 'helmet' in l.lower():
        print(f"L{i+1}: {l[:100]}")
