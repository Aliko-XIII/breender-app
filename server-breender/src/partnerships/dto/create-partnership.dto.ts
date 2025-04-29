import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PartnershipStatus } from '@prisma/client';

export class CreatePartnershipDto {
  @IsUUID()
  requesterAnimalId: string;

  @IsUUID()
  recipientAnimalId: string;

  @IsEnum(PartnershipStatus)
  @IsOptional()
  status?: PartnershipStatus;

  @IsDateString()
  @IsOptional()
  requestedAt?: Date;

  @IsDateString()
  @IsOptional()
  respondedAt?: Date;
}
