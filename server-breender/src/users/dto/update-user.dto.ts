import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  @MaxLength(30, { message: 'Password must not exceed 30 characters' })
  pass?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Picture URL is not valid' })
  pictureUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
