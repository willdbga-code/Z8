import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/app.js', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if 'anim' in line.lower() or 'observer' in line.lower() or 'scroll' in line.lower() or 'split' in line.lower():
        if i < 150 or i > 800:
            print(f"L{i+1}: {line[:100]}")
