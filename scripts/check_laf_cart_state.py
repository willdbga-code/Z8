with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
for i, line in enumerate(lines):
    if 'wholesaleOrder' in line or 'CANONICAL' in line or 'updateWholesaleItem' in line or 'syncAll' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")
