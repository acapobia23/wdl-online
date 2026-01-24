  card.innerHTML = `
    <div class="map-card-inner">
      <div class="map-card-header">
        <img src="${place.iconUrl}" class="map-card-icon" />
        <div>
          <span class="map-card-category">${formatCategory(place.category)}</span>
          <h3 class="map-card-title">${place.name}</h3>
        </div>
      </div>
      <div class="map-card-scroll">
        <p class="map-card-desc">${place.description}</p>
      </div>
      <div class="map-card-btn-row">
        <a class="map-card-btn" target="_blank"
          href="https://www.google.com/maps/dir/?api=1&origin=Velona's Jungle,Florence&destination=${encodeURIComponent(place.name + ', Florence')}">
          Open in Google Maps
        </a>
        <a class="map-card-btn secondary-btn" href="../../boxes/mobility/mobility.html">
          How to Get Around
        </a>
      </div>
    </div>
  `;

/* Bottom Card */
#map-card {
  position: fixed;
  bottom: -300px;
  left: 0;
  width: 100%;
  padding: 0;
  transition: 0.35s cubic-bezier(0.25, 1, 0.3, 1);
  z-index: 1500;
}

#map-card.visible {
  bottom: 0;
}

.map-card-inner {
  background: var(--card);
  color: var(--text);
  border-radius: 18px 18px 0 0;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-card-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.map-card-icon {
  width: 34px;
  height: 34px;
}

.map-card-category {
  opacity: 0.6;
  font-size: 12px;
}

.map-card-title {
  font-size: 18px;
  margin: 2px 0;
}

/* Area scrollabile del testo */
.map-card-scroll {
  max-height: 50vh;              /* altezza massima del contenuto */
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;         /* Firefox */
  -webkit-overflow-scrolling: touch;
}

.map-card-desc {
  font-size: 14px;
  margin: 6px 0 12px;
}

/* scrollbar style (optional, premium) */
.map-card-scroll::-webkit-scrollbar {
  width: 6px;
}
.map-card-scroll::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.6);
  border-radius: 6px;
}
.map-card-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.map-card-btn {
  background: var(--accent);
  color: white;
  padding: 10px 18px;
  text-decoration: none;
  border-radius: 100px;
  font-weight: 600;
  display: inline-block;
  align-self: flex-start;
  margin-top: 4px;
}

/* Marker bounce animation */
.bounce {
  animation: markerBounce 0.5s ease;
}