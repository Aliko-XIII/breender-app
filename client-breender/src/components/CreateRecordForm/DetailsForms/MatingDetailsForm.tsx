import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { MatingDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const MatingDetailsForm: React.FC<DetailFormProps<MatingDetailsDto>> = ({ onChange, onValidityChange, initialDetails, filterMode }) => {
    const [details, setDetails] = useState<MatingDetailsDto>(initialDetails ?? { partnerDetails: '', partnerId: '', outcome: '', notes: '' });

    useEffect(() => {
        if (filterMode) {
            onValidityChange(true);
            const hasAny = Object.values(details).some(v => v && v.toString().trim() !== '');
            onChange(hasAny ? details : null);
            return;
        }
        const isValid = !!details.outcome?.trim();
        onValidityChange(isValid);
        onChange(isValid ? details : null);
    }, [details, onChange, onValidityChange, filterMode]);

    useEffect(() => {
        if (initialDetails) setDetails(initialDetails);
    }, [initialDetails]);

    return (
        <Form noValidate>
            {renderTextField('Partner Details (Optional)', 'partnerDetails', details, setDetails)}
            {renderTextField('Partner ID (Optional)', 'partnerId', details, setDetails)}
            {renderTextField('Outcome', 'outcome', details, setDetails, { isRequired: !filterMode })}
            {renderTextField('Notes (Optional)', 'notes', details, setDetails, { isTextArea: true })}
        </Form>
    );
};
