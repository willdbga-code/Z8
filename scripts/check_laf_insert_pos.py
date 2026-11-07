import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('site-principal/portal-lojista-laf.js', encoding='utf-8') as f:
    text = f.read()

target = '<div id="laf-selected-items-grid" class="z8-laf-selected-items-grid"></div>'
idx = text.find(target)
print("Found target at:", idx)
print(text[idx-50:idx+150])
