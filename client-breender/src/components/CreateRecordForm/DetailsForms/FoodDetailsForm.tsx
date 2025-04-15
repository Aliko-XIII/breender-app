import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FoodDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const FoodDetailsForm: React.FC<DetailFormProps<FoodDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<FoodDetailsDto>(initialDetails ?? { type: '', amount: 0, unit: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.type?.trim() && typeof details.amount === 'number' && details.amount > 0 && !!details.unit?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Food Type', 'type', details, setDetails, { isRequired: true })}
            {renderTextField('Amount', 'amount', details, setDetails, { isRequired: true, type: 'number', placeholder: 'e.g., 200' })}
            {renderTextField('Unit', 'unit', details, setDetails, { isRequired: true, placeholder: 'grams, cups, cans' })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
