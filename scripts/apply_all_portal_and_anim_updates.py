import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update site-principal/portal-lojista-laf.js
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    laf_js = f.read()

target = '<div id="laf-selected-items-grid" class="z8-laf-selected-items-grid"></div>'
if target in laf_js and 'z8-laf-orderdesk-block' not in laf_js:
    table_block = """<div id="laf-selected-items-grid" class="z8-laf-selected-items-grid"></div>

            <!-- ==================== SELEÇÃO DE MODELOS & QUANTIDADES (MESA DE ATACADO MATRIZ SJC) ==================== -->
            <div class="z8-laf-orderdesk-block" style="margin: 1.5rem 0; border-top: 1px solid rgba(0, 240, 255, 0.18); padding-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <span style="font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">MONTAGEM DE PEDIDO DE LOTE // MATRIZ SÃO JOSÉ DOS CAMPOS</span>
                  <h4 style="font-size: 1.25rem; font-weight: 900; color: #F4F5F7; margin: 0.2rem 0 0 0; text-transform: uppercase;">SELEÇÃO DE MODELOS &amp; QUANTIDADES</h4>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 0.82rem; color: rgba(244,244,237,0.7);">Lote Mínimo: <strong>10 motos</strong></span>
                  <span id="orderdesk-total-bikes-badge" style="background: rgba(0, 240, 255, 0.15); color: #00F0FF; border: 1px solid rgba(0, 240, 255, 0.5); padding: 0.35rem 0.75rem; border-radius: 4px; font-weight: 800; font-size: 0.82rem;">0 / 10 Motos</span>
                </div>
              </div>

              <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table class="z8-orderdesk-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
                  <thead>
                    <tr style="background: rgba(0, 240, 255, 0.08); border-bottom: 1px solid rgba(0, 240, 255, 0.25);">
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">MODELO</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">PREÇO ATACADO</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">VAREJO SUG.</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">LUCRO / UN</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800; text-align: center;">QUANTIDADE</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800; text-align: right;">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody id="orderdesk-table-body">
                    ${LAF_MODELS.map((m) => {
                      const canonical = normalizeModelId(m.id);
                      const qty = lafOrderState.quantities[canonical] || 0;
                      const subtotal = m.wholesale * qty;
                      return `
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                          <td style="padding: 0.85rem 1rem;">
                            <strong style="color: #F4F5F7; display: block;">${m.fullName}</strong>
                            <span style="font-size: 0.72rem; color: rgba(244,244,237,0.6);">${m.category} // ${m.pn}</span>
                          </td>
                          <td style="padding: 0.85rem 1rem; color: #00F0FF; font-weight: 700;">${fmtBRL(m.wholesale)}</td>
                          <td style="padding: 0.85rem 1rem; color: rgba(244,244,237,0.8);">${fmtBRL(m.retail)}</td>
                          <td style="padding: 0.85rem 1rem; color: #10B981; font-weight: 700;">+${fmtBRL(m.profit)}</td>
                          <td style="padding: 0.85rem 1rem; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #06080D; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 2px;">
                              <button type="button" onclick="window.adjustLafQty('${canonical}', -1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;" aria-label="Diminuir ${m.shortTitle}">-</button>
                              <input type="number" min="0" max="500" value="${qty}" id="order-qty-${canonical}" onchange="window.setLafQty('${canonical}', this.value)" style="width: 44px; text-align: center; background: none; border: none; color: #FFF; font-weight: 800; font-size: 0.85rem;" aria-label="Quantidade ${m.shortTitle}"/>
                              <button type="button" onclick="window.adjustLafQty('${canonical}', 1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;" aria-label="Aumentar ${m.shortTitle}">+</button>
                            </div>
                          </td>
                          <td id="order-subtotal-${canonical}" style="padding: 0.85rem 1rem; text-align: right; color: #F4F5F7; font-weight: 800;">${fmtBRL(subtotal)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>"""
    laf_js = laf_js.replace(target, table_block)
    with open('site-principal/portal-lojista-laf.js', 'w', encoding='utf-8') as f:
        f.write(laf_js)
    print("✓ Added interactive table to site-principal/portal-lojista-laf.js")
else:
    print("• Interactive table already present or target not found in portal-lojista-laf.js")

# 2. Add table styles to portal-lojista-laf.css
table_css = """
/* === Z8 ORDER DESK TABLE STYLES (MESA DE ATACADO) === */
.z8-orderdesk-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Mona Sans Variable', sans-serif;
  font-size: 0.84rem;
  text-align: left;
}
.z8-orderdesk-table th {
  background: rgba(0, 240, 255, 0.08);
  color: var(--color--lime, #00F0FF);
  padding: 0.75rem 1rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  white-space: nowrap;
}
.z8-orderdesk-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(244, 244, 237, 0.08);
  color: #F4F5F7;
  white-space: nowrap;
}
.z8-orderdesk-table tr:hover td {
  background: rgba(0, 240, 255, 0.04);
}
"""

for css_file in ['site-principal/portal-lojista-laf.css', 'conceito-2/portal-lojista-laf.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    if '.z8-orderdesk-table' not in content:
        with open(css_file, 'a', encoding='utf-8') as f:
            f.write(table_css)
        print(f"✓ Added table CSS to {css_file}")
    else:
        print(f"• Table CSS already in {css_file}")

# 3. Swap Q10 / Q11 in conceito/index.html and conceito-2/index.html
for html_file in ['conceito/index.html', 'conceito-2/index.html']:
    with open(html_file, 'r', encoding='utf-8') as f:
        h = f.read()

    # In z8-q11 block, replace q10 with q11
    # First find z8-q11 block
    idx_q11 = h.find('data-model-id="z8-q11"')
    idx_q10 = h.find('data-model-id="z8-q10"')

    # Let's do precise regex replacement
    # z8-q11 has q10_hover.jpg -> change to q11_hover.jpg, q10_cutout.png -> q11_cutout.png
    # z8-q10 has q11_hover.jpg -> change to q10_hover.jpg, q11_cutout.png -> q10_cutout.png
    
    # We can do this cleanly by slicing the blocks
    if idx_q11 != -1 and idx_q10 != -1:
        # Determine order
        first_idx = min(idx_q11, idx_q10)
        second_idx = max(idx_q11, idx_q10)
        
        # Let's replace within z8-q11 block
        q11_end = h.find('data-model-id="', idx_q11 + 20)
        q11_slice = h[idx_q11:q11_end]
        q11_fixed = q11_slice.replace('z8_q10_hover.jpg', 'z8_q11_hover.jpg').replace('z8_q10_cutout.png', 'z8_q11_cutout.png')
        h = h[:idx_q11] + q11_fixed + h[q11_end:]
        
        # Recalculate idx_q10
        idx_q10 = h.find('data-model-id="z8-q10"')
        q10_end = h.find('data-model-id="', idx_q10 + 20)
        if q10_end == -1:
            q10_end = h.find('</section>', idx_q10)
        q10_slice = h[idx_q10:q10_end]
        q10_fixed = q10_slice.replace('z8_q11_hover.jpg', 'z8_q10_hover.jpg').replace('z8_q11_cutout.png', 'z8_q10_cutout.png')
        h = h[:idx_q10] + q10_fixed + h[q10_end:]

        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(h)
        print(f"✓ Fixed Q10/Q11 asset mapping in {html_file}")
