import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  isSterilized?: any;

  @IsOptional()
  isAvailable?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
