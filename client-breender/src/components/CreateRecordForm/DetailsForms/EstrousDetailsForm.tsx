import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { EstrousDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const EstrousDetailsForm: React.FC<DetailFormProps<EstrousDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<EstrousDetailsDto>({ stage: '', observations: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.stage?.trim() && !!details.observations?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Stage', 'stage', details, setDetails, { isRequired: true })}
            {renderTextField('Observations', 'observations', details, setDetails, { isRequired: true, isTextArea: true })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
