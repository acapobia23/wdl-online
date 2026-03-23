document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.jpeg"]; //file name of pic
    const basePath = "../../assets/img/boxes/drink-water/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Pasta Experience" /></div>`).join('')}
          </div>
        </div>
      </div>
    `;

    const track = galleryContainer.querySelector('.gallery-track');
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    let idx = 0;
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
        <div><p></p></div><p class="bold-gray">*mandatory field</p> 
        <input type="text" id="main-guest" placeholder="*Name and Surname" required>
        <input type="text" id="host" placeholder="*Who did you book your stay with?" required>
        <textarea id="optional-request" placeholder="Optional Request"></textarea>

  
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


  // Inizializza il date picker (SPOSTATO DOPO IL TOGGLE)
  const dateInput = document.getElementById('date-picker');
  if (dateInput) {
    const picker = new Pikaday({
      field: dateInput,
      format: 'DD/MM/YYYY',
      minDate: new Date(),
      theme: 'dark-theme'
    });
  }

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
      `📝 Notes: ${val("optional-request")}`,
    ];
  
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