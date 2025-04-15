import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { MatingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const MatingDetailsForm: React.FC<DetailFormProps<MatingDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<MatingDetailsDto>({ partnerDetails: '', partnerId: '', outcome: '', notes: '' });

    useEffect(() => {
        const isValid = !!details.outcome?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            {renderTextField('Partner Details (Optional)', 'partnerDetails', details, setDetails)}
            {renderTextField('Partner ID (Optional)', 'partnerId', details, setDetails)}
            {renderTextField('Outcome', 'outcome', details, setDetails, { isRequired: true })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
