with open('conceito-2/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
print("Length of conceito-2/index.html:", len(c))
print("Has portal-lojista-section:", 'z8-laf-portal-section' in c)
print("Has rodape-os:", 'rodape-os' in c)
print("Has new-os-modal:", 'new-os-modal' in c)
