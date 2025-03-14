export class CreateOwnerDto {
    userId: string; // The ID of the user linked to this owner
    animalIds?: string[]; // Optional: Array of IDs for the animals owned by this owner
  }
  