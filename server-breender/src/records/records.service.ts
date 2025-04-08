import { BadRequestException, Injectable } from '@nestjs/common';
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
