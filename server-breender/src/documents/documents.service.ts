import { Injectable } from '@nestjs/common';
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
}
