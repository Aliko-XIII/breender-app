import { AnimalRecordType } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateRecordDto{
    @IsUUID()
    animalId: string;
    
    @IsEnum(AnimalRecordType)
    recordType: AnimalRecordType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    details: any;
}