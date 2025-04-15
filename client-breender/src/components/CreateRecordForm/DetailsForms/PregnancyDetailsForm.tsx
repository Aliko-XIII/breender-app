import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { PregnancyDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const PregnancyDetailsForm: React.FC<DetailFormProps<PregnancyDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<PregnancyDetailsDto>({ confirmationMethod: '', estimatedDueDate: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Confirmation Method (Optional)', 'confirmationMethod', details, setDetails)}
            {renderTextField('Estimated Due Date (Optional)', 'estimatedDueDate', details, setDetails, { type: 'date' })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
