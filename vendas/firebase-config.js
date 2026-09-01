// ==========================================================================
// Z8 E-Motion - CRM Leads Cloud Database & Real-Time Sync Engine
// ==========================================================================

export const firebaseConfig = {
  projectId: "z8-emotion-brasil",
  apiEndpoint: "/api/leads"
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
    console.warn('Local leads read warning:', err);
    return DEFAULT_LEADS;
  }
}

export async function pushLeadToFirestore(lead) {
  if (!lead) return;
  try {
    const payload = {
      id: lead.id || ('lead_' + Date.now()),
      name: lead.name || 'Lead Z8',
      company: lead.company || 'Empresa Parceira',
      city: lead.city || 'São Paulo',
      state: lead.state || 'SP',
      email: (lead.email || '').toLowerCase().trim(),
      phone: lead.phone || '',
      paymentMethod: lead.paymentMethod || 'PIX',
      status: lead.status || 'novo',
      estimatedRevenue: Number(lead.estimatedRevenue || 2989.00),
      updatedAt: Date.now(),
      createdAt: lead.createdAt || new Date().toISOString()
    };

    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Error saving lead to Cloud API:', e);
  }
}

export async function fetchLeadsFromCloud() {
  try {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.leads) && json.leads.length > 0) {
        const local = getLocalLeads();
        const map = new Map();
        local.forEach(l => map.set(l.id || l.email, l));
        json.leads.forEach(cl => {
          map.set(cl.id || cl.email, cl);
        });
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('z8-crm-leads-updated', { detail: merged }));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Cloud leads fetch error:', e);
  }
  return getLocalLeads();
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

  // Push to real Cloud API
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
