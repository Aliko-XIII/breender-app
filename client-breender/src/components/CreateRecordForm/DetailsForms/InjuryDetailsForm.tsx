import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { InjuryDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const InjuryDetailsForm: React.FC<DetailFormProps<InjuryDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<InjuryDetailsDto>(initialDetails ?? { type: '', location: '', severity: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.type?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Injury Type', 'type', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Location (Optional)', 'location', details, setDetails)}
            {renderTextField('Severity (Optional)', 'severity', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
