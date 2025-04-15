import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BirthDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BirthDetailsForm: React.FC<DetailFormProps<BirthDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<BirthDetailsDto>(initialDetails ?? { offspringCount: 0, liveOffspringCount: undefined, complications: '', notes: '' });

    useEffect(() => {
        const isValid = typeof details.offspringCount === 'number' && details.offspringCount > 0 && !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Offspring Count', 'offspringCount', details, setDetails, { isRequired: true, type: 'number' })}
            {renderTextField('Live Offspring Count (Optional)', 'liveOffspringCount', details, setDetails, { type: 'number' })}
            {renderTextField('Complications (Optional)', 'complications', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
