import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { OtherDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const OtherDetailsForm: React.FC<DetailFormProps<OtherDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<OtherDetailsDto>(initialDetails ?? { details: '' });

    useEffect(() => {
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Details (Optional)', 'details', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
