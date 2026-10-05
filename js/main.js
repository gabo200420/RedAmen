document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     CONSTANTES
     ============================================= */
  const WA_NUMBER = '51987723930';
  const FILTER_TRANSITION_MS = 220;

  /* =============================================
     UTILIDADES
     ============================================= */

  /** Abre WhatsApp con el número y mensaje indicados */
  function openWhatsApp(message) {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* =============================================
     CHIP FILTER — Filtrado reactivo sin botón
     ============================================= */
  const chipBar = document.getElementById('chip-bar');
  const resultLabel = document.getElementById('chip-result-label');
  const allCountBadge = document.getElementById('chip-all-count');

  /** Actualiza el estado visual de los chips */
  function setActiveChip(filterValue, filterType) {
    if (!chipBar) return;
    chipBar.querySelectorAll('.chip').forEach(chip => {
      const isTarget = chip.getAttribute('data-filter') === filterValue
        && chip.getAttribute('data-filter-type') === filterType;
      chip.classList.toggle('chip--active', isTarget);
      chip.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });
  }

  /** Aplica el filtro con animación fade/scale */
  function applyChipFilter(filterValue, filterType) {
    const cards = document.querySelectorAll('.property-card');
    let count = 0;

    cards.forEach(card => {
      const cardZone = card.getAttribute('data-zone');
      const cardType = card.getAttribute('data-type');

      let matches;
      if (filterType === 'all') matches = true;
      else if (filterType === 'type') matches = (cardType === filterValue);
      else if (filterType === 'zone') matches = (cardZone === filterValue);

      if (matches) {
        count++;
        card.classList.remove('is-hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.classList.remove('is-filtered-out');
        }));
      } else {
        card.classList.add('is-filtered-out');
        setTimeout(() => {
          if (card.classList.contains('is-filtered-out')) {
            card.classList.add('is-hidden');
          }
        }, FILTER_TRANSITION_MS);
      }
    });

    return count;
  }

  /** Actualiza la etiqueta de resultados */
  function updateResultLabel(count) {
    if (!resultLabel) return;
    if (count === 1) {
      resultLabel.textContent = 'Mostrando 1 propiedad';
    } else {
      resultLabel.textContent = `Mostrando ${count} propiedades`;
    }
  }

  if (chipBar) {
    chipBar.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      const filterValue = chip.getAttribute('data-filter');
      const filterType = chip.getAttribute('data-filter-type');

      setActiveChip(filterValue, filterType);
      const count = applyChipFilter(filterValue, filterType);
      updateResultLabel(count);
    });
  }

  /* =============================================
     BOTONES .btn-zone-filter (Zone Hub → Catálogo)
     ============================================= */
  const catalogSection = document.getElementById('destacados');

  document.querySelectorAll('.btn-zone-filter').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const zone = btn.getAttribute('data-zone');

      setActiveChip(zone, 'zone');
      const count = applyChipFilter(zone, 'zone');
      updateResultLabel(count);

      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =============================================
     ZONE HUB — Switch de zonas
     ============================================= */
  const zoneHubTabBtns = document.querySelectorAll('.zone-hub-tab');

  zoneHubTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetZone = btn.getAttribute('data-zone-tab');

      zoneHubTabBtns.forEach(b => {
        const isActive = b.getAttribute('data-zone-tab') === targetZone;
        b.classList.toggle('zone-hub-tab--active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      document.querySelectorAll('.zone-hub-panel').forEach(panel => {
        const panelId = panel.id;
        const isTarget = panelId === `zhpanel-${targetZone}`;
        if (isTarget) {
          panel.removeAttribute('hidden');
          panel.classList.add('zone-hub-panel--active');
        } else {
          panel.classList.remove('zone-hub-panel--active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });

  /* =============================================
     BOTÓN RÁPIDO WA en tarjeta (.btn-card-wa)
     ============================================= */
  function handleCardWA(card) {
    if (!card) return;
    const title = card.getAttribute('data-title') || '';
    const location = card.getAttribute('data-location') || '';
    const message = `Hola RedAmen Inmuebles, deseo agendar una visita para la propiedad: ${title} en ${location}`;
    openWhatsApp(message);
  }

  /* =============================================
     CARRUSEL DEL MODAL
     ============================================= */
  const carousel = document.getElementById('modal-carousel');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');
  const carouselCount = document.getElementById('carousel-counter');
  const thumbsWrap = document.getElementById('carousel-thumbs');

  let carouselImages = [];
  let carouselIndex = 0;

  function buildCarousel(images) {
    carouselImages = images;
    carouselIndex = 0;

    // Limpiar
    if (carouselTrack) carouselTrack.innerHTML = '';
    if (thumbsWrap) thumbsWrap.innerHTML = '';

    images.forEach((src, i) => {
      // Slide principal
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Foto ${i + 1}`;
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      if (carouselTrack) carouselTrack.appendChild(slide);

      // Miniatura
      const thumb = document.createElement('button');
      thumb.className = 'carousel-thumb' + (i === 0 ? ' carousel-thumb--active' : '');
      thumb.setAttribute('aria-label', `Ir a foto ${i + 1}`);
      const tImg = document.createElement('img');
      tImg.src = src;
      tImg.alt = `Miniatura ${i + 1}`;
      tImg.loading = 'lazy';
      thumb.appendChild(tImg);
      thumb.addEventListener('click', () => goToSlide(i));
      if (thumbsWrap) thumbsWrap.appendChild(thumb);
    });

    goToSlide(0);
  }

  function goToSlide(index) {
    if (!carouselImages.length) return;
    carouselIndex = (index + carouselImages.length) % carouselImages.length;

    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    }
    if (carouselCount) {
      carouselCount.textContent = `${carouselIndex + 1} / ${carouselImages.length}`;
    }

    // Actualizar miniaturas activas
    if (thumbsWrap) {
      thumbsWrap.querySelectorAll('.carousel-thumb').forEach((t, i) => {
        t.classList.toggle('carousel-thumb--active', i === carouselIndex);
      });
      // Scroll miniatura visible
      const activeThumb = thumbsWrap.querySelectorAll('.carousel-thumb')[carouselIndex];
      if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  if (carouselPrev) carouselPrev.addEventListener('click', () => goToSlide(carouselIndex - 1));
  if (carouselNext) carouselNext.addEventListener('click', () => goToSlide(carouselIndex + 1));

  // Swipe en móvil
  let touchStartX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goToSlide(diff > 0 ? carouselIndex + 1 : carouselIndex - 1);
    });
  }

  // Teclado
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('quickview-modal');
    if (!modal || modal.hasAttribute('hidden')) return;
    if (e.key === 'ArrowLeft') goToSlide(carouselIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(carouselIndex + 1);
  });

  /* =============================================
     MODAL QUICK VIEW
     ============================================= */
  const modal = document.getElementById('quickview-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const waBtn = document.getElementById('modal-wa-btn');

  const elImgPlaceholder = document.getElementById('modal-img-placeholder');
  const elStatusTag = document.getElementById('modal-status-tag');
  const elCode = document.getElementById('modal-code');
  const elTitle = document.getElementById('modal-title');
  const elLocation = document.getElementById('modal-location');
  const elPrice = document.getElementById('modal-price');
  const elArea = document.getElementById('modal-area');
  const elSpecsRow = document.getElementById('modal-specs-row');
  const elFinishes = document.getElementById('modal-finishes-list');

  let waUrl = '';

  /** Abre el modal y lo puebla con los datos de la tarjeta */
  function openModal(card) {
    if (!modal) return;

    const id = card.getAttribute('data-id') || '';
    const title = card.getAttribute('data-title') || '';
    const price = card.getAttribute('data-price') || '';
    const location = card.getAttribute('data-location') || '';
    const area = card.getAttribute('data-area') || '';
    const beds = card.getAttribute('data-beds') || '';
    const baths = card.getAttribute('data-baths') || '';
    const status = card.getAttribute('data-status') || '';
    const finishes = card.getAttribute('data-finishes') || '';
    const gallery = card.getAttribute('data-gallery') || '';

    // Poblar texto
    if (elStatusTag) elStatusTag.textContent = status;
    if (elCode) elCode.textContent = id ? `Código: ${id}` : '';
    if (elTitle) elTitle.textContent = title;
    if (elLocation) elLocation.textContent = location;
    if (elPrice) elPrice.textContent = price;
    if (elArea) elArea.textContent = area;

    // Galería vs placeholder
    const images = gallery ? gallery.split('|').filter(Boolean) : [];

    if (carousel && images.length > 0) {
      carousel.removeAttribute('hidden');
      if (elImgPlaceholder) elImgPlaceholder.style.display = 'none';
      buildCarousel(images);
      if (thumbsWrap) thumbsWrap.style.display = images.length > 1 ? 'flex' : 'none';
    } else {
      if (carousel) carousel.setAttribute('hidden', '');
      if (elImgPlaceholder) {
        elImgPlaceholder.style.display = '';
        elImgPlaceholder.textContent = card.getAttribute('data-img-label') || title;
      }
      if (thumbsWrap) thumbsWrap.style.display = 'none';
    }

    // Spec pills
    if (elSpecsRow) {
      elSpecsRow.textContent = '';
      [area, beds, baths].filter(v => v && v !== '—').forEach(spec => {
        const pill = document.createElement('span');
        pill.className = 'modal-spec-pill';
        pill.textContent = spec;
        elSpecsRow.appendChild(pill);
      });
    }

    // Lista de características
    if (elFinishes) {
      elFinishes.textContent = '';
      if (finishes) {
        finishes.split(';').forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;
          const li = document.createElement('li');
          li.textContent = trimmed;
          elFinishes.appendChild(li);
        });
      }
    }

    // URL WhatsApp del modal
    const waMessage = `Hola RedAmen Inmuebles, deseo agendar una visita para la propiedad: ${title} en ${location}`;
    waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    waUrl = '';
  }

  /* =============================================
     EVENTOS DE TARJETAS — delegación en grid
     ============================================= */
  const propertiesContainer = document.getElementById('properties-container');

  if (propertiesContainer) {
    propertiesContainer.addEventListener('click', e => {
      if (e.target.closest('.btn-card-wa')) return;
      if (e.target.closest('.btn-zone-filter')) return;

      const quickviewBtn = e.target.closest('.btn-quickview');
      const card = e.target.closest('.property-card');

      if (quickviewBtn || card) {
        const targetCard = card || quickviewBtn.closest('.property-card');
        if (targetCard) openModal(targetCard);
      }
    });

    // Botón WA rápido — delegación
    propertiesContainer.addEventListener('click', e => {
      const waCardBtn = e.target.closest('.btn-card-wa');
      if (!waCardBtn) return;
      e.stopPropagation();
      const card = waCardBtn.closest('.property-card');
      handleCardWA(card);
    });

    // Accesibilidad: Enter/Space en tarjeta
    propertiesContainer.querySelectorAll('.property-card').forEach(card => {
      card.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
          e.preventDefault();
          openModal(card);
        }
      });
    });
  }

  // Cierre del modal
  if (modal) {
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
    });

    if (waBtn) {
      waBtn.addEventListener('click', () => {
        if (waUrl) window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }

  /* =============================================
     FORMULARIO LEAD → WHATSAPP
     ============================================= */
  const leadForm = document.getElementById('lead-form');
  const feedbackMsg = document.getElementById('form-feedback');

  if (leadForm) {
    leadForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = document.getElementById('lead-name');
      const phoneInput = document.getElementById('lead-phone');
      const interestInput = document.getElementById('lead-interest');

      if (!nameInput || !phoneInput || !interestInput) return;

      const cleanName = nameInput.value.trim();
      const cleanPhone = phoneInput.value.trim();
      const cleanInterest = interestInput.value;

      if (!cleanName || !cleanPhone) {
        if (feedbackMsg) {
          feedbackMsg.textContent = 'Por favor, completa todos los campos requeridos.';
          feedbackMsg.style.color = '#f87171';
        }
        return;
      }

      const message = `Hola RedAmen Inmuebles, solicito asesoría inmobiliaria.\nNombre: ${cleanName}\nTeléfono: ${cleanPhone}\nInterés: ${cleanInterest}`;

      if (feedbackMsg) {
        feedbackMsg.textContent = 'Abriendo WhatsApp con un asesor...';
        feedbackMsg.style.color = '#34d399';
      }

      setTimeout(() => {
        openWhatsApp(message);
        leadForm.reset();
        if (feedbackMsg) feedbackMsg.textContent = '';
      }, 900);
    });
  }

  /* =============================================
     MENÚ HAMBURGUESA — Toggle móvil
     ============================================= */
  const hamburgerBtn = document.getElementById('nav-hamburger');
  const navLinksMenu = document.getElementById('nav-links-menu');

  if (hamburgerBtn && navLinksMenu) {

    /** Abre/cierra el menú y actualiza aria-expanded */
    function toggleMobileMenu(forceClose) {
      const isOpen = navLinksMenu.classList.contains('is-open');
      if (forceClose || isOpen) {
        navLinksMenu.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
      } else {
        navLinksMenu.classList.add('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
      }
    }

    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());

    // Cierra el menú al hacer clic en cualquier enlace del drawer
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Cierra con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinksMenu.classList.contains('is-open')) {
        toggleMobileMenu(true);
        hamburgerBtn.focus();
      }
    });

    // Cierra automáticamente si se pasa a pantalla grande (resize)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        toggleMobileMenu(true);
      }
    });
  }

  /* =============================================
     EFECTO PARALLAX DINÁMICO EN LA FOTO DE PORTADA (HERO)
     ============================================= */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    let ticking = false;
    const updateParallax = () => {
      const scrolled = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      if (scrolled <= heroHeight + 100) {
        // Factor de 0.4 de la velocidad de scroll
        const yPos = scrolled * 0.4;
        heroSection.style.setProperty('--hero-bg-y', `${yPos}px`);
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =============================================
     VISOR MODAL & LIGHTBOX DE RENDERS (VIVIENDA Y-41)
     ============================================= */
  const y41Modal = document.getElementById('modal-y41-backdrop');
  const openY41Btn = document.getElementById('btn-trigger-y41-modal');
  const closeY41Btn = document.getElementById('btn-close-y41-modal');

  // Modal Y-41 Open/Close
  if (openY41Btn && y41Modal) {
    openY41Btn.addEventListener('click', () => {
      y41Modal.classList.add('active');
      y41Modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeY41Modal() {
    if (!y41Modal) return;
    y41Modal.classList.remove('active');
    y41Modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeY41Btn) closeY41Btn.addEventListener('click', closeY41Modal);

  if (y41Modal) {
    y41Modal.addEventListener('click', (e) => {
      if (e.target === y41Modal) closeY41Modal();
    });
  }

  // Tabs del Visor Y-41
  const y41TabBtns = document.querySelectorAll('.y41-tab-btn');
  const y41TabPanes = document.querySelectorAll('.y41-tab-pane');

  y41TabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-y41-tab');

      y41TabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      y41TabPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Lightbox de Renders 3D (7 vistas JPEGs de assets/Y-41/)
  const rendersData = [
    { src: 'assets/Y-41/1.jpeg', title: '1. Fachada Principal Iluminada' },
    { src: 'assets/Y-41/2.jpeg', title: '2. Sala a Doble Altura con Iluminación LED' },
    { src: 'assets/Y-41/3.jpeg', title: '3. Cocina Americana con Isla y Acabados de Madera' },
    { src: 'assets/Y-41/4.jpeg', title: '4. Terraza y Patio Posterior con Zona de Parrilla' },
    { src: 'assets/Y-41/5.jpeg', title: '5. Suite Principal con Iluminación Cálida' },
    { src: 'assets/Y-41/6.jpeg', title: '6. Walk-in Closet de Concepto Abierto' },
    { src: 'assets/Y-41/7.jpeg', title: '7. Vista Exterior Diurna/Perspectiva' }
  ];

  const lightboxBackdrop = document.getElementById('y41-lightbox-backdrop');
  const lightboxImg = document.getElementById('y41-lightbox-img');
  const lightboxCaption = document.getElementById('y41-lightbox-caption');
  const lightboxCounter = document.getElementById('y41-lightbox-counter');
  const lightboxCloseBtn = document.getElementById('btn-close-y41-lightbox');
  const lightboxPrevBtn = document.getElementById('btn-prev-y41-lightbox');
  const lightboxNextBtn = document.getElementById('btn-next-y41-lightbox');

  let currentRenderIndex = 0;

  function showLightboxRender(index) {
    currentRenderIndex = (index + rendersData.length) % rendersData.length;
    const render = rendersData[currentRenderIndex];

    if (lightboxImg) {
      lightboxImg.src = render.src;
      lightboxImg.alt = render.title;
    }
    if (lightboxCaption) lightboxCaption.textContent = render.title;
    if (lightboxCounter) lightboxCounter.textContent = `${currentRenderIndex + 1} / ${rendersData.length}`;
  }

  function openLightbox(index) {
    if (!lightboxBackdrop) return;
    showLightboxRender(index);
    lightboxBackdrop.classList.add('active');
    lightboxBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightboxBackdrop) return;
    lightboxBackdrop.classList.remove('active');
    lightboxBackdrop.setAttribute('aria-hidden', 'true');
  }

  // Delegación de clic en items de render
  const rendersGrid = document.getElementById('y41-renders-grid');
  if (rendersGrid) {
    rendersGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.y41-render-item');
      if (item) {
        const idx = parseInt(item.getAttribute('data-render-index'), 10) || 0;
        openLightbox(idx);
      }
    });
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => showLightboxRender(currentRenderIndex - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => showLightboxRender(currentRenderIndex + 1));

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', (e) => {
      if (e.target === lightboxBackdrop) closeLightbox();
    });
  }

  // Teclado Escape & flechas para modales y lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxBackdrop && lightboxBackdrop.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightboxRender(currentRenderIndex - 1);
      if (e.key === 'ArrowRight') showLightboxRender(currentRenderIndex + 1);
      return;
    }

    if (y41Modal && y41Modal.classList.contains('active')) {
      if (e.key === 'Escape') closeY41Modal();
    }
  });

  /* =============================================
     VISOR DE IMÁGENES TERRENO (#terrenos)
     Tabs: "Vista Satelital" / "Plano Perimétrico"
     ============================================= */
  const terrenoTabBtns = document.querySelectorAll('.terreno-img-tab');

  terrenoTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = `terreno-view-${btn.getAttribute('data-terreno-tab')}`;

      // Actualizar estado de tabs
      terrenoTabBtns.forEach(b => {
        b.classList.remove('terreno-img-tab--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('terreno-img-tab--active');
      btn.setAttribute('aria-selected', 'true');

      // Mostrar panel correcto
      document.querySelectorAll('.terreno-img-panel').forEach(panel => {
        if (panel.id === targetId) {
          panel.removeAttribute('hidden');
          panel.classList.add('terreno-img-panel--active');
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.remove('terreno-img-panel--active');
        }
      });
    });
  });

});



