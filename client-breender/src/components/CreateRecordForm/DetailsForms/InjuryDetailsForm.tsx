import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { InjuryDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const InjuryDetailsForm: React.FC<DetailFormProps<InjuryDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<InjuryDetailsDto>({ type: '', location: '', severity: '', notes: '' });

    useEffect(() => {
        // type and notes are required
        const isValid = !!details.type?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Injury Type', 'type', details, setDetails, { isRequired: true })}
            {renderTextField('Location (Optional)', 'location', details, setDetails)}
            {renderTextField('Severity (Optional)', 'severity', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
