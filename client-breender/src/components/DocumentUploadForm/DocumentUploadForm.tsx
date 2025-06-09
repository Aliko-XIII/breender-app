import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { uploadDocument } from '../../api'; // Ensure this endpoint exists

const DocumentUploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { id: animalId } = useParams<{ id: string }>();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !title.trim()) {
            setErrorMessage('Please provide both a title and a file.');
            return;
        }

        if (!animalId) throw new Error('Animal ID is not defined');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentName', title);
        formData.append('animalId', animalId);

        try {
            setIsUploading(true);
            setErrorMessage('');
            setSuccessMessage('');

            await uploadDocument(formData);

            setSuccessMessage('Document uploaded successfully!');
            setFile(null);
            setTitle('');
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || 'Failed to upload document.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)', paddingTop: 48 }}>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm photo-upload-form"
                style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    maxWidth: 420,
                    width: '100%',
                    margin: '0 auto',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.18)'
                }}
            >
                <h4 className="mb-3" style={{ color: 'var(--color-text)' }}>Upload Document</h4>
                {successMessage && <Alert variant="success" className="photo-upload-alert" style={{ background: '#233524', color: '#b0f5b0', border: '1px solid var(--color-border)' }}>{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger" className="photo-upload-alert" style={{ background: '#3a2323', color: '#ffb0b0', border: '1px solid var(--color-border)' }}>{errorMessage}</Alert>}
                <Form.Group controlId="docTitle" className="mb-3">
                    <Form.Label style={{ color: 'var(--color-text)' }}>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                    />
                </Form.Group>
                <Form.Group controlId="docFile" className="mb-3">
                    <Form.Label style={{ color: 'var(--color-text)' }}>Document</Form.Label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const input = e.target as HTMLInputElement;
                                setFile(input.files?.[0] || null);
                            }}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outline-primary"
                            type="button"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {file ? 'Change File' : 'Choose File'}
                        </Button>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                            {file ? file.name : 'No file selected'}
                        </span>
                    </div>
                </Form.Group>
                <Button type="submit" disabled={isUploading} style={{ background: 'var(--color-primary)', color: '#fff', border: '1px solid var(--color-primary)' }}>
                    {isUploading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Uploading...
                        </>
                    ) : (
                        'Upload Document'
                    )}
                </Button>
            </Form>
        </div>
    );
};

export default DocumentUploadForm;
