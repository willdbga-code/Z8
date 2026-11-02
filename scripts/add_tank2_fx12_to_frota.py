import re, os

MODEL_PRICES = {
    'z8-tank': {'wholesale': '7.500', 'retail': '11.500', 'markup': '53,3%', 'margin': '34,8%'},
    'z8-tank-2': {'wholesale': '8.500', 'retail': '12.500', 'markup': '47,1%', 'margin': '32,0%'},
    'z8-fx10': {'wholesale': '6.700', 'retail': '9.000', 'markup': '34,3%', 'margin': '25,6%'},
    'z8-fx12': {'wholesale': '7.800', 'retail': '10.600', 'markup': '35,9%', 'margin': '26,4%'},
    'z8-harley': {'wholesale': '6.500', 'retail': '10.000', 'markup': '53,8%', 'margin': '35,0%'},
    'z8-harley-x12': {'wholesale': '6.500', 'retail': '10.000', 'markup': '53,8%', 'margin': '35,0%'},
    'z8-u2': {'wholesale': '6.000', 'retail': '9.500', 'markup': '58,3%', 'margin': '36,8%'},
    'z8-u2-delivery': {'wholesale': '6.000', 'retail': '9.500', 'markup': '58,3%', 'margin': '36,8%'},
    'z8-n95c': {'wholesale': '6.500', 'retail': '10.000', 'markup': '53,8%', 'margin': '35,0%'},
    'z8-n7': {'wholesale': '5.500', 'retail': '9.500', 'markup': '72,7%', 'margin': '42,1%'},
    'z8-h26': {'wholesale': '5.500', 'retail': '9.500', 'markup': '72,7%', 'margin': '42,1%'},
    'z8-q11': {'wholesale': '5.200', 'retail': '9.300', 'markup': '78,8%', 'margin': '44,1%'},
    'z8-n710': {'wholesale': '5.300', 'retail': '9.500', 'markup': '79,2%', 'margin': '44,2%'},
    'z8-q10': {'wholesale': '5.800', 'retail': '9.800', 'markup': '69,0%', 'margin': '40,8%'},
    'z8-gs005': {'wholesale': '3.200', 'retail': '6.200', 'markup': '93,8%', 'margin': '48,4%'},
    'z8-diamond': {'wholesale': '3.400', 'retail': '6.800', 'markup': '100,0%', 'margin': '50,0%'},
}

TANK2_CARD = """
<div role="listitem" class="helmet-grid-item-w w-dyn-item" data-model-id="z8-tank-2" data-model-index="1" onclick="window.openZ8ModelDrawer && window.openZ8ModelDrawer('z8-tank-2')">
  <div class="helmet-grid-item-w">
    <div data-helmet-item="" class="helmet-grid-item">
      <div class="helmet-grid-frame-w destop">
        <div class="helmet-grid-frame is-overlay w-embed">
          <svg width="100%" height="100%" viewBox="0 0 407 411" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z" stroke="var(--color--lime)" stroke-width="2"/>
          </svg>
        </div>
        <div class="helmet-grid-frame is-base w-embed">
          <svg width="100%" height="100%" viewBox="0 0 407 411" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/>
          </svg>
        </div>
      </div>
      <div class="helmet-grid-frame-w mobile">
        <div class="helmet-grid-frame is-overlay w-embed">
          <svg width="100%" height="100%" viewBox="0 0 187 188" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h170.12a7.5 7.5 0 0 1 7.5 7.5v154.61a7.5 7.5 0 0 1-7.5 7.5H60.681a10.5 10.5 0 0 0-8.21 3.954l-7.86 9.858a9.5 9.5 0 0 1-7.427 3.578H8A7.5 7.5 0 0 1 .5 180V8A7.5 7.5 0 0 1 8 .5Z" stroke="var(--color--lime)" stroke-width="2"/>
          </svg>
        </div>
        <div class="helmet-grid-frame is-base w-embed">
          <svg width="100%" height="100%" viewBox="0 0 187 188" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h170.12a7.5 7.5 0 0 1 7.5 7.5v154.61a7.5 7.5 0 0 1-7.5 7.5H60.681a10.5 10.5 0 0 0-8.21 3.954l-7.86 9.858a9.5 9.5 0 0 1-7.427 3.578H8A7.5 7.5 0 0 1 .5 180V8A7.5 7.5 0 0 1 8 .5Z" stroke="currentColor" stroke-width="1"/>
          </svg>
        </div>
      </div>
      <div class="helmet-grid-item-img-w">
        <div class="helmet-grid-item-img-helmet-w">
          <img src="/assets/models/cutouts/z8_tank2_cutout.png" loading="lazy" alt="Z8 Tank 2 Expedition" class="helmet-grid-item-img-helmet z8-card-fit"/>
        </div>
        <img src="/assets/models/hover/z8_tank2_hover.jpg" loading="lazy" alt="Z8 Tank 2 Expedition Hover" class="helmet-grid-item-reveal-img z8-card-fit-cover"/>
      </div>
      <div class="z8-helmet-top-telemetry">
        <span class="z8-tel-chip">CONTRAN 996 // Baú &amp; GPS</span>
        <span class="z8-tel-profit">+47,1% Markup</span>
      </div>
      <div class="z8-helmet-hover-hud">
        <div class="z8-hud-row"><span>ATACADO B2B</span><strong>R$ 8.500</strong></div>
        <div class="z8-hud-row"><span>VAREJO SUG.</span><strong>R$ 12.500</strong></div>
        <div class="z8-hud-row is-lime"><span>MARKUP COMERCIAL</span><strong>+47,1% (Margem 32,0%)</strong></div>
        <div class="z8-hud-cta">INSPECIONAR FICHA &amp; CORES ↱</div>
      </div>
    </div>
    <div class="helmet-grid-item-text-w">
      <h3 class="text-title-small-label text">Z8 Tank 2</h3>
      <div class="helmet-grid-item-date-w">
        <div class="text-title-small-label date">+47,1%</div>
      </div>
      <div class="helmet-grid-extender">
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41c00f127bc68e2462635_ln4-2-helm-mask-extender-grey-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img"/>
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41235ad69136bdc861b67_ln4-2-helm-mask-extender-lime-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img is-overlay"/>
      </div>
    </div>
  </div>
</div>
"""

FX12_CARD = """
<div role="listitem" class="helmet-grid-item-w w-dyn-item" data-model-id="z8-fx12" data-model-index="4" onclick="window.openZ8ModelDrawer && window.openZ8ModelDrawer('z8-fx12')">
  <div class="helmet-grid-item-w">
    <div data-helmet-item="" class="helmet-grid-item">
      <div class="helmet-grid-frame-w destop">
        <div class="helmet-grid-frame is-overlay w-embed">
          <svg width="100%" height="100%" viewBox="0 0 407 411" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z" stroke="var(--color--lime)" stroke-width="2"/>
          </svg>
        </div>
        <div class="helmet-grid-frame is-base w-embed">
          <svg width="100%" height="100%" viewBox="0 0 407 411" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/>
          </svg>
        </div>
      </div>
      <div class="helmet-grid-frame-w mobile">
        <div class="helmet-grid-frame is-overlay w-embed">
          <svg width="100%" height="100%" viewBox="0 0 187 188" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h170.12a7.5 7.5 0 0 1 7.5 7.5v154.61a7.5 7.5 0 0 1-7.5 7.5H60.681a10.5 10.5 0 0 0-8.21 3.954l-7.86 9.858a9.5 9.5 0 0 1-7.427 3.578H8A7.5 7.5 0 0 1 .5 180V8A7.5 7.5 0 0 1 8 .5Z" stroke="var(--color--lime)" stroke-width="2"/>
          </svg>
        </div>
        <div class="helmet-grid-frame is-base w-embed">
          <svg width="100%" height="100%" viewBox="0 0 187 188" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 .5h170.12a7.5 7.5 0 0 1 7.5 7.5v154.61a7.5 7.5 0 0 1-7.5 7.5H60.681a10.5 10.5 0 0 0-8.21 3.954l-7.86 9.858a9.5 9.5 0 0 1-7.427 3.578H8A7.5 7.5 0 0 1 .5 180V8A7.5 7.5 0 0 1 8 .5Z" stroke="currentColor" stroke-width="1"/>
          </svg>
        </div>
      </div>
      <div class="helmet-grid-item-img-w">
        <div class="helmet-grid-item-img-helmet-w">
          <img src="/assets/models/cutouts/z8_fx12_cutout.png" loading="lazy" alt="Z8 FX-12 Sport" class="helmet-grid-item-img-helmet z8-card-fit"/>
        </div>
        <img src="/assets/models/hover/z8_fx12_hover.jpg" loading="lazy" alt="Z8 FX-12 Sport Hover" class="helmet-grid-item-reveal-img z8-card-fit-cover"/>
      </div>
      <div class="z8-helmet-top-telemetry">
        <span class="z8-tel-chip">CONTRAN 996 // Gaiola &amp; Baú</span>
        <span class="z8-tel-profit">+35,9% Markup</span>
      </div>
      <div class="z8-helmet-hover-hud">
        <div class="z8-hud-row"><span>ATACADO B2B</span><strong>R$ 7.800</strong></div>
        <div class="z8-hud-row"><span>VAREJO SUG.</span><strong>R$ 10.600</strong></div>
        <div class="z8-hud-row is-lime"><span>MARKUP COMERCIAL</span><strong>+35,9% (Margem 26,4%)</strong></div>
        <div class="z8-hud-cta">INSPECIONAR FICHA &amp; CORES ↱</div>
      </div>
    </div>
    <div class="helmet-grid-item-text-w">
      <h3 class="text-title-small-label text">Z8 FX-12</h3>
      <div class="helmet-grid-item-date-w">
        <div class="text-title-small-label date">+35,9%</div>
      </div>
      <div class="helmet-grid-extender">
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41c00f127bc68e2462635_ln4-2-helm-mask-extender-grey-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img"/>
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41235ad69136bdc861b67_ln4-2-helm-mask-extender-lime-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img is-overlay"/>
      </div>
    </div>
  </div>
</div>
"""

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read().replace('\r\n', '\n')

    # Inject Tank 2 after Tank if not present
    if 'z8-tank-2' not in c:
        tank_end = c.find('alt="Z8 Tank"')
        if tank_end != -1:
            # find end of tank card
            card_end = c.find('<!-- Tank Card End -->', tank_end)
            if card_end == -1:
                # find closing div of helmet-grid-item-w
                idx = c.find('class="text-title-small-label text">Z8 Tank</h3>', tank_end)
                if idx != -1:
                    close_idx = c.find('</div>\n</div>\n</div>', idx)
                    if close_idx != -1:
                        insertion_point = close_idx + len('</div>\n</div>\n</div>')
                        c = c[:insertion_point] + "\n" + TANK2_CARD + c[insertion_point:]
                        print(f"[{filepath}] Injected Tank 2 card!")

    # Inject FX-12 after FX-10 if not present
    if 'z8-fx12' not in c:
        fx10_end = c.find('alt="Z8 FX-10"')
        if fx10_end != -1:
            idx = c.find('class="text-title-small-label text">Z8 FX-10</h3>', fx10_end)
            if idx != -1:
                close_idx = c.find('</div>\n</div>\n</div>', idx)
                if close_idx != -1:
                    insertion_point = close_idx + len('</div>\n</div>\n</div>')
                    c = c[:insertion_point] + "\n" + FX12_CARD + c[insertion_point:]
                    print(f"[{filepath}] Injected FX-12 card!")

    # Now update prices for all models
    for m_id, p in MODEL_PRICES.items():
        pattern = re.compile(
            rf'(openZ8ModelDrawer\([\'"]{m_id}[\'"]\).*?<div class="z8-helmet-hover-hud">)(.*?)(<div class="z8-hud-cta">)',
            re.DOTALL
        )
        def repl(m):
            return m.group(1) + f"""
        <div class="z8-hud-row"><span>ATACADO B2B</span><strong>R$ {p['wholesale']}</strong></div>
        <div class="z8-hud-row"><span>VAREJO SUG.</span><strong>R$ {p['retail']}</strong></div>
        <div class="z8-hud-row is-lime"><span>MARKUP COMERCIAL</span><strong>+{p['markup']} (Margem {p['margin']})</strong></div>
        """ + m.group(3)
        c, cnt = pattern.subn(repl, c)
        if cnt > 0:
            print(f"[{filepath}] Set public price for {m_id}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

if __name__ == '__main__':
    process_file('conceito/index.html')
    process_file('conceito-2/index.html')
