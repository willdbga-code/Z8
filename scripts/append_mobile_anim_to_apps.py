import sys

sys.stdout.reconfigure(encoding='utf-8')

code_to_add = """
// ==========================================================================
// KINETIC TEXT SCROLL REVEAL ENGINE FOR MOBILE, TABLET & DUO (< 992px)
// ==========================================================================
export function initKineticTextScrollMobile() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap) return;

  const elements = document.querySelectorAll('[data-anim-high]');
  if (!elements.length) return;

  const Q = 0.6;
  const Z = 0.6;
  const stagger = 0.12;

  elements.forEach((W) => {
    // If desktop lando-engine already attached an instance, don't duplicate
    if (W._highLinesInstance) return;

    const animAttr = W.getAttribute('data-anim-high') || 'right, lime, 0';
    const [dir, colorName, delayMs] = animAttr.split(',').map((s) => s.trim());
    const isRight = dir !== 'left';
    const delay = parseFloat(delayMs || '0') / 1000;

    const colorMap = {
      lime: 'var(--color--lime, #00F0FF)',
      'lime-off': 'var(--color--lime-off, #00D4FF)',
      'dark-green': 'var(--color--dark-green, #0A1628)',
      'dark-green-tint-1': 'var(--color--dark-green-tint-1, #1E293B)',
      black: 'var(--color--black, #111112)',
      white: 'var(--color--white, #F4F5F7)'
    };
    const barBg = colorMap[colorName] || 'var(--color--lime, #00F0FF)';

    const lines = W.querySelectorAll('.line');
    if (!lines.length) return;

    const tl = gsap.timeline({ paused: true, delay });

    lines.forEach((M, idx) => {
      M.style.position = 'relative';
      if (isRight) {
        gsap.set(M, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 });
      } else {
        gsap.set(M, { clipPath: 'inset(0 0 0 100%)', autoAlpha: 1 });
      }

      let bar = M.querySelector('.high-line-reveal');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'high-line-reveal';
        bar.style.position = 'absolute';
        bar.style.top = '0';
        bar.style.left = '0';
        bar.style.width = '100%';
        bar.style.height = '100%';
        bar.style.backgroundColor = barBg;
        bar.style.transformOrigin = isRight ? 'right center' : 'left center';
        bar.style.zIndex = '5';
        M.appendChild(bar);
      }
      gsap.set(bar, { scaleX: 1 });

      const startTime = idx * stagger;
      if (isRight) {
        tl.to(M, { clipPath: 'inset(0 0% 0 0)', duration: Q, ease: 'power2.out' }, startTime);
      } else {
        tl.to(M, { clipPath: 'inset(0 0 0 0%)', duration: Q, ease: 'power2.out' }, startTime);
      }
      tl.to(bar, { scaleX: 0, duration: Z, ease: 'power2.inOut' }, startTime + Q / 2);
    });

    W._highLinesInstance = {
      timeline: tl,
      cleanup: () => { tl.kill(); }
    };

    if (ScrollTrigger) {
      const st = ScrollTrigger.create({
        trigger: W,
        start: 'top 92%',
        once: true,
        onEnter: () => tl.play()
      });
      W._highLinesInstance.scrollTrigger = st;
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tl.play();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(W);
    }
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
}
window.initKineticTextScrollMobile = initKineticTextScrollMobile;
"""

# Update conceito/app.js
with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c1_app = f.read()

if 'initKineticTextScrollMobile' not in c1_app:
    # Add function before DOMContentLoaded
    idx_dcl = c1_app.rfind("document.addEventListener('DOMContentLoaded'")
    if idx_dcl != -1:
        # In DOMContentLoaded, call it
        call_snippet = "  setTimeout(initKineticTextScrollMobile, 250);\n  window.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });\n"
        c1_app = c1_app[:idx_dcl] + code_to_add + "\n" + c1_app[idx_dcl:]
        # Insert call_snippet inside the DOMContentLoaded callback
        idx_end_dcl = c1_app.rfind("});")
        c1_app = c1_app[:idx_end_dcl] + call_snippet + c1_app[idx_end_dcl:]
        with open('conceito/app.js', 'w', encoding='utf-8') as f:
            f.write(c1_app)
        print("✓ Successfully added initKineticTextScrollMobile to conceito/app.js")

# Update conceito-2/app.js
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c2_app = f.read()

if 'initKineticTextScrollMobile' not in c2_app:
    idx_dcl2 = c2_app.rfind("document.addEventListener('DOMContentLoaded'")
    if idx_dcl2 != -1:
        call_snippet = "  setTimeout(initKineticTextScrollMobile, 250);\n  window.addEventListener('resize', () => { if (window.innerWidth < 992) initKineticTextScrollMobile(); });\n"
        c2_app = c2_app[:idx_dcl2] + code_to_add + "\n" + c2_app[idx_dcl2:]
        idx_end_dcl2 = c2_app.rfind("});")
        c2_app = c2_app[:idx_end_dcl2] + call_snippet + c2_app[idx_end_dcl2:]
        with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
            f.write(c2_app)
        print("✓ Successfully added initKineticTextScrollMobile to conceito-2/app.js")
