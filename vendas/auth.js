// ==========================================================================
// Z8 E-Motion - Hardened Authentication & CRM Access Engine (Landing Page)
// Zero Plaintext Credentials, PBKDF2/Serverless Login & Zero-Knowledge Model
// ==========================================================================

const SESSION_KEY = 'z8_crm_auth_token';
const SESSION_USER_KEY = 'z8_crm_auth_user';
const USERS_STORAGE_KEY = 'z8_registered_users_directory';

// Official Master Admin Email
const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";

export function getRegisteredUsers() {
  try {
    const currentUser = getCurrentUser();
    const isMaster = currentUser && (currentUser.email || '').toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

    // Zero-Knowledge Client: Visitantes e parceiros regulares nunca armazenam o diretório global
    if (!isMaster) {
      localStorage.removeItem(USERS_STORAGE_KEY);
      return currentUser ? [currentUser] : [];
    }

    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export async function registerUser(userData) {
  const cleanEmail = (userData.email || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail corporativo válido.' };
  }

  if (userData.b_company_trap) {
    return { success: false, error: 'Requisição inválida.' };
  }

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
        password: userData.password,
        b_company_trap: userData.b_company_trap || ''
      })
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data?.user) {
      sessionStorage.setItem(SESSION_KEY, data.token || 'authenticated_active_session_z8');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent('z8-user-registered', { detail: data.user }));
      return { success: true, user: data.user };
    } else if (data && data.error) {
      return { success: false, error: data.error };
    }
  } catch (apiErr) {
    console.warn('API registration error:', apiErr);
  }

  return { success: false, error: 'Não foi possível registrar o parceiro. Tente novamente mais tarde.' };
}

export function isAuthenticated() {
  try {
    const token = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem('z8_catalog_auth_token');
    return Boolean(token && (token.startsWith('authenticated_') || token.startsWith('z8s.')));
  } catch (err) {
    return false;
  }
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem('z8_catalog_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export async function login(emailOrUser, password, trap = '') {
  if (trap) {
    return { success: false, error: 'Requisição inválida.' };
  }

  const cleanUser = (emailOrUser || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Por favor, informe seu e-mail e senha.' };
  }

  // Autenticação no backend protegido (/api/users)
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: cleanUser, password: cleanPass, b_company_trap: trap })
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data?.user) {
      sessionStorage.setItem(SESSION_KEY, data.token || 'authenticated_active_session_z8');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else if (data && data.error) {
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.warn('API authentication error in landing page:', err);
  }

  return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

