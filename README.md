# 3D Hex Map with Civ6-Style UI

A Three.js 3D map featuring hexagonal grid terrain with low-poly buildings and Civilization 6-style UI popups for price forecasts.

## Features

- **3D Hex Grid Terrain**: Interactive hexagonal tiles with height variations
- **Low-Poly Buildings**: Procedurally generated houses and tree clusters
- **Civ6-Style UI Popups**: Authentic-looking information panels with price forecasts
- **Interactive Elements**: Click tiles to view detailed information
- **Real Estate Data**: Displays property information inspired by Calgary developments

## Technologies Used

- **React 18** - UI framework
- **Three.js** - 3D graphics and rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## How to Use

1. **Explore the Map**: Use mouse to orbit around the 3D hex map
   - Left click + drag: Rotate camera
   - Right click + drag: Pan
   - Scroll wheel: Zoom in/out

2. **Interact with Tiles**: Click on any hexagonal tile to view information
   - Green tiles: Starling development
   - Gold tiles: Goldwyn development  
   - Dark green tiles: Forest areas
   - Blue tiles: River/waterfront areas

3. **View Information**: Civ6-style popups show:
   - Property type and name
   - Description of amenities
   - Price forecast data
   - List of available features

## Project Structure

```
src/
├── components/
│   ├── HexMap3D.jsx      # Main 3D hex grid component
│   ├── HexTile.jsx       # Individual hexagonal tiles
│   ├── Building.jsx      # Low-poly building models
│   ├── Civ6Popup.jsx     # UI popup component
│   └── Civ6Popup.css     # Popup styling
├── App.jsx               # Main application component
├── App.css              # Application styles
└── main.jsx             # React entry point
```

## Customization

### Adding New Tile Types

Edit the `tileTypes` array in `HexMap3D.jsx` to add new development types with custom colors, descriptions, and building types.

### Modifying Buildings

The `Building.jsx` component supports different building types. Add new types by extending the switch statement and creating new geometry.

### Styling the UI

Customize the Civ6-style popup appearance by modifying `Civ6Popup.css`. The design uses gradients and borders to match the Civilization 6 aesthetic.

## License

MIT License - feel free to use this project as a starting point for your own 3D mapping applications!