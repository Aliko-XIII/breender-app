import { IsString, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { Sex } from '@prisma/client';

export class CreateAnimalDto {
  @IsString()
  name: string;

  @IsEnum(Sex)
  sex: Sex;

  @IsString()
  breed: string;

  @IsString()
  species: string;

  @IsString()
  bio: string;

  @IsDateString()
  birthDate: Date;

  @IsUUID()
  ownerId: string;
}
