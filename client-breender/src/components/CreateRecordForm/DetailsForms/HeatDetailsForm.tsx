import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { HeatDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const HeatDetailsForm: React.FC<DetailFormProps<HeatDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<HeatDetailsDto>(initialDetails ?? { stage: '', observations: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.observations?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Stage (Optional)', 'stage', details, setDetails, { placeholder: 'e.g., Proestrus, Estrus' })}
            {renderTextField('Observations', 'observations', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
