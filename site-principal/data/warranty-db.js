// ==========================================================================
// Z8 E-Motion - Warranty & Service Order (OS) Database Engine
// Multi-Tenant / Account Session Isolation with Master Admin Central Hub
// Google Cloud Firebase Firestore Real-Time Cloud Integration
// ==========================================================================

const OS_STORAGE_KEY = 'z8_warranty_service_orders_db';

const FIREBASE_API_KEY = "AIzaSyDxBfXwvrBt19dQbxqGYkVmFIl_S87VOdU";
const FIREBASE_PROJECT_ID = "william-site-43963";
const FIRESTORE_OS_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/service_orders`;

const DEFAULT_ORDERS = [
  {
    id: 'OS-2026-0101',
    userId: 'user_demo_01',
    userEmail: 'ricardo@megamotos.com.br',
    techName: 'Carlos Silveira',
    company: 'Mega Motos SP',
    city: 'Campinas - SP',
    techPhone: '(19) 98765-4321',
    model: 'Z8 Tank High-Speed (DB018)',
    chassi: '9Z8DB018K99042',
    odometer: 1240,
    component: 'Módulo Controlador FOC',
    diagnosis: 'Controlador apresentou aquecimento acima de 85°C e corte intermitente de aceleração após 20km.',
    evidenceLink: 'https://drive.google.com/drive/u/0/folders/z8-evidence-0101',
    status: 'approved',
    statusText: 'Aprovado - Peça Despachada',
    trackingCode: 'BR849302194SP',
    adminNotes: 'Controlador FOC 60V 1000W novo despachado via SEDEX prioritário.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    slaDeadline: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: 1000
  },
  {
    id: 'OS-2026-0102',
    userId: 'user_admin_01',
    userEmail: 'christian.tkh@gmail.com',
    techName: 'Roberto Mecânico Z8',
    company: 'Z8 Vale do Paraíba (Matriz)',
    city: 'São José dos Campos - SP',
    techPhone: '(12) 99800-8818',
    model: 'Z8 FX-10 Sport (DB043)',
    chassi: '9Z8DB043L11093',
    odometer: 380,
    component: 'Bateria de Lítio / BMS',
    diagnosis: 'Desbalanceamento celular detectado no bloco 4 (3.1V vs 3.82V nos demais blocos). Testado com multímetro True RMS.',
    evidenceLink: 'Envio via WhatsApp anexo',
    status: 'analyzing',
    statusText: 'Em Análise Técnica (SLA 48h)',
    trackingCode: '',
    adminNotes: 'Laudo recebido pela engenharia. Aguardando conferência do vídeo de medição.',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    slaDeadline: new Date(Date.now() + 3600000 * 34).toISOString(),
    updatedAt: 1000
  },
  {
    id: 'OS-2026-0103',
    userId: 'user_demo_03',
    userEmail: 'marcio@emotionsul.com.br',
    techName: 'Marcio Silva',
    company: 'E-Motion Sul Distribuidora',
    city: 'Curitiba - PR',
    techPhone: '(41) 99111-2233',
    model: 'Z8 U2 Delivery Cargo (XB-026)',
    chassi: '9Z8XB026M55102',
    odometer: 2890,
    component: 'Motor BLDC no Cubo / Sensor Hall',
    diagnosis: 'Sensor Hall da fase amarela (U) sem sinal no osciloscópio (0V travado). Motor dá trancos na partida.',
    evidenceLink: 'https://youtube.com/shorts/test-motor-z8-u2',
    status: 'completed',
    statusText: 'Concluído & Peça Entregue',
    trackingCode: 'BR994820145PR',
    adminNotes: 'Estator completo com chicote e sensores Hall substituído e testado com sucesso.',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    slaDeadline: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: 1000
  },
  {
    id: 'OS-2026-0104',
    userId: 'user_demo_04',
    userEmail: 'lucas@litoraleletrico.com.br',
    techName: 'Lucas Santos',
    company: 'Litoral Elétrico Santos',
    city: 'Santos - SP',
    techPhone: '(13) 99222-3344',
    model: 'Z8 Sport Scooter (DB010)',
    chassi: '9Z8DB010N77219',
    odometer: 890,
    component: 'Acelerador / Chicote Elétrico',
    diagnosis: 'Cabo do sensor hall do acelerador rompido internamente próximo ao guidão.',
    evidenceLink: 'WhatsApp',
    status: 'approved',
    statusText: 'Aprovado - Peça Despachada',
    trackingCode: 'BR771920334SP',
    adminNotes: 'Manopla de acelerador completa com chicote despachada.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    slaDeadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    updatedAt: 1000
  }
];

// Salva uma OS individual no Firebase Firestore
export async function pushWarrantyOrderToFirestore(order) {
  if (!order || !order.id) return;
  try {
    const docId = encodeURIComponent(order.id);
    const body = {
      fields: {
        id: { stringValue: String(order.id) },
        userId: { stringValue: String(order.userId || '') },
        userEmail: { stringValue: String(order.userEmail || '').toLowerCase().trim() },
        company: { stringValue: String(order.company || '') },
        city: { stringValue: String(order.city || '') },
        techName: { stringValue: String(order.techName || '') },
        techPhone: { stringValue: String(order.techPhone || '') },
        model: { stringValue: String(order.model || '') },
        chassi: { stringValue: String(order.chassi || '') },
        odometer: { integerValue: String(order.odometer || 0) },
        component: { stringValue: String(order.component || '') },
        diagnosis: { stringValue: String(order.diagnosis || '') },
        evidenceLink: { stringValue: String(order.evidenceLink || '') },
        status: { stringValue: String(order.status || 'analyzing') },
        statusText: { stringValue: String(order.statusText || 'Em Análise Técnica (SLA 48h)') },
        trackingCode: { stringValue: String(order.trackingCode || '') },
        adminNotes: { stringValue: String(order.adminNotes || '') },
        createdAt: { stringValue: String(order.createdAt || new Date().toISOString()) },
        slaDeadline: { stringValue: String(order.slaDeadline || new Date().toISOString()) },
        updatedAt: { integerValue: String(order.updatedAt || Date.now()) }
      }
    };
    await fetch(`${FIRESTORE_OS_URL}/${docId}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn('Firestore OS push error:', err);
  }
}

// Remove uma OS do Firebase Firestore
export async function deleteWarrantyOrderFromFirestore(orderId) {
  if (!orderId) return;
  try {
    const docId = encodeURIComponent(orderId);
    await fetch(`${FIRESTORE_OS_URL}/${docId}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Firestore OS delete error:', err);
  }
}

// Sincroniza todas as OS do Firestore com o banco local
export async function fetchWarrantyOrdersFromFirestore() {
  try {
    const res = await fetch(`${FIRESTORE_OS_URL}?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;
    const json = await res.json();
    const documents = json?.documents;
    if (Array.isArray(documents) && documents.length > 0) {
      const localOrders = getStoredWarrantyOrders();
      let hasChanges = false;

      const orderMap = new Map();
      localOrders.forEach(o => orderMap.set(o.id, o));

      documents.forEach(doc => {
        const f = doc.fields || {};
        const id = f.id?.stringValue;
        if (!id) return;

        const cloudOrder = {
          id: id,
          userId: f.userId?.stringValue || '',
          userEmail: (f.userEmail?.stringValue || '').toLowerCase().trim(),
          company: f.company?.stringValue || '',
          city: f.city?.stringValue || '',
          techName: f.techName?.stringValue || '',
          techPhone: f.techPhone?.stringValue || '',
          model: f.model?.stringValue || '',
          chassi: f.chassi?.stringValue || '',
          odometer: Number(f.odometer?.integerValue || 0),
          component: f.component?.stringValue || '',
          diagnosis: f.diagnosis?.stringValue || '',
          evidenceLink: f.evidenceLink?.stringValue || '',
          status: f.status?.stringValue || 'analyzing',
          statusText: f.statusText?.stringValue || 'Em Análise Técnica',
          trackingCode: f.trackingCode?.stringValue || '',
          adminNotes: f.adminNotes?.stringValue || '',
          createdAt: f.createdAt?.stringValue || new Date().toISOString(),
          slaDeadline: f.slaDeadline?.stringValue || new Date().toISOString(),
          updatedAt: parseInt(f.updatedAt?.integerValue || '1000', 10)
        };

        if (!orderMap.has(id)) {
          orderMap.set(id, cloudOrder);
          hasChanges = true;
        } else {
          const localO = orderMap.get(id);
          const cloudTime = cloudOrder.updatedAt || 0;
          const localTime = localO.updatedAt || 0;

          if (cloudTime > localTime) {
            orderMap.set(id, { ...localO, ...cloudOrder });
            hasChanges = true;
          }
        }
      });

      const mergedOrders = Array.from(orderMap.values());
      localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(mergedOrders));
      if (hasChanges) {
        window.dispatchEvent(new CustomEvent('z8-warranty-os-updated'));
      }
      return mergedOrders;
    }
  } catch (err) {
    console.warn('Firestore OS fetch error:', err);
  }
  return null;
}

export function getStoredWarrantyOrders() {
  try {
    const raw = localStorage.getItem(OS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    const orders = JSON.parse(raw);
    DEFAULT_ORDERS.forEach(d => {
      if (!orders.find(o => o.id === d.id)) {
        orders.push(d);
      }
    });
    return orders;
  } catch (err) {
    console.warn('Erro ao carregar Ordens de Serviço do banco local:', err);
    return DEFAULT_ORDERS;
  }
}

/**
 * Retorna as Ordens de Serviço filtradas pela conta ativa do usuário.
 * Se for Admin Master, pode ver todas ou filtrar por unidade.
 * Se for parceiro/técnico, vê EXCLUSIVAMENTE as OS vinculadas à sua conta/e-mail.
 */
export function getWarrantyOrdersForUser(currentUser, adminUnitFilter = 'all') {
  const allOrders = getStoredWarrantyOrders();
  if (!currentUser) return [];

  const isMaster = currentUser.role === 'admin' || currentUser.email?.toLowerCase() === 'christian.tkh@gmail.com';

  if (isMaster) {
    if (adminUnitFilter && adminUnitFilter !== 'all') {
      return allOrders.filter(o => 
        (o.userEmail && o.userEmail.toLowerCase() === adminUnitFilter.toLowerCase()) ||
        (o.company && o.company.toLowerCase() === adminUnitFilter.toLowerCase())
      );
    }
    return allOrders;
  }

  const cleanEmail = (currentUser.email || '').toLowerCase().trim();
  const userId = currentUser.id;

  return allOrders.filter(o => {
    const orderEmail = (o.userEmail || '').toLowerCase().trim();
    return (orderEmail && orderEmail === cleanEmail) || (o.userId && o.userId === userId);
  });
}

export function saveWarrantyOrder(orderData, currentUser) {
  const orders = getStoredWarrantyOrders();
  
  // Gera ID sequencial único baseado no ano corrente
  const nextNum = (orders.length + 105).toString().padStart(4, '0');
  const osId = orderData.id || `OS-2026-${nextNum}`;

  const userEmail = currentUser?.email || orderData.userEmail || '';
  const userId = currentUser?.id || orderData.userId || 'guest_' + Date.now();
  const company = currentUser?.company || orderData.company || 'Concessionária Autorizada Z8';

  const newOrder = {
    id: osId,
    userId: userId,
    userEmail: userEmail,
    company: company,
    city: currentUser?.city || orderData.city || 'São Paulo - SP',
    techName: orderData.techName || currentUser?.name || 'Técnico Homologado',
    techPhone: orderData.techPhone || currentUser?.phone || '',
    model: orderData.model || 'Z8 E-Motion',
    chassi: (orderData.chassi || '').toUpperCase().trim(),
    odometer: Number(orderData.odometer) || 0,
    component: orderData.component || 'Componente Eletroeletrônico',
    diagnosis: orderData.diagnosis || 'Sem diagnóstico detalhado informado.',
    evidenceLink: orderData.evidenceLink || 'WhatsApp',
    status: 'analyzing',
    statusText: 'Em Análise Técnica (SLA 48h)',
    trackingCode: '',
    adminNotes: 'Chamado aberto no sistema. SLA de análise em até 48 horas úteis.',
    createdAt: new Date().toISOString(),
    slaDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    updatedAt: Date.now()
  };

  orders.unshift(newOrder);
  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(orders));

  // Grava diretamente no Firebase Firestore
  pushWarrantyOrderToFirestore(newOrder);

  window.dispatchEvent(new CustomEvent('z8-warranty-os-updated', { detail: newOrder }));
  return newOrder;
}

export function updateWarrantyOrderStatus(orderId, newStatus, trackingCode = '', adminNotes = '') {
  const orders = getStoredWarrantyOrders();
  const index = orders.findIndex(o => o.id === orderId);

  if (index === -1) return { success: false, error: 'Ordem de Serviço não encontrada.' };

  const statusMap = {
    'analyzing': 'Em Análise Técnica (SLA 48h)',
    'approved': 'Aprovado - Peça Despachada',
    'completed': 'Concluído & Peça Entregue',
    'rejected': 'Laudo Recusado (Fora de Garantia)'
  };

  orders[index].status = newStatus;
  orders[index].statusText = statusMap[newStatus] || newStatus;
  if (trackingCode) orders[index].trackingCode = trackingCode;
  if (adminNotes) orders[index].adminNotes = adminNotes;
  orders[index].updatedAt = Date.now();

  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(orders));

  // Atualiza no Firebase Firestore
  pushWarrantyOrderToFirestore(orders[index]);

  window.dispatchEvent(new CustomEvent('z8-warranty-os-updated', { detail: orders[index] }));
  return { success: true, order: orders[index] };
}

export function deleteWarrantyOrder(orderId) {
  const orders = getStoredWarrantyOrders();
  const filtered = orders.filter(o => o.id !== orderId);
  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(filtered));

  // Remove do Firebase Firestore
  deleteWarrantyOrderFromFirestore(orderId);

  window.dispatchEvent(new CustomEvent('z8-warranty-os-updated'));
  return true;
}

export function getWarrantyOrderById(orderId) {
  const orders = getStoredWarrantyOrders();
  return orders.find(o => o.id === orderId) || null;
}
