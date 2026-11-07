with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('window.scrollToOSFooter')
print(repr(text[idx:]))
