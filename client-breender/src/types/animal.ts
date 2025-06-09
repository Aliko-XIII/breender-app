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
  isAvailable?: boolean;
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

// Animal species and breed options for use in forms
export const SPECIES_OPTIONS = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Hamster",
  "Guinea Pig",
  "Ferret",
  "Horse",
  "Other"
] as const;

export const BREED_OPTIONS: Record<string, string[]> = {
  Dog: [
    "Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog", "Poodle", "Beagle", "Jack Russell Terrier", "Other"
  ],
  Cat: [
    "Persian", "Maine Coon", "Siamese", "Bengal", "Sphynx", "Ragdoll", "Other"
  ],
  Rabbit: [
    "Holland Lop", "Netherland Dwarf", "Mini Rex", "Lionhead", "Flemish Giant", "Other"
  ],
  Bird: [
    "Parakeet", "Canary", "Cockatiel", "Finch", "Lovebird", "Other"
  ],
  "Hamster": ["Syrian", "Dwarf", "Roborovski", "Chinese", "Other"],
  "Guinea Pig": ["American", "Abyssinian", "Peruvian", "Silkie", "Other"],
  "Ferret": ["Standard", "Angora", "Other"],
  "Horse": ["Arabian", "Thoroughbred", "Quarter Horse", "Appaloosa", "Other"],
  "Other": ["Other"]
};