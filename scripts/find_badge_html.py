with open('conceito/index.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'Território' in l or 'blindado' in l.lower():
        print(f"L{i+1}: {l.strip()[:100]}")
