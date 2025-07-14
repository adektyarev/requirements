# 3D Hex Map - Standalone Version

A standalone 3D hex map with Civ6-style UI popups using Three.js, HTML, CSS, and JavaScript. No build tools required!

## 📁 Files

- `index-standalone.html` - Main HTML file
- `styles.css` - All styling and Civ6-style popup design  
- `script.js` - Three.js 3D hex map logic and interactions

## 🚀 How to Run

### Method 1: Direct File Opening
1. Simply **double-click** `index-standalone.html`
2. It will open in your default browser
3. The 3D map should load automatically

### Method 2: Local Web Server (Recommended)
For better performance and to avoid CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/index-standalone.html`

## 🎮 Features

### 3D Hex Map
- **Hexagonal grid terrain** with proper hex mathematics
- **Color-coded regions**: 
  - 🟢 Green: Starling development (Mid-Front-Garage Homes)
  - 🟡 Gold: Goldwyn development (Semi-Detached Homes)  
  - 🟢 Dark Green: Forest areas with trees
  - 🔵 Blue: River/waterfront areas

### Low-Poly Buildings
- **Houses**: Randomly colored with roofs, doors, and windows
- **Tree clusters**: Procedurally generated forests
- **Subtle animations**: Trees sway in the wind

### Civ6-Style UI
- **Interactive popups** with authentic Civilization 6 design
- **Price forecasts** for each development area
- **Amenity listings** for each region
- **Smooth animations** and hover effects

## 🖱️ Controls

- **Left click + drag**: Rotate camera around the map
- **Right click + drag**: Pan the view
- **Mouse wheel**: Zoom in and out
- **Click tiles**: View detailed information in popup
- **Close popup**: Click X button or click outside popup

## 📊 Data

Based on Calgary developments:
- **Starling**: +15% price forecast, eco-friendly features
- **Goldwyn**: +13% price forecast, family amenities
- **Forest areas**: Protected natural reserves
- **Waterfront**: Premium scenic locations

## 🛠️ Technical Details

### Dependencies (via CDN)
- Three.js r158 (3D graphics)
- OrbitControls (camera controls)

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ WebGL support required
- ✅ No IE support (uses modern JavaScript)

### File Structure
```
├── index-standalone.html    # Main HTML file
├── styles.css              # All CSS styling
├── script.js               # Three.js logic
└── README-standalone.md     # This file
```

## 🎨 Customization

### Adding New Tile Types
Edit the `tileTypes` array in `script.js`:

```javascript
const tileTypes = [
    {
        name: "Your Development",
        type: "Property Type",
        description: "Description text...",
        forecast: "+20% in 3 years",
        amenities: ["Feature 1", "Feature 2"],
        color: 0xFF0000,  // Red hex color
        buildingType: "house", // or "trees" or null
        icon: "🏢"
    }
];
```

### Styling the Popup
Modify `styles.css` to change the Civ6-style popup appearance:

```css
.civ6-popup {
    background: your-gradient;
    border: your-border;
    /* ... other styles */
}
```

### Map Size
Change the hex grid radius in `script.js`:

```javascript
const radius = 4; // Increase for larger map
```

## 🐛 Troubleshooting

**Map doesn't load:**
- Check browser console for errors
- Ensure internet connection (for CDN resources)
- Try using a local web server instead of direct file opening

**Performance issues:**
- Reduce map radius for fewer tiles
- Lower shadow quality in `script.js`

**Popup doesn't show:**
- Check that clicking directly on hex tiles (not buildings)
- Ensure JavaScript is enabled in browser

## 📄 License

MIT License - Free to use and modify!