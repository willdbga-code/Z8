// ==========================================================================
// Z8 E-Motion - Serverless API: Hardened Warranty Service Orders (OS)
// Defense-in-Depth: Multi-Tenant Tenant Isolation, Admin Master Central Hub,
// AES-256-GCM Field Encryption for Client Contacts & Anti-Tampering
// ==========================================================================

import {
  MASTER_ADMIN_EMAIL,
  encryptField,
  decryptField,
  sanitizeInputString,
  getClientIp,
  validateAdminAuth,
  setSecureCorsHeaders
} from './security-utils.js';

let globalOrdersStore = [
  {
    id: "OS-2026-0101",
    userId: "user_demo_01",
    clientEmail: "ricardo@megamotos.com.br",
    clientName: "Mega Motos SP (Carlos Silveira)",
    clientPhone: encryptField("(19) 98765-4321"),
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
    clientPhone: encryptField("(12) 99800-8818"),
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
    clientPhone: encryptField("(41) 99111-2233"),
    city: "Curitiba - PR",
    modelName: "Z8 U2 Delivery Cargo (XB-026)",
    chassis: "9Z8XB026M55102",
    odometer: 2890,
    component: "Motor BLDC no Cubo / Sensor Hall",
    issueDescription: "Sensor Hall da fase amarela (U) sem sinal no osciloscópio (0V travado). Motor dá trancos na partida.",
    status: "completed",
    statusText: "Concluído - Peça Substituída",
    trackingCode: "BR991823412SP",
    notes: "Motor cubo 800W substituído em garantia com sucesso.",
    evidenceLink: "Laudo Técnico #941",
    slaDeadline: "2026-08-25T15:00:00.000Z",
    createdAt: "2026-08-23T15:00:00.000Z",
    updatedAt: 1787626010000
  },
  {
    id: "OS-2026-0104",
    userId: "user_demo_04",
    clientEmail: "lucas@litoraleletrico.com.br",
    clientName: "Litoral Elétrico Santos (Lucas)",
    clientPhone: encryptField("(13) 99777-6655"),
    city: "Santos - SP",
    modelName: "Z8 Sport Scooter (DB009)",
    chassis: "9Z8DB009X33019",
    odometer: 640,
    component: "Manopla de Aceleração / Chicote",
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

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isAdmin = validateAdminAuth(req);
  const requesterEmail = sanitizeInputString(req.headers['x-user-email'] || req.query?.email || '').toLowerCase();

  // ------------------------------------------------------------------------
  // GET: List Warranty OS (Isolamento por Lojista ou Visão Master Admin)
  // ------------------------------------------------------------------------
  if (req.method === 'GET') {
    if (!isAdmin && !requesterEmail) {
      return res.status(401).json({
        success: false,
        error: 'Acesso restrito. Identificação ou credencial de lojista é obrigatória.'
      });
    }

    let filtered = globalOrdersStore;
    if (!isAdmin) {
      filtered = globalOrdersStore.filter(o => 
        (o.clientEmail || '').toLowerCase() === requesterEmail ||
        (o.userEmail || '').toLowerCase() === requesterEmail
      );
    }

    const decrypted = filtered.map(o => ({
      ...o,
      clientPhone: decryptField(o.clientPhone)
    }));

    return res.status(200).json({
      success: true,
      count: decrypted.length,
      orders: decrypted,
      timestamp: Date.now()
    });
  }

  // ------------------------------------------------------------------------
  // POST: Create New Warranty OS Ticket
  // ------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const email = sanitizeInputString(body.clientEmail || body.userEmail || requesterEmail || '').toLowerCase();

      if (!email) {
        return res.status(400).json({ success: false, error: 'E-mail do lojista é obrigatório.' });
      }

      const newOS = {
        id: body.id || ('OS-' + Math.floor(100000 + Math.random() * 900000)),
        userId: body.userId || ('user_' + Date.now()),
        clientEmail: email,
        clientName: sanitizeInputString(body.clientName || 'Lojista Autorizado', 120),
        clientPhone: encryptField(sanitizeInputString(body.clientPhone || '', 30)),
        city: sanitizeInputString(body.city || 'SP', 80),
        modelId: sanitizeInputString(body.modelId || '', 50),
        modelName: sanitizeInputString(body.modelName || 'Veículo Elétrico Z8', 100),
        chassis: sanitizeInputString(body.chassis || body.chassi || '', 50),
        odometer: Number(body.odometer) || 0,
        component: sanitizeInputString(body.component || 'Peça / Componente', 120),
        issueDescription: sanitizeInputString(body.issueDescription || body.diagnosis || '', 1000),
        status: 'analyzing',
        statusText: 'Em Análise Técnica (SLA 48h)',
        trackingCode: '',
        notes: '',
        evidenceLink: sanitizeInputString(body.evidenceLink || '', 255),
        slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: Date.now()
      };

      globalOrdersStore.unshift(newOS);

      return res.status(201).json({
        success: true,
        message: 'Ordem de Serviço registrada com sucesso!',
        order: {
          ...newOS,
          clientPhone: decryptField(newOS.clientPhone)
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao criar Ordem de Serviço: ' + err.message });
    }
  }

  // ------------------------------------------------------------------------
  // PUT: Update OS Ticket Status (Restrito a Admin Master)
  // ------------------------------------------------------------------------
  if (req.method === 'PUT') {
    if (!isAdmin) {
      return res.status(401).json({ success: false, error: 'Apenas o Administrador Master pode autorizar ou despachar garantias.' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const orderId = body.id;

      const idx = globalOrdersStore.findIndex(o => o.id === orderId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Ordem de Serviço não encontrada.' });
      }

      if (body.status) globalOrdersStore[idx].status = sanitizeInputString(body.status, 30);
      if (body.statusText) globalOrdersStore[idx].statusText = sanitizeInputString(body.statusText, 80);
      if (body.trackingCode !== undefined) globalOrdersStore[idx].trackingCode = sanitizeInputString(body.trackingCode, 60);
      if (body.notes !== undefined) globalOrdersStore[idx].notes = sanitizeInputString(body.notes, 500);
      globalOrdersStore[idx].updatedAt = Date.now();

      return res.status(200).json({
        success: true,
        message: 'Ordem de Serviço atualizada!',
        order: {
          ...globalOrdersStore[idx],
          clientPhone: decryptField(globalOrdersStore[idx].clientPhone)
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Erro ao atualizar OS: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Método não suportado.' });
}
