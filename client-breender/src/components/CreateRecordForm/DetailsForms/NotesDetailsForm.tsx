import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { NotesDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const NotesDetailsForm: React.FC<DetailFormProps<NotesDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<NotesDetailsDto>({ text: '' });

    useEffect(() => {
        const isValid = !!details.text?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Note', 'text', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
