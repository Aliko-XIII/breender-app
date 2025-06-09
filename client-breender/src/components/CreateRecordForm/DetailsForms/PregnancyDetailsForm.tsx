import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { PregnancyDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const PregnancyDetailsForm: React.FC<DetailFormProps<PregnancyDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<PregnancyDetailsDto>(initialDetails ?? { confirmationMethod: '', estimatedDueDate: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Confirmation Method (Optional)', 'confirmationMethod', details, setDetails)}
            {renderTextField('Estimated Due Date (Optional)', 'estimatedDueDate', details, setDetails, { type: 'date' })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
