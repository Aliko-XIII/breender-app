// --- Vet Records ---

export interface CheckupDetailsDto {
    notes: string;
    vetName?: string;
}

export interface SurgeryDetailsDto {
    type: string; // e.g., "Neutering", "Tumor Removal"
    notes: string;
    vetName?: string;
}

export interface DiagnosisDetailsDto {
    condition: string; // e.g., "Kennel Cough", "Arthritis"
    notes: string;
    vetName?: string;
}

export interface PrescriptionDetailsDto {
    medicationName: string;
    dosage: string; // e.g., "1 tablet", "5mg", "0.5ml"
    frequency: string; // e.g., "Twice daily", "Every 8 hours"
    duration?: string; // e.g., "7 days", "Until finished"
    notes?: string;
    vetName?: string;
}

// --- Procedures ---

export interface MedicationDetailsDto {
    medicationName: string;
    dosage: string; // e.g., "1 tablet", "5mg", "0.5ml" - Amount administered
    notes?: string;
}

export interface VaccinationDetailsDto {
    vaccineName: string; // e.g., "Rabies", "DHPP"
    batchNumber?: string;
    notes?: string;
    vetName?: string; // Often administered by a vet
}

export interface DewormingDetailsDto {
    productName: string;
    dosage?: string;
    notes?: string;
}

export interface DefleaingDetailsDto {
    productName: string; // e.g., "Frontline", "Advantage"
    applicationMethod?: string; // e.g., "Topical", "Oral"
    notes?: string;
}

export interface BathingDetailsDto {
    shampooType?: string;
    notes?: string;
}

export interface GroomingDetailsDto {
    service: string; // e.g., "Full groom", "Brush out", "Haircut"
    groomerName?: string;
    notes?: string;
}

export interface NailsDetailsDto {
    notes?: string; // e.g., "Trimmed", "Filed"
}

// --- Health ---

export interface InjuryDetailsDto {
    type: string; // e.g., "Cut", "Sprain", "Bite wound"
    location?: string; // e.g., "Left front paw", "Tail"
    severity?: string; // e.g., "Mild", "Moderate", "Severe"
    notes: string;
}

export interface TemperatureDetailsDto {
    value: number;
    unit?: string; // e.g., "C", "F" - Default might be implied
}

export interface IllnessDetailsDto {
    symptoms: string; // Describe observed symptoms
    diagnosis?: string; // If known
    notes: string;
}

export interface BehaviorDetailsDto {
    description: string; // e.g., "Excessive barking", "Lethargic", "Aggressive towards strangers"
    context?: string; // e.g., "When left alone", "During walks"
    notes?: string;
}

export interface SleepingDetailsDto {
    durationHours?: number;
    quality?: string; // e.g., "Restful", "Restless", "Snoring"

    
    notes: string; // e.g., "Slept in crate", "Woke up multiple times"
}

export interface FecesDetailsDto {
    
    
    consistency?: string; // e.g., "Firm", "Soft", "Liquid"

    
    
    color?: string; // e.g., "Brown", "Black", "Yellow"

    
    
    abnormalities?: string; // e.g., "Mucus present", "Blood observed"

    
    notes: string;
}

export interface UrineDetailsDto {
    
    
    color?: string; // e.g., "Yellow", "Dark", "Clear"

    
    
    frequency?: string; // e.g., "Normal", "Increased", "Decreased"

    
    
    abnormalities?: string; // e.g., "Straining", "Blood observed"

    
    notes: string;
}

export interface VomitDetailsDto {
    
    
    contentDescription?: string; // e.g., "Bile", "Undigested food", "Foam"

    
    
    frequency?: string; // e.g., "Once", "Multiple times"

    
    notes: string;
}

export interface WeightDetailsDto {
    
    weight: number;

    
    unit: string; // e.g., "kg", "lbs"
}

// --- Nutrition ---

export interface FoodDetailsDto {
    
    type: string; // e.g., "Kibble", "Wet food", "Brand Name"

    
    amount: number;

    
    unit: string; // e.g., "grams", "cups", "cans"

    
    
    notes?: string; // e.g., "Ate eagerly", "Left some food"
}

export interface WaterDetailsDto {
    
    amountConsumed: number;

    
    unit: string; // e.g., "ml", "liters", "cups"

    
    
    notes?: string; // e.g., "Drank normally", "Seems thirstier"
}

// --- Breeding ---

export interface HeatDetailsDto {
    
    
    stage?: string; // e.g., "Proestrus", "Estrus", "Diestrus", "Anestrus" or "Showing signs", "Peak", "Ending"

    
    observations: string; // e.g., "Swelling observed", "Behavioral changes", "Discharge noted"
}

export interface MatingDetailsDto {
    
    
    partnerDetails?: string; // Name or identifier of the mate

    
    
    partnerId?: string;

    
    outcome: string; // e.g., "Successful tie", "Attempted", "Observed interest"

    
    
    notes?: string;
}

export interface PregnancyDetailsDto {
    
    
    confirmationMethod?: string; // e.g., "Ultrasound", "Blood test", "Palpation"

    
    // Consider using IsDateString if you want strict date format validation
    // @IsDateString()
    
    estimatedDueDate?: string;

    
    notes: string; // e.g., "Monitoring weight gain", "Nesting behavior observed"
}

export interface BirthDetailsDto {
    offspringCount: number;
    liveOffspringCount?: number;
    complications?: string;
    notes: string;
}

export interface EstrousDetailsDto { // Often synonymous with Heat, providing an alternative structure if needed
    stage: string; // e.g., "Follicular", "Luteal" or specific cycle day range
    observations: string; // e.g., "Behavioral signs", "Physical signs"
    notes?: string;
}

export interface SellingDetailsDto {
    buyerName?: string;
    buyerContact?: string;
    price?: number;
    currency?: string; // e.g., "USD", "EUR"
    notes: string; // e.g., "Contract signed", "Deposit received"
}

export interface BuyingDetailsDto {
    
    
    sellerName?: string;

    
    
    sellerContact?: string;

    
    
    price?: number;

    
    
    currency?: string; // e.g., "USD", "EUR"

    
    notes: string; // e.g., "Health checked", "Registration papers received"
}

// --- Additional ---

export interface NotesDetailsDto {
    
    text: string; // The actual note content
}

export interface OtherDetailsDto {
    
    
    details?: string;
}