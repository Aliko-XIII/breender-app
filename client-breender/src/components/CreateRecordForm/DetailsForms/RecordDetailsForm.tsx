// src/components/RecordDetailForms/RecordDetailsForm.tsx
import React, { useEffect } from 'react'; // Import useEffect
import { AnimalRecordType, AnyAnimalRecordDetails } from '../../../types'; // Adjust path

// Import only the components that are actually used in the switch statement
import { CheckupDetailsForm } from './CheckupDetailsForm';
import { SurgeryDetailsForm } from './SurgeryDetailsForm';
import { WeightDetailsForm } from './WeightDetailsForm';
import { DiagnosisDetailsForm } from './DiagnosisDetailsForm';
import { PrescriptionDetailsForm } from './PrescriptionDetailsForm';
import { MedicationDetailsForm } from './MedicationDetailsForm';
import { VaccinationDetailsForm } from './VaccinationDetailsForm';
import { DewormingDetailsForm } from './DewormingDetailsForm';
import { DefleaingDetailsForm } from './DefleaingDetailsForm';
import { BathingDetailsForm } from './BathingDetailsForm';
import { GroomingDetailsForm } from './GroomingDetailsForm';
import { NailsDetailsForm } from './NailsDetailsForm';
import { InjuryDetailsForm } from './InjuryDetailsForm';
import { TemperatureDetailsForm } from './TemperatureDetailsForm';
import { IllnessDetailsForm } from './IllnessDetailsForm';
import { BehaviorDetailsForm } from './BehaviorDetailsForm';
import { SleepingDetailsForm } from './SleepingDetailsForm';
import { FecesDetailsForm } from './FecesDetailsForm';
import { UrineDetailsForm } from './UrineDetailsForm';
import { VomitDetailsForm } from './VomitDetailsForm';
import { FoodDetailsForm } from './FoodDetailsForm';
import { WaterDetailsForm } from './WaterDetailsForm';
import { HeatDetailsForm } from './HeatDetailsForm';
import { MatingDetailsForm } from './MatingDetailsForm';
import { PregnancyDetailsForm } from './PregnancyDetailsForm';
import { BirthDetailsForm } from './BirthDetailsForm';
import { EstrousDetailsForm } from './EstrousDetailsForm';
import { SellingDetailsForm } from './SellingDetailsForm';
import { BuyingDetailsForm } from './BuyingDetailsForm';
import { NotesDetailsForm } from './NotesDetailsForm';
import { OtherDetailsForm } from './OtherDetailsForm';

interface RecordDetailsFormProps {
    recordType: AnimalRecordType | "";
    onChange: (details: AnyAnimalRecordDetails | null) => void;
    onValidityChange: (isValid: boolean) => void;
    initialDetails?: AnyAnimalRecordDetails | null;
    filterMode?: boolean; // NEW: disables required validation in detail forms
}

// Helper function to check if a component is implemented for a type
// **** IMPORTANT: Update this function whenever you add/remove/comment/uncomment a case in the switch statement below ****
const hasDetailsComponent = (type: AnimalRecordType | ""): boolean => {
    switch (type) {
        // List ONLY the types that have an UNCOMMENTED 'case' in the switch below
        case AnimalRecordType.CHECKUP:
        case AnimalRecordType.SURGERY:
        case AnimalRecordType.WEIGHT:
        case AnimalRecordType.DIAGNOSIS:
        case AnimalRecordType.PRESCRIPTION:
        case AnimalRecordType.MEDICATION:
        case AnimalRecordType.VACCINATION:
        case AnimalRecordType.DEWORMING:
        case AnimalRecordType.DEFLEAING:
        case AnimalRecordType.BATHING:
        case AnimalRecordType.GROOMING:
        case AnimalRecordType.NAILS:
        case AnimalRecordType.INJURY:
        case AnimalRecordType.TEMPERATURE:
        case AnimalRecordType.ILLNESS:
        case AnimalRecordType.BEHAVIOR:
        case AnimalRecordType.SLEEPING:
        case AnimalRecordType.FECES:
        case AnimalRecordType.URINE:
        case AnimalRecordType.VOMIT:
        case AnimalRecordType.FOOD:
        case AnimalRecordType.WATER:
        case AnimalRecordType.HEAT:
        case AnimalRecordType.MATING:
        case AnimalRecordType.PREGNANCY:
        case AnimalRecordType.BIRTH:
        case AnimalRecordType.ESTROUS:
        case AnimalRecordType.SELLING:
        case AnimalRecordType.BUYING:
        case AnimalRecordType.NOTES:
        case AnimalRecordType.OTHER:
            return true;
        default:
            // Types not listed above, or empty string, don't have a specific component handled
            return false;
    }
};

export const RecordDetailsForm: React.FC<RecordDetailsFormProps> = ({
    recordType,
    onChange,
    onValidityChange,
    initialDetails,
    filterMode,
}) => {

    // Effect to handle validity when recordType changes, especially for types without forms
    useEffect(() => {
        if (!hasDetailsComponent(recordType)) {
            // If no specific component is configured for this type,
            // consider the details part "valid" (as none are required) and data as null.
            onValidityChange(true);
            onChange(null);
        }
        // If a component *is* configured (hasDetailsComponent is true),
        // the validity will be managed by that specific component's useEffect.
        // The parent form sets validity to false on type change initially,
        // and the child component will update it shortly after rendering.
    }, [recordType, onChange, onValidityChange]); // Rerun when type changes

    // --- Render Logic ---

    if (!recordType) {
         // No type selected - Render placeholder. Validity is handled by parent's initial state
         // or the useEffect above if the initial state was empty recordType.
        return <div className="text-muted border p-3 rounded bg-dark">Please select a record type.</div>;
    }

    // Check if a component is configured *before* the switch
    if (!hasDetailsComponent(recordType)) {
         // No component implemented/configured for this type - Render info message.
         // Validity is already set to true by the useEffect above.
         return <div className="text-muted border p-3 rounded bg-dark">No specific details required or configured for this record type.</div>;
    }

    // --- Component is configured, render the specific form ---
    switch (recordType) {
        case AnimalRecordType.CHECKUP:
            return <CheckupDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').CheckupDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.SURGERY:
            return <SurgeryDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').SurgeryDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.WEIGHT:
            return <WeightDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').WeightDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.DIAGNOSIS:
            return <DiagnosisDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').DiagnosisDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.PRESCRIPTION:
            return <PrescriptionDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').PrescriptionDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.MEDICATION:
            return <MedicationDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').MedicationDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.VACCINATION:
            return <VaccinationDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').VaccinationDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.DEWORMING:
            return <DewormingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').DewormingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.DEFLEAING:
            return <DefleaingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').DefleaingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.BATHING:
            return <BathingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').BathingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.GROOMING:
            return <GroomingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').GroomingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.NAILS:
            return <NailsDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').NailsDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.INJURY:
            return <InjuryDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').InjuryDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.TEMPERATURE:
            return <TemperatureDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').TemperatureDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.ILLNESS:
            return <IllnessDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').IllnessDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.BEHAVIOR:
            return <BehaviorDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').BehaviorDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.SLEEPING:
            return <SleepingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').SleepingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.FECES:
            return <FecesDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').FecesDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.URINE:
            return <UrineDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').UrineDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.VOMIT:
            return <VomitDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').VomitDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.FOOD:
            return <FoodDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').FoodDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.WATER:
            return <WaterDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').WaterDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.HEAT:
            return <HeatDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').HeatDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.MATING:
            return <MatingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').MatingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.PREGNANCY:
            return <PregnancyDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').PregnancyDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.BIRTH:
            return <BirthDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').BirthDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.ESTROUS:
            return <EstrousDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').EstrousDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.SELLING:
            return <SellingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').SellingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.BUYING:
            return <BuyingDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').BuyingDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.NOTES:
            return <NotesDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').NotesDetailsDto | undefined} filterMode={filterMode} />;
        case AnimalRecordType.OTHER:
            return <OtherDetailsForm onChange={onChange} onValidityChange={onValidityChange} initialDetails={initialDetails as import('../../../types').OtherDetailsDto | undefined} filterMode={filterMode} />;
        default:
            // This case should ideally not be reached if hasDetailsComponent is correct.
            // It implies hasDetailsComponent returned true, but the case is missing/commented here.
            // Since details were expected, signal invalid state.
            console.error("Inconsistency: hasDetailsComponent returned true, but no matching case found for:", recordType);
             // Set validity to false because an expected component is missing
             onValidityChange(false);
             onChange(null);
            return <div className="text-danger border p-3 rounded bg-dark">Error: Details form component is missing or not configured correctly.</div>;
    }
};