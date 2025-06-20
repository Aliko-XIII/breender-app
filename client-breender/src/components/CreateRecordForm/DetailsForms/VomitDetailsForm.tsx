import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { VomitDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const VomitDetailsForm: React.FC<DetailFormProps<VomitDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<VomitDetailsDto>(initialDetails ?? { contentDescription: '', frequency: '', notes: '' });

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
            {renderTextField('Content Description (Optional)', 'contentDescription', details, setDetails)}
            {renderTextField('Frequency (Optional)', 'frequency', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
