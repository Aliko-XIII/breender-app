// src/mocks/mapAnimals.ts
import { AnimalMapInfo } from '../types'; // Adjust path as needed

// Approximate center for Izmail: 45.35° N, 28.83° E
export const mockMapAnimals: AnimalMapInfo[] = [
  {
    id: "animal-map-001",
    name: "Barsik",
    species: "Cat",
    latitude: 45.3495, // Near Izmail center
    longitude: 28.8350,
  },
  {
    id: "animal-map-002",
    name: "Rex",
    species: "Dog",
    latitude: 45.3550, // Slightly North
    longitude: 28.8405,
  },
  {
    id: "animal-map-003",
    name: "Whiskers",
    species: "Cat",
    latitude: 45.3421, // Slightly South-West
    longitude: 28.8210,
  },
  {
    id: "animal-map-004",
    name: "Luna",
    species: "Dog",
    latitude: 45.3610, // Further North
    longitude: 28.8300,
  },
    {
    id: "animal-map-005",
    name: "Mystery Stray", // Unknown animal
    latitude: 45.3488, // Close to center again
    longitude: 28.8285,
  },
];