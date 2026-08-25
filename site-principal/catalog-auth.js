// ==========================================================================
// Z8 E-Motion - Catalog Access Control, User Approval & Database Engine
// ==========================================================================

const USERS_STORAGE_KEY = 'z8_registered_users_directory';
const SESSION_KEY = 'z8_catalog_auth_token';
const SESSION_USER_KEY = 'z8_catalog_auth_user';

const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";
const MASTER_ADMIN_PASS = "@12345678@";

const DEFAULT_USERS = [
  {
    id: 'user_admin_01',
    name: 'Christian Admin',
    company: 'Z8 E-Motion Brasil (Matriz)',
    city: 'São Paulo - SP',
    email: 'christian.tkh@gmail.com',
    phone: '(11) 99999-8888',
    password: '@12345678@',
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_demo_01',
    name: 'Ricardo Oliveira',
    company: 'Mega Motos SP',
    city: 'Campinas - SP',
    email: 'ricardo@megamotos.com.br',
    phone: '(11) 98765-4321',
    password: 'z8partner123',
    role: 'partner',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export function getRegisteredUsers() {
  try {
    let users = [];
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      users = [...DEFAULT_USERS];
    } else {
      users = JSON.parse(raw);
    }

    // Auto-sync leads from CRM if any exists
    try {
      const crmRaw = localStorage.getItem('z8_crm_leads_data');
      if (crmRaw) {
        const leads = JSON.parse(crmRaw);
        leads.forEach(l => {
          if (l.email && !users.find(u => u.email.toLowerCase() === l.email.toLowerCase())) {
            users.push({
              id: 'user_lead_' + (l.id || Date.now()),
              name: l.name || 'Parceiro Z8',
              company: l.company || 'Empresa Parceira',
              city: l.city || 'São Paulo - SP',
              email: l.email.toLowerCase(),
              phone: l.phone || '',
              password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
              role: 'partner',
              status: 'pending',
              createdAt: l.createdAt || new Date().toISOString()
            });
          }
        });
      }
    } catch (e) {
      console.warn('CRM sync info:', e);
    }

    // Ensure admin is always approved
    const normalized = users.map(u => {
      if (u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        u.status = 'approved';
        u.role = 'admin';
      } else if (!u.status) {
        u.status = 'approved'; // default legacy users
      }
      return u;
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    return DEFAULT_USERS;
  }
}

export function createPartnerByAdmin(userData) {
  const users = getRegisteredUsers();
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  const isMaster = cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase();

  const newUserData = {
    id: existingIndex !== -1 ? users[existingIndex].id : 'user_adm_' + Date.now(),
    name: userData.name || 'Parceiro Z8',
    company: userData.company || userData.name || 'Empresa Parceira',
    city: userData.city || 'São Paulo - SP',
    email: cleanEmail,
    phone: userData.phone || '',
    password: userData.password || 'Z8@2026',
    role: isMaster ? 'admin' : 'partner',
    status: userData.status || 'approved',
    createdAt: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    users[existingIndex] = { ...users[existingIndex], ...newUserData };
  } else {
    users.unshift(newUserData);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return { success: true, user: newUserData };
}

export function registerCatalogUser(userData) {
  const users = getRegisteredUsers();
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'Este e-mail já possui um cadastro. Digite sua senha na aba de Entrar.' };
  }

  const isMaster = cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase();

  const newUser = {
    id: 'user_' + Date.now(),
    name: userData.name || 'Parceiro Z8',
    company: userData.company || userData.name || 'Empresa Parceira',
    city: userData.city || 'Não informada',
    email: cleanEmail,
    phone: userData.phone || '',
    password: userData.password || '',
    role: isMaster ? 'admin' : 'partner',
    status: isMaster ? 'approved' : 'pending', // Novo cadastro entra como pending até aprovação comercial
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Autentica o usuário imediatamente na sessão
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(newUser));
  localStorage.setItem('z8_catalog_auth_token', 'token_' + Date.now());

  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));

  return { success: true, user: newUser };
}

export function loginCatalogUser(userOrEmail, password) {
  const users = getRegisteredUsers();
  const clean = (userOrEmail || '').trim().toLowerCase();

  // 1. Check Master Admin Credentials
  if (clean === MASTER_ADMIN_EMAIL.toLowerCase() && password === MASTER_ADMIN_PASS) {
    const adminUser = {
      id: 'user_admin_master',
      name: 'Administrador Master',
      company: 'Z8 E-Motion (Matriz)',
      email: MASTER_ADMIN_EMAIL,
      role: 'admin',
      status: 'approved'
    };
    sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(adminUser));
    localStorage.setItem('z8_catalog_auth_user', JSON.stringify(adminUser));
    localStorage.setItem('z8_catalog_auth_token', 'token_master_' + Date.now());
    window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
    return { success: true, user: adminUser, isPending: false };
  }

  // 2. Check Registered Users Directory
  const found = users.find(u => u.email.toLowerCase() === clean || u.name.toLowerCase() === clean);
  if (!found) {
    return { success: false, error: 'Usuário ou e-mail não encontrado. Cadastre-se na aba ao lado.' };
  }

  if (found.password && found.password !== password) {
    return { success: false, error: 'Senha incorreta. Tente novamente ou recupere pelo WhatsApp.' };
  }

  if (found.status === 'blocked') {
    return { success: false, error: '🔴 Seu acesso foi temporariamente suspenso pela administração.' };
  }

  // Realiza o login (mesmo que pending, o usuário entra na conta, com restrição visual do catálogo)
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_token', 'token_' + Date.now());
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));

  return {
    success: true,
    user: found,
    isPending: found.status === 'pending'
  };
}

export function updateUserStatus(userId, newStatus) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const updated = users.map(u => {
    if (u.id === userId && u.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      u.status = newStatus;
      updatedUser = u;
    }
    return u;
  });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));

  // Se o usuário atual for o mesmo modificado, atualiza a sessão local
  const currentUser = getCurrentCatalogUser();
  if (currentUser && currentUser.id === userId && updatedUser) {
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
    localStorage.setItem('z8_catalog_auth_user', JSON.stringify(updatedUser));
  }

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return true;
}

export function deleteCatalogUser(userId) {
  const users = getRegisteredUsers();
  const filtered = users.filter(u => u.id !== userId || u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  return true;
}

export function getCurrentCatalogUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem('z8_catalog_auth_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Atualiza status se houver alteração no banco de usuários
    const users = getRegisteredUsers();
    const fresh = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    return fresh || user;
  } catch (err) {
    return null;
  }
}

export function isCatalogApproved() {
  const user = getCurrentCatalogUser();
  if (!user) return false;
  return user.status === 'approved' || user.role === 'admin' || user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
}

export function logoutCatalogUser() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem('z8_catalog_auth_user');
  localStorage.removeItem('z8_catalog_auth_token');
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
}

export function checkUrlApproval() {
  try {
    const params = new URLSearchParams(window.location.search);
    const approveEmail = params.get('approve_user') || params.get('liberar');
    if (approveEmail) {
      const clean = decodeURIComponent(approveEmail).trim().toLowerCase();
      const users = getRegisteredUsers();
      const found = users.find(u => u.email.toLowerCase() === clean);
      if (found) {
        updateUserStatus(found.id, 'approved');
      } else {
        createPartnerByAdmin({
          email: clean,
          name: clean.split('@')[0],
          company: 'Concessionária Parceira',
          status: 'approved'
        });
      }
      // Clean URL params without reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return clean;
    }
  } catch (e) {
    console.warn('URL approval check error:', e);
  }
  return null;
}

window.addEventListener('storage', (e) => {
  if (e.key === USERS_STORAGE_KEY || e.key === SESSION_USER_KEY || e.key === 'z8_catalog_auth_user') {
    window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
    window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  }
});
