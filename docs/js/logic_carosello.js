// Carosello multiistanza: logica per ogni carosello indipendente

document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  track.setAttribute('data-enhanced-drag', 'true');
  const originalCards = Array.from(track.querySelectorAll('.carousel-card'));
  const total = originalCards.length;
  const TOUCH_SNAP_BIAS_STEPS = 0.2; // Aumenta per swipe più "pigro" (es. 0.14), riduci per più precisione (es. 0.08)

  // Funzione per calcolare le dimensioni reali
  function calculateDimensions() {
    const carouselWidth = carousel.offsetWidth;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap || trackStyle.columnGap || '16');
    const paddingLeft = parseFloat(trackStyle.paddingLeft || '0');
    const paddingRight = parseFloat(trackStyle.paddingRight || '0');
    
    // Usa la prima card per calcolare la larghezza (assumendo tutte uguali)
    const cardWidth = originalCards[0].offsetWidth;
    
    return { carouselWidth, gap, paddingLeft, paddingRight, cardWidth };
  }

  // Clona le card per effetto loop e calcola la posizione iniziale
  const firstClone = originalCards[0].cloneNode(true);
  firstClone.classList.add('carousel-card-clone');
  const lastClone = originalCards[total - 1].cloneNode(true);
  lastClone.classList.add('carousel-card-clone');
  track.insertBefore(lastClone, originalCards[0]);
  track.appendChild(firstClone);

  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  let current = 1; // inizia dalla prima card reale
  let previousCurrent = current; // Traccia il valore precedente per determinare la direzione
  let suppressClickUntil = 0;
  
  // Ottieni la pillola dal contenitore genitore
  const carouselSection = carousel.closest('.carousel-section');
  const pill = carouselSection ? carouselSection.querySelector('.carousel-pill') : null;
  const touchSurface = carouselSection || carousel;
  
  // Calcolo e posizionamento ultra-veloce con CSS Custom Properties
  function getCenteredOffsetForIndex(index) {
    if (window.innerWidth >= 700) return 0;

    const dims = calculateDimensions();
    const targetOffset =
      (dims.cardWidth * index) +
      (dims.gap * index) -
      (dims.carouselWidth / 2) +
      (dims.cardWidth / 2) +
      dims.paddingLeft;

    return -targetOffset;
  }

  function applyTrackOffset(offset, animate = false) {
    track.style.setProperty('--carousel-offset', `${offset}px`);
    track.style.setProperty('--carousel-duration', animate ? '0.4s' : '0s');
  }

  function getNearestIndexFromOffset(offset, swipeDeltaX = 0) {
    if (window.innerWidth >= 700) return current;

    const dims = calculateDimensions();
    const step = dims.cardWidth + dims.gap;
    if (!step) return current;

    const anchor = (dims.carouselWidth / 2) - (dims.cardWidth / 2) - dims.paddingLeft;
    const rawIndex = (anchor - offset) / step;
    const hasDirection = Math.abs(swipeDeltaX) > 6;
    const directionalBias = hasDirection
      ? (swipeDeltaX < 0 ? TOUCH_SNAP_BIAS_STEPS : -TOUCH_SNAP_BIAS_STEPS)
      : 0;
    const nearest = Math.round(rawIndex + directionalBias);

    return Math.max(0, Math.min(cards.length - 1, nearest));
  }

  function setInitialPosition() {
    const offset = getCenteredOffsetForIndex(current);
    const offsetValue = `${offset}px`;
    const currentCSSOffset = getComputedStyle(track).getPropertyValue('--carousel-offset').trim();

    if (currentCSSOffset !== offsetValue) {
      track.style.setProperty('--carousel-offset', offsetValue);
    }
    track.style.setProperty('--carousel-duration', '0s');
  }

  // Crea gli indicatori a puntini
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px 0;
  `;
  
  const dots = [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    dot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;
      cursor: pointer;
      transition: background-color 0.3s ease;
    `;
    dots.push(dot);
    dotsContainer.appendChild(dot);
    
    // Aggiungi click handler per navigare
    dot.addEventListener('click', () => {
      current = i + 1; // +1 perché abbiamo il clone all'inizio
      updateCarousel();
    });
  }
  
  carousel.appendChild(dotsContainer);

  function updateCarousel(animate = true) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });
    dots.forEach((dot, i) => {
      const isActive = (current - 1) === i;
      dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc';
    });
    const centeredOffset = getCenteredOffsetForIndex(current);
    applyTrackOffset(centeredOffset, animate);
    
    // Animazione della pillola: determina la direzione in base al movimento
    if (animate && pill) {
      // Rimuovi le classi di animazione precedenti per permettere il reset
      pill.classList.remove('animate-pill-left', 'animate-pill-right');
      
      // Force reflow per resettare l'animazione
      void pill.offsetWidth;
      
      // Determina la direzione: aumenta = destra, diminuisce = sinistra
      if (current > previousCurrent) {
        // Movimento a destra nel carosello = swipe a sinistra
        pill.classList.add('animate-pill-left');
      } else if (current < previousCurrent) {
        // Movimento a sinistra nel carosello = swipe a destra
        pill.classList.add('animate-pill-right');
      }
    }
    
    // Aggiorna sempre il valore precedente (anche quando animate=false per jump silenzioso)
    previousCurrent = current;
  }

  function jumpTo(index) {
    current = index;
    updateCarousel(false);
  }

  // Inizializzazione SINCRONA ultra-veloce
  function initializeCarousel() {
    // Controlla se le dimensioni sono disponibili
    if (carousel.offsetWidth > 0 && originalCards[0].offsetWidth > 0) {
      // Calcolo preciso e applicazione immediata
      setInitialPosition();
      
      // Aggiorna stati visivi immediatamente
      dots.forEach((dot, i) => {
        const isActive = (current - 1) === i;
        dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc';
      });
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === current);
      });
      
      // Mostra il carosello IMMEDIATAMENTE (nessun requestAnimationFrame)
      track.classList.add('carousel-initialized');
    } else {
      // Fallback: riprova una sola volta dopo un micro-delay
      setTimeout(initializeCarousel, 1);
    }
  }

  // Inizializzazione IMMEDIATA - zero ritardi
  initializeCarousel();
  
  window.addEventListener('resize', () => updateCarousel(false));

  // Drag touch ancorato al dito + snap alla card più vicina
  let touchStartX = null;
  let touchStartY = null;
  let touchCurrentX = null;
  let isDragging = false;
  let dragIntentLocked = false;
  let isHorizontalDrag = false;
  let dragBaseOffset = 0;

  function resetTouchState() {
    touchStartX = null;
    touchStartY = null;
    touchCurrentX = null;
    isDragging = false;
    dragIntentLocked = false;
    isHorizontalDrag = false;
    dragBaseOffset = 0;
  }

  touchSurface.addEventListener('touchstart', e => {
    if (window.innerWidth >= 700) {
      resetTouchState();
      return;
    }

    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touch.clientX;
    dragBaseOffset = getCenteredOffsetForIndex(current);
    isDragging = false;
    dragIntentLocked = false;
    isHorizontalDrag = false;
  }, { passive: true });

  touchSurface.addEventListener('touchmove', e => {
    if (touchStartX === null || touchStartY === null || window.innerWidth >= 700) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchCurrentX = touch.clientX;

    if (!dragIntentLocked) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < 4 && absDy < 4) return;
      dragIntentLocked = true;
      isHorizontalDrag = absDx > absDy;
    }

    if (!isHorizontalDrag) return;

    isDragging = true;
    if (e.cancelable) {
      e.preventDefault();
    }

    const draggedOffset = dragBaseOffset + dx;
    applyTrackOffset(draggedOffset, false);
  }, { passive: false });

  touchSurface.addEventListener('touchend', () => {
    if (touchStartX === null || window.innerWidth >= 700) {
      resetTouchState();
      return;
    }

    if (isDragging && isHorizontalDrag) {
      const dx = (touchCurrentX ?? touchStartX) - touchStartX;
      const finalOffset = dragBaseOffset + dx;
      current = getNearestIndexFromOffset(finalOffset, dx);
      updateCarousel(true);
      suppressClickUntil = Date.now() + 300;
    }

    resetTouchState();
  }, { passive: true });

  touchSurface.addEventListener('touchcancel', () => {
    if (isDragging) {
      updateCarousel(false);
    }
    resetTouchState();
  }, { passive: true });
  // Event listener per rimuovere le classi quando l'animazione della pillola finisce
  if (pill) {
    pill.addEventListener('animationend', (e) => {
      if (e.animationName === 'pill-slide-left' || e.animationName === 'pill-slide-right') {
        pill.classList.remove('animate-pill-left', 'animate-pill-right');
      }
    });
  }
  
  track.addEventListener('transitionend', () => {
    if (current === cards.length - 1) jumpTo(1); // clone in fondo → prima reale
    if (current === 0) jumpTo(cards.length - 2); // clone in testa → ultima reale
    
    // Aggiorna i puntini anche dopo il salto per il loop
    dots.forEach((dot, i) => {
      const isActive = (current - 1) === i;
      dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc';
    });
  });

  // Swipe mouse (desktop)
  let mouseDown = false;
  let mouseStartX = null;
  let mouseDragging = false;
  
  track.addEventListener('mousedown', e => {
    mouseDown = true;
    mouseStartX = e.clientX;
    mouseDragging = false;
  });
  
  track.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    const dx = Math.abs(e.clientX - mouseStartX);
    if (dx > 15) {
      mouseDragging = true;
    }
  });
  
  track.addEventListener('mouseup', e => {
    if (!mouseDown) return;
    
    if (mouseDragging) {
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) current++;
        if (dx > 0) current--;
        updateCarousel();
      }
      // Prevent click if there was significant dragging
      e.preventDefault();
      e.stopPropagation();
      suppressClickUntil = Date.now() + 250;
    }
    
    mouseDown = false;
    mouseDragging = false;
  });
  
  // Prevent context menu on long press
  track.addEventListener('contextmenu', e => {
    if (mouseDragging) {
      e.preventDefault();
    }
  });

  // Handle clicks on carousel cards
  track.addEventListener('click', e => {
    if (Date.now() < suppressClickUntil) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Allow navigation if user didn't drag
    if (!mouseDragging && !isDragging) {
      const clickedCard = e.target.closest('a.carousel-card');
      if (clickedCard && clickedCard.href) {
        // Let the browser handle the navigation naturally
        return true;
      }
    }
  });
});
