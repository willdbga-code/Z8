import os
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'dist' in root:
        continue
    for f in files:
        if f.endswith(('.js', '.html')):
            p = os.path.join(root, f)
            txt = open(p, encoding='utf-8', errors='ignore').read()
            if 'openZ8ModelDrawer' in txt:
                print(f"{p}: {txt.count('openZ8ModelDrawer')} matches")
