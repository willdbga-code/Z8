import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_conceito2_page.py', encoding='utf-8') as f:
    text = f.read()

idx = text.find('SELEÇÃO DE MODELOS')
print(text[idx-100:idx+2000])
