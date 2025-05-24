export class CreateOwnerDto {
    userId: string; // The ID of the user linked to this owner
    animalIds?: string[]; // Optional: Array of IDs for the animals owned by this owner
    tags?: string[]; // Optional: Array of tags for the owner
    customData?: any; // Optional: Custom data for the owner
}
