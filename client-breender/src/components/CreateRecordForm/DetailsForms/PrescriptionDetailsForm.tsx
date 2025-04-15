import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { PrescriptionDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const PrescriptionDetailsForm: React.FC<DetailFormProps<PrescriptionDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<PrescriptionDetailsDto>(initialDetails ?? { medicationName: '', dosage: '', frequency: '', duration: '', notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.medicationName?.trim() && !!details.dosage?.trim() && !!details.frequency?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Medication Name', 'medicationName', details, setDetails, { isRequired: true })}
            {renderTextField('Dosage', 'dosage', details, setDetails, { isRequired: true })}
            {renderTextField('Frequency', 'frequency', details, setDetails, { isRequired: true })}
            {renderTextField('Duration (Optional)', 'duration', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};
