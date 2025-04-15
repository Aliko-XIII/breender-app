import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { IllnessDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const IllnessDetailsForm: React.FC<DetailFormProps<IllnessDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<IllnessDetailsDto>({ symptoms: '', diagnosis: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.symptoms?.trim() && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Symptoms', 'symptoms', details, setDetails, { isRequired: true, placeholder: 'Describe symptoms' })}
            {renderTextField('Diagnosis (Optional)', 'diagnosis', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
