import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FecesDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const FecesDetailsForm: React.FC<DetailFormProps<FecesDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<FecesDetailsDto>(initialDetails ?? { consistency: '', color: '', abnormalities: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Consistency (Optional)', 'consistency', details, setDetails)}
            {renderTextField('Color (Optional)', 'color', details, setDetails)}
            {renderTextField('Abnormalities (Optional)', 'abnormalities', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
