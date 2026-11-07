# -*- coding: utf-8 -*-
import re

print("--- 1. Updating conceito/app.js ---")
with open("conceito/app.js", "r", encoding="utf-8") as f:
    c1 = f.read()

# Replace openZ8ModelDrawer body innerHTML in conceito/app.js
old_c1_drawer = """  body.innerHTML = `
    <div class="z8-drawer-grid">
      <div>
        <div class="z8-drawer-img-wrap">
          <img id="z8-drawer-main-img" src="${firstImg}" alt="${model.name}" />
        </div>
        <div class="z8-drawer-swatches">${swatchesHtml}</div>
      </div>
      <div>
        <div class="z8-modal-badge">${model.cnh}</div>
        <h2 class="z8-modal-title">${model.name}</h2>
        <p class="z8-modal-subtitle">${model.power} — ${model.range}</p>
        <div class="z8-drawer-kpis">
          <div class="z8-drawer-kpi">
            <span>CUSTO ATACADO B2B</span>
            <strong style="color:#00F0FF;">R$ ${(model.wholesale || model.wholesalePrice || 0).toLocaleString('pt-BR')}</strong>
          </div>
          <div class="z8-drawer-kpi">
            <span>PREÇO VAREJO SUG.</span>
            <strong>R$ ${(model.retail || model.retailPrice || 0).toLocaleString('pt-BR')}</strong>
          </div>
          <div class="z8-drawer-kpi is-lime">
            <span>MARGEM LÍQUIDA ESTIMADA</span>
            <strong>${model.marginPct || 'Até 31,9%'}</strong>
          </div>
          <div class="z8-drawer-kpi is-lime">
            <span>MARKUP COMERCIAL</span>
            <strong>${model.tag}</strong>
          </div>
        </div>
        <button type="button" class="z8-drawer-cta" id="z8-drawer-reserve-btn">
          SOLICITAR TABELA DESTE MODELO &amp; RESERVAR CIDADE ↱
        </button>
      </div>
    </div>
  `;"""

new_c1_drawer = """  const approved = isCatalogApproved();

  let kpisHtml = '';
  if (approved) {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong style="color:#00F0FF;">R$ ${(model.wholesale || model.wholesalePrice || 0).toLocaleString('pt-BR')}</strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong>R$ ${(model.retail || model.retailPrice || 0).toLocaleString('pt-BR')}</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM LÍQUIDA ESTIMADA</span>
        <strong>${model.marginPct || 'Até 31,9%'}</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARKUP COMERCIAL</span>
        <strong>${model.tag}</strong>
      </div>
    `;
  } else {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong style="color:#00F0FF; display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM ESTIMADA</span>
        <strong style="font-size:0.88rem; color:#00F0FF;">Exclusivo Credenciados</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>DISPONIBILIDADE</span>
        <strong style="font-size:0.88rem;">Lote Concessão 2026</strong>
      </div>
    `;
  }

  const ctaBtnText = approved
    ? 'ENCOMENDAR ESTE MODELO // DIRETO DA FÁBRICA ↱'
    : 'SOLICITAR TABELA DESTE MODELO &amp; RESERVAR CIDADE ↱';

  body.innerHTML = `
    <div class="z8-drawer-grid">
      <div>
        <div class="z8-drawer-img-wrap">
          <img id="z8-drawer-main-img" src="${firstImg}" alt="${model.name}" />
        </div>
        <div class="z8-drawer-swatches">${swatchesHtml}</div>
      </div>
      <div>
        <div class="z8-modal-badge">${model.cnh}</div>
        <h2 class="z8-modal-title">${model.name}</h2>
        <p class="z8-modal-subtitle">${model.power} — ${model.range}</p>
        <div class="z8-drawer-kpis">
          ${kpisHtml}
        </div>
        <button type="button" class="z8-drawer-cta" id="z8-drawer-reserve-btn">
          ${ctaBtnText}
        </button>
      </div>
    </div>
  `;"""

if old_c1_drawer in c1:
    c1 = c1.replace(old_c1_drawer, new_c1_drawer, 1)
    print("SUCCESS: replaced c1 drawer")
else:
    print("FAIL: c1 drawer not found")

# Update initKineticTextScrollMobile in conceito/app.js to also activate D7, E7, HP, rW, qp, Gp on mobile
old_c1_kinetic = """export function initKineticTextScrollMobile() {
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
}"""

new_c1_kinetic = """export function initKineticTextScrollMobile() {
  if (window.innerWidth >= 992) return; // Desktop handled natively by lando-engine

  // 1. Activate authentic Lando Norris text reveal, sweeps, and rich text engines on mobile
  if (typeof window.D7 === 'function') window.D7();
  if (typeof window.E7 === 'function') window.E7();
  if (typeof window.HP === 'function') window.HP();
  if (typeof window.rW === 'function') window.rW();

  // 2. Kill and re-attach Section 4 Architecture pinned horizontal scroll on mobile
  if (typeof window.o6 === 'function') window.o6();
  if (typeof window.qp === 'function') window.qp();
  if (typeof window.Gp === 'function') window.Gp();

  // 3. Fallback sweep engine for any remaining [data-anim-high] elements
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap) {
    const elements = document.querySelectorAll('[data-anim-high]');
    elements.forEach((W) => {
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
        const startTime = idx * 0.12;
        if (isRight) {
          tl.to(M, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out' }, startTime);
        } else {
          tl.to(M, { clipPath: 'inset(0 0 0 0%)', duration: 0.6, ease: 'power2.out' }, startTime);
        }
        tl.to(bar, { scaleX: 0, duration: 0.6, ease: 'power2.inOut' }, startTime + 0.3);
      });

      W._highLinesInstance = { timeline: tl, cleanup: () => { tl.kill(); } };
      if (ScrollTrigger) {
        W._highLinesInstance.scrollTrigger = ScrollTrigger.create({
          trigger: W,
          start: 'top 92%',
          once: true,
          onEnter: () => tl.play()
        });
      }
    });
    if (ScrollTrigger) ScrollTrigger.refresh();
  }
}"""

if old_c1_kinetic in c1:
    c1 = c1.replace(old_c1_kinetic, new_c1_kinetic, 1)
    print("SUCCESS: replaced c1 kinetic text")
else:
    print("FAIL: c1 kinetic text not found")

# Add window load listener for complete safety
c1 = c1.replace(
    "  setTimeout(initKineticTextScrollMobile, 250);",
    "  setTimeout(initKineticTextScrollMobile, 250);\n  window.addEventListener('load', () => setTimeout(initKineticTextScrollMobile, 100));"
)

with open("conceito/app.js", "w", encoding="utf-8") as f:
    f.write(c1)


print("\n--- 2. Updating conceito-2/app.js ---")
with open("conceito-2/app.js", "r", encoding="utf-8") as f:
    c2 = f.read()

# Update openZ8ModelDrawer in conceito-2/app.js
old_c2_else = """  } else {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong style="color:#00F0FF;">${fmtBRL(model.wholesale)}</strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong>${fmtBRL(model.retail)}</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM LÍQUIDA ESTIMADA</span>
        <strong>${model.marginPct}%</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARKUP COMERCIAL</span>
        <strong>${model.tag}</strong>
      </div>
    `;
  }"""

new_c2_else = """  } else {
    kpisHtml = `
      <div class="z8-drawer-kpi">
        <span>CUSTO ATACADO B2B</span>
        <strong style="color:#00F0FF; display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi">
        <span>PREÇO VAREJO SUG.</span>
        <strong style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.92rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          SOB CONSULTA
        </strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM ESTIMADA</span>
        <strong style="font-size:0.88rem; color:#00F0FF;">Exclusivo Credenciados</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>DISPONIBILIDADE</span>
        <strong style="font-size:0.88rem;">Lote Concessão 2026</strong>
      </div>
    `;
  }"""

if old_c2_else in c2:
    c2 = c2.replace(old_c2_else, new_c2_else, 1)
    print("SUCCESS: replaced c2 drawer unapproved branch")
else:
    print("FAIL: c2 drawer unapproved branch not found")

# Also ensure c2 initializes mobile motion
old_c2_kinetic = """export function initKineticTextScrollMobile() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap) return;

  const elements = document.querySelectorAll('[data-anim-high]');
  if (!elements.length) return;

  const Q = 0.6;
  const Z = 0.6;
  const stagger = 0.12;

  elements.forEach((W) => {
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
}"""

if old_c2_kinetic in c2:
    c2 = c2.replace(old_c2_kinetic, new_c1_kinetic, 1)
    print("SUCCESS: replaced c2 kinetic text")
else:
    print("NOTE: checking if c2 kinetic text has different indentation...")
    # Find initKineticTextScrollMobile in c2
    idx = c2.find("export function initKineticTextScrollMobile")
    if idx != -1:
        end_idx = c2.find("window.initKineticTextScrollMobile = initKineticTextScrollMobile;", idx)
        if end_idx != -1:
            c2 = c2[:idx] + new_c1_kinetic + "\n" + c2[end_idx:]
            print("SUCCESS: replaced c2 kinetic text by boundary")

# Add load trigger to c2
c2 = c2.replace(
    "  setTimeout(initKineticTextScrollMobile, 250);",
    "  setTimeout(initKineticTextScrollMobile, 250);\n  window.addEventListener('load', () => setTimeout(initKineticTextScrollMobile, 100));"
)

with open("conceito-2/app.js", "w", encoding="utf-8") as f:
    f.write(c2)

print("\n--- 3. Appending Mobile & Tablet Horizontal Scroll CSS to conceito/style.css ---")
with open("conceito/style.css", "r", encoding="utf-8") as f:
    css = f.read()

mobile_horizontal_css = """
/* ==========================================================================
   MOBILE & TABLET PINNED HORIZONTAL SCROLL FOR ARCHITECTURE (SECTION 4)
   Enables desktop-parity horizontal sliding on phones (< 992px)
   ========================================================================== */
@media screen and (max-width: 991px) {
  .s.is-horizontal-track {
    position: relative !important;
    overflow: clip !important;
    width: 100% !important;
  }

  .horizontal-pin-wrap,
  .horizontal-pin-spacer {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
  }

  .horizontal-pin-sticky {
    position: -webkit-sticky !important;
    position: sticky !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100vh !important;
    height: 100dvh !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    z-index: 5 !important;
  }

  .horizontal-track {
    display: flex !important;
    flex-flow: row nowrap !important;
    height: 100vh !important;
    height: 100dvh !important;
    width: max-content !important;
    will-change: transform !important;
    align-items: center !important;
    gap: 5vw !important;
    padding-left: 10vw !important;
    padding-right: 25vw !important;
    padding-top: calc(var(--vh, 1vh) * 5) !important;
    padding-bottom: calc(var(--vh, 1vh) * 5) !important;
  }

  .horizontal-grid-col {
    display: flex !important;
    flex-flow: column nowrap !important;
    justify-content: center !important;
    align-items: center !important;
    flex-shrink: 0 !important;
    width: 82vw !important;
    max-width: 82vw !important;
    height: 82vh !important;
    max-height: 82vh !important;
    gap: 2vh !important;
    margin: 0 !important;
    padding: 0 4px !important;
  }

  .horizontal-grid-col.large-img.is-home1,
  .horizontal-grid-col.is-home-flip.neg-margin,
  .horizontal-grid-col.neg-margin {
    margin-top: 0 !important;
  }

  .horizontal-grid-spacer {
    width: 4vw !important;
    min-width: 4vw !important;
    flex: 0 0 4vw !important;
    display: block !important;
  }

  .horizontal-item-w {
    width: 100% !important;
    max-width: 100% !important;
    position: relative !important;
    left: auto !important;
    right: auto !important;
    margin: 0 !important;
    flex: 0 0 auto !important;
  }

  .horizontal-item-w.is-home-1,
  .horizontal-item-w.is-home-2,
  .horizontal-item-w.is-home3,
  .horizontal-item-w.is-home-4,
  .horizontal-item-w.is-5,
  .horizontal-item-w.is-home-6,
  .horizontal-item-w.is-home-7,
  .horizontal-item-w.is-home8 {
    margin: 0 !important;
    left: auto !important;
  }

  .horizontal-item-layout {
    display: flex !important;
    flex-flow: column nowrap !important;
    gap: 0.35rem !important;
  }

  .eyebrow-w {
    margin-bottom: 0.25rem !important;
  }

  .text-eyebrow {
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: #CBD5E1 !important;
  }

  .horizontal-item-img-w {
    width: 100% !important;
    max-width: 100% !important;
    height: 29vh !important;
    max-height: 29vh !important;
    aspect-ratio: 16 / 10 !important;
    border-radius: 6px !important;
    overflow: hidden !important;
    background: #0A1628 !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35) !important;
  }

  .horizontal-item-img-w.is-home8,
  .horizontal-item-img-w.is-home-8 {
    width: 100% !important;
    height: 29vh !important;
    max-width: 100% !important;
    max-height: 29vh !important;
  }

  .image.is-horizontal-scroll {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    transform: none !important;
  }

  .horizontal-item-w.is-text-callout,
  .horizontal-item-w.is-text-callout.callout-1,
  .horizontal-item-w.is-text-callout.callout-2 {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0.5rem 0 !important;
  }

  .horizontal-item-text {
    font-size: clamp(1rem, 4.2vw, 1.25rem) !important;
    line-height: 1.35 !important;
    font-weight: 600 !important;
    color: #F4F5F7 !important;
  }

  .horizontal-rive-placeholder {
    width: 3.5rem !important;
    height: auto !important;
    margin-top: 0.4rem !important;
  }
}
"""

if "MOBILE & TABLET PINNED HORIZONTAL SCROLL FOR ARCHITECTURE (SECTION 4)" not in css:
    css += mobile_horizontal_css
    with open("conceito/style.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("SUCCESS: appended mobile_horizontal_css to conceito/style.css")
else:
    print("NOTE: mobile_horizontal_css already present in conceito/style.css")

print("\n--- ALL TASKS EXECUTED CLEANLY ---")
