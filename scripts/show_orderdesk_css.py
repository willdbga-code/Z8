import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/style.css', encoding='utf-8') as f:
    text = f.read()

idx = text.find('.z8-orderdesk-table')
print(text[idx:idx+1500])
