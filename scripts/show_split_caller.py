import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

pos = text.find('splitAll()')
print(text[max(0, pos-200):min(len(text), pos+300)])
