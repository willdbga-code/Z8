/**
 * Z8 FRANQUIAS LANDING PAGE - INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initShowcaseTabs();
  initN95CGallery();
  initROICalculator();
  initFAQAccordion();
  initFranchiseForm();
});

/* --------------------------------------------------
 * 1. SHOWCASE CARD TABS & SLIDE SWITCHER
 * -------------------------------------------------- */
function initShowcaseTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tabs .tab-btn');
  const cards = document.querySelectorAll('.showcase-big-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Active state on buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Active state on cards
      cards.forEach(card => {
        card.classList.remove('active');
        if (card.id === `card-${targetTab}`) {
          card.classList.add('active');
        }
      });
    });
  });
}

/* --------------------------------------------------
 * 2. N95C GALLERY THUMBNAIL SWITCHER
 * -------------------------------------------------- */
function initN95CGallery() {
  const mainImg = document.getElementById('n95c-main-img');
  const thumbs = document.querySelectorAll('.thumb-img');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.src;
    });
  });
}

/* --------------------------------------------------
 * 3. INTERACTIVE ROI & PROFITABILITY CALCULATOR
 * -------------------------------------------------- */
function initROICalculator() {
  const cityBtns = document.querySelectorAll('.city-btn');
  const unitsRange = document.getElementById('units-range');
  const unitsVal = document.getElementById('units-val');

  const calcRevenue = document.getElementById('calc-revenue');
  const calcProfit = document.getElementById('calc-profit');
  const calcPayback = document.getElementById('calc-payback');

  if (!unitsRange) return;

  let selectedCityMultiplier = 1.0; // small: 1.0, medium: 1.15, large: 1.3

  cityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cityType = btn.getAttribute('data-city');
      if (cityType === 'small') selectedCityMultiplier = 1.0;
      if (cityType === 'medium') selectedCityMultiplier = 1.15;
      if (cityType === 'large') selectedCityMultiplier = 1.3;

      calculateROI();
    });
  });

  unitsRange.addEventListener('input', () => {
    if (unitsVal) unitsVal.textContent = `${unitsRange.value} motos / mês`;
    calculateROI();
  });

  function calculateROI() {
    const units = parseInt(unitsRange.value, 10);
    const bikePrice = 14900;
    
    // Revenue calculation
    const monthlyRevenue = units * bikePrice * selectedCityMultiplier;
    // Gross margin ~ 34%
    const monthlyProfit = monthlyRevenue * 0.34;

    // Payback estimation
    let paybackMonths = '14 a 18 Meses';
    if (units >= 25) paybackMonths = '10 a 12 Meses';
    else if (units >= 15) paybackMonths = '12 a 14 Meses';
    else paybackMonths = '16 a 20 Meses';

    // Format BRL
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });

    if (calcRevenue) calcRevenue.textContent = formatter.format(monthlyRevenue);
    if (calcProfit) calcProfit.textContent = formatter.format(monthlyProfit);
    if (calcPayback) calcPayback.textContent = paybackMonths;
  }

  calculateROI();
}

/* --------------------------------------------------
 * 4. FAQ ACCORDION TOGGLE
 * -------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------
 * 5. FRANCHISE LEAD FORM & MODAL
 * -------------------------------------------------- */
function initFranchiseForm() {
  const form = document.getElementById('franchise-form');
  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('whatsapp').value;

    // Trigger modal
    modal.classList.add('active');

    // Reset form
    form.reset();
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
