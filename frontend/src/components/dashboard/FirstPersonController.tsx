import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WALK_BOUNDS } from "./DashboardTypes";
import { clamp } from "./DashboardHelpers";

export default function FirstPersonController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(-0.15);
  const pointerLocked = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Set initial walk camera position
    camera.position.set(0, 1.7, 6);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      keys.current[e.code] = down;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current -= e.movementY * 0.002;
      pitch.current = clamp(pitch.current, -1.2, 0.4);
    };
    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement !== null;
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const canvas = target?.closest("canvas") as HTMLCanvasElement | null;
      if (canvas) {
        canvas.requestPointerLock?.();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("click", onClick);
      if (document.exitPointerLock) document.exitPointerLock();
    };
  }, [enabled, camera]);

  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const yawEuler = useMemo(() => new THREE.Euler(0, 0, 0), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed =
      keys.current["ShiftLeft"] || keys.current["ShiftRight"] ? 12 : 6;
    const dt = Math.min(delta, 0.05);

    euler.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    yawEuler.set(0, yaw.current, 0);
    forward.set(0, 0, -1).applyEuler(yawEuler);
    right.set(1, 0, 0).applyEuler(yawEuler);

    if (keys.current["KeyW"] || keys.current["ArrowUp"])
      camera.position.addScaledVector(forward, speed * dt);
    if (keys.current["KeyS"] || keys.current["ArrowDown"])
      camera.position.addScaledVector(forward, -speed * dt);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])
      camera.position.addScaledVector(right, -speed * dt);
    if (keys.current["KeyD"] || keys.current["ArrowRight"])
      camera.position.addScaledVector(right, speed * dt);

    // Keep height fixed at eye level
    camera.position.y = 1.7;
    // Clamp to campus bounds
    camera.position.x = clamp(
      camera.position.x,
      WALK_BOUNDS.minX,
      WALK_BOUNDS.maxX,
    );
    camera.position.z = clamp(
      camera.position.z,
      WALK_BOUNDS.minZ,
      WALK_BOUNDS.maxZ,
    );
  });

  return null;
}
