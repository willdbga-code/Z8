def patch_app_js(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    target = """  if (urlParams.get('login') === '1' || urlParams.get('modal') === '1' || urlParams.get('auth') === '1') {
    unlockPage();
    setTimeout(() => {
      openAuthModal('login');
    }, 400);
  }"""

    replacement = """  if (urlParams.get('login') === '1' || urlParams.get('modal') === '1' || urlParams.get('auth') === '1') {
    const intro = document.querySelector('.intro');
    if (intro) intro.style.display = 'none';
    unlockPage();
    const modal = document.getElementById('z8-auth-modal');
    if (modal) {
      modal.classList.add('is-active');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
    }
    if (typeof switchAuthTab === 'function') switchAuthTab('login');
  }

  if (urlParams.get('scrollto')) {
    const targetId = urlParams.get('scrollto');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    }, 150);
  }"""

    text_norm = text.replace('\r\n', '\n')
    target_norm = target.replace('\r\n', '\n')
    replacement_norm = replacement.replace('\r\n', '\n')

    if target_norm in text_norm:
        text_norm = text_norm.replace(target_norm, replacement_norm, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text_norm)
        print(f"Patched {filepath}")
    else:
        print(f"Target not found in {filepath}")

patch_app_js('conceito-2/app.js')
