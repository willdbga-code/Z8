import sys
with open('site-principal/data/warranty-db.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
exports = re.findall(r'export (?:async )?function ([a-zA-Z0-9_]+)', c)
print("Exports in warranty-db.js:", exports)
