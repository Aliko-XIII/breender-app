import { AnimalRecordType } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
export class UpdateRecordDto{
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    details?: any;
}