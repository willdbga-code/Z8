with open('conceito/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('class="helmet-grid-item"')
print(c[idx+1800:idx+3500])
