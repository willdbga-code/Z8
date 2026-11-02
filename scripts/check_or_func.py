import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function OR()')
sys.stdout.reconfigure(encoding='utf-8')
print(c[idx:idx+2500])
