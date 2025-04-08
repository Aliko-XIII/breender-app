import { ReminderType } from "@prisma/client";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateReminderDto {  
    @IsUUID()
    animalId: string;
    
    @IsEnum(ReminderType)
    reminderType: ReminderType;

    @IsOptional()
    @IsString()
    message: string;

    @IsDate()
    remindAt: Date;
}