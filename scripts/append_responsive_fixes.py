import sys

sys.stdout.reconfigure(encoding='utf-8')

responsive_css_fix = """
/* === MOBILE & DUO RESPONSIVENESS FIXES (OVERLAP PREVENTION & KINETIC TEXT) === */
@media screen and (max-width: 991px) {
  .home-hero-next-race-w {
    display: none !important;
  }
  .high-line-reveal {
    pointer-events: none !important;
  }
}
"""

for css_file in ['conceito/style.css', 'conceito-2/style.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'MOBILE & DUO RESPONSIVENESS FIXES' not in c:
        with open(css_file, 'a', encoding='utf-8') as f:
            f.write(responsive_css_fix)
        print(f"✓ Added responsiveness fix to {css_file}")
    else:
        print(f"• Responsiveness fix already in {css_file}")
