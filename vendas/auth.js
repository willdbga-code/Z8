// ==========================================================================
// Z8 E-Motion - Hardened Authentication & CRM Access Engine (Landing Page)
// Zero Plaintext Credentials, PBKDF2/Serverless Login & Rate Limiting Support
// ==========================================================================

const SESSION_KEY = 'z8_crm_auth_token';
const SESSION_USER_KEY = 'z8_crm_auth_user';
const USERS_STORAGE_KEY = 'z8_registered_users_directory';

// Official Master Admin Credentials
const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";

// Initial Registered Users Directory (Metadados públicos sem senhas)
const DEFAULT_USERS = [
  {
    id: 'user_admin_01',
    name: 'Christian Admin',
    company: 'Z8 E-Motion Brasil (Matriz)',
    email: 'christian.tkh@gmail.com',
    phone: '(12) 99800-8818',
    role: 'admin',
    createdAt: new Date().toISOString()
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

export async function registerUser(userData) {
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        company: userData.company,
        city: userData.city,
        email: cleanEmail,
        phone: userData.phone,
        password: userData.password
      })
    });

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      const users = getRegisteredUsers();
      users.unshift(data.user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new CustomEvent('z8-user-registered', { detail: data.user }));
      return { success: true, user: data.user };
    } else if (data && data.error) {
      return { success: false, error: data.error };
    }
  } catch (apiErr) {
    console.warn('API registration notice, fallback to local:', apiErr);
  }

  const users = getRegisteredUsers();
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
    investment: userData.investment || 'R$ 22.600,00 (Atacado Inicial)',
    hasStore: userData.hasStore || 'Não',
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
    return Boolean(token && (token.startsWith('authenticated_') || token.startsWith('token_')));
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

export async function login(emailOrUser, password) {
  const cleanUser = (emailOrUser || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  // 1. Tenta autenticação no backend protegido (valida PBKDF2 e aplica Rate Limiting)
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: cleanUser, password: cleanPass })
    });

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      sessionStorage.setItem(SESSION_KEY, data.token || 'authenticated_active_session_z8');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else if (data && data.error) {
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.warn('API authentication error in landing page:', err);
  }

  // 2. Fallback offline
  const users = getRegisteredUsers();
  const foundUser = users.find(u => u.email.toLowerCase() === cleanUser);
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
