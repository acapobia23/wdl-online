/**
 * Nuovo Logic.js - Visualizzazione semplice di tutti i punti GeoJSON con filtro categorie
 */

let map;
let pinLayer;
let allData = [];
let isDetailCardVisible = false;
let currentCategory = null;
let unescoLayer = null;
let unescoBounds = null;

// Mappa di tutte le categorie disponibili
const categoryMap = {
    'experiences': 'experiences',
    'private-space': 'private-space',
    'nightlife': 'nightlife',
    'restaurants': 'restaurants',
    'cibreo-place': 'cibreo-place',
    'street-food': 'street-food',
    'wine': 'wine',
    'fill-bottle': 'fill-bottle',
    'mobility': 'mobility',
    'ship-package': 'ship-package',
    'wellness': 'wellness',
    'luggage-store': 'luggage-store',
    'shopping': 'shopping',
    'water': 'water',
    'at-your-door': 'at-your-door'
};

// Mappa amenity OSM -> categorie
const amenityToCategoryMap = {
    'restaurant': 'restaurants',
    'cafe': 'restaurants',
    'bar': 'nightlife',
    'nightclub': 'nightlife',
    'event_venue': 'experiences',
    'theatre': 'experiences'
};

const groupCategories = {
    'all-explore': ['experiences', 'private-space', 'nightlife'],
    'all-food': ['restaurants', 'street-food', 'wine'],
    'all-services': ['mobility', 'ship-package', 'wellness', 'luggage-store'],
    'all-essentials': ['shopping', 'water', 'at-your-door']
};

// Funzione per ottenere la categoria da un feature
function getCategory(feature) {
    if (feature.properties?.category) {
        return feature.properties.category;
    }
    const amenity = feature.properties?.amenity;
    return amenityToCategoryMap[amenity] || null;
}

async function initApp() {
    // Inizializzazione Mappa
    map = L.map('map', {
        zoomControl: false,
        center: [43.77, 11.25],
        zoom: 14,
        maxZoom: 21
    });

    // === RIGHELLO DINAMICO ===
    const scaleControl = document.createElement('div');
    scaleControl.id = 'custom-scale-control';
    scaleControl.innerHTML = `
      <div class="scale-bar-container">
        <span class="scale-label"></span>
        <div class="scale-bar-row">
          <span class="scale-bar"></span>
          <span class="scale-icon">🚶‍♂️</span>
        </div>
      </div>`;
    document.getElementById('map-container').appendChild(scaleControl);

    function updateScaleBar() {
        // Lunghezza in pixel del righello
        const barPx = 90;
        // Prendi il centro della mappa
        const center = map.getCenter();
        // Calcola la distanza in metri tra due punti separati da barPx orizzontali
        const p1 = map.containerPointToLatLng([map.getSize().x/2 - barPx/2, map.getSize().y/2]);
        const p2 = map.containerPointToLatLng([map.getSize().x/2 + barPx/2, map.getSize().y/2]);
        const meters = map.distance(p1, p2);
        // Conversione: 5 km/h = 83.33 m/min
        const min = meters / 83.33;
        let label;
        if (min < 1) {
            const sec = Math.round(min * 60);
            label = `${sec} sec`;
        } else if (min < 60) {
            label = `${Math.round(min)} min`;
        } else {
            const hours = Math.floor(min / 60);
            const mins = Math.round(min % 60);
            label = mins > 0 ? `${hours} h ${mins} min` : `${hours} h`;
        }
        // Aggiorna DOM
        scaleControl.querySelector('.scale-bar').style.display = 'inline-block';
        scaleControl.querySelector('.scale-bar').style.width = barPx + 'px';
        scaleControl.querySelector('.scale-bar').style.height = '3px';
        scaleControl.querySelector('.scale-bar').style.background = '#111';
        scaleControl.querySelector('.scale-bar').style.borderRadius = '2px';
        scaleControl.querySelector('.scale-bar').style.margin = '0 4px';
        scaleControl.querySelector('.scale-label').innerHTML = label;
    }
    map.on('zoomend moveend', updateScaleBar);
    setTimeout(updateScaleBar, 600);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 21,
        maxNativeZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Caricamento dati GeoJSON
    try {
        const data = await GeoJSONParser.fetchData('export.geojson');
        if (data && data.features && data.features.length > 0) {
            allData = data.features;
        } else {
            allData = [];
        }
        // === GESTIONE POLIGONO UNESCO ===
        const unescoFeature = data.features.find(f => f.geometry && f.geometry.type === 'Polygon' && f.properties && f.properties.name && f.properties.name.toLowerCase().includes('unesco'));
        if (unescoFeature) {
            unescoLayer = L.geoJSON(unescoFeature, {
                style: { color: '#3bd2c9', weight: 3, fillOpacity: 0.18, dashArray: '6 4' },
                interactive: false
            }).addTo(map);
            unescoBounds = unescoLayer.getBounds();
        }
    } catch (err) {
        allData = [];
    }

    // Inizializza sidebar e callback filtro
    if (typeof SidebarManager !== 'undefined') {
        SidebarManager.init((cat) => {
            // Se si deseleziona una categoria (cat === null), passa a unesco
            currentCategory = cat === null ? 'unesco' : cat;  // ← MODIFICA QUESTA RIGA
            applyCategoryFilter();
        });
    }
    // Imposta unesco come categoria iniziale
    currentCategory = 'unesco';  // ← AGGIUNGI QUESTA RIGA
    applyCategoryFilter();
    setTimeout(() => map.invalidateSize(), 500);
}

function applyCategoryFilter() {
    // UNESCO sempre visibile come layer
    if (unescoLayer && !map.hasLayer(unescoLayer)) {
        map.addLayer(unescoLayer);
    }

    // Nessuna categoria selezionata
    if (!currentCategory) {
        if (pinLayer) map.removeLayer(pinLayer);
        return;
    }

    // UNESCO = unico caso speciale
    if (currentCategory === 'unesco') {
        if (pinLayer) map.removeLayer(pinLayer);
        if (unescoBounds && unescoBounds.isValid()) {
            map.fitBounds(unescoBounds, { padding: [50, 50], animate: true });
        }
        return;
    }

    let filtered = [];

    // 🔹 ALL POINTS (TUTTI)
    if (currentCategory === 'all') {
        filtered = allData;
    }
    // 🔹 ALL POINTS DI GRUPPO
    else if (groupCategories[currentCategory]) {
        const cats = groupCategories[currentCategory];
        filtered = allData.filter(f => cats.includes(getCategory(f)));
    }
    // 🔹 CATEGORIA SINGOLA
    else {
        filtered = allData.filter(f => getCategory(f) === currentCategory);
    }

    // 🔹 STESSO FLUSSO DI TUTTE LE ALTRE
    renderMarkers(filtered);
}

function renderMarkers(features) {
    if (pinLayer) map.removeLayer(pinLayer);
    pinLayer = L.geoJSON({ type: "FeatureCollection", features }, {
        pointToLayer: (feature, latlng) => {
            let iconHtml = '📍';
            const featureCategory = getCategory(feature);

            // 🔹 emoji per ALL
            const allCategoryIcons = {
                'all-explore': '🗺️',
                'all-food': '🍷',
                'all-services': '🔧',
                'all-essentials': '⚡'
            };

            // Mappa di categorie a emoji
            const categoryIcons = {
                'experiences': '✨',
                'private-space': '🔐',
                'nightlife': '🎶',
                'restaurants': '🍽️',
                'cibreo-place': '⭐',
                'street-food': '🌮',
                'wine': '🍇',
                'fill-bottle': '🍾',
                'mobility': '🚴',
                'ship-package': '📦',
                'wellness': '💆',
                'luggage-store': '🎒',
                'shopping': '🛍️',
                'water': '💧',
                'at-your-door': '🚪'
            };
            if (allCategoryIcons[currentCategory]) {
                iconHtml = allCategoryIcons[currentCategory];
            } else if (featureCategory && categoryIcons[featureCategory]) {
                iconHtml = categoryIcons[featureCategory];
            }

            const icon = L.divIcon({
                className: 'custom-pin-container',
                html: `<div class="custom-pin">${iconHtml}</div>`,
                iconSize: [32, 40],
                iconAnchor: [16, 40]
            });
            return L.marker(latlng, { icon });
        },
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
                L.DomEvent.stopPropagation(e);

                const latlng = e.latlng;

                // zoom controllato (es: 15)
                const targetZoom = Math.min(map.getZoom() + 2, 15);

                map.flyTo(latlng, targetZoom, {
                    animate: true,
                    duration: 0.6
                });

                showDetailCard(feature);
            });
        },
        style: function(feature) {
            return { color: '#3bd2c9', weight: 2, fillOpacity: 0.1 };
        }
    }).addTo(map);

    if (features.length > 0 && !isDetailCardVisible) {
        map.fitBounds(pinLayer.getBounds(), { padding: [50, 50], animate: true});
    }
}

function showDetailCard(feature) {
    const card = document.getElementById('map-card');
    const p = feature.properties || {};
    const imageUrl = p.url_img || null;
    const pageUrl = p.url || '#';
    const category = getCategory(feature);
    
    let lat = null, lng = null;
    if (feature.geometry && feature.geometry.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
        lng = feature.geometry.coordinates[0];
        lat = feature.geometry.coordinates[1];
    }
    
    // Mappa di categorie a emoji
    const categoryIcons = {
        'experiences': '✨',
        'private-space': '🔒',
        'nightlife': '🎶',
        'restaurants': '🍽️',
        'cibreo-place': '⭐',
        'street-food': '🌮',
        'wine': '🍇',
        'fill-bottle': '🾠',
        'mobility': '🚴',
        'ship-package': '📦',
        'wellness': '💆',
        'luggage-store': '🎒',
        'shopping': '🛍️',
        'water': '💧',
        'at-your-door': '🚪'
    };
    
    const iconHtml = categoryIcons[category] || '📍';
    const categoryName = category ? category.replace(/-/g, ' ') : 'Point of Interest';
    const placeName = p.name || 'Punto di Interesse';
    
    // Costruisci la descrizione
    let description = '';
    if (p.description) {
        description = p.description;
    } else {
        // Mostra altre proprietà
        const propsToShow = Object.entries(p)
            .filter(([k]) => k !== 'name' && k !== 'category')
            .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
            .join('<br>');
        description = propsToShow || 'Nessuna descrizione disponibile';
    }
    
    // Link Google Maps
    let mapsUrl = '#';
    if (lat && lng) {
        mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    
card.innerHTML = `
    <div class="map-card-inner">
        <button class="close-btn">&times;</button>

        <div class="map-card-header">
            <div class="map-card-icon">${iconHtml}</div>
            <div>
                <div class="map-card-category">${categoryName}</div>
                <h3 class="map-card-title">${placeName}</h3>
            </div>
        </div>

        ${
            imageUrl
            ? `<div class="map-card-image">
                   <img src="${imageUrl}" alt="${placeName}">
               </div>`
            : ''
        }

        <div class="map-card-btn-row">
            <a class="map-card-btn" target="_blank" rel="noopener" href="${pageUrl}">
                Visualizza pagina
            </a>
            <a class="map-card-btn secondary-btn" href="../boxes/mobility/mobility.html">
                How to Get Around
            </a>
        </div>
    </div>
`;
    
    card.classList.add('visible');
    isDetailCardVisible = true;
    
    card.querySelector('.close-btn').onclick = () => {
        card.classList.remove('visible');
        isDetailCardVisible = false;
    };
}

window.addEventListener('load', initApp);

// ------------------ SEARCH LOGIC ------------------
const searchInput = document.getElementById('map-search');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (!query) {
            applyCategoryFilter();
            return;
        }
        // Cerca tra tutti i dati filtrati per categoria
        let filtered = allData;
        if (currentCategory && currentCategory !== 'unesco') {
            if (currentCategory in categoryMap) {
                filtered = allData.filter(f => getCategory(f) === currentCategory);
            } else {
                filtered = [];
            }
        } else if (currentCategory === 'unesco' && unescoBounds) {
            filtered = allData.filter(f => {
                if (f.geometry && f.geometry.type === 'Point') {
                    const lat = f.geometry.coordinates[1];
                    const lng = f.geometry.coordinates[0];
                    return unescoBounds.contains([lat, lng]);
                }
                return false;
            });
        }
        // Filtra per testo
        const results = filtered.filter(f => {
            const props = f.properties || {};
            return (
                (props.name && props.name.toLowerCase().includes(query)) ||
                (props.description && props.description.toLowerCase().includes(query)) ||
                (props.address && props.address.toLowerCase().includes(query)) ||
                (props['addr:street'] && props['addr:street'].toLowerCase().includes(query))
            );
        });
        renderMarkers(results);
    });
}

// ------------------ MOBILE SIDEBAR TOGGLE ------------------
// ------------------ MOBILE SIDEBAR TOGGLE ------------------
window.addEventListener('load', () => {
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mapContainer = document.getElementById('map-container');
    const card = document.getElementById('map-card');
    
    // Funzione per chiudere la card
    function closeDetailCard() {
        if (card && isDetailCardVisible) {
            card.classList.remove('visible');
            isDetailCardVisible = false;
        }
    }
    
    if (sidebarToggleBtn && sidebar) {
        // Toggle sidebar con il pulsante hamburger
        sidebarToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            // Chiudi la card quando si apre/chiude la sidebar
            closeDetailCard();
        });
        
        // Chiudi card quando si clicca sulla sidebar
        sidebar.addEventListener('click', () => {
            closeDetailCard();
        });
        
        // Chiudi sidebar se clicchi sulla mappa
        if (mapContainer) {
            mapContainer.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        }
        
       // Chiudi card quando clicchi sulla barra di ricerca
        const searchInput = document.getElementById('map-search');
        if (searchInput) {
            searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDetailCard();
            });
        }
    }
});
