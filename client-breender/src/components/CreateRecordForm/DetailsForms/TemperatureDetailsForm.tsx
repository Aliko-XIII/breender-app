import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { TemperatureDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const TemperatureDetailsForm: React.FC<DetailFormProps<TemperatureDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<TemperatureDetailsDto>(initialDetails ?? { value: 0, unit: '' });

    useEffect(() => {
        const isValid = typeof details.value === 'number' && !isNaN(details.value);
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Temperature Value', 'value', details, setDetails, { isRequired: true, type: 'number' })}
            {renderTextField('Unit (Optional)', 'unit', details, setDetails)}
        </Form>
    );
};
