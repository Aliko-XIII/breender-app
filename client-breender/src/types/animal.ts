// src/types/animal.ts

export interface Animal {
  id: string;
  name: string;
  sex: "MALE" | "FEMALE";
  breed: string;
  species: string;
  bio?: string;
  birthDate?: string;
  photo?: string;
  latitude?: number;
  longitude?: number;
  profilePicUrl?: string;
  isSterilized?: boolean;
  customData?: any;
  tags?: string[];
  // Add more fields as needed from backend
}

export interface AnimalMapInfo {
  id: string;
  name: string;
  species?: string; // Optional: Add more info if needed for display
  latitude: number;
  longitude: number;
  canPartner?: boolean; // Indicates if the animal is partnerable
}