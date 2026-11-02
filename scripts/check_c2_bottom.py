import sys
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.rfind("loadOSTable();")
print(c[idx-200:idx+400])
