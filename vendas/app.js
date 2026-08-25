import { checkCityAvailability } from './cities-cluster.js';
import { loginCatalogUser, registerCatalogUser } from '../site-principal/catalog-auth.js';
import { saveLead } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initSeatDecreaser();
  initCepChecker();
  initCatalogTabs();
  initB2bProfitCalculator();
  initFaqAccordion();
  initCheckoutModal();
  initPortalLoginModal();
  initLiveSalesPopups();
});

/* --------------------------------------------------------------------------
   1. CRONÔMETRO REGRESSIVO B2B
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const topTimerEl = document.getElementById('top-timer');

  let targetTime = localStorage.getItem('z8_b2b_target_time');
  if (!targetTime) {
    targetTime = Date.now() + (18 * 60 + 45) * 1000;
    localStorage.setItem('z8_b2b_target_time', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    let diff = Math.max(0, Math.floor((targetTime - now) / 1000));

    if (diff === 0) {
      targetTime = Date.now() + (12 * 60) * 1000;
      localStorage.setItem('z8_b2b_target_time', targetTime);
      diff = 720;
    }

    const m = String(Math.floor(diff / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');

    if (topTimerEl) {
      topTimerEl.textContent = `${m}:${s}`;
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   2. CONTADOR DE VAGAS RESTANTES NO ESTADO
   -------------------------------------------------------------------------- */
function initSeatDecreaser() {
  const seatsEl = document.getElementById('seats-left');
  let currentSeats = localStorage.getItem('z8_b2b_seats');

  if (!currentSeats) {
    currentSeats = 4;
    localStorage.setItem('z8_b2b_seats', currentSeats);
  } else {
    currentSeats = parseInt(currentSeats, 10);
  }

  function updateSeatsUI() {
    if (seatsEl) {
      seatsEl.textContent = currentSeats;
    }
  }

  updateSeatsUI();

  // Diminui 1 vaga a cada intervalo para criar urgência B2B controlada
  setInterval(() => {
    if (currentSeats > 2) {
      currentSeats -= 1;
      localStorage.setItem('z8_b2b_seats', currentSeats);
      updateSeatsUI();
    }
  }, 35000);
}

/* --------------------------------------------------------------------------
   3. VERIFICADOR DE EXCLUSIVIDADE POR CEP OU CIDADE
   -------------------------------------------------------------------------- */
function initCepChecker() {
  const input = document.getElementById('cep-input');
  const btn = document.getElementById('cep-btn');
  const resultMsg = document.getElementById('cep-result-msg');

  if (!btn || !input || !resultMsg) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      resultMsg.innerHTML = '<span style="color: #ffaa00;"><i class="fa-solid fa-triangle-exclamation"></i> Digite sua cidade ou CEP.</span>';
      return;
    }

    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'CONSULTAR';
      btn.disabled = false;

      const availability = checkCityAvailability(val);

      if (availability.status === 'occupied') {
        let neighborBtns = '';
        if (availability.neighbors && availability.neighbors.length > 0) {
          neighborBtns = `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(239,68,68,0.3);">
              <span style="font-size: 0.72rem; color: #fecaca; display: block; margin-bottom: 6px; font-weight: 600;">
                💡 CIDADES VIZINHAS DISPONÍVEIS NO MESMO RAIO DE 50KM:
              </span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${availability.neighbors.map(n => `
                  <button type="button" class="btn-neighbor-cep" data-city="${n}" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; cursor: pointer; font-family: inherit;">
                    <i class="fa-solid fa-plus text-accent-green"></i> ${n}
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }

        resultMsg.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; padding: 12px 14px; margin-top: 10px; text-align: left;">
            <p style="color: #fca5a5; font-size: 0.82rem; margin-bottom: 6px;">
              <i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i> <strong>REGIÃO OCUPADA:</strong> ${availability.city} já possui revendedor exclusivo registrado (${availability.company}).
            </p>
            ${neighborBtns}
          </div>
        `;

        resultMsg.querySelectorAll('.btn-neighbor-cep').forEach(btnN => {
          btnN.addEventListener('click', () => {
            const chosenCity = btnN.getAttribute('data-city');
            input.value = chosenCity;
            openModalWithCity(chosenCity);
          });
        });
      } else {
        resultMsg.innerHTML = `
          <div style="background: rgba(0, 255, 136, 0.08); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; padding: 10px 14px; margin-top: 10px;">
            <p style="color: #fff; font-size: 0.82rem; margin-bottom: 8px;">
              <i class="fa-solid fa-circle-check text-accent-green"></i> <strong>DISPONÍVEL:</strong> Concessão livre para "<strong>${val.toUpperCase()}</strong>" (50km de exclusividade)!
            </p>
            <button type="button" class="btn-open-checkout" data-city="${val}" style="background: var(--accent-green); color: #000; font-weight: 800; font-size: 0.75rem; padding: 6px 14px; border-radius: 9999px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-lock"></i> TRAVAR ESTA CIDADE AGORA
            </button>
          </div>
        `;

        const dynamicBtn = resultMsg.querySelector('.btn-open-checkout');
        if (dynamicBtn) {
          dynamicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalWithCity(val);
          });
        }
      }

      trackConversionEvent('search', { search_term: val });
    }, 400);
  });
}

function openModalWithCity(cityName) {
  const cityInput = document.getElementById('input-city');
  if (cityInput) {
    cityInput.value = cityName;
    cityInput.dispatchEvent(new Event('input'));
  }
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
  trackConversionEvent('begin_checkout', {
    content_name: `Travar Cidade (${cityName})`,
    value: 2989.00,
    currency: 'BRL'
  });
}

/* --------------------------------------------------------------------------
   4. FILTRO DE CATEGORIAS DO CATÁLOGO TABULADO (AWWWARDS STYLE)
   -------------------------------------------------------------------------- */
function initCatalogTabs() {
  const tabs = document.querySelectorAll('.cat-pill-tab');
  const cards = document.querySelectorAll('.product-showcase-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. CALCULADORA B2B DE LUCRATIVIDADE MENSAL DO LOJISTA
   -------------------------------------------------------------------------- */
function initB2bProfitCalculator() {
  const slider = document.getElementById('sales-slider');
  const salesDisplay = document.getElementById('sales-val');
  const monthlyProfitDisplay = document.getElementById('monthly-profit');
  const annualProfitDisplay = document.getElementById('annual-profit');

  if (!slider) return;

  function calculate() {
    const unitsPerMonth = Math.max(5, parseInt(slider.value, 10) || 5);
    if (salesDisplay) salesDisplay.textContent = `${unitsPerMonth} motos / mês`;

    // Lucro médio por unidade = R$ 4.000,00 (Markup médio de ~68% direto de fábrica)
    const monthlyProfit = unitsPerMonth * 4000;
    const annualProfit = monthlyProfit * 12;

    if (monthlyProfitDisplay) {
      monthlyProfitDisplay.textContent = `R$ ${monthlyProfit.toLocaleString('pt-BR')}`;
    }
    if (annualProfitDisplay) {
      annualProfitDisplay.textContent = `R$ ${annualProfit.toLocaleString('pt-BR')}`;
    }
  }

  slider.addEventListener('input', calculate);
  calculate();
}

/* --------------------------------------------------------------------------
   6. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. MODAL DE CHECKOUT, VALIDAÇÃO DE CIDADES E ENVIO REAL PARA WHATSAPP
   -------------------------------------------------------------------------- */
function trackConversionEvent(eventName, data = {}) {
  // 1. Google Analytics 4 & Google Ads gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, data);
  }
  
  // 2. Google Tag Manager (DataLayer)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Meta Pixel
  if (typeof window.fbq === 'function') {
    if (eventName === 'begin_checkout') {
      window.fbq('track', 'InitiateCheckout', { content_name: data.content_name || 'Cota B2B' });
    } else if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', {
        content_name: 'Cadastro Parceiro B2B',
        content_category: 'Atacado Direct-Factory',
        company: data.company,
        city: data.city
      });
    }
  }
}

function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const openBtns = document.querySelectorAll('.btn-open-checkout');
  const closeBtn = document.getElementById('btn-close-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const successView = document.getElementById('checkout-success-view');
  const cityInput = document.getElementById('input-city');
  const cityStatusBox = document.getElementById('city-status-box');

  if (!modal) return;

  function resetModalState() {
    if (checkoutForm) checkoutForm.style.display = 'block';
    if (successView) successView.style.display = 'none';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resetModalState();
      const cityAttr = btn.getAttribute('data-city');
      if (cityAttr && cityInput) {
        cityInput.value = cityAttr;
        validateCityInput();
      }
      modal.classList.add('active');
      trackConversionEvent('begin_checkout', {
        content_name: 'Cota B2B Vendas',
        value: 2989.00,
        currency: 'BRL'
      });
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Validação em tempo real da cidade digitada e sugestão de cidades vizinhas
  function validateCityInput() {
    if (!cityInput || !cityStatusBox) return;
    const cityVal = cityInput.value.trim();

    if (cityVal.length < 3) {
      cityStatusBox.style.display = 'none';
      cityStatusBox.innerHTML = '';
      return;
    }

    const check = checkCityAvailability(cityVal);
    cityStatusBox.style.display = 'block';

    if (check.status === 'occupied') {
      cityStatusBox.style.background = 'rgba(239, 68, 68, 0.12)';
      cityStatusBox.style.border = '1px solid rgba(239, 68, 68, 0.45)';
      cityStatusBox.style.color = '#fca5a5';

      let neighborsHtml = '';
      if (check.neighbors && check.neighbors.length > 0) {
        neighborsHtml = `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(239,68,68,0.35);">
            <span style="font-size: 0.72rem; color: #fecaca; display: block; margin-bottom: 6px; font-weight: 700; letter-spacing: 0.04em;">
              💡 CIDADES VIZINHAS DISPONÍVEIS NO MESMO RAIO DE 50KM:
            </span>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${check.neighbors.map(n => `
                <button type="button" class="btn-neighbor-chip" data-city="${n}" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 5px 12px; border-radius: 20px; font-size: 0.76rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit;">
                  <i class="fa-solid fa-plus text-accent-green"></i> ${n}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      cityStatusBox.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fa-solid fa-circle-xmark" style="color: #ef4444; font-size: 1.15rem; margin-top: 2px; flex-shrink: 0;"></i>
          <div>
            <strong style="color: #ffffff;">${check.city}</strong> já possui revendedor exclusivo ativo registrado (${check.company}).
          </div>
        </div>
        ${neighborsHtml}
      `;

      cityStatusBox.querySelectorAll('.btn-neighbor-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          cityInput.value = chip.getAttribute('data-city') + ' - SP';
          validateCityInput();
        });
      });
    } else if (check.status === 'available') {
      cityStatusBox.style.background = 'rgba(0, 255, 136, 0.08)';
      cityStatusBox.style.border = '1px solid rgba(0, 255, 136, 0.4)';
      cityStatusBox.style.color = '#86efac';
      cityStatusBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check text-accent-green" style="font-size: 1.15rem; flex-shrink: 0;"></i>
          <div>
            <strong style="color: #ffffff;">${check.city}</strong> está <strong>DISPONÍVEL</strong> para exclusividade territorial (raio de 50km)!
          </div>
        </div>
      `;
    }
  }

  if (cityInput) {
    cityInput.addEventListener('input', validateCityInput);
    cityInput.addEventListener('change', validateCityInput);
  }

  // SUBMISSÃO DO FORMULÁRIO COM GRAVAÇÃO NO BANCO E TRANSMISSÃO REAL PARA O WHATSAPP
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('input-name') ? document.getElementById('input-name').value.trim() : 'Parceiro Z8';
      const company = document.getElementById('input-company') ? document.getElementById('input-company').value.trim() : 'Sua Empresa';
      const city = document.getElementById('input-city') ? document.getElementById('input-city').value.trim() : 'Sua Cidade';
      const email = document.getElementById('input-email') ? document.getElementById('input-email').value.trim().toLowerCase() : '';
      const phone = document.getElementById('input-phone') ? document.getElementById('input-phone').value.trim() : '';
      const paymentMethod = 'Passaporte VIP Exclusividade';

      // 1. Grava no banco de dados central de Usuários e Firestore (catalog_users)
      const userData = {
        name,
        company,
        city,
        email,
        phone,
        password: 'Z8@' + Math.floor(1000 + Math.random() * 9000),
        role: 'partner',
        status: 'pending'
      };

      try {
        await registerCatalogUser(userData);
      } catch (err) {
        console.warn('Catalog user registration warning:', err);
      }

      // 2. Salva lead no banco de leads do Firebase (leads)
      try {
        saveLead({
          name,
          company,
          city,
          state: city.includes('-') ? city.split('-').pop().trim() : 'SP',
          email,
          phone,
          paymentMethod
        });
      } catch (err) {
        console.warn('Lead storage fallback:', err);
      }

      // 3. Dispara conversão unificada de Lead para Google Ads, GA4 e Meta Pixel
      trackConversionEvent('generate_lead', {
        lead_type: 'Revendedor B2B Exclusivo VIP',
        company: company,
        city: city,
        value: 2989.00,
        currency: 'BRL'
      });

      // 4. Link de Liberação Imediata em 1 clique para o Christian
      const approvalLink = `${window.location.origin}/site-principal/?approve_user=${encodeURIComponent(email)}`;

      // 5. Monta a mensagem estruturada oficial com os dados e links para envio ao WhatsApp
      const whatsappMsg = 
        `🚀 *NOVO CADASTRO DE PARCEIRO VIP / EXCLUSIVIDADE Z8 E-MOTION*\n\n` +
        `👤 *Responsável:* ${name}\n` +
        `🏢 *Empresa / Loja:* ${company}\n` +
        `📍 *Cidade da Concessão:* ${city}\n` +
        `📧 *E-mail:* ${email}\n` +
        `📱 *WhatsApp:* ${phone}\n\n` +
        `👉 *Liberar Acesso do Lojista em 1 Clique:*\n${approvalLink}\n\n` +
        `📁 *Dossiê Técnico & Catálogo Solicitado:*\n` +
        `• Dossiê B2B Executivo: https://z8emotion.com.br/docs/BRAIN_NOTEBOOK.pdf\n` +
        `• Catálogo e Margens: https://z8emotion.com.br/docs/Brandbook_Z8_Emotion/BRANDBOOK_OFICIAL_Z8.pdf\n` +
        `• Parecer CONTRAN 996: https://z8emotion.com.br/docs/juridico/PARECER_REGULATORIO_CONTRAN_996.pdf\n\n` +
        `_Cadastro gravado no banco de dados central do Google Firebase (Z8 E-Motion)._`;

      const whatsappUrl = `https://wa.me/5512998008818?text=${encodeURIComponent(whatsappMsg)}`;

      // 6. Exibe a tela de sucesso profissional com confirmação de reserva
      checkoutForm.style.display = 'none';
      if (successView) {
        successView.style.display = 'block';
        const successComp = document.getElementById('success-company-name');
        const successCity = document.getElementById('success-city-name');
        const successWaBtn = document.getElementById('btn-open-whatsapp-success');

        if (successComp) successComp.textContent = company.toUpperCase();
        if (successCity) successCity.textContent = city.toUpperCase();
        if (successWaBtn) successWaBtn.href = whatsappUrl;
      }

      // 7. Abre automaticamente o WhatsApp com todos os dados preenchidos
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.log('Popup blocked, fallback button available');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7.1. POPUP DA ÁREA DE LOGIN & PORTAL DO REVENDEDOR B2B
   -------------------------------------------------------------------------- */
function initPortalLoginModal() {
  const portalModal = document.getElementById('portal-login-modal');
  const openPortalBtn = document.getElementById('open-crm-btn');
  const closePortalBtn = document.getElementById('btn-close-portal-modal');

  const tabLogin = document.getElementById('tab-portal-login');
  const tabRegister = document.getElementById('tab-portal-register');
  const viewLogin = document.getElementById('portal-view-login');
  const viewRegister = document.getElementById('portal-view-register');
  const msgBox = document.getElementById('portal-msg-box');

  const loginForm = document.getElementById('portal-login-form');
  const registerForm = document.getElementById('portal-register-form');

  if (!portalModal) return;

  // Abrir modal de login ao clicar no botão "PORTAL"
  if (openPortalBtn) {
    openPortalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      portalModal.classList.add('active');
      if (msgBox) msgBox.style.display = 'none';

      // Verificar se já está autenticado
      const authUser = localStorage.getItem('z8_catalog_auth_user');
      if (authUser) {
        try {
          const u = JSON.parse(authUser);
          showPortalMessage(`👤 Conectado como <strong>${u.name || u.email}</strong> (${u.company || 'Parceiro'}). <a href="/site-principal/" style="color: var(--accent-cyan); text-decoration: underline; font-weight: 700; margin-left: 6px;">Ir para o Catálogo Oficial →</a>`, 'info');
        } catch(e) {}
      }
    });
  }

  // Fechar modal
  if (closePortalBtn) {
    closePortalBtn.addEventListener('click', () => {
      portalModal.classList.remove('active');
    });
  }

  portalModal.addEventListener('click', (e) => {
    if (e.target === portalModal) {
      portalModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portalModal.classList.contains('active')) {
      portalModal.classList.remove('active');
    }
  });

  // Alternar entre abas Entrar e Solicitar Acesso
  if (tabLogin && tabRegister && viewLogin && viewRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.style.background = 'var(--accent-cyan)';
      tabLogin.style.color = '#000';
      tabRegister.style.background = 'transparent';
      tabRegister.style.color = 'var(--text-muted)';
      viewLogin.style.display = 'block';
      viewRegister.style.display = 'none';
      if (msgBox) msgBox.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.style.background = 'var(--accent-green)';
      tabRegister.style.color = '#000';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = 'var(--text-muted)';
      viewRegister.style.display = 'block';
      viewLogin.style.display = 'none';
      if (msgBox) msgBox.style.display = 'none';
    });
  }

  function showPortalMessage(msg, type = 'error') {
    if (!msgBox) return;
    msgBox.style.display = 'block';
    if (type === 'error') {
      msgBox.style.background = 'rgba(255, 59, 48, 0.15)';
      msgBox.style.border = '1px solid rgba(255, 59, 48, 0.4)';
      msgBox.style.color = '#ff6b6b';
      msgBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    } else if (type === 'success') {
      msgBox.style.background = 'rgba(0, 255, 136, 0.15)';
      msgBox.style.border = '1px solid rgba(0, 255, 136, 0.4)';
      msgBox.style.color = '#00ff88';
      msgBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    } else {
      msgBox.style.background = 'rgba(0, 229, 255, 0.15)';
      msgBox.style.border = '1px solid rgba(0, 229, 255, 0.4)';
      msgBox.style.color = '#00e5ff';
      msgBox.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    }
  }

  // 1. Submit de Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('portal-input-user').value.trim();
      const passVal = document.getElementById('portal-input-pass').value.trim();

      const res = loginCatalogUser(userVal, passVal);

      if (res.success) {
        showPortalMessage(`🎉 Login efetuado com sucesso! Redirecionando para o painel de atacado...`, 'success');
        
        if (openPortalBtn) {
          const label = openPortalBtn.querySelector('.btn-header-login-text');
          if (label) label.textContent = (res.user.name || 'CONECTADO').split(' ')[0].toUpperCase();
        }

        setTimeout(() => {
          portalModal.classList.remove('active');
          window.location.href = '/site-principal/';
        }, 1000);
      } else {
        showPortalMessage(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.', 'error');
      }
    });
  }

  // 2. Submit de Cadastro / Solicitação de Acesso
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('portal-reg-name').value.trim();
      const company = document.getElementById('portal-reg-company').value.trim();
      const city = document.getElementById('portal-reg-city').value.trim();
      const email = document.getElementById('portal-reg-email').value.trim();
      const phone = document.getElementById('portal-reg-phone').value.trim();
      const password = document.getElementById('portal-reg-pass').value.trim();

      const userData = { name, company, city, email, phone, password };

      // Salva no sistema de autenticação e no Firestore
      const res = await registerCatalogUser(userData);
      if (!res || !res.success) {
        showPortalMessage(res?.error || 'Erro ao registrar conta. Tente novamente.', 'error');
        return;
      }

      // Dispara conversão de Lead
      trackConversionEvent('generate_lead', {
        lead_type: 'Cadastro Portal B2B',
        company: company,
        city: city
      });

      // Salva no Firebase Leads
      try {
        saveLead({ name, company, city, email, phone, paymentMethod: 'Cadastro Direto Portal' });
      } catch(e) {}

      showPortalMessage(`🎉 <strong>Conta criada com sucesso!</strong><br/>Entrando no seu Portal Z8...`, 'success');
      registerForm.reset();

      setTimeout(() => {
        portalModal.classList.remove('active');
        window.location.href = '/site-principal/';
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   8. LIVE SALES POPUP B2B (SOCIAL PROOF CORPORATIVO)
   -------------------------------------------------------------------------- */
function initLiveSalesPopups() {
  const popup = document.getElementById('live-sales-popup');
  const companyEl = document.getElementById('popup-company-name');
  const cityEl = document.getElementById('popup-company-city');
  const timeEl = document.getElementById('popup-time');

  if (!popup) return;

  const fakeB2bBuyers = [
    { company: 'Motos & Cia Ltda', city: 'Ribeirão Preto - SP', time: 'há 4 minutos' },
    { company: 'E-Mobility Sul Revenda', city: 'Joinville - SC', time: 'há 8 minutos' },
    { company: 'Auto Center Paulista', city: 'Campinas - SP', time: 'há 2 minutos' },
    { company: 'Veloce Scooter Store', city: 'Belo Horizonte - MG', time: 'há 12 minutos' },
    { company: 'Sul Motores Atacado', city: 'Caxias do Sul - RS', time: 'há 6 minutos' },
    { company: 'Capital E-Bikes', city: 'Goiânia - GO', time: 'há 15 minutos' }
  ];

  let currentIndex = 0;

  function showNextPopup() {
    if (!companyEl || !cityEl || !timeEl) return;
    const buyer = fakeB2bBuyers[currentIndex];
    companyEl.textContent = buyer.company;
    cityEl.textContent = buyer.city;
    timeEl.textContent = buyer.time;

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 6000);

    currentIndex = (currentIndex + 1) % fakeB2bBuyers.length;
  }

  setTimeout(showNextPopup, 5000);
  setInterval(showNextPopup, 24000);
}
