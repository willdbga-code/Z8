with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace all occurrences of window.innerWidth>=992 guarding E7(),D7(),k7()
target1 = "if(OP(),window.innerWidth>=992)E7(),D7(),k7()"
repl1 = "OP();E7();D7();k7()"

print("target1 in c:", target1 in c)

# Let's check other occurrences
import re
matches = re.findall(r'window\.innerWidth>=992\)\s*(?:setTimeout\([^)]+\),\s*)?E7\(\),D7\(\),k7\(\)', c)
print("Matches found:", len(matches), matches)
