// ==========================================================================
// Z8 E-Motion - B2B CRM Engine, User Directory & Admin Suite
// Real-time Lead Management, User Registration & Excel Export
// ==========================================================================

import { getLocalLeads, saveLead, updateLeadStatus } from './firebase-config.js';
import { isAuthenticated, login, logout, registerUser, getRegisteredUsers, getCurrentUser } from './auth.js';

export function initCRM() {
  const crmModal = document.getElementById('crm-modal');
  const openCrmBtn = document.getElementById('open-crm-btn');
  const closeCrmBtn = document.getElementById('close-crm-btn');
  const crmBackBtn = document.getElementById('crm-back-btn');
  const logoutCrmBtn = document.getElementById('crm-logout-btn');
  const exportExcelBtn = document.getElementById('export-excel-btn');
  const crmTableBody = document.getElementById('crm-table-body');
  const usersTableBody = document.getElementById('users-table-body');
  const statusFilter = document.getElementById('crm-status-filter');
  const adminBadgeEmail = document.getElementById('admin-badge-email');

  // Auth / Login / Register Modal Elements
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.getElementById('close-login-btn');
  const backToPageBtn = document.getElementById('back-to-page-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginUser = document.getElementById('login-user');
  const loginPass = document.getElementById('login-pass');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');
  const togglePassBtn = document.getElementById('toggle-pass-btn');

  // Tab Switching Elements
  const authTabLoginBtn = document.getElementById('tab-btn-login');
  const authTabRegBtn = document.getElementById('tab-btn-register');
  const authBoxLogin = document.getElementById('auth-box-login');
  const authBoxReg = document.getElementById('auth-box-register');

  const adminTabLeadsBtn = document.getElementById('admin-tab-leads');
  const adminTabUsersBtn = document.getElementById('admin-tab-users');
  const adminViewLeads = document.getElementById('admin-view-leads');
  const adminViewUsers = document.getElementById('admin-view-users');

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

  function renderRegisteredUsersTable() {
    if (!usersTableBody) return;
    const users = getRegisteredUsers();

    if (users.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #94a3b8; padding: 2rem;">
            Nenhum usuário cadastrado até o momento.
          </td>
        </tr>
      `;
      return;
    }

    usersTableBody.innerHTML = users.map(u => {
      const dateStr = new Date(u.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const badgeColor = u.role === 'admin' ? '#00F2FE' : '#10B981';
      const roleLabel = u.role === 'admin' ? '👑 Administrador Master' : '🤝 Franquia / Parceiro';

      return `
        <tr>
          <td><strong>${u.name}</strong><br><span style="font-size: 0.75rem; color: #64748b;">${u.company}</span></td>
          <td><i class="fa-solid fa-location-dot" style="color: #00F2FE;"></i> ${u.city || 'Não informada'}</td>
          <td><a href="mailto:${u.email}" style="color: #38bdf8; text-decoration: none;">${u.email}</a></td>
          <td><a href="https://wa.me/55${(u.phone || '').replace(/\D/g, '')}" target="_blank" style="color: #10B981; text-decoration: none; font-weight: 600;"><i class="fa-brands fa-whatsapp"></i> ${u.phone || 'N/A'}</a></td>
          <td><span style="color: #F59E0B; font-weight: 700;">${u.investment || 'R$ 50k - 100k'}</span></td>
          <td><strong>${u.hasStore || 'Não'}</strong></td>
          <td><span style="background: rgba(0,242,254,0.1); border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.78rem;">${roleLabel}</span></td>
          <td><span style="font-size: 0.75rem; color: #94a3b8;">${dateStr}</span></td>
        </tr>
      `;
    }).join('');
  }

  function openProtectedCRM() {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (adminBadgeEmail && currentUser) {
        adminBadgeEmail.textContent = currentUser.email;
      }
      renderTable();
      renderRegisteredUsersTable();
      if (loginModal) loginModal.style.display = 'none';
      crmModal.style.display = 'flex';
    } else {
      if (crmModal) crmModal.style.display = 'none';
      if (loginError) loginError.style.display = 'none';
      if (registerError) registerError.style.display = 'none';
      if (registerSuccess) registerSuccess.style.display = 'none';
      if (loginModal) loginModal.style.display = 'flex';
    }
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

  // Event Listeners
  if (openCrmBtn) {
    openCrmBtn.addEventListener('click', openProtectedCRM);
  }

  if (closeCrmBtn) {
    closeCrmBtn.addEventListener('click', () => {
      crmModal.style.display = 'none';
    });
  }

  if (crmBackBtn) {
    crmBackBtn.addEventListener('click', () => {
      crmModal.style.display = 'none';
    });
  }

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
    });
  }

  if (backToPageBtn) {
    backToPageBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
    });
  }

  if (logoutCrmBtn) {
    logoutCrmBtn.addEventListener('click', () => {
      logout();
      crmModal.style.display = 'none';
      alert('Sessão encerrada com sucesso.');
    });
  }

  // Auth Modal Tab Switcher (Login vs Cadastro)
  if (authTabLoginBtn && authTabRegBtn) {
    authTabLoginBtn.addEventListener('click', () => {
      authTabLoginBtn.classList.add('active');
      authTabRegBtn.classList.remove('active');
      if (authBoxLogin) authBoxLogin.style.display = 'block';
      if (authBoxReg) authBoxReg.style.display = 'none';
    });

    authTabRegBtn.addEventListener('click', () => {
      authTabRegBtn.classList.add('active');
      authTabLoginBtn.classList.remove('active');
      if (authBoxReg) authBoxReg.style.display = 'block';
      if (authBoxLogin) authBoxLogin.style.display = 'none';
    });
  }

  // Admin Area Tab Switcher (Leads vs Usuários Cadastrados)
  if (adminTabLeadsBtn && adminTabUsersBtn) {
    adminTabLeadsBtn.addEventListener('click', () => {
      adminTabLeadsBtn.classList.add('active');
      adminTabUsersBtn.classList.remove('active');
      if (adminViewLeads) adminViewLeads.style.display = 'block';
      if (adminViewUsers) adminViewUsers.style.display = 'none';
    });

    adminTabUsersBtn.addEventListener('click', () => {
      adminTabUsersBtn.classList.add('active');
      adminTabLeadsBtn.classList.remove('active');
      if (adminViewUsers) adminViewUsers.style.display = 'block';
      if (adminViewLeads) adminViewLeads.style.display = 'none';
      renderRegisteredUsersTable();
    });
  }

  // Login Form Submission
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

  // Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const company = document.getElementById('reg-company').value;
      const city = document.getElementById('reg-city') ? document.getElementById('reg-city').value : 'Não informada';
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const password = document.getElementById('reg-pass').value;

      const res = registerUser({ name, company, city, email, phone, password });
      if (res.success) {
        // Also save lead reservation into CRM!
        saveLead({ name, company, city, state: 'BR', email, phone, paymentMethod: 'PIX (Cadastro Exclusivo)' });

        if (registerError) registerError.style.display = 'none';
        if (registerSuccess) {
          registerSuccess.innerHTML = `🎉 <strong>Cadastro realizado com sucesso!</strong><br>Sua cidade (<strong>${city.toUpperCase()}</strong>) e conta de parceiro foram reservadas! Faça login para acessar o painel.`;
          registerSuccess.style.display = 'block';
        }
        registerForm.reset();
        setTimeout(() => {
          if (authTabLoginBtn) authTabLoginBtn.click();
        }, 2200);
      } else {
        if (registerSuccess) registerSuccess.style.display = 'none';
        if (registerError) {
          registerError.textContent = res.error;
          registerError.style.display = 'block';
        }
      }
    });
  }

  // Handle open registration triggers across the page
  document.addEventListener('click', (e) => {
    const regTriggerBtn = e.target.closest('.btn-open-register');
    if (regTriggerBtn) {
      const city = regTriggerBtn.getAttribute('data-city') || '';
      if (loginModal) loginModal.style.display = 'flex';
      if (authTabRegBtn) authTabRegBtn.click();
      const cityInput = document.getElementById('reg-city');
      if (cityInput && city) cityInput.value = city;
    }
  });

  // Handle EXPANSÃO Z8 E-MOTION BRASIL Landing Form Submission
  const franquiaLandingForm = document.getElementById('franquia-landing-form');
  const franquiaLandingMsg = document.getElementById('franquia-landing-msg');

  if (franquiaLandingForm) {
    franquiaLandingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value;
      const email = document.getElementById('f-email').value;
      const phone = document.getElementById('f-phone').value;
      const city = document.getElementById('f-city').value;
      const investment = document.getElementById('f-investment').value;
      const hasStore = document.getElementById('f-has-store').value;

      // 1. Save into Registered Partners Database
      const userRes = registerUser({
        name,
        company: name,
        email,
        phone,
        city,
        investment,
        hasStore,
        password: 'z8partner123'
      });

      // 2. Save into CRM Leads
      saveLead({
        name,
        company: name,
        city,
        state: 'BR',
        email,
        phone,
        paymentMethod: `Interesse Franquia (${investment})`
      });

      if (franquiaLandingMsg) {
        franquiaLandingMsg.style.display = 'block';
        if (userRes.success) {
          franquiaLandingMsg.style.background = 'rgba(16,185,129,0.15)';
          franquiaLandingMsg.style.border = '1px solid rgba(16,185,129,0.3)';
          franquiaLandingMsg.style.color = '#6ee7b7';
          franquiaLandingMsg.innerHTML = `🎉 <strong>CADASTRO DE INTERESSE REGISTRADO COM SUCESSO!</strong><br>Sua cidade (<strong>${city.toUpperCase()}</strong>) e seus dados foram gravados na Área de Parceiros Cadastrados! Entraremos em contato via WhatsApp e E-mail com a minuta do contrato e a tabela oficial de importação.`;
          franquiaLandingForm.reset();
        } else {
          franquiaLandingMsg.style.background = 'rgba(239,68,68,0.15)';
          franquiaLandingMsg.style.border = '1px solid rgba(239,68,68,0.3)';
          franquiaLandingMsg.style.color = '#fca5a5';
          franquiaLandingMsg.textContent = userRes.error || 'Erro ao registrar cadastro.';
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
