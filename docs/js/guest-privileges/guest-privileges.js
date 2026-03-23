document.addEventListener("DOMContentLoaded", () => {
  const offerCard = document.getElementById("offer-card");
  if (offerCard) {
    const offerRight = offerCard.querySelector(".offer-right");
    const updateSliceOffset = () => {
      if (!offerRight) {
        return;
      }
      const height = offerRight.getBoundingClientRect().height;
      const offset = Math.max(6, Math.round(height * 0.18));
      offerRight.style.setProperty("--slice-offset", `${offset}px`);
    };

    const updateRightCut = () => {
      const rect = offerCard.getBoundingClientRect();
      if (!rect.height || !rect.width) {
        return;
      }
      const targetCut = rect.height * 0.5;
      const maxCut = rect.width * 0.3;
      const cut = Math.round(Math.min(targetCut, maxCut));
      offerCard.style.setProperty("--right-cut", `${cut}px`);
    };

    offerCard.classList.add("pulse");
    updateSliceOffset();
    updateRightCut();

    const resizeObserver = new ResizeObserver(() => {
      updateSliceOffset();
      updateRightCut();
    });
    resizeObserver.observe(offerCard);
  }

  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const offerCards = Array.from(document.querySelectorAll('.privilege-card'));
    const galleryItems = offerCards
      .map(card => {
        const image = card.querySelector('.privilege-card-img-wrap img');
        const title = card.querySelector('.privilege-title');

        return {
          src: image?.getAttribute('src') || '',
          alt: image?.getAttribute('alt') || title?.textContent?.trim() || 'special offer',
          href: card.getAttribute('href') || ''
        };
      })
      .filter(item => item.src);

    const fallbackItems = [
      {
        src: "../../assets/img/boxes/shopping/avantgarde/01.jpg",
        alt: "Avantgarde Calzature",
        href: "avantgarde.html"
      }
    ];

    const slidesData = galleryItems.length ? galleryItems : fallbackItems;

    galleryContainer.innerHTML = `
      <div class="gallery">
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${slidesData.map(item => `
              <div class="gallery-slide">
                ${item.href
                  ? `<a href="${item.href}"><img src="${item.src}" alt="${item.alt}" /></a>`
                  : `<img src="${item.src}" alt="${item.alt}" />`
                }
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const track = galleryContainer.querySelector('.gallery-track');
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    let idx = 0;
    let autoplayInterval = null;
    let firstAutoplayTimeout = null;

    const updateGallery = () => {
      const w = slides[0].clientWidth;
      track.style.transform = `translateX(-${idx * w}px)`;
    };

    const startAutoplay = () => {
      if (firstAutoplayTimeout) clearTimeout(firstAutoplayTimeout);
      if (autoplayInterval) clearInterval(autoplayInterval);

      firstAutoplayTimeout = setTimeout(() => {
        idx = (idx + 1) % slides.length;
        updateGallery();

        autoplayInterval = setInterval(() => {
          idx = (idx + 1) % slides.length;
          updateGallery();
        }, 2000);
      }, 1000);
    };

    const resetAutoplay = () => {
      if (firstAutoplayTimeout) clearTimeout(firstAutoplayTimeout);
      if (autoplayInterval) clearInterval(autoplayInterval);
      startAutoplay();
    };

    window.addEventListener('resize', updateGallery);
    updateGallery();
    startAutoplay();

    // touch
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 30) { idx = (idx + 1) % slides.length; updateGallery(); resetAutoplay(); }
      if (endX > startX + 30) { idx = (idx - 1 + slides.length) % slides.length; updateGallery(); resetAutoplay(); }
    });
  }

  // === FORM === //cambiare qui info form
  const formContainer = document.getElementById("form-container");
  if (formContainer) {
    formContainer.innerHTML = `
      <div id="message-box" class="hidden">
        <p id="message-text"></p>
      </div>

      <form id="booking-form" class="booking-form" novalidate>
        <label class="bold-text" for="date-picker">Add info and chat!</label>
            <p class="bold-gray">*mandatory field</p>        
            <input type="text" id="main-guest" placeholder="*Name and Surname" required></input>
            <input type="text" id="host" placeholder="*Who did you book your stay with?" required></input>
            <textarea id="optional-request" placeholder="Request"></textarea>


      <!-- Sezione campi facoltativi integrata nel bottone -->
      <div class="expandable-form">
        <button type="button" class="btn-form" id="toggle-form">
          <span id="form-toggle-text">optional fields</span>
          <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
        </button>

        <div id="optional-fields" class="optional-fields">

        <input type="email" id="email" placeholder="example@email.com">
        <input type="tel" id="phone" placeholder="+39 123 456 7890">
        </div>
        </div>
        <br>
    
        <!-- Bottoni di invio -->
        <button type="submit" class="check-btn">Send and chat via WhatsApp</button>
        <div><p></p></div>
        <button type="button" id="submit-email" class="check-btn">Send via email</button>
        <p style="color: #888888;">No auto-replies, no bot</p>
      </form>
    `;
document.querySelector('.btn-form').addEventListener('click', () => {
  const container = document.querySelector('.expandable-form');
  const arrow = document.getElementById('form-arrow');

  container.classList.toggle('open');
  arrow.classList.toggle('arrow-up');
});

const sendMsg = method => {
    const val = id => document.getElementById(id)?.value.trim() || '';
    const experience = document.querySelector(".section-title")?.innerText.trim() || document.title.trim() || "Unknown Experience";

    // 🔹 Apri la finestra SUBITO (sincrono), prima di qualsiasi async
    // Altrimenti Safari/iOS blocca window.open come popup
    let newWindow = null;
    if (method === "whatsapp") {
      newWindow = window.open("", "_blank");
    }

    gtag("event", "form_contact", {
      method: method,
      experience: experience
    });
    
    const lines = [
      `Hello! I'm staying at ${val("host")} I'd like to book this ${experience}.`,
      ``,
      `👤 Name:  ${val("main-guest")}`,
      `🏠 Host:  ${val("host")}`,
      `📧 Email: ${val("email")}`,
      `📞 Phone: ${val("phone")}`,
    ];
  
    if (val("optional-request")) {
      lines.push(`📝 Request: ${val("optional-request")}`);
    }
  
    lines.push(``, `Looking forward to your reply!`);
  
    const msg = lines.join('\n');
  
    // 🔹 Aspetta GA4, poi naviga
    setTimeout(() => {
      if (method === "whatsapp") {
        const url = `https://wa.me/+393473119031?text=${encodeURIComponent(msg)}`;
        if (newWindow) {
          newWindow.location.href = url;
        } else {
          window.location.href = url; // fallback se popup bloccato
        }
      } else {
        const mailMsg = encodeURIComponent(msg);
        window.location.href = `mailto:wheredolocals@gmail.com?subject=&body=${mailMsg}`;
      }
    }, 500); // 500ms è sufficiente per GA4
  };
  

  // Gestione del bottone WhatsApp (submit del form)
  document.getElementById("booking-form")
    .addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target;

      if (form.checkValidity()) {
        sendMsg("whatsapp");
      } else {
        form.reportValidity(); // Mostra messaggi di errore dei campi
      }
    });

  // Gestione del bottone email (click separato)
  document.getElementById("submit-email")
    .addEventListener("click", () => {
      const form = document.getElementById("booking-form");

      if (form.checkValidity()) {
        sendMsg("email");
      } else {
        form.reportValidity(); // Mostra messaggi di errore dei campi
      }
    });
  }

  // === HEADER LOGO ===
  const header = document.querySelector('.menu-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > lastY && y > header.offsetHeight) {
      // scrolling down past header height → hide
      header.style.transform = 'translateY(-100%)';
    } else {
      // scrolling up or near top → show
      header.style.transform = 'translateY(0)';
    }
    lastY = y;
  });
});

// === TOGGLE FUNCTIONALITY ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach((btn) => {
    const toggleKey = btn.dataset.toggle; // Leggi l'id dal data attribute
    const content = document.querySelector(`.toggle-content[data-toggle="${toggleKey}"]`);
    const arrow = btn.querySelector("img");

    if (!content) return; // Protezione: se il content non esiste, salta

    btn.addEventListener("click", () => {
      const isVisible = content.style.display === "block";

      // Chiudi tutte le altre sezioni
      document.querySelectorAll(".toggle-content").forEach((div) => {
        div.style.display = "none";
      });
      document.querySelectorAll(".toggle-btn img").forEach((img) => {
        img.classList.remove("arrow-up");
        img.classList.add("arrow-down");
      });

      // Apri solo la sezione cliccata
      content.style.display = isVisible ? "none" : "block";

      if (!isVisible) {
        arrow.classList.add("arrow-up");
        arrow.classList.remove("arrow-down");

        // Se è la mappa, forza l'aggiornamento Leaflet
        if (toggleKey === "spots" && typeof map !== "undefined") {
          setTimeout(() => {
            map.invalidateSize();
          }, 250);
        }
      }
    });
  });
});

