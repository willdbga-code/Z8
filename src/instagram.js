/**
 * Z8 N95C INSTAGRAM PROFILE INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initGridModal();
  initLikeButton();
  initTabs();
});

// Post metadata matching the 12 editorial photos
const POST_DATA = {
  1: {
    img: '/assets/instagram_n95c/post_01_beach.jpg',
    likes: '6.842 curtidas',
    caption: 'Movement That Inspires. O pôr do sol na costa ganha um novo silêncio com a Z8 N95C. Design esculpido para quem valoriza a liberdade sem emissões. 🌊⚡ #Z8N95C #KiaStyle #MobilidadeEletrica #CoastRide'
  },
  2: {
    img: '/assets/instagram_n95c/post_02_city.jpg',
    likes: '8.190 curtidas',
    caption: 'A arquitetura urbana encontra o futuro da mobilidade elétrica. Linhas limpas, assinatura luminosa LED e presença marcante na cidade. 🏙️✨ #Z8N95C #UrbanEV #ModernArchitecture'
  },
  3: {
    img: '/assets/instagram_n95c/post_03_taillight.jpg',
    likes: '5.720 curtidas',
    caption: 'LED Technik. A assinatura de lanterna traseira da N95C traz formas angulares marcantes inspiradas no design automotivo global.🔴 #LEDDesign #Z8Technik #LightSignature'
  },
  4: {
    img: '/assets/instagram_n95c/post_04_headlight.jpg',
    likes: '9.430 curtidas',
    caption: 'Iluminação cirúrgica. O bloco óptico dianteiro com dual LED DRL garante máxima visibilidade e identidade inconfundível. 💡 #Z8Detail #LEDHeadlight #SculptedDesign'
  },
  5: {
    img: '/assets/instagram_n95c/post_05_cockpit.jpg',
    likes: '4.980 curtidas',
    caption: 'Cockpit 100% digital em LCD. Informações essenciais com leitura limpa e acabamento em preto fosco de alta resistência. 📊 #DigitalCockpit #Z8N95C #TechMinimalism'
  },
  6: {
    img: '/assets/instagram_n95c/post_06_wheel.jpg',
    likes: '7.310 curtidas',
    caption: 'Precisão em cada curva. Rodas de liga leve com sistema de freio a disco ventilado para resposta imediata. 🏁 #BrakeSystem #AlloyWheel #PrecisionEngineering'
  },
  7: {
    img: '/assets/instagram_n95c/post_07_suspension.jpg',
    likes: '5.120 curtidas',
    caption: 'Suspensão hidráulica ajustada para o piso brasileiro. Conforto absoluto tanto na cidade quanto na estrada. ⚡ #SuspensionTech #RidingComfort #Z8Engineering'
  },
  8: {
    img: '/assets/instagram_n95c/post_08_studio.jpg',
    likes: '11.240 curtidas',
    caption: 'Teaser de estúdio. Luzes de contorno destacando a fluidez aerodinâmica do modelo N95C E-Motion. 🌑 #Teaser #StudioLighting #Z8Aesthetic'
  },
  9: {
    img: '/assets/instagram_n95c/post_09_architecture.jpg',
    likes: '6.450 curtidas',
    caption: 'Geometrias brutas e mobilidade sustentável. A N95C se conecta com o urbanismo contemporâneo. 🏛️ #BrutalistDesign #UrbanMobility'
  },
  10: {
    img: '/assets/instagram_n95c/post_10_showroom.jpg',
    likes: '7.890 curtidas',
    caption: 'Experiência imersiva no showroom Z8 Franquias. Cada veículo exibido como uma peça de arte funcional. 🏬 #ShowroomZ8 #FranquiaZ8'
  },
  11: {
    img: '/assets/instagram_n95c/post_11_urban.jpg',
    likes: '8.640 curtidas',
    caption: 'Aceleração instantânea de 1200W sem ruído e sem emissões. Silêncio que impressiona na avenida. ⚡ #TorqueInstantaneo #ZeroEmissoes'
  },
  12: {
    img: '/assets/instagram_n95c/post_12_battery.jpg',
    likes: '10.150 curtidas',
    caption: 'Autonomia estendida de 240km com bateria dupla de lítio removível. Carregue onde quiser em tomada comum. 🔋 #BateriaLitio #QuickSwap #240kmAutonomia'
  }
};

function initGridModal() {
  const gridItems = document.querySelectorAll('.ig-grid-item');
  const modal = document.getElementById('post-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalLikes = document.getElementById('modal-likes');

  gridItems.forEach(item => {
    item.addEventListener('click', () => {
      const postId = item.getAttribute('data-post-id');
      const data = POST_DATA[postId];

      if (data) {
        modalImg.src = data.img;
        modalCaption.textContent = data.caption;
        modalLikes.textContent = data.likes;
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
}

function initLikeButton() {
  const likeBtn = document.getElementById('like-btn');
  if (!likeBtn) return;

  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('liked');
    const icon = likeBtn.querySelector('i');
    if (likeBtn.classList.contains('liked')) {
      icon.className = 'fa-solid fa-heart';
      icon.style.color = '#ff3040';
    } else {
      icon.className = 'fa-regular fa-heart';
      icon.style.color = '#ffffff';
    }
  });
}

function initTabs() {
  const tabs = document.querySelectorAll('.ig-feed-tabs .tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}
