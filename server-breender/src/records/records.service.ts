import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AnimalRecordType, Prisma } from '@prisma/client';
import { CreateRecordDto } from './dto/createRecord.dto';
import { UpdateRecordDto } from './dto/updateRecord.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BathingDetailsDto, BehaviorDetailsDto, BirthDetailsDto, BuyingDetailsDto, CheckupDetailsDto, DefleaingDetailsDto, DewormingDetailsDto, DiagnosisDetailsDto, EstrousDetailsDto, FecesDetailsDto, FoodDetailsDto, GroomingDetailsDto, HeatDetailsDto, IllnessDetailsDto, InjuryDetailsDto, MatingDetailsDto, MedicationDetailsDto, NailsDetailsDto, NotesDetailsDto, OtherDetailsDto, PregnancyDetailsDto, PrescriptionDetailsDto, SellingDetailsDto, SleepingDetailsDto, SurgeryDetailsDto, TemperatureDetailsDto, UrineDetailsDto, VaccinationDetailsDto, VomitDetailsDto, WaterDetailsDto, WeightDetailsDto } from './dto/details.dto';
import { FilterRecordDto } from './dto/filterRecord.dto';

@Injectable()
export class RecordsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createRecord(
        createRecordDto: CreateRecordDto,
        authUserId: string,
    ) {
        const { animalId, description, recordType, details } = createRecordDto;
        const animal = await this.databaseService.animal.findUnique({
            where: { id: animalId },
        });
        if (!animal) {
            throw new NotFoundException(`Animal with ID ${animalId} not found.`);
        }

        // Check if the authenticated user is an owner of the animal
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

        await this.validateDetailsByType(details, recordType);

        // Create and store the animal document
        return this.databaseService.animalRecord.create({
            data: {
                animalId,
                recordType,
                description,
                details, // <-- add this line to save details
            },
        });
    }

    async findAllRecordsByUserId(
        userId: string,
        authUserId: string,
    ) {
        if (userId !== authUserId) {
            throw new ForbiddenException("You can only access your own records.");
        }

        const records = await this.databaseService.animalRecord.findMany({
            where:
                { animal: { owners: { some: { owner: { userId: userId } } } } },
            include: {
                animal: {
                    select: {
                        id: true,
                        name: true,
                        species: true,
                        breed: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return records;
    }

    async findAllRecordsByAnimalId(
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
        const records = await this.databaseService.animalRecord.findMany({
            where: { animalId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return records;
    }

    async findRecordById(id: string, authUserId: any) {
        return await this.databaseService.animalRecord.findUnique({
            where: { id },
            include: {
                animal: {
                    select: {
                        id: true,
                        name: true,
                        breed: true,
                        species: true
                    }
                }
            }
        });
    }

    async updateRecord(
        recordId: string,
        updateRecordDto: UpdateRecordDto,
        authUserId: string,
    ) {
        const existingRecord = await this.databaseService.animalRecord.findUnique({
            where: { id: recordId },
            include: {
                animal: {
                    include: {
                        owners: { where: { owner: { userId: authUserId } } }
                    }
                }
            },
        });

        if (!existingRecord) {
            throw new NotFoundException(`Record with ID ${recordId} not found.`);
        }

        if (!existingRecord.animal?.owners || existingRecord.animal.owners.length === 0) {
            throw new ForbiddenException(`You are not authorized to update this record.`);
        }

        const dataToUpdate: Prisma.AnimalRecordUpdateInput = {};

        if (updateRecordDto.description !== undefined) {
            dataToUpdate.description = updateRecordDto.description;
        }

        if (updateRecordDto.details !== undefined) {
            const currentDetails = existingRecord.details || {};
            const incomingDetails = updateRecordDto.details;
            const mergedDetails = {
                ...(currentDetails as object),
                ...(incomingDetails as object),
            };
            await this.validateDetailsByType(mergedDetails, existingRecord.recordType);
            dataToUpdate.details = mergedDetails as any;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            console.log(`No fields to update for record ${recordId}.`);
            return existingRecord;
        }

        return this.databaseService.animalRecord.update({
            where: { id: recordId },
            data: dataToUpdate,
            include: {
                animal: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    async removeRecord(
        id: string,
        authUserId: any
    ) {
        const record = await this.databaseService.animalRecord.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
        await this.databaseService.animalRecord.delete({ where: { id } });
    }

    async getRecords(filter: FilterRecordDto, authUserId: string) {
        // Only allow user to get their own or their animals' records
        // If userId is provided, it must match authUserId
        if (filter.userId && filter.userId !== authUserId) {
            throw new ForbiddenException('You can only access your own records.');
        }

        // Build Prisma where clause
        const where: any = {};
        if (filter.animalId) {
            where.animalId = filter.animalId;
        }
        if (filter.recordType) {
            where.recordType = filter.recordType;
        }
        if (filter.dateFrom || filter.dateTo) {
            where.createdAt = {};
            if (filter.dateFrom) {
                where.createdAt.gte = new Date(filter.dateFrom);
            }
            if (filter.dateTo) {
                where.createdAt.lte = new Date(filter.dateTo);
            }
        }
        // If userId is provided, filter by animals owned by user
        if (filter.userId) {
            where.animal = { owners: { some: { owner: { userId: filter.userId } } } };
        } else {
            // Default: only allow records for animals owned by authUserId
            where.animal = { owners: { some: { owner: { userId: authUserId } } } };
        }

        return this.databaseService.animalRecord.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                animal: {
                    select: { id: true, name: true, species: true, breed: true }
                }
            }
        });
    }

    private async validateDetailsByType(details: object, recordType: AnimalRecordType): Promise<void> {
        let detailsDto: any;
        switch (recordType) {
            case AnimalRecordType.CHECKUP: detailsDto = plainToInstance(CheckupDetailsDto, details); break;
            case AnimalRecordType.SURGERY: detailsDto = plainToInstance(SurgeryDetailsDto, details); break;
            case AnimalRecordType.DIAGNOSIS: detailsDto = plainToInstance(DiagnosisDetailsDto, details); break;
            case AnimalRecordType.PRESCRIPTION: detailsDto = plainToInstance(PrescriptionDetailsDto, details); break;
            case AnimalRecordType.MEDICATION: detailsDto = plainToInstance(MedicationDetailsDto, details); break;
            case AnimalRecordType.VACCINATION: detailsDto = plainToInstance(VaccinationDetailsDto, details); break;
            case AnimalRecordType.DEWORMING: detailsDto = plainToInstance(DewormingDetailsDto, details); break;
            case AnimalRecordType.DEFLEAING: detailsDto = plainToInstance(DefleaingDetailsDto, details); break;
            case AnimalRecordType.BATHING: detailsDto = plainToInstance(BathingDetailsDto, details); break;
            case AnimalRecordType.GROOMING: detailsDto = plainToInstance(GroomingDetailsDto, details); break;
            case AnimalRecordType.NAILS: detailsDto = plainToInstance(NailsDetailsDto, details); break;
            case AnimalRecordType.INJURY: detailsDto = plainToInstance(InjuryDetailsDto, details); break;
            case AnimalRecordType.TEMPERATURE: detailsDto = plainToInstance(TemperatureDetailsDto, details); break;
            case AnimalRecordType.ILLNESS: detailsDto = plainToInstance(IllnessDetailsDto, details); break;
            case AnimalRecordType.BEHAVIOR: detailsDto = plainToInstance(BehaviorDetailsDto, details); break;
            case AnimalRecordType.SLEEPING: detailsDto = plainToInstance(SleepingDetailsDto, details); break;
            case AnimalRecordType.FECES: detailsDto = plainToInstance(FecesDetailsDto, details); break;
            case AnimalRecordType.URINE: detailsDto = plainToInstance(UrineDetailsDto, details); break;
            case AnimalRecordType.VOMIT: detailsDto = plainToInstance(VomitDetailsDto, details); break;
            case AnimalRecordType.WEIGHT: detailsDto = plainToInstance(WeightDetailsDto, details); break;
            case AnimalRecordType.FOOD: detailsDto = plainToInstance(FoodDetailsDto, details); break;
            case AnimalRecordType.WATER: detailsDto = plainToInstance(WaterDetailsDto, details); break;
            case AnimalRecordType.HEAT: detailsDto = plainToInstance(HeatDetailsDto, details); break;
            case AnimalRecordType.MATING: detailsDto = plainToInstance(MatingDetailsDto, details); break;
            case AnimalRecordType.PREGNANCY: detailsDto = plainToInstance(PregnancyDetailsDto, details); break;
            case AnimalRecordType.BIRTH: detailsDto = plainToInstance(BirthDetailsDto, details); break;
            case AnimalRecordType.ESTROUS: detailsDto = plainToInstance(EstrousDetailsDto, details); break;
            case AnimalRecordType.SELLING: detailsDto = plainToInstance(SellingDetailsDto, details); break;
            case AnimalRecordType.BUYING: detailsDto = plainToInstance(BuyingDetailsDto, details); break;
            case AnimalRecordType.NOTES: detailsDto = plainToInstance(NotesDetailsDto, details); break;
            case AnimalRecordType.OTHER: detailsDto = plainToInstance(OtherDetailsDto, details); break;
            default:
                // Handle case where recordType might somehow be invalid (though unlikely if data is consistent)
                console.warn(`No specific validation DTO found for record type: ${recordType}. Skipping details validation.`);
                return; // Or throw an error if strict validation is always required
            // throw new BadRequestException(`Cannot validate details for unknown record type: ${recordType}`);
        }

        // Perform validation
        try {
            await validateOrReject(detailsDto);
        } catch (errors) {
            console.error(`Validation failed for details of type ${recordType}:`, errors);
            throw new BadRequestException(errors); // Propagate validation errors
        }
    }

}
