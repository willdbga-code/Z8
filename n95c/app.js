/* n95c/app.js - Radian EXR Inspired Interactive Logic, Ultra-Smooth Heavy LERP Easing & Navbar Visibility */

document.addEventListener('DOMContentLoaded', () => {
  initRadianVideoScrollytelling();
  initRadianFeatureList();
});

function initRadianVideoScrollytelling() {
  const scrollWrapper = document.getElementById('hero-wrapper');
  const canvas = document.getElementById('hero-canvas');
  const heroTextBlock = document.getElementById('radian-hero-text');
  const scrollHint = document.getElementById('scroll-hint');
  const navBar = document.querySelector('.radian-nav');
  if (!scrollWrapper || !canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const totalFrames = 240;
  const frames = [];

  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const numStr = String(i).padStart(3, '0');
    img.src = `/assets/n95c/frames/frame_${numStr}.jpg`;
    frames.push(img);
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let activeFrameIndex = -1;

  function renderFrame(index) {
    if (index === activeFrameIndex) return;
    const img = frames[index];
    if (!img || !img.complete) return;

    activeFrameIndex = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }

  function updateScrollTarget() {
    const rect = scrollWrapper.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    let p = -rect.top / maxScroll;
    targetProgress = Math.max(0, Math.min(1, p));
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  updateScrollTarget();

  function animationLoop() {
    requestAnimationFrame(animationLoop);

    currentProgress += (targetProgress - currentProgress) * 0.06;

    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(currentProgress * totalFrames))
    );

    renderFrame(frameIndex);

    const isNearFinalFrame = (frameIndex >= 225) || (currentProgress >= 0.92);

    if (isNearFinalFrame) {
      document.body.classList.add('light-mode');
      navBar?.classList.add('visible');
    } else {
      document.body.classList.remove('light-mode');
      navBar?.classList.remove('visible');
    }

    if (heroTextBlock) {
      if (currentProgress < 0.15) {
        heroTextBlock.style.opacity = String((1 - currentProgress * 5).toFixed(2));
      } else {
        heroTextBlock.style.opacity = '0';
      }
    }

    if (scrollHint) {
      scrollHint.style.opacity = currentProgress > 0.5 ? '0' : '0.75';
    }
  }

  requestAnimationFrame(animationLoop);
}

const radianFeatureData = [
  {
    headline: 'Troca em 30 segundos',
    image: '/assets/n95c/n95c_hero.jpg',
    caption: 'Bateria de Lítio removível 60V 20Ah com até 40km de autonomia e carregamento rápido.'
  },
  {
    headline: 'Potência instantânea',
    image: '/assets/n95c/n95c_hero.jpg',
    caption: 'Motor Hub 1000W 27H com velocidade limitada a 32 km/h (CONTRAN 996) e torque silencioso.'
  },
  {
    headline: 'Farol LED DRL Horizontal',
    image: '/assets/n95c/n95c_headlight.jpg',
    caption: 'Bloco óptico integrado de alta densidade luminosa embutido na carenagem Verde Esmeralda.'
  },
  {
    headline: 'Cockpit LCD Digital',
    image: '/assets/n95c/n95c_dashboard.jpg',
    caption: 'Mostrador digital completo com voltagem da bateria (50.1V), marcha P/READY e porta-objetos com ignição.'
  },
  {
    headline: 'Freio a disco & 130mm',
    image: '/assets/n95c/n95c_wheel.jpg',
    caption: 'Pneu a vácuo alargado de 130/70-10 com freio a disco hidráulico dianteiro ventilado.'
  },
  {
    headline: 'Menos manutenção',
    image: '/assets/n95c/n95c_suspension.jpg',
    caption: 'Suspensão dupla reforçada com molas helicoidais, sem combustível e zero trocas de óleo.'
  }
];

function initRadianFeatureList() {
  const featureSection = document.getElementById('features');
  const headlineItems = document.querySelectorAll('.feature-headline-item');
  const cardImg = document.getElementById('feature-card-img');
  const cardCaption = document.getElementById('feature-card-caption');

  if (!featureSection || !headlineItems.length) return;

  let currentActiveIndex = 0;
  let targetFeatureProgress = 0;
  let currentFeatureProgress = 0;

  function selectRadianFeature(index) {
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;

    headlineItems.forEach(i => i.classList.remove('active'));
    headlineItems[index].classList.add('active');

    const data = radianFeatureData[index];

    if (cardImg) {
      cardImg.style.opacity = '0';
      cardImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        cardImg.src = data.image;
        cardImg.style.opacity = '1';
        cardImg.style.transform = 'scale(1)';
      }, 150);
    }

    if (cardCaption) {
      cardCaption.textContent = data.caption;
    }
  }

  function updateFeatureScrollTarget() {
    const rect = featureSection.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    let p = -rect.top / maxScroll;
    targetFeatureProgress = Math.max(0, Math.min(1, p));
  }

  window.addEventListener('scroll', updateFeatureScrollTarget, { passive: true });
  updateFeatureScrollTarget();

  function featureAnimationLoop() {
    requestAnimationFrame(featureAnimationLoop);

    currentFeatureProgress += (targetFeatureProgress - currentFeatureProgress) * 0.07;

    const index = Math.min(
      radianFeatureData.length - 1,
      Math.floor(currentFeatureProgress * radianFeatureData.length)
    );

    selectRadianFeature(index);
  }

  requestAnimationFrame(featureAnimationLoop);

  headlineItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-idx'), 10);
      selectRadianFeature(idx);
    });

    item.addEventListener('mouseenter', () => {
      const idx = parseInt(item.getAttribute('data-idx'), 10);
      selectRadianFeature(idx);
    });
  });
}
