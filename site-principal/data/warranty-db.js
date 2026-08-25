// ==========================================================================
// Z8 E-Motion - Warranty & Service Order (OS) Database Engine
// Firestore Real-Time Ready with LocalStorage Persistence & Event Dispatcher
// ==========================================================================

const OS_STORAGE_KEY = 'z8_warranty_service_orders_db';

const DEFAULT_ORDERS = [
  {
    id: 'OS-2026-0101',
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
    slaDeadline: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'OS-2026-0102',
    techName: 'Roberto Mecânico Z8',
    company: 'Z8 Vale do Paraíba',
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
    slaDeadline: new Date(Date.now() + 3600000 * 34).toISOString()
  },
  {
    id: 'OS-2026-0103',
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
    slaDeadline: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export function getStoredWarrantyOrders() {
  try {
    const raw = localStorage.getItem(OS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Erro ao carregar Ordens de Serviço do banco local:', err);
    return DEFAULT_ORDERS;
  }
}

export function saveWarrantyOrder(orderData) {
  const orders = getStoredWarrantyOrders();
  
  // Gera ID sequencial único baseado no ano corrente
  const nextNum = (orders.length + 104).toString().padStart(4, '0');
  const osId = orderData.id || `OS-2026-${nextNum}`;

  const newOrder = {
    id: osId,
    techName: orderData.techName || 'Técnico Homologado',
    company: orderData.company || 'Concessionária Autorizada Z8',
    city: orderData.city || 'São Paulo - SP',
    techPhone: orderData.techPhone || '',
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
    slaDeadline: new Date(Date.now() + 86400000 * 2).toISOString()
  };

  orders.unshift(newOrder);
  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(orders));

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
  orders[index].updatedAt = new Date().toISOString();

  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('z8-warranty-os-updated', { detail: orders[index] }));
  return { success: true, order: orders[index] };
}

export function deleteWarrantyOrder(orderId) {
  const orders = getStoredWarrantyOrders();
  const filtered = orders.filter(o => o.id !== orderId);
  localStorage.setItem(OS_STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('z8-warranty-os-updated'));
  return true;
}

export function getWarrantyOrderById(orderId) {
  const orders = getStoredWarrantyOrders();
  return orders.find(o => o.id === orderId) || null;
}
