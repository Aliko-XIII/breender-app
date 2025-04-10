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
        const documents = this.databaseService.animalDocument.findMany({
            where: {
                animal: { owners: { some: { owner: { userId: userId } } } },
            }
        });
        return documents;
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
        const documents = await this.databaseService.animalDocument.findMany({
            where: { animalId },
        });
        return documents;
    }

    async findDocumentById(id: string, authUserId: any) {
        return await this.databaseService.animalDocument.findUnique({ where: { id } });
    }

    async removeDocument(
        id: string,
        authUserId: string) {
        const document = await this.databaseService.animalDocument.findUnique({ where: { id } });
        if (!document) throw new NotFoundException(`Record with ID ${id} not found`);
        await this.databaseService.animalDocument.delete({ where: { id } });
    }


}
