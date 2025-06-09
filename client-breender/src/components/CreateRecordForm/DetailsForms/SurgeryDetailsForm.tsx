// src/components/RecordDetailForms/SurgeryDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SurgeryDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SurgeryDetailsForm: React.FC<DetailFormProps<SurgeryDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<SurgeryDetailsDto>(initialDetails ?? { type: '', notes: '', vetName: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.type?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Surgery Type', 'type', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};