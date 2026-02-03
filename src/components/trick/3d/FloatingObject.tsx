'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingObjectProps {
  position: [number, number, number];
  color?: string;
  glowColor?: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export function FloatingObject({
  position,
  color = '#00d4ff',
  glowColor = '#00d4ff',
  label,
  content,
  icon,
}: FloatingObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect when hovered
      const scale = hovered ? 1.1 + Math.sin(state.clock.elapsedTime * 4) * 0.05 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group position={position}>
        {/* Main Object */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={hovered ? glowColor : '#000000'}
            emissiveIntensity={hovered ? 0.5 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Wireframe outline */}
        <mesh scale={1.02}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={glowColor} wireframe transparent opacity={0.3} />
        </mesh>

        {/* Label */}
        <Html
          position={[0, 0.8, 0]}
          center
          style={{
            transition: 'all 0.2s',
            opacity: hovered || clicked ? 1 : 0.7,
            transform: `scale(${hovered ? 1.1 : 1})`,
          }}
        >
          <div
            className="px-3 py-1 rounded font-mono text-xs whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: glowColor,
              border: `1px solid ${glowColor}50`,
            }}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {label}
          </div>
        </Html>

        {/* Content Panel */}
        {clicked && (
          <Html
            position={[0, -1, 0]}
            center
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="p-4 rounded-lg font-mono text-sm max-w-xs"
              style={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                color: '#ffffff',
                border: `1px solid ${glowColor}50`,
                boxShadow: `0 0 20px ${glowColor}30`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs mb-2" style={{ color: glowColor }}>
                // {label}
              </div>
              {content}
              <button
                onClick={() => setClicked(false)}
                className="mt-3 w-full py-1 text-xs rounded"
                style={{
                  backgroundColor: `${glowColor}20`,
                  color: glowColor,
                  border: `1px solid ${glowColor}50`,
                }}
              >
                [CLOSE]
              </button>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}
