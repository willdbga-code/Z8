with open('conceito/style.css', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '@media' in l and ('540px' in l or '991px' in l):
        print(f"L{i+1}: {l.strip()}")
        print(''.join(lines[i:i+30]))
        print('='*50)
