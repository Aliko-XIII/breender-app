import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SleepingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SleepingDetailsForm: React.FC<DetailFormProps<SleepingDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<SleepingDetailsDto>({ durationHours: undefined, quality: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Duration (hours, optional)', 'durationHours', details, setDetails, { type: 'number', placeholder: 'e.g., 8' })}
            {renderTextField('Quality (Optional)', 'quality', details, setDetails, { placeholder: 'e.g., Restful, Restless' })}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
