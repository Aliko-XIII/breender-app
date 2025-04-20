import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { DiagnosisDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const DiagnosisDetailsForm: React.FC<DetailFormProps<DiagnosisDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<DiagnosisDetailsDto>(initialDetails ?? { condition: '', notes: '', vetName: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.condition?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Condition', 'condition', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};
