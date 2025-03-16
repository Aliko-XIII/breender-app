import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class UpdateAnimalDocumentDto {
  @IsUUID()
  @IsOptional()
  animalId?: string; // Optionally update the associated animal ID

  @IsOptional()
  @IsString()
  documentName?: string; // Optionally update the document name

  @IsUrl()
  @IsOptional()
  documentUrl?: string; // Optionally update the document URL

  @IsOptional()
  uploadedAt?: Date; // Optionally update the upload date
}
