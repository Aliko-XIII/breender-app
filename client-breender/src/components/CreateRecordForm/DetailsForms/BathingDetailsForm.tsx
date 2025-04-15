import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BathingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BathingDetailsForm: React.FC<DetailFormProps<BathingDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<BathingDetailsDto>({ shampooType: '', notes: '' });

    useEffect(() => {
        // Both fields optional, always valid
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Shampoo Type (Optional)', 'shampooType', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
