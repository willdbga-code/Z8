with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

bad = "el.scrollIntoView({ behavior: 'smooth', block: 'start'   setTimeout(initKineticTextScrollMobile, 250);\n  window.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });\n});"

good = "el.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    }\n  }\n};\n\nsetTimeout(initKineticTextScrollMobile, 250);\nwindow.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });"

idx = text.rfind('window.scrollToOSFooter')
fixed_footer = """window.scrollToOSFooter = function() {
  const el = document.getElementById('rodape-os');
  if (el) {
    if (window.lenis) {
      window.lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

setTimeout(initKineticTextScrollMobile, 250);
window.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });
"""

text = text[:idx] + fixed_footer
with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("✓ Fixed end of conceito-2/app.js")
