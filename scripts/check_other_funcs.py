import sys
with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
for fn_name in ['Bp', 'l6', 'zp', 'xL', 'VF', 'Np', 'Vp', 'Lp', 'OP']:
    idx = c.find(f'function {fn_name}(')
    if idx != -1:
        print(f"=== function {fn_name} ===")
        print(c[idx:idx+500])
