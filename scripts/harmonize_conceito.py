# Harmonize header auth controls in conceito/index.html and conceito/app.js

def update_conceito_header():
    with open('conceito/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_btns = """      <div data-nav-group="btns" class="btn-layout is-nav">
        <a data-theme="dark" data-anim="text-hover" href="#portal-lojista" data-taxi-ignore="true" onclick="event.preventDefault(); window.openPortalLojista && window.openPortalLojista('all');" class="btn-w is-nav w-inline-block" style="border:1px solid rgba(0,240,255,0.45); background:rgba(10,22,40,0.88); color:#00F0FF;">
          <div class="btn-inner">
            <div class="btn-inner-text-w is-nav">
              <div split-text="chars" class="btn-text is-nav is-sm">Portal Lojista</div>
            </div>
          </div>
        </a>
        <a data-theme="lime" data-anim="text-hover" href="#candidatar" data-taxi-ignore="true" onclick="event.preventDefault(); window.openLeadModal && window.openLeadModal('Navbar Store CTA');" class="btn-w is-nav w-inline-block">
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
        </a>"""

    new_btns = """      <div data-nav-group="btns" class="btn-layout is-nav">
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
        </div>"""

    if old_btns in html:
        html = html.replace(old_btns, new_btns)
        with open('conceito/index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated navbar buttons in conceito/index.html")

def update_conceito_app():
    with open('conceito/app.js', 'r', encoding='utf-8') as f:
        code = f.read()

    old_sync = """function syncConceitoAuthState() {
  const user = getCurrentCatalogUser();
  const admin = isUserAdmin(user);

  if (user) {
    document.documentElement.classList.add('is-poslogin-direct');
    document.body.classList.add('is-poslogin-direct');

    const transitionW = document.querySelector('.transition-w');
    if (transitionW) {
      transitionW.style.display = 'none';
      transitionW.style.pointerEvents = 'none';
      transitionW.style.opacity = '0';
    }
    const pageW = document.querySelector('.page-w');
    if (pageW) {
      pageW.removeAttribute('data-start');
      pageW.style.opacity = '1';
      pageW.style.visibility = 'visible';
    }
  } else {
    document.documentElement.classList.remove('is-poslogin-direct');
    document.body.classList.remove('is-poslogin-direct');
  }

  updateNavMenuAuthText(admin ? 'Portal Lojista' : 'Portal Lojista');
  syncPortalLojistaUser();"""

    new_sync = """function syncConceitoAuthState() {
  const user = getCurrentCatalogUser();
  const approved = isCatalogApproved();
  const admin = isUserAdmin(user);

  // 1. Header Buttons & Partner Badge
  const franquiaBtn = document.getElementById('btn-header-franquia');
  const partnerBadge = document.getElementById('header-partner-badge');
  const partnerName = document.getElementById('header-partner-name');
  const loginBtn = document.getElementById('btn-header-login');
  const logoutBtn = document.getElementById('btn-header-logout');
  const adminBtn = document.getElementById('btn-header-admin');

  if (user) {
    document.documentElement.classList.add('is-poslogin-direct');
    document.body.classList.add('is-poslogin-direct');

    const transitionW = document.querySelector('.transition-w');
    if (transitionW) {
      transitionW.style.display = 'none';
      transitionW.style.pointerEvents = 'none';
      transitionW.style.opacity = '0';
    }
    const pageW = document.querySelector('.page-w');
    if (pageW) {
      pageW.removeAttribute('data-start');
      pageW.style.opacity = '1';
      pageW.style.visibility = 'visible';
    }

    if (franquiaBtn) franquiaBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    if (partnerBadge && partnerName) {
      partnerBadge.style.display = 'inline-flex';
      partnerName.textContent = user.company || user.name || 'Parceiro Z8';
      partnerBadge.classList.toggle('is-pending', !approved);
    }

    if (adminBtn) {
      adminBtn.style.display = admin ? 'inline-flex' : 'none';
    }
  } else {
    document.documentElement.classList.remove('is-poslogin-direct');
    document.body.classList.remove('is-poslogin-direct');

    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (partnerBadge) partnerBadge.style.display = 'none';
  }

  updateNavMenuAuthText(admin ? 'Portal Lojista' : 'Portal Lojista');
  syncPortalLojistaUser();"""

    if old_sync in code:
        code = code.replace(old_sync, new_sync)
        with open('conceito/app.js', 'w', encoding='utf-8') as f:
            f.write(code)
        print("Updated syncConceitoAuthState in conceito/app.js")

update_conceito_header()
update_conceito_app()
