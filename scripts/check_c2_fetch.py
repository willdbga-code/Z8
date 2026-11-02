import sys
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
import re
idx = c.find('fetchWarrantyOrdersFromFirestore')
print(c[idx-50:idx+300])
