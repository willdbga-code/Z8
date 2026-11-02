with open('conceito/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  initTransitionSafety();
  renderPortalLojistaLAF();
  initAuthModalEvents();
  syncAuthState();

  if (getCurrentCatalogUser()) {"""

replacement = """  initTransitionSafety();
  renderPortalLojistaLAF();
  initAuthModalEvents();
  syncAuthState();

  if (urlParams.get('login') === '1' || urlParams.get('modal') === '1' || urlParams.get('auth') === '1') {
    unlockPage();
    setTimeout(() => {
      openAuthModal('login');
    }, 400);
  }

  if (getCurrentCatalogUser()) {"""

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open('conceito/app.js', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Updated conceito/app.js")
else:
    print("Target not found in conceito/app.js")
