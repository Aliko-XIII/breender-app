export class CreateVetDto {
    userId: string; // The ID of the user linked to this vet
    assignedAnimalIds?: string[]; // Optional: Array of IDs for animals assigned to this vet
  }
  