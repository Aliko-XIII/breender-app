// src/components/RecordDetailForms/WeightDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { WeightDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const WeightDetailsForm: React.FC<DetailFormProps<WeightDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<WeightDetailsDto>({ weight: 0, unit: '' });

    useEffect(() => {
        const isValid = typeof details.weight === 'number' && details.weight > 0 && !!details.unit?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Weight', 'weight', details, setDetails, { isRequired: true, type: 'number', placeholder: 'e.g., 12.5' })}
            {renderTextField('Unit', 'unit', details, setDetails, { isRequired: true, placeholder: 'kg, lbs' })}
        </Form>
    );
};