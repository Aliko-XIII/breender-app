import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'; // Added NotFoundException
import { DatabaseService } from 'src/database/database.service'; // Assuming same path
// Assuming DTOs exist in a ./dto subfolder relative to this service
import { UploadPhotoDto } from './dto/createPhoto.dto';
// Prisma might be needed if you directly use its types
// import { Prisma } from '@prisma/client';

@Injectable()
export class PhotosService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Creates a new photo record associated with a specific user.
     * May also link to an animal if animalId is provided in the DTO.
     * @param createPhotoDto - Data for the new photo (e.g., URL, description).
     * @param userId - The ID of the user uploading/creating the photo record.
     */
    async createPhoto(createPhotoDto: UploadPhotoDto, userId: string) {
        return this.databaseService.animalPhoto.create({
            data: {
                photoUrl: createPhotoDto.url,
                animalId: createPhotoDto.animalId,
            },
        });
    }

    /**
     * Finds all photo records associated with a specific user.
     * Requires authorization check via authUserId.
     * @param userId - The ID of the user whose photos are being requested.
     * @param authUserId - The ID of the authenticated user making the request (for auth checks).
     */
    async findAllPhotosByUserId(
        userId: string,
        authUserId: string,
    ) {
        const photos = this.databaseService.animalPhoto.findMany({
            where: {
                animal: { owners: { some: { owner: { userId: userId } } } },
            }
        });
        return photos;
    }

    async findAllPhotosByAnimalId(
        animalId: string,
        authUserId: string,
    ) {
        const animal = await this.databaseService.animal.findUnique({
            where: { id: animalId },
        });
        if (!animal) {
            throw new NotFoundException(`Animal with ID ${animalId} not found.`);
        }

        const ownerAssignment = await this.databaseService.owner.findUnique({
            where: {
                userId: authUserId,
            },
            include: {
                animals: true,
            },
        });

        if (!ownerAssignment) {
            throw new ForbiddenException("You are not assigned to this animal.");
        }
        const photos = await this.databaseService.animalPhoto.findMany({
            where: { animalId },
        });
        return photos;
    }

    async findPhotoById(id: string, authUserId: any) {
        return await this.databaseService.animalPhoto.findUnique({ where: { id } });
    }

    /**
     * Removes/deletes a photo record and potentially the associated file from storage.
     * Requires authorization check via authUserId.
     * @param id - The ID of the photo record to remove.
     * @param authUserId - The ID of the authenticated user making the request (for auth checks).
     */
    async removePhoto(
        id: string,
        authUserId: string) {
        // Placeholder for actual implementation
        // 1. Find the photo record by ID.
        // 2. Check if the record exists.
        // 3. Perform authorization check (does authUserId own this photo record?).
        // 4. Delete the photo record from the database.
        // 5. **Important:** Delete the actual photo file from your storage (e.g., S3, local disk).
        // Example:
        // const photo = await this.findPhotoById(id, authUserId); // Reuse findById for check
        // const deletedRecord = await this.databaseService.photo.delete({ where: { id } });
        // await deleteFileFromStorage(photo.url); // You'll need a helper for this
        // return deletedRecord;
        console.log('Removing photo record ID:', id, 'by auth user:', authUserId);
        throw new Error('Method removePhoto not implemented.');
    }
}