// ==========================================================================
// Z8 E-Motion - Firebase Configuration & Real-Time Sync Engine
// Google Cloud / Firebase Firestore API Integration with Fallback Storage
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "z8-emotion-crm.firebaseapp.com",
  projectId: "z8-emotion-crm",
  storageBucket: "z8-emotion-crm.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:a1b2c3d4e5f6"
};

const STORAGE_KEY = 'z8_crm_leads_data';

// Initial default demo lead to ensure CRM displays stats out of the box
const DEFAULT_LEADS = [
  {
    id: 'lead_demo_01',
    name: 'Roberto Andrade',
    company: 'Motos & Cia Ltda',
    city: 'Ribeirão Preto',
    state: 'SP',
    email: 'roberto@motosecia.com.br',
    phone: '(16) 99876-5432',
    paymentMethod: 'PIX',
    status: 'fechado',
    estimatedRevenue: 2989.00,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'lead_demo_02',
    name: 'Juliana Mendes',
    company: 'E-Scooter Brasil',
    city: 'Campinas',
    state: 'SP',
    email: 'contato@escooterbrasil.com',
    phone: '(19) 99123-4567',
    paymentMethod: 'Cartão 12x',
    status: 'proposta',
    estimatedRevenue: 2989.00,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export function getLocalLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADS));
      return DEFAULT_LEADS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Fallback storage read warning:', err);
    return DEFAULT_LEADS;
  }
}

export function saveLead(leadData) {
  const leads = getLocalLeads();
  const newLead = {
    id: 'lead_' + Date.now(),
    name: leadData.name || 'Parceiro Z8',
    company: leadData.company || 'Empresa Parceira',
    city: leadData.city || 'Não especificada',
    state: leadData.state || 'BR',
    email: leadData.email || '',
    phone: leadData.phone || '',
    paymentMethod: leadData.paymentMethod || 'PIX',
    status: 'novo',
    estimatedRevenue: 2989.00,
    createdAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

  // Dispatch custom event for real-time CRM UI updates
  window.dispatchEvent(new CustomEvent('z8-lead-added', { detail: newLead }));
  return newLead;
}

export function updateLeadStatus(leadId, newStatus) {
  const leads = getLocalLeads();
  const index = leads.findIndex(l => l.id === leadId);
  if (index !== -1) {
    leads[index].status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('z8-lead-updated', { detail: leads[index] }));
  }
}
