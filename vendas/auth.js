// ==========================================================================
// Z8 E-Motion - Authentication, Registration & Master Admin Engine
// ==========================================================================

const SESSION_KEY = 'z8_crm_auth_token';
const SESSION_USER_KEY = 'z8_crm_auth_user';
const USERS_STORAGE_KEY = 'z8_registered_users_directory';

// Official Master Admin Credentials
const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";
const MASTER_ADMIN_PASS = "@12345678@";

// Initial Registered Users Directory
const DEFAULT_USERS = [
  {
    id: 'user_admin_01',
    name: 'Christian Admin',
    company: 'Z8 E-Motion Brasil (Matriz)',
    email: 'christian.tkh@gmail.com',
    phone: '(11) 99999-8888',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_demo_01',
    name: 'Ricardo Oliveira',
    company: 'Mega Motos SP',
    email: 'ricardo@megamotos.com.br',
    phone: '(11) 98765-4321',
    role: 'partner',
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
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_USERS;
  }
}

export function registerUser(userData) {
  const users = getRegisteredUsers();
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  // Check if email already exists
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'Este e-mail já está cadastrado no sistema. Faça login.' };
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name: userData.name || 'Novo Parceiro',
    company: userData.company || userData.name || 'Empresa Parceira',
    city: userData.city || 'Não informada',
    email: cleanEmail,
    phone: userData.phone || '',
    investment: userData.investment || 'R$ 22.600,00 (Lote Econômico)',
    hasStore: userData.hasStore || 'Não',
    password: userData.password || 'z8partner123',
    role: cleanEmail === MASTER_ADMIN_EMAIL ? 'admin' : 'partner',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  window.dispatchEvent(new CustomEvent('z8-user-registered', { detail: newUser }));
  return { success: true, user: newUser };
}

export function isAuthenticated() {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    return token === 'authenticated_active_session_z8';
  } catch (err) {
    return false;
  }
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function login(emailOrUser, password) {
  const cleanUser = (emailOrUser || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Check Master Admin Credentials
  if (cleanUser === MASTER_ADMIN_EMAIL && cleanPass === MASTER_ADMIN_PASS) {
    const adminUser = { name: 'Christian Admin', email: MASTER_ADMIN_EMAIL, role: 'admin' };
    sessionStorage.setItem(SESSION_KEY, 'authenticated_active_session_z8');
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }

  // Check Registered Users Directory
  const users = getRegisteredUsers();
  const foundUser = users.find(u => u.email.toLowerCase() === cleanUser && u.password === cleanPass);

  if (foundUser) {
    sessionStorage.setItem(SESSION_KEY, 'authenticated_active_session_z8');
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(foundUser));
    return { success: true, user: foundUser };
  }

  return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
  } catch (err) {
    console.error('Logout error:', err);
  }
}
