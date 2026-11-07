import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface ArticulatedHumanProps {
  name?: string;
  role?: string;
  skinTone: string;
  tunicColor: string;
  mantleColor: string;
  hairColor: string;
  hasBeard?: boolean;
  isCelestial?: boolean;
  isMoving?: boolean;
  isRunning?: boolean;
  isTalking?: boolean;
  isAction?: boolean;
  scale?: number;
  showLabel?: boolean;
  isHighlighted?: boolean;
}

export const ArticulatedHuman: React.FC<ArticulatedHumanProps> = ({
  name,
  role,
  skinTone,
  tunicColor,
  mantleColor,
  hairColor,
  hasBeard = false,
  isCelestial = false,
  isMoving = false,
  isRunning = false,
  isTalking = false,
  isAction = false,
  scale = 1,
  showLabel = false,
  isHighlighted = false
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);
  const leftHipRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  // Geometría de túnica histórica drapeada generada por revolución (LatheGeometry)
  const tunicLatheGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0.19, 0.0),
      new THREE.Vector2(0.24, 0.35),
      new THREE.Vector2(0.27, 0.75),
      new THREE.Vector2(0.29, 1.05)
    ];
    return new THREE.LatheGeometry(points, 24);
  }, []);

  // Animación esquelética procedural (Cinemática directa en tiempo real)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = isRunning ? 11 : isMoving ? 6.5 : 1.8;
    const stride = isRunning ? 0.68 : isMoving ? 0.42 : 0;

    // 1. Respiración y desplazamiento vertical del torso
    if (torsoRef.current) {
      const breath = Math.sin(t * 2.2) * 0.015;
      const bounce = isMoving ? Math.abs(Math.sin(t * speed)) * (isRunning ? 0.065 : 0.035) : breath;
      torsoRef.current.position.y = 0.96 + bounce;
      torsoRef.current.rotation.x = isRunning ? 0.14 : isMoving ? 0.05 : 0;
    }

    // 2. Movimiento natural de cabeza y expresión al hablar
    if (headGroupRef.current) {
      if (isTalking) {
        headGroupRef.current.rotation.y = Math.sin(t * 2.8) * 0.16;
        headGroupRef.current.rotation.x = Math.sin(t * 5.2) * 0.06;
      } else {
        headGroupRef.current.rotation.y = Math.sin(t * 0.7) * 0.05;
        headGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.02;
      }
    }

    // 3. Extremidades superiores (Hombros y Codos)
    if (leftShoulderRef.current && rightShoulderRef.current && leftElbowRef.current && rightElbowRef.current) {
      if (isAction) {
        rightShoulderRef.current.rotation.x = -1.1 + Math.sin(t * 14) * 0.4;
        rightElbowRef.current.rotation.x = -0.5;
      } else if (isMoving) {
        leftShoulderRef.current.rotation.x = Math.sin(t * speed) * stride * 0.85;
        rightShoulderRef.current.rotation.x = -Math.sin(t * speed) * stride * 0.85;
        leftElbowRef.current.rotation.x = isRunning ? -0.65 : -0.25;
        rightElbowRef.current.rotation.x = isRunning ? -0.65 : -0.25;
      } else if (isTalking) {
        leftShoulderRef.current.rotation.x = -0.25 + Math.sin(t * 3.2) * 0.15;
        rightShoulderRef.current.rotation.x = -0.35 + Math.cos(t * 2.7) * 0.18;
        leftElbowRef.current.rotation.x = -0.55;
        rightElbowRef.current.rotation.x = -0.65;
      } else {
        leftShoulderRef.current.rotation.x = Math.sin(t * 1.5) * 0.03;
        rightShoulderRef.current.rotation.x = -Math.sin(t * 1.5) * 0.03;
        leftElbowRef.current.rotation.x = -0.12;
        rightElbowRef.current.rotation.x = -0.12;
      }
    }

    // 4. Extremidades inferiores (Caderas y Rodillas)
    if (leftHipRef.current && rightHipRef.current && leftKneeRef.current && rightKneeRef.current) {
      if (isMoving) {
        const leftPhase = Math.sin(t * speed);
        const rightPhase = -Math.sin(t * speed);
        leftHipRef.current.rotation.x = leftPhase * stride;
        rightHipRef.current.rotation.x = rightPhase * stride;
        leftKneeRef.current.rotation.x = Math.max(0, -leftPhase * stride * 1.25);
        rightKneeRef.current.rotation.x = Math.max(0, -rightPhase * stride * 1.25);
      } else {
        leftHipRef.current.rotation.x = 0;
        rightHipRef.current.rotation.x = 0;
        leftKneeRef.current.rotation.x = 0;
        rightKneeRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={rootRef} scale={[scale, scale, scale]}>
      {/* Etiqueta flotante contextual para NPCs */}
      {showLabel && name && (
        <Html position={[0, 2.25, 0]} center distanceFactor={14}>
          <div
            className={`px-3 py-1 rounded-full border backdrop-blur-md transition-all duration-300 whitespace-nowrap select-none pointer-events-none ${
              isHighlighted
                ? 'bg-amber-950/90 border-amber-400 text-amber-100 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-stone-950/75 border-stone-700/80 text-stone-200'
            }`}
          >
            <div className="text-xs font-bold tracking-wider uppercase text-amber-300">{name}</div>
            {role && <div className="text-[10px] text-stone-300">{role}</div>}
          </div>
        </Html>
      )}

      {/* Halo sutil si es una entidad angélica/celestial (Querubín de Génesis 3:24) */}
      {isCelestial && (
        <pointLight position={[0, 1.6, 0]} color="#ffd97d" intensity={2.2} distance={6} />
      )}

      {/* TORSO Y NÚCLEO CORPORAL */}
      <group ref={torsoRef} position={[0, 0.96, 0]}>
        {/* Tórax anatómico superior */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.21, 0.34, 16, 24]} />
          <meshStandardMaterial color={tunicColor} roughness={0.78} />
        </mesh>

        {/* Túnica histórica drapeada (faldón hasta pantorrillas) */}
        <mesh
          geometry={tunicLatheGeometry}
          position={[0, 0.25, 0]}
          rotation={[Math.PI, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={tunicColor} roughness={0.82} side={THREE.DoubleSide} />
        </mesh>

        {/* Manto / Chal cruzado sobre el hombro (Estética del Cercano Oriente Antiguo) */}
        <mesh position={[0.02, 0.26, 0]} rotation={[0, 0, 0.32]} castShadow>
          <torusGeometry args={[0.22, 0.065, 14, 28]} />
          <meshStandardMaterial
            color={mantleColor}
            roughness={0.65}
            metalness={isCelestial ? 0.35 : 0.05}
          />
        </mesh>

        {/* Cinturón tejido */}
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.205, 0.028, 12, 24]} />
          <meshStandardMaterial color="#3d2716" roughness={0.6} />
        </mesh>

        {/* Alas estilizadas de luz para el Querubín Custodio */}
        {isCelestial && (
          <group position={[0, 0.36, -0.18]}>
            <mesh position={[-0.45, 0.2, -0.1]} rotation={[0.15, -0.35, 0.4]}>
              <coneGeometry args={[0.35, 1.45, 12]} />
              <meshStandardMaterial
                color="#fff3c4"
                emissive="#d4af37"
                emissiveIntensity={0.45}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0.45, 0.2, -0.1]} rotation={[0.15, 0.35, -0.4]}>
              <coneGeometry args={[0.35, 1.45, 12]} />
              <meshStandardMaterial
                color="#fff3c4"
                emissive="#d4af37"
                emissiveIntensity={0.45}
                roughness={0.3}
              />
            </mesh>
          </group>
        )}

        {/* CUELLO Y CABEZA ANATÓMICA */}
        <group ref={headGroupRef} position={[0, 0.56, 0]}>
          {/* Cuello */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.072, 0.085, 0.14, 16]} />
            <meshStandardMaterial color={skinTone} roughness={0.62} />
          </mesh>

          {/* Cráneo / Rostro con proporciones ovaladas naturales */}
          <mesh position={[0, 0.22, 0]} scale={[0.92, 1.08, 0.96]} castShadow>
            <sphereGeometry args={[0.145, 28, 28]} />
            <meshStandardMaterial color={skinTone} roughness={0.58} />
          </mesh>

          {/* Nariz anatómica */}
          <mesh position={[0, 0.22, 0.14]} rotation={[0.15, 0, 0]} castShadow>
            <coneGeometry args={[0.022, 0.065, 12]} />
            <meshStandardMaterial color={skinTone} roughness={0.6} />
          </mesh>

          {/* Ojos y Cejas */}
          <mesh position={[-0.048, 0.245, 0.128]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshStandardMaterial color="#1a130e" roughness={0.2} />
          </mesh>
          <mesh position={[0.048, 0.245, 0.128]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshStandardMaterial color="#1a130e" roughness={0.2} />
          </mesh>

          {/* Cabellera esculpida */}
          <mesh position={[0, 0.25, -0.015]} scale={[0.98, 1.05, 1.04]} castShadow>
            <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>
          {/* Caída posterior del cabello */}
          <mesh position={[0, 0.16, -0.1]} rotation={[0.2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.095, 0.14, 12, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>

          {/* Barba histórica si corresponde */}
          {hasBeard && (
            <mesh position={[0, 0.13, 0.065]} scale={[0.88, 1.05, 0.85]} castShadow>
              <sphereGeometry args={[0.105, 18, 18]} />
              <meshStandardMaterial color={hairColor} roughness={0.88} />
            </mesh>
          )}
        </group>

        {/* HOMBRO Y BRAZO IZQUIERDO ARTICULADO */}
        <group ref={leftShoulderRef} position={[-0.27, 0.42, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.062, 0.2, 12, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.78} />
          </mesh>
          {/* Codo y Antebrazo Izquierdo */}
          <group ref={leftElbowRef} position={[0, -0.27, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <capsuleGeometry args={[0.048, 0.19, 12, 16]} />
              <meshStandardMaterial color={skinTone} roughness={0.62} />
            </mesh>
            {/* Mano Izquierda */}
            <mesh position={[0, -0.25, 0]} scale={[0.8, 1.1, 0.55]} castShadow>
              <sphereGeometry args={[0.048, 14, 14]} />
              <meshStandardMaterial color={skinTone} roughness={0.65} />
            </mesh>
          </group>
        </group>

        {/* HOMBRO Y BRAZO DERECHO ARTICULADO */}
        <group ref={rightShoulderRef} position={[0.27, 0.42, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.062, 0.2, 12, 16]} />
            <meshStandardMaterial color={tunicColor} roughness={0.78} />
          </mesh>
          {/* Codo y Antebrazo Derecho */}
          <group ref={rightElbowRef} position={[0, -0.27, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <capsuleGeometry args={[0.048, 0.19, 12, 16]} />
              <meshStandardMaterial color={skinTone} roughness={0.62} />
            </mesh>
            {/* Mano Derecha */}
            <mesh position={[0, -0.25, 0]} scale={[0.8, 1.1, 0.55]} castShadow>
              <sphereGeometry args={[0.048, 14, 14]} />
              <meshStandardMaterial color={skinTone} roughness={0.65} />
            </mesh>
            {/* Espada flamígera si es el Querubín de Génesis 3:24 */}
            {isCelestial && (
              <mesh position={[0, -0.32, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.032, 1.15, 12]} />
                <meshStandardMaterial
                  color="#fffbeb"
                  emissive="#f59e0b"
                  emissiveIntensity={2.2}
                />
              </mesh>
            )}
          </group>
        </group>

        {/* CADERA Y PIERNA IZQUIERDA ARTICULADA */}
        <group ref={leftHipRef} position={[-0.11, -0.08, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.078, 0.28, 12, 16]} />
            <meshStandardMaterial color={skinTone} roughness={0.65} />
          </mesh>
          <group ref={leftKneeRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.28, 12, 16]} />
              <meshStandardMaterial color={skinTone} roughness={0.65} />
            </mesh>
            {/* Sandalia histórica */}
            <mesh position={[0, -0.39, 0.04]} castShadow>
              <boxGeometry args={[0.11, 0.06, 0.22]} />
              <meshStandardMaterial color="#3b2414" roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* CADERA Y PIERNA DERECHA ARTICULADA */}
        <group ref={rightHipRef} position={[0.11, -0.08, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.078, 0.28, 12, 16]} />
            <meshStandardMaterial color={skinTone} roughness={0.65} />
          </mesh>
          <group ref={rightKneeRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.28, 12, 16]} />
              <meshStandardMaterial color={skinTone} roughness={0.65} />
            </mesh>
            {/* Sandalia histórica */}
            <mesh position={[0, -0.39, 0.04]} castShadow>
              <boxGeometry args={[0.11, 0.06, 0.22]} />
              <meshStandardMaterial color="#3b2414" roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};