import { ReminderType } from "@prisma/client";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateReminderDto {
    @IsOptional()
    @IsEnum(ReminderType)
    reminderType?: ReminderType;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsDate()
    remindAt?: Date;
}