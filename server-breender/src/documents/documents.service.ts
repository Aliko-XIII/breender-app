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
        // Optionally, check if user is allowed to add document for this animal
        return this.databaseService.animalDocument.create({
            data: {
                documentUrl: uploadDocumentDto.url,
                animalId: uploadDocumentDto.animalId,
                documentName: uploadDocumentDto.documentName,
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

        return this.databaseService.animalDocument.findMany({
            where: { animalId },
        });
    }

    async findDocumentById(id: string, authUserId: string) {
        const document = await this.databaseService.animalDocument.findUnique({ where: { id } });
        if (!document) throw new NotFoundException(`Document with ID ${id} not found`);
        // Check if the user is an owner of the animal related to the document
        const animal = await this.databaseService.animal.findUnique({ where: { id: document.animalId } });
        if (!animal) throw new NotFoundException(`Animal with ID ${document.animalId} not found`);
        const isOwner = await this.databaseService.owner.findFirst({
            where: {
                userId: authUserId,
                animals: { some: { id: animal.id } },
            },
        });
        if (!isOwner) throw new ForbiddenException('You are not allowed to access this document.');
        return document;
    }

    async removeDocument(
        id: string,
        authUserId: string
    ) {
        const document = await this.databaseService.animalDocument.findUnique({ where: { id } });
        if (!document) throw new NotFoundException(`Document with ID ${id} not found`);
        // Ownership check relaxed: allow any authenticated user to delete
        await this.databaseService.animalDocument.delete({ where: { id } });
        return { message: 'Document deleted successfully' };
    }
}
