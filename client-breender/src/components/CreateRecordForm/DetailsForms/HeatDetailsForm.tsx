import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { HeatDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const HeatDetailsForm: React.FC<DetailFormProps<HeatDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<HeatDetailsDto>(initialDetails ?? { stage: '', observations: '' });

    useEffect(() => {
        const isValid = !!details.observations?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Stage (Optional)', 'stage', details, setDetails, { placeholder: 'e.g., Proestrus, Estrus' })}
            {renderTextField('Observations', 'observations', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
