# Script to update conceito-2/app.js and conceito/app.js for direct poslogin portal

def update_conceito2():
    with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Update window.handleLogout
    old_logout = """window.handleLogout = function() {
  logoutCatalogUser();
  syncAuthState();
};"""
    new_logout = """window.handleLogout = function() {
  logoutCatalogUser();
  document.documentElement.classList.remove('is-poslogin-direct');
  document.body.classList.remove('is-poslogin-direct');
  syncAuthState();
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
};"""
    if old_logout in code:
        code = code.replace(old_logout, new_logout)
        print("Updated window.handleLogout in conceito-2/app.js")

    # 2. Update syncAuthState
    old_sync_start = """  if (user) {
    if (franquiaBtn) franquiaBtn.style.display = 'none';"""
    new_sync_start = """  if (user) {
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

    if (franquiaBtn) franquiaBtn.style.display = 'none';"""
    if old_sync_start in code:
        code = code.replace(old_sync_start, new_sync_start)
        print("Updated syncAuthState (user branch) in conceito-2/app.js")

    old_sync_else = """  } else {
    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';"""
    new_sync_else = """  } else {
    document.documentElement.classList.remove('is-poslogin-direct');
    document.body.classList.remove('is-poslogin-direct');

    if (franquiaBtn) franquiaBtn.style.display = 'inline-flex';"""
    if old_sync_else in code:
        code = code.replace(old_sync_else, new_sync_else)
        print("Updated syncAuthState (else branch) in conceito-2/app.js")

    # 3. Update DOMContentLoaded in conceito-2
    old_dom_sync = """  initAuthModalEvents();
  syncAuthState();"""
    new_dom_sync = """  initAuthModalEvents();
  syncAuthState();

  if (getCurrentCatalogUser()) {
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);
  }"""
    if old_dom_sync in code:
        code = code.replace(old_dom_sync, new_dom_sync)
        print("Updated DOMContentLoaded in conceito-2/app.js")

    with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
        f.write(code)

def update_conceito():
    with open('conceito/app.js', 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Update syncConceitoAuthState
    old_sync = """function syncConceitoAuthState() {
  const user = getCurrentCatalogUser();
  const admin = isUserAdmin(user);

  updateNavMenuAuthText(admin ? 'Portal Lojista' : 'Portal Lojista');"""

    new_sync = """function syncConceitoAuthState() {
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

  updateNavMenuAuthText(admin ? 'Portal Lojista' : 'Portal Lojista');"""

    if old_sync in code:
        code = code.replace(old_sync, new_sync)
        print("Updated syncConceitoAuthState in conceito/app.js")

    # 2. Add window.handleLogout if not present
    if "window.handleLogout" not in code:
        logout_fn = """window.handleLogout = function() {
  logoutCatalogUser();
  document.documentElement.classList.remove('is-poslogin-direct');
  document.body.classList.remove('is-poslogin-direct');
  syncConceitoAuthState();
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
};
"""
        code = logout_fn + code
        print("Added window.handleLogout to conceito/app.js")

    # 3. Update DOMContentLoaded in conceito
    old_dom_sync = """  initConceitoAuthEvents();
});"""
    new_dom_sync = """  initConceitoAuthEvents();

  if (getCurrentCatalogUser()) {
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);
  }
});"""
    if old_dom_sync in code:
        code = code.replace(old_dom_sync, new_dom_sync)
        print("Updated DOMContentLoaded in conceito/app.js")

    with open('conceito/app.js', 'w', encoding='utf-8') as f:
        f.write(code)

update_conceito2()
update_conceito()
print("All updates applied!")
