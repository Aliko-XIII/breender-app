import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { GroomingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const GroomingDetailsForm: React.FC<DetailFormProps<GroomingDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<GroomingDetailsDto>(initialDetails ?? { service: '', groomerName: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.service?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Service', 'service', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Groomer Name (Optional)', 'groomerName', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
