import sys
with open('site-principal/data/warranty-db.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('fetchWarrantyOrdersFromFirestore')
print(c[idx:idx+2500])
