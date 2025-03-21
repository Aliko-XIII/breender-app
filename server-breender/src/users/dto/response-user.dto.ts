import { Role } from "@prisma/client";
import { ResponseUserProfieDto } from "./response-user-profile.dto";

export class ResponseUserDto {
  id: string;
  email: string;
  role: Role;
  profile?: ResponseUserProfieDto;
}