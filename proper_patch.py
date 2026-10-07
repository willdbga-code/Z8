import re

with open('site-principal/catalog-auth.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def inject_after_line(match_str, inject_str):
    for i, line in enumerate(lines):
        if match_str in line:
            lines.insert(i + 1, inject_str)
            return True
    return False

# In loginWithGoogle:
# we look for: sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
# and inject after it.
login_google_inject = """
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (user.role === 'admin' || user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
           window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
        }, 1000);
      }
"""
inject_after_line("sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));", login_google_inject)


# In loginCatalogUser:
# There are two success places. One for API, one for offline fallback.
# Actually, the easiest is to patch at the end of the success blocks or just replace the `window.dispatchEvent` strictly inside loginCatalogUser.
# Let's find: `export async function loginCatalogUser`
start_idx = 0
for i, line in enumerate(lines):
    if "export async function loginCatalogUser" in line:
        start_idx = i
        break

# Find the first `sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));` after start_idx
for i in range(start_idx, len(lines)):
    if "sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));" in lines[i]:
        # There are 3! API success, offline success, emergency offline success
        lines.insert(i + 1, """
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (loggedUser.role === 'admin' || loggedUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
           window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
        }, 1000);
      }
""")
        break # only do the first one for API, wait I should do all 3? No, just replace string in the whole function but carefully.
