// ==========================================================================
// Z8 E-Motion - Serverless API: Warranty Service Orders (OS)
// ==========================================================================

let globalOrdersStore = [
  {
    id: "OS-2026-0101",
    userId: "user_demo_01",
    clientEmail: "ricardo@megamotos.com.br",
    clientName: "Mega Motos SP (Carlos Silveira)",
    clientPhone: "(19) 98765-4321",
    city: "Campinas - SP",
    modelName: "Z8 Tank High-Speed (DB018)",
    chassis: "9Z8DB018K99042",
    odometer: 1240,
    component: "Módulo Controlador FOC",
    issueDescription: "Controlador apresentou aquecimento acima de 85°C e corte intermitente de aceleração após 20km.",
    status: "approved",
    statusText: "Aprovado - Peça Despachada",
    trackingCode: "BR849302194SP",
    notes: "Controlador FOC 60V 1000W novo despachado via SEDEX prioritário.",
    evidenceLink: "https://drive.google.com/drive/u/0/folders/z8-evidence-0101",
    slaDeadline: "2026-08-24T02:46:48.108Z",
    createdAt: "2026-08-22T02:46:48.108Z",
    updatedAt: 1787626008108
  },
  {
    id: "OS-2026-0102",
    userId: "user_admin_01",
    clientEmail: "christian.tkh@gmail.com",
    clientName: "Z8 Vale do Paraíba (Roberto)",
    clientPhone: "(12) 99800-8818",
    city: "São José dos Campos - SP",
    modelName: "Z8 FX-10 Sport (DB043)",
    chassis: "9Z8DB043L11093",
    odometer: 380,
    component: "Bateria de Lítio / BMS",
    issueDescription: "Desbalanceamento celular detectado no bloco 4 (3.1V vs 3.82V nos demais blocos). Testado com multímetro True RMS.",
    status: "analyzing",
    statusText: "Em Análise Técnica (SLA 48h)",
    trackingCode: "",
    notes: "Laudo recebido pela engenharia. Aguardando conferência do vídeo de medição.",
    evidenceLink: "Envio via WhatsApp anexo",
    slaDeadline: "2026-08-26T12:46:48.108Z",
    createdAt: "2026-08-24T12:46:48.108Z",
    updatedAt: 1787626009278
  },
  {
    id: "OS-2026-0103",
    userId: "user_demo_03",
    clientEmail: "marcio@emotionsul.com.br",
    clientName: "E-Motion Sul (Marcio Silva)",
    clientPhone: "(41) 99111-2233",
    city: "Curitiba - PR",
    modelName: "Z8 U2 Delivery Cargo (XB-026)",
    chassis: "9Z8XB026M55102",
    odometer: 2890,
    component: "Motor BLDC no Cubo / Sensor Hall",
    issueDescription: "Sensor Hall da fase amarela (U) sem sinal no osciloscópio (0V travado). Motor dá trancos na partida.",
    status: "completed",
    statusText: "Concluído & Peça Entregue",
    trackingCode: "BR994820145PR",
    notes: "Estator completo com chicote e sensores Hall substituído e testado com sucesso.",
    evidenceLink: "https://youtube.com/shorts/test-motor-z8-u2",
    slaDeadline: "2026-08-19T02:46:48.108Z",
    createdAt: "2026-08-17T02:46:48.108Z",
    updatedAt: 1787626010267
  },
  {
    id: "OS-2026-0104",
    userId: "user_demo_04",
    clientEmail: "lucas@litoraleletrico.com.br",
    clientName: "Litoral Elétrico Santos (Lucas)",
    clientPhone: "(13) 99222-3344",
    city: "Santos - SP",
    modelName: "Z8 Sport Scooter (DB010)",
    chassis: "9Z8DB010N77219",
    odometer: 890,
    component: "Acelerador / Chicote Elétrico",
    issueDescription: "Cabo do sensor hall do acelerador rompido internamente próximo ao guidão.",
    status: "approved",
    statusText: "Aprovado - Peça Despachada",
    trackingCode: "BR771920334SP",
    notes: "Manopla de acelerador completa com chicote despachada.",
    evidenceLink: "WhatsApp",
    slaDeadline: "2026-08-26T02:46:48.108Z",
    createdAt: "2026-08-23T02:46:48.108Z",
    updatedAt: 1787626010576
  }
];


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
