import { IsOptional, IsString, IsUUID } from "class-validator";

export class UploadDocumentDto{
    @IsUUID()
    animalId: string;

    @IsOptional()
    @IsString()
    documentName?: string;

    @IsOptional()
    @IsString()
    url?: string;
}