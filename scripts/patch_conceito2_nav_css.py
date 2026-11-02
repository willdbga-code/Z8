import os

def patch_conceito2_css():
    css_path = 'conceito-2/style.css'
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read().replace('\r\n', '\n')

    # Find the start of NAV MENU HAMBURGER & LINKS block
    start_marker = '/* ==================== NAV MENU HAMBURGER & LINKS ==================== */'
    end_marker = '@media screen and (max-width: 479px) {\n  .nav-menu-link-w {\n    height: 4.3rem !important;\n  }\n  .text-nav-link {\n    font-size: 2.5rem !important;\n    text-shadow: 0 4.3rem !important;\n  }\n  #nav-menu-link-login .text-nav-link {\n    font-size: 2.15rem !important;\n  }\n}'

    start_idx = css.find(start_marker)
    end_idx = css.find(end_marker)

    if start_idx == -1 or end_idx == -1:
        print(f"Markers not found in {css_path}: start={start_idx}, end={end_idx}")
        return

    full_end_idx = end_idx + len(end_marker)

    replacement = """/* ==================== OFFICIAL Z8 RESPONSIVE NAV MENU (CONCEITO 2) ==================== */
.nav-menu-w {
  z-index: 99 !important;
  background-color: rgba(6, 8, 13, 0.98) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  width: 100vw !important;
  color: #F4F4ED !important;
  height: 100svh !important;
  min-height: 100dvh !important;
  position: fixed !important;
  inset: 0 !important;
  display: none;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
}

.nav-menu-inner {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  max-width: 1280px !important;
  margin: 0 auto !important;
  padding: 5rem 2rem 2.5rem 2rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
}

.nav-menu-grid {
  display: grid !important;
  grid-template-columns: minmax(280px, 400px) minmax(320px, 1fr) !important;
  gap: clamp(2rem, 4vw, 4.5rem) !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  margin: 0 auto !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

.nav-menu-images-w {
  display: flex !important;
  width: 100% !important;
  max-width: 400px !important;
  height: auto !important;
  max-height: 68vh !important;
  border-radius: 6px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(10, 15, 25, 0.6) !important;
  padding: 0.5rem !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.nav-menu-links-w {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
  max-width: 100% !important;
  gap: 1.25rem !important;
  box-sizing: border-box !important;
}

.nav-menu-links-col {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  gap: 1.25rem !important;
}

.nav-menu-links-list {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  gap: clamp(0.35rem, 1vw, 0.75rem) !important;
}

.nav-menu-link-w {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: clamp(2.4rem, 3.6vw, 3.4rem) !important;
  max-width: 100% !important;
  overflow: clip !important;
  text-decoration: none !important;
  color: rgba(244, 244, 237, 0.85) !important;
  transition: color 0.3s ease !important;
  padding: 0 0.5rem !important;
  cursor: pointer !important;
  white-space: nowrap !important;
}

.nav-menu-link-w:hover {
  color: #00F0FF !important;
}

.nav-menu-link-w.w--current {
  color: #FFFFFF !important;
  pointer-events: none !important;
}

.text-nav-link {
  font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-size: clamp(1.4rem, 2.2vw, 2.35rem) !important;
  line-height: 1.05 !important;
  font-weight: 850 !important;
  text-transform: uppercase !important;
  letter-spacing: -0.02em !important;
  white-space: nowrap !important;
  display: inline-block !important;
  text-shadow: 0 1em !important;
  margin: 0 !important;
  padding: 0 !important;
}

#nav-menu-link-login .text-nav-link {
  font-size: clamp(1.35rem, 2.1vw, 2.2rem) !important;
  color: #00F0FF !important;
}

.nav-menu-link-current-svg {
  position: absolute !important;
  left: 50% !important;
  bottom: 0px !important;
  top: auto !important;
  transform: translateX(-50%) !important;
  width: min(85%, 260px) !important;
  height: 8px !important;
  pointer-events: none !important;
  color: #00F0FF !important;
  display: none !important;
}

.nav-menu-link-w.w--current .nav-menu-link-current-svg {
  display: block !important;
}

@media screen and (max-width: 1024px) {
  .nav-menu-inner {
    padding: 5rem 1.5rem 2rem 1.5rem !important;
    align-items: flex-start !important;
  }
  .nav-menu-grid {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
    max-width: 600px !important;
  }
  .nav-menu-images-w {
    display: none !important;
  }
  .nav-menu-link-w {
    height: 2.8rem !important;
  }
  .text-nav-link {
    font-size: clamp(1.3rem, 2.8vw, 1.95rem) !important;
  }
  #nav-menu-link-login .text-nav-link {
    font-size: clamp(1.2rem, 2.6vw, 1.8rem) !important;
  }
}

@media screen and (max-width: 767px) {
  .nav-menu-w {
    clip-path: none !important;
    padding: 0 !important;
  }
  .nav-menu-inner {
    padding: 4.5rem 1rem 2.5rem 1rem !important;
    height: auto !important;
    min-height: 100% !important;
  }
  .nav-menu-grid {
    grid-template-columns: 1fr !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 1.25rem !important;
  }
  .nav-menu-images-w {
    display: none !important;
  }
  .nav-menu-links-list {
    gap: 0.35rem !important;
    width: 100% !important;
  }
  .nav-menu-link-w {
    height: 2.35rem !important;
    width: 100% !important;
  }
  .text-nav-link {
    font-size: clamp(1.02rem, 4.2vw, 1.35rem) !important;
    letter-spacing: -0.01em !important;
  }
  #nav-menu-link-login .text-nav-link {
    font-size: clamp(1rem, 4.0vw, 1.25rem) !important;
  }
}"""

    new_css = css[:start_idx] + replacement + css[full_end_idx:]
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_css)
    print("Successfully replaced nav menu CSS in conceito-2/style.css!")

if __name__ == '__main__':
    patch_conceito2_css()
