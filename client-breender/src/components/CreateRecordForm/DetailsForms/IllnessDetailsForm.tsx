import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { IllnessDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const IllnessDetailsForm: React.FC<DetailFormProps<IllnessDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<IllnessDetailsDto>(initialDetails ?? { symptoms: '', diagnosis: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.symptoms?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Symptoms', 'symptoms', details, setDetails, { isRequired: !filterMode, placeholder: 'Describe symptoms' })}
            {renderTextField('Diagnosis (Optional)', 'diagnosis', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
