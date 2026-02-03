'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Text, Float, Stars, Line } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { WEDDING_INFO } from '@/lib/constants';

// Git commit style data
const COMMITS = [
  {
    hash: 'a1b2c3d',
    date: '2022-03-15',
    message: 'feat: first encounter at unexpected place',
    description: '운명처럼 만나게 된 우리',
    branch: 'main',
  },
  {
    hash: 'e4f5g6h',
    date: '2022-06-20',
    message: 'feat: add butterflies to stomach module',
    description: '설레는 마음의 시작',
    branch: 'main',
  },
  {
    hash: 'i7j8k9l',
    date: '2023-03-15',
    message: 'milestone: celebrate 1 year anniversary',
    description: '함께한 첫 번째 해',
    branch: 'main',
  },
  {
    hash: 'm0n1o2p',
    date: '2024-03-15',
    message: 'feat: deeper connection established',
    description: '더 깊어진 사랑',
    branch: 'main',
  },
  {
    hash: 'q3r4s5t',
    date: '2025-01-01',
    message: 'feat: implement proposal module',
    description: '영원을 약속하는 프로포즈',
    branch: 'main',
  },
];

// Floating particles component
function FloatingParticles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50 + 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Git branch visualization
function GitBranch({ startY, endY, color = '#00ff41' }: { startY: number; endY: number; color?: string }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const y = startY + (endY - startY) * t;
      pts.push([0, y, 0]);
    }
    return pts;
  }, [startY, endY]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

// Commit node
function CommitNode({
  position,
  commit,
  index
}: {
  position: [number, number, number];
  commit: typeof COMMITS[0];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (meshRef.current) {
      const scrollOffset = scroll.offset;
      const nodeProgress = index / COMMITS.length;
      const distance = Math.abs(scrollOffset - nodeProgress);
      const scale = Math.max(0.5, 1.5 - distance * 3);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Commit dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Commit info */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[2, 0, 0]}>
          {/* Hash */}
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.15}
            color="#ffff00"
            anchorX="left"
            
          >
            {commit.hash}
          </Text>

          {/* Message */}
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="left"
            maxWidth={8}
            
          >
            {commit.message}
          </Text>

          {/* Description */}
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.15}
            color="#888888"
            anchorX="left"
            
          >
            {commit.description}
          </Text>

          {/* Date */}
          <Text
            position={[0, -0.55, 0]}
            fontSize={0.12}
            color="#00d4ff"
            anchorX="left"
            
          >
            {commit.date}
          </Text>
        </group>
      </Float>
    </group>
  );
}

// Scene 1: Git Init - First Meeting
function Scene1_GitInit() {
  return (
    <group position={[0, 45, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          fontSize={1.2}
          color="#00ff41"
          anchorX="center"
          anchorY="middle"
          
        >
          {'$ git init love-story'}
        </Text>
      </Float>

      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#888888"
        anchorX="center"
        
      >
        Initialized empty Git repository in /life/together
      </Text>

      <Text
        position={[0, -4, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        
      >
        {`${WEDDING_INFO.groom.name} && ${WEDDING_INFO.bride.name}`}
      </Text>

      <Text
        position={[0, -5.5, 0]}
        fontSize={0.3}
        color="#ff0080"
        anchorX="center"
        
      >
        // scroll down to see our story
      </Text>
    </group>
  );
}

// Scene 2: Commit History
function Scene2_CommitHistory() {
  return (
    <group position={[0, 25, 0]}>
      {/* Main branch line */}
      <GitBranch startY={12} endY={-12} color="#00ff41" />

      {/* Commits */}
      {COMMITS.map((commit, i) => (
        <CommitNode
          key={commit.hash}
          position={[-0.5, 10 - i * 5, 0]}
          commit={commit}
          index={i}
        />
      ))}
    </group>
  );
}

// Scene 3: Merge - Two Lives Become One
function Scene3_Merge() {
  const { groom, bride } = WEDDING_INFO;

  return (
    <group position={[0, -5, 0]}>
      {/* Groom branch */}
      <Text
        position={[-3, 5, 0]}
        fontSize={0.25}
        color="#5f8b9b"
        anchorX="center"
        
      >
        {`branch: ${groom.englishName.toLowerCase()}`}
      </Text>

      {/* Bride branch */}
      <Text
        position={[3, 5, 0]}
        fontSize={0.25}
        color="#BB7273"
        anchorX="center"
        
      >
        {`branch: ${bride.englishName.toLowerCase()}`}
      </Text>

      {/* Merge visual */}
      <Float speed={2} rotationIntensity={0.1}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.6}
          color="#ff0080"
          anchorX="center"
          
        >
          {'$ git merge life/together'}
        </Text>
      </Float>

      <Text
        position={[0, 0, 0]}
        fontSize={0.35}
        color="#00ff41"
        anchorX="center"
        
      >
        Merge successful. No conflicts found.
      </Text>

      {/* Heart made of code */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#ff0080"
        anchorX="center"
        
      >
        {'♥ LOVE_MERGED = true'}
      </Text>
    </group>
  );
}

// Scene 4: Release - Wedding Day
function Scene4_Release() {
  const { dateDisplay, venue } = WEDDING_INFO;

  return (
    <group position={[0, -25, 0]}>
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.3}>
        <Text
          position={[0, 6, 0]}
          fontSize={1}
          color="#ffff00"
          anchorX="center"
          
        >
          {'🚀 v1.0.0 RELEASE'}
        </Text>
      </Float>

      <Text
        position={[0, 4, 0]}
        fontSize={0.3}
        color="#00ff41"
        anchorX="center"
        
      >
        {'$ git tag -a v1.0.0 -m "Wedding Day"'}
      </Text>

      {/* Date as version info */}
      <group position={[0, 1, 0]}>
        <Text
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          
        >
          {`${dateDisplay.year}.${String(dateDisplay.month).padStart(2, '0')}.${String(dateDisplay.day).padStart(2, '0')}`}
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#00d4ff"
          anchorX="center"
          
        >
          {`${dateDisplay.dayOfWeek} ${dateDisplay.time}`}
        </Text>
      </group>

      {/* Venue as deployment target */}
      <group position={[0, -2.5, 0]}>
        <Text
          fontSize={0.25}
          color="#888888"
          anchorX="center"
          
        >
          {'// deployment target'}
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          
        >
          {venue.name}
        </Text>
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.25}
          color="#ff0080"
          anchorX="center"
          
        >
          {venue.hall}
        </Text>
        <Text
          position={[0, -1.7, 0]}
          fontSize={0.2}
          color="#666666"
          anchorX="center"
          
        >
          {venue.address}
        </Text>
      </group>

      {/* Deploy status */}
      <Float speed={3} floatIntensity={0.2}>
        <Text
          position={[0, -4.5, 0]}
          fontSize={0.4}
          color="#00ff41"
          anchorX="center"
          
        >
          {'✓ DEPLOYED TO PRODUCTION'}
        </Text>
      </Float>
    </group>
  );
}

// Scene 5: Closing - Thank You
function Scene5_Closing() {
  const { groom, bride } = WEDDING_INFO;

  return (
    <group position={[0, -45, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color="#888888"
        anchorX="center"
        
      >
        {'/*'}
      </Text>

      <Text
        position={[0, 2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        
        textAlign="center"
      >
        {`* Thank you for being part of\n* our love story repository`}
      </Text>

      <Text
        position={[0, 0.5, 0]}
        fontSize={0.25}
        color="#888888"
        anchorX="center"
        
      >
        {'*/'}
      </Text>

      <Float speed={2} floatIntensity={0.3}>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.6}
          color="#ff0080"
          anchorX="center"
          
        >
          {`${groom.name} ♥ ${bride.name}`}
        </Text>
      </Float>

      <Text
        position={[0, -3.5, 0]}
        fontSize={0.2}
        color="#00ff41"
        anchorX="center"
        
      >
        {'$ git log --oneline --graph --all'}
      </Text>
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  const scroll = useScroll();

  useFrame(() => {
    const scrollProgress = scroll.offset;

    // Move camera down as user scrolls
    camera.position.y = 50 - scrollProgress * 100;
    camera.position.z = 15 - scrollProgress * 5;

    // Slight rotation for cinematic feel
    camera.rotation.x = -scrollProgress * 0.1;
  });

  return null;
}

// Main scroll content
function ScrollContent() {
  return (
    <>
      <CameraController />

      {/* Background elements */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <FloatingParticles count={150} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />

      {/* Scenes */}
      <Scene1_GitInit />
      <Scene2_CommitHistory />
      <Scene3_Merge />
      <Scene4_Release />
      <Scene5_Closing />
    </>
  );
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// Main exported component
export function JourneyScene() {
  return (
    <ScrollControls pages={5} damping={0.25}>
      <Scroll>
        <ScrollContent />
      </Scroll>
      <Effects />
    </ScrollControls>
  );
}
