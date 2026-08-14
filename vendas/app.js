/* ==========================================================================
   Z8 E-MOTION - LANDING PAGE DE VENDAS B2B SCRIPT (INTERATIVIDADE E ATACADO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initSeatDecreaser();
  initCepChecker();
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
  const cardTimerEl = document.getElementById('card-timer');

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
    if (cardTimerEl) cardTimerEl.textContent = formatted;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   2. CONTADOR DE COTAS B2B RESTANTES
   -------------------------------------------------------------------------- */
function initSeatDecreaser() {
  const seatsEl = document.getElementById('vip-seats');
  const stockFillEl = document.getElementById('stock-fill');
  
  let currentSeats = parseInt(localStorage.getItem('z8_b2b_seats') || '9', 10);

  function updateSeatsUI() {
    if (seatsEl) seatsEl.textContent = currentSeats;
    if (stockFillEl) {
      const percentage = Math.max(12, (currentSeats / 50) * 100);
      stockFillEl.style.width = `${percentage}%`;
    }
  }

  updateSeatsUI();

  setInterval(() => {
    if (currentSeats > 3 && Math.random() > 0.65) {
      currentSeats--;
      localStorage.setItem('z8_b2b_seats', currentSeats);
      updateSeatsUI();
    }
  }, 30000);
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
      alert('Por favor, informe o seu CEP ou o nome da sua Cidade.');
      return;
    }

    btn.textContent = 'VERIFICANDO...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'VERIFICAR';
      btn.disabled = false;

      resultMsg.className = 'cep-result-msg active highlight-green';
      resultMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> EXCLUSIVIDADE DISPONÍVEL para "<strong>${val.toUpperCase()}</strong>"! Trave sua cidade antes do seu concorrente local.`;
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   4. CALCULADORA B2B DE LUCRATIVIDADE MENSAL DO LOJISTA
   -------------------------------------------------------------------------- */
function initB2bProfitCalculator() {
  const slider = document.getElementById('sales-slider');
  const salesDisplay = document.getElementById('sales-val');
  const monthlyProfitDisplay = document.getElementById('monthly-profit');
  const annualProfitDisplay = document.getElementById('annual-profit');

  if (!slider) return;

  function calculate() {
    const unitsPerMonth = parseInt(slider.value, 10);
    salesDisplay.textContent = `${unitsPerMonth} motos / mês`;

    // Lucro médio por unidade vendida = R$ 2.000,00 (Markup médio de 31,5% / Margem média de ~24%)
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
   5. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
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
   6. CHECKOUT MODAL B2B (PASSAPORTE R$ 97)
   -------------------------------------------------------------------------- */
function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const openBtns = document.querySelectorAll('.btn-open-checkout');
  const closeBtn = document.getElementById('btn-close-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const payOptions = document.querySelectorAll('.pay-option');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
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

  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('input-company').value || 'Sua Empresa';
      const city = document.getElementById('input-city').value || 'Sua Cidade';

      alert(`🎉 EXCLUSIVIDADE RESERVADA COM SUCESSO!\n\nEmpresa: ${company.toUpperCase()}\nRegião: ${city.toUpperCase()}\n\nSeu pedido de Reserva de Exclusividade Territorial (R$ 2.989,00) foi registrado!\nEste valor será 100% ABATIDO no seu pedido mínimo de 5 motos de atacado.\n\nO Dossiê Comercial B2B e as instruções de faturamento foram enviados para o seu e-mail e WhatsApp.`);
      modal.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   7. LIVE SALES POPUP B2B (SOCIAL PROOF CORPORATIVO)
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

// 8. FRANCHISE LEAD FORM SUBMIT
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('franchise-form-sales')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sales-lead-name')?.value || '';
    const city = document.getElementById('sales-lead-city')?.value || '';
    alert(`🎉 CADASTRO DE INTERESSE REGISTRADO COM SUCESSO!\n\nObrigado, ${name}!\nSua solicitação de franquia para a região de ${city} foi recebida.\n\nEnviamos a Tabela Oficial de Importação e a Minuta do Contrato de Franquia para o seu e-mail e WhatsApp.`);
  });
});
