import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BehaviorDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BehaviorDetailsForm: React.FC<DetailFormProps<BehaviorDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<BehaviorDetailsDto>({ description: '', context: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.description?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Description', 'description', details, setDetails, { isRequired: true, placeholder: 'e.g., Aggressive, Playful' })}
            {renderTextField('Context (Optional)', 'context', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
