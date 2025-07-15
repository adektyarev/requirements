// Mapbox Access Token (You'll need to replace this with your own token)
mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdC11c2VyIiwiYSI6ImNsZXh0ZXN0In0.test'; // Replace with your actual token

// Calgary coordinates and property data
const CALGARY_CENTER = [-114.0719, 51.0447];
const CALGARY_PROPERTIES = [
    {
        id: 'starling',
        name: 'Starling',
        coordinates: [-114.0719, 51.0547], // North Calgary
        description: 'From mid-Front-Garage Homes. Eco-friendly design, amphitheatre, trails, pump-track...',
        forecast: '+15% in 3 years',
        type: 'residential',
        icon: '🏠'
    },
    {
        id: 'goldwyn',
        name: 'Goldwyn', 
        coordinates: [-114.0919, 51.0347], // South Calgary
        description: 'Parcksd Semi-Detached Homes. Parks, trails, family-oriented amenities',
        forecast: '+13% in 3 years',
        type: 'residential',
        icon: '🏘️'
    }
];

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'raster-tiles': {
                type: 'raster',
                tiles: ['https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapboxgl.accessToken],
                tileSize: 256
            }
        },
        layers: [
            {
                id: 'background',
                type: 'background',
                paint: {
                    'background-color': '#2E8B57' // Sea green base
                }
            },
            {
                id: 'terrain',
                type: 'raster',
                source: 'raster-tiles',
                paint: {
                    'raster-opacity': 0.3,
                    'raster-hue-rotate': 60,
                    'raster-brightness-min': 0.3,
                    'raster-brightness-max': 1.2,
                    'raster-saturation': 2.0,
                    'raster-contrast': 1.5
                }
            }
        ]
    },
    center: CALGARY_CENTER,
    zoom: 11,
    pitch: 45,
    bearing: 0,
    antialias: true
});

// Custom map style for Civ6 look
const civ6Style = {
    version: 8,
    sources: {
        'civ6-terrain': {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        }
    },
    layers: [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#4A90E2'
            }
        },
        {
            id: 'water',
            type: 'fill',
            paint: {
                'fill-color': '#1E88E5',
                'fill-opacity': 0.8
            },
            filter: ['==', ['get', 'type'], 'water']
        },
        {
            id: 'land',
            type: 'fill',
            paint: {
                'fill-color': '#8BC34A',
                'fill-opacity': 0.9
            },
            filter: ['==', ['get', 'type'], 'land']
        }
    ]
};

// Deck.gl overlay for hexagons
let deckOverlay;

// Property markers
const markers = [];

// Wait for map to load
map.on('load', () => {
    initializeCiv6Map();
    addHexagonOverlay();
    add3DModels();
    addPropertyMarkers();
    setupPopupHandlers();
});

function initializeCiv6Map() {
    // Add terrain exaggeration for 3D effect
    map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
    });
    
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    // Add atmospheric lighting
    map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
    });
}

function addHexagonOverlay() {
    // Generate hexagon grid for Calgary area
    const hexagons = generateHexGrid(CALGARY_CENTER, 12); // zoom level 12 hexagons
    
    // Create deck.gl overlay
    deckOverlay = new deck.MapboxOverlay({
        interleaved: true,
        layers: [
            new deck.H3HexagonLayer({
                id: 'hexagon-layer',
                data: hexagons,
                pickable: true,
                wireframe: true,
                filled: true,
                extruded: false,
                getHexagon: d => d.hex,
                getFillColor: d => d.color,
                getLineColor: [212, 175, 55, 200], // Gold outline
                lineWidthMinPixels: 2,
                getLineWidth: 2
            })
        ]
    });
    
    map.addControl(deckOverlay);
}

function generateHexGrid(center, resolution) {
    const hexagons = [];
    const centerHex = h3.latLngToCell(center[1], center[0], resolution);
    const hexRing = h3.gridDisk(centerHex, 8); // 8 rings around center
    
    hexRing.forEach(hex => {
        const [lat, lng] = h3.cellToLatLng(hex);
        const distance = Math.sqrt(Math.pow(lat - center[1], 2) + Math.pow(lng - center[0], 2));
        
        // Color based on distance from center (simulating terrain types)
        let color;
        if (distance < 0.05) {
            color = [22, 163, 74, 120]; // Green for residential
        } else if (distance < 0.1) {
            color = [30, 58, 138, 120]; // Blue for commercial
        } else {
            color = [34, 197, 94, 80]; // Light green for suburbs
        }
        
        hexagons.push({
            hex: hex,
            color: color,
            type: distance < 0.05 ? 'residential' : distance < 0.1 ? 'commercial' : 'suburban'
        });
    });
    
    return hexagons;
}

function add3DModels() {
    // Add 3D building layer
    map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 10,
        paint: {
            'fill-extrusion-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#d4af37',
                '#8BC34A'
            ],
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 0,
                15, ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 0,
                15, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8
        }
    });
}

function addPropertyMarkers() {
    CALGARY_PROPERTIES.forEach(property => {
        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'marker';
        markerEl.innerHTML = property.icon;
        markerEl.style.fontSize = '20px';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';
        
        // Add click handler
        markerEl.addEventListener('click', () => {
            showPropertyPopup(property);
        });
        
        // Create and add marker
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat(property.coordinates)
            .addTo(map);
            
        markers.push(marker);
        
        // Add animated pulse effect
        setTimeout(() => {
            markerEl.style.animation = 'pulse 2s infinite';
        }, 500);
    });
    
    // Add pulse animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
            100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
    `;
    document.head.appendChild(style);
}

function showPropertyPopup(property) {
    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const description = document.getElementById('popup-description');
    const forecast = document.getElementById('popup-forecast');
    const visitBtn = document.getElementById('popup-visit');
    
    // Update popup content
    title.textContent = property.name;
    icon.innerHTML = property.icon;
    icon.style.fontSize = '40px';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    description.textContent = property.description;
    forecast.textContent = property.forecast;
    
    // Update visit button
    visitBtn.onclick = () => {
        // Animate to property location
        map.flyTo({
            center: property.coordinates,
            zoom: 16,
            duration: 2000,
            essential: true
        });
        hidePopup();
    };
    
    // Show popup with animation
    popup.classList.remove('hidden');
    popup.classList.add('show');
}

function hidePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.classList.remove('show');
}

function setupPopupHandlers() {
    // Close button handler
    document.getElementById('popup-close').addEventListener('click', hidePopup);
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        const popup = document.getElementById('popup');
        if (!popup.contains(e.target) && !e.target.classList.contains('marker')) {
            hidePopup();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hidePopup();
        }
    });
}

// Add navigation controls with custom styling
map.addControl(new mapboxgl.NavigationControl(), 'top-right');
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// Add scale control
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
}), 'bottom-left');

// Mouse interaction for 3D buildings
let hoveredStateId = null;

map.on('mousemove', '3d-buildings', (e) => {
    if (e.features.length > 0) {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
            { source: 'composite', sourceLayer: 'building', id: hoveredStateId },
            { hover: true }
        );
    }
});

map.on('mouseleave', '3d-buildings', () => {
    if (hoveredStateId !== null) {
        map.setFeatureState(
            { source: 'composite', sourceLayer: 'building', id: hoveredStateId },
            { hover: false }
        );
    }
    hoveredStateId = null;
});

// Loading animation
const loadingOverlay = document.createElement('div');
loadingOverlay.id = 'loading';
loadingOverlay.innerHTML = `
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #faf5e4, #f8f4e6);
        border: 4px solid #d4af37;
        border-radius: 15px;
        padding: 30px;
        text-align: center;
        font-weight: bold;
        color: #1e293b;
        font-size: 18px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
    ">
        <div>Loading Calgary Real Estate Map...</div>
        <div style="margin-top: 15px; font-size: 24px;">🏠 🗺️ 🏘️</div>
    </div>
`;
loadingOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    transition: opacity 0.5s ease;
`;

document.body.appendChild(loadingOverlay);

// Hide loading overlay when map is loaded
map.on('idle', () => {
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 500);
    }, 1000);
});

// Console welcome message
console.log(`
🎮 Calgary Real Estate - Civilization VI Style Map 🎮
============================================
🏠 Properties: ${CALGARY_PROPERTIES.length}
🗺️  Center: Calgary, AB (${CALGARY_CENTER[1]}, ${CALGARY_CENTER[0]})
⬡  Hexagon Grid: H3 Resolution 12
🎯 Click on property markers to view details!
============================================
`);

// Error handling for missing Mapbox token
if (mapboxgl.accessToken === 'pk.eyJ1IjoidGVzdC11c2VyIiwiYSI6ImNsZXh0ZXN0In0.test') {
    console.warn('⚠️  Please replace the Mapbox access token in script.js with your own token from https://mapbox.com');
}

// Performance monitoring
const startTime = performance.now();
map.on('idle', () => {
    const loadTime = performance.now() - startTime;
    console.log(`⚡ Map loaded in ${Math.round(loadTime)}ms`);
});