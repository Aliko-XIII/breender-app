import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { DewormingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const DewormingDetailsForm: React.FC<DetailFormProps<DewormingDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<DewormingDetailsDto>(initialDetails ?? { productName: '', dosage: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.productName?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Product Name', 'productName', details, setDetails, { isRequired: true })}
            {renderTextField('Dosage (Optional)', 'dosage', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
