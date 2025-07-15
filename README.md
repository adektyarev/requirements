# Calgary Real Estate - Civilization VI Style Map 🏠🎮

A Civ6-inspired 3D interactive map of Calgary real estate properties using Mapbox GL JS, featuring hexagonal grids, 3D terrain, and game-like UI elements.

![Civ6 Style](https://img.shields.io/badge/Style-Civilization_VI-gold?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Mapbox_GL_JS-blue?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-Vanilla_JS-yellow?style=for-the-badge)

## 🌟 Features

- **🎯 Civ6-Style Interface**: Gold borders, bold fonts, and game-like popups
- **⬡ Hexagonal Grid Overlay**: H3-powered hexagon tiles for zoning visualization
- **🏗️ 3D Terrain & Buildings**: Extruded buildings with terrain exaggeration
- **🏠 Interactive Property Markers**: Clickable house icons with price forecasts
- **🎨 Bright, Saturated Colors**: Non-realistic, game-inspired color palette
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Get a Mapbox Access Token

1. Sign up at [mapbox.com](https://mapbox.com)
2. Go to your [Account Dashboard](https://account.mapbox.com/)
3. Copy your **Default Public Token**

### 2. Setup the Project

1. Clone or download this project
2. Open `script.js` in your editor
3. Replace the placeholder token on line 2:

```javascript
mapboxgl.accessToken = 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE';
```

### 3. Run the Application

Simply open `index.html` in your web browser. No build process required!

## 📁 Project Structure

```
calgary-civ6-map/
├── index.html          # Main HTML file with map container
├── style.css           # Civ6-inspired styling
├── script.js           # Map logic and interactions
└── README.md           # This file
```

## 🎮 How to Use

1. **Navigate**: Use mouse/touch to pan, zoom, and rotate the 3D map
2. **Click Properties**: Click on house markers (🏠 🏘️) to view details
3. **View Forecasts**: See price predictions in Civ6-style popups
4. **Explore Hexagons**: Hexagonal grid shows different zone types
5. **3D Buildings**: Hover over buildings to highlight them in gold

## 🏠 Featured Properties

### Starling (North Calgary)
- **Type**: Mid-Front-Garage Homes
- **Features**: Eco-friendly design, amphitheatre, trails, pump-track
- **Forecast**: +15% in 3 years

### Goldwyn (South Calgary)
- **Type**: Semi-Detached Homes  
- **Features**: Parks, trails, family-oriented amenities
- **Forecast**: +13% in 3 years

## 🛠️ Technical Details

### Dependencies (CDN)
- **Mapbox GL JS** v2.15.0 - 3D mapping engine
- **Deck.gl** - WebGL overlay for hexagon rendering
- **H3-js** - Hexagonal grid system
- **Three.js** - 3D graphics (for future GLTF models)

### Key Technologies
- **H3 Hexagons**: Uber's H3 system at resolution 12
- **3D Terrain**: Mapbox terrain-dem with 1.5x exaggeration
- **Custom Styling**: CSS variables for consistent Civ6 theming
- **Responsive Design**: Mobile-friendly with adaptive layouts

## 🎨 Color Palette

The project uses a Civ6-inspired color scheme:

```css
--civ-gold: #d4af37        /* Primary accent */
--civ-dark-gold: #b8941f   /* Borders & hover */
--civ-blue: #1e3a8a        /* Commercial zones */
--civ-green: #16a34a       /* Residential zones */
--civ-cream: #faf5e4       /* UI backgrounds */
```

## 🔧 Customization

### Adding New Properties

Edit the `CALGARY_PROPERTIES` array in `script.js`:

```javascript
{
    id: 'your-property',
    name: 'Property Name',
    coordinates: [-114.0XXX, 51.0XXX], // [lng, lat]
    description: 'Property description...',
    forecast: '+XX% in X years',
    type: 'residential', // or 'commercial'
    icon: '🏠' // Emoji icon
}
```

### Modifying Hexagon Colors

Update the `generateHexGrid()` function in `script.js` to change zone colors:

```javascript
// Example: Purple for luxury zones
color = [147, 51, 234, 120]; // Purple RGBA
```

### Changing Map Style

Modify the map initialization in `script.js` to use different base styles:

```javascript
style: 'mapbox://styles/mapbox/satellite-v9' // or other Mapbox styles
```

## 🚀 Performance Tips

- The map loads terrain and building data progressively
- Hexagon rendering is optimized with Deck.gl WebGL
- 3D buildings only render at zoom level 10+
- Loading animations provide visual feedback

## 🐛 Troubleshooting

### Map Not Loading?
- Check that your Mapbox token is valid
- Ensure you have internet connectivity
- Check browser console for errors

### Hexagons Not Showing?
- Deck.gl requires WebGL support
- Try a modern browser (Chrome, Firefox, Safari, Edge)

### Performance Issues?
- Reduce hexagon grid size in `generateHexGrid()`
- Disable 3D buildings by commenting out `add3DModels()`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**🎮 Built with the spirit of Civilization VI - One more turn! 🎮**