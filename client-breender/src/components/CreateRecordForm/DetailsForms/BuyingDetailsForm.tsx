import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BuyingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const BuyingDetailsForm: React.FC<DetailFormProps<BuyingDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<BuyingDetailsDto>(initialDetails ?? { sellerName: '', sellerContact: '', price: undefined, currency: '', notes: '' });

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
            {renderTextField('Seller Name (Optional)', 'sellerName', details, setDetails)}
            {renderTextField('Seller Contact (Optional)', 'sellerContact', details, setDetails)}
            {renderTextField('Price (Optional)', 'price', details, setDetails, { type: 'number' })}
            {renderTextField('Currency (Optional)', 'currency', details, setDetails)}
            {renderTextField('Notes', 'notes', details, setDetails, { isRequired: true, isTextArea: true })}
        </Form>
    );
};
