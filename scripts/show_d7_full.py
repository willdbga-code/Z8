import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/assets/lando/lando-engine.js', encoding='utf-8') as f:
    text = f.read()

pos = 1356268
print("=== D7 function definition ===")
print(text[pos:pos+2500])
