import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { NotesDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const NotesDetailsForm: React.FC<DetailFormProps<NotesDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<NotesDetailsDto>(initialDetails ?? { text: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.text?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Note', 'text', details, setDetails, { isRequired: !filterMode, isTextArea: true })}
        </Form>
    );
};
