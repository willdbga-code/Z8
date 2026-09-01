// ==========================================================================
// Z8 E-Motion - Serverless API: Warranty Service Orders (OS)
// ==========================================================================

let globalOrdersStore = [];

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

  // GET: List all OS tickets
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: globalOrdersStore.length,
      orders: globalOrdersStore,
      timestamp: Date.now()
    });
  }

  // POST: Create new OS ticket
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

      const newOS = {
        id: body.id || ('OS-' + Math.floor(100000 + Math.random() * 900000)),
        clientEmail: (body.clientEmail || '').trim().toLowerCase(),
        clientName: body.clientName || 'Cliente Z8',
        clientPhone: body.clientPhone || '',
        modelId: body.modelId || '',
        modelName: body.modelName || 'Scooter / Moto Z8',
        chassis: body.chassis || '',
        issueDescription: body.issueDescription || '',
        status: body.status || 'analyzing',
        statusText: body.statusText || 'Em Análise Técnica',
        trackingCode: body.trackingCode || '',
        notes: body.notes || '',
        slaDeadline: body.slaDeadline || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: Date.now()
      };

      globalOrdersStore.unshift(newOS);

      return res.status(201).json({
        success: true,
        message: 'Ordem de Serviço registrada com sucesso!',
        order: newOS
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao registrar OS: ' + err.message });
    }
  }

  // PUT: Update OS status / tracking
  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const osId = body.id || body.osId;

      const idx = globalOrdersStore.findIndex(o => o.id === osId);
      if (idx !== -1) {
        if (body.status) globalOrdersStore[idx].status = body.status;
        if (body.statusText) globalOrdersStore[idx].statusText = body.statusText;
        if (body.trackingCode !== undefined) globalOrdersStore[idx].trackingCode = body.trackingCode;
        if (body.notes !== undefined) globalOrdersStore[idx].notes = body.notes;
        globalOrdersStore[idx].updatedAt = Date.now();

        return res.status(200).json({ success: true, order: globalOrdersStore[idx] });
      }

      return res.status(404).json({ success: false, error: 'Ordem de Serviço não encontrada.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao atualizar OS: ' + err.message });
    }
  }

  // DELETE: Delete OS
  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const osId = body.id || req.query?.id;
      globalOrdersStore = globalOrdersStore.filter(o => o.id !== osId);
      return res.status(200).json({ success: true, message: 'OS removida com sucesso.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao remover OS: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Método não suportado.' });
}
