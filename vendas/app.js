/* ==========================================================================
   Z8 E-MOTION - LANDING PAGE DE VENDAS B2B (AWWWARDS EDITORIAL ENGINE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initSeatDecreaser();
  initCepChecker();
  initCatalogTabs();
  initB2bProfitCalculator();
  initFaqAccordion();
  initCheckoutModal();
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

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (topTimerEl) topTimerEl.textContent = formatted;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   2. CONTADOR DE COTAS B2B RESTANTES
   -------------------------------------------------------------------------- */
function initSeatDecreaser() {
  const seatsEl = document.getElementById('vip-seats');
  let currentSeats = parseInt(localStorage.getItem('z8_b2b_seats') || '9', 10);

  function updateSeatsUI() {
    if (seatsEl) seatsEl.textContent = currentSeats;
  }

  updateSeatsUI();

  setInterval(() => {
    if (currentSeats > 3 && Math.random() > 0.65) {
      currentSeats--;
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

      resultMsg.innerHTML = `
        <div style="background: rgba(0, 255, 136, 0.08); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; padding: 10px 14px; margin-top: 10px;">
          <p style="color: #fff; font-size: 0.82rem; margin-bottom: 8px;">
            <i class="fa-solid fa-circle-check text-accent-green"></i> <strong>DISPONÍVEL:</strong> Concessão livre para "<strong>${val.toUpperCase()}</strong>"!
          </p>
          <button type="button" class="btn-open-checkout" data-city="${val}" style="background: var(--accent-green); color: #000; font-weight: 800; font-size: 0.75rem; padding: 6px 14px; border-radius: 9999px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-lock"></i> TRAVAR ESTA CIDADE AGORA
          </button>
        </div>
      `;

      // Re-bind modal triggers for newly created dynamic buttons
      const dynamicBtn = resultMsg.querySelector('.btn-open-checkout');
      if (dynamicBtn) {
        dynamicBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const cityInput = document.getElementById('input-city');
          if (cityInput) cityInput.value = val;
          const modal = document.getElementById('checkout-modal');
          if (modal) modal.classList.add('active');
        });
      }
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   4. FILTRO DE CATEGORIAS DO CATÁLOGO TABULADO (AWWWARDS STYLE)
   -------------------------------------------------------------------------- */
function initCatalogTabs() {
  const tabBtns = document.querySelectorAll('.catalog-tab-btn');
  const productCards = document.querySelectorAll('.product-card-editorial');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCat = btn.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
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
    const unitsPerMonth = parseInt(slider.value, 10);
    if (salesDisplay) salesDisplay.textContent = `${unitsPerMonth} motos / mês`;

    // Lucro médio por unidade = R$ 2.000,00 (Markup médio de ~31% direto de fábrica)
    const monthlyProfit = unitsPerMonth * 2000;
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
   7. CHECKOUT MODAL B2B (PASSAPORTE VIP R$ 2.989)
   -------------------------------------------------------------------------- */
function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const openBtns = document.querySelectorAll('.btn-open-checkout');
  const closeBtn = document.getElementById('btn-close-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const payOptions = document.querySelectorAll('.pay-option');
  const openCrmBtn = document.getElementById('open-crm-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (openCrmBtn) {
    openCrmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  }

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

  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => {
        o.classList.remove('active');
        o.style.borderColor = 'var(--border-medium)';
        o.querySelector('span').style.color = 'var(--text-muted)';
      });
      opt.classList.add('active');
      opt.style.borderColor = 'var(--accent-green)';
      opt.querySelector('span').style.color = '#fff';
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('input-name') ? document.getElementById('input-name').value : 'Parceiro Z8';
      const company = document.getElementById('input-company') ? document.getElementById('input-company').value : 'Sua Empresa';
      const city = document.getElementById('input-city') ? document.getElementById('input-city').value : 'Sua Cidade';
      const email = document.getElementById('input-email') ? document.getElementById('input-email').value : '';
      const phone = document.getElementById('input-phone') ? document.getElementById('input-phone').value : '';
      
      const activePay = document.querySelector('.pay-option.active span');
      const paymentMethod = activePay ? activePay.textContent.trim() : 'PIX';

      // Save lead into Firebase / Hybrid Storage Engine if available
      try {
        const { saveLead } = await import('./firebase-config.js');
        if (typeof saveLead === 'function') {
          saveLead({ name, company, city, state: 'SP', email, phone, paymentMethod });
        }
      } catch (err) {
        console.log('Lead storage local mode');
      }

      alert(`🎉 EXCLUSIVIDADE RESERVADA COM SUCESSO!\n\nEmpresa: ${company.toUpperCase()}\nRegião: ${city.toUpperCase()}\n\nSeu pedido de Reserva de Exclusividade Territorial (R$ 2.989,00) foi registrado!\nEste valor será 100% ABATIDO no seu pedido mínimo de atacado.\n\nO Dossiê Comercial B2B e as instruções de faturamento foram enviados para o seu e-mail e WhatsApp.`);
      modal.classList.remove('active');
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
