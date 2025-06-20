import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { MedicationDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const MedicationDetailsForm: React.FC<DetailFormProps<MedicationDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<MedicationDetailsDto>(initialDetails ?? { medicationName: '', dosage: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.medicationName?.trim() && !!details.dosage?.trim();
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
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
