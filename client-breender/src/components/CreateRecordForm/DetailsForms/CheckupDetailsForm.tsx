// src/components/RecordDetailForms/CheckupDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { CheckupDetailsDto } from '../../../types'; // Adjust path as needed
import { DetailFormProps, renderTextField } from './common'; // Adjust path

export interface DetailFormProps<T> {
    onChange: (details: T | null) => void;
    onValidityChange: (isValid: boolean) => void;
    initialDetails?: T;
    filterMode?: boolean; // NEW: disables required validation
}

export const CheckupDetailsForm: React.FC<DetailFormProps<CheckupDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<CheckupDetailsDto>(initialDetails ?? { notes: '', vetName: '' });

    useEffect(() => {
        // In filterMode, always valid and allow any value (including empty)
        if (filterMode) {
            onValidityChange(true);
            // Only send details if at least one field is non-empty
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.notes?.trim(); // notes is required
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};