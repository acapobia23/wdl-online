document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.png","02.png"]; //file name of pic
    const basePath = "../../assets/img/boxes/mobility/private-van/"; //path pic
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

        <input type="text" id="name-surname" placeholder="*Name and Surname" required>
        <input type="text" id="host" placeholder="*Property / Hotel / Host Name" required>
        <input type="text" id="pick-up-location" placeholder="*Pick-up Location" required>
        <input type="text" id="drop-off-location" placeholder="*Drop-off Location" required>
        <input type="text" id="date-picker" placeholder="*Select a Date" readonly required>
        <div class="time-input-wrapper">
          <input type="time" id="pick-up-time" required>
          <span class="time-placeholder">*Select a Time</span>
        </div>

        <select id="guest-picker" required>
          ${[...Array(6)].map((_,i)=>
            `<option value="${i+1}">${i+1} Adult${i>0?'s':''}</option>`
          ).join('')}
        </select>

        <!-- Sezione campi facoltativi integrata nel bottone -->
        <div class="expandable-form">
          <button type="button" class="btn-form" id="toggle-form">
            <span id="form-toggle-text">optional fields</span>
            <img id="form-arrow" src="../../assets/img/icons/down-arrow.png" alt="Arrow" class="arrow-down" />
          </button>

          <div id="optional-fields" class="optional-fields">
            <label for="children-count" class="small-label"></label>
            <select id="children-count">
              <option value="0">No children</option>
              ${[...Array(6)].map((_,i)=>
                `<option value="${i+1}">${i+1} Child${i>0?'ren':''}</option>`
              ).join('')}
            </select>
            <div id="children-ages" class="children-ages" aria-hidden="true"></div>

            <input type="text"  id="luggage"          placeholder="Number of Luggage">
            <input type="text"  id="flight-train"     placeholder="Flight / Train Number">
            <input type="email" id="email"            placeholder="example@email.com">
            <input type="tel"   id="phone"            placeholder="+39 123 456 7890">
            <textarea           id="optional-request" placeholder="Optional Request"></textarea>
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

  // Time input placeholder overlay handling: keep native picker functional
  const timeInput = document.getElementById('pick-up-time');
  if (timeInput) {
    const wrapper = timeInput.closest('.time-input-wrapper');
    const updateTimePlaceholder = () => {
      if (!wrapper) return;
      if (timeInput.value) wrapper.classList.add('has-value');
      else wrapper.classList.remove('has-value');
    };

    timeInput.addEventListener('input', updateTimePlaceholder);
    timeInput.addEventListener('change', updateTimePlaceholder);
    timeInput.addEventListener('focus', () => wrapper && wrapper.classList.add('focused'));
    timeInput.addEventListener('blur', () => wrapper && wrapper.classList.remove('focused'));

    // initialize state
    updateTimePlaceholder();
  }

  // Children count -> generate age inputs to determine child seat need
  const childrenCount = document.getElementById('children-count');
  const childrenAgesContainer = document.getElementById('children-ages');
  const renderChildrenAges = (count) => {
    if (!childrenAgesContainer) return;
    childrenAgesContainer.innerHTML = '';
    if (!count || Number(count) === 0) {
      childrenAgesContainer.setAttribute('aria-hidden', 'true');
      return;
    }
    childrenAgesContainer.setAttribute('aria-hidden', 'false');
    const note = document.createElement('div');
    note.className = 'children-note';
    note.textContent = "Enter each child's age (years) to determine whether a child seat is required";
    childrenAgesContainer.appendChild(note);
    for (let i=0;i<count;i++){
      const wrapper = document.createElement('div');
      wrapper.className = 'child-age-row';
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '17';
      input.placeholder = `Child #${i+1} age`;
      input.className = 'child-age-input';
      input.id = `child-age-${i}`;
      wrapper.appendChild(input);
      childrenAgesContainer.appendChild(wrapper);
    }
  };

  if (childrenCount) {
    childrenCount.addEventListener('change', (e) => renderChildrenAges(Number(e.target.value)));
    // initialize if value preset
    renderChildrenAges(Number(childrenCount.value || 0));
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

    const children = val("children-count") || '0';
    const guestsLine = children === "0"
      ? `Adults:        ${val("guest-picker")}`
      : `Adults:        ${val("guest-picker")}  |  Children: ${children}`;

    const lines = [
      `Hello! I'd like to book: ${experience}.`,
      ``,
      `Name:          ${val("name-surname")}`,
      `Host:          ${val("host")}`,
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

      // collect children ages if present
      const ageEls = Array.from(document.querySelectorAll('.child-age-input'));
      if (ageEls.length) {
        const ages = ageEls.map(el => el.value.trim() || 'unknown');
        lines.push(`Children ages:  ${ages.join(', ')}`);
      }

    lines.push(``, `Looking forward to your reply!`);

    const msg = lines.join('\n');

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