// Carosello multiistanza: logica per ogni carosello indipendente

document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const originalCards = Array.from(track.querySelectorAll('.carousel-card'));
  const total = originalCards.length;

  // Clona le ultime e prime card per effetto loop
  const firstClone = originalCards[0].cloneNode(true);
  const lastClone = originalCards[total - 1].cloneNode(true);
  track.insertBefore(lastClone, originalCards[0]);
  track.appendChild(firstClone);

  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  let current = 2; // card centrale reale (indice relativo ai cloni)

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

  function getGap() {
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap || style.columnGap || '16');
    return isNaN(gap) ? 16 : gap;
  }

  function getHorizontalPadding() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.paddingLeft || '0');
  }

  function updateCarousel(animate = true) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });
    
    // Aggiorna gli indicatori a puntini
    dots.forEach((dot, i) => {
      const isActive = (current - 1) === i; // -1 perché current tiene conto del clone iniziale
      dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc'; // turchese per attivo, grigio per inattivo
    });
    
    const gap = getGap();
    const cardWidth = cards[0].offsetWidth;
    const paddingLeft = getHorizontalPadding();
    const offset = (cardWidth * current) + (gap * current) - (carousel.offsetWidth / 2) + (cardWidth / 2) + paddingLeft;
    track.style.transition = animate ? 'transform 0.4s cubic-bezier(.4,1.3,.5,1)' : 'none';
    track.style.transform = `translateX(${-offset}px)`;
  }

  function jumpTo(index) {
    current = index;
    updateCarousel(false);
  }

  updateCarousel();
  window.addEventListener('resize', () => updateCarousel(false));

  // Swipe touch
  let startX = null;
  let startY = null;
  let isDragging = false;
  let startTime = null;
  let touchTimeout = null;
  
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = false;
    startTime = Date.now();
    
    // Clear any existing timeout
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  });
  
  track.addEventListener('touchmove', e => {
    if (startX === null || startY === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - startX;
    const dy = currentY - startY;
    
    // Solo se il movimento orizzontale è chiaramente maggiore di quello verticale
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15) {
      isDragging = true;
      // Solo previeni se siamo sicuri che è un gesto orizzontale
      if (e.cancelable) {
        e.preventDefault();
      }
      
      if (Math.abs(dx) > 60) {
        if (dx < 0) current++;
        if (dx > 0) current--;
        updateCarousel();
        startX = null;
        startY = null;
      }
    }
  });
  
  track.addEventListener('touchend', e => {
    // Reset variables
    startX = null;
    startY = null;
    isDragging = false;
    
    // Clear any existing timeout
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  });
  
  // Fallback per resettare le variabili in caso di eventi persi
  track.addEventListener('touchcancel', e => {
    startX = null;
    startY = null;
    isDragging = false;
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  });
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
    // Allow navigation if user didn't drag
    if (!mouseDragging && !isDragging) {
      const clickedCard = e.target.closest('a.carousel-card');
      if (clickedCard && clickedCard.href) {
        // Let the browser handle the navigation naturally
        return true;
      }
    }
  });

  // All'avvio, posizionati sulla prima card reale SOLO dopo caricamento immagini
  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  if (imgs.length === 0) {
    jumpTo(2);
  } else {
    imgs.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => {
        loaded++;
        if (loaded === imgs.length) jumpTo(2);
      });
    });
    if (loaded === imgs.length) jumpTo(2);
  }
}); 
