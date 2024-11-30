import { IsUUID, IsNotEmpty } from 'class-validator';

export class ResponseUserDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
