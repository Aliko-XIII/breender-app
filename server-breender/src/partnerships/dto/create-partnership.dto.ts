import { IsUUID } from 'class-validator';

export class CreatePartnershipDto {
  @IsUUID()
  requesterAnimalId: string;

  @IsUUID()
  recipientAnimalId: string;
}
