// ==========================================================================
// Z8 E-Motion - Serverless API: CRM Leads Management
// ==========================================================================

let globalLeadsStore = [];

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: List all CRM leads
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: globalLeadsStore.length,
      leads: globalLeadsStore,
      timestamp: Date.now()
    });
  }

  // POST: Add new lead
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const email = (body.email || '').trim().toLowerCase();
      const name = body.name || 'Lead Interessado';

      const newLead = {
        id: body.id || ('lead_' + Date.now()),
        name: name,
        company: body.company || '',
        city: body.city || 'SP',
        state: body.state || 'SP',
        email: email,
        phone: body.phone || '',
        investment: body.investment || '',
        status: body.status || 'novo',
        notes: body.notes || '',
        source: body.source || 'Portal Z8 Vendas',
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: Date.now()
      };

      globalLeadsStore.unshift(newLead);

      return res.status(201).json({
        success: true,
        message: 'Lead registrado com sucesso no banco de dados central!',
        lead: newLead
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao registrar lead: ' + err.message });
    }
  }

  // PUT: Update lead status
  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const leadId = body.id || body.leadId;
      const newStatus = body.status;

      const idx = globalLeadsStore.findIndex(l => l.id === leadId || l.email?.toLowerCase() === body.email?.toLowerCase());
      if (idx !== -1) {
        globalLeadsStore[idx].status = newStatus || globalLeadsStore[idx].status;
        if (body.notes) globalLeadsStore[idx].notes = body.notes;
        globalLeadsStore[idx].updatedAt = Date.now();
        return res.status(200).json({ success: true, lead: globalLeadsStore[idx] });
      }

      return res.status(404).json({ success: false, error: 'Lead não encontrado.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao atualizar lead: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Método não suportado.' });
}
