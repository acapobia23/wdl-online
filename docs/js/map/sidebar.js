/**
 * SidebarManager - Logica UI GeoExplorer
 */
const SidebarManager = {
  activeCategory: 'unesco',
  onFilterChange: null,
  allFeatures: [],
  expandedGroups: {},

  // Mappatura icone per le categorie principali
  categoryIcons: {
    'all': '🗺️',
    'unesco': '🏛️',
    'hotel': '🏨',
    'artwork': '🎨',
    'museum': '🏛️',
    'guest_house': '🏠',
    'attraction': '🎡',
    'information': 'ℹ️',
    'hostel': '🛌',
    'viewpoint': '🔭',
    'apartment': '🏙️',
    'gallery': '🖼️',
    'restaurant': '🍝',
    'cafe': '☕',
    'bar': '🍸',
    'ice_cream': '🍦',
    'haswebsite': '🌐'
  },

  // Mappatura nomi leggibili
  categoryNames: {
    'all': 'Tutti i Punti',
    'unesco': 'Centro Storico UNESCO',
    'hotel': 'Hotel',
    'artwork': 'Opere d\'Arte',
    'museum': 'Musei',
    'guest_house': 'Affittacamere',
    'attraction': 'Attrazioni',
    'information': 'Info Turistiche',
    'hostel': 'Ostelli',
    'viewpoint': 'Punti Panoramici',
    'apartment': 'Appartamenti',
    'gallery': 'Gallerie',
    'restaurant': 'Ristoranti',
    'cafe': 'Caffè',
    'bar': 'Bar',
    'ice_cream': 'Gelato',
    'ice cream': 'Gelato',
    'haswebsite': 'Con Sito Web'
  },

  init(features, callback) {
    this.allFeatures = features;
    this.onFilterChange = callback;
    this.renderCategories();
    this.setupSearch();
    this.setupMobileToggle();
    // Applica il filtro UNESCO di default al caricamento
    this.onFilterChange({ category: 'unesco', query: '' });
  },

  renderCategories() {
    const container = document.getElementById('categories-list');
    const counts = this.calculateCounts();
    container.innerHTML = '';

    // UNESCO separato in alto
    const unescoItem = document.createElement('div');
    unescoItem.className = `cat-item ${this.activeCategory === 'unesco' ? 'active' : ''}`;
    unescoItem.innerHTML = `
      <div class="cat-icon">${this.categoryIcons['unesco'] || '🏛️'}</div>
      <div class="cat-name">${this.categoryNames['unesco']}</div>
    `;
    unescoItem.onclick = () => {
      this.activeCategory = 'unesco';
      this.renderCategories();
      this.onFilterChange({ category: 'unesco', query: document.getElementById('map-search').value });
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    };
    container.appendChild(unescoItem);

    // Separatore visivo
    const separator = document.createElement('div');
    separator.style.cssText = 'height:1px; background:#ddd; margin:8px 0;';
    container.appendChild(separator);

    // Voci principali sempre visibili
    const mainCats = [
      { id: 'all', label: this.categoryNames['all'], icon: this.categoryIcons['all'], count: counts['all'] }
    ];
    mainCats.forEach(cat => {
      const item = document.createElement('div');
      item.className = `cat-item ${this.activeCategory === cat.id ? 'active' : ''}`;
      item.innerHTML = `
        <div class="cat-icon">${cat.icon || '📍'}</div>
        <div class="cat-name">${cat.label}</div>
        <div class="cat-count">${cat.count}</div>
      `;
      item.onclick = () => {
        this.activeCategory = cat.id;
        this.renderCategories();
        this.onFilterChange({ category: cat.id, query: document.getElementById('map-search').value });
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.remove('open');
        }
      };
      container.appendChild(item);
    });
  },

  calculateCounts() {
    const counts = { all: this.allFeatures.length };
    this.allFeatures.forEach(f => {
      const type = f.properties?.tourism || f.properties?.amenity || f.properties?.shop;
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
      // Conta UNESCO
      if (f.properties?.name === 'Centro Storico UNESCO') {
        counts.unesco = (counts.unesco || 0) + 1;
      }
    });
    return counts;
  },

  setupSearch() {
    const input = document.getElementById('map-search');
    const searchIcon = document.querySelector('.search-icon');
    input.addEventListener('input', (e) => {
      this.onFilterChange({ 
        category: this.activeCategory, 
        query: e.target.value 
      });
    });
    // Click sulla lente: filtra su tutti e chiudi sidebar su mobile
    if (searchIcon) {
      searchIcon.onclick = () => {
        this.activeCategory = 'all';
        this.renderCategories();
        this.onFilterChange({ category: 'all', query: input.value });
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.remove('open');
        }
      };
    }
  },

  setupMobileToggle() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    btn.onclick = () => sidebar.classList.toggle('open');
  }
};

// Se ci sono riferimenti a export.geojson, cupola.png, aggiornarli in assets/export.geojson, assets/cupola.png

// Chiusura sidebar cliccando fuori su mobile
if (typeof window !== 'undefined') {
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (window.innerWidth > 768) return;
    if (!sidebar.classList.contains('open')) return;
    if (!sidebar.contains(e.target) && !e.target.closest('#sidebar-toggle')) {
      sidebar.classList.remove('open');
    }
  });
}
