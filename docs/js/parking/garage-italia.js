document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.webp","02.webp","03.webp","04.webp"]; //file name of pic
    const basePath = "../../assets/img/boxes/parking/garage-italia/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Garage Italia" /></div>`).join('')}
          </div>
        </div>
        <button class="gallery-btn next">&#10095;</button>
      </div>
    `;

    const track = galleryContainer.querySelector('.gallery-track');
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const prevBtn = galleryContainer.querySelector('.gallery-btn.prev');
    const nextBtn = galleryContainer.querySelector('.gallery-btn.next');
    let idx = 0;

    const updateGallery = () => {
      const w = slides[0].clientWidth;
      track.style.transform = `translateX(-${idx * w}px)`;
    };
    nextBtn.addEventListener('click', () => { idx = (idx+1)%slides.length; updateGallery(); });
    prevBtn.addEventListener('click', () => { idx = (idx-1+slides.length)%slides.length; updateGallery(); });
    window.addEventListener('resize', updateGallery);
    updateGallery();

    // touch
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 30) nextBtn.click();
      if (endX > startX + 30) prevBtn.click();
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
      <input type="text" id="model-car" placeholder="*Car model" required></input>


      <!-- Sezione campi facoltativi integrata nel bottone -->
      <div class="expandable-form">
        <button type="button" class="btn-form" id="toggle-form">
          <span id="form-toggle-text">optional fields</span>
          <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
        </button>

        <div id="optional-fields" class="optional-fields">

        <input type="email" id="email" placeholder="example@email.com">
        <input type="tel" id="phone" placeholder="+39 123 456 7890">
        <input type="plate" id="plate" placeholder="Licenze Plate numbers">
        
        <!-- Box estendibile per arrivo e partenza -->
        <div class="expandable-form">
          <button type="button" class="btn-form" id="toggle-datetime">
            <span id="datetime-toggle-text">Arrival and Departure</span>
            <img id="datetime-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
          </button>

          <div id="datetime-fields" class="optional-fields" style="display: none;">
            <div style="padding: 0 15px;">
              <!-- Arrivo -->
              <label style="font-weight: bold; margin-top: 10px; display: block;">Arrival</label>
              <input type="text" id="arrival-date" placeholder="Select arrival date" readonly>
              <div style="display: flex; gap: 10px; margin-top: 5px;">
                <select id="arrival-hour" class="time-select">
                  <option value="">HH</option>
                  ${Array.from({length: 24}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>
                <select id="arrival-minute" class="time-select">
                  <option value="">MM</option>
                  ${Array.from({length: 60}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>
              </div>

              <!-- Partenza -->
              <label style="font-weight: bold; margin-top: 15px; display: block;">Departure</label>
              <input type="text" id="departure-date" placeholder="Select departure date" readonly>
              <div style="display: flex; gap: 10px; margin-top: 5px; margin-bottom: 10px;">
                <select id="departure-hour" class="time-select">
                  <option value="">HH</option>
                  ${Array.from({length: 24}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>
                <select id="departure-minute" class="time-select">
                  <option value="">MM</option>
                  ${Array.from({length: 60}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>
          </div>
          <br>
        <textarea id="optional-request" placeholder="Optional Request"></textarea>

        </div>
        </div>
        <br>
    
        <!-- Bottoni di invio -->
        <button type="submit" class="check-btn">Send and chat via WhatsApp</button>
        <div><p></p></div>
        <button type="button" id="submit-email" class="check-btn">Send via email</button>
        <p style="color: #888888;">No auto-replies, no bot</p>
      </form>

      <style>
        .time-select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          font-family: inherit;
          background-color: white;
          color: #333;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 35px;
        }

        .time-select:focus {
          outline: none;
          border-color: #888;
        }

        .time-select option {
          padding: 10px;
        }

        #datetime-fields input[type="text"] {
          width: calc(100% - 30px);
          box-sizing: border-box;
        }
      </style>
    `;

  // Toggle per i campi opzionali principali
  document.querySelector('#toggle-form').addEventListener('click', (e) => {
    e.preventDefault();
    const container = e.target.closest('.expandable-form');
    const arrow = document.getElementById('form-arrow');

    container.classList.toggle('open');
    arrow.classList.toggle('arrow-up');
  });

  // Toggle per arrivo e partenza
  document.getElementById('toggle-datetime').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = e.target.closest('.expandable-form');
    const datetimeFields = document.getElementById('datetime-fields');
    const arrow = document.getElementById('datetime-arrow');

    // Toggle la classe open sul container
    container.classList.toggle('open');
    arrow.classList.toggle('arrow-up');
    
    // Toggle display
    if (container.classList.contains('open')) {
      datetimeFields.style.display = 'block';
    } else {
      datetimeFields.style.display = 'none';
    }
  });

  // Inizializza il date picker per arrivo
  const arrivalDateInput = document.getElementById('arrival-date');
  if (arrivalDateInput) {
    const arrivalPicker = new Pikaday({
      field: arrivalDateInput,
      format: 'DD/MM/YYYY',
      minDate: new Date(),
      theme: 'dark-theme'
    });
  }

  // Inizializza il date picker per partenza
  const departureDateInput = document.getElementById('departure-date');
  if (departureDateInput) {
    const departurePicker = new Pikaday({
      field: departureDateInput,
      format: 'DD/MM/YYYY',
      minDate: new Date(),
      theme: 'dark-theme'
    });
  }

  const sendMsg = method => {
    const val = id => document.getElementById(id)?.value.trim() || '';
    const experience = document.querySelector(".section-title")?.innerText.trim() || document.title.trim() || "Unknown Experience";

    gtag("event", "form_contact", {
      method: method,
      experience: experience
    });
    
    const lines = [
      `Hello! I'm staying at ${val("host")} I'd like to book this ${experience}.`,
      ``,
      `👤 Name:  ${val("main-guest")}`,
      `🏠 Host:  ${val("host")}`,
      `🚗 Model car:  ${val("model-car")}`,
      `🚗 Licenze Plate numbers:${val("plate")}`,
      `📧 Email: ${val("email")}`,
      `📞 Phone: ${val("phone")}`,
    ];
  
    // Aggiungi arrivo se compilato
    const arrivalDate = val("arrival-date");
    const arrivalHour = val("arrival-hour");
    const arrivalMinute = val("arrival-minute");
    if (arrivalDate || arrivalHour || arrivalMinute) {
      const arrivalTime = (arrivalHour && arrivalMinute) ? `${arrivalHour}:${arrivalMinute}` : '';
      lines.push(`🛬 Arrival: ${arrivalDate} ${arrivalTime}`.trim());
    }
    
    // Aggiungi partenza se compilato
    const departureDate = val("departure-date");
    const departureHour = val("departure-hour");
    const departureMinute = val("departure-minute");
    if (departureDate || departureHour || departureMinute) {
      const departureTime = (departureHour && departureMinute) ? `${departureHour}:${departureMinute}` : '';
      lines.push(`🛫 Departure: ${departureDate} ${departureTime}`.trim());
    }
    
    if (val("optional-request")) {
      lines.push(`📝 Notes: ${val("optional-request")}`);
    }
  
    lines.push(``, `Looking forward to your reply!`);
  
    const msg = lines.join('\n');
  
// 🔹 Aspetta mezzo secondo per dare tempo a GA4 di registrare l'evento
    setTimeout(() => {
      if (method === "whatsapp") {
        window.open(`https://wa.me/393473119031?text=${encodeURIComponent(msg)}`, "_blank");
      } else {
        const mailMsg = encodeURIComponent(msg);
        window.location.href = `mailto:wheredolocals@gmail.com?subject=&body=${mailMsg}`;
      }
    }, 1000);
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