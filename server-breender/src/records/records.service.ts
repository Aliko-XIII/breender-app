import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AnimalRecordType, Prisma } from '@prisma/client';
import { CreateRecordDto } from './dto/createRecord.dto';
import { UpdateRecordDto } from './dto/updateRecord.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BathingDetailsDto, BehaviorDetailsDto, BirthDetailsDto, BuyingDetailsDto, CheckupDetailsDto, DefleaingDetailsDto, DewormingDetailsDto, DiagnosisDetailsDto, EstrousDetailsDto, FecesDetailsDto, FoodDetailsDto, GroomingDetailsDto, HeatDetailsDto, IllnessDetailsDto, InjuryDetailsDto, MatingDetailsDto, MedicationDetailsDto, NailsDetailsDto, NotesDetailsDto, OtherDetailsDto, PregnancyDetailsDto, PrescriptionDetailsDto, SellingDetailsDto, SleepingDetailsDto, SurgeryDetailsDto, TemperatureDetailsDto, UrineDetailsDto, VaccinationDetailsDto, VomitDetailsDto, WaterDetailsDto, WeightDetailsDto } from './dto/details.dto';

@Injectable()
export class RecordsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createRecord(
        createRecordDto: CreateRecordDto,
        authUserId: string,
    ) {
        const { animalId, description, recordType } = createRecordDto;
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

        await this.validateRecordDetails(createRecordDto);

        // Create and store the animal document
        return this.databaseService.animalRecord.create({
            data: {
                animalId, recordType, description,
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
        return await this.databaseService.animalRecord.findUnique({ where: { id } });
    }

    async updateRecord(
        id: string,
        UpdateRecordDto: UpdateRecordDto,
        authUserId: any
    ) {
        const record = await this.databaseService.animalRecord.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
    }

    async removeRecord(
        id: string,
        authUserId: any
    ) {
        const record = await this.databaseService.animalRecord.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
        await this.databaseService.animalRecord.delete({ where: { id } });
    }

    async validateRecordDetails(dto: CreateRecordDto) {
        // Use 'any' or a union type of all possible DTOs if preferred
        let detailsDto: any;

        // Ensure details exist before trying to validate
        if (!dto.details) {
            throw new BadRequestException(`Details are required for record type ${dto.recordType}`);
        }

        switch (dto.recordType) {
            // Vet Records
            case AnimalRecordType.CHECKUP:
                detailsDto = plainToInstance(CheckupDetailsDto, dto.details);
                break;
            case AnimalRecordType.SURGERY:
                detailsDto = plainToInstance(SurgeryDetailsDto, dto.details);
                break;
            case AnimalRecordType.DIAGNOSIS:
                detailsDto = plainToInstance(DiagnosisDetailsDto, dto.details);
                break;
            case AnimalRecordType.PRESCRIPTION:
                detailsDto = plainToInstance(PrescriptionDetailsDto, dto.details);
                break;

            // Procedures
            case AnimalRecordType.MEDICATION:
                detailsDto = plainToInstance(MedicationDetailsDto, dto.details);
                break;
            case AnimalRecordType.VACCINATION:
                detailsDto = plainToInstance(VaccinationDetailsDto, dto.details);
                break;
            case AnimalRecordType.DEWORMING:
                detailsDto = plainToInstance(DewormingDetailsDto, dto.details);
                break;
            case AnimalRecordType.DEFLEAING:
                detailsDto = plainToInstance(DefleaingDetailsDto, dto.details);
                break;
            case AnimalRecordType.BATHING:
                detailsDto = plainToInstance(BathingDetailsDto, dto.details);
                break;
            case AnimalRecordType.GROOMING:
                detailsDto = plainToInstance(GroomingDetailsDto, dto.details);
                break;
            case AnimalRecordType.NAILS:
                detailsDto = plainToInstance(NailsDetailsDto, dto.details);
                break;

            // Health
            case AnimalRecordType.INJURY:
                detailsDto = plainToInstance(InjuryDetailsDto, dto.details);
                break;
            case AnimalRecordType.TEMPERATURE:
                detailsDto = plainToInstance(TemperatureDetailsDto, dto.details);
                break;
            case AnimalRecordType.ILLNESS:
                detailsDto = plainToInstance(IllnessDetailsDto, dto.details);
                break;
            case AnimalRecordType.BEHAVIOR:
                detailsDto = plainToInstance(BehaviorDetailsDto, dto.details);
                break;
            case AnimalRecordType.SLEEPING:
                detailsDto = plainToInstance(SleepingDetailsDto, dto.details);
                break;
            case AnimalRecordType.FECES:
                detailsDto = plainToInstance(FecesDetailsDto, dto.details);
                break;
            case AnimalRecordType.URINE:
                detailsDto = plainToInstance(UrineDetailsDto, dto.details);
                break;
            case AnimalRecordType.VOMIT:
                detailsDto = plainToInstance(VomitDetailsDto, dto.details);
                break;
            case AnimalRecordType.WEIGHT:
                detailsDto = plainToInstance(WeightDetailsDto, dto.details);
                break;

            // Nutrition
            case AnimalRecordType.FOOD:
                detailsDto = plainToInstance(FoodDetailsDto, dto.details);
                break;
            case AnimalRecordType.WATER:
                detailsDto = plainToInstance(WaterDetailsDto, dto.details);
                break;

            // Breeding
            case AnimalRecordType.HEAT:
                detailsDto = plainToInstance(HeatDetailsDto, dto.details);
                break;
            case AnimalRecordType.MATING:
                detailsDto = plainToInstance(MatingDetailsDto, dto.details);
                break;
            case AnimalRecordType.PREGNANCY:
                detailsDto = plainToInstance(PregnancyDetailsDto, dto.details);
                break;
            case AnimalRecordType.BIRTH:
                detailsDto = plainToInstance(BirthDetailsDto, dto.details);
                break;
            case AnimalRecordType.ESTROUS:
                detailsDto = plainToInstance(EstrousDetailsDto, dto.details);
                break;
            case AnimalRecordType.SELLING:
                detailsDto = plainToInstance(SellingDetailsDto, dto.details);
                break;
            case AnimalRecordType.BUYING:
                detailsDto = plainToInstance(BuyingDetailsDto, dto.details);
                break;

            // Additional
            case AnimalRecordType.NOTES:
                detailsDto = plainToInstance(NotesDetailsDto, dto.details);
                break;
            case AnimalRecordType.OTHER:
                detailsDto = plainToInstance(OtherDetailsDto, dto.details);
                break;

            default:
                throw new BadRequestException(`Unsupported record type: ${dto.recordType}`);
        }

        try {
            await validateOrReject(detailsDto);
        } catch (errors) {
            console.error('Validation failed for details:', errors);
            throw new BadRequestException(errors);
        }
    }

}
