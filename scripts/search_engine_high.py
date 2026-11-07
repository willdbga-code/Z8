import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

idx = 0
while True:
    pos = text.find('data-anim-high', idx)
    if pos == -1:
        break
    print(f"Found at {pos}:")
    print(text[max(0, pos-200):min(len(text), pos+300)])
    print("="*60)
    idx = pos + 1
