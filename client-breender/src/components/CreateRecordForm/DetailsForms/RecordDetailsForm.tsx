// src/components/RecordDetailForms/RecordDetailsForm.tsx
import React from 'react';
import { AnimalRecordType, AnyAnimalRecordDetails } from '../../../types'; // Adjust path

// Import all your specific detail form components
import { CheckupDetailsForm } from './CheckupDetailsForm';
import { SurgeryDetailsForm } from './SurgeryDetailsForm';
// import { DiagnosisDetailsForm } from './DiagnosisDetailsForm';
// import { PrescriptionDetailsForm } from './PrescriptionDetailsForm';
// import { MedicationDetailsForm } from './MedicationDetailsForm';
// import { VaccinationDetailsForm } from './VaccinationDetailsForm';
// import { DewormingDetailsForm } from './DewormingDetailsForm';
// import { DefleaingDetailsForm } from './DefleaingDetailsForm';
// import { BathingDetailsForm } from './BathingDetailsForm';
// import { GroomingDetailsForm } from './GroomingDetailsForm';
// import { NailsDetailsForm } from './NailsDetailsForm';
// import { InjuryDetailsForm } from './InjuryDetailsForm';
// import { TemperatureDetailsForm } from './TemperatureDetailsForm';
// import { IllnessDetailsForm } from './IllnessDetailsForm';
// import { BehaviorDetailsForm } from './BehaviorDetailsForm';
// import { SleepingDetailsForm } from './SleepingDetailsForm';
// import { FecesDetailsForm } from './FecesDetailsForm';
// import { UrineDetailsForm } from './UrineDetailsForm';
// import { VomitDetailsForm } from './VomitDetailsForm';
import { WeightDetailsForm } from './WeightDetailsForm';
// import { FoodDetailsForm } from './FoodDetailsForm';
// import { WaterDetailsForm } from './WaterDetailsForm';
// import { HeatDetailsForm } from './HeatDetailsForm';
// import { MatingDetailsForm } from './MatingDetailsForm';
// import { PregnancyDetailsForm } from './PregnancyDetailsForm';
// import { BirthDetailsForm } from './BirthDetailsForm';
// import { EstrousDetailsForm } from './EstrousDetailsForm';
// import { SellingDetailsForm } from './SellingDetailsForm';
// import { BuyingDetailsForm } from './BuyingDetailsForm';
// import { NotesDetailsForm } from './NotesDetailsForm';
// import { OtherDetailsForm } from './OtherDetailsForm';
// ... import all other detail forms

interface RecordDetailsFormProps {
    recordType: AnimalRecordType | "";
    onChange: (details: AnyAnimalRecordDetails | null) => void;
    onValidityChange: (isValid: boolean) => void;
}

export const RecordDetailsForm: React.FC<RecordDetailsFormProps> = ({
    recordType,
    onChange,
    onValidityChange,
}) => {
    if (!recordType) {
        return <div className="text-muted border p-3 rounded bg-light">Please select a record type to fill in details.</div>;
    }

    // Pass down the callbacks to the specific form
    const props = { onChange, onValidityChange };

    // Render the correct form based on type
    // Ensure the keys match your AnimalRecordType enum values exactly
    switch (recordType) {
        case AnimalRecordType.CHECKUP:
            return <CheckupDetailsForm {...props} />;
        case AnimalRecordType.SURGERY:
            return <SurgeryDetailsForm {...props} />;
        // case AnimalRecordType.DIAGNOSIS:
        //      return <DiagnosisDetailsForm {...props} />;
        // case AnimalRecordType.Prescription:
        //      return <PrescriptionDetailsForm {...props} />;
        // case AnimalRecordType.Medication:
        //      return <MedicationDetailsForm {...props} />;
        // case AnimalRecordType.Vaccination:
        //      return <VaccinationDetailsForm {...props} />;
        // case AnimalRecordType.Deworming:
        //      return <DewormingDetailsForm {...props} />;
        // case AnimalRecordType.Defleaing:
        //      return <DefleaingDetailsForm {...props} />;
        // case AnimalRecordType.Bathing:
        //      return <BathingDetailsForm {...props} />;
        // case AnimalRecordType.Grooming:
        //      return <GroomingDetailsForm {...props} />;
        // case AnimalRecordType.Nails:
        //      return <NailsDetailsForm {...props} />;
        // case AnimalRecordType.Injury:
        //      return <InjuryDetailsForm {...props} />;
        // case AnimalRecordType.Temperature:
        //      return <TemperatureDetailsForm {...props} />;
        // case AnimalRecordType.Illness:
        //      return <IllnessDetailsForm {...props} />;
        // case AnimalRecordType.Behavior:
        //      return <BehaviorDetailsForm {...props} />;
        // case AnimalRecordType.Sleeping:
        //      return <SleepingDetailsForm {...props} />;
        // case AnimalRecordType.Feces:
        //      return <FecesDetailsForm {...props} />;
        // case AnimalRecordType.Urine:
        //      return <UrineDetailsForm {...props} />;
        // case AnimalRecordType.Vomit:
        //      return <VomitDetailsForm {...props} />;
        case AnimalRecordType.WEIGHT:
            return <WeightDetailsForm {...props} />;
        // case AnimalRecordType.Food:
        //      return <FoodDetailsForm {...props} />;
        // case AnimalRecordType.Water:
        //      return <WaterDetailsForm {...props} />;
        // case AnimalRecordType.Heat:
        //      return <HeatDetailsForm {...props} />;
        // case AnimalRecordType.Mating:
        //      return <MatingDetailsForm {...props} />;
        // case AnimalRecordType.Pregnancy:
        //      return <PregnancyDetailsForm {...props} />;
        // case AnimalRecordType.Birth:
        //      return <BirthDetailsForm {...props} />;
        // case AnimalRecordType.Estrous:
        //      return <EstrousDetailsForm {...props} />;
        // case AnimalRecordType.Selling:
        //      return <SellingDetailsForm {...props} />;
        // case AnimalRecordType.Buying:
        //      return <BuyingDetailsForm {...props} />;
        // case AnimalRecordType.Notes:
        //      return <NotesDetailsForm {...props} />;
        // case AnimalRecordType.Other:
        //      return <OtherDetailsForm {...props} />;
        // Add cases for all other record types...

        default:
            console.warn("Unhandled record type:", recordType);
            return <div className="text-danger border p-3 rounded bg-light">Error: Unknown record type details form.</div>;
    }
};