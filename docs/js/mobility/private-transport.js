document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.webp","02.webp"]; //file name of pic
    const basePath = "../../assets/img/boxes/mobility/private-transport/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Private Van" /></div>`).join('')}
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
        <div><p></p></div><p class="bold-gray">*mandatory field</p> 
      <input type="text" id="main-guest" placeholder="*Name and Surname" required>
  <input type="text" id="host" placeholder="*Who did you book your stay with?" required>
  
<!-- Sezione campi facoltativi integrata nel bottone -->
<div class="expandable-form">
  <button type="button" class="btn-form" id="toggle-form">
    <span id="form-toggle-text">optional fields</span>
    <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
  </button>

  <div id="optional-fields" class="optional-fields">
        <input type="text" id="date-picker" placeholder="Select a date" readonly>
        <select id="guest-picker">
          ${[...Array(9)].map((_,i)=>
            `<option value="${i+1}">${i+1} Passengers${i>0?'s':''}</option>`
          ).join('')}
        </select>
        <input type="email" id="email" placeholder="example@email.com">
        <input type="tel" id="phone" placeholder="+39 123 456 7890">
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
      `📅 Date:  ${val("date-picker")}`,
      `👤 Name:  ${val("main-guest")}`,
      `🏠 Host:  ${val("host")}`,
      `🧑‍🤝‍🧑 Adults: ${val("guest-picker")}`,
      `📧 Email: ${val("email")}`,
      `📞 Phone: ${val("phone")}`,
    ];
  
    if (val("optional-request")) {
      lines.push(`📝 Notes: ${val("optional-request")}`);
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