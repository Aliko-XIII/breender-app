import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { DefleaingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const DefleaingDetailsForm: React.FC<DetailFormProps<DefleaingDetailsDto>> = ({ onChange, onValidityChange, initialDetails }) => {
    const [details, setDetails] = useState<DefleaingDetailsDto>(initialDetails ?? { productName: '', applicationMethod: '', notes: '' });

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
            {renderTextField('Application Method (Optional)', 'applicationMethod', details, setDetails)}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
