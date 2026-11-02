import sys
with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('function openZ8ModelDrawer')
print(c[idx:idx+1500])
