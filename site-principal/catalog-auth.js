// ==========================================================================
// Z8 E-Motion - Catalog Access Control, User Approval & Database Engine
// ==========================================================================

const USERS_STORAGE_KEY = 'z8_registered_users_directory';
const SESSION_KEY = 'z8_catalog_auth_token';
const SESSION_USER_KEY = 'z8_catalog_auth_user';

const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";
const MASTER_ADMIN_PASS = "@12345678@";

const CLOUD_SYNC_ENDPOINT = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0368118f614aa';

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
    updatedAt: 1000,
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
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'user_ze_01',
    name: 'Zé da Silva',
    company: 'Silva Motos E-Motion',
    city: 'São Paulo - SP',
    email: 'zedasilva@loja.com.br',
    phone: '(11) 98765-4321',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date().toISOString()
  }
];

// Push current users array to cloud hub
export async function pushUsersToCloud(usersList) {
  try {
    await fetch(CLOUD_SYNC_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'z8_global_users_directory_hub',
        data: { users: usersList }
      })
    });
  } catch (err) {
    console.warn('Cloud sync push warning:', err);
  }
}

// Fetch all registered users from cloud hub and merge safely with local storage
export async function fetchUsersFromCloud() {
  try {
    const res = await fetch(CLOUD_SYNC_ENDPOINT);
    if (!res.ok) return null;
    const json = await res.json();
    const cloudUsers = json?.data?.users;
    if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
      const localUsers = getRegisteredUsers();
      let hasChanges = false;

      // Merge cloud users into local
      const mergedMap = new Map();
      localUsers.forEach(u => mergedMap.set(u.email.toLowerCase(), u));

      cloudUsers.forEach(cu => {
        const key = cu.email.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, cu);
          hasChanges = true;
        } else {
          const localU = mergedMap.get(key);
          const cloudTime = cu.updatedAt || 0;
          const localTime = localU.updatedAt || 0;

          // Se a nuvem tem timestamp estritamente mais recente, atualiza status
          if (cloudTime > localTime && cu.status && cu.status !== localU.status && key !== MASTER_ADMIN_EMAIL.toLowerCase()) {
            localU.status = cu.status;
            localU.updatedAt = cloudTime;
            hasChanges = true;
          }

          if (cu.name && !localU.name) {
            localU.name = cu.name;
            hasChanges = true;
          }
          if (cu.company && !localU.company) {
            localU.company = cu.company;
            hasChanges = true;
          }
          if (cu.phone && !localU.phone) {
            localU.phone = cu.phone;
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
    console.warn('Cloud sync fetch warning:', err);
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

    // Ensure default demo users exist
    DEFAULT_USERS.forEach(du => {
      if (!users.find(u => u.email.toLowerCase() === du.email.toLowerCase())) {
        users.push(du);
      }
    });

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
  pushUsersToCloud(users);
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
  pushUsersToCloud(users);

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

export function resetCatalogUserPassword(email, phone, newPassword) {
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
  pushUsersToCloud(users);

  // Auto-login with new password
  sessionStorage.setItem(SESSION_KEY, 'authenticated_active_catalog');
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_user', JSON.stringify(found));
  localStorage.setItem('z8_catalog_auth_token', 'token_' + Date.now());

  window.dispatchEvent(new CustomEvent('z8-catalog-users-updated'));
  window.dispatchEvent(new CustomEvent('z8-catalog-auth-changed'));

  return { success: true, user: found, message: 'Senha redefinida com sucesso! Você já está conectado.' };
}

export function updateUserStatus(userId, newStatus) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const now = Date.now();
  const updated = users.map(u => {
    if (u.id === userId && u.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      u.status = newStatus;
      u.updatedAt = now;
      updatedUser = u;
    }
    return u;
  });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  pushUsersToCloud(updated);

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
  pushUsersToCloud(filtered);
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
