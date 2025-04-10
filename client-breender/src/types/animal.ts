// src/types.ts (or a suitable location)

export interface AnimalMapInfo {
    id: string;
    name: string;
    species?: string; // Optional: Add more info if needed for display
    latitude: number;
    longitude: number;
  }