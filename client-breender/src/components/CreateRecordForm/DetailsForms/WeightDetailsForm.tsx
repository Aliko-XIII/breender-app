// src/components/RecordDetailForms/WeightDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { WeightDetailsDto } from '../../../types';
import { DetailFormProps, renderTextField } from './common';

export const WeightDetailsForm: React.FC<DetailFormProps<WeightDetailsDto>> = ({ onChange, onValidityChange }) => {
    const [details, setDetails] = useState<WeightDetailsDto>({ weight: 0, unit: 'kg' }); // Default unit

    useEffect(() => {
        const isValid = typeof details.weight === 'number' && details.weight > 0 && !!details.unit?.trim();
        onValidityChange(isValid);

        // Send parsed data only if valid
        onChange(isValid ? { ...details, weight: Number(details.weight) } : null);

    }, [details, onChange, onValidityChange]);

    return (
        <Form noValidate>
            <Row>
                <Col xs={8}>
                    {renderTextField("Weight", "weight", details, setDetails, { isRequired: true, type: 'number', placeholder: "e.g., 15.5" })}
                 </Col>
                 <Col xs={4}>
                    {renderTextField("Unit", "unit", details, setDetails, { isRequired: true, placeholder: "kg/lbs" })}
                 </Col>
            </Row>
        </Form>
    );
};