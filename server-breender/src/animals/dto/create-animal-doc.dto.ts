import { IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';

export class CreateAnimalDocumentDto {
  @IsUUID()
  animalId: string; // ID of the associated animal

  @IsOptional()
  @IsString()
  documentName?: string; // Optional document name

  @IsUrl()
  documentUrl: string; // URL of the document

  @IsOptional()
  @IsString()
  uploadedAt?: Date; // Optional upload date, will default to current time if not provided
}
