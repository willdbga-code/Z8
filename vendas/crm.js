import { getLocalLeads, saveLead, updateLeadStatus } from './firebase-config.js';
import { isAuthenticated, login, logout } from './auth.js';

export function initCRM() {
  const crmModal = document.getElementById('crm-modal');
  const openCrmBtn = document.getElementById('open-crm-btn');
  const closeCrmBtn = document.getElementById('close-crm-btn');
  const logoutCrmBtn = document.getElementById('crm-logout-btn');
  const exportExcelBtn = document.getElementById('export-excel-btn');
  const crmTableBody = document.getElementById('crm-table-body');
  const statusFilter = document.getElementById('crm-status-filter');

  // Login Modal elements
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const loginUser = document.getElementById('login-user');
  const loginPass = document.getElementById('login-pass');
  const loginError = document.getElementById('login-error');
  const togglePassBtn = document.getElementById('toggle-pass-btn');

  if (!crmModal) return;

  function renderMetrics(leads) {
    const totalLeads = leads.length;
    const closedLeads = leads.filter(l => l.status === 'fechado').length;
    const reservedCities = new Set(leads.map(l => l.city.toLowerCase().trim())).size;
    const totalPotential = leads.reduce((sum, l) => sum + (l.estimatedRevenue || 2989), 0);
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

    const elTotal = document.getElementById('crm-kpi-total');
    const elCities = document.getElementById('crm-kpi-cities');
    const elRevenue = document.getElementById('crm-kpi-revenue');
    const elRate = document.getElementById('crm-kpi-rate');

    if (elTotal) elTotal.textContent = totalLeads;
    if (elCities) elCities.textContent = reservedCities;
    if (elRevenue) elRevenue.textContent = `R$ ${totalPotential.toLocaleString('pt-BR')},00`;
    if (elRate) elRate.textContent = `${conversionRate}%`;
  }

  function renderTable() {
    const leads = getLocalLeads();
    const filter = statusFilter ? statusFilter.value : 'all';

    renderMetrics(leads);

    const filtered = filter === 'all' 
      ? leads 
      : leads.filter(l => l.status === filter);

    if (filtered.length === 0) {
      crmTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: #94a3b8; padding: 2rem;">
            Nenhum lead encontrado com o filtro selecionado.
          </td>
        </tr>
      `;
      return;
    }

    crmTableBody.innerHTML = filtered.map(lead => {
      const dateStr = new Date(lead.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr>
          <td><strong>${lead.name}</strong><br><span style="font-size: 0.75rem; color: #64748b;">${lead.company}</span></td>
          <td><i class="fa-solid fa-location-dot" style="color: #00F2FE;"></i> ${lead.city} - ${lead.state}</td>
          <td><a href="mailto:${lead.email}" style="color: #38bdf8; text-decoration: none;">${lead.email}</a></td>
          <td><a href="https://wa.me/55${lead.phone.replace(/\D/g, '')}" target="_blank" style="color: #10B981; text-decoration: none; font-weight: 600;"><i class="fa-brands fa-whatsapp"></i> ${lead.phone}</a></td>
          <td><span class="pay-badge">${lead.paymentMethod}</span></td>
          <td><strong>R$ ${(lead.estimatedRevenue || 2989).toLocaleString('pt-BR')},00</strong></td>
          <td>
            <select class="crm-status-select" data-id="${lead.id}">
              <option value="novo" ${lead.status === 'novo' ? 'selected' : ''}>🔵 Novo Lead</option>
              <option value="em_contato" ${lead.status === 'em_contato' ? 'selected' : ''}>🟡 Em Contato</option>
              <option value="proposta" ${lead.status === 'proposta' ? 'selected' : ''}>🟠 Proposta Enviada</option>
              <option value="fechado" ${lead.status === 'fechado' ? 'selected' : ''}>🟢 Fechado / Pago</option>
              <option value="perdido" ${lead.status === 'perdido' ? 'selected' : ''}>🔴 Perdido</option>
            </select>
          </td>
          <td><span style="font-size: 0.75rem; color: #94a3b8;">${dateStr}</span></td>
        </tr>
      `;
    }).join('');

    // Add status change listeners
    crmTableBody.querySelectorAll('.crm-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        updateLeadStatus(id, newStatus);
        renderTable();
      });
    });
  }

  // Export to Excel / CSV
  function exportToExcel() {
    const leads = getLocalLeads();
    if (leads.length === 0) {
      alert('Nenhum lead disponível para exportar.');
      return;
    }

    const headers = ['ID', 'Nome', 'Empresa/Loja', 'Cidade', 'UF', 'E-mail', 'WhatsApp', 'Forma Pagamento', 'Valor Reserva', 'Status CRM', 'Data Cadastro'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      `"${l.city.replace(/"/g, '""')}"`,
      `"${l.state}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.paymentMethod}"`,
      l.estimatedRevenue || 2989,
      l.status,
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Z8_Leads_CRM_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openProtectedCRM() {
    if (isAuthenticated()) {
      renderTable();
      if (loginModal) loginModal.style.display = 'none';
      crmModal.style.display = 'flex';
    } else {
      if (crmModal) crmModal.style.display = 'none';
      if (loginError) loginError.style.display = 'none';
      if (loginModal) loginModal.style.display = 'flex';
    }
  }

  // Event Listeners
  if (openCrmBtn) {
    openCrmBtn.addEventListener('click', openProtectedCRM);
  }

  if (closeCrmBtn) {
    closeCrmBtn.addEventListener('click', () => {
      crmModal.style.display = 'none';
    });
  }

  if (logoutCrmBtn) {
    logoutCrmBtn.addEventListener('click', () => {
      logout();
      crmModal.style.display = 'none';
      alert('Sessão de administrador encerrada com sucesso.');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = login(loginUser.value, loginPass.value);
      if (res.success) {
        if (loginModal) loginModal.style.display = 'none';
        openProtectedCRM();
      } else {
        if (loginError) {
          loginError.textContent = res.error;
          loginError.style.display = 'block';
        }
      }
    });
  }

  if (togglePassBtn && loginPass) {
    togglePassBtn.addEventListener('click', () => {
      const type = loginPass.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPass.setAttribute('type', type);
      togglePassBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportToExcel);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', renderTable);
  }

  window.addEventListener('z8-lead-added', () => {
    if (isAuthenticated()) renderTable();
  });

  window.addEventListener('z8-lead-updated', () => {
    if (isAuthenticated()) renderTable();
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCRM);
} else {
  initCRM();
}
