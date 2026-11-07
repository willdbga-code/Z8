with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(73, 800):
    line = lines[i]
    if "id:" in line:
        print(line.strip())
    if "];" in line and i > 100:
        break
