import sys
with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('.helmet-grid-item-reveal-img.z8-card-fit-cover')
print(c[idx-200:idx+800])
