// ==========================================================================
// Z8 E-Motion - Firebase Configuration & Real-Time Sync Engine
// Google Cloud / Firebase Firestore API Integration with Fallback Storage
// ==========================================================================

export const firebaseConfig = {
  projectId: "william-site-43963",
  appId: "1:796751991729:web:720e8e01bdfca6d3d16390",
  storageBucket: "william-site-43963.firebasestorage.app",
  apiKey: "AIzaSyDxBfXwvrBt19dQbxqGYkVmFIl_S87VOdU",
  authDomain: "william-site-43963.firebaseapp.com",
  messagingSenderId: "796751991729",
  measurementId: "G-K0JQDK5J0P"
};

const STORAGE_KEY = 'z8_crm_leads_data';

const DEFAULT_LEADS = [];

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

export async function pushLeadToFirestore(lead) {
  if (!lead || !lead.email) return;
  try {
    const docId = encodeURIComponent(lead.email.toLowerCase().trim());
    const body = {
      fields: {
        id: { stringValue: String(lead.id || ('lead_' + Date.now())) },
        name: { stringValue: String(lead.name || 'Lead Z8') },
        company: { stringValue: String(lead.company || 'Empresa Parceira') },
        city: { stringValue: String(lead.city || 'São Paulo') },
        state: { stringValue: String(lead.state || 'SP') },
        email: { stringValue: String(lead.email.toLowerCase().trim()) },
        phone: { stringValue: String(lead.phone || '') },
        paymentMethod: { stringValue: String(lead.paymentMethod || 'PIX') },
        status: { stringValue: String(lead.status || 'novo') },
        estimatedRevenue: { doubleValue: Number(lead.estimatedRevenue || 2989.00) },
        updatedAt: { integerValue: String(Date.now()) },
        createdAt: { stringValue: String(lead.createdAt || new Date().toISOString()) }
      }
    };
    await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/leads/${docId}?key=${firebaseConfig.apiKey}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.warn('Error saving lead to Firestore:', e);
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

  // Push to real Firestore
  pushLeadToFirestore(newLead);

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
    pushLeadToFirestore(leads[index]);
    window.dispatchEvent(new CustomEvent('z8-lead-updated', { detail: leads[index] }));
  }
}
