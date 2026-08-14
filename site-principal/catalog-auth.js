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
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const users = JSON.parse(raw);
    // Ensure admin is always approved
    return users.map(u => {
      if (u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        u.status = 'approved';
        u.role = 'admin';
      } else if (!u.status) {
        u.status = 'approved'; // default legacy users
      }
      return u;
    });
  } catch (err) {
    return DEFAULT_USERS;
  }
}

export function registerCatalogUser(userData) {
  const users = getRegisteredUsers();
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'Este e-mail já possui um cadastro. Digite sua senha para entrar.' };
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
    status: isMaster ? 'approved' : 'pending', // Pending admin approval requirement!
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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
      company: 'Z8 Matriz',
      email: MASTER_ADMIN_EMAIL,
      role: 'admin',
      status: 'approved'
    };
    sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(adminUser));
    window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
    return { success: true, user: adminUser };
  }

  // 2. Check Registered Users Directory
  const found = users.find(u => u.email.toLowerCase() === clean || u.name.toLowerCase() === clean);
  if (!found) {
    return { success: false, error: 'Usuário ou e-mail não encontrado no banco de dados. Cadastre-se primeiro.' };
  }

  if (found.password && found.password !== password) {
    return { success: false, error: 'Senha incorreta. Tente novamente.' };
  }

  // 3. Check Admin Approval Status
  if (found.status === 'pending') {
    return {
      success: false,
      isPending: true,
      error: `⚠️ Sua conta (${found.email}) está AGUARDANDO APROVAÇÃO do Administrador Master (christian.tkh@gmail.com). Entre em contato ou aguarde a liberação do seu acesso.`
    };
  }

  if (found.status === 'blocked') {
    return { success: false, error: '🔴 Seu acesso foi temporariamente suspenso pelo Administrador.' };
  }

  // Approved User
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(found));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return { success: true, user: found };
}

export function updateUserStatus(userId, newStatus) {
  const users = getRegisteredUsers();
  const updated = users.map(u => {
    if (u.id === userId && u.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      u.status = newStatus;
    }
    return u;
  });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  return true;
}

export function getCurrentCatalogUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function isCatalogApproved() {
  const user = getCurrentCatalogUser();
  if (!user) return false;
  return user.status === 'approved' || user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
}

export function logoutCatalogUser() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
}
