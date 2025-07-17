import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import HexTile from './HexTile'
import Building from './Building'

const HexMap3D = ({ onTileClick, selectedTile }) => {
  const groupRef = useRef()

  // Generate hex grid coordinates
  const hexData = useMemo(() => {
    const tiles = []
    const radius = 4
    
    const tileTypes = [
      {
        name: "Starling",
        type: "Mid-Front-Garage Homes", 
        description: "Eco-friendly design, amphitheatre, trails, pump-track...",
        forecast: "+15% in 3 years",
        amenities: ["Eco-friendly design", "Amphitheatre", "Trails", "Pump track"],
        color: "#90EE90",
        buildingType: "house"
      },
      {
        name: "Goldwyn", 
        type: "Parked Semi-Detached Homes",
        description: "Parks, trails, family-oriented amenities",
        forecast: "+13% in 3 years", 
        amenities: ["Parks", "Trails", "Family amenities"],
        color: "#FFD700",
        buildingType: "house"
      },
      {
        name: "Forest Area",
        type: "Natural Reserve",
        description: "Protected forest land with wildlife",
        forecast: "No development planned",
        amenities: ["Wildlife", "Hiking trails"],
        color: "#228B22",
        buildingType: "trees"
      },
      {
        name: "River Valley",
        type: "Waterfront",
        description: "Scenic river views and water access",
        forecast: "Premium location",
        amenities: ["Water access", "Scenic views"],
        color: "#4682B4",
        buildingType: null
      }
    ]

    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius)
      const r2 = Math.min(radius, -q + radius)
      
      for (let r = r1; r <= r2; r++) {
        const s = -q - r
        
        // Convert hex coordinates to world position
        const x = (3/2 * q) * 1.5
        const z = (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) * 1.5
        
        // Assign tile type based on position
        let tileTypeIndex
        if (Math.abs(q) + Math.abs(r) + Math.abs(s) < 3) {
          tileTypeIndex = Math.random() < 0.5 ? 0 : 1 // Starling or Goldwyn
        } else if (x < 0 && z > 0) {
          tileTypeIndex = 2 // Forest
        } else if (Math.abs(z) < 1) {
          tileTypeIndex = 3 // River
        } else {
          tileTypeIndex = Math.floor(Math.random() * 2) // Random residential
        }
        
        const tileType = tileTypes[tileTypeIndex]
        
        tiles.push({
          id: `${q}-${r}-${s}`,
          q, r, s,
          x, z,
          y: Math.random() * 0.3 - 0.15, // Slight height variation
          ...tileType
        })
      }
    }
    
    return tiles
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {hexData.map((tile) => (
        <group key={tile.id} position={[tile.x, tile.y, tile.z]}>
          <HexTile
            tile={tile}
            onClick={onTileClick}
            isSelected={selectedTile?.id === tile.id}
          />
          {tile.buildingType && (
            <Building
              type={tile.buildingType}
              position={[0, 0.1, 0]}
              scale={0.8}
            />
          )}
        </group>
      ))}
    </group>
  )
}

export default HexMap3D