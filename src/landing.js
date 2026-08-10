import { z8Models } from './data/models.js';

document.addEventListener('DOMContentLoaded', () => {
  initUspScrubber();
  initCityRadar();
  initConfigurator();
  initForm();
});

/* 1. Radian USP Interactive Feature Scrubber */
function initUspScrubber() {
  const uspData = [
    {
      title: 'Troca de Bateria em 30 Segundos',
      desc: 'Baterias de Lítio removíveis de alta densidade (60V/72V). Módulos leves que garantem recarga rápida residencial ou substituição em 30 segundos.',
      image: '/assets/models/z8_tank_offroad.jpg'
    },
    {
      title: 'Potência Instantânea & 80 km/h',
      desc: 'Motor elétrico BLDC 2000W sem escova de imã permanente (Neodímio N45H). Torque instantâneo de 125 Nm sem atraso na aceleração.',
      image: '/assets/models/z8_fx10_sport.jpg'
    },
    {
      title: 'Chave Digital NFC & Keyless',
      desc: 'Partida sem chave física por aproximação de cartão NFC ou smartphone, alarme anti-furto inteligente e trava eletrônica de roda.',
      image: '/assets/models/z8_harley_x21.jpg'
    },
    {
      title: '100% Homologado SENATRAN',
      desc: 'Veículos com laudos técnicos ABNT/INMETRO e CAT emitido para expedição de Nota Fiscal com chassi VIN pré-cadastrado no RENAVAM.',
      image: '/assets/models/z8_n7_standard.jpg'
    },
    {
      title: 'Custo por Carga de R$ 1,50',
      desc: 'Economia imbatível. Custo de recarga completa em tomada comum de R$ 1,50 vs. R$ 20,00 de gasolina, com zero emissão de poluentes.',
      image: '/assets/models/z8_u2_delivery.jpg'
    }
  ];

  const menuItems = document.querySelectorAll('.usp-menu-item');
  const titleElem = document.getElementById('usp-title');
  const descElem = document.getElementById('usp-desc');
  const imgElem = document.getElementById('usp-img');

  menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      const data = uspData[index];
      if (data && titleElem && descElem && imgElem) {
        titleElem.innerText = data.title;
        descElem.innerText = data.desc;
        imgElem.src = data.image;
      }
    });
  });
}

/* 2. City Radar Exclusivity Scanner */
function initCityRadar() {
  const btn = document.getElementById('btn-check-city');
  const input = document.getElementById('city-search-input');
  const resultBox = document.getElementById('radar-result-box');
  const cityNameElem = document.getElementById('radar-city-name');

  btn?.addEventListener('click', () => {
    const city = (input.value || '').trim();
    if (!city) {
      alert('Por favor, digite o nome de sua cidade para verificar a disponibilidade.');
      return;
    }

    btn.innerHTML = `<span>Escaneando...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      btn.innerHTML = `<span>Escanear Território</span> <div class="pill-icon-circle"><i class="fa-solid fa-radar"></i></div>`;
      if (cityNameElem) cityNameElem.innerText = `${city} / Brasil`;
      resultBox?.classList.remove('hidden');
      resultBox?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  });
}

/* 3. B2B Configurator */
function initConfigurator() {
  const volPills = document.querySelectorAll('.vol-pill');
  const selectModel = document.getElementById('config-select-model');

  const cfgCost = document.getElementById('cfg-cost');
  const cfgRevenue = document.getElementById('cfg-revenue');
  const cfgProfit = document.getElementById('cfg-profit');
  const cfgMargin = document.getElementById('cfg-margin');

  let activeVol = 5;

  volPills.forEach(pill => {
    pill.addEventListener('click', () => {
      volPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeVol = parseInt(pill.getAttribute('data-vol'), 10);
      recalculate();
    });
  });

  selectModel?.addEventListener('change', recalculate);

  function recalculate() {
    const modelObj = z8Models.find(m => m.id === selectModel.value) || z8Models[0];
    
    let discountPct = 35;
    if (activeVol >= 25) discountPct = 55;
    else if (activeVol >= 10) discountPct = 45;

    const unitCost = modelObj.wholesalePrice * (1 - (discountPct - 35) * 0.005);
    const unitRetail = modelObj.retailPrice;

    const totalCost = unitCost * activeVol;
    const totalRevenue = unitRetail * activeVol;
    const totalProfit = totalRevenue - totalCost;
    const marginPct = ((totalProfit / totalRevenue) * 100).toFixed(1);

    if (cfgCost) cfgCost.innerText = `R$ ${Math.round(totalCost).toLocaleString('pt-BR')},00`;
    if (cfgRevenue) cfgRevenue.innerText = `R$ ${Math.round(totalRevenue).toLocaleString('pt-BR')},00`;
    if (cfgProfit) cfgProfit.innerText = `R$ ${Math.round(totalProfit).toLocaleString('pt-BR')},00`;
    if (cfgMargin) cfgMargin.innerText = `${marginPct}%`;
  }

  recalculate();
}

/* 4. Action Form */
function initForm() {
  const form = document.getElementById('radian-fast-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('r-name').value;
    const city = document.getElementById('r-city').value;

    alert(`🚀 PROPOSTA ENVIADA COM SUCESSO!\n\nObrigado, ${name}.\n\nA equipe de expansão Z8 E-motion entrou em contato e reservou o território de ${city}.\n\nVocê receberá o arquivo de Proposta Comercial em PDF e a minuta do contrato em seu WhatsApp e E-mail.`);
    form.reset();
  });
}
