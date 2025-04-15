// src/components/RecordList/RecordList.tsx
import { useState, useEffect } from 'react';
import { Alert, ListGroup, Spinner, Card } from 'react-bootstrap';
import { AnimalRecord, AnimalRecordType } from '../../types'; // Adjust path as needed
import { useParams } from 'react-router-dom';

export const RecordList = () => {
    const [records, setRecords] = useState<AnimalRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id: animalId } = useParams<{ id: string }>();

    useEffect(() => {
        // Function to fetch records from the API
        const fetchRecords = async () => {
            setIsLoading(true);
            setError(null);
            setRecords([]); // Clear previous records

            const mockAnimalRecords: AnimalRecord[] = [
                {
                    id: "rec-001",
                    animalId: 'MOCK_ANIMAL_ID',
                    recordType: AnimalRecordType.CHECKUP,
                    name: "Annual Wellness Exam",
                    description: "Routine yearly checkup with Dr. Smith.",
                    createdAt: "2025-04-10T10:30:00Z", // Use ISO 8601 format
                    details: {
                        vetName: "Dr. Smith",
                        notes: "All vitals normal. Recommended dental cleaning.",
                        weight: 15.2, // Example detail field
                        weightUnit: "kg" // Example detail field
                    }
                },
                {
                    id: "rec-002",
                    animalId: 'MOCK_ANIMAL_ID',
                    recordType: AnimalRecordType.WEIGHT,
                    name: "Weekly Weight Check",
                    description: null, // No description
                    createdAt: "2025-04-08T09:00:00Z",
                    details: {
                        weight: 15.1,
                        unit: "kg"
                    }
                },
                {
                    id: "rec-003",
                    animalId: 'MOCK_ANIMAL_ID',
                    recordType: AnimalRecordType.VACCINATION,
                    name: "Rabies Booster",
                    description: "Administered rabies vaccine booster.",
                    createdAt: "2025-03-15T14:15:00Z",
                    details: {
                        vaccineName: "RabiesShield III",
                        batchNumber: "RB12345X",
                        vetName: "Vet Clinic B"
                    }
                }
            ];
            setRecords(mockAnimalRecords);
            setIsLoading(false);
            return;

            // --- Construct API Query ---
            // TODO: Later, incorporate userId and filters into the query parameters
            const queryParams = new URLSearchParams();
            if (animalId) {
                queryParams.append('animalId', animalId);
            }
            // if (userId) {
            //     queryParams.append('userId', userId);
            // }
            // if (filters) {
            //     Object.entries(filters).forEach(([key, value]) => {
            //         if (value !== null && value !== undefined && value !== '') {
            //             queryParams.append(key, String(value));
            //         }
            //     });
            // }

            // --- API Call ---
            // Adjust the endpoint URL as needed
            const apiUrl = `/api/records?${queryParams.toString()}`;

            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    // Handle HTTP errors (e.g., 404, 500)
                    const errorData = await response.text(); // Or response.json() if error details are structured
                    throw new Error(`Failed to fetch records: ${response.status} ${response.statusText} - ${errorData}`);
                }

                const data: AnimalRecord[] = await response.json();
                setRecords(data);

            } catch (err: any) {
                console.error("Error fetching records:", err);
                setError(err.message || "An unexpected error occurred while fetching records.");
            } finally {
                setIsLoading(false);
            }
        };

        // Trigger fetch if we have an identifier (animalId for now)
        // TODO: Adjust this condition when userId/filters are added
        if (animalId) {
            fetchRecords();
        } else {
            // Handle cases where no identifier is provided yet (e.g., if props become optional)
            setRecords([]);
            setIsLoading(false);
            // Optionally set an error or message indicating required props are missing
            // setError("Please provide an Animal ID to search for records.");
        }

        // Dependency array: Re-run the effect if animalId changes
        // TODO: Add userId and filters to dependencies when implemented
    }, [animalId /*, userId, filters */]); // Dependency array

    // Helper function to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return dateString; // Fallback to original string if parsing fails
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading records...</span>
                    </Spinner>
                    <p className="mt-2">Loading records...</p>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger">Error loading records: {error}</Alert>;
        }

        if (records.length === 0) {
            return <Alert variant="info">No records found for this animal.</Alert>;
            // TODO: Adjust message based on whether animalId, userId or filters were active
        }

        return (
            <ListGroup variant="flush">
                {records.map((record) => (
                    <ListGroup.Item key={record.id} className="d-flex justify-content-between align-items-start flex-wrap">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{record.name || `Record ${record.id.substring(0, 6)}`}</div>
                            <div><small className="text-muted">Type:</small> {record.recordType}</div>
                            {record.description && (
                                <div><small className="text-muted">Desc:</small> {record.description}</div>
                            )}
                        </div>
                        <span className="text-muted ms-md-3 mt-2 mt-md-0"><small>{formatDate(record.createdAt)}</small></span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };

    return (
        <div className="d-flex justify-content-center">
            <Card className="mt-4 w-100" style={{ maxWidth: 600 }}>
                <Card.Header>
                    Animal Records
                    {/* TODO: Add Filter/Search controls here later */}
                </Card.Header>
                <div>
                    {isLoading || error || records.length === 0 ? (
                        renderContent()
                    ) : (
                        <ListGroup variant="flush">
                            {records.map((record) => (
                                <ListGroup.Item
                                    key={record.id}
                                    className="mb-3 p-0 border-0 bg-transparent"
                                    style={{ background: "none" }}
                                >
                                    <Card className="shadow-sm">
                                        <Card.Body className="d-flex justify-content-between align-items-start flex-wrap">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                    {record.name || `Record ${record.id.substring(0, 6)}`}
                                                </div>
                                                <div>
                                                    <small className="text-muted">Type:</small> {record.recordType}
                                                </div>
                                                {record.description && (
                                                    <div>
                                                        <small className="text-muted">Desc:</small> {record.description}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-muted ms-md-3 mt-2 mt-md-0">
                                                <small>{formatDate(record.createdAt)}</small>
                                            </span>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
            </Card>
        </div>
    );
};