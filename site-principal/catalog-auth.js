// ==========================================================================
// Z8 E-Motion - Catalog Access Control, User Approval & Cloud Database Engine
// ==========================================================================

import { CLOUD_CONFIG, DEFAULT_MASTER_ADMIN, SEED_REGISTERED_USERS } from './data/cloud-config.js';

const USERS_STORAGE_KEY = CLOUD_CONFIG.STORAGE_USERS_KEY;
const SESSION_KEY = CLOUD_CONFIG.STORAGE_SESSION_KEY;
const SESSION_USER_KEY = CLOUD_CONFIG.STORAGE_SESSION_USER_KEY;

const MASTER_ADMIN_EMAIL = CLOUD_CONFIG.MASTER_ADMIN_EMAIL;
const MASTER_ADMIN_PASS = "@12345678@";

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
      password: user.password || 'Z8@2026',
      updatedAt: user.updatedAt || Date.now(),
      createdAt: user.createdAt || new Date().toISOString()
    };

    // 1. Envia para o endpoint Serverless /api/users
    const res = await fetch(CLOUD_CONFIG.API_USERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      lastCloudSyncTime = Date.now();
      lastCloudSyncSuccess = true;
      return true;
    } else {
      console.warn('API /api/users respond code:', res.status);
    }
  } catch (err) {
    console.warn('Serverless API user push warning (armazenado localmente):', err);
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

// Busca todos os usuários cadastrados na nuvem central e mescla com o cache local
export async function fetchUsersFromCloud() {
  try {
    let cloudUsers = [];

    // 1. Consulta o endpoint serverless /api/users
    try {
      const res = await fetch(CLOUD_CONFIG.API_USERS_URL);
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.users)) {
          cloudUsers = json.users;
          lastCloudSyncTime = Date.now();
          lastCloudSyncSuccess = true;
        }
      }
    } catch (apiErr) {
      console.warn('API /api/users fetch info:', apiErr);
    }

    // 2. Consulta também leads do CRM (/api/leads) para importar cadastros comerciais
    try {
      const leadsRes = await fetch(CLOUD_CONFIG.API_LEADS_URL);
      if (leadsRes.ok) {
        const leadsJson = await leadsRes.json();
        if (Array.isArray(leadsJson?.leads)) {
          leadsJson.leads.forEach(ld => {
            const cleanLeadEmail = (ld.email || '').toLowerCase().trim();
            if (cleanLeadEmail && !cloudUsers.find(u => (u.email || '').toLowerCase() === cleanLeadEmail)) {
              cloudUsers.push({
                id: ld.id || ('lead_' + Date.now()),
                name: ld.name || 'Lead Comercial',
                company: ld.company || 'Empresa Interessada',
                city: ld.city || 'SP',
                email: cleanLeadEmail,
                phone: ld.phone || '',
                role: 'partner',
                status: ld.status === 'fechado' ? 'approved' : 'pending',
                password: 'Z8@' + (ld.phone ? ld.phone.replace(/\D/g, '').slice(-4) : '2026'),
                updatedAt: ld.updatedAt || 1000,
                createdAt: ld.createdAt || new Date().toISOString()
              });
            }
          });
        }
      }
    } catch (le) {
      console.warn('Leads fetch info:', le);
    }

    if (cloudUsers.length > 0) {
      const localUsers = getRegisteredUsers();
      let hasChanges = false;

      const mergedMap = new Map();
      localUsers.forEach(u => mergedMap.set(u.email.toLowerCase(), u));

      cloudUsers.forEach(cu => {
        const email = (cu.email || '').toLowerCase().trim();
        if (!email) return;

        const normalizedUser = {
          id: cu.id || ('user_' + Date.now()),
          name: cu.name || 'Parceiro Z8',
          company: cu.company || 'Empresa Parceira',
          city: cu.city || 'São Paulo - SP',
          email: email,
          phone: cu.phone || '',
          role: email === MASTER_ADMIN_EMAIL.toLowerCase() ? 'admin' : (cu.role || 'partner'),
          status: email === MASTER_ADMIN_EMAIL.toLowerCase() ? 'approved' : (cu.status || 'pending'),
          password: cu.password || 'Z8@2026',
          updatedAt: parseInt(cu.updatedAt || '1000', 10),
          createdAt: cu.createdAt || new Date().toISOString()
        };

        if (!mergedMap.has(email)) {
          mergedMap.set(email, normalizedUser);
          hasChanges = true;
        } else {
          const localU = mergedMap.get(email);
          const cloudTime = normalizedUser.updatedAt || 0;
          const localTime = localU.updatedAt || 0;

          // Se a nuvem tem atualização mais recente, atualiza status
          if (cloudTime >= localTime && normalizedUser.status && normalizedUser.status !== localU.status && email !== MASTER_ADMIN_EMAIL.toLowerCase()) {
            localU.status = normalizedUser.status;
            localU.updatedAt = cloudTime;
            hasChanges = true;
          }

          if (normalizedUser.name && (!localU.name || localU.name === 'Parceiro Z8' || localU.name === 'Lead Comercial')) {
            localU.name = normalizedUser.name;
            hasChanges = true;
          }
          if (normalizedUser.company && (!localU.company || localU.company === 'Empresa Parceira' || localU.company === 'Empresa Interessada')) {
            localU.company = normalizedUser.company;
            hasChanges = true;
          }
          if (normalizedUser.city && (!localU.city || localU.city === 'Não informada')) {
            localU.city = normalizedUser.city;
            hasChanges = true;
          }
          if (normalizedUser.phone && !localU.phone) {
            localU.phone = normalizedUser.phone;
            hasChanges = true;
          }
        }
      });

      const mergedList = Array.from(mergedMap.values()).map(u => {
        if (u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
          u.status = 'approved';
          u.role = 'admin';
        }
        return u;
      });

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mergedList));
      if (hasChanges) {
        window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
        window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
      }
      return mergedList;
    }
  } catch (err) {
    console.warn('Cloud fetch warning:', err);
  }
  return null;
}

export function getRegisteredUsers() {
  try {
    let users = [];
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      users = [...DEFAULT_USERS];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } else {
      users = JSON.parse(raw);
    }

    // Filtra e remove completamente e-mails de teste antigos
    users = users.filter(u => !TEST_DEMO_EMAILS.includes((u.email || '').toLowerCase().trim()));

    // 1. Garante a presença do Administrador Master
    DEFAULT_USERS.forEach(du => {
      if (!users.find(u => u.email.toLowerCase() === du.email.toLowerCase())) {
        users.unshift(du);
      }
    });

    // 2. Auto-sync active session user if stored
    try {
      const sessionUserRaw = localStorage.getItem('z8_catalog_auth_user') || sessionStorage.getItem('z8_catalog_auth_user');
      if (sessionUserRaw) {
        const su = JSON.parse(sessionUserRaw);
        if (su.email && !TEST_DEMO_EMAILS.includes(su.email.toLowerCase()) && !users.find(u => u.email.toLowerCase() === su.email.toLowerCase())) {
          users.push({
            id: su.id || ('user_sess_' + Date.now()),
            name: su.name || 'Parceiro Z8',
            company: su.company || 'Loja Parceira',
            city: su.city || 'São Paulo - SP',
            email: su.email.toLowerCase(),
            phone: su.phone || '',
            password: su.password || 'z8@2026',
            role: su.role || 'partner',
            status: su.status || 'pending',
            updatedAt: 1000,
            createdAt: su.createdAt || new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn('Session user sync info:', e);
    }

    // 3. Ensure admin is always master approved
    const normalized = users.map(u => {
      if (u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        u.status = 'approved';
        u.role = 'admin';
      } else if (!u.status) {
        u.status = 'pending';
      }
      return u;
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    return DEFAULT_USERS;
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
    password: userData.password || 'Z8@2026',
    role: isMaster ? 'admin' : 'partner',
    status: userData.status || 'approved',
    updatedAt: Date.now(),
    createdAt: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    users[existingIndex] = { ...users[existingIndex], ...newUserData };
  } else {
    users.unshift(newUserData);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  await pushUserToFirestore(newUserData);
  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));
  return { success: true, user: newUserData };
}

export async function registerCatalogUser(userData) {
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
    city: userData.city || 'São Paulo - SP',
    email: cleanEmail,
    phone: userData.phone || '',
    password: userData.password || '',
    role: isMaster ? 'admin' : 'partner',
    status: isMaster ? 'approved' : 'pending', // Novo cadastro entra como pending até aprovação comercial
    updatedAt: Date.now(),
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Grava imediatamente no Servidor / Nuvem Central
  await pushUserToFirestore(newUser);

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

  if (!cleanPass || cleanPass.length < 4) {
    return { success: false, error: 'A nova senha deve ter no mínimo 4 caracteres.' };
  }

  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, error: 'E-mail não encontrado no sistema. Verifique a digitação ou crie uma conta na aba de cadastro.' };
  }

  // Security check: if phone was provided, verify matching digits
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

  // Auto-login with new password
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_token', 'token_' + Date.now());

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));

  return { success: true, user: found, message: 'Senha redefinida com sucesso! Você já está conectado.' };
}

export async function updateUserStatus(userId, newStatus) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const now = Date.now();
  const searchKey = String(userId).trim().toLowerCase();

  const updated = users.map(u => {
    const isTarget = (
      String(u.id).toLowerCase() === searchKey ||
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
  if (updatedUser) {
    await pushUserToFirestore(updatedUser);
  }

  // Sincroniza status no banco de Leads do CRM se existir
  try {
    const crmRaw = localStorage.getItem('z8_crm_leads_data');
    if (crmRaw && updatedUser) {
      const leads = JSON.parse(crmRaw);
      const crmUpdated = leads.map(l => {
        if (l.email && l.email.toLowerCase() === updatedUser.email.toLowerCase()) {
          l.status = newStatus;
        }
        return l;
      });
      localStorage.setItem('z8_crm_leads_data', JSON.stringify(crmUpdated));
    }
  } catch (e) {
    console.warn('CRM leads status sync error:', e);
  }

  // Se o usuário atual for o mesmo modificado, atualiza a sessão local
  const currentUser = getCurrentCatalogUser();
  if (currentUser && updatedUser && (String(currentUser.id).toLowerCase() === String(updatedUser.id).toLowerCase() || currentUser.email.toLowerCase() === updatedUser.email.toLowerCase())) {
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

  try {
    await fetch(`${CLOUD_CONFIG.API_USERS_URL}?id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, email: toDelete?.email })
    });
  } catch (err) {
    console.warn('Delete cloud user warning:', err);
  }

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  return true;
}

export function getCurrentCatalogUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem('z8_catalog_auth_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
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
      const name = params.get('name') ? decodeURIComponent(params.get('name')) : clean.split('@')[0];
      const company = params.get('company') ? decodeURIComponent(params.get('company')) : 'Concessionária Parceira';
      const city = params.get('city') ? decodeURIComponent(params.get('city')) : 'São Paulo - SP';
      const phone = params.get('phone') ? decodeURIComponent(params.get('phone')) : '';

      const users = getRegisteredUsers();
      const found = users.find(u => u.email.toLowerCase() === clean);
      if (found) {
        found.status = 'approved';
        if (name && !found.name) found.name = name;
        if (company && !found.company) found.company = company;
        if (city && !found.city) found.city = city;
        if (phone && !found.phone) found.phone = phone;
        updateUserStatus(found.id, 'approved');
      } else {
        createPartnerByAdmin({
          email: clean,
          name: name,
          company: company,
          city: city,
          phone: phone,
          status: 'approved'
        });
      }
      // Limpa os parâmetros da URL sem recarregar
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
