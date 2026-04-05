// Posiziona dinamicamente le pillole turchesi rispetto alle pillole bianche:
// - il taglio (lato destro) della turchese inizia dove termina la curvatura sinistra della bianca
// - la pillola turchese mantiene lo stesso spessore (altezza) della bianca

function syncTurquoisePillWithWhite(section) {
  const turquoisePill = section.querySelector('.carousel-pill');
  if (!turquoisePill) return;

  const carousel = section.querySelector('.carousel');
  if (!carousel) return;

  const referenceCard =
    section.querySelector('.carousel-card:not(.carousel-card-clone)') ||
    section.querySelector('.carousel-card');

  if (!referenceCard) return;

  const cards = section.querySelectorAll('.carousel-card:not(.carousel-card-clone), .carousel-card');

  const referenceWhitePill =
    section.querySelector('.carousel-card:not(.carousel-card-clone) .card-title-pill') ||
    section.querySelector('.carousel-card .card-title-pill');

  if (!referenceWhitePill) return;

  const sectionRect = section.getBoundingClientRect();
  const cardRect = referenceCard.getBoundingClientRect();
  const whiteRect = referenceWhitePill.getBoundingClientRect();

  if (!whiteRect.width || !whiteRect.height || !cardRect.width) return;

  const cardStartX = cardRect.left - sectionRect.left;
  const whiteRadius = whiteRect.height / 2;

  const turquoiseComputed = window.getComputedStyle(turquoisePill);
  turquoisePill.style.display = 'flex';
  turquoisePill.style.alignItems = 'center';
  turquoisePill.style.boxSizing = 'border-box';
  turquoisePill.style.height = `${whiteRect.height}px`;
  turquoisePill.style.paddingTop = '0';
  turquoisePill.style.paddingBottom = '0';
  turquoisePill.style.paddingLeft = turquoiseComputed.paddingLeft;
  turquoisePill.style.paddingRight = turquoiseComputed.paddingRight;

  turquoisePill.style.left = `${cardStartX}px`;
  turquoisePill.style.right = 'auto';
  turquoisePill.style.top = `${whiteRect.top - sectionRect.top}px`;

  const turquoiseRect = turquoisePill.getBoundingClientRect();
  const turquoiseEndX = turquoiseRect.right - sectionRect.left;
  const whiteLeftInCard = turquoiseEndX - cardStartX - whiteRadius;

  cards.forEach(card => {
    const whitePill = card.querySelector('.card-title-pill');
    if (!whitePill) return;

    whitePill.style.left = `${whiteLeftInCard}px`;
    whitePill.style.right = 'auto';
  });
}

function positionTurquoisePills() {
  document.querySelectorAll('.carousel-section').forEach(syncTurquoisePillWithWhite);
}

let resizeTimeout;
function scheduleTurquoisePillPositioning(delay = 0) {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    positionTurquoisePills();
  }, delay);
}

function initTurquoisePillPositioning() {
  positionTurquoisePills();

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      lastWidth = currentWidth;
      scheduleTurquoisePillPositioning(80);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTurquoisePillPositioning);
} else {
  initTurquoisePillPositioning();
}
