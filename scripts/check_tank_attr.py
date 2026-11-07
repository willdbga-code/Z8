with open('conceito/index.html', encoding='utf-8') as f:
    text = f.read()

idx = text.find('z8-tank')
print(text[idx-50:idx+200])
