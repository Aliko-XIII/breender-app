import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FoodDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const FoodDetailsForm: React.FC<DetailFormProps<FoodDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<FoodDetailsDto>(initialDetails ?? { type: '', amount: 0, unit: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v !== undefined && v !== null && v !== '' && v !== 0);
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.type?.trim() && typeof details.amount === 'number' && details.amount > 0 && !!details.unit?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Food Type', 'type', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Amount', 'amount', details, setDetails, { isRequired: !filterMode, type: 'number', placeholder: 'e.g., 200' })}
            {renderTextField('Unit', 'unit', details, setDetails, { isRequired: !filterMode, placeholder: 'grams, cups, cans' })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
