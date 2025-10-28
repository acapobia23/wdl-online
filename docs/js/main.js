// Funzione di esempio per futura logica JS dinamica
function toggleContent(id) {
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle('d-none');
    }
  }
  
function handleCardClick(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    setTimeout(() => card.classList.remove('flipped'), 10000); // ritorna dopo 5s
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".license-btn"); // solo i pulsanti, salta il primo paragrafo

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            const contentId = `content${index + 2}`; // il primo pulsante corrisponde a content2
            const textId = `toggle-text${index + 2}`;
            const box = document.getElementById(contentId);
            const span = document.getElementById(textId);
            const arrow = btn.querySelector("img");

            if (!box || !span) return;

            const isVisible = box.offsetParent !== null;

            // Alterna visibilità
            box.style.display = isVisible ? "none" : "block";

            // Cambio testo
            if (!span.dataset.original) span.dataset.original = span.textContent;
            span.textContent = isVisible ? span.dataset.original : "Hide";

            // Ruota freccia
            if (arrow) {
                arrow.classList.remove("arrow-up", "arrow-down");
                arrow.classList.add(isVisible ? "arrow-down" : "arrow-up");
            }
        });
    });
});


function animateLogo() { // Animazione logo WDL
  const logo = document.getElementById('wdl-logo');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('show');
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  animateLogo();
});

// === Ricerca intelligente pagine/sinonimi ===
const pageKeywords = [
  {
    name: "Mobility",
    url: "boxes/mobility/mobility.html",
    keywords: [
      "taxi", "transport", "bus", "tram", "car", "limousine", "rickshaw", "sharing", "public transport", "private transport", "move", "get around", "shuttle",
      "limousine", "mobility", "private-transport", "public-transport", "rickshaw", "sharing",
      "ride", "journey", "commute", "driver", "passenger", "vehicle", "fleet", "ride-hailing", 
      "carpool", "car-sharing", "bike", "e-bike", "bicycle", "scooter", "e-scooter", "micro-mobility", 
      "logistics", "delivery", "route", "navigation", "traffic", "congestion", "lane", "road", "highway", 
      "parking", "garage", "station", "terminal", "hub", "metro", "subway", "train", "railway", "monorail", 
      "cable-car", "ferry", "ship", "airplane", "airport", "rideshare", "pulman"
    ]
  },
  {
    name: "Luggage Stores",
    url: "boxes/luggage-store/luggage-store.html",
    keywords: [
      "deposito bagagli", "valigia", "luggage", "storage", "bag", "locker", "deposit", "left luggage", "suitcase", "store", "baggage", "deposito",
      "bag drop", "baggage claim", "lost and found", "cloakroom", "baggage storage", "luggage room", "baggage service", "luggage pickup", "luggage drop-off", "luggage collection", "baggage office", "luggage assistance", "baggage handler", "luggage delivery", "luggage transfer", "luggage point", "baggage area", "luggage counter", "luggage check", "baggage check", "luggage safe", "baggage safe",
      "logo", "luggage storage", "florence", "best option", "comparison", "services", "price", "insurance", "flexibility", "location", "payment options", "bounce", "luggagepoint", "luggage point", "bag storage", "luggage deposit", "florence luggage", "luggage lockers", "bounce insurance", "full-day storage", "24h storage", "daily rate", "bag size", "small bag", "standard bag", "oversized bag", "handbags", "totes", "carry-on", "backpack", "bikes", "golf bags", "large suitcases", "theft insurance", "damage insurance", "loss coverage", "online booking", "paypal", "apple pay", "credit card", "refund", "cancellation", "bounce credit", "partner shops", "cafes", "hotels", "flexible hours", "reviews", "drop-off location", "positive comments", "rating 4.5", "luggagepoint.it", "santa maria novella", "via della scala", "ponte vecchio", "borgo san jacopo", "hourly rate", "daily prices", "standard locker", "large locker", "surveillance", "pin access", "secure storage", "cash payment", "discount code", "wheredolocals", "online refund", "in-person payment", "luggage facility", "professional storage", "key locker", "dedicated storage", "equipment", "security", "oversized luggage", "valuable luggage", "laptops", "cameras", "designer luggage", "official booking", "support", "refund policy", "claim requirements", "terms and conditions", "luggage insurance", "storage comparison", "luggage in florence", "luggage", "santa", "maria", "novella", "luggage", "near", "ponte vecchio", "long-term", "luggage", "storage"
    ]
  },
  {
    name: "At Your Door",
    url: "boxes/at-your-door/at-your-door.html",
    keywords: [
      "delivery", "babysitter", "beauty", "home service", "pasta", "pet sitting", "yoga", "at home", "door", "personal", "service", "wellness at home",
      "cleaning-service", "home-repair", "laundry-pickup", "ironing-service", "window-cleaning", "gardener", "car-wash", "handyman", "furniture-assembly", "appliance-repair",
      "pizza-express", "coffee-on-call", "bakery-delivery", "sushi-at-home", "cocktail-master", "brunch-box", "fruit-basket", "ice-cream-bike", "wine-tasting", "chef-to-you",
      "massage-therapy", "manicure-home", "barber-on-demand", "make-up-artist", "personal-trainer", "physiotherapy", "aromatherapy", "meditation-guide", "spa-kit", "reflexology"
    ]
  },
  {
    name: "Wine",
    url: "boxes/wine/wine-home.html",
    keywords: [
      "vino", "wine tasting", "cantina", "degustazione", "bottle", "winery", "enoteca", "drink", "red wine", "white wine", "fill bottle", "wine bar",
      "grape-harvest", "vineyard-view", "red-cabernet", "white-chardonnay", "rose-blush", "wine-cellar", "cork-puller", "wine-tasting", "sommelier-note", "vintage-selection", "oak-barrel", "wine-crystal", "sparkling-bottle", "wine-decant", "barrel-aging", "wine-journey", "wine-pairing", "grape-essence", "vineyard-walk", "wine-experience", "tasting-room", "terroir-story", "fine-reserve", "wine-collection", "wine-ritual", "glass-of-grape", "wine-aroma", "fermentation-process", "bottle-uncork", "vinification", "wine-flavors", "cellar-door", "bouquet-note", "vineyard-sunset", "merlot-magic", "cabernet-symphony", "wine-safari", "grape-journey", "tasting-notebook", "wine-culture", "vintage-harvest", "fermented-joy"
    ]
  },  
  {
    name: "Fill Your Bottle",
    url: "boxes/wine/fill-bottle.html",
    keywords: [
      "wine", "bottle", "refill", "tasting", "experience", "vineyard", "grapes", "winery", "sommelier", "flavors", "aromas", "pairing"
    ]
  },
  {
    name: "Wellness",
    url: "boxes/wellness/wellness.html",
    keywords: [
      "spa", "relax", "massaggio", "beauty", "soulspace", "yoga", "benessere", "wellbeing", "treatment", "wellness center", "massage", "health",
      "welness", "spa", "massage", "meditation", "aromatherapy", "sound-bath", "detox", "hot-stone", "sauna", "steam-bath", "reflexology", "reiki", "fitness", "pilates", "mindfulness", "stretching", "holistic-care", "wellness-retreat", "floatation", "hydrotherapy", "beauty-treatment"
    ]
  },
  {
    name: "Experiences",
    url: "boxes/experiences/experience.html",
    keywords: [
      "tour", "activity", "florence", "ebike", "painting", "cooking", "chianti", "van tour", "walking", "adventure", "things to do", "eventi", "local experience",
      "Experiences", "wine-tasting", "cooking-class", "vineyard-tour", "city-tour", "historical-walk", "chocolate-making", "art-gallery", "craft-workshop", "photography-tour", "horseback-riding", "river-cruise", "local-market", "ceramic-class", "truffle-hunting", "olive-oil-tasting", "cheese-making", "cultural-show", "guided-hike", "adventure-park",
      "500-tour", "scooter-tour", "classic-car-tour", "vintage-bike-tour", "countryside-drive", "scenic-loop", "adventure-ride", "road-trip", "guided-ride", "italian-highway-tour", "sunset-tour", "mountain-tour", "coastal-tour", "city-loop", "countryside-safari", "historic-route", "panoramic-tour", "photo-tour", "wine-region-tour", "heritage-route", "speed-tour",
      "cheflapo", "cooking-class", "pasta-making", "sauce-masterclass", "italian-cuisine", "dessert-class", "culinary-workshop", "pizza-masterclass", "regional-cooking", "chef-experience", "kitchen-tour", "tasting-session", "food-pairing", "fresh-ingredients-class", "gourmet-class", "traditional-recipes", "hands-on-cooking", "dinner-prep", "farm-to-table-class", "culinary-demo", "artisan-cooking",
      "chefvary", "fine-dining-experience", "tasting-menu", "kitchen-tour", "gourmet-workshop", "plating-class", "chef-demo", "culinary-lesson", "regional-specialties", "wine-pairing", "food-pairing", "dessert-workshop", "market-tour", "fresh-ingredients", "seasonal-menu", "cooking-techniques", "chef-interaction", "hands-on-prep", "signature-dishes", "chef-table", "behind-the-scenes",
      "chianti", "wine-tasting", "vineyard-visit", "cellar-tour", "wine-pairing", "sommelier-session", "wine-workshop", "olive-oil-tasting", "wine-tour", "vineyard-lunch", "barrel-tasting", "harvest-experience", "regional-wines", "wine-blending", "wine-trail", "winery-tour", "wine-dinner", "wine-education", "tasting-event", "wine-region-tour", "vineyard-walk",
      "drink-and-paint", "painting-class", "art-session", "wine-and-paint", "creative-evening", "sip-and-paint", "canvas-workshop", "acrylic-painting", "watercolor-class", "guided-painting", "paint-party", "artistic-evening", "art-therapy", "brush-session", "sketching-class", "painting-tutorial", "group-painting", "cocktail-paint", "evening-workshop", "social-painting", "art-experience",
      "e-bike", "bike-tour", "guided-ride", "countryside-ride", "scenic-route", "city-ride", "electric-tour", "nature-ride", "forest-trail", "mountain-ride", "sunset-ride", "coastal-ride", "vineyard-ride", "historic-route", "adventure-bike", "panoramic-ride", "eco-tour", "river-trail", "countryside-loop", "group-ride", "e-bike-hire",
      "experience", "adventure", "workshop", "tasting", "guided-tour", "hands-on-activity", "cultural-experience", "craft-session", "local-immersion", "day-trip", "culinary-experience", "art-class", "wellness-session", "outdoor-activity", "sport-experience", "interactive-event", "immersive-tour", "themed-activity", "seasonal-experience", "workshop-day", "sensory-experience",
      "florence-tour", "city-tour", "walking-tour", "museum-visit", "historic-walk", "guided-tour", "art-tour", "cathedral-visit", "piazza-tour", "renaissance-tour", "heritage-walk", "local-guide", "cultural-walk", "hidden-gems-tour", "architecture-tour", "evening-tour", "food-tour", "river-walk", "landmark-visit", "photo-tour", "city-loop",
      "painting-lesson", "art-class", "drawing-lesson", "watercolor-class", "acrylic-class", "canvas-session", "guided-painting", "sketch-class", "masterclass", "creative-workshop", "brush-techniques", "still-life-class", "portrait-lesson", "painting-demo", "group-class", "art-exercise", "evening-class", "art-techniques", "hands-on-session", "beginner-class", "advanced-class",
      "pasta-experience", "pasta-making", "gnocchi-class", "ravioli-workshop", "fresh-pasta", "regional-recipes", "cooking-demo", "culinary-lesson", "handmade-pasta", "traditional-pasta", "sauce-making", "tasting-session", "italian-cuisine", "dough-lesson", "pasta-shaping", "kitchen-workshop", "chef-guided-class", "pasta-pairing", "hands-on-cooking", "pasta-tour", "culinary-experience",
      "pool-pints", "pool-party", "bar"
    ]
  },
  {
    name: "Pasta Experience",
    url: "boxes/experiences/pasta-experience.html",
    keywords: [
      "pasta", "cooking", "culinary", "italian cuisine", "hands-on", "workshop", "food experience", "local ingredients", "chef", "gourmet"
    ]
  },
  {
    name: "Discover Florence",
    url: "boxes/experiences/florence-tour.html",
    keywords: [
      "florence", "tour", "city", "walking", "sightseeing", "history", "art", "culture", "landmarks", "museums", "architecture", "local guide"
    ]
  },
  {
    name: "Drinking Water In Florence",
    url: "boxes/water/water.html",
    keywords: [
      "acqua", "water", "fontanello", "drinking", "tap water", "bottle refill", "fountain", "bere", "refill", "potabile", "free water", "hydration",
      "fountain", "swimming-pool", "lake", "river", "waterfall", "hot-spring", "beach", "spa-pool", "jacuzzi", "waterpark", "thermal-bath", "boating", "kayak", "paddleboarding", "scuba-diving", "snorkeling", "sailing", "hydro-therapy", "mineral-spring", "river-cruise"
    ]
  },
  {
    name: "Street Food",
    url: "boxes/street-food/street-food.html",
    keywords: [
      "cibo di strada", "panino", "kebab", "arancino", "bakery", "falafel", "night bakeries", "street", "food truck", "snack", "takeaway", "fast food",
      "panini", "tacos", "pizza-slice", "gelato", "crepes", "hot-dog", "kebab", "dumplings", "falafel", "burgers", "sandwiches", "churros", "empanadas", "fries", "bao", "samosas", "street-desserts", "local-snacks", "wraps", "skewers"
    ]
  },
  {
    name: "Secret Night Bakeries",
    url: "boxes/street-food/night-bakeries.html",
    keywords: [
      "night", "bakeries", "secret", "food", "street", "snack", "pastry", "local", "hidden", "experience"
    ]
  },
  {
    name: "Shopping",
    url: "boxes/shopping/shopping.html",
    keywords: [
      "negozi", "shop", "boutique", "fashion", "abbigliamento", "cheese", "bastah", "monaco", "local", "souvenir", "market", "store",
      "souvenir-shop", "artisan-shop", "fashion-boutique", "vintage-store", "jewelry-shop", "leather-shop", "local-market", "craft-shop", "bookshop", "antique-shop", "designer-store", "textile-shop", "chocolate-shop", "perfume-shop", "home-decor", "farmers-market", "specialty-food", "handmade-goods", "local-art", "ceramics-shop"
    ]
  },
  {
    name: "Nightlife & Events",
    url: "boxes/nightlife/nightlife.html",
    keywords: [
      "night", "club", "bar", "eventi", "serata", "music", "party", "concert", "dj", "serre", "tenax", "bioritmo",
      "nightclub", "bar", "lounge", "disco", "live-music", "rooftop-bar", "pub", "cocktail-bar", "jazz-club", "karaoke", "speakeasy", "wine-bar", "salsa-club", "dance-club", "music-festival", "cabaret", "comedy-club", "late-night-cafe", "DJ-event", "pool-bar"
    ]
  },
  {
    name: "Weekly Tips",
    url: "boxes/nightlife/weekly-tips.html",
    keywords: [
      "tips", "weekly", "advice", "recommendations", "local", "insights", "guides", "explore", "discover", "experience"
    ]
  },
  {
    name: "Private Event Space",
    url: "boxes/private-space/private-space.html",
    keywords: [
      "event", "private", "location", "party", "affitto", "space", "meeting", "venue", "sala", "room", "eventi privati", "prenotazione",
      "villa", "apartment-rent", "secluded-garden", "terrace", "private-pool", "rooftop-suite", "luxury-apartment", "private-cabin", "penthouse", "beach-house", "private-terrace", "private-lounge", "meditation-room", "home-studio", "private-sauna", "private-dining", "retreat-space", "spa-suite", "garden-cottage", "private-balcony"
    ]
  },
  {
    name: "Ship Your Package",
    url: "boxes/ship-package/ship-package.html",
    keywords: [
      "spedizione", "ship", "package", "parcel", "posta", "mail", "send", "delivery", "courier", "box", "shipping", "inviare",
      , "ferry", "sailing-trip", "boat-tour", "private-charter"
    ]
  },
  {
    name: "Restaurants",
    url: "boxes/restaurants/restaurants.html",
    keywords: [
      "ristorante", "trattoria", "osteria", "eat", "food", "dining", "cibo", "dove mangiare", "ristoranti", "menu", "chef", "lunch", "dinner",
      "experience", "adventure", "workshop", "tasting", "pasta", "guided-tour", "hands-on-activity", "cultural-experience", "craft-session", "local-immersion", "day-trip", "culinary-experience", "art-class", "wellness-session", "outdoor-activity", "sport-experience", "interactive-event", "immersive-tour", "themed-activity", "seasonal-experience", "workshop-day", "sensory-experience"
    ]
  },
  {
    name: "Cibreo",
    url: "boxes/restaurants/cibreo.html",
    keywords: [
      "cibreo", "restaurant", "florence", "italian cuisine", "traditional", "fine dining", "chef", "menu", "lunch", "dinner", "tuscan food", "local ingredients"
    ]
  }
];

function positionSuggestionsBox() {
  const searchBar = document.getElementById('search-bar');
  const suggestionsBox = document.getElementById('search-suggestions');
  if (!searchBar || !suggestionsBox) return;
  const rect = searchBar.getBoundingClientRect();
  suggestionsBox.style.position = 'absolute';
  suggestionsBox.style.zIndex = '9999';
  suggestionsBox.style.top = `${window.scrollY + rect.bottom + 4}px`; // 4px di margine sotto la barra
  suggestionsBox.style.left = `${window.scrollX + rect.left}px`;
  suggestionsBox.style.width = `${rect.width}px`;
  suggestionsBox.style.maxWidth = `${rect.width}px`;
}

const searchBar = document.getElementById('search-bar');
const suggestionsBox = document.getElementById('search-suggestions');

if (searchBar) {
  searchBar.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    if (!query) {
      suggestionsBox.classList.add('d-none');
      suggestionsBox.innerHTML = '';
      return;
    }
    const results = pageKeywords.filter(page =>
      page.name.toLowerCase().includes(query) ||
      page.keywords.some(k => k.toLowerCase().includes(query))
    );
    if (results.length === 0) {
      suggestionsBox.classList.add('d-none');
      suggestionsBox.innerHTML = '';
      return;
    }
    suggestionsBox.innerHTML = results.map(page =>
      `<div class="suggestion-item" data-url="${page.url}"><strong>${page.name}</strong><br><span class="suggestion-keywords">${page.keywords.slice(0,4).join(', ')}</span></div>`
    ).join('');
    suggestionsBox.classList.remove('d-none');
    positionSuggestionsBox();
  });

  searchBar.addEventListener('focus', positionSuggestionsBox);
  window.addEventListener('resize', positionSuggestionsBox);
  window.addEventListener('scroll', positionSuggestionsBox);

  suggestionsBox.addEventListener('click', function (e) {
    const item = e.target.closest('.suggestion-item');
    if (item && item.dataset.url) {
      window.location.href = item.dataset.url;
    }
  });

  document.addEventListener('click', function (e) {
    if (!suggestionsBox.contains(e.target) && e.target !== searchBar) {
      suggestionsBox.classList.add('d-none');
    }
  });
}