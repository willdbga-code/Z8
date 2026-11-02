import sys
with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('openZ8ModelDrawer')
print(c[idx-100:idx+800])
