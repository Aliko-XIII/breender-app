import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { uploadPhoto } from '../../api';

const PhotoUploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { id: animalId } = useParams<{ id: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setErrorMessage('Please select a file.');
            return;
        }

        if (!animalId) throw new Error('Animal ID is not defined');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('animalId', animalId);

        try {
            setIsUploading(true);
            setErrorMessage('');
            setSuccessMessage('');

            await uploadPhoto(formData);

            setSuccessMessage('Photo uploaded successfully!');
            setFile(null);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || 'Failed to upload photo.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <h4 className="mb-3">Upload Photo</h4>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form.Group controlId="photoFile" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
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
                    'Upload Photo'
                )}
            </Button>
        </Form>
    );
};

export default PhotoUploadForm;
