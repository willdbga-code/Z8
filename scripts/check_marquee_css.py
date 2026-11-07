import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/style.css', encoding='utf-8') as f:
    text = f.read()

for i, l in enumerate(text.split('\n')):
    if 'marquee' in l.lower() or 'territorio' in l.lower() or 'duo' in l.lower():
        if i > 11000:
            print(f"L{i+1}: {l[:100]}")
