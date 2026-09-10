/**
 * ============================================================================
 * Z8 E-MOTION | APRESENTAÇÃO DE FRANQUIA — MOTOR DE SLIDES (PITCH DECK)
 * Funcionalidades: Navegação Teclado, Touch/Swipe, Fullscreen, PDF, Drawer & Leads
 * ============================================================================
 */

class DeckApp {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.deck-slide'));
    this.totalSlides = this.slides.length;
    this.currentIndex = 0;

    // Elementos DOM
    this.progressBar = document.getElementById('deck-progress-bar');
    this.titleDisplay = document.getElementById('slide-title-display');
    this.currentNumDisplay = document.getElementById('current-slide-num');
    this.totalNumDisplay = document.getElementById('total-slides-num');
    this.dotsContainer = document.getElementById('slide-dots-container');
    this.btnPrev = document.getElementById('btn-prev-slide');
    this.btnNext = document.getElementById('btn-next-slide');

    // Drawer de Índice
    this.drawer = document.getElementById('slide-drawer');
    this.drawerOverlay = document.getElementById('drawer-overlay');
    this.drawerList = document.getElementById('drawer-slide-list');
    this.btnToggleIndex = document.getElementById('btn-toggle-index');
    this.btnCloseDrawer = document.getElementById('btn-close-drawer');

    // Botões de Ação
    this.btnFullscreen = document.getElementById('btn-fullscreen');
    this.btnPrint = document.getElementById('btn-print-deck');

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Inicializa contador total
    if (this.totalNumDisplay) {
      this.totalNumDisplay.innerText = String(this.totalSlides).padStart(2, '0');
    }

    this.buildDots();
    this.buildDrawerList();
    this.bindEvents();

    // Lê slide inicial da URL (hash #slide-X) ou começa no 0
    const hashMatch = window.location.hash.match(/#slide-(\d+)/);
    if (hashMatch && hashMatch[1]) {
      const initialSlide = parseInt(hashMatch[1], 10) - 1;
      if (initialSlide >= 0 && initialSlide < this.totalSlides) {
        this.goToSlide(initialSlide, false);
        return;
      }
    }

    this.goToSlide(0, false);
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (idx === 0 ? ' active' : '');
      dot.title = `Slide ${idx + 1}: ${slide.dataset.title || ''}`;
      dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
      dot.addEventListener('click', () => this.goToSlide(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  buildDrawerList() {
    if (!this.drawerList) return;
    this.drawerList.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const item = document.createElement('div');
      item.className = 'drawer-item' + (idx === 0 ? ' active' : '');
      item.innerHTML = `
        <span class="drawer-item-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="drawer-item-title">${slide.dataset.title || `Slide ${idx + 1}`}</span>
      `;
      item.addEventListener('click', () => {
        this.goToSlide(idx);
        this.closeDrawer();
      });
      this.drawerList.appendChild(item);
    });
  }

  goToSlide(index, updateHistory = true) {
    if (index < 0 || index >= this.totalSlides) return;

    // Desativa slide atual
    this.slides[this.currentIndex].classList.remove('active');

    // Ativa novo slide
    this.currentIndex = index;
    const currentSlide = this.slides[this.currentIndex];
    currentSlide.classList.add('active');

    // Atualiza título do slide no header
    if (this.titleDisplay) {
      this.titleDisplay.innerText = currentSlide.dataset.title || `Slide ${index + 1}`;
    }

    // Atualiza número no rodapé
    if (this.currentNumDisplay) {
      this.currentNumDisplay.innerText = String(index + 1).padStart(2, '0');
    }

    // Atualiza barra de progresso linear
    if (this.progressBar) {
      const pct = ((index + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    // Atualiza dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.slide-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }

    // Atualiza drawer items
    if (this.drawerList) {
      const items = this.drawerList.querySelectorAll('.drawer-item');
      items.forEach((item, idx) => {
        item.classList.toggle('active', idx === index);
      });
    }

    // Atualiza estado dos botões Anterior / Próximo
    if (this.btnPrev) this.btnPrev.disabled = index === 0;
    if (this.btnNext) this.btnNext.disabled = index === this.totalSlides - 1;

    // Atualiza hash da URL sem scroll
    if (updateHistory) {
      history.replaceState(null, '', `#slide-${index + 1}`);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  toggleDrawer() {
    if (!this.drawer) return;
    const isOpen = this.drawer.classList.contains('open');
    if (isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    this.drawer?.classList.add('open');
    this.drawerOverlay?.classList.add('open');
  }

  closeDrawer() {
    this.drawer?.classList.remove('open');
    this.drawerOverlay?.classList.remove('open');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen não suportado ou bloqueado:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  printDeck() {
    window.print();
  }

  bindEvents() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      // Ignora atalhos caso o usuário esteja digitando no formulário
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Barra de espaço
          e.preventDefault();
          this.nextSlide();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;

        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;

        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        case 'i':
        case 'I':
          e.preventDefault();
          this.toggleDrawer();
          break;

        case 'Escape':
          this.closeDrawer();
          break;
      }
    });

    // Touch / Swipe em dispositivos móveis
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Detecta swipe horizontal dominante (> 50px)
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });

    // Drawer eventos
    this.btnToggleIndex?.addEventListener('click', () => this.toggleDrawer());
    this.btnCloseDrawer?.addEventListener('click', () => this.closeDrawer());
    this.drawerOverlay?.addEventListener('click', () => this.closeDrawer());

    // Botões de Ação
    this.btnFullscreen?.addEventListener('click', () => this.toggleFullscreen());
    this.btnPrint?.addEventListener('click', () => this.printDeck());

    // Atualiza ícone do botão fullscreen
    document.addEventListener('fullscreenchange', () => {
      if (this.btnFullscreen) {
        const isFs = !!document.fullscreenElement;
        this.btnFullscreen.innerHTML = isFs 
          ? `<i class="fa-solid fa-compress"></i><span class="btn-text">Sair</span>` 
          : `<i class="fa-solid fa-expand"></i><span class="btn-text">Tela Cheia</span>`;
      }
    });
  }

  // Captura e Envio de Leads no Slide 10
  async submitLead() {
    const nameInput = document.getElementById('lead-name');
    const phoneInput = document.getElementById('lead-phone');
    const emailInput = document.getElementById('lead-email');
    const cityInput = document.getElementById('lead-city');
    const stateInput = document.getElementById('lead-state');
    const feedbackDiv = document.getElementById('lead-feedback');
    const btnSubmit = document.getElementById('btn-submit-lead');

    if (!nameInput?.value || !phoneInput?.value || !emailInput?.value) {
      if (feedbackDiv) {
        feedbackDiv.style.color = '#f87171';
        feedbackDiv.innerText = 'Por favor, preencha todos os campos obrigatórios.';
      }
      return;
    }

    const leadData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      city: cityInput.value.trim(),
      state: stateInput.value,
      source: 'pitch_deck_apresentacao',
      createdAt: new Date().toISOString()
    };

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processando...`;
    }

    // 1. Salva localmente em localStorage
    try {
      const existingLeads = JSON.parse(localStorage.getItem('franchise_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('franchise_leads', JSON.stringify(existingLeads));
    } catch (e) {
      console.warn('Erro ao salvar lead local:', e);
    }

    // 2. Dispara tentativa de envio para endpoint Vercel /api/leads se disponível
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    } catch (err) {
      // Falha silenciosa online, mantendo lead garantido localmente
    }

    // 3. Feedback visual e direcionamento ao WhatsApp
    if (feedbackDiv) {
      feedbackDiv.style.color = '#10b981';
      feedbackDiv.innerHTML = `
        <i class="fa-solid fa-circle-check"></i> Cadastro recebido com sucesso! Redirecionando para a Diretoria de Expansão...
      `;
    }

    setTimeout(() => {
      const msg = encodeURIComponent(
        `Olá, acabei de assistir à Apresentação de Franquia Z8 (Pitch Deck). Meu nome é ${leadData.name}, de ${leadData.city}/${leadData.state}. Gostaria de receber a COF e verificar a disponibilidade da minha praça.`
      );
      window.open(`https://wa.me/5512998008818?text=${msg}`, '_blank');
      
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i class="fa-solid fa-check"></i> Cadastrado!`;
      }
    }, 1200);
  }
}

// Inicialização Global
const deckApp = new DeckApp();
window.deckApp = deckApp;
