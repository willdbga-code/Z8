# -*- coding: utf-8 -*-

for filepath in ["conceito/app.js", "conceito-2/app.js"]:
    print(f"Enhancing mobile motion triggers in {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        code = f.read()

    # Look for the initialization block at the end of the file
    old_init = """document.addEventListener('DOMContentLoaded', () => {
  initTransitionSafety();
  initMarqueeSignatureScroll();
  initOtotBikesAnimation();
  initB2BSimulator();
  initTerritoryRadar();
  initLeadModal();
  initMobileMenuScrollLock();
  initConceitoAuthEvents();
  setTimeout(initKineticTextScrollMobile, 250);
  window.addEventListener('load', () => setTimeout(initKineticTextScrollMobile, 100));
  window.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });
});"""

    new_init = """document.addEventListener('DOMContentLoaded', () => {
  initTransitionSafety();
  initMarqueeSignatureScroll();
  initOtotBikesAnimation();
  initB2BSimulator();
  initTerritoryRadar();
  initLeadModal();
  initMobileMenuScrollLock();
  initConceitoAuthEvents();

  // Multi-tier initialization for mobile kinetic text & horizontal architecture scroll
  const runMobileMotion = () => {
    if (window.innerWidth < 992 && typeof initKineticTextScrollMobile === 'function') {
      initKineticTextScrollMobile();
    }
  };

  runMobileMotion();
  setTimeout(runMobileMotion, 250);
  setTimeout(runMobileMotion, 600);
  setTimeout(runMobileMotion, 1200);

  window.addEventListener('load', () => {
    runMobileMotion();
    setTimeout(runMobileMotion, 300);
  });

  window.addEventListener('scroll', runMobileMotion, { passive: true, once: true });
  window.addEventListener('touchstart', runMobileMotion, { passive: true, once: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth < 992) runMobileMotion();
  });
});"""

    if old_init in code:
        code = code.replace(old_init, new_init, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(code)
        print(f"SUCCESS: updated {filepath}")
    else:
        # Check if slightly different
        print(f"Checking custom pattern for {filepath}...")
        idx = code.find("document.addEventListener('DOMContentLoaded', () => {")
        if idx != -1:
            end_idx = code.find("});", idx)
            if end_idx != -1:
                chunk = code[idx:end_idx+3]
                print(f"Found chunk:\n{chunk}")
