// src/components/RecordList/RecordList.tsx
import { useState, useEffect } from 'react';
import { Alert, ListGroup, Spinner, Card, Button } from 'react-bootstrap';
import { AnimalRecord, AnimalRecordType } from '../../types'; // Adjust path as needed
import { useParams, useNavigate } from 'react-router-dom';
import { getRecordsByAnimal, getRecordsByUser } from '../../api/recordApi';

export const RecordList = () => {
    const [records, setRecords] = useState<AnimalRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id: animalId, userId } = useParams<{ id?: string; userId?: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            setError(null);
            setRecords([]);

            if (animalId) {
                try {
                    const result = await getRecordsByAnimal(animalId);
                    if (result.status !== 200) {
                        throw new Error(`Failed to fetch records: ${result.status}`);
                    }
                    setRecords(result.data as AnimalRecord[]);
                } catch (err: any) {
                    console.error("Error fetching records:", err);
                    setError(err.message || "An unexpected error occurred while fetching records.");
                } finally {
                    setIsLoading(false);
                }
            } else if (userId) {
                try {
                    const result = await getRecordsByUser(userId);
                    if (result.status !== 200) {
                        throw new Error(`Failed to fetch records: ${result.status}`);
                    }
                    setRecords(result.data as AnimalRecord[]);
                } catch (err: any) {
                    console.error("Error fetching records:", err);
                    setError(err.message || "An unexpected error occurred while fetching records.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("No animal or user ID provided.");
                setIsLoading(false);
            }
        };
        fetchRecords();
    }, [animalId, userId]);

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
                    <ListGroup.Item key={record.id} className="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{record.name || `Record ${record.id.substring(0, 6)}`}</div>
                            <div><small className="text-muted">Type:</small> {record.recordType}</div>
                            {record.animal && (
                                <div>
                                    <small className="text-muted">Animal:</small> {record.animal.name} ({record.animal.breed}, {record.animal.species})
                                </div>
                            )}
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
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Animal Records</span>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/animals/${animalId}/create-record`)}
                        disabled={!animalId}
                    >
                        Create Record
                    </Button>
                </Card.Header>
                <div className="p-3 bg-white" style={{ borderRadius: '0 0 0.5rem 0.5rem' }}>
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
                                    <Card className="shadow-sm bg-light border border-primary">
                                        <Card.Body className="d-flex justify-content-between align-items-start flex-wrap p-3">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                    {record.name || `Record ${record.id.substring(0, 6)}`}
                                                </div>
                                                <div>
                                                    <small className="text-muted">Type:</small> {record.recordType}
                                                </div>
                                                {record.animal && (
                                                    <div>
                                                        <small className="text-muted">Animal:</small> {record.animal.name} ({record.animal.breed}, {record.animal.species})
                                                    </div>
                                                )}
                                                {record.description && (
                                                    <div>
                                                        <small className="text-muted">Desc:</small> {record.description}
                                                    </div>
                                                )}
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => navigate(`/records/view/${record.id}`)}
                                                >
                                                    View Details
                                                </Button>
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