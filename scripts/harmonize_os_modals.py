# Harmonize OS Modals and JS in conceito/index.html and conceito/app.js

def copy_os_modals():
    with open('conceito-2/index.html', 'r', encoding='utf-8') as f:
        c2 = f.read()

    # Extract modals from conceito-2
    marker_admin = '<!-- ==================== ADMIN MASTER CONTROL MODAL'
    marker_os = '<!-- ==================== NEW SERVICE ORDER (OS) MODAL ==================== -->'
    marker_end = '</body>'

    idx_admin = c2.find(marker_admin)
    idx_end = c2.find(marker_end)
    modals_html = c2[idx_admin:idx_end]

    with open('conceito/index.html', 'r', encoding='utf-8') as f:
        c1 = f.read()

    if 'new-os-modal' not in c1:
        c1 = c1.replace('</body>', modals_html + '\n</body>')
        with open('conceito/index.html', 'w', encoding='utf-8') as f:
            f.write(c1)
        print("Added Admin & OS modals to conceito/index.html")

def copy_os_js():
    with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
        c2 = f.read()

    # Extract OS functions section from conceito-2/app.js
    marker_start = '// 7. PÓS-VENDA & GESTÃO DE ORDENS DE SERVIÇO (OS)'
    marker_end = '// Expose Admin Actions to window'
    
    idx_start = c2.find(marker_start)
    idx_end = c2.find(marker_end)
    os_code = c2[idx_start:idx_end]

    with open('conceito/app.js', 'r', encoding='utf-8') as f:
        c1 = f.read()

    if 'loadOSTable' not in c1:
        # Add OS functions before DOMContentLoaded
        dom_marker = "document.addEventListener('DOMContentLoaded'"
        c1 = c1.replace(dom_marker, os_code + "\n" + dom_marker)

        # In DOMContentLoaded, call loadOSTable()
        dom_call = """  // Live search for OS
  const searchInput = document.getElementById('os-search-input');
  searchInput?.addEventListener('input', (e) => {
    loadOSTable(e.target.value);
  });
  loadOSTable();
  window.openNewOSModal = openNewOSModal;
  window.closeNewOSModal = closeNewOSModal;
  window.handleCreateOS = handleCreateOS;
"""
        c1 = c1.replace("initConceitoAuthEvents();", "initConceitoAuthEvents();\n" + dom_call)
        with open('conceito/app.js', 'w', encoding='utf-8') as f:
            f.write(c1)
        print("Added OS functions to conceito/app.js")

copy_os_modals()
copy_os_js()
