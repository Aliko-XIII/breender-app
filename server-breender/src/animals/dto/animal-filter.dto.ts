import { IsOptional, IsString, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
  @IsNumber({}, { message: 'latitude must be a number', })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'longitude must be a number', })
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'radius must be a number', })
  radius?: number; // in kilometers
}
