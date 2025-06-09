import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { EstrousDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const EstrousDetailsForm: React.FC<DetailFormProps<EstrousDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<EstrousDetailsDto>(initialDetails ?? { stage: '', observations: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.stage?.trim() && !!details.observations?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Stage', 'stage', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Observations', 'observations', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
