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
    company: 'JF Mobilidade',
    city: 'Pindamonhangaba',
    state: 'SP',
    email: 'fabriciopolocruzeiro@gmail.com',
    phone: encryptField('12991064106'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'fechado',
    temperature: 'quente',
    score: 95,
    estimatedRevenue: 150000.00,
    investorProfile: {
      investmentRange: '60k-150k',
      isInvestor: 'empresa',
      timeline: 'imediato',
      involvement: 'operador',
      experienceText: 'Empresário com loja ativa, capital próprio para concessionária compacta e início imediato'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-08-27T00:24:22.588Z',
    updatedAt: 1787790262589
  },
  {
    id: 'lead_1788402155815',
    name: 'Derik Silva',
    company: 'DWS E-Motors',
    city: 'Jacareí',
    state: 'SP',
    email: 'derik.dws@gmail.com',
    phone: encryptField('12981986760'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'novo',
    temperature: 'possivel',
    score: 65,
    estimatedRevenue: 60000.00,
    investorProfile: {
      investmentRange: '30k-60k',
      isInvestor: 'investidor',
      timeline: '30_60_dias',
      involvement: 'investidor',
      experienceText: 'Investidor buscando diversificação de carteira na região do Vale do Paraíba'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-09-03T21:02:35.815Z',
    updatedAt: 1788402155815
  },
  {
    id: 'lead_SC4CB308HVchdVPXMEt5',
    name: 'Carlos Alberto Moreira',
    company: 'Litoral E-Scooter',
    city: 'Santos',
    state: 'SP',
    email: 'carlos.litoraleletrico@gmail.com',
    phone: encryptField('12992236440'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'em_contato',
    temperature: 'quente',
    score: 90,
    estimatedRevenue: 250000.00,
    investorProfile: {
      investmentRange: '150k+',
      isInvestor: 'empresa',
      timeline: 'imediato',
      involvement: 'operador',
      experienceText: 'Rede de lojas em expansão para o litoral, interesse em Flagship Master'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-08-26T03:26:25.345Z',
    updatedAt: 1787705185345
  },
  {
    id: 'lead_zejda_01',
    name: 'Jose da Silva',
    company: 'Alpha E-Bikes',
    city: 'Santana de Parnaíba',
    state: 'SP',
    email: 'zejda@gmail.com',
    phone: encryptField('12988130316'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'proposta',
    temperature: 'quente',
    score: 85,
    estimatedRevenue: 120000.00,
    investorProfile: {
      investmentRange: '60k-150k',
      isInvestor: 'empresa',
      timeline: 'imediato',
      involvement: 'operador',
      experienceText: 'Empresário local avaliando ponto comercial em Alphaville'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-09-04T12:00:00.000Z',
    updatedAt: Date.now()
  },
  {
    id: 'lead_vinicius_01',
    name: 'Vinicius Ortiz',
    company: 'Vale Mobilidade',
    city: 'Taubaté',
    state: 'SP',
    email: 'viniciusortizdovale@gmail.com',
    phone: encryptField('12996667031'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'em_contato',
    temperature: 'possivel',
    score: 60,
    estimatedRevenue: 50000.00,
    investorProfile: {
      investmentRange: '30k-60k',
      isInvestor: 'primeiro_negocio',
      timeline: '30_60_dias',
      involvement: 'operador',
      experienceText: 'Primeiro negócio próprio com ponto comercial em estudo no centro de Taubaté'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-09-04T12:00:00.000Z',
    updatedAt: Date.now()
  },
  {
    id: 'lead_demo_frio_01',
    name: 'Marcos Paulo Ribeiro',
    company: 'Pesquisa Individual',
    city: 'Campinas',
    state: 'SP',
    email: 'marcos.ribeiro.pesquisa@outlook.com',
    phone: encryptField('19981234567'),
    whatsappVerified: true,
    paymentMethod: 'Candidatura Concessão Franquia',
    status: 'novo',
    temperature: 'frio',
    score: 30,
    estimatedRevenue: 20000.00,
    investorProfile: {
      investmentRange: 'under-30k',
      isInvestor: 'primeiro_negocio',
      timeline: 'pesquisando',
      involvement: 'analisando',
      experienceText: 'Apenas coletando informações sobre o mercado de mobilidade elétrica para o próximo ano'
    },
    source: 'Landing Page Vendas',
    createdAt: '2026-09-10T14:30:00.000Z',
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

      const temperature = ['quente', 'possivel', 'frio'].includes(body.temperature)
        ? body.temperature 
        : 'possivel';

      const newLead = {
        id: body.id || ('lead_' + Date.now()),
        name: name,
        company: sanitizeInputString(body.company || '', 120),
        city: sanitizeInputString(body.city || 'SP', 80),
        state: sanitizeInputString(body.state || 'SP', 2),
        email: email,
        phone: encryptField(sanitizeInputString(body.phone || '', 30)),
        whatsappVerified: Boolean(body.whatsappVerified),
        paymentMethod: sanitizeInputString(body.paymentMethod || 'Candidatura Concessão Franquia', 50),
        investment: sanitizeInputString(body.investment || '', 80),
        estimatedRevenue: Number(body.estimatedRevenue || 0),
        temperature: temperature,
        score: Number(body.score || 50),
        investorProfile: body.investorProfile || null,
        status: sanitizeInputString(body.status || 'novo', 30),
        notes: sanitizeInputString(body.notes || '', 500),
        source: sanitizeInputString(body.source || 'Portal Z8 Vendas', 80),
        createdAt: new Date().toISOString(),
        updatedAt: Date.now()
      };

      globalLeadsStore.unshift(newLead);

      return res.status(201).json({
        success: true,
        message: 'Lead registrado com sucesso!',
        id: newLead.id,
        temperature: newLead.temperature,
        score: newLead.score
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
        if (body.temperature) globalLeadsStore[idx].temperature = sanitizeInputString(body.temperature, 20);
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
