import { inject } from '@vercel/analytics';
import { checkCityAvailability } from './cities-cluster.js';
import { loginCatalogUser, registerCatalogUser } from '../site-principal/catalog-auth.js';
import { saveLead } from './firebase-config.js';

// Inicializa Vercel Web Analytics
inject();


document.addEventListener('DOMContentLoaded', () => {
  initHeroStageSwitcher();
  initCepChecker();
  initCatalogTabs();
  initCatalogSlider();
  initVehicleLightbox();
  initColorSwatches();
  initB2bProfitCalculator();
  initFaqAccordion();
  initInvestorLeadModal();
  initCheckoutModal();
  initPortalLoginModal();
});

/* --------------------------------------------------------------------------
   2. HERO STAGE VEHICLE SWITCHER (PADRÃO MONTADORA HYUNDAI LUXURY)
   -------------------------------------------------------------------------- */
function initHeroStageSwitcher() {
  const switchBtns = document.querySelectorAll('.stage-switch-btn');
  const imgEl = document.getElementById('hero-main-stage-img');
  const nameEl = document.getElementById('hero-stage-model-name');
  const powerEl = document.getElementById('hero-telemetry-power');
  const speedEl = document.getElementById('hero-telemetry-speed');
  const rangeEl = document.getElementById('hero-telemetry-range');
  const cnhEl = document.getElementById('hero-telemetry-cnh');
  const profitEl = document.getElementById('hero-telemetry-profit');

  if (!switchBtns.length || !imgEl) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgPath = btn.getAttribute('data-img');
      const name = btn.getAttribute('data-name');
      const power = btn.getAttribute('data-power');
      const speed = btn.getAttribute('data-speed');
      const range = btn.getAttribute('data-range');
      const cnh = btn.getAttribute('data-cnh');
      const profit = btn.getAttribute('data-profit');

      if (imgPath) {
        imgEl.style.opacity = '0.25';
        imgEl.style.transform = 'scale(0.96)';
        const tempImg = new Image();
        tempImg.onload = () => {
          imgEl.src = imgPath;
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        };
        tempImg.src = imgPath;
      }
      if (nameEl && name) nameEl.textContent = name;
      if (powerEl && power) powerEl.textContent = power;
      if (speedEl && speed) speedEl.textContent = speed;
      if (rangeEl && range) rangeEl.textContent = range;
      if (cnhEl && cnh) cnhEl.textContent = cnh;
      if (profitEl && profit) profitEl.textContent = profit;
    });
  });
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
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(239,68,68,0.3);">
              <span style="font-size: 0.74rem; color: #991B1B; display: block; margin-bottom: 6px; font-weight: 700;">
                💡 CIDADES VIZINHAS DISPONÍVEIS NO MESMO RAIO DE 50KM:
              </span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${availability.neighbors.map(n => `
                  <button type="button" class="btn-neighbor-cep" data-city="${n}" style="background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer; font-family: inherit; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                    <i class="fa-solid fa-plus" style="color: #10B981;"></i> ${n}
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }

        resultMsg.innerHTML = `
          <div class="city-availability-card occupied">
            <div class="availability-header">
              <div class="radar-pulse-wrap occupied">
                <i class="fa-solid fa-circle-xmark radar-core-icon"></i>
              </div>
              <div class="availability-info">
                <strong class="avail-title">TERRITÓRIO EM ATENDIMENTO // ${availability.city.toUpperCase()}</strong>
                <p class="avail-desc">Esta praça já possui parceiro homologado Z8 (<strong>${availability.company}</strong>). Escolha uma praça vizinha livre no mesmo polo:</p>
              </div>
            </div>
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
          <div class="city-availability-card available">
            <div class="availability-header">
              <div class="radar-pulse-wrap">
                <span class="radar-ping"></span>
                <i class="fa-solid fa-shield-halved radar-core-icon"></i>
              </div>
              <div class="availability-info">
                <strong class="avail-title">PRAÇA 100% DISPONÍVEL // 50KM DE MONOPÓLIO</strong>
                <p class="avail-desc">A concessão oficial exclusiva para <strong>${val.toUpperCase()}</strong> está livre para reserva imediata.</p>
              </div>
            </div>
            <button type="button" class="btn-open-checkout btn-avail-reserve" data-city="${val}">
              <i class="fa-solid fa-shield-halved"></i>
              <span>RESERVAR MINHA CIDADE COM EXCLUSIVIDADE</span>
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
  const investorCity = document.getElementById('investor-city');
  if (investorCity) {
    investorCity.value = cityName;
    investorCity.dispatchEvent(new Event('input'));
  }
  const cityInput = document.getElementById('input-city');
  if (cityInput) {
    cityInput.value = cityName;
    cityInput.dispatchEvent(new Event('input'));
  }
  const investorModal = document.getElementById('investor-lead-modal');
  if (investorModal) {
    investorModal.classList.add('active');
  } else {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('active');
  }
  trackConversionEvent('begin_checkout', {
    content_name: `Candidatura Concessão (${cityName})`,
    currency: 'BRL'
  });
}

/* --------------------------------------------------------------------------
   4. FILTRO DE CATEGORIAS E SELETOR EM MODO SLIDE (CARROSSEL HYUNDAI MOTOR)
   -------------------------------------------------------------------------- */
let updateSlideCounterGlobal = null;

function initCatalogTabs() {
  const tabBtns = document.querySelectorAll('.catalog-tab-btn');
  const cards = document.querySelectorAll('.product-card-editorial');
  const gridEl = document.getElementById('catalog-grid-cards');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('is-filtered-out');
        } else {
          card.style.display = 'none';
          card.classList.add('is-filtered-out');
        }
      });

      // Retorna ao primeiro card visível
      if (gridEl) {
        gridEl.scrollTo({ left: 0, behavior: 'smooth' });
      }

      if (typeof updateSlideCounterGlobal === 'function') {
        updateSlideCounterGlobal();
      }
    });
  });
}

function initCatalogSlider() {
  const gridEl = document.getElementById('catalog-grid-cards');
  const prevBtn = document.getElementById('catalog-slide-prev');
  const nextBtn = document.getElementById('catalog-slide-next');
  const counterEl = document.getElementById('catalog-slide-counter');
  const viewSlideBtn = document.getElementById('catalog-view-slide');
  const viewGridBtn = document.getElementById('catalog-view-grid');

  if (!gridEl) return;

  function getVisibleCards() {
    return Array.from(gridEl.querySelectorAll('.product-card-editorial')).filter(c => c.style.display !== 'none');
  }

  function updateCounterAndArrows() {
    const visibleCards = getVisibleCards();
    const total = visibleCards.length;
    if (total === 0) {
      if (counterEl) counterEl.innerHTML = '<strong>00</strong> / 00';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    if (!gridEl.classList.contains('mode-slide')) {
      if (counterEl) counterEl.innerHTML = `<strong>${String(total).padStart(2, '0')}</strong> / ${String(total).padStart(2, '0')}`;
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    const scrollLeft = gridEl.scrollLeft;
    const maxScroll = Math.max(0, gridEl.scrollWidth - gridEl.clientWidth);

    // Achar o card visível mais próximo do início da visualização
    let currentIndex = 0;
    let minDiff = Infinity;
    visibleCards.forEach((card, idx) => {
      const diff = Math.abs(card.offsetLeft - gridEl.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        currentIndex = idx;
      }
    });

    const activeNum = String(currentIndex + 1).padStart(2, '0');
    const totalNum = String(total).padStart(2, '0');
    if (counterEl) {
      counterEl.innerHTML = `<strong>${activeNum}</strong> / ${totalNum}`;
    }

    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 8;
    }
    if (nextBtn) {
      nextBtn.disabled = scrollLeft >= maxScroll - 8;
    }
  }

  updateSlideCounterGlobal = updateCounterAndArrows;

  // Navegação Prev / Next
  function getStepWidth() {
    const visibleCards = getVisibleCards();
    if (visibleCards.length > 0) {
      const firstCard = visibleCards[0];
      const style = window.getComputedStyle(gridEl);
      const gap = parseFloat(style.gap) || 20;
      return firstCard.offsetWidth + gap;
    }
    return 340;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getStepWidth();
      gridEl.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getStepWidth();
      gridEl.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Scroll listener com throttle rAF
  let ticking = false;
  gridEl.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCounterAndArrows();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Alternador de Visualização (Slide vs Grade)
  if (viewSlideBtn && viewGridBtn) {
    viewSlideBtn.addEventListener('click', () => {
      viewSlideBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      gridEl.classList.add('mode-slide');
      updateCounterAndArrows();
    });

    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewSlideBtn.classList.remove('active');
      gridEl.classList.remove('mode-slide');
      updateCounterAndArrows();
    });
  }

  // Inicializa o estado
  updateCounterAndArrows();
}

/* --------------------------------------------------------------------------
   4.2 AMPLIADOR DE IMAGEM & INSPEÇÃO EM ALTA RESOLUÇÃO (ESTÚDIO Z8 LUXURY)
   -------------------------------------------------------------------------- */
function initVehicleLightbox() {
  const modal = document.getElementById('vehicle-lightbox-modal');
  const closeBtn = document.getElementById('lightbox-btn-close');
  const viewport = document.getElementById('lightbox-viewport');
  const canvas = document.getElementById('lightbox-stage-canvas');
  const activeImg = document.getElementById('lightbox-active-img');
  const modelNameEl = document.getElementById('lightbox-model-name');
  const modelSpecsEl = document.getElementById('lightbox-model-specs');
  const zoomLevelEl = document.getElementById('lightbox-zoom-level');
  const zoomInBtn = document.getElementById('lightbox-zoom-in');
  const zoomOutBtn = document.getElementById('lightbox-zoom-out');
  const zoomResetBtn = document.getElementById('lightbox-zoom-reset');
  const navPrevBtn = document.getElementById('lightbox-nav-prev');
  const navNextBtn = document.getElementById('lightbox-nav-next');
  const swatchesContainer = document.getElementById('lightbox-swatches-container');
  const activeColorNameEl = document.getElementById('lightbox-active-color-name');
  const profitValEl = document.getElementById('lightbox-profit-val');
  const reserveBtn = document.getElementById('lightbox-btn-reserve');
  const hintBadge = document.getElementById('lightbox-hint-badge');

  if (!modal || !viewport || !canvas || !activeImg) return;

  // Estado do Ampliador
  let currentModelIndex = 0;
  let scale = 1;
  const minScale = 1;
  const maxScale = 3.5;
  const stepScale = 0.5;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Coleta referências dos cards
  const cards = Array.from(document.querySelectorAll('.product-card-editorial'));
  if (!cards.length) return;

  function getModelData(card) {
    const name = card.querySelector('.product-model-name')?.textContent?.trim() || 'Z8 E-Motion';
    const specs = card.querySelector('.product-specs-pill')?.textContent?.trim() || '';
    const imgEl = card.querySelector('.product-img');
    const mainImgSrc = imgEl ? (imgEl.currentSrc || imgEl.getAttribute('src') || imgEl.src) : '';
    const profitEl = card.querySelector('.price-val-profit')?.textContent?.trim() || '+ R$ 4.000,00';

    const swatches = Array.from(card.querySelectorAll('.color-swatch-btn')).map(sw => ({
      color: sw.getAttribute('data-color') || '',
      img: sw.getAttribute('data-img') || '',
      bg: sw.style.backgroundColor || '#000000',
      isActive: sw.classList.contains('active')
    }));

    return { name, specs, mainImgSrc, profit: profitEl, swatches };
  }

  function applyTransform(withTransition = false) {
    if (withTransition) {
      canvas.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      canvas.style.transition = 'none';
    }
    canvas.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;

    if (zoomLevelEl) {
      zoomLevelEl.textContent = `${Math.round(scale * 100)}%`;
    }

    if (scale <= 1) {
      translateX = 0;
      translateY = 0;
      viewport.style.cursor = 'grab';
    } else {
      viewport.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  }

  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform(true);
  }

  function setZoom(newScale, withTransition = true) {
    scale = Math.min(Math.max(newScale, minScale), maxScale);
    if (scale === 1) {
      translateX = 0;
      translateY = 0;
    }
    applyTransform(withTransition);
  }

  function loadModel(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentModelIndex = index;

    const card = cards[currentModelIndex];
    const data = getModelData(card);

    if (modelNameEl) modelNameEl.textContent = data.name;
    if (modelSpecsEl) modelSpecsEl.textContent = data.specs;
    if (profitValEl) profitValEl.textContent = data.profit;

    // Reseta zoom ao trocar de modelo
    resetZoom();

    // Injeta Swatches na Lightbox
    if (swatchesContainer) {
      swatchesContainer.innerHTML = '';
      const activeColor = data.swatches.find(s => s.isActive) || data.swatches[0];

      data.swatches.forEach(sw => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `lightbox-swatch-btn ${sw.isActive ? 'active' : ''}`;
        btn.style.backgroundColor = sw.bg;
        btn.title = sw.color;
        btn.setAttribute('aria-label', sw.color);

        btn.addEventListener('click', () => {
          swatchesContainer.querySelectorAll('.lightbox-swatch-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (activeColorNameEl) activeColorNameEl.textContent = sw.color;

          activeImg.src = sw.img;
          activeImg.style.opacity = '1';
        });

        swatchesContainer.appendChild(btn);
      });

      if (activeColorNameEl && activeColor) {
        activeColorNameEl.textContent = activeColor.color;
      }
    }

    // Carrega imagem principal imediatamente (já pré-carregada pelo card)
    if (data.mainImgSrc) {
      activeImg.src = data.mainImgSrc;
      activeImg.style.opacity = '1';
    }
  }

  function openLightbox(index) {
    loadModel(index);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Oculta hint após 4 segundos
    if (hintBadge) {
      hintBadge.style.opacity = '1';
      setTimeout(() => {
        hintBadge.style.opacity = '0';
      }, 4000);
    }
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
  }

  // Delegação de eventos no container de catálogo (#catalogo)
  const catalogSection = document.getElementById('catalogo');
  if (catalogSection) {
    catalogSection.addEventListener('click', (e) => {
      const zoomTrigger = e.target.closest('.btn-card-zoom-trigger');
      const imgWrap = e.target.closest('.product-image-wrap');

      if (zoomTrigger || imgWrap) {
        if (e.target.closest('.color-swatches-row') || e.target.closest('.btn-card-reserve')) return;

        e.preventDefault();
        e.stopPropagation();

        const card = e.target.closest('.product-card-editorial');
        if (card) {
          const allCards = Array.from(document.querySelectorAll('.product-card-editorial'));
          const idx = allCards.indexOf(card);
          if (idx !== -1) {
            openLightbox(idx);
          }
        }
      }
    });
  }

  // Também expõe no window global para testes diretos
  window.openVehicleLightbox = openLightbox;

  // Fechamento
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') loadModel(currentModelIndex - 1);
    if (e.key === 'ArrowRight') loadModel(currentModelIndex + 1);
    if (e.key === '+' || e.key === '=') setZoom(scale + stepScale);
    if (e.key === '-' || e.key === '_') setZoom(scale - stepScale);
    if (e.key === '0') resetZoom();
  });

  // Navegação Prev / Next
  if (navPrevBtn) {
    navPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadModel(currentModelIndex - 1);
    });
  }

  if (navNextBtn) {
    navNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadModel(currentModelIndex + 1);
    });
  }

  // Botões de Zoom
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(scale + stepScale);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(scale - stepScale);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetZoom();
    });
  }

  // Double-Click / Double-Tap para alternar zoom 1x / 2x
  let lastTap = 0;
  viewport.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (scale > 1) {
        resetZoom();
      } else {
        setZoom(2);
      }
    }
    lastTap = now;
  });

  // Zoom pelo Mouse Wheel
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom(scale + delta, false);
  }, { passive: false });

  // Pan & Arraste com Mouse
  viewport.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    isDragging = true;
    viewport.classList.add('is-dragging');
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    // Limites de deslocamento com base no zoom
    const maxBoundX = (scale - 1) * (viewport.clientWidth * 0.45);
    const maxBoundY = (scale - 1) * (viewport.clientHeight * 0.45);
    translateX = Math.max(-maxBoundX, Math.min(maxBoundX, translateX));
    translateY = Math.max(-maxBoundY, Math.min(maxBoundY, translateY));

    applyTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.classList.remove('is-dragging');
      applyTransform(true);
    }
  });

  // Pan & Arraste com Touch (Mobile)
  // Gestos Touch Mobile: Pan quando ampliado e Swipe Left/Right em 1x
  let touchStartX = 0;
  let touchStartY = 0;
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    if (scale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (scale > 1 && isDragging && e.touches.length === 1) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;

      const maxBoundX = (scale - 1) * (viewport.clientWidth * 0.45);
      const maxBoundY = (scale - 1) * (viewport.clientHeight * 0.45);
      translateX = Math.max(-maxBoundX, Math.min(maxBoundX, translateX));
      translateY = Math.max(-maxBoundY, Math.min(maxBoundY, translateY));

      applyTransform(false);
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (scale <= 1 && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          loadModel(currentModelIndex + 1); // Swipe left -> Próximo
        } else {
          loadModel(currentModelIndex - 1); // Swipe right -> Anterior
        }
      }
    }
    if (isDragging) {
      isDragging = false;
      applyTransform(true);
    }
  });

  // Botão de Reserva na Lightbox
  if (reserveBtn) {
    reserveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeLightbox();
      const currentCard = cards[currentModelIndex];
      const modelName = currentCard?.querySelector('.product-model-name')?.textContent?.trim() || '';
      
      const tripwire = document.getElementById('tripwire-offer');
      if (tripwire) {
        tripwire.scrollIntoView({ behavior: 'smooth' });
      }

      // Se houver modal de candidatura, abre com nome do modelo pré-preenchido
      const investorModal = document.getElementById('investor-lead-modal');
      if (investorModal) {
        investorModal.classList.add('active');
        const notes = document.getElementById('investor-experience');
        if (notes && !notes.value) {
          notes.value = `Interesse no modelo: ${modelName}`;
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4.1 SELETOR INTERATIVO DE CORES DE MONTADORA (ESTILO HYUNDAI MOTOR)
   -------------------------------------------------------------------------- */
function initColorSwatches() {
  const swatchButtons = document.querySelectorAll('.color-swatch-btn');
  swatchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = btn.closest('.product-card-editorial');
      if (!parentCard) return;

      const imgEl = parentCard.querySelector('.product-img');
      const labelEl = parentCard.querySelector('.active-color-name');
      const siblingSwatches = parentCard.querySelectorAll('.color-swatch-btn');

      const targetImg = btn.getAttribute('data-img');
      const colorName = btn.getAttribute('data-color');

      // Atualiza visualização das amostras (swatches)
      siblingSwatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      if (labelEl && colorName) {
        labelEl.textContent = colorName;
      }

      if (imgEl && targetImg && !imgEl.src.includes(targetImg)) {
        imgEl.style.opacity = '0.35';
        imgEl.style.transform = 'scale(0.98)';
        
        const preloadImg = new Image();
        preloadImg.onload = () => {
          imgEl.src = targetImg;
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        };
        preloadImg.onerror = () => {
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        };
        preloadImg.src = targetImg;
      }
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
  const rulerTicks = document.querySelectorAll('#slider-ruler .ruler-tick');

  if (!slider) return;

  function calculate() {
    const unitsPerMonth = Math.max(5, Math.min(50, parseInt(slider.value, 10) || 5));
    if (salesDisplay) salesDisplay.textContent = `${unitsPerMonth} motos / mês`;

    // Atualiza preenchimento visual com precisão milimétrica alinhada ao centro do thumb (26px)
    const f = (unitsPerMonth - 5) / (50 - 5);
    slider.style.background = `linear-gradient(to right, #002C5F 0%, #002C5F calc(13px + (100% - 26px) * ${f}), #E2E8F0 calc(13px + (100% - 26px) * ${f}), #E2E8F0 100%)`;

    // Atualiza marcações ativas e passadas na régua
    rulerTicks.forEach(tick => {
      const v = parseInt(tick.getAttribute('data-val'), 10);
      tick.classList.toggle('active', v === unitsPerMonth);
      tick.classList.toggle('passed', v <= unitsPerMonth);
    });

    // Lucro médio por unidade = R$ 4.000,00 (Markup médio de ~68% direto de fábrica)
    const monthlyProfit = unitsPerMonth * 4000;
    const annualProfit = monthlyProfit * 12;

    if (monthlyProfitDisplay) {
      monthlyProfitDisplay.textContent = `R$ ${monthlyProfit.toLocaleString('pt-BR')}`;
    }
    if (annualProfitDisplay) {
      annualProfitDisplay.textContent = `R$ ${annualProfit.toLocaleString('pt-BR')}`;
    }

    // Atualização dinâmica do micro-gráfico de eficiência de capital (ROI)
    const costBar = document.getElementById('roi-bar-cost');
    const profitBar = document.getElementById('roi-bar-profit');
    const roiBadge = document.getElementById('roi-chart-badge');
    const profitMarginPct = 41;
    const costPct = 59;
    if (costBar) costBar.style.width = `${costPct}%`;
    if (profitBar) profitBar.style.width = `${profitMarginPct}%`;
    if (roiBadge) roiBadge.textContent = `${profitMarginPct}% Margem Líquida (${unitsPerMonth} un/mês)`;
  }

  // Clique interativo direto nas marcações da régua
  rulerTicks.forEach(tick => {
    tick.addEventListener('click', () => {
      const val = parseInt(tick.getAttribute('data-val'), 10);
      if (!isNaN(val) && slider) {
        slider.value = val;
        calculate();
      }
    });
  });

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

  // 3. Meta Pixel (Facebook Ads)
  if (typeof window.fbq === 'function') {
    if (eventName === 'begin_checkout') {
      window.fbq('track', 'InitiateCheckout', { 
        content_name: data.content_name || 'Candidatura Franquia Z8',
        currency: 'BRL'
      });
    } else if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', {
        content_name: data.content_name || 'Perfil Investidor Franquia Z8',
        content_category: 'Franquias e Atacado Direct-Factory',
        value: Number(data.value || 0),
        currency: 'BRL',
        company: data.company || '',
        city: data.city || '',
        lead_quality: data.temperature || 'possivel',
        lead_score: data.score || 50
      });
    }
  }
}

/* --------------------------------------------------------------------------
   7.1 MODAL DE ENTRADA B2B: CAPTURA DE LEADS & PERFIL DE INVESTIDOR
   - Abre automaticamente ao carregar a página para qualificação
   - Integração com Pixel do Facebook (fbq 'Lead')
   - Validação em tempo real de WhatsApp com /api/verify-phone
   - Algoritmo de Lead Scoring: Quente 🔥, Público Possível ⚡ e Frio ❄️
   -------------------------------------------------------------------------- */
function initInvestorLeadModal() {
  const modal = document.getElementById('investor-lead-modal');
  const closeBtn = document.getElementById('btn-close-investor-modal');
  const openBtns = document.querySelectorAll('.btn-open-investor-modal');
  const form = document.getElementById('investor-lead-form');
  const phoneInput = document.getElementById('investor-phone');
  const phoneStatus = document.getElementById('investor-phone-status');
  const phoneFeedback = document.getElementById('investor-phone-feedback');
  const phoneIcon = document.getElementById('investor-phone-icon');
  const cityInput = document.getElementById('investor-city');
  const cityStatus = document.getElementById('investor-city-status');
  const successView = document.getElementById('investor-success-view');
  const scoreCard = document.getElementById('investor-score-card');
  const waBtn = document.getElementById('btn-investor-whatsapp');
  const successBadge = document.getElementById('investor-success-badge');

  if (!modal) return;

  // 1. Abertura Automática Suave após 1.2 segundos (Verifica se o usuário já dispensou na sessão)
  const isDismissed = sessionStorage.getItem('z8_investor_modal_dismissed') || window.location.search.includes('nomodal=1');
  if (!isDismissed) {
    setTimeout(() => {
      modal.classList.add('active');
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'InvestorModalView', { source: 'auto_popup' });
      }
    }, 1200);
  }

  // 2. Botões manuais para abrir o formulário em qualquer parte da página
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'InvestorModalView', { source: 'button_cta' });
      }
    });
  });

  // 3. Fechamento do Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      sessionStorage.setItem('z8_investor_modal_dismissed', '1');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      sessionStorage.setItem('z8_investor_modal_dismissed', '1');
    }
  });

  // 4. Máscara de Telefone & Validação em Tempo Real de WhatsApp
  let phoneDebounce = null;
  let isPhoneValid = false;
  let verifiedPhoneData = null;

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

      const digits = e.target.value.replace(/\D/g, '');
      clearTimeout(phoneDebounce);

      if (digits.length < 10) {
        if (phoneStatus) phoneStatus.textContent = '';
        if (phoneFeedback) phoneFeedback.style.display = 'none';
        if (phoneIcon) phoneIcon.style.color = '#64748b';
        isPhoneValid = false;
        return;
      }

      if (phoneStatus) {
        phoneStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-accent-cyan"></i> <span style="color: #00e5ff;">Verificando WhatsApp...</span>';
      }

      phoneDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`/api/verify-phone?phone=${encodeURIComponent(digits)}`);
          const data = await res.json();

          if (data.valid && data.whatsappAvailable) {
            isPhoneValid = true;
            verifiedPhoneData = data;
            if (phoneStatus) phoneStatus.innerHTML = '<span style="color: #10B981;"><i class="fa-solid fa-circle-check"></i> WhatsApp Ativo</span>';
            if (phoneIcon) phoneIcon.style.color = '#10B981';
            if (phoneFeedback) {
              phoneFeedback.style.display = 'block';
              phoneFeedback.style.color = '#86efac';
              phoneFeedback.innerHTML = `🟢 <strong>${data.formatted}</strong> verificado (${data.region})`;
            }
          } else {
            isPhoneValid = false;
            verifiedPhoneData = null;
            if (phoneStatus) phoneStatus.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-circle-xmark"></i> Número Inválido</span>';
            if (phoneIcon) phoneIcon.style.color = '#ef4444';
            if (phoneFeedback) {
              phoneFeedback.style.display = 'block';
              phoneFeedback.style.color = '#fca5a5';
              phoneFeedback.innerHTML = `⚠️ ${data.message || 'DDD ou estrutura móvel incompatível com WhatsApp Brasil.'}`;
            }
          }
        } catch (err) {
          // Fallback seguro em caso de ambiente local
          const hasDdd = digits.length >= 10;
          const isMobile = digits.length === 11 && digits.charAt(2) === '9';
          if (hasDdd && isMobile) {
            isPhoneValid = true;
            if (phoneStatus) phoneStatus.innerHTML = '<span style="color: #10B981;"><i class="fa-solid fa-circle-check"></i> Formato WhatsApp Válido</span>';
            if (phoneIcon) phoneIcon.style.color = '#10B981';
            if (phoneFeedback) phoneFeedback.style.display = 'none';
          }
        }
      }, 400);
    });
  }

  // 5. Validação de Cidade e Exclusividade de 50km
  if (cityInput && cityStatus) {
    cityInput.addEventListener('input', () => {
      const cityVal = cityInput.value.trim();
      if (cityVal.length < 3) {
        cityStatus.style.display = 'none';
        return;
      }

      const check = checkCityAvailability(cityVal);
      cityStatus.style.display = 'block';

      if (check.status === 'occupied') {
        cityStatus.style.background = '#FEF2F2';
        cityStatus.style.border = '1px solid #FECACA';
        cityStatus.style.color = '#991B1B';
        cityStatus.style.borderRadius = '4px';
        cityStatus.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <i class="fa-solid fa-circle-xmark" style="color: #DC2626; font-size: 1.1rem; margin-top: 2px;"></i>
            <div>
              <strong style="color: #0F172A;">${check.city}</strong> já possui parceiro com exclusividade territorial.
              ${check.neighbors?.length ? `<br/><span style="font-size: 0.74rem; color: #475569;">💡 Cidades vizinhas livres: <strong style="color: #0F172A;">${check.neighbors.slice(0, 3).join(', ')}</strong></span>` : ''}
            </div>
          </div>
        `;
      } else {
        cityStatus.style.background = '#F0FDF4';
        cityStatus.style.border = '1px solid #86EFAC';
        cityStatus.style.color = '#166534';
        cityStatus.style.borderRadius = '4px';
        cityStatus.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-check" style="color: #16A34A; font-size: 1.1rem;"></i>
            <div><strong style="color: #0F172A;">${check.city}</strong> está <strong style="color: #166534;">DISPONÍVEL</strong> para concessão territorial (50km livres)!</div>
          </div>
        `;
      }
    });
  }

  // 5.1 Navegação do Wizard em 2 Passos (Progressive Disclosure - Estilo Hyundai)
  const step1El = document.getElementById('investor-step-1');
  const step2El = document.getElementById('investor-step-2');
  const pillStep1 = document.getElementById('pill-step-1');
  const pillStep2 = document.getElementById('pill-step-2');
  const btnGoToStep2 = document.getElementById('btn-go-to-step-2');
  const btnBackToStep1 = document.getElementById('btn-back-to-step-1');

  if (btnGoToStep2 && step1El && step2El) {
    btnGoToStep2.addEventListener('click', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('investor-name')?.value.trim();
      const cityVal = document.getElementById('investor-city')?.value.trim();
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (!nameVal) {
        alert('Por favor, informe seu Nome Completo.');
        document.getElementById('investor-name')?.focus();
        return;
      }

      if (!phoneVal || phoneVal.replace(/\D/g, '').length < 10) {
        alert('Por favor, informe um WhatsApp válido com DDD.');
        phoneInput?.focus();
        return;
      }

      if (!cityVal) {
        alert('Por favor, informe a Cidade desejada para a concessão.');
        document.getElementById('investor-city')?.focus();
        return;
      }

      // Salva pré-lead para não perder nenhum contato se o usuário fechar no passo 2
      try {
        saveLead({
          name: nameVal,
          city: cityVal,
          phone: phoneVal,
          email: document.getElementById('investor-email')?.value.trim() || '',
          company: document.getElementById('investor-company')?.value.trim() || 'Pessoa Física',
          status: 'pre_lead_passo_1',
          temperature: 'possivel',
          score: 50,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Pre-lead save fallback:', err);
      }

      // Transiciona visualmente com slide suave para o Passo 2
      step1El.style.display = 'none';
      step2El.classList.remove('slide-back');
      step2El.style.display = 'block';
      if (pillStep1) {
        pillStep1.classList.remove('active');
        pillStep1.classList.add('completed');
        pillStep1.innerHTML = '<i class="fa-solid fa-check" style="font-size: 0.7rem;"></i> <span class="step-text">Região</span>';
      }
      if (pillStep2) {
        pillStep2.classList.add('active');
      }
    });
  }

  if (btnBackToStep1 && step1El && step2El) {
    btnBackToStep1.addEventListener('click', (e) => {
      e.preventDefault();
      step2El.style.display = 'none';
      step1El.classList.add('slide-back');
      step1El.style.display = 'block';
      if (pillStep1) {
        pillStep1.classList.add('active');
        pillStep1.classList.remove('completed');
        pillStep1.innerHTML = '<span class="step-num">1</span> <span class="step-text">Região & Contato</span>';
      }
      if (pillStep2) {
        pillStep2.classList.remove('active');
      }
    });
  }

  // 6. Submissão do Formulário, Lead Scoring, Pixel e Gravação no Banco
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('investor-name')?.value.trim() || 'Investidor Z8';
      const company = document.getElementById('investor-company')?.value.trim() || 'Investidor Individual';
      const email = (document.getElementById('investor-email')?.value.trim() || '').toLowerCase();
      const phone = document.getElementById('investor-phone')?.value.trim() || '';
      const city = document.getElementById('investor-city')?.value.trim() || 'São Paulo - SP';

      const capital = form.querySelector('input[name="investor_capital"]:checked')?.value || '60k-150k';
      const experience = form.querySelector('input[name="investor_experience"]:checked')?.value || 'empresa';
      const timeline = form.querySelector('input[name="investor_timeline"]:checked')?.value || 'imediato';
      const involvement = form.querySelector('input[name="investor_involvement"]:checked')?.value || 'operador';

      // Cálculo de Lead Scoring / Temperatura
      let score = 0;

      // 1. Capital
      if (capital === '150k+') score += 45;
      else if (capital === '60k-150k') score += 40;
      else if (capital === '30k-60k') score += 25;
      else score += 5; // under-30k

      // 2. Experiência
      if (experience === 'empresa') score += 25;
      else if (experience === 'investidor') score += 20;
      else score += 10; // primeiro_negocio

      // 3. Prazo
      if (timeline === 'imediato') score += 20;
      else if (timeline === '30_60_dias') score += 15;
      else score += 5; // pesquisando

      // 4. Envolvimento
      if (involvement === 'operador') score += 10;
      else if (involvement === 'investidor') score += 10;
      else score += 5; // analisando

      // Classificação da Temperatura
      let temperature = 'possivel';
      let temperatureBadgeHtml = '';
      let temperatureTitle = '';
      let actionScript = '';

      if (score >= 75 || capital === '150k+' || (capital === '60k-150k' && timeline === 'imediato')) {
        temperature = 'quente';
        temperatureTitle = '🔥 LEAD QUENTE (Alta Prioridade de Fechamento)';
        temperatureBadgeHtml = '<span class="badge-temperature quente"><i class="fa-solid fa-fire"></i> QUENTE • PRIORIDADE 1</span>';
        actionScript = 'Agendamento de Call Executiva com Diretor de Expansão';
      } else if (score < 50 || capital === 'under-30k') {
        temperature = 'frio';
        temperatureTitle = '❄️ PÚBLICO FRIO (Nutrição Educativa)';
        temperatureBadgeHtml = '<span class="badge-temperature frio"><i class="fa-solid fa-snowflake"></i> FRIO • BASE DE CONTEÚDO</span>';
        actionScript = 'Envio de Catálogo Institucional & Parecer CONTRAN 996';
      } else {
        temperature = 'possivel';
        temperatureTitle = '⚡ PÚBLICO POSSÍVEL (Interesse Qualificado)';
        temperatureBadgeHtml = '<span class="badge-temperature possivel"><i class="fa-solid fa-bolt"></i> POSSÍVEL • APRESENTAÇÃO</span>';
        actionScript = 'Apresentação Comercial do Modelo de Franquia';
      }

      const capitalLabels = {
        '150k+': 'Acima de R$ 150.000 (Flagship Master)',
        '60k-150k': 'R$ 60.000 a R$ 150.000 (Concessionária Standard)',
        '30k-60k': 'R$ 30.000 a R$ 60.000 (Lote Inicial 5 a 10 motos)',
        'under-30k': 'Menos de R$ 30.000 (Pesquisa de Mercado)'
      };

      const experienceLabels = {
        'empresa': 'Empresário / Comércio Ativo',
        'investidor': 'Investidor de Outros Mercados',
        'primeiro_negocio': 'Primeiro Negócio Próprio'
      };

      const timelineLabels = {
        'imediato': 'Imediato (em até 30 dias)',
        '30_60_dias': 'Curto Prazo (30 a 60 dias)',
        'pesquisando': 'Planejamento / Mais de 60 dias'
      };

      const involvementLabels = {
        'operador': 'Sócio-Operador',
        'investidor': 'Investidor Estratégico',
        'analisando': 'Avaliando Formato'
      };

      const estimatedRevenues = {
        '150k+': 250000,
        '60k-150k': 120000,
        '30k-60k': 50000,
        'under-30k': 15000
      };

      const leadPayload = {
        name,
        company,
        city,
        state: city.includes('-') ? city.split('-').pop().trim() : 'SP',
        email,
        phone,
        whatsappVerified: isPhoneValid,
        paymentMethod: 'Candidatura Concessão Franquia',
        status: 'novo',
        temperature,
        score,
        estimatedRevenue: estimatedRevenues[capital] || 50000,
        investorProfile: {
          capital,
          capitalLabel: capitalLabels[capital],
          experience,
          experienceLabel: experienceLabels[experience],
          timeline,
          timelineLabel: timelineLabels[timeline],
          involvement,
          involvementLabel: involvementLabels[involvement],
          actionScript
        }
      };

      // 1. Grava no banco de dados central do Firebase e localStorage
      try {
        saveLead(leadPayload);
      } catch (err) {
        console.warn('Lead saving fallback:', err);
      }

      // 2. Registra o usuário parceiro para acesso ao catálogo
      try {
        await registerCatalogUser({
          name,
          company,
          city,
          email,
          phone,
          password: 'Z8@' + Math.floor(1000 + Math.random() * 9000),
          role: 'partner',
          status: 'pending'
        });
      } catch (err) {
        console.warn('Catalog registration fallback:', err);
      }

      // 3. DISPARO DO EVENTO DE LEAD NO META (FACEBOOK) PIXEL & GA4
      trackConversionEvent('generate_lead', {
        content_name: 'Perfil Investidor Franquia Z8',
        company,
        city,
        value: leadPayload.estimatedRevenue,
        currency: 'BRL',
        temperature,
        score
      });

      // 4. Monta a mensagem para WhatsApp direcionada ao Diretor Christian Hideyuki (+55 12 99800-8818)
      const approvalLink = `${window.location.origin}/site-principal/?approve_user=${encodeURIComponent(email)}`;
      const whatsappMsg = 
        `🚀 *NOVO PERFIL DE INVESTIDOR Z8 E-MOTION*\n\n` +
        `👤 *Nome:* ${name}\n` +
        `🏢 *Empresa / Loja:* ${company}\n` +
        `📍 *Praça de Concessão:* ${city}\n` +
        `📱 *WhatsApp:* ${phone} ${isPhoneValid ? '✅ (Verificado)' : ''}\n` +
        `📧 *E-mail:* ${email}\n\n` +
        `📊 *QUALIFICAÇÃO COMERCIAL:* ${temperatureTitle}\n` +
        `🎯 *Score de Investidor:* ${score}/100 Pontos\n` +
        `💰 *Disponibilidade de Aporte:* ${capitalLabels[capital]}\n` +
        `💼 *Experiência Atual:* ${experienceLabels[experience]}\n` +
        `⏱ *Prazo Pretendido:* ${timelineLabels[timeline]}\n` +
        `👔 *Modelo de Atuação:* ${involvementLabels[involvement]}\n\n` +
        `👉 *Liberar Acesso do Investidor no Painel em 1 Clique:*\n${approvalLink}\n\n` +
        `_Lead registrado no CRM oficial da Z8 E-Motion._`;

      const whatsappUrl = `https://wa.me/5512998008818?text=${encodeURIComponent(whatsappMsg)}`;

      // 5. Exibe a tela de sucesso profissional com feedback de perfil e botão de WhatsApp
      form.style.display = 'none';
      if (successView) {
        successView.style.display = 'block';

        if (successBadge) {
          successBadge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${temperatureTitle}`;
        }

        if (scoreCard) {
          scoreCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div>
                <strong style="color: #0F172A; font-size: 0.95rem;">${name}</strong>
                <span style="display: block; font-size: 0.74rem; color: #64748B;"><i class="fa-solid fa-city"></i> ${city} • ${company}</span>
              </div>
              <div>${temperatureBadgeHtml}</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; font-size: 0.78rem;">
              <div><span style="color: #64748B;">Aporte Previsto:</span> <strong style="color: #059669;">${capitalLabels[capital].split('(')[0]}</strong></div>
              <div><span style="color: #64748B;">Prazo:</span> <strong style="color: #0F172A;">${timelineLabels[timeline].split('(')[0]}</strong></div>
              <div><span style="color: #64748B;">Perfil:</span> <strong style="color: #0F172A;">${experienceLabels[experience]}</strong></div>
              <div><span style="color: #64748B;">WhatsApp:</span> <strong style="color: #059669;"><i class="fa-brands fa-whatsapp"></i> ${phone}</strong></div>
            </div>

            <div style="margin-top: 10px; padding: 10px 12px; background: #F0F9FF; border-radius: 4px; border: 1px solid #BAE6FD; font-size: 0.76rem; color: #0369A1;">
              <i class="fa-solid fa-bullseye"></i> <strong>Próximo Passo Estratégico:</strong> ${actionScript}
            </div>
          `;
        }

        if (waBtn) {
          waBtn.href = whatsappUrl;
        }
      }

      // 6. Tenta abrir automaticamente a conversa no WhatsApp
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.log('Popup prevented, button ready');
      }

      // Marca que o formulário foi concluído
      sessionStorage.setItem('z8_investor_modal_dismissed', '1');
    });
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
        content_name: 'Candidatura Concessão Franquia',
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
      cityStatusBox.style.background = '#FEF2F2';
      cityStatusBox.style.border = '1px solid #FECACA';
      cityStatusBox.style.color = '#991B1B';
      cityStatusBox.style.borderRadius = '4px';

      let neighborsHtml = '';
      if (check.neighbors && check.neighbors.length > 0) {
        neighborsHtml = `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #FCA5A5;">
            <span style="font-size: 0.72rem; color: #991B1B; display: block; margin-bottom: 6px; font-weight: 700; letter-spacing: 0.04em;">
              💡 CIDADES VIZINHAS DISPONÍVEIS NO MESMO RAIO DE 50KM:
            </span>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${check.neighbors.map(n => `
                <button type="button" class="btn-neighbor-chip" data-city="${n}" style="background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A; padding: 6px 12px; border-radius: 4px; font-size: 0.76rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit;">
                  <i class="fa-solid fa-plus" style="color: #16A34A;"></i> ${n}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      cityStatusBox.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fa-solid fa-circle-xmark" style="color: #DC2626; font-size: 1.15rem; margin-top: 2px; flex-shrink: 0;"></i>
          <div>
            <strong style="color: #0F172A;">${check.city}</strong> já possui revendedor exclusivo ativo registrado (${check.company}).
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
      cityStatusBox.style.background = '#F0FDF4';
      cityStatusBox.style.border = '1px solid #86EFAC';
      cityStatusBox.style.color = '#166534';
      cityStatusBox.style.borderRadius = '4px';
      cityStatusBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check" style="color: #16A34A; font-size: 1.15rem; flex-shrink: 0;"></i>
          <div>
            <strong style="color: #0F172A;">${check.city}</strong> está <strong style="color: #166534;">DISPONÍVEL</strong> para exclusividade territorial (raio de 50km)!
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
        lead_type: 'Candidatura Concessão Franquia',
        company: company,
        city: city,
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
  const togglePassBtn = document.getElementById('btn-toggle-portal-pass');
  const passInput = document.getElementById('portal-input-pass');

  if (!portalModal) return;

  // 0. Sincronizar indicador de Login no Header e Barra Mobile com base no estado de autenticação
  function syncAuthBadge() {
    const authUser = localStorage.getItem('z8_catalog_auth_user');
    if (authUser && openPortalBtn) {
      try {
        const u = JSON.parse(authUser);
        const firstName = (u.name || u.email || 'CONECTADO').split(' ')[0].toUpperCase();
        openPortalBtn.innerHTML = `<i class="fa-solid fa-circle-user" style="color: #16A34A;"></i> <span class="btn-header-login-text">${firstName}</span>`;
        openPortalBtn.title = `Conectado como ${u.name || u.email} - Clique para abrir o Portal`;
        openPortalBtn.classList.add('is-logged-in');
      } catch(e) {}
    }
  }
  syncAuthBadge();

  // Abrir modal de login e focar no campo de login imediatamente
  function openLoginModalDirectly() {
    portalModal.classList.add('active');
    if (tabLogin) tabLogin.click();
    if (msgBox) msgBox.style.display = 'none';

    // Focar no primeiro campo de login
    const userInp = document.getElementById('portal-input-user');
    if (userInp) setTimeout(() => userInp.focus(), 150);

    // Verificar se já está autenticado
    const authUser = localStorage.getItem('z8_catalog_auth_user');
    if (authUser) {
      try {
        const u = JSON.parse(authUser);
        showPortalMessage(`👤 Conectado como <strong>${u.name || u.email}</strong> (${u.company || 'Parceiro'}). <a href="/site-principal/" style="color: var(--accent-navy, #002C5F); text-decoration: underline; font-weight: 700; margin-left: 6px;">Ir para o Catálogo Oficial →</a>`, 'info');
      } catch(e) {}
    }
  }

  // Abrir modal de login ao clicar no botão "LOGIN" do header
  if (openPortalBtn) {
    openPortalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModalDirectly();
    });
  }

  // Atalhos de transição para Login em todas as etapas e modais
  document.querySelectorAll('.btn-switch-to-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const investorModal = document.getElementById('investor-lead-modal');
      const checkoutModal = document.getElementById('checkout-modal');
      if (investorModal) investorModal.classList.remove('active');
      if (checkoutModal) checkoutModal.classList.remove('active');
      openLoginModalDirectly();
    });
  });

  // Botão de Login na barra fixa inferior mobile
  document.querySelectorAll('.btn-trigger-portal-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModalDirectly();
    });
  });

  // Toggle de visibilidade da senha no login
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPass ? 'text' : 'password');
      togglePassBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
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
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      tabLogin.style.background = '';
      tabLogin.style.color = '';
      tabRegister.style.background = '';
      tabRegister.style.color = '';
      viewLogin.style.display = 'block';
      viewRegister.style.display = 'none';
      if (msgBox) msgBox.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      tabRegister.style.background = '';
      tabRegister.style.color = '';
      tabLogin.style.background = '';
      tabLogin.style.color = '';
      viewRegister.style.display = 'block';
      viewLogin.style.display = 'none';
      if (msgBox) msgBox.style.display = 'none';
    });
  }

  function showPortalMessage(msg, type = 'error') {
    if (!msgBox) return;
    msgBox.style.display = 'block';
    if (type === 'error') {
      msgBox.style.background = '#FEF2F2';
      msgBox.style.border = '1px solid #FECACA';
      msgBox.style.color = '#991B1B';
      msgBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #DC2626;"></i> ${msg}`;
    } else if (type === 'success') {
      msgBox.style.background = '#F0FDF4';
      msgBox.style.border = '1px solid #BBF7D0';
      msgBox.style.color = '#166534';
      msgBox.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #16A34A;"></i> ${msg}`;
    } else {
      msgBox.style.background = '#F0F9FF';
      msgBox.style.border = '1px solid #BAE6FD';
      msgBox.style.color = '#0369A1';
      msgBox.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #0284C7;"></i> ${msg}`;
    }
  }

  // 1. Submit de Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userVal = document.getElementById('portal-input-user').value.trim();
      const passVal = document.getElementById('portal-input-pass').value.trim();

      const res = await loginCatalogUser(userVal, passVal);

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
