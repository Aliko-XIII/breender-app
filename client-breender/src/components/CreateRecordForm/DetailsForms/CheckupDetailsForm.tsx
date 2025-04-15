// src/components/RecordDetailForms/CheckupDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { CheckupDetailsDto } from '../../../types'; // Adjust path as needed
import { DetailFormProps, renderTextField } from './common'; // Adjust path

export const CheckupDetailsForm: React.FC<DetailFormProps<CheckupDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<CheckupDetailsDto>(initialDetails ?? { notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim(); // notes is required
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate> {/* Add noValidate to prevent browser default validation interfering */}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};