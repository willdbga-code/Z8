import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function renderSelectedOrderItems')
print(text[pos:pos+1500])
