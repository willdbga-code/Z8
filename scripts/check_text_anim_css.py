with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'split-text|data-anim|ScrollTrigger|ScrollSmoother', c)]
print(f"Total occurrences in style.css: {len(matches)}")
for idx in matches[:10]:
    print("---")
    print(c[max(0, idx-50):idx+350])
