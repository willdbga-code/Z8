import os

def fix_css():
    for css_file in ['conceito/style.css', 'conceito-2/style.css']:
        if not os.path.exists(css_file): continue
        with open(css_file, 'r', encoding='utf-8') as f:
            c = f.read().replace('\r\n', '\n')

        # Replace text-shadow: 0 1em with 0 1.6em
        c = c.replace('text-shadow: 0 1em !important;', 'text-shadow: 0 1.6em !important;')
        # Set nav-menu-link-w height to 1.15em or 1.2em so only 1 line fits
        c = c.replace('height: clamp(2.4rem, 3.6vw, 3.4rem) !important;', 'height: 1.2em !important;\n  line-height: 1.2 !important;')
        c = c.replace('height: 2.8rem !important;', 'height: 1.2em !important;')
        c = c.replace('height: 2.35rem !important;', 'height: 1.2em !important;')
        c = c.replace('height: 2.4rem !important;', 'height: 1.2em !important;')
        c = c.replace('height: 2.2rem !important;', 'height: 1.2em !important;')

        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Updated {css_file}")

def fix_lando():
    for p in ['public/assets/lando/lando-engine.js', 'dist/assets/lando/lando-engine.js']:
        if not os.path.exists(p): continue
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('return"-1em"', 'return"-1.6em"')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Updated {p}")

if __name__ == '__main__':
    fix_css()
    fix_lando()
