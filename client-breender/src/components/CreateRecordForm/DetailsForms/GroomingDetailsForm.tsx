import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { GroomingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const GroomingDetailsForm: React.FC<DetailFormProps<GroomingDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<GroomingDetailsDto>({ service: '', groomerName: '', notes: '' });

    useEffect(() => {
        // service is required
        const isValid = !!details.service?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Service', 'service', details, setDetails, { isRequired: true })}
            {renderTextField('Groomer Name (Optional)', 'groomerName', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
