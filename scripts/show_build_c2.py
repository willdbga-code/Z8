import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_conceito2_page.py', encoding='utf-8') as f:
    text = f.read()

print(text[:2000])
