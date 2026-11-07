import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../engine/useGameStore';
import { ArticulatedHuman } from '../characters/ArticulatedHuman';
import { CAMPAIGN_CHAPTERS } from '../../content/campaignCatalog';

// Función matemática compartida de elevación del terreno del Jardín del Edén
export function getEdenTerrainHeight(x: number, z: number): number {
  const distFromNorthHill = Math.sqrt(x * x + Math.pow(z + 24, 2));
  const northHill = Math.max(0, (14 - distFromNorthHill) * 0.18);
  const gentleUndulation = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.35;
  return northHill + gentleUndulation;
}

export const PlayerController: React.FC = () => {
  const { camera } = useThree();
  const playerGroupRef = useRef<THREE.Group>(null);

  const keys = useRef<Record<string, boolean>>({});
  const cameraYaw = useRef<number>(0);
  const cameraPitch = useRef<number>(0.32);
  const isPointerDown = useRef<boolean>(false);
  const verticalVelocity = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);

  const {
    phase,
    cameraMode,
    character,
    playerPosition,
    playerRotationY,
    isMoving,
    isRunning,
    isAttackingOrAction,
    activeDialogue,
    currentChapterId,
    updatePlayerTransform,
    setNearbyInteractable,
    interactWithCurrentTarget,
    toggleCameraMode,
    triggerActionAnimation
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;

      if (phase !== 'PLAYING') return;

      if (k === 'e' && !activeDialogue) {
        interactWithCurrentTarget();
      }
      if (k === 'v' && !activeDialogue) {
        toggleCameraMode();
      }
      if (k === 'f' && !activeDialogue) {
        triggerActionAnimation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isPointerDown.current = true;
      }
    };

    const handleMouseUp = () => {
      isPointerDown.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDown.current || phase !== 'PLAYING' || activeDialogue) return;
      cameraYaw.current -= e.movementX * 0.0045;
      cameraPitch.current = THREE.MathUtils.clamp(
        cameraPitch.current + e.movementY * 0.0035,
        -0.15,
        1.15
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [phase, activeDialogue, interactWithCurrentTarget, toggleCameraMode, triggerActionAnimation]);

  useFrame((_, delta) => {
    if (phase !== 'PLAYING') return;
    const dt = Math.min(delta, 0.05);

    const pos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
    let rotY = playerRotationY;
    let moving = false;
    const running = Boolean(keys.current['shift']);

    if (!activeDialogue) {
      // Rotación de cámara con Q / Flechas laterales si no usa ratón
      if (keys.current['arrowleft']) cameraYaw.current += 1.8 * dt;
      if (keys.current['arrowright']) cameraYaw.current -= 1.8 * dt;

      const forwardInput =
        (keys.current['w'] || keys.current['arrowup'] ? 1 : 0) -
        (keys.current['s'] || keys.current['arrowdown'] ? 1 : 0);
      // Convención estándar: A = izquierda, D = derecha.
      const strafeInput =
        (keys.current['a'] ? 1 : 0) - (keys.current['d'] ? 1 : 0);

      if (forwardInput !== 0 || strafeInput !== 0) {
        moving = true;
        const moveSpeed = running ? 8.2 : 4.6;
        const inputAngle = Math.atan2(strafeInput, forwardInput);
        const targetAngle = cameraYaw.current + inputAngle + Math.PI;

        // Interpolación angular suave del personaje
        const angleDiff = Math.atan2(Math.sin(targetAngle - rotY), Math.cos(targetAngle - rotY));
        rotY += angleDiff * 10 * dt;

        pos.x += Math.sin(targetAngle) * moveSpeed * dt;
        pos.z += Math.cos(targetAngle) * moveSpeed * dt;

        // Límites naturales del Jardín del Edén
        pos.x = THREE.MathUtils.clamp(pos.x, -42, 42);
        pos.z = THREE.MathUtils.clamp(pos.z, -42, 42);
      }

      // Salto físico con barra espaciadora
      if (keys.current[' '] && isGrounded.current) {
        verticalVelocity.current = 5.8;
        isGrounded.current = false;
      }
    }

    // Gravedad y ajuste a la topografía del terreno
    const groundY = getEdenTerrainHeight(pos.x, pos.z);
    if (!isGrounded.current || pos.y > groundY) {
      pos.y += verticalVelocity.current * dt;
      verticalVelocity.current -= 14.5 * dt;
      if (pos.y <= groundY) {
        pos.y = groundY;
        verticalVelocity.current = 0;
        isGrounded.current = true;
      }
    } else {
      pos.y = groundY;
    }

    if (playerGroupRef.current) {
      playerGroupRef.current.position.copy(pos);
      playerGroupRef.current.rotation.y = rotY;
    }

    updatePlayerTransform({ x: pos.x, y: pos.y, z: pos.z }, rotY, moving, running);

    // Detección de proximidad con NPCs y Objetos Bíblicos interactivos
    const chapter = CAMPAIGN_CHAPTERS.find((c) => c.id === currentChapterId);
    if (chapter) {
      let closest: {
        id: string;
        name: string;
        roleOrSubtitle: string;
        type: 'NPC' | 'OBJECT';
        dialogueId: string;
        dist: number;
      } | null = null;

      for (const npc of chapter.npcs) {
        const d = Math.hypot(pos.x - npc.position.x, pos.z - npc.position.z);
        if (d <= 3.8 && (!closest || d < closest.dist)) {
          closest = {
            id: npc.id,
            name: npc.name,
            roleOrSubtitle: npc.role,
            type: 'NPC',
            dialogueId: npc.initialDialogueId,
            dist: d
          };
        }
      }

      for (const obj of chapter.interactiveObjects) {
        const d = Math.hypot(pos.x - obj.position.x, pos.z - obj.position.z);
        if (d <= obj.interactionRadius && (!closest || d < closest.dist)) {
          closest = {
            id: obj.id,
            name: obj.name,
            roleOrSubtitle: obj.subtitle,
            type: 'OBJECT',
            dialogueId: obj.dialogueNodeId,
            dist: d
          };
        }
      }

      setNearbyInteractable(
        closest
          ? {
              id: closest.id,
              name: closest.name,
              roleOrSubtitle: closest.roleOrSubtitle,
              type: closest.type,
              dialogueId: closest.dialogueId
            }
          : null
      );
    }

    // Cámara Dinámica: 3ra Persona Cinematográfica, 1ra Persona Inmersiva o Enfoque de Diálogo
    if (activeDialogue) {
      const desiredCam = new THREE.Vector3(
        pos.x + Math.sin(rotY + 0.5) * 3.1,
        pos.y + 1.85,
        pos.z + Math.cos(rotY + 0.5) * 3.1
      );
      camera.position.lerp(desiredCam, 5 * dt);
      camera.lookAt(pos.x, pos.y + 1.55, pos.z);
    } else if (cameraMode === 'FIRST_PERSON') {
      const headPos = new THREE.Vector3(pos.x, pos.y + 1.72, pos.z);
      camera.position.copy(headPos);
      const lookTarget = new THREE.Vector3(
        pos.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * 10,
        pos.y + 1.72 - Math.sin(cameraPitch.current) * 6,
        pos.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * 10
      );
      camera.lookAt(lookTarget);
    } else {
      const distance = 5.4;
      const offsetX = Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * distance;
      const offsetZ = Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * distance;
      const offsetY = Math.sin(cameraPitch.current) * distance + 1.7;

      const targetCamPos = new THREE.Vector3(pos.x + offsetX, Math.max(groundY + 0.6, pos.y + offsetY), pos.z + offsetZ);
      camera.position.lerp(targetCamPos, 10 * dt);
      camera.lookAt(pos.x, pos.y + 1.45, pos.z);
    }
  });

  return (
    <group ref={playerGroupRef} position={[playerPosition.x, playerPosition.y, playerPosition.z]}>
      {cameraMode === 'THIRD_PERSON' && (
        <ArticulatedHuman
          name={character.name}
          skinTone={character.skinTone}
          tunicColor={character.tunicPrimaryColor}
          mantleColor={character.mantleSecondaryColor}
          hairColor={character.hairColor}
          hasBeard={character.beardStyle !== 'NONE'}
          isMoving={isMoving}
          isRunning={isRunning}
          isTalking={Boolean(activeDialogue)}
          isAction={isAttackingOrAction}
        />
      )}
    </group>
  );
};
