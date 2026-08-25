// ==========================================================================
// Z8 E-Motion - Catalog Access Control, User Approval & Database Engine
// ==========================================================================

const USERS_STORAGE_KEY = 'z8_registered_users_directory';
const SESSION_KEY = 'z8_catalog_auth_token';
const SESSION_USER_KEY = 'z8_catalog_auth_user';

const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";
const MASTER_ADMIN_PASS = "@12345678@";

const FIREBASE_API_KEY = "AIzaSyDxBfXwvrBt19dQbxqGYkVmFIl_S87VOdU";
const FIREBASE_PROJECT_ID = "william-site-43963";
const FIRESTORE_USERS_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/catalog_users`;

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
  },
  {
    id: 'user_demo_03',
    name: 'Marcio Silva',
    company: 'E-Motion Sul Distribuidora',
    city: 'Curitiba - PR',
    email: 'marcio@emotionsul.com.br',
    phone: '(41) 99111-2233',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'user_demo_04',
    name: 'Lucas Santos',
    company: 'Litoral Elétrico Santos',
    city: 'Santos - SP',
    email: 'lucas@litoraleletrico.com.br',
    phone: '(13) 99222-3344',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'user_demo_05',
    name: 'Juliana Ferreira',
    company: 'BH Scooters & Bikes Elétricas',
    city: 'Belo Horizonte - MG',
    email: 'juliana@bhscooters.com.br',
    phone: '(31) 99333-4455',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'user_demo_06',
    name: 'Roberto Albuquerque',
    company: 'Nordeste Mobilidade E-Motion',
    city: 'Recife - PE',
    email: 'roberto@nordestemobilidade.com.br',
    phone: '(81) 99444-5566',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'user_demo_07',
    name: 'Fernando Guedes',
    company: 'Guedes E-Motors',
    city: 'Ribeirão Preto - SP',
    email: 'fernando@guedesmotos.com.br',
    phone: '(16) 99555-6677',
    password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
    role: 'partner',
    status: 'pending',
    updatedAt: 1000,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

// Salva um usuário específico no Firebase Firestore Real
export async function pushUserToFirestore(user) {
  if (!user || !user.email) return;
  try {
    const docId = encodeURIComponent(user.email.toLowerCase().trim());
    const body = {
      fields: {
        id: { stringValue: String(user.id || ('user_' + Date.now())) },
        name: { stringValue: String(user.name || 'Parceiro Z8') },
        company: { stringValue: String(user.company || 'Empresa Parceira') },
        city: { stringValue: String(user.city || 'São Paulo - SP') },
        email: { stringValue: String(user.email.toLowerCase().trim()) },
        phone: { stringValue: String(user.phone || '') },
        role: { stringValue: String(user.role || 'partner') },
        status: { stringValue: String(user.status || 'pending') },
        password: { stringValue: String(user.password || 'Z8@2026') },
        updatedAt: { integerValue: String(user.updatedAt || Date.now()) },
        createdAt: { stringValue: String(user.createdAt || new Date().toISOString()) }
      }
    };
    await fetch(`${FIRESTORE_USERS_URL}/${docId}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn('Firestore user push warning:', err);
  }
}

// Sincroniza lista de usuários com o Firebase Firestore
export async function pushUsersToCloud(usersList) {
  if (!Array.isArray(usersList)) return;
  for (const u of usersList) {
    pushUserToFirestore(u);
  }
}

// Busca todos os usuários reais cadastrados no Firebase Firestore
export async function fetchUsersFromCloud() {
  try {
    const res = await fetch(`${FIRESTORE_USERS_URL}?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;
    const json = await res.json();
    const documents = json?.documents;
    if (Array.isArray(documents) && documents.length > 0) {
      const localUsers = getRegisteredUsers();
      let hasChanges = false;

      const mergedMap = new Map();
      localUsers.forEach(u => mergedMap.set(u.email.toLowerCase(), u));

      documents.forEach(doc => {
        const f = doc.fields || {};
        const email = (f.email?.stringValue || '').toLowerCase().trim();
        if (!email) return;

        const cu = {
          id: f.id?.stringValue || ('user_' + Date.now()),
          name: f.name?.stringValue || 'Parceiro Z8',
          company: f.company?.stringValue || 'Empresa Parceira',
          city: f.city?.stringValue || 'São Paulo - SP',
          email: email,
          phone: f.phone?.stringValue || '',
          role: f.role?.stringValue || 'partner',
          status: f.status?.stringValue || 'pending',
          password: f.password?.stringValue || 'Z8@2026',
          updatedAt: parseInt(f.updatedAt?.integerValue || '1000', 10),
          createdAt: f.createdAt?.stringValue || new Date().toISOString()
        };

        if (!mergedMap.has(email)) {
          mergedMap.set(email, cu);
          hasChanges = true;
        } else {
          const localU = mergedMap.get(email);
          const cloudTime = cu.updatedAt || 0;
          const localTime = localU.updatedAt || 0;

          // Se o Firebase tem atualização mais recente, atualiza status
          if (cloudTime > localTime && cu.status && cu.status !== localU.status && email !== MASTER_ADMIN_EMAIL.toLowerCase()) {
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
    console.warn('Firestore fetch warning:', err);
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

    // 1. Ensure default network homologated users exist
    DEFAULT_USERS.forEach(du => {
      if (!users.find(u => u.email.toLowerCase() === du.email.toLowerCase())) {
        users.push(du);
      }
    });

    // 2. Auto-sync leads from CRM Database (z8_crm_leads_data)
    try {
      const crmRaw = localStorage.getItem('z8_crm_leads_data');
      if (crmRaw) {
        const leads = JSON.parse(crmRaw);
        leads.forEach(l => {
          if (l.email && !users.find(u => u.email.toLowerCase() === l.email.toLowerCase())) {
            users.push({
              id: 'user_lead_' + (l.id || Date.now()),
              name: l.name || 'Lead Comercial',
              company: l.company || l.name || 'Empresa Interessada',
              city: l.city || 'São Paulo - SP',
              email: l.email.toLowerCase(),
              phone: l.phone || '',
              password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
              role: 'partner',
              status: l.status || 'pending',
              updatedAt: 1000,
              createdAt: l.createdAt || new Date().toISOString()
            });
          }
        });
      }
    } catch (e) {
      console.warn('CRM sync info:', e);
    }

    // 3. Auto-sync users from Warranty OS Database (z8_warranty_service_orders_db)
    try {
      const osRaw = localStorage.getItem('z8_warranty_service_orders_db');
      if (osRaw) {
        const orders = JSON.parse(osRaw);
        orders.forEach(o => {
          if (o.userEmail && !users.find(u => u.email.toLowerCase() === o.userEmail.toLowerCase())) {
            users.push({
              id: o.userId || ('user_os_' + Date.now()),
              name: o.techName || o.company || 'Oficina Credenciada',
              company: o.company || 'Oficina Credenciada Z8',
              city: o.city || 'São Paulo - SP',
              email: o.userEmail.toLowerCase(),
              phone: o.techPhone || '',
              password: 'z8@' + Math.floor(1000 + Math.random() * 9000),
              role: 'partner',
              status: 'pending',
              updatedAt: 1000,
              createdAt: o.createdAt || new Date().toISOString()
            });
          }
        });
      }
    } catch (e) {
      console.warn('OS sync info:', e);
    }

    // 4. Auto-sync active session user if stored
    try {
      const sessionUserRaw = localStorage.getItem('z8_catalog_auth_user') || sessionStorage.getItem('z8_catalog_auth_user');
      if (sessionUserRaw) {
        const su = JSON.parse(sessionUserRaw);
        if (su.email && !users.find(u => u.email.toLowerCase() === su.email.toLowerCase())) {
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

    // 5. Ensure admin is always master approved
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
  pushUsersToCloud(updated);

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
