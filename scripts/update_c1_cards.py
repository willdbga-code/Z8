import re

MODELS_CONFIG = [
    {
        "id": "z8-tank",
        "name": "Z8 Tank High-Speed",
        "shortTitle": "Z8 Tank",
        "chip": "CNH A // Emplacável",
        "tag": "+53,3%",
        "margin": "34,8%",
        "cutout": "/assets/models/cutouts/z8_tank_cutout.png",
        "hover": "/assets/models/hover/z8_tank_hover.jpg"
    },
    {
        "id": "z8-tank-2",
        "name": "Z8 Tank 2 Expedition",
        "shortTitle": "Tank 2 Expid",
        "chip": "CNH A // Trail Expedition",
        "tag": "+47,1%",
        "margin": "32,0%",
        "cutout": "/assets/models/cutouts/z8_tank2_cutout.png",
        "hover": "/assets/models/hover/z8_tank2_hover.jpg"
    },
    {
        "id": "z8-fx10",
        "name": "Z8 FX-10 Sport",
        "shortTitle": "FX-10 Sport",
        "chip": "Autopropelido // Urbano",
        "tag": "+34,3%",
        "margin": "25,6%",
        "cutout": "/assets/models/cutouts/z8_fx10_cutout.png",
        "hover": "/assets/models/hover/z8_fx10_hover.jpg"
    },
    {
        "id": "z8-fx12",
        "name": "Z8 FX-12 Sport",
        "shortTitle": "FX-12 Touring",
        "chip": "CNH A // Sport Touring",
        "tag": "+35,9%",
        "margin": "26,4%",
        "cutout": "/assets/models/cutouts/z8_fx12_cutout.png",
        "hover": "/assets/models/hover/z8_fx12_hover.jpg"
    },
    {
        "id": "z8-harley",
        "name": "Z8 Harley X12 Custom",
        "shortTitle": "Harley X12",
        "chip": "Isento CNH // CONTRAN 996",
        "tag": "+53,8%",
        "margin": "35,0%",
        "cutout": "/assets/models/cutouts/z8_harley_cutout.png",
        "hover": "/assets/models/hover/z8_harley_hover.jpg"
    },
    {
        "id": "z8-u2",
        "name": "Z8 U2 Delivery Cargo",
        "shortTitle": "U2 Cargo",
        "chip": "Frota Logística // B2B",
        "tag": "+58,3%",
        "margin": "36,8%",
        "cutout": "/assets/models/cutouts/z8_u2_cutout.png",
        "hover": "/assets/models/hover/z8_u2_hover.jpg"
    },
    {
        "id": "z8-n95c",
        "name": "Z8 N95C Max Comfort",
        "shortTitle": "N95C Exec",
        "chip": "CONTRAN 996 // Executiva",
        "tag": "+53,8%",
        "margin": "35,0%",
        "cutout": "/assets/models/cutouts/z8_n95c_cutout.png",
        "hover": "/assets/models/hover/z8_n95c_hover.jpg"
    },
    {
        "id": "z8-n7",
        "name": "Z8 H26 Standard",
        "shortTitle": "H26 Standard",
        "chip": "100% Isento CNH // 996",
        "tag": "+72,7%",
        "margin": "42,1%",
        "cutout": "/assets/models/cutouts/z8_n7_cutout.png",
        "hover": "/assets/models/hover/z8_n7_hover.jpg"
    },
    {
        "id": "z8-q11",
        "name": "Z8 Q11 Compact",
        "shortTitle": "Q11 Pastel",
        "chip": "100% Isento CNH // 996",
        "tag": "+78,8%",
        "margin": "44,1%",
        "cutout": "/assets/models/cutouts/z8_q10_cutout.png",
        "hover": "/assets/models/hover/z8_q10_hover.jpg"
    },
    {
        "id": "z8-n710",
        "name": "Z8 N710 Urban Plus",
        "shortTitle": "N710 Urban",
        "chip": "100% Isento CNH // 996",
        "tag": "+79,2%",
        "margin": "44,2%",
        "cutout": "/assets/models/cutouts/z8_n710_cutout.png",
        "hover": "/assets/models/hover/z8_n710_hover.jpg"
    },
    {
        "id": "z8-q10",
        "name": "Z8 Q10 Vintage",
        "shortTitle": "Q10 Retro",
        "chip": "100% Isento CNH // 996",
        "tag": "+69,0%",
        "margin": "40,8%",
        "cutout": "/assets/models/cutouts/z8_q11_cutout.png",
        "hover": "/assets/models/hover/z8_q11_hover.jpg"
    },
    {
        "id": "z8-gs005",
        "name": "Z8 GS-005 Base Norte",
        "shortTitle": "GS-005 Utility",
        "chip": "100% Isento CNH // 996",
        "tag": "+93,8%",
        "margin": "48,4%",
        "cutout": "/assets/models/cutouts/z8_gs005_cutout.png",
        "hover": "/assets/models/hover/z8_gs005_hover.jpg"
    },
    {
        "id": "z8-diamond",
        "name": "Z8 Diamond Luxe",
        "shortTitle": "Diamond Luxe",
        "chip": "100% Isento CNH // 996",
        "tag": "+100,0%",
        "margin": "50,0%",
        "cutout": "/assets/models/cutouts/z8_diamond_cutout.png",
        "hover": "/assets/models/hover/z8_diamond_hover.jpg"
    }
]

def render_card(m, idx):
    return f"""<div role="listitem" class="helmet-grid-item-w w-dyn-item" data-model-index="{idx}" onclick="window.openZ8ModelDrawer && window.openZ8ModelDrawer('{m['id']}')">
  <div class="helmet-grid-item-w" data-model-id="{m['id']}">
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
        <!-- 1. Background Atmosphere Image (Behind Cutout) -->
        <img src="{m['hover']}" loading="lazy" alt="{m['name']} Backdrop" class="helmet-grid-item-reveal-img z8-card-fit-cover"/>
        <!-- 2. Transparent Motorcycle Cutout (In Front) -->
        <div class="helmet-grid-item-img-helmet-w">
          <img src="{m['cutout']}" loading="lazy" alt="{m['name']}" class="helmet-grid-item-img-helmet z8-card-fit"/>
        </div>
      </div>
      <div class="z8-helmet-top-telemetry">
        <span class="z8-tel-chip">{m['chip']}</span>
        <span class="z8-tel-profit">{m['tag']} Markup</span>
      </div>
      <div class="z8-helmet-hover-hud">
        <div class="z8-hud-row"><span>ATACADO B2B</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong></div>
        <div class="z8-hud-row"><span>VAREJO SUG.</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong></div>
        <div class="z8-hud-row is-lime"><span>MARKUP COMERCIAL</span><strong>{m['tag']} (Margem {m['margin']})</strong></div>
        <div class="z8-hud-cta">INSPECIONAR FICHA &amp; CORES ↱</div>
      </div>
    </div>
    <div class="helmet-grid-item-text-w">
      <h3 class="text-title-small-label text">{m['shortTitle']}</h3>
      <div class="helmet-grid-item-date-w">
        <div class="text-title-small-label date">{m['tag']}</div>
      </div>
      <div class="helmet-grid-extender">
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41c00f127bc68e2462635_ln4-2-helm-mask-extender-grey-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img"/>
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41235ad69136bdc861b67_ln4-2-helm-mask-extender-lime-fade.png" loading="lazy" alt="" class="helmet-grid-extender-img is-overlay"/>
      </div>
    </div>
  </div>
</div>"""

cards_html = "\n".join([render_card(m, i) for i, m in enumerate(MODELS_CONFIG)])

with open('conceito/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Target grid inner
grid_start = html.find('<div data-helmet-grid="" role="list" class="helmet-grid w-dyn-items">')
if grid_start == -1:
    print("Could not find data-helmet-grid in index.html")
    exit(1)

content_start = grid_start + len('<div data-helmet-grid="" role="list" class="helmet-grid w-dyn-items">')

# Find the closing </div> of the grid
# In the original file, it ended before </div>\n              </div>\n            </div>\n          </section>
grid_end = html.find('</div>\n              </div>\n            </div>\n          </section>', content_start)
if grid_end == -1:
    grid_end = html.find('<!-- ==================== SECTION 8:', content_start)

print("Found grid start:", grid_start, "grid end:", grid_end)

new_html = html[:content_start] + "\n" + cards_html + "\n" + html[grid_end:]

# Update the simulator select dropdown options too!
sim_options_start = new_html.find('id="z8-sim-model"')
if sim_options_start != -1:
    opt_open = new_html.find('>', sim_options_start) + 1
    opt_close = new_html.find('</select>', opt_open)
    new_options = """
                        <option value="3500" data-retail="9800" data-wholesale="6300">Mix Balanceado Z8 (Markup Médio +55,5%)</option>
                        <option value="4000" data-retail="11500" data-wholesale="7500">Z8 Tank High-Speed (Markup +53,3%)</option>
                        <option value="4000" data-retail="12500" data-wholesale="8500">Z8 Tank 2 Expedition (Markup +47,1%)</option>
                        <option value="2300" data-retail="9000" data-wholesale="6700">Z8 FX-10 Sport (Markup +34,3%)</option>
                        <option value="2800" data-retail="10600" data-wholesale="7800">Z8 FX-12 Sport (Markup +35,9%)</option>
                        <option value="3500" data-retail="10000" data-wholesale="6500">Z8 Harley X12 Custom (Markup +53,8%)</option>
                        <option value="3500" data-retail="9500" data-wholesale="6000">Z8 U2 Delivery Cargo (Markup +58,3%)</option>
                        <option value="3500" data-retail="10000" data-wholesale="6500">Z8 N95C Max Comfort (Markup +53,8%)</option>
                        <option value="4000" data-retail="9500" data-wholesale="5500">Z8 H26 Standard (Markup +72,7%)</option>
                        <option value="4100" data-retail="9300" data-wholesale="5200">Z8 Q11 Compact (Markup +78,8%)</option>
                        <option value="4200" data-retail="9500" data-wholesale="5300">Z8 N710 Urban Plus (Markup +79,2%)</option>
                        <option value="4000" data-retail="9800" data-wholesale="5800">Z8 Q10 Vintage (Markup +69,0%)</option>
                        <option value="3000" data-retail="6200" data-wholesale="3200">Z8 GS-005 Base Norte (Markup +93,8%)</option>
                        <option value="3400" data-retail="6800" data-wholesale="3400">Z8 Diamond Luxe (Markup +100,0%)</option>
                      """
    new_html = new_html[:opt_open] + new_options + new_html[opt_close:]

with open('conceito/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Updated conceito/index.html with all 13 cards and simulator options!")
