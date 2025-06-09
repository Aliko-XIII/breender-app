import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { OtherDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const OtherDetailsForm: React.FC<DetailFormProps<OtherDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<OtherDetailsDto>(initialDetails ?? { details: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Details (Optional)', 'details', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
