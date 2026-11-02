import os

def patch_lando():
    paths = [
        'public/assets/lando/lando-engine.js',
        'assets/lando/lando-engine.js',
        'dist/assets/lando/lando-engine.js'
    ]
    target = 'if(K)return window.innerWidth<480?"-4.3rem":"-5.25rem";return"-100%"'
    replacement = 'return"-1em"'

    for p in paths:
        if not os.path.exists(p):
            print(f"Skipping {p} (does not exist)")
            continue
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        if target in content:
            content = content.replace(target, replacement)
            with open(p, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched {p} successfully!")
        else:
            print(f"Target not found in {p}")

def patch_style_css():
    css_path = 'conceito/style.css'
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read().replace('\r\n', '\n')

    responsive_nav_block = """
/* ==========================================================================
   OFFICIAL Z8 RESPONSIVE & FLUID FULLSCREEN HAMBURGER NAVIGATION SYSTEM
   Bauhaus Typography & Automotive Geometry (Desktop, Tablet, Mobile)
   ========================================================================== */

/* 1. Base Fullscreen Nav Menu Layer */
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

.nav-menu-inner,
.nav-menu-inner.c {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  max-height: none !important;
  margin: 0 auto !important;
  padding: 5rem 2rem 2.5rem 2rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
}

/* 2. Grid Architecture & Column Balance */
.nav-menu-grid {
  display: grid !important;
  grid-template-columns: minmax(280px, 400px) minmax(320px, 1fr) !important;
  gap: clamp(2rem, 4vw, 4.5rem) !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  max-width: 1280px !important;
  margin: 0 auto !important;
  padding: 0 !important;
  height: auto !important;
  box-sizing: border-box !important;
}

/* 3. Left Studio Photographic Showcase */
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

.nav-menu-images-track {
  display: flex !important;
  gap: 0.5rem !important;
  width: 100% !important;
  height: 100% !important;
}

.nav-menu-images-col {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
  flex: 1 !important;
  height: 100% !important;
}

.nav-menu-img-w {
  border-radius: 4px !important;
  overflow: hidden !important;
  position: relative !important;
  height: 160px !important;
  background: #000 !important;
}

.nav-menu-img-w img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

/* 4. Right Navigation Links & Monolithic Typography */
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

.nav-menu-spacer {
  display: none !important;
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
  box-sizing: border-box !important;
}

#nav-menu-link-login .text-nav-link {
  font-size: clamp(1.35rem, 2.1vw, 2.2rem) !important;
  color: #00F0FF !important;
}

/* Indicator line under active current link */
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

/* 5. Minimalist Helmet Badge & Corporate Authority */
.nav-helmet-rive-w {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.4rem !important;
  margin-top: 0.5rem !important;
}

.base-helmet-rive-w {
  width: 48px !important;
  height: 48px !important;
}

.nav-helmet-rive-w .text-eyebrow {
  font-family: 'Mona Sans Variable', sans-serif !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  color: rgba(244, 244, 237, 0.45) !important;
}

/* 6. Footer Callouts & Social Action Buttons */
.nav-menu-social-w {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.75rem !important;
  margin-top: 0.75rem !important;
  width: 100% !important;
}

.nav-menu-social-w > .text-link-w {
  background: rgba(0, 240, 255, 0.08) !important;
  border: 1px solid rgba(0, 240, 255, 0.35) !important;
  border-radius: 4px !important;
  padding: 0.45rem 1.1rem !important;
  font-size: 0.74rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #00F0FF !important;
  text-decoration: none !important;
  transition: all 0.25s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-menu-social-w > .text-link-w:hover {
  background: #00F0FF !important;
  color: #07080B !important;
  border-color: #00F0FF !important;
}

.callout-socials-links-layout {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  width: 100% !important;
}

.callout-socials-links-layout .text-link-w {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border-radius: 4px !important;
  padding: 0.35rem 0.75rem !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: rgba(244, 244, 237, 0.75) !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.callout-socials-links-layout .text-link-w:hover {
  border-color: #00F0FF !important;
  color: #00F0FF !important;
  background: rgba(0, 240, 255, 0.1) !important;
}

/* ==================== BREAKPOINT: TABLET (<= 1024px) ==================== */
@media screen and (max-width: 1024px) {
  .nav-menu-inner,
  .nav-menu-inner.c {
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

/* ==================== BREAKPOINT: MOBILE (<= 767px) ==================== */
@media screen and (max-width: 767px) {
  .nav-menu-w {
    clip-path: none !important;
    padding: 0 !important;
  }

  .nav-menu-inner,
  .nav-menu-inner.c {
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

  .nav-helmet-rive-w {
    margin-top: 0.35rem !important;
  }

  .base-helmet-rive-w {
    width: 40px !important;
    height: 40px !important;
  }

  .nav-helmet-rive-w .text-eyebrow {
    font-size: 0.65rem !important;
  }

  .nav-menu-social-w {
    margin-top: 0.5rem !important;
    gap: 0.5rem !important;
  }

  .callout-socials-links-layout {
    gap: 0.4rem !important;
  }

  .callout-socials-links-layout .text-link-w {
    padding: 0.35rem 0.65rem !important;
    font-size: 0.68rem !important;
  }
}
"""

    css = css + "\n" + responsive_nav_block
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Appended responsive navigation rules to conceito/style.css!")

if __name__ == '__main__':
    patch_lando()
    patch_style_css()
