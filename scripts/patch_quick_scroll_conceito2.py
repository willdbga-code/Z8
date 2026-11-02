with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  if (getCurrentCatalogUser()) {
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);
  }"""

replacement = """  if (getCurrentCatalogUser()) {
    setTimeout(() => {
      if (!urlParams.get('scrollto')) {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    }, 50);
  }"""

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Updated conceito-2/app.js")
else:
    print("Target not found in conceito-2/app.js")
