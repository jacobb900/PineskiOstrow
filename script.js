// 1. Granice Ostrowa Wielkopolskiego (blokada kamery)
const southWest = L.latLng(51.60, 17.70);
const northEast = L.latLng(51.70, 17.90);
const bounds = L.latLngBounds(southWest, northEast);

// 2. Definicja warstw
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 20,
    maxNativeZoom: 19
});

const satelliteImg = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 20,
    maxNativeZoom: 18
});

const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 20,
    pane: 'shadowPane'
});

const satelliteHybrid = L.layerGroup([satelliteImg, labels]);

// 3. Inicjalizacja mapy
const map = L.map('map', {
    center: [51.655, 17.807],
    zoom: 14,
    minZoom: 12,
    maxZoom: 20,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    layers: [osm]
});

// --- GRANICA MIASTA ---
const ostrowBoundary = {
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [17.771, 51.688], [17.792, 51.697], [17.832, 51.699], [17.864, 51.685],
            [17.876, 51.666], [17.884, 51.641], [17.873, 51.618], [17.846, 51.604],
            [17.808, 51.601], [17.771, 51.607], [17.744, 51.632], [17.737, 51.661],
            [17.771, 51.688]
        ]]
    }
};

L.geoJSON(ostrowBoundary, {
    style: { color: "#555", weight: 2, fillOpacity: 0.05, dashArray: '5, 10' },
    interactive: false
}).addTo(map);

// 4. Przełącznik warstw
const baseMaps = {
    "Mapa Standardowa": osm,
    "Satelita z nazwami": satelliteHybrid
};
L.control.layers(baseMaps).addTo(map);

// --- LOGIKA MODALA I PINESEK ---

let tempLatLng; // Tu przechowamy współrzędne kliknięcia
const modal = document.getElementById('custom-modal');
const pinInput = document.getElementById('pin-name');

// 5. Funkcja tworzenia pineski
function createCustomMarker(latlng, text) {
    const marker = L.marker(latlng).addTo(map);

    const container = document.createElement('div');
    container.innerHTML = `<div style="margin-bottom: 8px;"><b>${text}</b></div>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Usuń pineskę";
    deleteBtn.style.cssText = "background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 12px;";

    deleteBtn.onclick = function() {
        map.removeLayer(marker);
    };

    container.appendChild(deleteBtn);
    marker.bindPopup(container);

    return marker;
}

// 6. Obsługa kliknięcia na mapie (ZAMIAST PROMPT)
function onMapClick(e) {
    tempLatLng = e.latlng; // Zapamiętaj gdzie kliknięto
    modal.style.display = "block"; // Pokaż Twoje okienko
    pinInput.value = ""; // Wyczyść pole
    pinInput.focus(); // Skup kursor na polu
}

map.on('click', onMapClick);

// Obsługa przycisku ZAPISZ w Twoim okienku
document.getElementById('save-pin').onclick = function() {
    const message = pinInput.value;
    if (message.trim() !== "") {
        createCustomMarker(tempLatLng, message).openPopup();
        modal.style.display = "none"; // Schowaj okienko
    }
};

// Obsługa przycisku ANULUJ w Twoim okienku
document.getElementById('cancel-pin').onclick = function() {
    modal.style.display = "none";
};

// Zamknięcie okna po kliknięciu poza nim (na tło)
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};