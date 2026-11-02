import sys
with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx_start = c.find('const Z8_FLEET = [')
idx_end = c.find('];', idx_start)
print(c[idx_start:idx_end+2])
