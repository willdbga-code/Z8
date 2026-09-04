// ==========================================================================
// Z8 E-Motion - Serverless API: Users & Catalog Access Management
// ==========================================================================

const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";

// Base persistente de usuários e lojistas cadastrados
let globalUsersStore = [
  {
    id: 'user_admin_01',
    name: 'Christian Hideyuki (Admin Master)',
    company: 'Z8 E-Motion Brasil (Matriz)',
    city: 'São Paulo - SP',
    email: 'christian.tkh@gmail.com',
    phone: '(12) 99800-8818',
    password: '@12345678@',
    role: 'admin',
    status: 'approved',
    updatedAt: 1000,
    createdAt: '2026-08-25T16:08:04.281Z'
  },
  {
    id: 'user_1787674451313',
    name: 'christian hideyuki',
    company: 'hide',
    city: 'Pindamonhangaba - SP',
    email: 'christian.hide@hotmail.com',
    phone: '(12) 98898-6148',
    password: '12345678',
    role: 'partner',
    status: 'approved',
    updatedAt: 1787674543174,
    createdAt: '2026-08-25T16:14:11.313Z'
  },
  {
    id: 'user_william_01',
    name: 'William Del Barrio',
    company: 'Del Barrio E-Motors',
    city: 'Pindamonhangaba - SP',
    email: 'willdbga@gmail.com',
    phone: '(12) 98813-0316',
    password: '12345678',
    role: 'partner',
    status: 'approved',
    updatedAt: 1787627826993,
    createdAt: '2026-08-25T03:15:24.950Z'
  },
  {
    id: 'lead_1787790262588',
    name: 'Fabrício Daniel de Oliveira Castro',
    company: 'JF',
    city: 'Pindamonhangaba - SP',
    email: 'fabriciopolocruzeiro@gmail.com',
    phone: '(12) 99106-4106',
    password: 'Z8@' + '4106',
    role: 'partner',
    status: 'pending',
    updatedAt: 1787790262589,
    createdAt: '2026-08-27T00:24:22.588Z'
  },
  {
    id: 'user_derik_01',
    name: 'derik',
    company: 'derik',
    city: 'jacarei - SP',
    email: 'derik.dws@gmail.com',
    phone: '12981986760',
    password: 'Z8@' + '6760',
    role: 'partner',
    status: 'pending',
    updatedAt: 1788402155815,
    createdAt: '2026-09-03T21:02:35.815Z'
  }
];


function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

async function getStoredUsersFromCloud() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/z8_users_store`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Garante que contas base também estejam presentes
            const map = new Map();
            globalUsersStore.forEach(u => map.set(u.email.toLowerCase(), u));
            parsed.forEach(u => map.set(u.email.toLowerCase(), u));
            return Array.from(map.values());
          }
        }
      }
    } catch (e) {
      console.warn('Vercel KV fetch error:', e.message);
    }
  }

  return globalUsersStore;
}

async function saveUsersToCloud(users) {
  globalUsersStore = [...users];

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl}/set/z8_users_store`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
      });
    } catch (e) {
      console.warn('Vercel KV save error:', e.message);
    }
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let users = await getStoredUsersFromCloud();

  // Ensure Admin Master always exists and is approved
  const adminIndex = users.findIndex(u => (u.email || '').toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
  if (adminIndex === -1) {
    users.unshift({
      id: 'user_admin_01',
      name: 'Christian Hideyuki (Admin Master)',
      company: 'Z8 E-Motion Brasil (Matriz)',
      city: 'São Paulo - SP',
      email: MASTER_ADMIN_EMAIL,
      phone: '(12) 99800-8818',
      password: '@12345678@',
      role: 'admin',
      status: 'approved',
      updatedAt: 1000,
      createdAt: '2026-08-25T16:08:04.281Z'
    });
  } else {
    users[adminIndex].role = 'admin';
    users[adminIndex].status = 'approved';
  }

  // GET: List all users
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: users.length,
      users: users,
      timestamp: Date.now()
    });
  }

  // POST: Register new user or partner
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const email = (body.email || '').trim().toLowerCase();

      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'E-mail inválido fornecido.' });
      }

      const existing = users.find(u => (u.email || '').toLowerCase() === email);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Este e-mail já está cadastrado no sistema.',
          user: existing
        });
      }

      const isMaster = email === MASTER_ADMIN_EMAIL.toLowerCase();
      const newUser = {
        id: body.id || ('user_' + Date.now()),
        name: body.name || 'Parceiro Z8',
        company: body.company || body.name || 'Empresa Parceira',
        city: body.city || 'São Paulo - SP',
        email: email,
        phone: body.phone || '',
        password: body.password || '',
        role: isMaster ? 'admin' : (body.role || 'partner'),
        status: isMaster ? 'approved' : (body.status || 'pending'),
        updatedAt: Date.now(),
        createdAt: new Date().toISOString()
      };

      users.unshift(newUser);
      await saveUsersToCloud(users);

      return res.status(201).json({
        success: true,
        message: isMaster ? 'Acesso Master Concedido' : 'Cadastro recebido! Aguardando aprovação comercial.',
        user: newUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao processar cadastro: ' + err.message });
    }
  }

  // PUT: Update user status or details (Aprovação / Bloqueio / Edição)
  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const target = (body.email || body.id || '').trim().toLowerCase();
      const newStatus = body.status;

      if (!target) {
        return res.status(400).json({ success: false, error: 'Identificador (email ou id) do usuário não informado.' });
      }

      const idx = users.findIndex(u => (u.email || '').toLowerCase() === target || (u.id || '').toLowerCase() === target);
      if (idx === -1) {
        if (body.email) {
          const created = {
            id: body.id || ('user_' + Date.now()),
            name: body.name || 'Parceiro Z8',
            company: body.company || 'Empresa Parceira',
            city: body.city || 'São Paulo - SP',
            email: body.email.toLowerCase().trim(),
            phone: body.phone || '',
            password: body.password || 'Z8@2026',
            role: 'partner',
            status: newStatus || 'approved',
            updatedAt: Date.now(),
            createdAt: new Date().toISOString()
          };
          users.unshift(created);
          await saveUsersToCloud(users);
          return res.status(200).json({ success: true, message: 'Usuário cadastrado e aprovado!', user: created });
        }
        return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
      }

      const u = users[idx];
      if (u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        u.status = 'approved';
        u.role = 'admin';
      } else {
        if (newStatus) u.status = newStatus;
        if (body.name) u.name = body.name;
        if (body.company) u.company = body.company;
        if (body.city) u.city = body.city;
        if (body.phone) u.phone = body.phone;
        if (body.password) u.password = body.password;
        u.updatedAt = Date.now();
      }

      users[idx] = u;
      await saveUsersToCloud(users);

      return res.status(200).json({
        success: true,
        message: `Status atualizado para '${u.status}' com sucesso!`,
        user: u
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao atualizar usuário: ' + err.message });
    }
  }

  // PATCH: Reset Password
  if (req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const email = (body.email || '').trim().toLowerCase();
      const newPassword = (body.password || '').trim();

      if (!email || !newPassword) {
        return res.status(400).json({ success: false, error: 'E-mail e nova senha são obrigatórios.' });
      }

      const idx = users.findIndex(u => (u.email || '').toLowerCase() === email);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'E-mail não encontrado no sistema.' });
      }

      if (email === MASTER_ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).json({ success: false, error: 'A senha master não pode ser alterada via API.' });
      }

      users[idx].password = newPassword;
      users[idx].updatedAt = Date.now();
      await saveUsersToCloud(users);

      return res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao redefinir senha: ' + err.message });
    }
  }

  // DELETE: Remove User
  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const target = (body.email || body.id || req.query?.id || req.query?.email || '').trim().toLowerCase();

      if (!target) {
        return res.status(400).json({ success: false, error: 'Identificador do usuário não informado.' });
      }

      if (target === MASTER_ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).json({ success: false, error: 'O Administrador Master não pode ser excluído.' });
      }

      users = users.filter(u => (u.email || '').toLowerCase() !== target && (u.id || '').toLowerCase() !== target);
      await saveUsersToCloud(users);

      return res.status(200).json({ success: true, message: 'Usuário removido com sucesso!' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao remover usuário: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Método HTTP não suportado.' });
}
