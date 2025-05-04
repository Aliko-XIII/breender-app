import {
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Sex } from '@prisma/client';

export class CreateAnimalDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;

  @IsEnum(Sex, { message: 'Invalid sex value' })
  sex: Sex;

  @IsString({ message: 'Breed must be a string' })
  @MinLength(2, { message: 'Breed must be at least 2 characters long' })
  @MaxLength(50, { message: 'Breed must not exceed 50 characters' })
  breed: string;

  @IsString({ message: 'Species must be a string' })
  @MinLength(2, { message: 'Species must be at least 2 characters long' })
  @MaxLength(50, { message: 'Species must not exceed 50 characters' })
  species: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsDateString()
  birthDate: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}
