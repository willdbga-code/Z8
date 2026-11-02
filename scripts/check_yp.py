import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('var yP=')
if idx == -1:
    idx = c.find('yP=')
print(c[idx:idx+2000])
