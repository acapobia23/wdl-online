document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.jpg","02.jpg","03.jpg","04.jpg","05.jpg"]; //file name of pic
    const basePath = "../../assets/img/boxes/mobility/van-tour/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Van Tour" /></div>`).join('')}
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

 // === FORM ===
  // MODULARE: il nome del servizio viene letto automaticamente da <h2 class="section-title"> nell'HTML.
  // Per riusare in altre pagine, basta cambiare il contenuto di quell'elemento. Nessuna modifica al JS.
  const formContainer = document.getElementById("form-container");
  if (formContainer) {

    // Legge il nome del servizio dall'HTML (modulare)
    const experience =
      document.querySelector("h1.section-title")?.innerText.trim() ||
      document.title.trim() ||
      "Unknown Experience";

    formContainer.innerHTML = `
      <div id="message-box" class="hidden">
        <p id="message-text"></p>
      </div>

      <form id="booking-form" class="booking-form" novalidate>
        <label class="bold-text">Add info and chat!</label>
        <div><p></p></div>
        <p class="bold-gray">*mandatory field</p>

        <input type="text" id="name-surname"      placeholder="*Name and Surname"   required>
        <input type="text" id="host" placeholder="*Property / Hotel / Host Name" required>
        <input type="hidden" id="service-name"   value="${experience}">
        <input type="text" id="pick-up-location"  placeholder="*Pick-up Location"   required>
        <input type="text" id="drop-off-location" placeholder="*Drop-off Location"  required>
        <input type="text" id="date-picker"       placeholder="*Select a Date" readonly required>
        <input type="time" id="pick-up-time"      placeholder="*Pick-up Time"        required>

        <select id="guest-picker" required>
          ${[...Array(8)].map((_, i) =>
            `<option value="${i + 1}">${i + 1} Adult${i > 0 ? 's' : ''}</option>`
          ).join('')}
        </select>
        <select id="under-18">
          <option value="0">No Children</option>
          ${[...Array(8)].map((_, i) =>
            `<option value="${i + 1}">${i + 1} Child${i > 0 ? 'ren' : ''}</option>`
          ).join('')}
        </select>

        <!-- Campi opzionali -->
        <div class="expandable-form">
          <button type="button" class="btn-form" id="toggle-form">
            <span id="form-toggle-text">optional fields</span>
            <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
          </button>

          <div id="optional-fields" class="optional-fields">
            <input type="text"  id="luggage"          placeholder="Number of Luggage">
            <input type="text"  id="flight-train"     placeholder="Flight / Train Number">
            <input type="email" id="email"            placeholder="example@email.com">
            <input type="tel"   id="phone"            placeholder="+39 123 456 7890">
            <textarea           id="optional-request" placeholder="Special Requests"></textarea>
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

    // Toggle campi opzionali
    document.querySelector('.btn-form').addEventListener('click', () => {
      document.querySelector('.expandable-form').classList.toggle('open');
      document.getElementById('form-arrow').classList.toggle('arrow-up');
    });

    // Date picker
    const dateInput = document.getElementById('date-picker');
    if (dateInput) {
      new Pikaday({
        field: dateInput,
        format: 'DD/MM/YYYY',
        minDate: new Date(),
        theme: 'dark-theme'
      });
    }

    // ─── Costruzione e invio messaggio ───────────────────────────────────────
    const sendMsg = method => {
      const val = id => document.getElementById(id)?.value.trim() || '';

      // Apri la finestra subito (sincrono) — Safari/iOS blocca window.open async
      let newWindow = null;
      if (method === "whatsapp") {
        newWindow = window.open("", "_blank");
      }

      gtag("event", "form_contact", {
        method: method,
        experience: experience
      });

      const children = val("under-18");
      const guestsLine = children === "0"
        ? `Adults:        ${val("guest-picker")}`
        : `Adults:        ${val("guest-picker")}  |  Children: ${children}`;

      const lines = [
        `Hello! I'd like to book: ${experience}.`,
        ``,
        `Name:          ${val("name-surname")}`,
        `Host:          ${val("host")}`,
        `Service:       ${val("service-name")}`,
        `Date:          ${val("date-picker")}`,
        `Pick-up Time:  ${val("pick-up-time")}`,
        `Pick-up:       ${val("pick-up-location")}`,
        `Drop-off:      ${val("drop-off-location")}`,
        guestsLine,
      ];

      const luggage     = val("luggage");
      const flightTrain = val("flight-train");
      const email       = val("email");
      const phone       = val("phone");
      const notes       = val("optional-request");

      if (luggage)     lines.push(`Luggage:        ${luggage}`);
      if (flightTrain) lines.push(`Flight/Train:   ${flightTrain}`);
      if (email)       lines.push(`Email:          ${email}`);
      if (phone)       lines.push(`Phone:          ${phone}`);
      if (notes)       lines.push(`Notes:          ${notes}`);

      lines.push(``, `Looking forward to your reply!`);

      const msg = lines.join('\n');

      // Breve attesa per GA4, poi naviga
      setTimeout(() => {
        if (method === "whatsapp") {
          const url = `https://wa.me/+393473119031?text=${encodeURIComponent(msg)}`;
          if (newWindow) {
            newWindow.location.href = url;
          } else {
            window.location.href = url; // fallback se popup bloccato
          }
        } else {
          window.location.href = `mailto:wheredolocals@gmail.com?subject=${encodeURIComponent(experience)}&body=${encodeURIComponent(msg)}`;
        }
      }, 500);
    };

    // Submit WhatsApp
    document.getElementById("booking-form").addEventListener("submit", e => {
      e.preventDefault();
      if (e.target.checkValidity()) {
        sendMsg("whatsapp");
      } else {
        e.target.reportValidity();
      }
    });

    // Submit Email
    document.getElementById("submit-email").addEventListener("click", () => {
      const form = document.getElementById("booking-form");
      if (form.checkValidity()) {
        sendMsg("email");
      } else {
        form.reportValidity();
      }
    });

  } // fine if (formContainer)

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