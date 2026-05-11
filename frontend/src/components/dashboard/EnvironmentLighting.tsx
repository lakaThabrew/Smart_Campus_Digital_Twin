"use client";

import React from "react";
import { Stars } from "@react-three/drei";
import { TimeOfDay } from "./DashboardTypes";

interface EnvironmentLightingProps {
  timeOfDay: TimeOfDay;
}

type LightingPreset = {
  backgroundColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  ambientColor?: string;
  mainLightPosition: [number, number, number];
  mainLightIntensity: number;
  mainLightColor?: string;
  fillLightPosition: [number, number, number];
  fillLightIntensity: number;
  fillLightColor: string;
  hemisphereArgs: [string, string, number];
  starCount?: number;
  starSpeed?: number;
};

const LIGHTING_PRESETS: Record<TimeOfDay, LightingPreset> = {
  morning: {
    backgroundColor: "#ffdcb8",
    fogColor: "#ffdcb8",
    fogNear: 28,
    fogFar: 70,
    ambientIntensity: 0.95,
    ambientColor: "#ffe8d2",
    mainLightPosition: [8, 14, -6],
    mainLightIntensity: 1.1,
    mainLightColor: "#ffd8a6",
    fillLightPosition: [-9, 10, 7],
    fillLightIntensity: 0.45,
    fillLightColor: "#ffe6cc",
    hemisphereArgs: ["#ffe9cc", "#557b45", 0.5],
    starCount: 250,
    starSpeed: 0.3,
  },
  day: {
    backgroundColor: "#c0d4ee",
    fogColor: "#c0d4ee",
    fogNear: 30,
    fogFar: 70,
    ambientIntensity: 1.1,
    mainLightPosition: [12, 20, 10],
    mainLightIntensity: 1.5,
    fillLightPosition: [-10, 12, -8],
    fillLightIntensity: 0.35,
    fillLightColor: "#ddeeff",
    hemisphereArgs: ["#c8daf0", "#3a7030", 0.5],
  },
  evening: {
    backgroundColor: "#d08ba1",
    fogColor: "#d08ba1",
    fogNear: 26,
    fogFar: 68,
    ambientIntensity: 0.72,
    ambientColor: "#ffc8a0",
    mainLightPosition: [-7, 11, 9],
    mainLightIntensity: 0.9,
    mainLightColor: "#ffb97a",
    fillLightPosition: [8, 8, -7],
    fillLightIntensity: 0.4,
    fillLightColor: "#b8b9f5",
    hemisphereArgs: ["#f2b89a", "#2d3a59", 0.5],
    starCount: 1000,
    starSpeed: 0.6,
  },
  night: {
    backgroundColor: "#121629",
    fogColor: "#121629",
    fogNear: 25,
    fogFar: 75,
    ambientIntensity: 0.5,
    ambientColor: "#8090c0",
    mainLightPosition: [-15, 25, -15],
    mainLightIntensity: 0.8,
    mainLightColor: "#cceeff",
    fillLightPosition: [10, 10, 10],
    fillLightIntensity: 0.3,
    fillLightColor: "#6677aa",
    hemisphereArgs: ["#202a50", "#0a1020", 0.6],
    starCount: 3000,
    starSpeed: 1,
  },
};

export default function EnvironmentLighting({ timeOfDay }: EnvironmentLightingProps) {
  const preset = LIGHTING_PRESETS[timeOfDay];

  return (
    <>
      <color attach="background" args={[preset.backgroundColor]} />
      <fog attach="fog" args={[preset.fogColor, preset.fogNear, preset.fogFar]} />

      <ambientLight intensity={preset.ambientIntensity} color={preset.ambientColor} />

      <directionalLight
        position={preset.mainLightPosition}
        intensity={preset.mainLightIntensity}
        color={preset.mainLightColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      <directionalLight
        position={preset.fillLightPosition}
        intensity={preset.fillLightIntensity}
        color={preset.fillLightColor}
      />

      <hemisphereLight args={preset.hemisphereArgs} />

      {preset.starCount ? (
        <>
          <Stars
            radius={60}
            depth={50}
            count={preset.starCount}
            factor={4}
            saturation={0}
            fade
            speed={preset.starSpeed ?? 1}
          />
        </>
      ) : null}
    </>
  );
}
