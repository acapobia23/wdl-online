document.addEventListener("DOMContentLoaded", () => {

  // === TOGGLE MENUS (Gestione Menu a Tendina) ===
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-toggle');
      const content = document.querySelector(`.toggle-content[data-toggle="${target}"]`);
      const arrow = button.querySelector('.arrow-down');
      
      if (content) {
        const isHidden = window.getComputedStyle(content).display === 'none';
        if (isHidden) {
          content.style.display = 'block';
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
          content.style.display = 'none';
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    // Nomi dei file immagine (modificare le estensioni se sono .webp, .png o altro)
    const imageFiles = ["001.jpg", "002.jpg", "003.jpg", "004.jpg", "005.jpg"]; 
    // Percorso cartella immagini di questo ristorante
    const basePath = "../../assets/img/boxes/restaurants/antico-ristoro/"; 
    const images = imageFiles.map(f => basePath + f);

    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="All'Antico Ristoro di' Cambi" /></div>`).join('')}
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
      if (slides.length > 0) {
        const w = slides[0].clientWidth;
        track.style.transform = `translateX(-${idx * w}px)`;
      }
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

  // === FORM ===
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
        <input type="text" id="host" placeholder="*Property / Hotel / Host Name" required>
  
        <!-- Sezione campi facoltativi integrata nel bottone -->
        <div class="expandable-form">
          <button type="button" class="btn-form" id="toggle-form">
            <span id="form-toggle-text">optional fields</span>
            <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
          </button>

          <div id="optional-fields" class="optional-fields">
            <input type="text" id="date-picker" placeholder="Select a date" readonly>
            <select id="guest-picker">
              ${[...Array(6)].map((_,i)=>
                `<option value="${i+1}">${i+1} Adult${i>0?'s':''}</option>`
              ).join('')}
            </select>
            <select id="under-18">
              <option value="0">No Minors</option>
              ${[...Array(5)].map((_,i)=>
                `<option value="${i+1}">${i+1} Minor${i>0?'s':''}</option>`
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

    // Inizializza il date picker
    const dateInput = document.getElementById('date-picker');
    if (dateInput) {
      new Pikaday({
        field: dateInput,
        format: 'DD/MM/YYYY',
        minDate: new Date(),
        theme: 'dark-theme'
      });
    }

    const sendMsg = method => {
      const val = id => document.getElementById(id)?.value.trim() || '';
      const experience = document.querySelector(".section-title")?.innerText.trim() || document.title.trim() || "Unknown Experience";

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
        `Date:  ${val("date-picker")}`,
        `Name:  ${val("main-guest")}`,
        `Host:  ${val("host")}`,
        `Adults: ${val("guest-picker")}`,
        `Minors: ${val("under-18")}`,
        `Email: ${val("email")}`,
        `Phone: ${val("phone")}`,
      ];
  
      if (val("optional-request")) {
        lines.push(` Notes: ${val("optional-request")}`);
      }
  
      lines.push(``, `Looking forward to your reply!`);
  
      const msg = lines.join('\n');
  
      setTimeout(() => {
        if (method === "whatsapp") {
          const url = `https://wa.me/+393473119031?text=${encodeURIComponent(msg)}`;
          if (newWindow) {
            newWindow.location.href = url;
          } else {
            window.location.href = url;
          }
        } else {
          const mailMsg = encodeURIComponent(msg);
          window.location.href = `mailto:wheredolocals@gmail.com?subject=&body=${mailMsg}`;
        }
      }, 500);
    };

    // Gestione del bottone WhatsApp (submit del form)
    document.getElementById("booking-form")
      .addEventListener("submit", e => {
        e.preventDefault();
        const form = e.target;

        if (form.checkValidity()) {
          sendMsg("whatsapp");
        } else {
          form.reportValidity();
        }
      });

    // Gestione del bottone email
    document.getElementById("submit-email")
      .addEventListener("click", () => {
        const form = document.getElementById("booking-form");

        if (form.checkValidity()) {
          sendMsg("email");
        } else {
          form.reportValidity();
        }
      });
  }

  // === HEADER LOGO ===
  const header = document.querySelector('.menu-header');
  if (header) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      if (y > lastY && y > header.offsetHeight) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastY = y;
    });
  }
});