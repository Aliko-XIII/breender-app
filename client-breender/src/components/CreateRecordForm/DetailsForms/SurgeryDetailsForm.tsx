// src/components/RecordDetailForms/SurgeryDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SurgeryDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SurgeryDetailsForm: React.FC<DetailFormProps<SurgeryDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<SurgeryDetailsDto>(initialDetails ?? { type: '', notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.type?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Surgery Type', 'type', details, setDetails, { isRequired: true })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};