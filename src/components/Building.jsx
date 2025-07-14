import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Building = ({ type, position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && type === 'trees') {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const renderHouse = () => {
    const colors = ['#8B4513', '#A0522D', '#D2691E', '#CD853F']
    const roofColors = ['#800000', '#8B0000', '#A52A2A']
    
    return (
      <>
        {/* House base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshLambertMaterial color={colors[Math.floor(Math.random() * colors.length)]} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[0.5, 0.4, 4]} />
          <meshLambertMaterial color={roofColors[Math.floor(Math.random() * roofColors.length)]} />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 0.15, 0.31]}>
          <boxGeometry args={[0.15, 0.3, 0.02]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-0.2, 0.25, 0.31]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshLambertMaterial color="#87CEEB" />
        </mesh>
        <mesh position={[0.2, 0.25, 0.31]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshLambertMaterial color="#87CEEB" />
        </mesh>
      </>
    )
  }

  const renderTrees = () => {
    const numTrees = 2 + Math.floor(Math.random() * 3)
    const trees = []
    
    for (let i = 0; i < numTrees; i++) {
      const x = (Math.random() - 0.5) * 1.2
      const z = (Math.random() - 0.5) * 1.2
      const height = 0.8 + Math.random() * 0.4
      const trunkHeight = height * 0.3
      const foliageHeight = height * 0.7
      
      trees.push(
        <group key={i} position={[x, 0, z]}>
          {/* Trunk */}
          <mesh position={[0, trunkHeight / 2, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, trunkHeight, 6]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          
          {/* Foliage */}
          <mesh position={[0, trunkHeight + foliageHeight / 2, 0]} castShadow>
            <coneGeometry args={[0.3 + Math.random() * 0.2, foliageHeight, 8]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
        </group>
      )
    }
    
    return trees
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {type === 'house' && renderHouse()}
      {type === 'trees' && renderTrees()}
    </group>
  )
}

export default Building