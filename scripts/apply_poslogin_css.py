# Script to append poslogin direct CSS rules
css_to_append = """

/* ==========================================================================
   DIRECT PORTAL LOJISTA (POS-LOGIN MODE)
   Ignora a apresentacao principal e comeca o site diretamente no Portal do Lojista
   ========================================================================== */
body.is-poslogin-direct .transition-w,
html.is-poslogin-direct .transition-w {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
}

body.is-poslogin-direct .page-w,
html.is-poslogin-direct .page-w {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

/* Hide public marketing presentation sections */
body.is-poslogin-direct .sticky-track.home-hero,
html.is-poslogin-direct .sticky-track.home-hero,
body.is-poslogin-direct .home-marquee,
html.is-poslogin-direct .home-marquee,
body.is-poslogin-direct .s.home-hero,
html.is-poslogin-direct .s.home-hero,
body.is-poslogin-direct [data-hero-animation-container],
html.is-poslogin-direct [data-hero-animation-container],
body.is-poslogin-direct #arquitetura-z8,
html.is-poslogin-direct #arquitetura-z8,
body.is-poslogin-direct .otot-track-home,
html.is-poslogin-direct .otot-track-home,
body.is-poslogin-direct .is-otot-home,
html.is-poslogin-direct .is-otot-home,
body.is-poslogin-direct .is-otot-end,
html.is-poslogin-direct .is-otot-end,
body.is-poslogin-direct .home-helmets,
html.is-poslogin-direct .home-helmets,
body.is-poslogin-direct .s.is-callout,
html.is-poslogin-direct .s.is-callout,
body.is-poslogin-direct .gl-canvas,
html.is-poslogin-direct .gl-canvas,
body.is-poslogin-direct .canvas-w,
html.is-poslogin-direct .canvas-w,
body.is-poslogin-direct .home-hero-bg,
html.is-poslogin-direct .home-hero-bg {
  display: none !important;
}

/* Position Portal do Lojista directly below fixed header with safe margin */
body.is-poslogin-direct #portal-lojista,
html.is-poslogin-direct #portal-lojista {
  display: block !important;
  margin-top: 0 !important;
  padding-top: clamp(75px, 8vw, 105px) !important;
  min-height: 100vh;
}

/* Ensure Nav theme matches Portal Lojista dark theme */
body.is-poslogin-direct .nav,
html.is-poslogin-direct .nav {
  background: rgba(10, 11, 14, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

body.is-poslogin-direct .nav-brand svg path,
html.is-poslogin-direct .nav-brand svg path {
  fill: #FFFFFF !important;
}

body.is-poslogin-direct .nav-brand svg text[nav-brand-path="1"],
html.is-poslogin-direct .nav-brand svg text[nav-brand-path="1"] {
  fill: #00F0FF !important;
}

body.is-poslogin-direct .nav-brand svg text[nav-brand-path="2"],
html.is-poslogin-direct .nav-brand svg text[nav-brand-path="2"] {
  fill: #FFFFFF !important;
}

body.is-poslogin-direct .z8-nav-center-svg path,
html.is-poslogin-direct .z8-nav-center-svg path {
  fill: #FFFFFF !important;
}
"""

for target in ['conceito-2/style.css', 'conceito/style.css']:
    with open(target, 'r', encoding='utf-8') as f:
        content = f.read()
    if '/* DIRECT PORTAL LOJISTA (POS-LOGIN MODE)' not in content:
        with open(target, 'a', encoding='utf-8') as f:
            f.write(css_to_append)
        print(f'Appended CSS to {target}')
    else:
        print(f'Already present in {target}')
