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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !title.trim()) {
            setErrorMessage('Please provide both a title and a file.');
            return;
        }

        if (!animalId) throw new Error('Animal ID is not defined');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
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
        <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <h4 className="mb-3">Upload Document</h4>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form.Group controlId="docTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="docFile" className="mb-3">
                <Form.Label>Document</Form.Label>
                <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                        const input = e.target as HTMLInputElement;
                        setFile(input.files?.[0] || null);
                    }}
                />
            </Form.Group>

            <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                    <>
                        <Spinner animation="border" size="sm" /> Uploading...
                    </>
                ) : (
                    'Upload Document'
                )}
            </Button>
        </Form>
    );
};

export default DocumentUploadForm;
