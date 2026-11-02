import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('function _L()')
if idx == -1:
    idx = c.find('_L=')
print(c[idx:idx+2500])
