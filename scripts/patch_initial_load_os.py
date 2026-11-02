with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  // Drawer Close Button
  document.getElementById('z8-drawer-close-btn')?.addEventListener('click', closeZ8ModelDrawer);

  // Sync OS updates
  window.addEventListener('z8-warranty-os-updated', () => {
    loadOSTable();
  });"""

replacement = """  // Drawer Close Button
  document.getElementById('z8-drawer-close-btn')?.addEventListener('click', closeZ8ModelDrawer);

  // Initial load of Service Orders table & live event listener
  loadOSTable();
  window.addEventListener('z8-warranty-os-updated', () => {
    loadOSTable();
  });"""

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Added loadOSTable() to conceito-2/app.js")
else:
    print("Target not found in conceito-2/app.js")
