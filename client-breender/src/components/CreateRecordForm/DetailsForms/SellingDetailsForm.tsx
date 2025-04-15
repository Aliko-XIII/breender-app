import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SellingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const SellingDetailsForm: React.FC<DetailFormProps<SellingDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<SellingDetailsDto>(initialDetails ?? { buyerName: '', buyerContact: '', price: undefined, currency: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.notes?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Buyer Name (Optional)', 'buyerName', details, setDetails)}
            {renderTextField('Buyer Contact (Optional)', 'buyerContact', details, setDetails)}
            {renderTextField('Price (Optional)', 'price', details, setDetails, { type: 'number' })}
            {renderTextField('Currency (Optional)', 'currency', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
