import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BehaviorDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BehaviorDetailsForm: React.FC<DetailFormProps<BehaviorDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<BehaviorDetailsDto>(initialDetails ?? { description: '', context: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.description?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Description', 'description', details, setDetails, { isRequired: !filterMode, placeholder: 'e.g., Aggressive, Playful' })}
            {renderTextField('Context (Optional)', 'context', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
