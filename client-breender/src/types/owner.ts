// src/types/owner.ts

export interface OwnerProfile {
  name?: string;
  bio?: string;
  pictureUrl?: string;
  phone?: string;
  tags?: string[];
  isAvailable?: boolean;
}

export interface OwnerUser {
  id: string;
  email: string;
  role?: string;
  profile?: OwnerProfile;
  ownerProfile?: OwnerProfile; // Additional owner-specific data
}

export type AnimalOwner = OwnerUser;
