export type ZoneStatus = "normal" | "busy" | "critical";

export type Zone = {
  id: string;
  name: string;
  energyKw: number;
  occupancy: number;
  temperatureC: number;
  status: ZoneStatus;
};

export type ZoneLayout = {
  id: string;
  position: [number, number, number];
};

export const CAMPUS_LAYOUT: ZoneLayout[] = [
  { id: "eng", position: [-4.5, 0, -2] },
  { id: "library", position: [0, 0, -1.5] },
  { id: "hostel", position: [4.2, 0, 0] },
  { id: "sports", position: [-1.2, 0, 3.2] },
];

export const STATUS_COLORS: Record<ZoneStatus, string> = {
  normal: "#35A29F",   // Teal
  busy: "#0B666A",     // Dark Cyan
  critical: "#97FEED", // Light Aqua
};

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function deriveStatus(occupancy: number, temperatureC: number): ZoneStatus {
  if (occupancy > 86 || temperatureC > 34) {
    return "critical";
  }

  if (occupancy > 65 || temperatureC > 31) {
    return "busy";
  }

  return "normal";
}

export function updateZone(zone: Zone): Zone {
  const nextEnergy = clamp(zone.energyKw + (Math.random() * 11 - 5.5), 15, 140);
  const nextOccupancy = clamp(zone.occupancy + (Math.random() * 10 - 5), 5, 98);
  const nextTemperature = clamp(
    zone.temperatureC + (Math.random() * 1.8 - 0.9),
    22,
    38,
  );

  return {
    ...zone,
    energyKw: Number(nextEnergy.toFixed(1)),
    occupancy: Math.round(nextOccupancy),
    temperatureC: Number(nextTemperature.toFixed(1)),
    status: deriveStatus(nextOccupancy, nextTemperature),
  };
}
