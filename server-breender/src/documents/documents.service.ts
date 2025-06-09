import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UploadDocumentDto } from './dto/createDocument.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DocumentsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createDocument(
        uploadDocumentDto: UploadDocumentDto,
        authUserId: string
    ) {
        // Check if the authenticated user has access to the animal (owner or partnership)
        const hasAccess = await this.hasAnimalAccess(authUserId, uploadDocumentDto.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this animal.');
        }
        // Save the title as documentName if provided, otherwise use the file name (without extension)
        let documentName = uploadDocumentDto.documentName;
        if (!documentName && uploadDocumentDto.url) {
            // Extract file name from url and remove extension
            const fileName = uploadDocumentDto.url.split('/').pop() || '';
            documentName = fileName.replace(/\.[^/.]+$/, '');
        }
        return this.databaseService.animalDocument.create({
            data: {
                documentUrl: uploadDocumentDto.url,
                animalId: uploadDocumentDto.animalId,
                documentName,
            },
        });
    }

    async findAllDocumentsByUserId(
        userId: string,
        authUserId: string,
    ) {
        // Only allow if authUserId === userId or is an owner of at least one animal owned by userId
        if (authUserId !== userId) {
            const sharedAnimal = await this.databaseService.animal.findFirst({
                where: {
                    AND: [
                        { owners: { some: { owner: { userId: userId } } } },
                        { owners: { some: { owner: { userId: authUserId } } } }
                    ]
                }
            });
            if (!sharedAnimal) {
                throw new ForbiddenException('You are not allowed to access these documents.');
            }
        }
        return this.databaseService.animalDocument.findMany({
            where: {
                animal: { owners: { some: { owner: { userId: userId } } } },
            }
        });
    }

    async findAllDocumentsByAnimalId(
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
        return this.databaseService.animalDocument.findMany({
            where: { animalId },
        });
    }

    async findDocumentById(id: string, authUserId: string) {
        const document = await this.databaseService.animalDocument.findUnique({ where: { id } });
        if (!document) throw new NotFoundException(`Document with ID ${id} not found`);
        // Check if the user has access to the animal related to the document
        const animal = await this.databaseService.animal.findUnique({ where: { id: document.animalId } });
        if (!animal) throw new NotFoundException(`Animal with ID ${document.animalId} not found`);
        const hasAccess = await this.hasAnimalAccess(authUserId, animal.id);
        if (!hasAccess) throw new ForbiddenException('You are not allowed to access this document.');
        return document;
    }

    async removeDocument(
        id: string,
        authUserId: string
    ) {
        const document = await this.databaseService.animalDocument.findUnique({ where: { id } });
        if (!document) throw new NotFoundException(`Document with ID ${id} not found`);
        // Check if the authenticated user has access to the animal (owner or partnership)
        const hasAccess = await this.hasAnimalAccess(authUserId, document.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this document.');
        }
        await this.databaseService.animalDocument.delete({ where: { id } });
        return { message: 'Document deleted successfully' };
    }

    /**
     * Checks if the user is the owner of the animal or has access via partnership.
     * @param userId - The user's id (not owner id)
     * @param animalId - The animal's id
     * @returns true if user is owner or has partnership access, false otherwise
     */
    async hasAnimalAccess(userId: string, animalId: string): Promise<boolean> {
        const owner = await this.databaseService.owner.findUnique({
            where: { userId },
            include: { animals: true },
        });
        if (!owner) return false;
        const isOwner = owner.animals.some((ao: any) => ao.animalId === animalId);
        if (isOwner) return true;
        const userAnimalIds = owner.animals.map((ao: any) => ao.animalId);
        if (userAnimalIds.length === 0) return false;
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
