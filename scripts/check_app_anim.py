with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'gsap|ScrollTrigger|splitText|animate|ScrollSmoother|lenis', c, re.IGNORECASE)]
print(f"Total occurrences in conceito/app.js: {len(matches)}")
for idx in matches[:10]:
    print("---")
    print(c[max(0, idx-50):idx+350])
