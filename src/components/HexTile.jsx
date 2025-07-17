import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const HexTile = ({ tile, onClick, isSelected }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Create hexagon geometry
  const hexGeometry = React.useMemo(() => {
    const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 6)
    return geometry
  }, [])

  const material = React.useMemo(() => {
    const baseColor = tile.color || '#90EE90'
    return new THREE.MeshLambertMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.8
    })
  }, [tile.color])

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.1 + 0.1
        meshRef.current.material.emissive.setHex(0x333333)
      } else if (hovered) {
        meshRef.current.position.y = 0.05
        meshRef.current.material.emissive.setHex(0x111111)
      } else {
        meshRef.current.position.y = 0
        meshRef.current.material.emissive.setHex(0x000000)
      }
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()
    
    // Calculate screen position for popup
    const vector = new THREE.Vector3()
    vector.setFromMatrixPosition(meshRef.current.matrixWorld)
    vector.project(event.camera)
    
    const screenPosition = {
      x: (vector.x * 0.5 + 0.5) * window.innerWidth,
      y: (vector.y * -0.5 + 0.5) * window.innerHeight
    }
    
    onClick({
      ...tile,
      screenPosition
    })
  }

  return (
    <mesh
      ref={meshRef}
      geometry={hexGeometry}
      material={material}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    />
  )
}

export default HexTile