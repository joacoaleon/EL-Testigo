import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CAMPAIGN_CHAPTERS } from '../../content/campaignCatalog';
import { useGameStore } from '../../engine/useGameStore';
import { ArticulatedHuman } from '../characters/ArticulatedHuman';
import { getEdenTerrainHeight } from '../camera/PlayerController';

export const EdenEnvironment: React.FC = () => {
  const { currentChapterId, nearbyInteractable, activeDialogue, graphicsQuality, objectives } =
    useGameStore();

  const riverMeshRef = useRef<THREE.Mesh>(null);
  const serpentRef = useRef<THREE.Group>(null);
  const objectiveBeaconRef = useRef<THREE.Mesh>(null);

  const chapter = useMemo(
    () => CAMPAIGN_CHAPTERS.find((c) => c.id === currentChapterId) || CAMPAIGN_CHAPTERS[0],
    [currentChapterId]
  );

  // Generación del terreno 3D con elevación topográfica real
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(110, 110, 72, 72);
    geo.rotateX(-Math.PI / 2);
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      posAttr.setY(i, getEdenTerrainHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Bosque circundante de cedros, higueras y olivos
  const trees = useMemo(() => {
    const list: { x: number; y: number; z: number; scale: number; tint: string }[] = [];
    const palette = ['#2d5a27', '#3a6b33', '#1e4620', '#4a7c3f'];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2 + (i % 3) * 0.2;
      const radius = 16 + (i % 5) * 5.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Dejar despejado el sendero central y el árbol prohibido
      if (Math.abs(x) < 5 && z > -28 && z < 26) continue;
      list.push({
        x,
        y: getEdenTerrainHeight(x, z),
        z,
        scale: 0.85 + (i % 4) * 0.28,
        tint: palette[i % palette.length]
      });
    }
    return list;
  }, []);

  const activeObjective = useMemo(
    () => objectives.find((o) => !o.completed) || null,
    [objectives]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (riverMeshRef.current) {
      riverMeshRef.current.position.y = 0.08 + Math.sin(t * 2.2) * 0.025;
    }
    if (serpentRef.current) {
      serpentRef.current.rotation.y = Math.sin(t * 1.5) * 0.35;
    }
    if (objectiveBeaconRef.current) {
      objectiveBeaconRef.current.rotation.y = t * 1.8;
      objectiveBeaconRef.current.position.y = 0.4 + Math.sin(t * 3) * 0.15;
    }
  });

  const treeLifeY = getEdenTerrainHeight(-3, -5);
  const treeKnowledgeY = getEdenTerrainHeight(0, -24);
  const riverAltarY = getEdenTerrainHeight(0, 8);

  return (
    <group>
      {/* Cielo Atmosférico Realista y Niebla Dorada del Amanecer */}
      <Sky
        distance={450000}
        sunPosition={[60, 28, -45]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={6}
        rayleigh={1.8}
      />
      <fog attach="fog" args={['#d9e8d4', 28, 95]} />

      {/* Iluminación Cinematográfica */}
      <ambientLight intensity={0.65} color="#fef3c7" />
      <directionalLight
        position={[35, 48, 25]}
        intensity={2.1}
        color="#fffbeb"
        castShadow={graphicsQuality !== 'LOW'}
        shadow-mapSize-width={graphicsQuality === 'ULTRA' ? 2048 : 1024}
        shadow-mapSize-height={graphicsQuality === 'ULTRA' ? 2048 : 1024}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {graphicsQuality !== 'LOW' && (
        <Sparkles count={220} scale={[55, 12, 55]} size={2.4} speed={0.35} color="#fef08a" />
      )}

      {/* Terreno del Jardín del Edén */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial color="#3f6a34" roughness={0.92} />
      </mesh>

      {/* Los Cuatro Ríos del Edén (Pisón, Gihón, Hidekel y Éufrates - Génesis 2:10-14) */}
      <group ref={riverMeshRef} position={[0, 0.08, 8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.5, 32]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.12}
            metalness={0.65}
            transparent
            opacity={0.82}
          />
        </mesh>
        {/* Cuatro brazos fluviales */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, rot]} position={[0, -0.01, 0]}>
            <planeGeometry args={[2.4, 65]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.15}
              metalness={0.6}
              transparent
              opacity={0.78}
            />
          </mesh>
        ))}
      </group>

      {/* Hito de Piedra en la Confluencia de los Cuatro Ríos */}
      <group position={[0, riverAltarY, 8]}>
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.95, 1.3, 8]} />
          <meshStandardMaterial color="#a8a29e" roughness={0.85} />
        </mesh>
        <pointLight position={[0, 1.8, 0]} color="#38bdf8" intensity={1.8} distance={7} />
      </group>

      {/* EL ÁRBOL DE LA VIDA (Génesis 2:9) */}
      <group position={[-3, treeLifeY, -5]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.75, 4.4, 16]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.85} />
        </mesh>
        <mesh position={[0, 4.8, 0]} castShadow>
          <sphereGeometry args={[2.8, 24, 24]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#ca8a04"
            emissiveIntensity={0.35}
            roughness={0.5}
          />
        </mesh>
        <pointLight position={[0, 4.2, 0]} color="#fde047" intensity={3.2} distance={14} />
      </group>

      {/* EL ÁRBOL DE LA CIENCIA DEL BIEN Y DEL MAL (Génesis 2:17 / 3:1-6) */}
      <group position={[0, treeKnowledgeY, -24]}>
        {/* Tronco antiguo retorcido */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.95, 5.2, 18]} />
          <meshStandardMaterial color="#3b2314" roughness={0.9} />
        </mesh>
        {/* Copa densa carmesí/esmeralda */}
        <mesh position={[0, 5.5, 0]} castShadow>
          <sphereGeometry args={[3.4, 24, 24]} />
          <meshStandardMaterial color="#1f3a26" roughness={0.75} />
        </mesh>

        {/* Frutos Prohibidos resplandecientes */}
        {[
          [-1.2, 3.8, 1.4],
          [1.1, 3.6, 1.5],
          [0.2, 3.4, 1.8],
          [-0.6, 4.1, -1.2]
        ].map(([fx, fy, fz], idx) => (
          <mesh key={idx} position={[fx, fy, fz]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#ef4444"
              emissiveIntensity={1.6}
              roughness={0.25}
            />
          </mesh>
        ))}

        {/* La Serpiente enroscada en el tronco (Génesis 3:1) */}
        <group ref={serpentRef} position={[0.45, 2.2, 0.55]}>
          <mesh rotation={[0.3, 0, 0]}>
            <torusKnotGeometry args={[0.38, 0.065, 64, 12, 2, 3]} />
            <meshStandardMaterial color="#365314" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>

        <pointLight position={[0, 3.5, 1.5]} color="#f87171" intensity={2.4} distance={11} />
      </group>

      {/* Marcador visual 3D del Objetivo Activo */}
      {activeObjective && (
        <group
          position={[
            activeObjective.targetPosition.x,
            getEdenTerrainHeight(
              activeObjective.targetPosition.x,
              activeObjective.targetPosition.z
            ),
            activeObjective.targetPosition.z
          ]}
        >
          <mesh ref={objectiveBeaconRef} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.45, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* NPCs Bíblicos del Capítulo (Adán, Eva, Querubín Custodio) */}
      {chapter.npcs.map((npc) => {
        const y = getEdenTerrainHeight(npc.position.x, npc.position.z);
        const isHighlighted = nearbyInteractable?.id === npc.id;
        const isSpeaking =
          Boolean(activeDialogue) && activeDialogue?.speakerName === npc.name;

        return (
          <group
            key={npc.id}
            position={[npc.position.x, y, npc.position.z]}
            rotation={[0, npc.rotationY, 0]}
          >
            <ArticulatedHuman
              name={npc.name}
              role={npc.role}
              skinTone={npc.appearance.skinTone}
              tunicColor={npc.appearance.tunicColor}
              mantleColor={npc.appearance.mantleColor}
              hairColor={npc.appearance.hairColor}
              hasBeard={npc.appearance.hasBeard}
              isCelestial={npc.appearance.isCelestial}
              scale={npc.appearance.scale}
              isTalking={isSpeaking}
              showLabel={true}
              isHighlighted={isHighlighted}
            />
          </group>
        );
      })}

      {/* Vegetación del Jardín del Edén */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, t.y, t.z]} scale={[t.scale, t.scale, t.scale]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 2.8, 10]} />
            <meshStandardMaterial color="#4a321f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1.6, 3.4, 12]} />
            <meshStandardMaterial color={t.tint} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
};