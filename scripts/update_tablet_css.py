import os

def update_conceito_css():
    filepath = 'conceito/style.css'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for the end of mobile refinements block
    target = """  .z8-drawer-cta {
    margin-top: 1.25rem !important;
    padding: 1rem 0.85rem !important;
  }
}"""

    replacement = """  .z8-drawer-cta {
    margin-top: 1.25rem !important;
    padding: 1rem 0.85rem !important;
  }
}

/* ==========================================================================
   TABLET-SPECIFIC REFINEMENTS (MIN-WIDTH: 480PX) AND (MAX-WIDTH: 991PX)
   Following the exact mobile excellence standards while keeping Desktop (>= 992px) 100% UNTOUCHED
   ========================================================================== */
@media screen and (min-width: 480px) and (max-width: 991px) {
  /* 1. Opening Transition: Centered Z8 Logo & Ergonomic Button */
  .transition-w {
    position: fixed !important;
    inset: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .transition-rive {
    position: absolute !important;
    inset: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: none !important;
  }
  .z8-transition-logo-svg {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: min(320px, 46vw) !important;
    height: auto !important;
    margin: 0 !important;
  }
  .transition-btn {
    position: absolute !important;
    bottom: calc(var(--gap) * 2) !important;
    right: calc(var(--gap) * 2) !important;
    z-index: 20 !important;
  }

  /* 2. Hero Section: Eliminate Colliding Tablet Hero Text */
  .home-hero-tablet-hero-text,
  .home-hero-tablet-text-w,
  .home-hero-tablet-hero-text [data-hero-anim="mob1"],
  .home-hero-tablet-hero-text [data-hero-anim="mob2"] {
    display: none !important;
  }

  /* 3. Hero Section: Remove Occluding Floating KPI Card for Clean Touch 3D Interaction */
  .z8-hero-floating-kpi {
    display: none !important;
  }

  /* 4. Top Navbar: Centered & Well-Proportioned Z8 Emblem */
  .page-ln4-pos {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: none !important;
    z-index: 10 !important;
  }
  .page-ln4-pos .nav-middle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transform: none !important;
    translate: none !important;
    pointer-events: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .page-ln4-pos .page-ln4-svg {
    width: auto !important;
    height: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .page-ln4-pos .ln4-logo,
  .page-ln4-pos .z8-nav-center-svg,
  .page-ln4-svg .z8-nav-center-svg {
    width: 82px !important;
    height: 34px !important;
    max-height: 34px !important;
    display: block !important;
    transform: none !important;
  }

  /* 5. Motorcycle Showcase Card (Z8 Tank, etc.): Preserve Sleek Desktop Aesthetic & No Square Border */
  .helmet-grid-frame-w.destop {
    display: flex !important;
  }
  .helmet-grid-frame-w.mobile {
    display: none !important;
  }
  .helmet-grid-item-img-w {
    clip-path: polygon(0% 0%, 100% 0%, 100% 90.2%, 60.5% 90.2%, 51.8% 100%, 0% 100%) !important;
    border-radius: 7.5px !important;
  }
  .helmet-grid-item {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    aspect-ratio: 406.89 / 411 !important;
    width: 100% !important;
  }
  .helmet-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.5rem !important;
    max-width: 860px !important;
    margin: 0 auto !important;
  }
  .z8-helmet-top-telemetry {
    top: 1.15rem !important;
    left: 1.15rem !important;
    right: 1.15rem !important;
    gap: 0.5rem !important;
  }
  .z8-tel-chip {
    font-size: 0.72rem !important;
    padding: 0.28rem 0.65rem !important;
    white-space: nowrap !important;
  }
  .z8-tel-profit {
    font-size: 0.74rem !important;
    padding: 0.28rem 0.65rem !important;
    white-space: nowrap !important;
  }
  .helmet-grid-item-reveal-img.z8-card-fit-cover {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center center !important;
  }
  .helmet-grid-item-w:hover .helmet-grid-item-reveal-img.z8-card-fit-cover {
    opacity: 1 !important;
  }

  /* 6. Modal & Spec Drawer Tablet Viewport & Scrolling Ergonomics */
  .z8-drawer-overlay,
  .z8-modal-overlay {
    padding: 1.5rem !important;
    align-items: center !important;
  }
  .z8-drawer-panel,
  .z8-modal-dialog {
    max-height: calc(100dvh - 3rem) !important;
    max-height: calc(100vh - 3rem) !important;
    max-width: 680px !important;
    padding: 2rem 1.75rem !important;
    margin: auto !important;
    border-radius: 8px !important;
  }
  .z8-drawer-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 1rem 1.5rem !important;
  }
  .z8-drawer-close {
    top: 0 !important;
    margin-bottom: 0.75rem !important;
    padding: 0.45rem 0.85rem !important;
    font-size: 0.74rem !important;
  }
  .z8-drawer-cta {
    margin-top: 1.5rem !important;
    padding: 1rem 1.25rem !important;
  }

  /* 7. Showroom vs Oficina (OTOT Section) on Tablet */
  .s.is-otot-home {
    overflow-x: clip !important;
    max-width: 100vw !important;
    padding-top: 3.5rem !important;
  }
  .otot-home-layout {
    grid-column-gap: 1.5rem !important;
    grid-row-gap: 1.5rem !important;
    padding: 0 1.5rem !important;
  }
  .otot-home-img-w.is-1 {
    left: -4rem !important;
  }
  .otot-home-img-w.is-2 {
    right: -4rem !important;
  }
}"""

    # Normalize CRLF
    content_norm = content.replace('\r\n', '\n')
    target_norm = target.replace('\r\n', '\n')
    replacement_norm = replacement.replace('\r\n', '\n')

    if target_norm not in content_norm:
        print("ERROR: Target block not found in conceito/style.css")
        return False

    new_content = content_norm.replace(target_norm, replacement_norm, 1)
    # preserve original newline style
    if '\r\n' in content:
        new_content = new_content.replace('\n', '\r\n')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Updated conceito/style.css with tablet calibration!")
    return True

def update_conceito2_css():
    filepath = 'conceito-2/style.css'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    tablet_block = """
/* ==========================================================================
   CONCEITO 2 — TABLET-SPECIFIC REFINEMENTS (MIN-WIDTH: 480PX) AND (MAX-WIDTH: 991PX)
   Preserves Desktop (>= 992px) 100% UNTOUCHED
   ========================================================================== */
@media screen and (min-width: 480px) and (max-width: 991px) {
  /* Architectural Facade & Floorplan Modules: Clean 2-column Grid */
  .section-architectural-modules {
    padding: 3rem 1.5rem !important;
  }
  .section-architectural-modules > div:nth-child(2) {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
  }

  /* Technical Model Comparator */
  .z8-comparator-section {
    padding: 3rem 1.5rem !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  .z8-comparator-selectors {
    grid-template-columns: 1fr 1fr !important;
    gap: 1.25rem !important;
  }

  /* Order Desk & Service Orders Table Safe Scrolling */
  .z8-orderdesk-card {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  /* Downloads & Legal Dossier: Balanced 2-column Layout */
  .z8-downloads-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
  }

  /* Central Tecnica & Post-Sale OS Cards */
  .z8-admin-stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
  }
}
"""

    if "CONCEITO 2 — TABLET-SPECIFIC REFINEMENTS" in content:
        print("INFO: conceito-2/style.css already contains tablet block.")
        return True

    # Append to the end of conceito-2/style.css
    new_content = content + "\n" + tablet_block
    if '\r\n' in content:
        new_content = new_content.replace('\n', '\r\n')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Updated conceito-2/style.css with tablet calibration!")
    return True

if __name__ == '__main__':
    update_conceito_css()
    update_conceito2_css()
