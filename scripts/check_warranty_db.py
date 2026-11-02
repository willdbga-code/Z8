import sys
with open('site-principal/data/warranty-db.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
print("Length of warranty-db.js:", len(c))
print(c[:1500])
