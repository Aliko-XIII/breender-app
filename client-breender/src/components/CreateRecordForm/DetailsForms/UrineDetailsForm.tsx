import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { UrineDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const UrineDetailsForm: React.FC<DetailFormProps<UrineDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<UrineDetailsDto>(initialDetails ?? { color: '', frequency: '', abnormalities: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Color (Optional)', 'color', details, setDetails)}
            {renderTextField('Frequency (Optional)', 'frequency', details, setDetails)}
            {renderTextField('Abnormalities (Optional)', 'abnormalities', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
