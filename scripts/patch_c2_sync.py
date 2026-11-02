with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = """  // Initial load of Service Orders table & live event listener
  loadOSTable();
  window.addEventListener('z8-warranty-os-updated', () => {
    loadOSTable();
  });"""

repl = """  // Initial load of Service Orders table & live event listener
  loadOSTable();
  if (typeof fetchWarrantyOrdersFromFirestore === 'function') {
    fetchWarrantyOrdersFromFirestore().then((res) => {
      if (res && res.length) {
        console.log('[Z8 Conceito-2] Ordens de Serviço sincronizadas com Firestore:', res.length);
        loadOSTable();
      }
    }).catch(err => console.warn('[Z8 Conceito-2] Erro na busca de OS do Firestore:', err));
  }
  window.addEventListener('z8-warranty-os-updated', () => {
    loadOSTable();
  });"""

if target in c:
    c = c.replace(target, repl)
    with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Patched conceito-2/app.js with live Firestore sync")
else:
    print("Target not found in conceito-2/app.js")
