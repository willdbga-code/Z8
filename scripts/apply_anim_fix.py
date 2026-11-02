with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1
p1 = "if(OP(),window.innerWidth>=992)E7(),D7(),k7()}"
r1 = "OP();E7();D7();k7()}"

# 2
p2 = "),window.innerWidth>=992)E7(),D7(),k7();"
r2 = ");E7();D7();k7();"

# 3
p3 = ",window.innerWidth>=992)E7(),D7(),k7()}"
r3 = ";E7();D7();k7()}"

# 4
p4 = "if(window.innerWidth>=992)E7(),D7(),k7();"
r4 = "E7();D7();k7();"

for p, r in [(p1, r1), (p2, r2), (p3, r3), (p4, r4)]:
    if p in c:
        c = c.replace(p, r)
        print(f"Replaced: {p[:30]}...")
    else:
        print(f"NOT FOUND: {p[:30]}...")

with open('public/assets/lando/lando-engine.js', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated public/assets/lando/lando-engine.js")
