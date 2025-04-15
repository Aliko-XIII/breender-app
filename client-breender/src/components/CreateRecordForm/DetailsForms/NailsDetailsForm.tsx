import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { NailsDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const NailsDetailsForm: React.FC<DetailFormProps<NailsDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<NailsDetailsDto>(initialDetails ?? { notes: '' });

    useEffect(() => {
        onValidityChange(true);
        onChange(details);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
