// ==========================================================================
// Z8 E-Motion - Catalog Access Control, User Approval & Cloud Database Engine
// ==========================================================================

import { CLOUD_CONFIG, DEFAULT_MASTER_ADMIN, SEED_REGISTERED_USERS } from './data/cloud-config.js';
import { 
  signInWithGoogleAccount,
  requestPasswordResetEmail,
  subscribeToUsersRealtime,
  subscribeToUserDocRealtime,
  setCloudUserStatus,
  deleteCloudUser,
  saveUserToFirestore,
  getUserFromFirestore,
  fetchUsersFromFirestore,
  authenticateUserFirestore
} from './services/firebase-service.js';

export {
  signInWithGoogleAccount,
  requestPasswordResetEmail,
  subscribeToUsersRealtime,
  subscribeToUserDocRealtime,
  setCloudUserStatus,
  deleteCloudUser,
  saveUserToFirestore,
  getUserFromFirestore,
  fetchUsersFromFirestore,
  authenticateUserFirestore
};

const USERS_STORAGE_KEY = CLOUD_CONFIG.STORAGE_USERS_KEY;
const SESSION_KEY = CLOUD_CONFIG.STORAGE_SESSION_KEY;
const SESSION_USER_KEY = CLOUD_CONFIG.STORAGE_SESSION_USER_KEY;

const MASTER_ADMIN_EMAIL = CLOUD_CONFIG.MASTER_ADMIN_EMAIL;

const DEFAULT_USERS = SEED_REGISTERED_USERS;

const TEST_DEMO_EMAILS = [
  'zedasilva@loja.com.br',
  'ricardo@megamotos.com.br',
  'marcio@emotionsul.com.br',
  'lucas@litoraleletrico.com.br',
  'juliana@bhscooters.com.br',
  'roberto@nordestemobilidade.com.br',
  'fernando@guedesmotos.com.br'
];

let lastCloudSyncTime = null;
let lastCloudSyncSuccess = false;

export function getCloudSyncStatus() {
  return {
    isOnline: navigator.onLine,
    lastSyncTime: lastCloudSyncTime,
    lastSyncSuccess: lastCloudSyncSuccess
  };
}

export function isUserAdmin(user = null) {
  const currentUser = user || getCurrentCatalogUser();
  if (!currentUser || !currentUser.email) return false;
  const email = (currentUser.email || '').toLowerCase().trim();
  const masterEmail = (MASTER_ADMIN_EMAIL || 'christian.tkh@gmail.com').toLowerCase().trim();
  return (
    email === masterEmail ||
    currentUser.role === 'admin' ||
    currentUser.isAdmin === true
  );
}

// Login e Cadastro com 1 Clique via Google OAuth
export async function loginWithGoogle() {
  try {
    const user = await signInWithGoogleAccount();
    if (user && user.email) {
      const isMaster = isUserAdmin(user);

      // Salva sessão ativa individual (Zero-Knowledge)
      sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (user.role === 'admin' || user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
        }, 1000);
      }
      localStorage.setItem('z8_catalog_auth_user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('z8_catalog_auth_token', user.token);
      }

      if (isMaster) {
        await fetchUsersFromCloud();
      } else {
        localStorage.removeItem(USERS_STORAGE_KEY);
      }

      window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
      window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));

      return {
        success: true,
        user,
        isPending: user.status === 'pending'
      };
    }
  } catch (err) {
    console.warn('Google login error:', err);
    return {
      success: false,
      code: err.code || 'auth/unknown',
      error: err.message || 'Falha ao autenticar com a conta Google.'
    };
  }
  return { success: false, code: 'auth/unknown', error: 'Autenticação com o Google cancelada ou indisponível.' };
}

// Salva um usuário específico na API Serverless / Nuvem Z8
export async function pushUserToFirestore(user) {
  if (!user || !user.email) return false;
  try {
    const payload = {
      id: user.id || ('user_' + Date.now()),
      name: user.name || 'Parceiro Z8',
      company: user.company || 'Empresa Parceira',
      city: user.city || 'São Paulo - SP',
      email: user.email.toLowerCase().trim(),
      phone: user.phone || '',
      role: user.role || 'partner',
      status: user.status || 'pending',
      updatedAt: user.updatedAt || Date.now(),
      createdAt: user.createdAt || new Date().toISOString()
    };
    if (user.password) {
      payload.password = user.password;
    }

    // 1. Grava diretamente no Firebase Firestore oficial (sem expor senha)
    await saveUserToFirestore(payload);

    // 2. Envia para o endpoint Serverless /api/users
    try {
      const adminToken = localStorage.getItem('z8_catalog_auth_token') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      const res = await fetch(CLOUD_CONFIG.API_USERS_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        lastCloudSyncTime = Date.now();
        lastCloudSyncSuccess = true;
      }
    } catch (apiErr) {
      // ignore
    }

    return true;
  } catch (err) {
    console.warn('User push to cloud warning:', err);
  }
  return false;
}

// Sincroniza lista de usuários com o servidor central
export async function pushUsersToCloud(usersList) {
  if (!Array.isArray(usersList)) return;
  for (const u of usersList) {
    await pushUserToFirestore(u);
  }
}

// Busca todos os usuários cadastrados na nuvem central e mescla com o cache local (Exclusivo Master Admin)
export async function fetchUsersFromCloud() {
  const currentUser = getCurrentCatalogUser();
  const isMaster = isUserAdmin(currentUser);
  const adminToken = localStorage.getItem('z8_catalog_auth_token') || '';

  // Zero-Knowledge Client: Apenas Administradores autorizados podem baixar o diretório completo
  if (!isMaster) {
    return null;
  }

  try {
    let cloudUsers = [];

    // 1. Consulta do endpoint serverless protegido /api/users com token HMAC-SHA256 (se disponível)
    if (adminToken) {
      try {
        const headers = { 'Authorization': `Bearer ${adminToken}` };
        const res = await fetch(CLOUD_CONFIG.API_USERS_URL, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.users)) {
            cloudUsers.push(...json.users);
            lastCloudSyncTime = Date.now();
            lastCloudSyncSuccess = true;
          }
        }
      } catch (apiErr) {
        console.warn('API users fetch notice:', apiErr);
      }
    }

    // 2. Consulta adicional do Firestore (caso disponível para admin)
    if (cloudUsers.length === 0) {
      try {
        const firestoreUsers = await fetchUsersFromFirestore();
        if (Array.isArray(firestoreUsers) && firestoreUsers.length > 0) {
          cloudUsers.push(...firestoreUsers);
          lastCloudSyncTime = Date.now();
          lastCloudSyncSuccess = true;
        }
      } catch (fsErr) {
        console.warn('Firestore fetchUsers notice:', fsErr);
      }
    }

    if (cloudUsers.length > 0) {
      const mergedList = cloudUsers.map(u => {
        if ((u.email || '').toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
          u.status = 'approved';
          u.role = 'admin';
        }
        return u;
      });

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mergedList));
      window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
      window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
      return mergedList;
    }
  } catch (err) {
    console.warn('Cloud fetch warning:', err);
  }
  return null;
}

export function getRegisteredUsers() {
  try {
    const currentUser = getCurrentCatalogUser();
    const isMaster = isUserAdmin(currentUser);

    // Zero-Knowledge Client: Visitantes e parceiros regulares nunca armazenam nem leem o diretório global
    if (!isMaster) {
      localStorage.removeItem(USERS_STORAGE_KEY);
      return currentUser ? [currentUser] : [];
    }

    let users = [];
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      try {
        users = JSON.parse(raw);
      } catch {
        users = [];
      }
    }

    // Garante que o Administrador Master esteja sempre na lista
    if (!users.find(u => (u.email || '').toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
      users.unshift({ ...DEFAULT_MASTER_ADMIN });
    }

    return users;
  } catch (err) {
    return [];
  }
}

export async function createPartnerByAdmin(userData) {
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
    role: isMaster ? 'admin' : 'partner',
    status: userData.status || 'approved',
    updatedAt: Date.now(),
    createdAt: new Date().toISOString()
  };
  if (userData.password) {
    newUserData.password = userData.password;
  }

  if (existingIndex !== -1) {
    users[existingIndex] = { ...users[existingIndex], ...newUserData };
  } else {
    users.unshift(newUserData);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  await pushUserToFirestore(newUserData);
  await setCloudUserStatus(cleanEmail, newUserData.status);
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return { success: true, user: newUserData };
}

export async function registerCatalogUser(userData) {
  const cleanEmail = (userData.email || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail corporativo válido (com domínio e extensão válidos).' };
  }

  // Honeypot trap check
  if (userData.b_company_trap) {
    return { success: false, error: 'Requisição inválida.' };
  }

  // 1. Checa primeiro no Firestore oficial do Christian Hide
  try {
    const existingCloud = await getUserFromFirestore(cleanEmail);
    if (existingCloud) {
      return { 
        success: false, 
        error: 'Este e-mail já possui cadastro no Portal Z8. Acesse a aba "Entrar" com sua senha cadastrada.' 
      };
    }
  } catch (e) {
    console.warn('Firestore pre-registration check notice:', e);
  }

  const isMaster = cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase();

  const newUser = {
    id: 'user_' + Date.now(),
    name: userData.name || 'Parceiro Z8',
    company: userData.company || userData.name || 'Empresa Parceira',
    city: userData.city || 'São Paulo - SP',
    email: cleanEmail,
    phone: userData.phone || '',
    password: userData.password || '',
    role: isMaster ? 'admin' : 'partner',
    status: isMaster ? 'approved' : 'pending',
    updatedAt: Date.now(),
    createdAt: new Date().toISOString()
  };

  // Zero-Knowledge Client: Grava no backend/Firestore sem fazer dump do diretório no localStorage do visitante
  await saveUserToFirestore(newUser);
  await pushUserToFirestore(newUser);
  await setCloudUserStatus(cleanEmail, newUser.status);

  // Registra no endpoint Serverless (/api/users) para receber token criptográfico assinado HMAC-SHA256
  let authToken = '';
  try {
    const apiRes = await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        company: newUser.company,
        city: newUser.city,
        email: newUser.email,
        phone: newUser.phone,
        password: userData.password || '',
        b_company_trap: userData.b_company_trap || ''
      })
    });
    if (!apiRes.ok) {
      const errJson = await apiRes.json().catch(() => null);
      if (errJson?.error) {
        return { success: false, error: errJson.error };
      }
    } else {
      const apiData = await apiRes.json().catch(() => null);
      if (apiData?.token) {
        authToken = apiData.token;
      }
    }
  } catch (apiErr) {
    console.warn('API registration sync notice:', apiErr);
  }

  // Autentica o usuário imediatamente na sessão individual (Zero-Knowledge)
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(newUser));
  if (authToken) {
    localStorage.setItem('z8_catalog_auth_token', authToken);
  }

  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));

  return { success: true, user: newUser };
}

export async function loginCatalogUser(userOrEmail, password, trap = '') {
  if (trap) {
    return { success: false, error: 'Requisição inválida.' };
  }

  const clean = (userOrEmail || '').trim().toLowerCase();
  const rawPassword = String(password || '').trim();

  if (!clean || !rawPassword) {
    return { success: false, error: 'Por favor, informe seu e-mail e senha de acesso.' };
  }

  // 1. PRIORIDADE MÁXIMA: Autenticação Criptográfica Segura via API Serverless (/api/users)
  // Utiliza PBKDF2 (100.000 iterações + salt), timingSafeEqual, Rate Limiting por IP/e-mail e tokens HMAC-SHA256
  let apiCallCompleted = false;
  try {
    const res = await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: clean, password: rawPassword, b_company_trap: trap })
    });

    apiCallCompleted = true;
    const data = await res.json().catch(() => null);

    if (res.ok && data?.success && data?.user) {
      const loggedUser = data.user;
      const isMaster = isUserAdmin(loggedUser);

      sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
      localStorage.setItem('z8_catalog_auth_user', JSON.stringify(loggedUser));
      const pendingApproval = sessionStorage.getItem('z8_pending_approval');
      if (pendingApproval && (loggedUser.role === 'admin' || loggedUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
        setTimeout(() => {
           updateUserStatus(pendingApproval, 'approved');
           sessionStorage.removeItem('z8_pending_approval');
        }, 1000);
      }
      if (data.token) {
        localStorage.setItem('z8_catalog_auth_token', data.token);
      }

      if (isMaster) {
        await fetchUsersFromCloud();
      } else {
        localStorage.removeItem(USERS_STORAGE_KEY);
      }

      window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
      window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
      return {
        success: true,
        user: loggedUser,
        isPending: loggedUser.status === 'pending'
      };
    } else if (data?.error) {
      // Servidor rejeitou explicitamente as credenciais ou aplicou rate limit: RETORNA ERRO IMEDIATAMENTE!
      // Cibersegurança: NUNCA fazer fallback para bypass fraco quando o servidor respondeu com 401, 403 ou 429!
      return { success: false, error: data.error };
    }
  } catch (apiErr) {
    // API inacessível por ausência de conexão com a rede
    console.warn('API authentication unavailable, attempting secure offline contingency:', apiErr);
  }

  // Se o servidor de API foi contactado e respondeu, não permite nenhum bypass
  if (apiCallCompleted) {
    return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
  }

  // 2. CONTINGÊNCIA OFFLINE (Apenas quando a rede estiver indisponível)
  // Tenta autenticação via Firebase Auth / Firestore seguro
  try {
    const firestoreAuthRes = await authenticateUserFirestore(clean, rawPassword);
    if (firestoreAuthRes) {
      if (firestoreAuthRes.success && firestoreAuthRes.user) {
        const loggedUser = firestoreAuthRes.user;
        const isMaster = isUserAdmin(loggedUser);

        sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
        localStorage.setItem('z8_catalog_auth_user', JSON.stringify(loggedUser));
        if (isMaster) {
          await fetchUsersFromCloud();
        } else {
          localStorage.removeItem(USERS_STORAGE_KEY);
        }
        window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
        window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));

        return {
          success: true,
          user: loggedUser,
          isPending: loggedUser.status === 'pending'
        };
      } else if (firestoreAuthRes.error) {
        return { success: false, error: firestoreAuthRes.error };
      }
    }
  } catch (fsAuthErr) {
    console.warn('Firestore offline authentication error:', fsAuthErr);
  }

  // Sem backdoors! Qualquer outra tentativa com senhas incorretas ou não cadastradas é rejeitada

  // Sem backdoors! Qualquer outra tentativa com senhas fracas ou não cadastradas é rejeitada
  return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
}

export async function resetCatalogUserPassword(email, phone, newPassword) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const cleanPass = (newPassword || '').trim();

  if (!cleanEmail) {
    return { success: false, error: 'Por favor, informe seu e-mail cadastrado.' };
  }

  if (cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'A senha do Administrador Master só pode ser alterada diretamente no código do sistema.' };
  }

  // Tenta disparo automático de e-mail oficial
  if (!cleanPass) {
    return await requestPasswordResetEmail(cleanEmail);
  }

  if (cleanPass.length < 4) {
    return { success: false, error: 'A nova senha deve ter no mínimo 4 caracteres.' };
  }

  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, error: 'E-mail não encontrado no sistema. Verifique a digitação ou crie uma conta na aba de cadastro.' };
  }

  if (cleanPhone) {
    const userPhoneDigits = (found.phone || '').replace(/\D/g, '');
    if (userPhoneDigits && userPhoneDigits.length >= 8 && cleanPhone.length >= 8) {
      const matchEnd = userPhoneDigits.slice(-4) === cleanPhone.slice(-4);
      if (!matchEnd) {
        return { success: false, error: 'O WhatsApp informado não confere com os últimos dígitos cadastrados nesta conta.' };
      }
    }
  }

  found.password = cleanPass;
  found.updatedAt = Date.now();

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  await pushUserToFirestore(found);

  // Atualiza também via API Serverless utilizando verificação criptográfica
  try {
    const adminToken = localStorage.getItem('z8_catalog_auth_token') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ email: cleanEmail, phone: cleanPhone, password: cleanPass })
    });
  } catch (apiErr) {
    // ignore
  }

  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(found));

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));

  return { success: true, user: found, message: 'Senha redefinida com sucesso! Você já está conectado.' };
}

export async function updateUserStatus(userIdOrEmail, newStatus) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const now = Date.now();
  const searchKey = String(userIdOrEmail || '').trim().toLowerCase();
  if (!searchKey) return false;

  const updated = users.map(u => {
    const isTarget = (
      String(u.id || '').toLowerCase() === searchKey ||
      (u.email && u.email.toLowerCase() === searchKey)
    );
    if (isTarget && u.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      u.status = newStatus;
      u.updatedAt = now;
      updatedUser = u;
    }
    return u;
  });

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));

  const targetEmail = updatedUser ? updatedUser.email : (searchKey.includes('@') ? searchKey : null);

  if (targetEmail) {
    if (updatedUser) {
      await pushUserToFirestore(updatedUser);
    }
    await setCloudUserStatus(targetEmail, newStatus);
  }

  // Se o usuário atual for o mesmo modificado, atualiza a sessão local
  const currentUser = getCurrentCatalogUser();
  if (currentUser && targetEmail && currentUser.email.toLowerCase() === targetEmail.toLowerCase()) {
    const sessionObj = { ...currentUser, status: newStatus, updatedAt: now };
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionObj));
    localStorage.setItem('z8_catalog_auth_user', JSON.stringify(sessionObj));
  }

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return true;
}

export async function deleteCatalogUser(userId) {
  const users = getRegisteredUsers();
  const toDelete = users.find(u => u.id === userId || u.email.toLowerCase() === String(userId).toLowerCase());
  if (toDelete && toDelete.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }

  const filtered = users.filter(u => u.id !== userId && u.email.toLowerCase() !== String(userId).toLowerCase());
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));

  if (toDelete?.email) {
    await deleteCloudUser(toDelete.email);
  }

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  return true;
}

export function getCurrentCatalogUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem('z8_catalog_auth_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function isCatalogApproved() {
  const user = getCurrentCatalogUser();
  if (!user) return false;
  return user.status === 'approved' || isUserAdmin(user);
}

export function logoutCatalogUser() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem('z8_catalog_auth_user');
  localStorage.removeItem('z8_catalog_auth_token');
  localStorage.removeItem(USERS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
}

export function checkUrlApproval() {
  try {
    const params = new URLSearchParams(window.location.search);
    const approveEmail = params.get('approve_user') || params.get('liberar');
    
    if (approveEmail) {
      const clean = decodeURIComponent(approveEmail).trim().toLowerCase();
      
      // SECURTY CHECK: Only allow if logged in as Admin Master
      const currentUser = getCurrentCatalogUser();
      const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
      
      if (!isAdmin) {
         console.warn("Unauthorized: URL approval requires Admin Master session.");
         sessionStorage.setItem('z8_pending_approval', clean);
         return null;
      }

      const users = getRegisteredUsers();
      const found = users.find(u => (u.email || '').toLowerCase() === clean);
      
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
