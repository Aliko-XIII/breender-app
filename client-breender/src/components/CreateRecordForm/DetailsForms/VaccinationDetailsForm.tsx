import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { VaccinationDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const VaccinationDetailsForm: React.FC<DetailFormProps<VaccinationDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<VaccinationDetailsDto>(initialDetails ?? { vaccineName: '', batchNumber: '', notes: '', vetName: '' });

    useEffect(() => {
        const isValid = !!details.vaccineName?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Vaccine Name', 'vaccineName', details, setDetails, { isRequired: true })}
            {renderTextField('Batch Number (Optional)', 'batchNumber', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
            {renderTextField('Vet Name (Optional)', 'vetName', details, setDetails)}
        </Form>
    );
};
