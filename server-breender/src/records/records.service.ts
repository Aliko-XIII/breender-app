import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AnimalRecordType, Prisma } from '@prisma/client';
import { CreateRecordDto } from './dto/createRecord.dto';
import { UpdateRecordDto } from './dto/updateRecord.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TemperatureDetailsDto, WeightDetailsDto } from './dto/details.dto';

@Injectable()
export class RecordsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async validateRecordDetails(dto: CreateRecordDto) {
        let detailsDto;

        switch (dto.recordType) {
            case AnimalRecordType.TEMPERATURE:
                detailsDto = plainToInstance(TemperatureDetailsDto, dto.details);
                break;
            case AnimalRecordType.WEIGHT:
                detailsDto = plainToInstance(WeightDetailsDto, dto.details);
                break;
            default:
                return;
        }

        await validateOrReject(detailsDto);
    }

    async createRecord(
        createRecordDto: CreateRecordDto,
        userId: string,
    ) {
        // const animal = await this.databaseService.animal.findUnique({
        //     where: { id: animalId },
        // });
        // if (!animal) {
        //     throw new NotFoundException(`Animal with ID ${animalId} not found.`);
        // }

        // // Check if the authenticated user is an owner of the animal
        // const ownerAssignment = await this.databaseService.owner.findUnique({
        //     where: {
        //         userId: authUserId,
        //     },
        //     include: {
        //         animals: true, // Include the animals owned by this owner
        //     },
        // });

        // if (!ownerAssignment) {
        //     throw new ForbiddenException("You are not assigned to this animal.");
        // }

        // // Create and store the animal document
        // return this.databaseService.animalDocument.create({
        //     data: {
        //         animalId,
        //         documentName: createAnimalDocumentDto.documentName,
        //         documentUrl: createAnimalDocumentDto.documentUrl,
        //         uploadedAt: createAnimalDocumentDto.uploadedAt || new Date(),
        //     },
        // });

    }

    async findAllRecordsByUserId(
        userId: string,
        authUserId: string,
    ) {

    }

    async findAllRecordsByAnimalId(
        animalId: string,
        authUserId: string,
    ) {

    }

    async findRecordById(id: string, authUserId: any) {
        throw new Error('Method not implemented.');
    }

    async updateRecord(
        id: string,
        UpdateRecordDto: UpdateRecordDto,
        authUserId: any) {
        throw new Error('Method not implemented.');
    }

    async removeRecord(
        id: string,
        authUserId: any) {
        throw new Error('Method not implemented.');
    }

}
