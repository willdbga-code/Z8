import re

def update_nav(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    svg_active = '''<svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="6"/></svg>'''
    svg_sub = '''<svg width="100%" height="100%" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.28"/></svg>'''

    new_nav = f'''<div class="nav-menu-links-list">
                <a data-anim="text-hover" href="#top" data-taxi-ignore="true" aria-current="page" class="nav-menu-link-w w-inline-block w--current" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Início</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_active}
                  </div>
                </a>
                <a data-anim="text-hover" href="#laf-block-institucional" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Apresentação &amp; Fábricas</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_sub}
                  </div>
                </a>
                <a data-anim="text-hover" href="#laf-block-fichas" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Fichas das 11 Motos</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_sub}
                  </div>
                </a>
                <a data-anim="text-hover" href="#laf-block-pedidos" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Fechamento do Pedido</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_sub}
                  </div>
                </a>
                <a data-anim="text-hover" href="#rodape-os" data-taxi-ignore="true" class="nav-menu-link-w w-inline-block" onclick="document.querySelector('[data-nav-ham]')?.click()">
                  <div split-text="chars" class="text-nav-link">Central de OS &amp; Pós-Venda</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_sub}
                  </div>
                </a>
                <a data-anim="text-hover" href="#login" data-taxi-ignore="true" id="nav-menu-link-login" class="nav-menu-link-w w-inline-block" onclick="event.preventDefault(); document.querySelector('[data-nav-ham]')?.click(); window.openZ8MenuAuth && window.openZ8MenuAuth();">
                  <div split-text="chars" class="text-nav-link" id="nav-menu-link-login-text">Área do Parceiro</div>
                  <div class="nav-menu-link-current-svg w-embed">
                    {svg_sub}
                  </div>
                </a>
              </div>'''

    pattern = r'<div class="nav-menu-links-list">[\s\S]*?</div>\s*<div class="nav-helmet-rive-w">'
    replacement = new_nav + '\n              <div class="nav-helmet-rive-w">'

    match = re.search(pattern, content)
    if match:
        new_content = content[:match.start()] + replacement + content[match.end():]
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated nav in {html_path}")
    else:
        print(f"Pattern not found in {html_path}")

update_nav('conceito-2/index.html')
update_nav('conceito/index.html')
