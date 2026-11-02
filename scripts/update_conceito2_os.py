with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = "loadOSTable(e.target.value);\n  });"
replacement = "loadOSTable(e.target.value);\n  });\n  loadOSTable();"

if "loadOSTable();" not in code[code.find("searchInput"):]:
    code = code.replace(target, replacement, 1)
    print("Added initial loadOSTable() call to conceito-2/app.js")

if "window.scrollToOSFooter" not in code:
    fn = """
window.scrollToOSFooter = function() {
  const el = document.getElementById('rodape-os');
  if (el) {
    if (window.lenis) {
      window.lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
"""
    code = code + fn
    print("Added window.scrollToOSFooter to conceito-2/app.js")

with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
    f.write(code)
