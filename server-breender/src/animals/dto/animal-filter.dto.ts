import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Sex } from '@prisma/client';

export class AnimalFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsDateString()
  birthdateFrom?: string;

  @IsOptional()
  @IsDateString()
  birthdateTo?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  radius?: number; // in kilometers
}
