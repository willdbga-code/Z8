const fs = require('fs');
let content = fs.readFileSync('site-principal/catalog-auth.js', 'utf8');

const loginWithGoogleStr = `      // Salva sessão ativa
      sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      localStorage.setItem('z8_catalog_auth_user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('z8_catalog_auth_token', user.token);
      }`;

const loginWithGooglePatch = loginWithGoogleStr + `
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (user.role === 'admin' || user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
           window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
        }, 1000);
      }`;

content = content.replace(loginWithGoogleStr, loginWithGooglePatch);

const loginCatalogApiStr = `      sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
      localStorage.setItem('z8_catalog_auth_user', JSON.stringify(loggedUser));
      if (data.token) {
        localStorage.setItem('z8_catalog_auth_token', data.token);
      }`;

const loginCatalogApiPatch = loginCatalogApiStr + `
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (loggedUser.role === 'admin' || loggedUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
           window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
        }, 1000);
      }`;

content = content.replace(loginCatalogApiStr, loginCatalogApiPatch);

const loginCatalogOfflineStr = `        sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
        localStorage.setItem('z8_catalog_auth_user', JSON.stringify(loggedUser));`;

const loginCatalogOfflinePatch = loginCatalogOfflineStr + `
        const pendingApproval = sessionStorage.getItem('z8_pending_approval');
        if (pendingApproval && (loggedUser.role === 'admin' || loggedUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
          setTimeout(() => {
             updateUserStatus(pendingApproval, 'approved');
             sessionStorage.removeItem('z8_pending_approval');
             window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
          }, 1000);
        }`;

content = content.replace(loginCatalogOfflineStr, loginCatalogOfflinePatch);

fs.writeFileSync('site-principal/catalog-auth.js', content, 'utf8');
