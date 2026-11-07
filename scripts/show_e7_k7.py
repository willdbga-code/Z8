import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

for name in ['E7', 'k7']:
    pos = text.find(f'function {name}(')
    if pos != -1:
        print(f"=== {name} ===")
        print(text[pos:pos+1000])
