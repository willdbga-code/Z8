import os
import re

def build():
    with open('conceito/index.html', 'r', encoding='utf-8') as f:
        c1 = f.read()

    print("Initial length of conceito/index.html:", len(c1))

    # 1. Update Title and Meta
    c1 = c1.replace(
        '<title>Z8 E-Motion — Concessão Oficial &amp; Distribuição Direct-Factory</title>',
        '<title>Z8 E-Motion 2 — Concessão Oficial, Atacado B2B &amp; Portal do Concessionário</title>'
    )
    c1 = c1.replace(
        'window.location.replace(\'http://localhost:3004/conceito/\'',
        'window.location.replace(\'http://localhost:3000/conceito-2/\''
    )

    # 2. Header Buttons: Replace btns block via index slicing
    idx_btns_start = c1.find('<div data-nav-group="btns"')
    idx_page_pos = c1.find('<div class="page-ln4-pos">')
    assert idx_btns_start != -1 and idx_page_pos != -1, "Header buttons landmarks not found!"

    header_btns_replacement = """<div data-nav-group="btns" class="btn-layout is-nav">
        <!-- Pre-login: Lead CTA -->
        <a data-theme="lime" data-anim="text-hover" href="#candidatar" data-taxi-ignore="true" id="btn-header-franquia" onclick="event.preventDefault(); window.openLeadModal && window.openLeadModal('Navbar Store CTA');" class="btn-w is-nav w-inline-block">
          <div class="btn-inner">
            <div class="btn-icon-w">
              <div class="btn-icon-svg is-large w-embed">
                <svg width="100%" height="100%" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m10.931 5.783-.759.812c-1.132 1.212-2.89 1.212-4.022 0l-.76-.812C4.313 4.637 2.568 5.29 2.275 6.928l-1.238 7.18c-.227 1.318.652 2.543 1.838 2.543h10.588c1.185 0 2.064-1.225 1.838-2.544l-1.239-7.179c-.28-1.638-2.037-2.29-3.116-1.145h-.014ZM10.839 3.048 9.84 1.849C8.894.717 7.43.717 6.484 1.85l-1 1.199" stroke="currentColor" stroke-width="1.949" stroke-miterlimit="10"/>
                </svg>
              </div>
            </div>
            <div class="btn-inner-text-w is-nav">
              <div split-text="chars" class="btn-text is-nav is-sm">Franquia</div>
            </div>
          </div>
        </a>

        <!-- Post-login: Partner Badge -->
        <div class="z8-partner-badge" id="header-partner-badge" style="display: none;">
          <span class="badge-dot"></span>
          <span id="header-partner-name">Carregando...</span>
        </div>

        <!-- Auth Buttons Right -->
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          <!-- Pre-login: Login Trigger -->
          <button type="button" class="btn-w is-nav is-auth-trigger" id="btn-header-login" onclick="window.openZ8AuthModal && window.openZ8AuthModal('login')">
            <div class="btn-inner">
              <div class="btn-inner-text-w is-nav">
                <div class="btn-text is-nav is-sm"><i class="fa-solid fa-key" style="margin-right: 4px;"></i>Entrar</div>
              </div>
            </div>
          </button>

          <!-- Master Admin Button (Christian) -->
          <button type="button" class="btn-w is-nav is-admin-trigger" id="btn-header-admin" style="display: none;" onclick="window.openAdminModal && window.openAdminModal()">
            <div class="btn-inner">
              <div class="btn-inner-text-w is-nav">
                <div class="btn-text is-nav is-sm"><i class="fa-solid fa-crown" style="margin-right: 4px;"></i>Admin</div>
              </div>
            </div>
          </button>

          <!-- Post-login: Logout Trigger -->
          <button type="button" class="btn-w is-nav is-logout-trigger" id="btn-header-logout" style="display: none;" onclick="window.handleLogout && window.handleLogout()">
            <div class="btn-inner">
              <div class="btn-inner-text-w is-nav">
                <div class="btn-text is-nav is-sm"><i class="fa-solid fa-right-from-bracket" style="margin-right: 4px;"></i>Sair</div>
              </div>
            </div>
          </button>
        </div>

        <button data-nav-ham="" tabindex="0" title="Abrir / Fechar Menu" class="nav-ham">
          <div class="nav-rive-w w-embed">
            <canvas data-rive-nav-hamburger data-rive-artboard="hamburger" data-rive-state-machine="hamburger" data-rive-fit="contain"></canvas>
          </div>
        </button>
      </div>
      """

    c1 = c1[:idx_btns_start] + header_btns_replacement + c1[idx_page_pos:]

    # 3. Add Pending Approval Notification Banner right after top marker
    top_marker_target = '<div id="top" class="top-marker"></div>'
    pending_banner_html = """<div id="top" class="top-marker"></div>

  <!-- ==================== PENDING APPROVAL BANNER ==================== -->
  <div id="pending-approval-banner" class="z8-pending-banner" style="display: none;">
    <div class="z8-pending-banner-content">
      <i class="fa-solid fa-clock-rotate-left" style="font-size: 1.1rem;"></i>
      <div>
        <strong>CADASTRO EM AUDITORIA:</strong> Olá <span id="pending-user-name">Parceiro</span>, seus dados cadastrais e CNPJ estão em fase de homologação pela Matriz Z8. As margens de atacado B2B serão desbloqueadas assim que a concessão for validada.
      </div>
    </div>
    <a href="https://wa.me/5512998008818?text=Ol%C3%A1%20Christian,%20realizei%20meu%20cadastro%20no%20Portal%20Z8%20e%20gostaria%20de%20agilizar%20a%20aprova%C3%A7%C3%A3o%20da%20minha%20concess%C3%A3o." target="_blank" class="z8-pending-banner-btn">
      <i class="fa-brands fa-whatsapp"></i> Falar com Diretoria
    </a>
  </div>"""

    assert top_marker_target in c1, "top_marker_target not found!"
    c1 = c1.replace(top_marker_target, pending_banner_html, 1)

    # 4. Hero Section: Make Floating Callout KPI reactive (pre-login vs post-login)
    kpi_old_target = """                <!-- Floating Hero Callout Badge (Right side desktop / bottom mobile) -->
                <div class="z8-hero-floating-kpi">
                  <div class="z8-hero-kpi-eyebrow">EXPANSÃO INSTITUCIONAL // 2026</div>
                  <div class="z8-hero-kpi-title">RAIO PROTEGIDO <span>ATÉ 50 KM</span></div>
                  <div class="z8-hero-kpi-metrics">
                    <div><span>MARGEM BRUTA</span><strong>ATÉ 46,8%</strong></div>
                    <div><span>ROYALTIES</span><strong>ISENTO (0%)</strong></div>
                    <div><span>EQUILÍBRIO</span><strong>4 MOTOS/MÊS</strong></div>
                  </div>
                  <button type="button" class="z8-hero-kpi-btn" onclick="window.openLeadModal && window.openLeadModal('Hero Floating KPI')">
                    CONHECER DISPONIBILIDADE NA MINHA REGIÃO ↗
                  </button>
                </div>"""

    # If accented chars differ due to encoding in c1, find by regex
    m_kpi = re.search(r'<!-- Floating Hero Callout Badge.*?<button type="button" class="z8-hero-kpi-btn".*?</button>\s*</div>', c1, re.DOTALL)
    if m_kpi:
        kpi_replacement = """<!-- Floating Hero Callout Badge (Right side desktop / bottom mobile) -->
                <div class="z8-hero-floating-kpi" id="hero-floating-kpi-box">
                  <div class="z8-hero-kpi-eyebrow" id="hero-kpi-eyebrow">EXPANSÃO INSTITUCIONAL // 2026</div>
                  <div class="z8-hero-kpi-title" id="hero-kpi-title">MONOPÓLIO TERRITORIAL: <span>RAIO DE ATÉ 50 KM</span></div>
                  <div class="z8-hero-kpi-metrics">
                    <div><span>LOTE MÍNIMO</span><strong id="hero-kpi-m1">10 MOTOS</strong></div>
                    <div><span>MARGEM MÉDIA</span><strong id="hero-kpi-m2">+R$ 42.000</strong></div>
                    <div><span>EXPEDIÇÃO</span><strong id="hero-kpi-m3">D+2 MATRIZ</strong></div>
                  </div>
                  <button type="button" class="z8-hero-kpi-btn" id="hero-kpi-cta-btn" onclick="document.getElementById('orderdesk')?.scrollIntoView({ behavior: 'smooth' })">
                    MONTAR LOTE DE ATACADO ↱
                  </button>
                </div>"""
        c1 = c1[:m_kpi.start()] + kpi_replacement + c1[m_kpi.end():]

    # 5. Update Hamburger Menu Links to include all new sections
    idx_menu_start = c1.find('<div class="nav-menu-links-list">')
    idx_menu_end = c1.find('<div class="nav-helmet-rive-w">')
    assert idx_menu_start != -1 and idx_menu_end != -1, "Menu links landmarks not found!"

    menu_links_replacement = """<div class="nav-menu-links-list">
                <a data-anim="text-hover" href="#top" data-taxi-ignore="true" aria-current="page" class="nav-menu-link-w w-inline-block w--current" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Início</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="6"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#frota-z8" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Frota 11 Motos</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#orderdesk" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Mesa de Atacado</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#blindagem-comercial" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Blindagem Comercial</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#comparador" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Comparador Técnico</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#pos-venda" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Pós-Venda &amp; OS</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#manuais" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Manuais &amp; Dossiê</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#arquitetura-z8" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Arquitetura</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
                <a data-anim="text-hover" href="#login" data-taxi-ignore="true" id="nav-menu-link-login" class="nav-menu-link-w w-inline-block" onclick="event.preventDefault(); document.querySelector('[data-nav-ham]')?.click(); window.openZ8MenuAuth && window.openZ8MenuAuth();">
                  <div split-text="chars" class="text-nav-link" id="nav-menu-link-login-text">Área do Parceiro</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>
                  </div>
                </a>
              </div>
              """

    c1 = c1[:idx_menu_start] + menu_links_replacement + c1[idx_menu_end:]

    # 6. Inject Card Steppers into each of the 11 models in `#frota-z8`
    model_mapping = {
        'z8-tank': 'z8-tank',
        'z8-n95c': 'z8-n95c',
        'z8-fx10': 'z8-fx10',
        'z8-harley': 'z8-harley-x12',
        'z8-u2': 'z8-u2-delivery',
        'z8-n710': 'z8-n710',
        'z8-q10': 'z8-q10',
        'z8-q11': 'z8-q11',
        'z8-diamond': 'z8-diamond',
        'z8-n7': 'z8-h26',
        'z8-gs005': 'z8-gs005'
    }

    for raw_id, real_id in model_mapping.items():
        # Target the card CTA inside the card
        # <div class="z8-hud-cta">INSPECIONAR FICHA &amp; CORES ↗</div>
        card_marker = f"openZ8ModelDrawer('{raw_id}')"
        idx_card = c1.find(card_marker)
        if idx_card != -1:
            idx_cta = c1.find('<div class="z8-hud-cta">', idx_card)
            if idx_cta != -1:
                idx_cta_end = c1.find('</div>', idx_cta) + len('</div>')
                stepper_html = f"""\n        <div class="z8-hud-order-stepper" onclick="event.stopPropagation()">
          <span class="z8-stepper-label">ADICIONAR AO LOTE:</span>
          <div class="z8-stepper-controls">
            <button type="button" class="z8-card-step-btn" onclick="window.changeOrderQty('{real_id}', -1)" title="Diminuir">-</button>
            <span class="z8-card-step-qty" id="card-qty-{real_id}">0</span>
            <button type="button" class="z8-card-step-btn" onclick="window.changeOrderQty('{real_id}', 1)" title="Aumentar">+</button>
          </div>
        </div>"""
                c1 = c1[:idx_cta_end] + stepper_html + c1[idx_cta_end:]

    # 7. Insert New Sections: Comparador, Order Desk, Blindagem Comercial, Pós-Venda, Manuais
    # Insert right after `#simulador-b2b` section ends!
    sim_idx = c1.find('id="simulador-b2b"')
    assert sim_idx != -1, "id=simulador-b2b not found!"
    sim_end = c1.find('</section>', sim_idx)
    assert sim_end != -1, "Closing section of simulador-b2b not found!"

    insert_pos = sim_end + len('</section>')

    new_sections_html = """

    <!-- ==================== SECTION: MESA DE OPERAÇÕES B2B (ORDER DESK) ==================== -->
    <section id="orderdesk" class="z8-orderdesk-section" style="padding: 5rem 1.5rem; max-width: 1250px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="color: var(--color--lime, #00F0FF); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.5rem;">DISTRIBUIÇÃO DIRECT-FACTORY // FATURAMENTO PJ</div>
        <h2 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">MESA DE OPERAÇÕES &amp; PEDIDO DE LOTE</h2>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 680px; margin: 0 auto; font-size: 0.9rem; line-height: 1.5;">Monte seu lote de atacado direto de fábrica com margens de até 50% para concessionárias homologadas. Lote mínimo de 10 motos com suporte logístico e expedição direta de São José dos Campos.</p>
      </div>

      <!-- Locked Pre-Login Teaser Panel -->
      <div id="orderdesk-locked-teaser" class="z8-orderdesk-teaser-box" style="padding: 4rem 2rem; background: rgba(10, 22, 40, 0.6); border: 1px dashed rgba(0, 240, 255, 0.4); border-radius: 8px; text-align: center;">
        <div style="font-size: 3rem; color: #00F0FF; margin-bottom: 1rem;"><i class="fa-solid fa-lock"></i></div>
        <h3 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: 1.6rem; color: #F4F5F7; margin: 0 0 0.75rem 0;">ACESSO RESTRITO A CONCESSIONÁRIOS CREDENCIADOS</h3>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 580px; margin: 0 auto 1.75rem auto; font-size: 0.88rem; line-height: 1.5;">Para consultar a tabela de faturamento de atacado, configurar o lote de 10 motos e transmitir pedidos diretamente à Matriz Z8, faça login na sua conta homologada.</p>
        <button type="button" class="btn-w is-nav" onclick="window.openZ8AuthModal && window.openZ8AuthModal('login')" style="padding: 0.85rem 2rem; background: #00F0FF; color: #07080B; border: none; font-weight: 800; font-size: 0.85rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-key" style="margin-right: 6px;"></i> ENTRAR OU CADASTRAR CNPJ
        </button>
      </div>

      <!-- Unlocked Post-Login Live Order Desk -->
      <div id="orderdesk-unlocked-card" class="z8-orderdesk-card" style="display: none; background: rgba(10, 22, 40, 0.75); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 8px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <span style="font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase;">MONTAGEM DE PEDIDO DE LOTE // MATRIZ SÃO JOSÉ DOS CAMPOS</span>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: #F4F5F7; margin: 0.25rem 0 0 0;">SELEÇÃO DE MODELOS &amp; QUANTIDADES</h3>
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
            <tbody id="orderdesk-table-body"></tbody>
          </table>
        </div>

        <!-- Order Summary & Checkout Row -->
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; align-items: center;">
          <div style="background: rgba(6, 8, 13, 0.7); padding: 1.25rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.72rem; color: rgba(244,244,237,0.6); text-transform: uppercase;">INVESTIMENTO TOTAL ATACADO</div>
            <strong id="orderdesk-res-total-wholesale" style="font-size: 1.6rem; color: #00F0FF; font-family: var(--font-family--mona, sans-serif); display: block; margin-top: 0.25rem;">R$ 0,00</strong>
          </div>
          <div style="background: rgba(6, 8, 13, 0.7); padding: 1.25rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.72rem; color: rgba(244,244,237,0.6); text-transform: uppercase;">LUCRO BRUTO PROJETADO NA REVENDA</div>
            <strong id="orderdesk-res-total-profit" style="font-size: 1.6rem; color: #10B981; font-family: var(--font-family--mona, sans-serif); display: block; margin-top: 0.25rem;">+ R$ 0,00</strong>
          </div>
          <div>
            <button type="button" id="btn-submit-orderdesk" onclick="window.submitOrderDesk && window.submitOrderDesk()" style="width: 100%; padding: 1.1rem; background: #00F0FF; color: #07080B; border: none; border-radius: 4px; font-weight: 900; font-size: 0.9rem; letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; transition: all 0.2s;">
              <i class="fa-solid fa-paper-plane" style="margin-right: 6px;"></i> TRANSMITIR MINUTA DE PEDIDO À MATRIZ Z8
            </button>
            <span id="orderdesk-moq-alert" style="display: block; text-align: center; font-size: 0.72rem; color: #F59E0B; margin-top: 0.5rem;">Selecione pelo menos 10 motos para liberar a transmissão</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION: BLINDAGEM COMERCIAL Z8 (ATÉ 50 KM) ==================== -->
    <section id="blindagem-comercial" class="z8-blindagem-section" style="padding: 5rem 1.5rem; max-width: 1250px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <div style="color: var(--color--lime, #00F0FF); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 0.5rem;">SEGURANÇA JURÍDICA &amp; ACELERAÇÃO DE GIRO // MATRIZ SJC</div>
        <h2 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">BLINDAGEM COMERCIAL DO CONCESSIONÁRIO</h2>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 720px; margin: 0 auto; font-size: 0.92rem; line-height: 1.55;">Três pilares inegociáveis para assegurar que cada lote faturado na fábrica gere liquidez rápida, margem alta e proteção territorial absoluta para o seu negócio.</p>
      </div>

      <div class="z8-blindagem-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        <!-- Card 1: Monopólio Territorial -->
        <div style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div style="width: 48px; height: 48px; border-radius: 6px; background: rgba(0, 240, 255, 0.12); display: flex; align-items: center; justify-content: center; color: #00F0FF; font-size: 1.4rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <span style="font-size: 0.7rem; color: #00F0FF; font-weight: 800; letter-spacing: 0.08em; background: rgba(0, 240, 255, 0.08); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(0, 240, 255, 0.25);">LEI 13.966 // ART. 784 CPC</span>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">Monopólio Territorial (Raio de ATÉ 50 km)</h3>
            <p style="font-size: 0.85rem; color: rgba(244,244,237,0.7); line-height: 1.5; margin: 0 0 1.25rem 0;">
              Sua concessão possui exclusividade territorial estrita com raio de <strong>ATÉ 50 km</strong>, garantida em Contrato Padrão com força de Título Executivo Judicial. Nenhuma outra concessionária ou representante Z8 poderá comercializar na sua praça.
            </p>
          </div>
          <div style="padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.78rem; color: #10B981; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i> Proteção total contra canibalização de vendas
          </div>
        </div>

        <!-- Card 2: Oficina de 2 Elevadores & Peças 24h -->
        <div style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div style="width: 48px; height: 48px; border-radius: 6px; background: rgba(16, 185, 129, 0.12); display: flex; align-items: center; justify-content: center; color: #10B981; font-size: 1.4rem;">
                <i class="fa-solid fa-wrench"></i>
              </div>
              <span style="font-size: 0.7rem; color: #10B981; font-weight: 800; letter-spacing: 0.08em; background: rgba(16, 185, 129, 0.08); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.25);">2 ELEVADORES // EXPEDIÇÃO 24H</span>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">Oficina Técnica &amp; Reposição Imediata</h3>
            <p style="font-size: 0.85rem; color: rgba(244,244,237,0.7); line-height: 1.5; margin: 0 0 1.25rem 0;">
              Infraestrutura oficial padronizada para 2 elevadores hidráulicos com suprimento garantido de baterias de lítio 72V/60V, módulos FOC e peças de giro com expedição em até 24 horas úteis diretamente da fábrica de São José dos Campos.
            </p>
          </div>
          <div style="padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.78rem; color: #10B981; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i> Estoque fabril e atendimento de garantia por chassi
          </div>
        </div>

        <!-- Card 3: Repasse de Leads da Matriz -->
        <div style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div style="width: 48px; height: 48px; border-radius: 6px; background: rgba(245, 158, 11, 0.12); display: flex; align-items: center; justify-content: center; color: #F59E0B; font-size: 1.4rem;">
                <i class="fa-solid fa-bullhorn"></i>
              </div>
              <span style="font-size: 0.7rem; color: #F59E0B; font-weight: 800; letter-spacing: 0.08em; background: rgba(245, 158, 11, 0.08); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.25);">TRÁFEGO PAGO // CLIENTES LOCAIS</span>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">Giro Acelerado &amp; Repasse de Leads</h3>
            <p style="font-size: 0.85rem; color: rgba(244,244,237,0.7); line-height: 1.5; margin: 0 0 1.25rem 0;">
              Todo cliente final que demonstra interesse em comprar uma moto elétrica na sua cidade através do marketing nacional da Z8 é transferido em tempo real para o WhatsApp da sua concessionária para test-ride e fechamento imediato.
            </p>
          </div>
          <div style="padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.78rem; color: #10B981; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i> Fila de compradores pronta para o seu lote
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION: COMPARADOR TÉCNICO DE MODELOS ==================== -->
    <section id="comparador" class="z8-comparator-section" style="padding: 5rem 1.5rem; max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="color: var(--color--lime, #00F0FF); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.5rem;">ENGENHARIA COMPARATIVA // 11 MODELOS</div>
        <h2 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">COMPARADOR TÉCNICO LADO A LADO</h2>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 680px; margin: 0 auto; font-size: 0.9rem; line-height: 1.5;">Compare motorização, capacidade de bateria, autonomia em teste real, velocidade CONTRAN 996 e viabilidade comercial entre quaisquer dois modelos da frota.</p>
      </div>

      <div class="z8-comparator-selectors" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: rgba(10, 22, 40, 0.6); padding: 1rem 1.25rem; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px;">
          <label style="display: block; font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">SELECIONAR MODELO A</label>
          <select id="comp-select-a" class="z8-input" style="width: 100%; background: #06080D; border: 1px solid rgba(255, 255, 255, 0.12); color: #F4F5F7; padding: 0.75rem; border-radius: 4px; font-weight: 700;"></select>
        </div>
        <div style="background: rgba(10, 22, 40, 0.6); padding: 1rem 1.25rem; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px;">
          <label style="display: block; font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">SELECIONAR MODELO B</label>
          <select id="comp-select-b" class="z8-input" style="width: 100%; background: #06080D; border: 1px solid rgba(255, 255, 255, 0.12); color: #F4F5F7; padding: 0.75rem; border-radius: 4px; font-weight: 700;"></select>
        </div>
      </div>

      <div class="z8-comp-table-wrap" style="overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.25); background: rgba(10, 22, 40, 0.65);">
        <table class="z8-comp-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
          <thead>
            <tr style="background: rgba(0, 240, 255, 0.08); border-bottom: 1px solid rgba(0, 240, 255, 0.25);">
              <th style="padding: 1rem 1.25rem; color: #00F0FF; font-weight: 800; width: 30%;">ESPECIFICAÇÃO</th>
              <th id="comp-name-a" style="padding: 1rem 1.25rem; color: #F4F5F7; font-weight: 800; width: 35%;">MODELO A</th>
              <th id="comp-name-b" style="padding: 1rem 1.25rem; color: #F4F5F7; font-weight: 800; width: 35%;">MODELO B</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 0.85rem 1.25rem; color: rgba(244,244,237,0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">Motorização</td><td id="comp-motor-a" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td><td id="comp-motor-b" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td></tr>
            <tr><td style="padding: 0.85rem 1.25rem; color: rgba(244,244,237,0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">Bateria &amp; Voltagem</td><td id="comp-battery-a" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td><td id="comp-battery-b" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td></tr>
            <tr><td style="padding: 0.85rem 1.25rem; color: rgba(244,244,237,0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">Velocidade Máxima</td><td id="comp-speed-a" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td><td id="comp-speed-b" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td></tr>
            <tr><td style="padding: 0.85rem 1.25rem; color: rgba(244,244,237,0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">Autonomia Real</td><td id="comp-range-a" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td><td id="comp-range-b" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td></tr>
            <tr><td style="padding: 0.85rem 1.25rem; color: rgba(244,244,237,0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">Enquadramento Legal</td><td id="comp-cnh-a" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td><td id="comp-cnh-b" style="padding: 0.85rem 1.25rem; color: #F4F5F7; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.06);">-</td></tr>
            <tr id="comp-wholesale-row" style="background: rgba(0, 240, 255, 0.04);">
              <td style="padding: 0.85rem 1.25rem; color: #00F0FF; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.06);">Preço Atacado B2B</td>
              <td id="comp-wholesale-a" style="padding: 0.85rem 1.25rem; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.06);">Sob Consulta</td>
              <td id="comp-wholesale-b" style="padding: 0.85rem 1.25rem; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.06);">Sob Consulta</td>
            </tr>
            <tr>
              <td style="padding: 0.85rem 1.25rem; color: #10B981; font-weight: 800;">Margem / Lucro</td>
              <td id="comp-profit-a" style="padding: 0.85rem 1.25rem; color: #10B981; font-weight: 800;">-</td>
              <td id="comp-profit-b" style="padding: 0.85rem 1.25rem; color: #10B981; font-weight: 800;">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ==================== SECTION: PÓS-VENDA, PDI & GESTÃO DE OS ==================== -->
    <section id="pos-venda" class="z8-posvenda-section" style="padding: 5rem 1.5rem; max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="color: var(--color--lime, #00F0FF); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.5rem;">PÓS-VENDA INDUSTRIAL // REDE AUTORIZADA</div>
        <h2 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">CENTRAL TÉCNICA, PDI &amp; ORDENS DE SERVIÇO</h2>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 660px; margin: 0 auto; font-size: 0.9rem; line-height: 1.5;">Padronização de revisão obrigatória (PDI), diagnóstico elétrico de 72V, BMS e atendimento de garantia por chassi com alocação dos 2 elevadores da oficina.</p>
      </div>

      <!-- Pre-login Overview Grid -->
      <div id="posvenda-prelogin-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <div style="background: rgba(10, 22, 40, 0.6); padding: 1.75rem; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px;">
          <div style="font-size: 2rem; color: #00F0FF; margin-bottom: 0.85rem;"><i class="fa-solid fa-wrench"></i></div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #F4F5F7; margin: 0 0 0.5rem 0;">Oficina com 2 Elevadores</h3>
          <p style="font-size: 0.82rem; color: rgba(244,244,237,0.65); line-height: 1.45; margin: 0;">Padrão obrigatório de 2 elevadores hidráulicos para manutenção rápida, revisão de 1.000 km e troca preventiva de pastilhas e fluídos.</p>
        </div>
        <div style="background: rgba(10, 22, 40, 0.6); padding: 1.75rem; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px;">
          <div style="font-size: 2rem; color: #10B981; margin-bottom: 0.85rem;"><i class="fa-solid fa-shield-halved"></i></div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #F4F5F7; margin: 0 0 0.5rem 0;">Garantia Nacional por Chassi</h3>
          <p style="font-size: 0.82rem; color: rgba(244,244,237,0.65); line-height: 1.45; margin: 0;">Rastreabilidade direta de baterias de lítio 72V/60V/48V, controlador FOC e motor brushless protegidos contra defeitos de fabricação.</p>
        </div>
        <div style="background: rgba(10, 22, 40, 0.6); padding: 1.75rem; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px;">
          <div style="font-size: 2rem; color: #F59E0B; margin-bottom: 0.85rem;"><i class="fa-solid fa-clipboard-check"></i></div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #F4F5F7; margin: 0 0 0.5rem 0;">Protocolo PDI de Entrega</h3>
          <p style="font-size: 0.82rem; color: rgba(244,244,237,0.65); line-height: 1.45; margin: 0;">Checklist técnico de 24 itens antes da entrega ao consumidor final: reaperto de eixos, calibração de BMS e testes de frenagem regenerativa.</p>
        </div>
      </div>

      <!-- Post-login Interactive OS Dashboard -->
      <div id="posvenda-postlogin-card" style="display: none; background: rgba(10, 22, 40, 0.75); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 8px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase;">GERENCIAMENTO DE ORDENS DE SERVIÇO EM TEMPO REAL</span>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: #F4F5F7; margin: 0.25rem 0 0 0;">ORDENS DE SERVIÇO (OS) DA CONCESSIONÁRIA</h3>
          </div>
          <button type="button" onclick="window.openNewOSModal && window.openNewOSModal()" style="padding: 0.75rem 1.25rem; background: #10B981; color: #07080B; border: none; border-radius: 4px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
            <i class="fa-solid fa-plus" style="margin-right: 4px;"></i> ABRIR NOVA ORDEM DE SERVIÇO
          </button>
        </div>

        <div style="margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <input type="text" id="os-search-input" placeholder="Buscar por chassi ou código da OS..." style="flex: 1; min-width: 220px; background: #06080D; border: 1px solid rgba(255,255,255,0.12); color: #FFF; padding: 0.65rem 1rem; border-radius: 4px; font-size: 0.82rem;"/>
        </div>

        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
          <table class="z8-orderdesk-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
            <thead>
              <tr style="background: rgba(0, 240, 255, 0.08); border-bottom: 1px solid rgba(0, 240, 255, 0.25);">
                <th style="padding: 0.75rem 1rem; color: #00F0FF;">CÓDIGO OS</th>
                <th style="padding: 0.75rem 1rem; color: #00F0FF;">MODELO</th>
                <th style="padding: 0.75rem 1rem; color: #00F0FF;">CHASSI</th>
                <th style="padding: 0.75rem 1rem; color: #00F0FF;">CONCESSIONÁRIA</th>
                <th style="padding: 0.75rem 1rem; color: #00F0FF; text-align: center;">STATUS</th>
                <th style="padding: 0.75rem 1rem; color: #00F0FF; text-align: right;">AÇÕES</th>
              </tr>
            </thead>
            <tbody id="posvenda-os-table-body"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION: CENTRAL DE MANUAIS & DOSSIÊ JURÍDICO ==================== -->
    <section id="manuais" class="z8-manuais-section" style="padding: 5rem 1.5rem; max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="color: var(--color--lime, #00F0FF); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.5rem;">DOWNLOADS &amp; INSTRUMENTOS OFICIAIS</div>
        <h2 style="font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #F4F5F7; margin: 0 0 0.75rem 0;">CENTRAL DE MANUAIS &amp; DOSSIÊ JURÍDICO</h2>
        <p style="color: rgba(244, 244, 237, 0.7); max-width: 660px; margin: 0 auto; font-size: 0.9rem; line-height: 1.5;">Documentos públicos para investidores e manuais técnicos restritos para concessionárias credenciadas.</p>
      </div>

      <div class="z8-downloads-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
        <!-- Doc 1: COF (Public) -->
        <a href="/docs/juridico/CIRCULAR_DE_OFERTA_DE_FRANQUIA_COF.pdf" target="_blank" class="z8-download-card" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div style="font-size: 1.8rem; color: #00F0FF;"><i class="fa-solid fa-file-pdf"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Circular de Oferta de Franquia (COF)</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Lei 13.966/2019 // Dossiê Oficial</span>
            <span style="font-size: 0.68rem; color: #10B981; font-weight: 800; display: block; margin-top: 0.25rem;">Acesso Público Liberado</span>
          </div>
        </a>

        <!-- Doc 2: Parecer CONTRAN 996 (Public) -->
        <a href="/docs/juridico/PARECER_REGULATORIO_CONTRAN_996.pdf" target="_blank" class="z8-download-card" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div style="font-size: 1.8rem; color: #00F0FF;"><i class="fa-solid fa-scale-balanced"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Parecer CONTRAN 996</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Isenção de CNH e Classificação</span>
            <span style="font-size: 0.68rem; color: #10B981; font-weight: 800; display: block; margin-top: 0.25rem;">Acesso Público Liberado</span>
          </div>
        </a>

        <!-- Doc 3: Catálogo Minimalista 2026 (Public) -->
        <a href="/docs/CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf" target="_blank" class="z8-download-card" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div style="font-size: 1.8rem; color: #00F0FF;"><i class="fa-solid fa-book-open"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Catálogo Minimalista 2026</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">14 Pranchetas // Linha Completa</span>
            <span style="font-size: 0.68rem; color: #10B981; font-weight: 800; display: block; margin-top: 0.25rem;">Acesso Público Liberado</span>
          </div>
        </a>

        <!-- Doc 4: Contrato Padrão (Restricted) -->
        <a href="/docs/juridico/CONTRATO_PADRAO_DE_FRANQUIA.pdf" target="_blank" class="z8-download-card z8-restricted-doc" id="doc-contrato-padrao" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div class="z8-doc-icon" style="font-size: 1.8rem; color: #F59E0B;"><i class="fa-solid fa-file-contract"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Minuta Contrato Padrão</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Título Executivo CPC // Raio até 50 km</span>
            <span class="z8-doc-badge" style="font-size: 0.68rem; color: #F59E0B; font-weight: 800; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-lock"></i> Restrito Concessionário</span>
          </div>
        </a>

        <!-- Doc 5: Termo PDI (Restricted) -->
        <a href="/docs/juridico/TERMO_DE_ENTREGA_TECNICA_E_PDI.pdf" target="_blank" class="z8-download-card z8-restricted-doc" id="doc-termo-pdi" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div class="z8-doc-icon" style="font-size: 1.8rem; color: #F59E0B;"><i class="fa-solid fa-list-check"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Termo de Entrega Técnica (PDI)</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Checklist de Oficina // 24 Itens</span>
            <span class="z8-doc-badge" style="font-size: 0.68rem; color: #F59E0B; font-weight: 800; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-lock"></i> Restrito Concessionário</span>
          </div>
        </a>

        <!-- Doc 6: Manual Arquitetura e Fachadas (Restricted) -->
        <a href="/docs/manuais/MANUAL_DE_IDENTIDADE_VISUAL_E_ARQUITETURA_Z8.pdf" target="_blank" class="z8-download-card z8-restricted-doc" id="doc-manual-arquitetura" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div class="z8-doc-icon" style="font-size: 1.8rem; color: #F59E0B;"><i class="fa-solid fa-compass-drafting"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Manual Arquitetura &amp; Fachadas</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Plantas Baixas // ACM Escovado</span>
            <span class="z8-doc-badge" style="font-size: 0.68rem; color: #F59E0B; font-weight: 800; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-lock"></i> Restrito Concessionário</span>
          </div>
        </a>

        <!-- Doc 7: Tabela de Preços Atacado (Restricted) -->
        <a href="/docs/TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf" target="_blank" class="z8-download-card z8-restricted-doc" id="doc-tabela-atacado" style="background: rgba(10, 22, 40, 0.7); border: 1px solid rgba(244, 244, 237, 0.12); border-radius: 6px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; text-decoration: none;">
          <div class="z8-doc-icon" style="font-size: 1.8rem; color: #F59E0B;"><i class="fa-solid fa-tags"></i></div>
          <div style="flex: 1;">
            <strong style="color: #F4F5F7; font-size: 0.88rem; display: block;">Tabela Atacado Oficial 2026</strong>
            <span style="font-size: 0.74rem; color: rgba(244,244,237,0.6);">Margens &amp; Lucro dos 11 Modelos</span>
            <span class="z8-doc-badge" style="font-size: 0.68rem; color: #F59E0B; font-weight: 800; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-lock"></i> Restrito Concessionário</span>
          </div>
        </a>
      </div>
    </section>
"""

    c1 = c1[:insert_pos] + new_sections_html + c1[insert_pos:]

    # 8. Add Master Admin Modal, New OS Modal, and Persistent Bottom HUD Bar right before closing </body>
    closing_body_idx = c1.find('</body>')
    assert closing_body_idx != -1, "closing </body> not found!"

    modals_html = """  <!-- ==================== PERSISTENT BOTTOM HUD ORDER BAR ==================== -->
  <aside id="z8-sticky-order-bar" class="z8-sticky-order-hud" style="display: none;">
    <div class="z8-sticky-hud-inner">
      <div class="z8-sticky-metric">
        <span class="z8-sticky-label">LOTE DE ATACADO</span>
        <strong id="sticky-lot-badge" class="z8-sticky-value is-amber">0 / 10 Motos</strong>
      </div>
      <div class="z8-sticky-divider"></div>
      <div class="z8-sticky-metric">
        <span class="z8-sticky-label">INVESTIMENTO TOTAL</span>
        <strong id="sticky-wholesale-total" class="z8-sticky-value">R$ 0,00</strong>
      </div>
      <div class="z8-sticky-divider"></div>
      <div class="z8-sticky-metric">
        <span class="z8-sticky-label">LUCRO BRUTO ESTIMADO</span>
        <strong id="sticky-profit-total" class="z8-sticky-value is-lime">+ R$ 0,00</strong>
      </div>
      <a href="#orderdesk" class="z8-sticky-cta-btn" id="sticky-cta-btn">
        <span>REVISAR PEDIDO NA MESA</span>
        <i class="fa-solid fa-arrow-down"></i>
      </a>
    </div>
  </aside>

  <!-- ==================== MASTER ADMIN DASHBOARD MODAL (CHRISTIAN HIDEYUKI) ==================== -->
  <div id="admin-master-modal" class="z8-auth-menu-modal lenis-prevent" data-lenis-prevent="true" style="display: none;">
    <div style="background: #080B10; border: 1px solid rgba(245, 158, 11, 0.4); max-width: 900px; width: 95vw; margin: auto; padding: 2rem; border-radius: 8px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div>
          <span style="font-size: 0.72rem; color: #F59E0B; font-weight: 800; text-transform: uppercase;"><i class="fa-solid fa-crown"></i> DIRETORIA MATRIZ Z8 // COMANDO MASTER</span>
          <h2 style="font-size: 1.5rem; color: #FFF; font-weight: 900; margin: 0.25rem 0 0 0;">PAINEL MASTER DE APROVAÇÃO DE LOJISTAS</h2>
        </div>
        <button type="button" onclick="window.closeAdminModal && window.closeAdminModal()" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: #FFF; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;">FECHAR [ESC]</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); padding: 1rem; border-radius: 6px;">
          <span style="font-size: 0.72rem; color: #F59E0B; text-transform: uppercase;">LOJISTAS PENDENTES</span>
          <strong id="admin-stat-pending" style="font-size: 1.6rem; color: #FFF; display: block; margin-top: 0.25rem;">0</strong>
        </div>
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem; border-radius: 6px;">
          <span style="font-size: 0.72rem; color: #10B981; text-transform: uppercase;">CONCESSIONÁRIAS ATIVAS</span>
          <strong id="admin-stat-approved" style="font-size: 1.6rem; color: #FFF; display: block; margin-top: 0.25rem;">0</strong>
        </div>
        <div style="background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); padding: 1rem; border-radius: 6px;">
          <span style="font-size: 0.72rem; color: #00F0FF; text-transform: uppercase;">ORDENS DE SERVIÇO</span>
          <strong id="admin-stat-os" style="font-size: 1.6rem; color: #FFF; display: block; margin-top: 0.25rem;">0</strong>
        </div>
      </div>

      <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
        <table class="z8-orderdesk-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
          <thead>
            <tr style="background: rgba(245, 158, 11, 0.1); border-bottom: 1px solid rgba(245, 158, 11, 0.3);">
              <th style="padding: 0.75rem 1rem; color: #F59E0B;">LOJISTA / EMPRESA</th>
              <th style="padding: 0.75rem 1rem; color: #F59E0B;">CIDADE / UF</th>
              <th style="padding: 0.75rem 1rem; color: #F59E0B;">WHATSAPP</th>
              <th style="padding: 0.75rem 1rem; color: #F59E0B;">STATUS</th>
              <th style="padding: 0.75rem 1rem; color: #F59E0B; text-align: right;">AÇÃO 1-CLIQUE</th>
            </tr>
          </thead>
          <tbody id="admin-users-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ==================== NEW SERVICE ORDER (OS) MODAL ==================== -->
  <div id="new-os-modal" class="z8-auth-menu-modal lenis-prevent" data-lenis-prevent="true" style="display: none;">
    <div style="background: #080B10; border: 1px solid rgba(0, 240, 255, 0.4); max-width: 620px; width: 95vw; margin: auto; padding: 2rem; border-radius: 8px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div>
          <span style="font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase;">PÓS-VENDA // REDE AUTORIZADA Z8</span>
          <h2 style="font-size: 1.35rem; color: #FFF; font-weight: 900; margin: 0.25rem 0 0 0;">ABERTURA DE ORDEM DE SERVIÇO</h2>
        </div>
        <button type="button" onclick="window.closeNewOSModal && window.closeNewOSModal()" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: #FFF; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;">FECHAR [ESC]</button>
      </div>

      <form id="new-os-form" onsubmit="window.handleCreateOS && window.handleCreateOS(event)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display:block; font-size:0.74rem; color:rgba(244,244,237,0.7); margin-bottom:0.35rem;">MODELO *</label>
            <select id="os-form-model" required style="width:100%; background:#06080D; border:1px solid rgba(255,255,255,0.12); color:#FFF; padding:0.65rem; border-radius:4px; font-size:0.82rem;"></select>
          </div>
          <div>
            <label style="display:block; font-size:0.74rem; color:rgba(244,244,237,0.7); margin-bottom:0.35rem;">NÚMERO DO CHASSI *</label>
            <input type="text" id="os-form-chassis" required placeholder="Z8-XXXXXXXX-2026" style="width:100%; background:#06080D; border:1px solid rgba(255,255,255,0.12); color:#FFF; padding:0.65rem; border-radius:4px; font-size:0.82rem; text-transform:uppercase;"/>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display:block; font-size:0.74rem; color:rgba(244,244,237,0.7); margin-bottom:0.35rem;">QUILOMETRAGEM (KM)</label>
            <input type="number" id="os-form-km" placeholder="Ex: 1250" style="width:100%; background:#06080D; border:1px solid rgba(255,255,255,0.12); color:#FFF; padding:0.65rem; border-radius:4px; font-size:0.82rem;"/>
          </div>
          <div>
            <label style="display:block; font-size:0.74rem; color:rgba(244,244,237,0.7); margin-bottom:0.35rem;">TIPO DE CHAMADO</label>
            <select id="os-form-type" style="width:100%; background:#06080D; border:1px solid rgba(255,255,255,0.12); color:#FFF; padding:0.65rem; border-radius:4px; font-size:0.82rem;">
              <option value="pdi">Revisão PDI de Entrega</option>
              <option value="garantia">Garantia Elétrica / Bateria 72V</option>
              <option value="revisao">Revisão Periódica (1.000 km)</option>
              <option value="pecas">Reposição de Peças</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display:block; font-size:0.74rem; color:rgba(244,244,237,0.7); margin-bottom:0.35rem;">RELATO TÉCNICO &amp; DIAGNÓSTICO DO MECÂNICO *</label>
          <textarea id="os-form-desc" required rows="3" placeholder="Descreva os testes realizados (tensão da bateria, resposta do controlador FOC, sensores Hall, etc.)..." style="width:100%; background:#06080D; border:1px solid rgba(255,255,255,0.12); color:#FFF; padding:0.75rem; border-radius:4px; font-size:0.82rem; resize:vertical;"></textarea>
        </div>

        <button type="submit" style="width:100%; padding:0.95rem; background:#00F0FF; color:#07080B; border:none; border-radius:4px; font-weight:900; font-size:0.88rem; cursor:pointer; text-transform:uppercase;">
          <i class="fa-solid fa-check" style="margin-right:6px;"></i> REGISTRAR ORDEM DE SERVIÇO
        </button>
      </form>
    </div>
  </div>
\n"""

    c1 = c1[:closing_body_idx] + modals_html + c1[closing_body_idx:]

    with open('conceito-2/index.html', 'w', encoding='utf-8') as f:
        f.write(c1)

    print("SUCCESS! Built conceito-2/index.html. New file length:", len(c1))

if __name__ == '__main__':
    build()
