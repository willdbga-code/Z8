// ==========================================================================
// Z8 E-Motion - Serverless API: Hardened CRM Leads Management
// Defense-in-Depth: Rate Limiting Anti-Spam, Admin Bearer Token Protection,
// AES-256-GCM Field Encryption for PII, Input Sanitization & Anti-Scraping
// ==========================================================================

import {
  encryptField,
  decryptField,
  checkRateLimit,
  sanitizeInputString,
  getClientIp,
  validateAdminAuth,
  setSecureCorsHeaders
} from './security-utils.js';

let globalLeadsStore = [
  {
    id: 'lead_1787790262588',
    name: 'Fabrício Daniel de Oliveira Castro',
    company: 'JF',
    city: 'Pindamonhangaba',
    state: 'SP',
    email: 'fabriciopolocruzeiro@gmail.com',
    phone: encryptField('12991064106'),
    paymentMethod: 'Passaporte VIP Exclusividade',
    status: 'novo',
    estimatedRevenue: 2989.00,
    source: 'Passaporte VIP Exclusividade',
    createdAt: '2026-08-27T00:24:22.588Z',
    updatedAt: 1787790262589
  },
  {
    id: 'lead_1788402155815',
    name: 'derik',
    company: 'derik',
    city: 'jacarei',
    state: 'SP',
    email: 'derik.dws@gmail.com',
    phone: encryptField('12981986760'),
    paymentMethod: 'Cadastro Portal',
    status: 'novo',
    estimatedRevenue: 0,
    source: 'Portal Z8 Catálogo',
    createdAt: '2026-09-03T21:02:35.815Z',
    updatedAt: 1788402155815
  },
  {
    id: 'lead_SC4CB308HVchdVPXMEt5',
    name: 'Lead WhatsApp (Retrato Autoral)',
    company: 'WhatsApp Lead',
    city: 'Vale do Paraíba',
    state: 'SP',
    email: '',
    phone: encryptField('5512992236440'),
    notes: 'Pacote: Retrato Autoral - Data Prevista: 11/09/2026',
    paymentMethod: 'WhatsApp Direto',
    estimatedRevenue: 450.00,
    source: 'whatsapp',
    status: 'novo',
    createdAt: '2026-08-26T03:26:25.345Z',
    updatedAt: 1787705185345
  },
  {
    id: 'lead_zejda_01',
    name: 'Jose da silva',
    company: 'Empresa',
    city: 'Santana do parnaiba',
    state: 'SP',
    email: 'zejda@gmail.com',
    phone: encryptField('12988130316'),
    paymentMethod: 'Cadastro Admin',
    status: 'aprovado',
    source: 'Admin Master Manual',
    createdAt: '2026-09-04T12:00:00.000Z',
    updatedAt: Date.now()
  },
  {
    id: 'lead_vinicius_01',
    name: 'Vinicius ortiz',
    company: 'Viniciusortizdovale@gmail.com',
    city: 'Taubaté',
    state: 'SP',
    email: 'viniciusortizdovale@gmail.com',
    phone: encryptField('12996667031'),
    paymentMethod: 'Cadastro Admin',
    status: 'aprovado',
    source: 'Admin Master Manual',
    createdAt: '2026-09-04T12:00:00.000Z',
    updatedAt: Date.now()
  }
];

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = getClientIp(req);

  // ------------------------------------------------------------------------
  // GET: List all CRM leads (ESTRITAMENTE RESTRITO A ADMIN MASTER)
  // ------------------------------------------------------------------------
  if (req.method === 'GET') {
    const isAuthorized = validateAdminAuth(req);

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        error: 'Acesso não autorizado. A consulta aos leads do CRM é estritamente restrita à administração Z8 E-Motion.'
      });
    }

    // Decriptografa dados para exibição do administrador legítimo
    const decryptedLeads = globalLeadsStore.map(l => ({
      ...l,
      phone: decryptField(l.phone)
    }));

    return res.status(200).json({
      success: true,
      count: decryptedLeads.length,
      leads: decryptedLeads,
      timestamp: Date.now()
    });
  }

  // ------------------------------------------------------------------------
  // POST: Captura de Novo Lead (Landing Page / Formulário do Catálogo)
  // ------------------------------------------------------------------------
  if (req.method === 'POST') {
    // Rate limit: 10 leads por hora por IP para impedir bombardeio de robôs
    const rateCheck = checkRateLimit(`lead_submit_${clientIp}`, 10, 3600);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Limite de envios de formulário excedido. Tente novamente mais tarde.'
      });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const email = sanitizeInputString(body.email || '').toLowerCase();
      const name = sanitizeInputString(body.name || 'Lead Interessado', 120);

      if (name.length < 2) {
        return res.status(400).json({ success: false, error: 'Nome inválido.' });
      }

      const newLead = {
        id: body.id || ('lead_' + Date.now()),
        name: name,
        company: sanitizeInputString(body.company || '', 120),
        city: sanitizeInputString(body.city || 'SP', 80),
        state: sanitizeInputString(body.state || 'SP', 2),
        email: email,
        phone: encryptField(sanitizeInputString(body.phone || '', 30)),
        paymentMethod: sanitizeInputString(body.paymentMethod || 'PIX', 50),
        investment: sanitizeInputString(body.investment || '', 80),
        status: 'novo',
        notes: sanitizeInputString(body.notes || '', 500),
        source: sanitizeInputString(body.source || 'Portal Z8 Vendas', 80),
        createdAt: new Date().toISOString(),
        updatedAt: Date.now()
      };

      globalLeadsStore.unshift(newLead);

      return res.status(201).json({
        success: true,
        message: 'Lead registrado com sucesso!',
        id: newLead.id
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao registrar lead: ' + err.message });
    }
  }

  // ------------------------------------------------------------------------
  // PUT: Atualização de Status de Lead (Restrito a Admin Master)
  // ------------------------------------------------------------------------
  if (req.method === 'PUT') {
    const isAuthorized = validateAdminAuth(req);
    if (!isAuthorized) {
      return res.status(401).json({ success: false, error: 'Acesso restrito à administração Z8 E-Motion.' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const leadId = body.id || body.leadId;
      const newStatus = body.status;

      const idx = globalLeadsStore.findIndex(l => l.id === leadId || l.email?.toLowerCase() === body.email?.toLowerCase());
      if (idx !== -1) {
        if (newStatus) globalLeadsStore[idx].status = sanitizeInputString(newStatus, 30);
        if (body.notes) globalLeadsStore[idx].notes = sanitizeInputString(body.notes, 500);
        globalLeadsStore[idx].updatedAt = Date.now();
        return res.status(200).json({
          success: true,
          lead: {
            ...globalLeadsStore[idx],
            phone: decryptField(globalLeadsStore[idx].phone)
          }
        });
      }

      return res.status(404).json({ success: false, error: 'Lead não encontrado.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao atualizar lead: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Método não suportado.' });
}
