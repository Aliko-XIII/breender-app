import { IsNumber, IsString, IsOptional } from "class-validator";

export class TemperatureDetailsDto {
    @IsNumber()
    value: number;

    @IsOptional()
    @IsString()
    unit?: string;
}

export class WeightDetailsDto {
    @IsNumber()
    weight: number;

    @IsString()
    unit: string;
}

export class CheckupDetailsDto {
    @IsString()
    notes: string;

    @IsOptional()
    @IsString()
    vetName?: string;
}
