# Script to replace post-checkout content with the OS footer in conceito-2 and conceito

os_footer_html = """
        <!-- =====================================================================
             RODAPÉ EXECUTIVO PARA A PÁGINA DE OS // PÓS-VENDA & GARANTIA NACIONAL
             ===================================================================== -->
        <footer id="rodape-os" class="z8-os-footer">
          <div class="c z8-os-footer-container">
            
            <!-- TOP COCKPIT: TÍTULO MONUMENTAL & STATUS DA OFICINA -->
            <div class="z8-os-footer-hero">
              <div class="z8-os-eyebrow-row">
                <span class="z8-os-live-pulse"></span>
                <span class="z8-os-eyebrow">PÓS-VENDA INDUSTRIAL // OFICINA TÉCNICA 2 ELEVADORES HOMOLOGADA</span>
              </div>
              
              <div class="z8-os-title-split">
                <div>
                  <h2 class="text-impact-lg-mona z8-os-heading">
                    CENTRAL DE <span class="span-font-brier">Ordens de Serviço</span>
                  </h2>
                  <p class="z8-os-desc">
                    Gestão técnica para lojistas e mecânicos credenciados Z8: acompanhamento em tempo real de chamados, revisões periódicas (1.000 km), laudos de baterias de Lítio 72V/60V/48V, peças de reposição e protocolo PDI de entrega técnica.
                  </p>
                </div>
                
                <div class="z8-os-actions-cluster">
                  <button type="button" class="z8-os-primary-btn" onclick="window.openNewOSModal && window.openNewOSModal()">
                    <i class="fa-solid fa-plus"></i>
                    <span>ABRIR NOVA ORDEM DE SERVIÇO (OS)</span>
                  </button>
                  <a href="/docs/juridico/TERMO_DE_GARANTIA_NACIONAL_Z8.pdf" download="TERMO_DE_GARANTIA_NACIONAL_Z8.pdf" class="z8-os-secondary-btn">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>BAIXAR TERMO DE GARANTIA NACIONAL (PDF)</span>
                  </a>
                  <a href="https://wa.me/5512998008818?text=Ol%C3%A1%20Diretoria%20Z8,%20preciso%20de%20suporte%20t%C3%A9cnico%20de%20p%C3%B3s-venda%20e%20pe%C3%A7as%20de%20reposi%C3%A7%C3%A3o." target="_blank" class="z8-os-ghost-btn">
                    <i class="fa-brands fa-whatsapp"></i>
                    <span>SUPORTE TÉCNICO DIRETORIA SJC</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- 3 PILARES TÉCNICOS DA OPERAÇÃO DE PÓS-VENDA -->
            <div class="z8-os-pillars-grid">
              <div class="z8-os-pillar-card">
                <div class="z8-os-pillar-icon"><i class="fa-solid fa-wrench"></i></div>
                <div class="z8-os-pillar-num">01 // ESTRUTURA</div>
                <h4>OFICINA COM 2 ELEVADORES</h4>
                <p>Padrão homologado com 2 elevadores hidráulicos para manutenção ágil, revisão periódica de 1.000 km e substituição rápida de componentes.</p>
              </div>
              <div class="z8-os-pillar-card is-highlight">
                <div class="z8-os-pillar-icon"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="z8-os-pillar-num">02 // CONTRATUAL</div>
                <h4>GARANTIA NACIONAL POR CHASSI</h4>
                <p>Rastreabilidade direta de baterias Lítio 125Ah, módulos controladores FOC e motores elétricos Brushless com atendimento técnico ágil.</p>
              </div>
              <div class="z8-os-pillar-card">
                <div class="z8-os-pillar-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                <div class="z8-os-pillar-num">03 // QUALIDADE</div>
                <h4>PROTOCOLO PDI DE ENTREGA</h4>
                <p>Checklist de 24 itens técnicos antes da liberação ao consumidor: torqueamento de eixos, calibração BMS e teste de estanqueidade.</p>
              </div>
            </div>

            <!-- DASHBOARD DE ORDENS DE SERVIÇO EM TEMPO REAL -->
            <div class="z8-os-table-wrapper">
              <div class="z8-os-table-header">
                <div>
                  <span class="z8-os-table-eyebrow">CONTROLE EM TEMPO REAL // SINCRONIZAÇÃO NUVEM</span>
                  <h3>ORDENS DE SERVIÇO REGISTRADAS</h3>
                </div>
                <div class="z8-os-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input type="text" id="os-search-input" placeholder="Buscar por código de OS, chassi ou concessionária..." />
                </div>
              </div>

              <div class="z8-os-table-scroll">
                <table class="z8-os-data-table">
                  <thead>
                    <tr>
                      <th>CÓDIGO OS</th>
                      <th>MODELO</th>
                      <th>CHASSI</th>
                      <th>CONCESSIONÁRIA</th>
                      <th style="text-align: center;">STATUS</th>
                      <th style="text-align: right;">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody id="posvenda-os-table-body">
                    <!-- Preenchido dinamicamente via loadOSTable() -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- LEGAL & CORPORATE FOOTER STRIP -->
            <div class="z8-os-bottom-legal">
              <div class="z8-os-legal-brand">
                <img src="/assets/logos/logo minimalista.png" alt="Z8 Logo" class="z8-os-logo-img"/>
                <div>
                  <strong>Z8 EMOTION LTDA.</strong>
                  <p>CNPJ/MF: 68.774.164/0001-00 • Sede: Av. Dr. Adhemar de Barros, 566, Jd. São Dimas, São José dos Campos — SP, CEP 12.245-010</p>
                </div>
              </div>
              
              <div class="z8-os-legal-meta">
                <span>Homologação CONTRAN 996/2022 // Lei 13.966/2019 // Foro de São José dos Campos — SP</span>
                <p>© 2026 Z8 E-Motion. Mobilidade Elétrica de Alta Performance. Todos os direitos reservados.</p>
              </div>
            </div>

          </div>
        </footer>
"""

def update_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    portal_tag = '<section id="portal-lojista" data-nav-theme-target="dark" class="s z8-laf-portal-section"></section>'
    main_end = '</main>'

    if portal_tag in html and main_end in html:
        idx_portal = html.find(portal_tag) + len(portal_tag)
        idx_main = html.find(main_end)
        html = html[:idx_portal] + '\n' + os_footer_html + '\n    ' + html[idx_main:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {file_path} with OS Footer (removed all post-portal sections)")
    else:
        print(f"Could not find portal_tag or main_end in {file_path}")

update_html('conceito-2/index.html')
update_html('conceito/index.html')

os_footer_css = """
/* ==========================================================================
   RODAPÉ EXECUTIVO DA PÁGINA DE OS // PÓS-VENDA & GARANTIA NACIONAL
   ========================================================================== */
.z8-os-footer {
  background: #06090E;
  border-top: 1px solid rgba(0, 240, 255, 0.25);
  color: #F4F5F7;
  padding: clamp(3.5rem, 6vw, 5.5rem) 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.z8-os-footer-container {
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.z8-os-footer-hero {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 2.5rem;
  margin-bottom: 2.5rem;
}

.z8-os-eyebrow-row {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.35rem 0.85rem;
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  margin-bottom: 1.25rem;
}

.z8-os-live-pulse {
  width: 7px;
  height: 7px;
  background: #00F0FF;
  border-radius: 50%;
  box-shadow: 0 0 10px #00F0FF;
  animation: osPulse 2s infinite;
}

@keyframes osPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.z8-os-eyebrow {
  font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif);
  font-size: 0.72rem;
  font-weight: 800;
  color: #00F0FF;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.z8-os-title-split {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.z8-os-heading {
  font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0 0 0.85rem 0;
}

.z8-os-heading .span-font-brier {
  font-family: Brier, Georgia, serif;
  font-weight: 400;
  font-style: italic;
  color: #00F0FF;
  text-transform: none;
}

.z8-os-desc {
  max-width: 640px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(244, 245, 247, 0.75);
  margin: 0;
}

.z8-os-actions-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 320px;
}

.z8-os-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.95rem 1.6rem;
  background: #00F0FF;
  color: #06090E;
  font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif);
  font-weight: 900;
  font-size: 0.84rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 240, 255, 0.25);
  text-decoration: none;
}

.z8-os-primary-btn:hover {
  background: #38F8FF;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 240, 255, 0.4);
}

.z8-os-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.85rem 1.4rem;
  background: rgba(255, 255, 255, 0.04);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.z8-os-secondary-btn:hover {
  border-color: #00F0FF;
  background: rgba(0, 240, 255, 0.08);
  color: #00F0FF;
}

.z8-os-ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.75rem 1.2rem;
  background: transparent;
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.76rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.z8-os-ghost-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10B981;
}

/* 3 Pillars Grid */
.z8-os-pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.z8-os-pillar-card {
  background: rgba(13, 17, 24, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 1.75rem;
  position: relative;
  transition: border-color 0.2s ease;
}

.z8-os-pillar-card:hover {
  border-color: rgba(0, 240, 255, 0.35);
}

.z8-os-pillar-card.is-highlight {
  border-color: rgba(0, 240, 255, 0.3);
  background: rgba(10, 24, 38, 0.65);
}

.z8-os-pillar-icon {
  font-size: 1.8rem;
  color: #00F0FF;
  margin-bottom: 0.75rem;
}

.z8-os-pillar-num {
  font-size: 0.68rem;
  font-weight: 800;
  color: #94A3B8;
  letter-spacing: 0.08em;
  margin-bottom: 0.4rem;
}

.z8-os-pillar-card h4 {
  font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif);
  font-size: 1.05rem;
  font-weight: 900;
  color: #FFFFFF;
  margin: 0 0 0.65rem 0;
  letter-spacing: 0.02em;
}

.z8-os-pillar-card p {
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(244, 245, 247, 0.68);
  margin: 0;
}

/* Table Card */
.z8-os-table-wrapper {
  background: #0B0E14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 1.75rem;
  margin-bottom: 3rem;
}

.z8-os-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.z8-os-table-eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  color: #00F0FF;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.z8-os-table-header h3 {
  font-family: var(--font-family--mona, 'Mona Sans Variable', Arial, sans-serif);
  font-size: 1.2rem;
  font-weight: 900;
  color: #FFFFFF;
  margin: 0.25rem 0 0 0;
}

.z8-os-search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #06080D;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 0.5rem 0.85rem;
  min-width: 280px;
}

.z8-os-search-box i {
  color: #94A3B8;
  font-size: 0.8rem;
}

.z8-os-search-box input {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 0.8rem;
  width: 100%;
  outline: none;
}

.z8-os-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.z8-os-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.z8-os-data-table th {
  padding: 0.85rem 1rem;
  background: rgba(0, 240, 255, 0.06);
  color: #00F0FF;
  font-weight: 800;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  white-space: nowrap;
}

.z8-os-data-table td {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #E2E8F0;
  vertical-align: middle;
}

.z8-os-data-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

/* Legal Footer Bar */
.z8-os-bottom-legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.z8-os-legal-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.z8-os-logo-img {
  height: 38px;
  width: auto;
}

.z8-os-legal-brand strong {
  display: block;
  font-size: 0.88rem;
  color: #FFFFFF;
  letter-spacing: 0.04em;
}

.z8-os-legal-brand p {
  margin: 0.2rem 0 0 0;
  font-size: 0.72rem;
  color: #94A3B8;
}

.z8-os-legal-meta {
  text-align: right;
  font-size: 0.72rem;
  color: #64748B;
}

.z8-os-legal-meta span {
  display: block;
  margin-bottom: 0.25rem;
}

.z8-os-legal-meta p {
  margin: 0;
}

@media (max-width: 768px) {
  .z8-os-title-split {
    flex-direction: column;
    gap: 1.5rem;
  }
  .z8-os-actions-cluster {
    width: 100%;
  }
  .z8-os-search-box {
    width: 100%;
  }
  .z8-os-bottom-legal {
    flex-direction: column;
    align-items: flex-start;
  }
  .z8-os-legal-meta {
    text-align: left;
  }
}
"""

for target in ['conceito-2/style.css', 'conceito/style.css']:
    with open(target, 'r', encoding='utf-8') as f:
        c = f.read()
    if '.z8-os-footer' not in c:
        with open(target, 'a', encoding='utf-8') as f:
            f.write(os_footer_css)
        print(f"Appended .z8-os-footer CSS to {target}")
    else:
        print(f"CSS already in {target}")
