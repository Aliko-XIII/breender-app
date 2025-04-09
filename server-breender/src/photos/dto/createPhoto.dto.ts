import { IsOptional, IsString, IsUUID } from "class-validator";

export class UploadPhotoDto{
    @IsUUID()
    animalId: string;

    @IsOptional()
    @IsString()
    url: string;
}