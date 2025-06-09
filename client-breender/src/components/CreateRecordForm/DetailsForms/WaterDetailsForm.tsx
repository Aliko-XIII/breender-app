import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { WaterDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const WaterDetailsForm: React.FC<DetailFormProps<WaterDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<WaterDetailsDto>(initialDetails ?? { amountConsumed: 0, unit: '', notes: '' });

    useEffect(() => {
        const isValid = typeof details.amountConsumed === 'number' && details.amountConsumed > 0 && !!details.unit?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Amount Consumed', 'amountConsumed', details, setDetails, { isRequired: true, type: 'number', placeholder: 'e.g., 500' })}
            {renderTextField('Unit', 'unit', details, setDetails, { isRequired: true, placeholder: 'ml, liters, cups' })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
