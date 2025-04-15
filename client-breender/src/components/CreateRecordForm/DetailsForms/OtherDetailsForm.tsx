import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { OtherDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const OtherDetailsForm: React.FC<DetailFormProps<OtherDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<OtherDetailsDto>({ details: '' });

    useEffect(() => {
        // details is optional, always valid
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Details (Optional)', 'details', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
