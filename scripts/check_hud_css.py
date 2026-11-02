import sys
with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find('.z8-helmet-hover-hud')
print(c[idx:idx+800])
