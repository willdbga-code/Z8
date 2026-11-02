import sys
with open('conceito/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('id="z8-sim-model"')
print(c[idx:idx+1500])
