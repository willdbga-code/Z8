import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="z8-tank"')
print(text[pos+1500:pos+3500])
