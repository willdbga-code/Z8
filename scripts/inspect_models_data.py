with open('site-principal/data/models.js', 'r', encoding='utf-8') as f:
    text = f.read()
import re
models = re.findall(r"id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]", text)
for m in models:
    print(m)
