import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito/index.html', encoding='utf-8') as f:
    text = f.read()

idx = text.find('class="home-hero-next-race-w"')
print(text[idx-50:idx+2500])
