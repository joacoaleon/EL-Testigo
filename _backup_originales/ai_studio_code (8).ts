import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ArticulatedHuman } from '../characters/ArticulatedHuman';

export const CelestialPrologueScene: React.FC = () => {
  const { camera } = useThree();
  const michaelRef = useRef<THREE.Group>(null);
  const fallingAdversaryRef = useRef<THREE.Group>(null);
  const spearLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Movimiento cinematográfico orbital de cámara en los cielos
    camera.position.x = Math.sin(t * 0.28) * 9.5;
    camera.position.y = 2.5 + Math.cos(t * 0.2) * 1.4;
    camera.position.z = 11.5 - Math.sin(t * 0.15) * 2.5;
    camera.lookAt(0, 1.2, 0);

    if (michaelRef.current) {
      michaelRef.current.position.y = 2.4 + Math.sin(t * 2.1) * 0.25;
    }

    if (fallingAdversaryRef.current) {
      fallingAdversaryRef.current.position.y = -1.2 + Math.cos(t * 1.9) * 0.35;
      fallingAdversaryRef.current.rotation.z = Math.sin(t * 1.5) * 0.18;
    }

    if (spearLightRef.current) {
      spearLightRef.current.intensity = 6 + Math.sin(t * 12) * 2.5;
    }
  });

  return (
    <group>
      <color attach="background" args={['#070913']} />
      <fog attach="fog" args={['#070913', 10, 45]} />

      <ambientLight intensity={0.45} color="#93c5fd" />
      <directionalLight position={[12, 25, 10]} intensity={2.6} color="#fef08a" />
      <pointLight ref={spearLightRef} position={[0, 3.2, 1]} color="#f59e0b" intensity={6} distance={18} />
      <pointLight position={[0, -4, -2]} color="#dc2626" intensity={4} distance={20} />

      <Stars radius={80} depth={45} count={4000} factor={4} saturation={0.5} fade speed={1.5} />
      <Sparkles count={180} scale={18} size={4} speed={1.2} color="#fde047" />

      {/* Arcángel Miguel y Huestes Celestiales (Apocalipsis 12:7-9) */}
      <group ref={michaelRef} position={[0, 2.4, 0]} rotation={[0.15, 0, 0]}>
        <ArticulatedHuman
          name="Miguel"
          role="Príncipe de la Milicia Celestial"
          skinTone="#f3d9b1"
          tunicColor="#f8fafc"
          mantleColor="#eab308"
          hairColor="#fef08a"
          isCelestial={true}
          isAction={true}
          scale={1.35}
        />
      </group>

      {/* Ángeles aliados en formación */}
      <group position={[-3.8, 3.1, -2.5]} rotation={[0.1, 0.4, 0]}>
        <ArticulatedHuman
          skinTone="#e5c298"
          tunicColor="#e2e8f0"
          mantleColor="#38bdf8"
          hairColor="#f1f5f9"
          isCelestial={true}
          scale={1.1}
        />
      </group>
      <group position={[3.8, 3.0, -2.5]} rotation={[0.1, -0.4, 0]}>
        <ArticulatedHuman
          skinTone="#e5c298"
          tunicColor="#e2e8f0"
          mantleColor="#38bdf8"
          hairColor="#f1f5f9"
          isCelestial={true}
          scale={1.1}
        />
      </group>

      {/* Rayo de juicio celestial descendente */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.65, 5.2, 16]} />
        <meshStandardMaterial
          color="#fef9c3"
          emissive="#f59e0b"
          emissiveIntensity={3}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* El Adversario derribado hacia la tierra (Apocalipsis 12:9) */}
      <group ref={fallingAdversaryRef} position={[0, -1.5, 0.5]} rotation={[-0.55, Math.PI, 0]}>
        <ArticulatedHuman
          skinTone="#451a1c"
          tunicColor="#18181b"
          mantleColor="#7f1d1d"
          hairColor="#09090b"
          scale={1.25}
        />
      </group>

      {/* Nubes tormentosas abismales */}
      <mesh position={[0, -5.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90, 32, 32]} />
        <meshStandardMaterial color="#1f0909" roughness={0.95} wireframe={false} />
      </mesh>
    </group>
  );
};