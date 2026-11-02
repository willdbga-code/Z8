import re, os

MODEL_PRICES = {
    'z8-tank': {'wholesale': '7.500', 'retail': '11.500', 'markup': '53,3%', 'margin': '34,8%'},
    'z8-tank-2': {'wholesale': '8.500', 'retail': '12.500', 'markup': '47,1%', 'margin': '32,0%'},
    'z8-fx10': {'wholesale': '6.700', 'retail': '9.000', 'markup': '34,3%', 'margin': '25,6%'},
    'z8-fx12': {'wholesale': '7.800', 'retail': '10.600', 'markup': '35,9%', 'margin': '26,4%'},
    'z8-harley-x12': {'wholesale': '6.500', 'retail': '10.000', 'markup': '53,8%', 'margin': '35,0%'},
    'z8-u2-delivery': {'wholesale': '6.000', 'retail': '9.500', 'markup': '58,3%', 'margin': '36,8%'},
    'z8-n95c': {'wholesale': '6.500', 'retail': '10.000', 'markup': '53,8%', 'margin': '35,0%'},
    'z8-h26': {'wholesale': '5.500', 'retail': '9.500', 'markup': '72,7%', 'margin': '42,1%'},
    'z8-q11': {'wholesale': '5.200', 'retail': '9.300', 'markup': '78,8%', 'margin': '44,1%'},
    'z8-n710': {'wholesale': '5.300', 'retail': '9.500', 'markup': '79,2%', 'margin': '44,2%'},
    'z8-q10': {'wholesale': '5.800', 'retail': '9.800', 'markup': '69,0%', 'margin': '40,8%'},
    'z8-gs005': {'wholesale': '3.200', 'retail': '6.200', 'markup': '93,8%', 'margin': '48,4%'},
    'z8-diamond': {'wholesale': '3.400', 'retail': '6.800', 'markup': '100,0%', 'margin': '50,0%'},
}

def update_html_cards(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (not found)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read().replace('\r\n', '\n')

    # Update modal close and lgpd lock emojis
    content = content.replace(
        '<button type="button" class="z8-modal-close" onclick="window.closeLeadModal && window.closeLeadModal()">✕</button>',
        '<button type="button" class="z8-modal-close" onclick="window.closeLeadModal && window.closeLeadModal()"><i class="fa-solid fa-xmark"></i></button>'
    )
    content = content.replace(
        '<span>🔒 Dados protegidos pela LGPD',
        '<span><i class="fa-solid fa-shield-halved" style="margin-right:4px;"></i> Dados protegidos pela LGPD'
    )
    content = content.replace('Frota 11 Motos', 'Frota 13 Motos')
    content = content.replace('Fichas das 11 Motos', 'Fichas das 13 Motos')

    # Replace each model card's hover hud
    # Pattern to match: onclick="...openZ8ModelDrawer\('([^']+)'\)" ... <div class="z8-helmet-hover-hud">...</div>
    for model_id, p in MODEL_PRICES.items():
        # Find card block for this model
        pattern = re.compile(
            rf'(openZ8ModelDrawer\([\'"]{model_id}[\'"]\).*?<div class="z8-helmet-hover-hud">)(.*?)(<div class="z8-hud-cta">)',
            re.DOTALL
        )
        def repl_hud(m):
            prefix = m.group(1)
            suffix = m.group(3)
            new_hud = f"""
        <div class="z8-hud-row"><span>ATACADO B2B</span><strong>R$ {p['wholesale']}</strong></div>
        <div class="z8-hud-row"><span>VAREJO SUG.</span><strong>R$ {p['retail']}</strong></div>
        <div class="z8-hud-row is-lime"><span>MARKUP COMERCIAL</span><strong>+{p['markup']} (Margem {p['margin']})</strong></div>
        """
            return prefix + new_hud + suffix

        content, count = pattern.subn(repl_hud, content)
        if count > 0:
            print(f"[{filepath}] Updated HUD for {model_id}")
        else:
            print(f"[{filepath}] Warning: Could not match HUD for {model_id}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath}!")

def update_conceito_app():
    filepath = 'conceito/app.js'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read().replace('\r\n', '\n')

    # Replace drawer modal KPIs
    old_kpis = """          <div class="z8-drawer-kpi is-confidential">
            <span>CUSTO ATACADO B2B</span>
            <strong>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Sob Consulta
            </strong>
          </div>
          <div class="z8-drawer-kpi is-confidential">
            <span>PREÇO VAREJO SUG.</span>
            <strong>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Sob Consulta
            </strong>
          </div>"""

    new_kpis = """          <div class="z8-drawer-kpi">
            <span>CUSTO ATACADO B2B</span>
            <strong style="color:#00F0FF;">R$ ${(model.wholesale || model.wholesalePrice || 0).toLocaleString('pt-BR')}</strong>
          </div>
          <div class="z8-drawer-kpi">
            <span>PREÇO VAREJO SUG.</span>
            <strong>R$ ${(model.retail || model.retailPrice || 0).toLocaleString('pt-BR')}</strong>
          </div>"""

    if old_kpis in code:
        code = code.replace(old_kpis, new_kpis)
        print("Updated drawer KPIs in conceito/app.js")
    else:
        print("Warning: old_kpis not matched in conceito/app.js")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

def update_conceito_2_app():
    filepath = 'conceito-2/app.js'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read().replace('\r\n', '\n')

    # In syncAuthState: always display real wholesale and retail prices
    old_sync_hud = """    if (hudRows && hudRows.length >= 3) {
      if (approved) {
        hudRows[0].innerHTML = `<span>ATACADO B2B</span><strong>${fmtBRL(model.wholesale)}</strong>`;
        hudRows[1].innerHTML = `<span>VAREJO SUG.</span><strong>${fmtBRL(model.retail)}</strong>`;
        hudRows[2].innerHTML = `<span>LUCRO LÍQUIDO</span><strong>+${fmtBRL(model.profit)} (${model.tag})</strong>`;
      } else {
        hudRows[0].innerHTML = `<span>ATACADO B2B</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong>`;
        hudRows[1].innerHTML = `<span>VAREJO SUG.</span><strong class="is-confidential"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sob Consulta</strong>`;
        hudRows[2].innerHTML = `<span>MARKUP COMERCIAL</span><strong>${model.tag} (Margem ${model.marginPct}%)</strong>`;
      }
    }"""

    new_sync_hud = """    if (hudRows && hudRows.length >= 3) {
      hudRows[0].innerHTML = `<span>ATACADO B2B</span><strong>${fmtBRL(model.wholesale)}</strong>`;
      hudRows[1].innerHTML = `<span>VAREJO SUG.</span><strong>${fmtBRL(model.retail)}</strong>`;
      hudRows[2].innerHTML = `<span>LUCRO LÍQUIDO</span><strong>+${fmtBRL(model.profit)} (${model.tag})</strong>`;
    }"""

    if old_sync_hud in code:
        code = code.replace(old_sync_hud, new_sync_hud)
        print("Updated syncAuthState hudRows in conceito-2/app.js")
    else:
        print("Warning: old_sync_hud not matched in conceito-2/app.js")

    # In openZ8ModelDrawer: always show real wholesale and retail prices
    old_drawer_kpis = """    kpisHtml = `
      <div class="z8-drawer-kpi is-confidential">
        <span>CUSTO ATACADO B2B</span>
        <strong>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Sob Consulta
        </strong>
      </div>
      <div class="z8-drawer-kpi is-confidential">
        <span>PREÇO VAREJO SUG.</span>
        <strong>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Sob Consulta
        </strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARGEM LÍQUIDA ESTIMADA</span>
        <strong>${model.marginPct}%</strong>
      </div>
      <div class="z8-drawer-kpi is-lime">
        <span>MARKUP COMERCIAL</span>
        <strong>${model.tag}</strong>
      </div>
    `;"""

    new_drawer_kpis = """    kpisHtml = `
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
    `;"""

    if old_drawer_kpis in code:
        code = code.replace(old_drawer_kpis, new_drawer_kpis)
        print("Updated openZ8ModelDrawer KPIs in conceito-2/app.js")
    else:
        print("Warning: old_drawer_kpis not matched in conceito-2/app.js")

    # In updateComparison: always show real wholesale and profit
    old_comp = """  if (approved) {
    fillCell('comp-wholesale-a', `<strong>${fmtBRL(modelA.wholesale)}</strong>`);
    fillCell('comp-wholesale-b', `<strong>${fmtBRL(modelB.wholesale)}</strong>`);
    fillCell('comp-profit-a', `<strong style="color:#00F0FF;">+${fmtBRL(modelA.profit)} (${modelA.tag})</strong>`);
    fillCell('comp-profit-b', `<strong style="color:#00F0FF;">+${fmtBRL(modelB.profit)} (${modelB.tag})</strong>`);
  } else {
    fillCell('comp-wholesale-a', `<span style="color:#F59E0B;"><i class="fa-solid fa-lock"></i> Sob Consulta</span>`);
    fillCell('comp-wholesale-b', `<span style="color:#F59E0B;"><i class="fa-solid fa-lock"></i> Sob Consulta</span>`);
    fillCell('comp-profit-a', `<strong style="color:#00F0FF;">${modelA.tag} Markup</strong>`);
    fillCell('comp-profit-b', `<strong style="color:#00F0FF;">${modelB.tag} Markup</strong>`);
  }"""

    new_comp = """  fillCell('comp-wholesale-a', `<strong>${fmtBRL(modelA.wholesale)}</strong>`);
  fillCell('comp-wholesale-b', `<strong>${fmtBRL(modelB.wholesale)}</strong>`);
  fillCell('comp-profit-a', `<strong style="color:#00F0FF;">+${fmtBRL(modelA.profit)} (${modelA.tag})</strong>`);
  fillCell('comp-profit-b', `<strong style="color:#00F0FF;">+${fmtBRL(modelB.profit)} (${modelB.tag})</strong>`);"""

    if old_comp in code:
        code = code.replace(old_comp, new_comp)
        print("Updated updateComparison in conceito-2/app.js")
    else:
        print("Warning: old_comp not matched in conceito-2/app.js")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

if __name__ == '__main__':
    update_html_cards('conceito/index.html')
    update_html_cards('conceito-2/index.html')
    update_conceito_app()
    update_conceito_2_app()
