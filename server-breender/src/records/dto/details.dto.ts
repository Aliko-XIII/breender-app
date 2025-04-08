import { IsNumber, IsString, IsOptional, IsInt } from "class-validator";

// --- Vet Records ---

export class CheckupDetailsDto {
    @IsString()
    notes: string;

    @IsOptional()
    @IsString()
    vetName?: string;
}

export class SurgeryDetailsDto {
    @IsString()
    type: string; // e.g., "Neutering", "Tumor Removal"

    @IsString()
    notes: string;

    @IsOptional()
    @IsString()
    vetName?: string;
}

export class DiagnosisDetailsDto {
    @IsString()
    condition: string; // e.g., "Kennel Cough", "Arthritis"

    @IsString()
    notes: string;

    @IsOptional()
    @IsString()
    vetName?: string;
}

export class PrescriptionDetailsDto {
    @IsString()
    medicationName: string;

    @IsString()
    dosage: string; // e.g., "1 tablet", "5mg", "0.5ml"

    @IsString()
    frequency: string; // e.g., "Twice daily", "Every 8 hours"

    @IsOptional()
    @IsString()
    duration?: string; // e.g., "7 days", "Until finished"

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    vetName?: string;
}

// --- Procedures ---

export class MedicationDetailsDto {
    @IsString()
    medicationName: string;

    @IsString()
    dosage: string; // e.g., "1 tablet", "5mg", "0.5ml" - Amount administered

    @IsOptional()
    @IsString()
    notes?: string;
}

export class VaccinationDetailsDto {
    @IsString()
    vaccineName: string; // e.g., "Rabies", "DHPP"

    @IsOptional()
    @IsString()
    batchNumber?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    vetName?: string; // Often administered by a vet
}

export class DewormingDetailsDto {
    @IsString()
    productName: string;

    @IsOptional()
    @IsString()
    dosage?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class DefleaingDetailsDto {
    @IsString()
    productName: string; // e.g., "Frontline", "Advantage"

    @IsOptional()
    @IsString()
    applicationMethod?: string; // e.g., "Topical", "Oral"

    @IsOptional()
    @IsString()
    notes?: string;
}

export class BathingDetailsDto {
    @IsOptional()
    @IsString()
    shampooType?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class GroomingDetailsDto {
    @IsString()
    service: string; // e.g., "Full groom", "Brush out", "Haircut"

    @IsOptional()
    @IsString()
    groomerName?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class NailsDetailsDto {
    @IsOptional()
    @IsString()
    notes?: string; // e.g., "Trimmed", "Filed"
}

// --- Health ---

export class InjuryDetailsDto {
    @IsString()
    type: string; // e.g., "Cut", "Sprain", "Bite wound"

    @IsOptional()
    @IsString()
    location?: string; // e.g., "Left front paw", "Tail"

    @IsOptional()
    @IsString()
    severity?: string; // e.g., "Mild", "Moderate", "Severe"

    @IsString()
    notes: string;
}

export class TemperatureDetailsDto {
    @IsNumber()
    value: number;

    @IsOptional()
    @IsString()
    unit?: string; // e.g., "C", "F" - Default might be implied
}

export class IllnessDetailsDto {
    @IsString()
    symptoms: string; // Describe observed symptoms

    @IsOptional()
    @IsString()
    diagnosis?: string; // If known

    @IsString()
    notes: string;
}

export class BehaviorDetailsDto {
    @IsString()
    description: string; // e.g., "Excessive barking", "Lethargic", "Aggressive towards strangers"

    @IsOptional()
    @IsString()
    context?: string; // e.g., "When left alone", "During walks"

    @IsOptional()
    @IsString()
    notes?: string;
}

export class SleepingDetailsDto {
    @IsOptional()
    @IsNumber()
    durationHours?: number;

    @IsOptional()
    @IsString()
    quality?: string; // e.g., "Restful", "Restless", "Snoring"

    @IsString()
    notes: string; // e.g., "Slept in crate", "Woke up multiple times"
}

export class FecesDetailsDto {
    @IsOptional()
    @IsString()
    consistency?: string; // e.g., "Firm", "Soft", "Liquid"

    @IsOptional()
    @IsString()
    color?: string; // e.g., "Brown", "Black", "Yellow"

    @IsOptional()
    @IsString()
    abnormalities?: string; // e.g., "Mucus present", "Blood observed"

    @IsString()
    notes: string;
}

export class UrineDetailsDto {
    @IsOptional()
    @IsString()
    color?: string; // e.g., "Yellow", "Dark", "Clear"

    @IsOptional()
    @IsString()
    frequency?: string; // e.g., "Normal", "Increased", "Decreased"

    @IsOptional()
    @IsString()
    abnormalities?: string; // e.g., "Straining", "Blood observed"

    @IsString()
    notes: string;
}

export class VomitDetailsDto {
    @IsOptional()
    @IsString()
    contentDescription?: string; // e.g., "Bile", "Undigested food", "Foam"

    @IsOptional()
    @IsString()
    frequency?: string; // e.g., "Once", "Multiple times"

    @IsString()
    notes: string;
}

export class WeightDetailsDto {
    @IsNumber()
    weight: number;

    @IsString()
    unit: string; // e.g., "kg", "lbs"
}

// --- Nutrition ---

export class FoodDetailsDto {
    @IsString()
    type: string; // e.g., "Kibble", "Wet food", "Brand Name"

    @IsNumber()
    amount: number;

    @IsString()
    unit: string; // e.g., "grams", "cups", "cans"

    @IsOptional()
    @IsString()
    notes?: string; // e.g., "Ate eagerly", "Left some food"
}

export class WaterDetailsDto {
    @IsNumber()
    amountConsumed: number;

    @IsString()
    unit: string; // e.g., "ml", "liters", "cups"

    @IsOptional()
    @IsString()
    notes?: string; // e.g., "Drank normally", "Seems thirstier"
}

// --- Breeding ---

export class HeatDetailsDto {
    @IsOptional()
    @IsString()
    stage?: string; // e.g., "Proestrus", "Estrus", "Diestrus", "Anestrus" or "Showing signs", "Peak", "Ending"

    @IsString()
    observations: string; // e.g., "Swelling observed", "Behavioral changes", "Discharge noted"
}

export class MatingDetailsDto {
    @IsOptional()
    @IsString()
    partnerDetails?: string; // Name or identifier of the mate

    @IsOptional()
    @IsString()
    partnerId?: string;

    @IsString()
    outcome: string; // e.g., "Successful tie", "Attempted", "Observed interest"

    @IsOptional()
    @IsString()
    notes?: string;
}

export class PregnancyDetailsDto {
    @IsOptional()
    @IsString()
    confirmationMethod?: string; // e.g., "Ultrasound", "Blood test", "Palpation"

    @IsOptional()
    // Consider using IsDateString if you want strict date format validation
    // @IsDateString()
    @IsString()
    estimatedDueDate?: string;

    @IsString()
    notes: string; // e.g., "Monitoring weight gain", "Nesting behavior observed"
}

export class BirthDetailsDto {
    @IsInt()
    @IsNumber()
    offspringCount: number;

    @IsOptional()
    @IsInt()
    @IsNumber()
    liveOffspringCount?: number;

    @IsOptional()
    @IsString()
    complications?: string;

    @IsString()
    notes: string;
}

export class EstrousDetailsDto { // Often synonymous with Heat, providing an alternative structure if needed
    @IsString()
    stage: string; // e.g., "Follicular", "Luteal" or specific cycle day range

    @IsString()
    observations: string; // e.g., "Behavioral signs", "Physical signs"

    @IsOptional()
    @IsString()
    notes?: string;
}

export class SellingDetailsDto {
    @IsOptional()
    @IsString()
    buyerName?: string;

    @IsOptional()
    @IsString()
    buyerContact?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    currency?: string; // e.g., "USD", "EUR"

    @IsString()
    notes: string; // e.g., "Contract signed", "Deposit received"
}

export class BuyingDetailsDto {
    @IsOptional()
    @IsString()
    sellerName?: string;

    @IsOptional()
    @IsString()
    sellerContact?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    currency?: string; // e.g., "USD", "EUR"

    @IsString()
    notes: string; // e.g., "Health checked", "Registration papers received"
}

// --- Additional ---

export class NotesDetailsDto {
    @IsString()
    text: string; // The actual note content
}

export class OtherDetailsDto {
    @IsOptional()
    @IsString()
    details?: string;
}