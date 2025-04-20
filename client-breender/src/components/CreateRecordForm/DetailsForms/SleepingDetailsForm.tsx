import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SleepingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SleepingDetailsForm: React.FC<DetailFormProps<SleepingDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<SleepingDetailsDto>(initialDetails ?? { durationHours: undefined, quality: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v !== undefined && v !== null && v !== '' && v !== 0);
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
            {renderTextField('Duration (hours, optional)', 'durationHours', details, setDetails, { type: 'number', placeholder: 'e.g., 8' })}
            {renderTextField('Quality (Optional)', 'quality', details, setDetails, { placeholder: 'e.g., Restful, Restless' })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
