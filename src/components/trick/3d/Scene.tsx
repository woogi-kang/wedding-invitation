'use client';

import { ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, Environment } from '@react-three/drei';

interface SceneProps {
  children: ReactNode;
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00d4ff" wireframe />
    </mesh>
  );
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff0080" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#00d4ff" />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Content */}
      <Suspense fallback={<Loader />}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
