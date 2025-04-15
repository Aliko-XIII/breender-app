import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { DiagnosisDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const DiagnosisDetailsForm: React.FC<DetailFormProps<DiagnosisDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<DiagnosisDetailsDto>({ condition: '', notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.condition?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Condition', 'condition', details, setDetails, { isRequired: true })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};
