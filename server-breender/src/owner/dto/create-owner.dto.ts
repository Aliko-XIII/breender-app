import { IsOptional, IsArray, IsEnum, IsObject, IsString } from 'class-validator';
import { OwnerTag } from '@prisma/client';

export class CreateOwnerDto {
    userId: string; // The ID of the user linked to this owner

    @IsOptional()
    @IsArray()
    @IsEnum(OwnerTag, { each: true })
    tags?: OwnerTag[]; // Optional: Array of tags for the owner

    @IsOptional()
    @IsObject()
    customData?: Record<string, any>; // Optional: Custom data for the owner

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    animalIds?: string[]; // Optional: Array of IDs for the animals owned by this owner
}
