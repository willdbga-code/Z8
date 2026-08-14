// ==========================================================================
// Z8 E-Motion - Authentication & Exclusive Access Engine
// Executive Admin Access Gate for CRM & Sales Analytics
// ==========================================================================

const SESSION_KEY = 'z8_crm_auth_token';

// Default Master Credentials
const MASTER_USER = "admin@z8emotion.com.br";
const MASTER_ALT_USER = "z8admin";
const MASTER_PASS = "Z8@2026#Executive";

export function isAuthenticated() {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    return token === 'authenticated_active_session_z8';
  } catch (err) {
    return false;
  }
}

export function login(username, password) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if ((cleanUser === MASTER_USER || cleanUser === MASTER_ALT_USER) && cleanPass === MASTER_PASS) {
    sessionStorage.setItem(SESSION_KEY, 'authenticated_active_session_z8');
    return { success: true };
  }

  return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha de administrador.' };
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Logout error:', err);
  }
}
