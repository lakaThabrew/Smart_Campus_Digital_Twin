"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

const BUILDING_CLEAR_RADIUS = 4.1;

const OCCUPIED: [number, number, number][] = [
  [-2.5, -2, BUILDING_CLEAR_RADIUS], [-10.5, 0.5, BUILDING_CLEAR_RADIUS],
  [10.5, -14.5, BUILDING_CLEAR_RADIUS], [2.5, -9.5, BUILDING_CLEAR_RADIUS],
  [12.5, -4.0, BUILDING_CLEAR_RADIUS], [17, -9.5, BUILDING_CLEAR_RADIUS],
  [-5.0, 4.5, BUILDING_CLEAR_RADIUS], [-5, 7.7, BUILDING_CLEAR_RADIUS],
  [-2.5, 7.7, BUILDING_CLEAR_RADIUS], [1.7, -0.5, BUILDING_CLEAR_RADIUS],
  [7.5, 3, BUILDING_CLEAR_RADIUS], [11.0, 3, BUILDING_CLEAR_RADIUS],
  [4.0, -0.5, BUILDING_CLEAR_RADIUS], [4.0, -3.5, BUILDING_CLEAR_RADIUS],
  [17, 0, BUILDING_CLEAR_RADIUS], [3, 5.3, BUILDING_CLEAR_RADIUS],
  [18.5, 6.0, BUILDING_CLEAR_RADIUS], [-10.0, 5, BUILDING_CLEAR_RADIUS],
  [-9.5, 8.0, BUILDING_CLEAR_RADIUS], [-6.5, 9.5, BUILDING_CLEAR_RADIUS],
  [-11.5, 12.5, BUILDING_CLEAR_RADIUS], [-4, 14.2, BUILDING_CLEAR_RADIUS],
  [-2.0, 14.5, BUILDING_CLEAR_RADIUS], [5.5, 7.5, BUILDING_CLEAR_RADIUS],
  [3.5, 10.5, BUILDING_CLEAR_RADIUS], [3.5, 13.5, BUILDING_CLEAR_RADIUS],
  [-8.5, -7, 5.5],
];

const ROADS: [number, number, number, number][] = [
  [0, 3.0, 0.65, 15], [0.0, 17.0, 18, 1.2], [-3.1, 9.5, 2.5, 0.3],
  [4.5, 8.5, 4.5, 0.5], [-11, 14.5, 5, 0.45], [-6.0, 15.5, 0.45, 1.5],
  [-16.0, 8.45, 0.5, 6.5], [-6, 6.5, 6, 0.5], [-8, 2.5, 8, 0.5],
  [-12.0, 4.5, 0.5, 2.5], [3.0, 6.5, 3, 0.5], [6.0, 4, 0.5, 3],
  [10.5, 1, 5, 0.5], [15, -8, 0.5, 9], [3.0, -11.5, 3, 0.5],
  [6.0, -14, 0.5, 3], [10.0, -16.5, 4.5, 0.5], [3.1, 1, 2.45, 0.5],
  [11.5, 6, 5, 0.5], [16.5, 4, 0.5, 2.5], [2.1, -3, 1.5, 0.5],
];

const ROAD_MARGIN = 0.9;

function onRoad(x: number, z: number): boolean {
  return ROADS.some(
    ([cx, cz, hw, hd]) =>
      Math.abs(x - cx) < hw + ROAD_MARGIN &&
      Math.abs(z - cz) < hd + ROAD_MARGIN
  );
}

function isClear(x: number, z: number, minDist: number): boolean {
  if (Math.abs(x) > 19.5 || z < -17 || z > 19.8) return false;
  if (onRoad(x, z)) return false;

  return !OCCUPIED.some(
    ([bx, bz, r]) =>
      Math.sqrt((x - bx) ** 2 + (z - bz) ** 2) < Math.max(r, minDist)
  );
}

type TreeType = 0 | 1 | 2;

interface TreeInstance {
  x: number;
  z: number;
  scale: number;
  type: TreeType;
  rotation: number;
}

function pickType(i: number, pine: number, broad: number, trop: number): TreeType {
  const total = pine + broad + trop;
  const r = sr(i * 17 + 333) * total;
  if (r < pine) return 0;
  if (r < pine + broad) return 1;
  return 2;
}

const FOREST_ZONES = [
  { cx: 10, cz: 13.5, rx: 8, rz: 5, count: 100, forest: true, pine: 0.9, broad: 0.5, trop: 0.6 },
  { cx: -5, cz: -14, rx: 10, rz: 2.5, count: 25, forest: true, pine: 0.6, broad: 0.3, trop: 0.1 },
  { cx: -17, cz: -8, rx: 1.5, rz: 6, count: 18, forest: true, pine: 0.7, broad: 0.2, trop: 0.1 },
];

const SCATTER_ZONES = [
  { cx: -16, cz: 13, rx: 2, rz: 1.5, count: 7, forest: false, pine: 0.4, broad: 0.4, trop: 0.2 },
  { cx: 9, cz: -10, rx: 3, rz: 3, count: 10, forest: false, pine: 0.4, broad: 0.3, trop: 0.3 },
  { cx: 19, cz: 5, rx: 0.5, rz: 5, count: 6, forest: false, pine: 0.5, broad: 0.3, trop: 0.2 },
  { cx: -19, cz: 5, rx: 0.5, rz: 6, count: 6, forest: false, pine: 0.5, broad: 0.3, trop: 0.2 },
];

const BUSH_ZONES = [
  { cx: -1.8, cz: -2, rx: 0.25, rz: 7, count: 10 },
  { cx: -1.8, cz: 9, rx: 0.25, rz: 4, count: 6 },
  { cx: -3, cz: 14.5, rx: 10, rz: 0.3, count: 10 },
  { cx: -13, cz: -12, rx: 2, rz: 2, count: 8 },
];

export default function CampusTrees() {
  const detailGroupRef = useRef<THREE.Group>(null);
  const simpleGroupRef = useRef<THREE.Group>(null);

  const trees = useMemo<TreeInstance[]>(() => {
    const result: TreeInstance[] = [];
    let seed = 0;

    [...FOREST_ZONES, ...SCATTER_ZONES].forEach((zone) => {
      let placed = 0;
      let attempts = 0;
      const minDist = zone.forest ? 1.1 : 1.5;

      while (placed < zone.count && attempts < 1000) {
        attempts++;
        const x = zone.cx + (sr(seed++) * 2 - 1) * zone.rx;
        const z = zone.cz + (sr(seed++) * 2 - 1) * zone.rz;

        if (!isClear(x, z, minDist)) continue;

        const tooClose = result.some(
          (t) => Math.sqrt((x - t.x) ** 2 + (z - t.z) ** 2) < minDist
        );

        if (tooClose) continue;

        result.push({
          x,
          z,
          scale: 0.65 + sr(seed + placed * 3 + 77) * 0.55,
          type: pickType(result.length, zone.pine, zone.broad, zone.trop),
          rotation: sr(result.length * 7 + 5) * Math.PI * 2,
        });

        placed++;
      }
    });

    return result;
  }, []);

  const pines = useMemo(() => trees.filter((t) => t.type === 0), [trees]);
  const broads = useMemo(() => trees.filter((t) => t.type === 1), [trees]);
  const tropicals = useMemo(() => trees.filter((t) => t.type === 2), [trees]);

  const bushes = useMemo(() => {
    const result: { x: number; z: number; scale: number }[] = [];
    let seed = 9000;

    BUSH_ZONES.forEach((zone) => {
      let placed = 0;
      let attempts = 0;

      while (placed < zone.count && attempts < 600) {
        attempts++;
        const x = zone.cx + (sr(seed++) * 2 - 1) * zone.rx;
        const z = zone.cz + (sr(seed++) * 2 - 1) * zone.rz;

        if (!isClear(x, z, 1.1)) continue;

        const tooCloseToOtherBush = result.some(
          (b) => Math.sqrt((x - b.x) ** 2 + (z - b.z) ** 2) < 0.9
        );

        const tooCloseToTree = trees.some(
          (t) => Math.sqrt((x - t.x) ** 2 + (z - t.z) ** 2) < 1.2
        );

        if (tooCloseToOtherBush || tooCloseToTree) continue;

        result.push({
          x,
          z,
          scale: 0.4 + sr(seed + placed * 5) * 0.4,
        });

        placed++;
      }
    });

    return result;
  }, [trees]);

  const pineTrunkRef = useRef<THREE.InstancedMesh>(null);
  const pineCanopyRef = useRef<THREE.InstancedMesh>(null);
  const broadTrunkRef = useRef<THREE.InstancedMesh>(null);
  const broadCanopyRef = useRef<THREE.InstancedMesh>(null);
  const tropTrunkRef = useRef<THREE.InstancedMesh>(null);
  const tropCanopyRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);

  const simpleTrunkRef = useRef<THREE.InstancedMesh>(null);
  const simpleCanopyRef = useRef<THREE.InstancedMesh>(null);

  useFrame(({ camera }) => {
    const far = camera.position.length() > 42;

    if (detailGroupRef.current) detailGroupRef.current.visible = !far;
    if (simpleGroupRef.current) simpleGroupRef.current.visible = far;
  });

  useEffect(() => {
    const dummy = new THREE.Object3D();

    pines.forEach(({ x, z, scale: s, rotation }, i) => {
      dummy.rotation.set(0, rotation, 0);
      dummy.position.set(x, 0.5 * s, z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      pineTrunkRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.9 * s, z);
      dummy.updateMatrix();
      pineCanopyRef.current?.setMatrixAt(i, dummy.matrix);
    });

    broads.forEach(({ x, z, scale: s, rotation }, i) => {
      dummy.rotation.set(0, rotation, 0);
      dummy.position.set(x, 0.4 * s, z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      broadTrunkRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.5 * s, z);
      dummy.updateMatrix();
      broadCanopyRef.current?.setMatrixAt(i, dummy.matrix);
    });

    tropicals.forEach(({ x, z, scale: s, rotation }, i) => {
      dummy.rotation.set(0, rotation, 0);
      dummy.position.set(x, 0.6 * s, z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      tropTrunkRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.7 * s, z);
      dummy.updateMatrix();
      tropCanopyRef.current?.setMatrixAt(i, dummy.matrix);
    });

    bushes.forEach(({ x, z, scale }, i) => {
      dummy.position.set(x, 0.28 * scale, z);
      dummy.scale.set(scale, scale * 0.65, scale);
      dummy.rotation.set(0, sr(i * 11) * Math.PI, 0);
      dummy.updateMatrix();
      bushRef.current?.setMatrixAt(i, dummy.matrix);
    });

    trees.forEach(({ x, z, scale: s, rotation }, i) => {
      dummy.rotation.set(0, rotation, 0);
      dummy.position.set(x, 0.45 * s, z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      simpleTrunkRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.35 * s, z);
      dummy.updateMatrix();
      simpleCanopyRef.current?.setMatrixAt(i, dummy.matrix);
    });

    [
      pineTrunkRef,
      pineCanopyRef,
      broadTrunkRef,
      broadCanopyRef,
      tropTrunkRef,
      tropCanopyRef,
      bushRef,
      simpleTrunkRef,
      simpleCanopyRef,
    ].forEach((ref) => {
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
      }
    });
  }, [pines, broads, tropicals, bushes, trees]);

  return (
    <>
      {/* Detailed trees - near camera */}
      <group ref={detailGroupRef}>
        <instancedMesh ref={pineTrunkRef} args={[undefined, undefined, pines.length]} castShadow receiveShadow frustumCulled>
          <cylinderGeometry args={[0.06, 0.1, 1.0, 6]} />
          <meshStandardMaterial color="#3d2008" roughness={1} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={pineCanopyRef} args={[undefined, undefined, pines.length]} castShadow receiveShadow frustumCulled>
          <coneGeometry args={[0.45, 1.8, 7]} />
          <meshStandardMaterial color="#1a4d25" roughness={0.95} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={broadTrunkRef} args={[undefined, undefined, broads.length]} castShadow receiveShadow frustumCulled>
          <cylinderGeometry args={[0.08, 0.13, 0.8, 6]} />
          <meshStandardMaterial color="#4a2f1a" roughness={1} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={broadCanopyRef} args={[undefined, undefined, broads.length]} castShadow receiveShadow frustumCulled>
          <sphereGeometry args={[0.7, 8, 6]} />
          <meshStandardMaterial color="#2aa143" roughness={0.9} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={tropTrunkRef} args={[undefined, undefined, tropicals.length]} castShadow receiveShadow frustumCulled>
          <cylinderGeometry args={[0.05, 0.09, 1.2, 5]} />
          <meshStandardMaterial color="#5c3d1e" roughness={1} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={tropCanopyRef} args={[undefined, undefined, tropicals.length]} castShadow receiveShadow frustumCulled>
          <coneGeometry args={[0.8, 1.0, 6]} />
          <meshStandardMaterial color="#3a7d44" roughness={0.9} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={bushRef} args={[undefined, undefined, bushes.length]} castShadow receiveShadow frustumCulled>
          <sphereGeometry args={[0.32, 7, 5]} />
          <meshStandardMaterial color="#2a5c2a" roughness={0.95} metalness={0} />
        </instancedMesh>
      </group>

      {/* Simple LOD trees - far camera */}
      <group ref={simpleGroupRef} visible={false}>
        <instancedMesh ref={simpleTrunkRef} args={[undefined, undefined, trees.length]} receiveShadow frustumCulled>
          <cylinderGeometry args={[0.05, 0.08, 0.9, 4]} />
          <meshStandardMaterial color="#4a2f1a" roughness={1} metalness={0} />
        </instancedMesh>

        <instancedMesh ref={simpleCanopyRef} args={[undefined, undefined, trees.length]} receiveShadow frustumCulled>
          <coneGeometry args={[0.55, 1.2, 5]} />
          <meshStandardMaterial color="#2f7d3c" roughness={0.95} metalness={0} />
        </instancedMesh>
      </group>
    </>
  );
}