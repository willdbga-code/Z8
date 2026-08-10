document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTabs();
  initBlueprintViewer();
  initVinDecoder();
});

/* Theme Toggle */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('z8-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (toggle) toggle.checked = savedTheme === 'dark';

  toggle?.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('z8-theme', newTheme);
  });
}

/* Tabs Switcher */
function initTabs() {
  const btns = document.querySelectorAll('.skeuo-nav-btn');
  const tabs = document.querySelectorAll('.brandbook-tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetTab = document.getElementById(targetId);
      if (targetTab) targetTab.classList.add('active');
    });
  });
}

/* Architectural Blueprint Zone Interactive Click */
function initBlueprintViewer() {
  const zonesData = {
    z1: {
      title: 'ZONA 1: SHOWROOM PRINCIPAL (60 m²)',
      desc: 'Área frontal com iluminação em refletores LED direcionais 4000K, revestimento em piso epóxi autonivelante na cor Cinza Titânio Fosco e faixas demarcatórias em resina Verde Volt para exposição de scooters urbanas e e-bikes.',
      equip: '6 Expositores de Motos, Banners LED, Totem Touchscreen de Orçamentos'
    },
    z2: {
      title: 'ZONA 2: PODIUM DE ALTA PERFORMANCE (30 m²)',
      desc: 'Ilha com plataforma elevada de 15cm, moldura com fita LED Ciano no rodapé e iluminação de destaque projetada para exibição das motos topo de linha (Z8 Tank 80km/h e FX-10 Sport).',
      equip: 'Podium Elevado, Iluminação Neon Volt/Ciano, Ficha Técnica em Vidro Bisotado'
    },
    z3: {
      title: 'ZONA 3: BALCÃO DE ATENDIMENTO B2B E ORÇAMENTOS (25 m²)',
      desc: 'Balcão metálico escovado estilo esqueuomórfico equipado com 2 estações de trabalho para consultores de vendas, tablets de simulação de ROI e emissão de propostas.',
      equip: 'Balcão Metálico 3m, 2 Computadores com Sistema Z8 B2B, Carregadores por Indução'
    },
    z4: {
      title: 'ZONA 4: LOUNGE DO CLIENTE & COFFEE BAR (20 m²)',
      desc: 'Espaço VIP para recepção de clientes e franqueados com sofás em couro preto, máquina de café expresso e expositores de capacetes e jaquetas originais Z8 E-motion.',
      equip: 'Sofás Couro, Cafeteira Expresso, Expositores Iluminados de Capacetes'
    },
    z5: {
      title: 'ZONA 5: OFICINA TÉCNICA CERTIFICADA (45 m²)',
      desc: 'Ambiente técnico separado por divisória de vidro industrial, equipado com elevador hidráulico veicular, bancada modular de ferramentas isoladas para sistemas elétricos e exaustão térmica.',
      equip: 'Elevador Hidráulico para Motos 500kg, Bancada de Ferramentas Isoladas 1000V, Carregador Industrial Fast Charge 380V'
    },
    z6: {
      title: 'ZONA 6: ESTOQUE DE PEÇAS & BATERIAS (20 m²)',
      desc: 'Almoxarifado ventilado com prateleiras de aço para armazenamento de módulos de baterias de lítio, controladores FOC, pneus e peças de reposição de giro rápido.',
      equip: 'Prateleiras Industriais de Aço, Armário Ignífugo para Baterias, Sistema de Exaustão'
    }
  };

  const zoneCards = document.querySelectorAll('.blueprint-zone');
  const titleElem = document.getElementById('zone-title');
  const descElem = document.getElementById('zone-desc');
  const equipElem = document.getElementById('zone-equip');

  zoneCards.forEach(card => {
    card.addEventListener('click', () => {
      zoneCards.forEach(c => c.classList.remove('zone-active'));
      card.classList.add('zone-active');

      const zoneKey = card.getAttribute('data-zone');
      const data = zonesData[zoneKey];
      if (data && titleElem && descElem && equipElem) {
        titleElem.innerText = data.title;
        descElem.innerText = data.desc;
        equipElem.innerHTML = `<span><strong>Equipamentos & Mídia:</strong> ${data.equip}</span>`;
      }
    });
  });
}

/* VIN Decoder Simulator */
function initVinDecoder() {
  const btn = document.getElementById('btn-decode-vin');
  const input = document.getElementById('vin-input');
  const resultsBox = document.getElementById('vin-results-box');

  btn?.addEventListener('click', () => {
    const vin = (input.value || '').trim().toUpperCase();
    if (vin.length !== 17) {
      alert('⚠️ O código VIN de chassi deve conter exatamente 17 caracteres.');
      return;
    }

    const wmi = vin.substring(0, 3);
    const vds = vin.substring(3, 8);
    const yearChar = vin.charAt(9);
    const plantChar = vin.charAt(10);
    const vis = vin.substring(11);

    resultsBox.innerHTML = `
      <div class="vin-res-card">
        <span class="vin-res-label">WMI (Posição 1-3)</span>
        <strong class="text-cyan">${wmi} (${wmi === '9Z8' ? 'Fabricante/Importador Z8 Brasil' : 'Código Válido'})</strong>
      </div>
      <div class="vin-res-card">
        <span class="vin-res-label">Modelo VDS (Posição 4-8)</span>
        <strong class="text-neon">${vds} (Família Z8 E-motion)</strong>
      </div>
      <div class="vin-res-card">
        <span class="vin-res-label">Ano Modelo (Posição 10)</span>
        <strong class="text-gold">Ano ${yearChar === 'T' ? '2026' : '2025/2026'} (Letra ${yearChar})</strong>
      </div>
      <div class="vin-res-card">
        <span class="vin-res-label">Planta Fabricação (Pos 11)</span>
        <strong class="text-emerald">Planta ${plantChar === 'A' ? 'China Matriz' : 'CKD Brasil'} (${plantChar})</strong>
      </div>
      <div class="vin-res-card" style="grid-column: 1 / -1;">
        <span class="vin-res-label">Número Sequencial de Série (VIS)</span>
        <strong class="text-white">${vis} | Pré-Cadastro Liberado para Emplacamento no RENAVAM / DETRAN</strong>
      </div>
    `;
  });
}
