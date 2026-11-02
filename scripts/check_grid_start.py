import sys
with open('conceito/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('class="helmet-grid"')
print(c[idx-100:idx+400])
