with open('conceito-2/index.html', encoding='utf-8') as f:
    text = f.read()

print('id="portal-lojista" in text:', 'id="portal-lojista"' in text)
print('portal-lojista in text:', 'portal-lojista' in text)
print('portal-lojista-laf.css linked in text:', 'portal-lojista-laf.css' in text)
