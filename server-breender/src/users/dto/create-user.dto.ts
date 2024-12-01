import { IsStrongPassword, IsEmail, MaxLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

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
  pass: string;

  @IsEnum(Role)
  role?: Role
}
