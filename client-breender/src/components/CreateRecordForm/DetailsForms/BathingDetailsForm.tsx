import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BathingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BathingDetailsForm: React.FC<DetailFormProps<BathingDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<BathingDetailsDto>(initialDetails ?? { shampooType: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Shampoo Type (Optional)', 'shampooType', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
