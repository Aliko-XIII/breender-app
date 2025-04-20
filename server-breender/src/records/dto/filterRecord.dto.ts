import { IsOptional, IsString, IsEnum, IsDateString, IsObject } from 'class-validator';
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

    @IsOptional()
    @IsObject()
    details?: Record<string, any>;
}