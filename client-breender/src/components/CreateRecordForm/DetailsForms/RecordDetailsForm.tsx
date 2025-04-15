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
        return <div className="text-muted border p-3 rounded bg-light">Please select a record type.</div>;
    }

    // Check if a component is configured *before* the switch
    if (!hasDetailsComponent(recordType)) {
         // No component implemented/configured for this type - Render info message.
         // Validity is already set to true by the useEffect above.
         return <div className="text-muted border p-3 rounded bg-light">No specific details required or configured for this record type.</div>;
    }

    // --- Component is configured, render the specific form ---
    const props = { onChange, onValidityChange };

    // Render the correct form based on type
    // Ensure the keys match your AnimalRecordType enum values exactly
    switch (recordType) {
        // --- Cases for implemented components (must match hasDetailsComponent function) ---
        case AnimalRecordType.CHECKUP:
            return <CheckupDetailsForm {...props} />;
        case AnimalRecordType.SURGERY:
            return <SurgeryDetailsForm {...props} />;
        case AnimalRecordType.WEIGHT:
            return <WeightDetailsForm {...props} />;
        case AnimalRecordType.DIAGNOSIS:
            return <DiagnosisDetailsForm {...props} />;
        case AnimalRecordType.PRESCRIPTION:
            return <PrescriptionDetailsForm {...props} />;
        case AnimalRecordType.MEDICATION:
            return <MedicationDetailsForm {...props} />;
        case AnimalRecordType.VACCINATION:
            return <VaccinationDetailsForm {...props} />;
        case AnimalRecordType.DEWORMING:
            return <DewormingDetailsForm {...props} />;
        case AnimalRecordType.DEFLEAING:
            return <DefleaingDetailsForm {...props} />;
        case AnimalRecordType.BATHING:
            return <BathingDetailsForm {...props} />;
        case AnimalRecordType.GROOMING:
            return <GroomingDetailsForm {...props} />;
        case AnimalRecordType.NAILS:
            return <NailsDetailsForm {...props} />;
        case AnimalRecordType.INJURY:
            return <InjuryDetailsForm {...props} />;
        case AnimalRecordType.TEMPERATURE:
            return <TemperatureDetailsForm {...props} />;
        case AnimalRecordType.ILLNESS:
            return <IllnessDetailsForm {...props} />;
        case AnimalRecordType.BEHAVIOR:
            return <BehaviorDetailsForm {...props} />;
        case AnimalRecordType.SLEEPING:
            return <SleepingDetailsForm {...props} />;
        case AnimalRecordType.FECES:
            return <FecesDetailsForm {...props} />;
        case AnimalRecordType.URINE:
            return <UrineDetailsForm {...props} />;
        case AnimalRecordType.VOMIT:
            return <VomitDetailsForm {...props} />;
        case AnimalRecordType.FOOD:
            return <FoodDetailsForm {...props} />;
        case AnimalRecordType.WATER:
            return <WaterDetailsForm {...props} />;
        case AnimalRecordType.HEAT:
            return <HeatDetailsForm {...props} />;
        case AnimalRecordType.MATING:
            return <MatingDetailsForm {...props} />;
        case AnimalRecordType.PREGNANCY:
            return <PregnancyDetailsForm {...props} />;
        case AnimalRecordType.BIRTH:
            return <BirthDetailsForm {...props} />;
        case AnimalRecordType.ESTROUS:
            return <EstrousDetailsForm {...props} />;
        case AnimalRecordType.SELLING:
            return <SellingDetailsForm {...props} />;
        case AnimalRecordType.BUYING:
            return <BuyingDetailsForm {...props} />;
        case AnimalRecordType.NOTES:
            return <NotesDetailsForm {...props} />;
        case AnimalRecordType.OTHER:
            return <OtherDetailsForm {...props} />;

        default:
            // This case should ideally not be reached if hasDetailsComponent is correct.
            // It implies hasDetailsComponent returned true, but the case is missing/commented here.
            // Since details were expected, signal invalid state.
            console.error("Inconsistency: hasDetailsComponent returned true, but no matching case found for:", recordType);
             // Set validity to false because an expected component is missing
             onValidityChange(false);
             onChange(null);
            return <div className="text-danger border p-3 rounded bg-light">Error: Details form component is missing or not configured correctly.</div>;
    }
};