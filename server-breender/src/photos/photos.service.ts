import { ForbiddenException, Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'; // Added BadRequestException, Logger
import { DatabaseService } from 'src/database/database.service'; // Assuming same path
import * as fs from 'fs';
import { join } from 'path';
// Assuming DTOs exist in a ./dto subfolder relative to this service
import { UploadPhotoDto } from './dto/createPhoto.dto';
// Prisma might be needed if you directly use its types
// import { Prisma } from '@prisma/client';

@Injectable()
export class PhotosService {
    private readonly logger = new Logger(PhotosService.name);
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Creates a new photo record associated with a specific user.
     * May also link to an animal if animalId is provided in the DTO.
     * @param createPhotoDto - Data for the new photo (e.g., URL, description).
     * @param userId - The ID of the user uploading/creating the photo record.
     */
    async createPhoto(createPhotoDto: UploadPhotoDto, userId: string) {
        this.logger.log(`createPhoto called with DTO: ${JSON.stringify(createPhotoDto)}`);
        if (!createPhotoDto.animalId) {
            this.logger.error('animalId is missing in createPhotoDto');
            throw new BadRequestException('animalId is required to upload a photo.');
        }
        if (!createPhotoDto.url) {
            this.logger.error('photo url is missing in createPhotoDto');
            throw new BadRequestException('Photo URL is required.');
        }
        // Check if the authenticated user has access to the animal (owner or partnership)
        const hasAccess = await this.hasAnimalAccess(userId, createPhotoDto.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this animal.');
        }
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

        // Check if the authenticated user has access to the animal (owner or partnership)
        const hasAccess = await this.hasAnimalAccess(authUserId, animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this animal.');
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
        const photo = await this.databaseService.animalPhoto.findUnique({ where: { id } });
        if (!photo) throw new NotFoundException(`Record with ID ${id} not found`);
        // Check if the authenticated user has access to the animal (owner or partnership)
        const hasAccess = await this.hasAnimalAccess(authUserId, photo.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this photo.');
        }
        // Remove file from filesystem
        if (photo.photoUrl) {
            const filePath = join(process.cwd(), photo.photoUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    this.logger.warn(`Failed to delete photo file: ${filePath} - ${err.message}`);
                } else {
                    this.logger.log(`Deleted photo file: ${filePath}`);
                }
            });
        }
        await this.databaseService.animalPhoto.delete({ where: { id } });
    }

    /**
     * Checks if the user is the owner of the animal or has access via partnership.
     * @param userId - The user's id (not owner id)
     * @param animalId - The animal's id
     * @returns true if user is owner or has partnership access, false otherwise
     */
    async hasAnimalAccess(userId: string, animalId: string): Promise<boolean> {
        // Find the owner record for the user
        const owner = await this.databaseService.owner.findUnique({
            where: { userId },
            include: { animals: true },
        });
        if (!owner) return false;

        // Check if user is direct owner of the animal
        const isOwner = owner.animals.some((ao: any) => ao.animalId === animalId);
        if (isOwner) return true;

        // Get all animalIds owned by this owner
        const userAnimalIds = owner.animals.map((ao: any) => ao.animalId);
        if (userAnimalIds.length === 0) return false;

        // Check for partnership where user's animal is requester or recipient with the target animal
        const partnership = await this.databaseService.partnership.findFirst({
            where: {
                OR: [
                    { requesterAnimalId: { in: userAnimalIds }, recipientAnimalId: animalId },
                    { recipientAnimalId: { in: userAnimalIds }, requesterAnimalId: animalId },
                ],
                status: 'ACCEPTED',
            },
        });
        return !!partnership;
    }
}