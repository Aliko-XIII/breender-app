// src/components/RecordDetailForms/SurgeryDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SurgeryDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SurgeryDetailsForm: React.FC<DetailFormProps<SurgeryDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<SurgeryDetailsDto>({ type: '', notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.type?.trim() && !!details.notes?.trim(); // type and notes are required
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
             {renderTextField("Surgery Type", "type", details, setDetails, { isRequired: true, placeholder: "e.g., Neutering, Tumor Removal" })}
             {renderTextField("Notes", "notes", details, setDetails, { isRequired: true, isTextArea: true, placeholder: "Procedure details, outcome..." })}
             {renderTextField("Vet Name (Optional)", "vetName", details, setDetails, { placeholder: "Dr. Smith" })}
        </Form>
    );
};