with open('conceito-2/index.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'portal-lojista' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")
