import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { NailsDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const NailsDetailsForm: React.FC<DetailFormProps<NailsDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<NailsDetailsDto>({ notes: '' });

    useEffect(() => {
        // notes is optional, always valid
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
