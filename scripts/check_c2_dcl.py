import sys
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find("document.addEventListener('DOMContentLoaded'")
print(c[idx:idx+1200])
