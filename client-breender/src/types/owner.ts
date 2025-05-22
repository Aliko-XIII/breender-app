// src/types/owner.ts

export interface OwnerProfile {
  name?: string;
  bio?: string;
  pictureUrl?: string;
  phone?: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  role?: string;
  profile?: OwnerProfile;
}

export type AnimalOwner = OwnerUser;
