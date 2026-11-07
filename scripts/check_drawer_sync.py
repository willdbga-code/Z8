import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/app.js', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n'):
    if 'drawer' in line.lower() or 'adicionar ao pedido' in line.lower() or 'modal-drawer' in line.lower():
        print(line[:100])
