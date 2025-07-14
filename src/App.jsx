import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import HexMap3D from './components/HexMap3D'
import Civ6Popup from './components/Civ6Popup'
import './App.css'

function App() {
  const [selectedTile, setSelectedTile] = useState(null)
  const [popupData, setPopupData] = useState(null)

  const handleTileClick = (tileData) => {
    setSelectedTile(tileData)
    setPopupData({
      title: tileData.name,
      subtitle: tileData.type,
      description: tileData.description,
      forecast: tileData.forecast,
      amenities: tileData.amenities,
      position: tileData.screenPosition
    })
  }

  const closePopup = () => {
    setSelectedTile(null)
    setPopupData(null)
  }

  return (
    <div className="app">
      <Canvas
        camera={{ position: [10, 8, 10], fov: 60 }}
        shadows
        className="canvas"
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Environment preset="dawn" />
        
        <HexMap3D onTileClick={handleTileClick} selectedTile={selectedTile} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {popupData && (
        <Civ6Popup
          data={popupData}
          onClose={closePopup}
        />
      )}
    </div>
  )
}

export default App