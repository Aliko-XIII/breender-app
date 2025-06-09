// src/components/RecordDetailForms/common.ts
import { Form } from "react-bootstrap";
import React from "react";

// Helper type for props
export interface DetailFormProps<T> {
    onChange: (details: T | null) => void;
    onValidityChange: (isValid: boolean) => void;
    initialDetails?: T | null;
}

// Helper function to render a text input field
export const renderTextField = <T, K extends keyof T>(
    label: string,
    field: K,
    state: T,
    setState: React.Dispatch<React.SetStateAction<T>>,
    options: { isRequired?: boolean; placeholder?: string; isTextArea?: boolean; type?: string } = {}
) => (
    <Form.Group className="mb-3" controlId={`form-${String(field)}`}> 
        <Form.Label style={{ color: 'var(--color-text-secondary)' }}>{label}{options.isRequired && <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
            type={options.type ?? (options.isTextArea ? undefined : "text")}
            as={options.isTextArea ? "textarea" : undefined}
            rows={options.isTextArea ? 3 : undefined}
            placeholder={options.placeholder || ""}
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            value={(state[field] as string | number | undefined)?.toString() ?? ""}
            onChange={(e) => {
                 const value = options.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value;
                 setState(prev => ({ ...prev, [field]: value }));
            }}
            required={options.isRequired}
            isInvalid={options.isRequired && !state[field]?.toString().trim()}
        />
        {options.isRequired && !state[field]?.toString().trim() && (
             <Form.Control.Feedback type="invalid">
                 {label} is required.
             </Form.Control.Feedback>
         )}
    </Form.Group>
);

// Add similar helpers for Select, Checkbox etc. if needed