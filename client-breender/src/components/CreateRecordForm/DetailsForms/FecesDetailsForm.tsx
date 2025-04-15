import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FecesDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const FecesDetailsForm: React.FC<DetailFormProps<FecesDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<FecesDetailsDto>({ consistency: '', color: '', abnormalities: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Consistency (Optional)', 'consistency', details, setDetails)}
            {renderTextField('Color (Optional)', 'color', details, setDetails)}
            {renderTextField('Abnormalities (Optional)', 'abnormalities', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
