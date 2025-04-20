import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { TemperatureDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const TemperatureDetailsForm: React.FC<DetailFormProps<TemperatureDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<TemperatureDetailsDto>(initialDetails ?? { value: 0, unit: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v !== undefined && v !== null && v !== '' && v !== 0);
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = typeof details.value === 'number' && !isNaN(details.value);
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Temperature Value', 'value', details, setDetails, { isRequired: !filterMode, type: 'number' })}
            {renderTextField('Unit (Optional)', 'unit', details, setDetails)}
        </Form>
    );
};
