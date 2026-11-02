# Script to implement the OS footer and clean up post-checkout sections

def update_portal_lojista_laf():
    path = 'site-principal/portal-lojista-laf.js'
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Update module tabs in top bar
    old_tabs = """            <button type="button" class="z8-laf-mod-tab" data-mod="pedidos" onclick="window.switchLafPortalModule('pedidos')">
              <span class="mod-idx">03</span>
              <span>FAZER PEDIDO DE LOTE / 40HQ (PÁG 24)</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="catalogo" onclick="window.switchLafPortalModule('catalogo')">
              <span class="mod-idx">04</span>
              <span>CATÁLOGO 26 PÁGINAS (SLIDES LAF)</span>
            </button>"""

    new_tabs = """            <button type="button" class="z8-laf-mod-tab" data-mod="pedidos" onclick="window.switchLafPortalModule('pedidos')">
              <span class="mod-idx">03</span>
              <span>FECHAMENTO DO PEDIDO (LOTE &amp; 40HQ)</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="os" onclick="window.scrollToOSFooter && window.scrollToOSFooter()">
              <span class="mod-idx">04</span>
              <span>CENTRAL DE OS &amp; PÓS-VENDA ↱</span>
            </button>"""

    if old_tabs in code:
        code = code.replace(old_tabs, new_tabs)
        print("Updated module tabs in portal-lojista-laf.js")

    # 2. Remove BLOCO 04 from linear flow
    block4_start = """        <!-- =====================================================================
             BLOCO 04: VISUALIZADOR INTERATIVO DO CATÁLOGO LAF 26 PÁGINAS (FLIPBOOK)
             ===================================================================== -->
        <div id="laf-block-catalogo" class="z8-laf-module-block">"""
    
    # We find where Block 04 ends: before <!-- MODAL LIGHTBOX
    lightbox_marker = "<!-- MODAL LIGHTBOX PARA INSPEÇÃO DE PRANCHA LAF EM TELA CHEIA -->"

    if block4_start in code and lightbox_marker in code:
        idx_start = code.find(block4_start)
        idx_end = code.find(lightbox_marker)
        # Check what's between them
        between = code[idx_start:idx_end]
        # Keep the closing </div> of container and wrapper:
        # Notice before lightbox there was </div>\n    </div>\n\n    
        replacement = "</div>\n    </div>\n\n    "
        code = code[:idx_start] + replacement + code[idx_end:]
        print("Removed Block 04 from linear layout in portal-lojista-laf.js")

    # 3. Add window.scrollToOSFooter
    if "window.scrollToOSFooter" not in code:
        fn = """window.scrollToOSFooter = function() {
  const el = document.getElementById('rodape-os') || document.getElementById('pos-venda');
  if (el) {
    if (window.lenis) {
      window.lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
"""
        code = code + "\n" + fn
        print("Added window.scrollToOSFooter to portal-lojista-laf.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)

update_portal_lojista_laf()
