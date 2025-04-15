import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BathingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BathingDetailsForm: React.FC<DetailFormProps<BathingDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<BathingDetailsDto>(initialDetails ?? { shampooType: '', notes: '' });

    useEffect(() => {
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

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
