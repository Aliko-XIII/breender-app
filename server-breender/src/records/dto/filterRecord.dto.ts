import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AnimalRecordType } from '@prisma/client';

export class FilterRecordDto {
    @IsOptional()
    @IsString()
    animalId?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsEnum(AnimalRecordType)
    recordType?: AnimalRecordType;

    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @IsOptional()
    @IsDateString()
    dateTo?: string;
}