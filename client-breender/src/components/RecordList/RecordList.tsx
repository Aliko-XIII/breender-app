// src/components/RecordList/RecordList.tsx
import { useState, useEffect } from 'react';
import { Alert, ListGroup, Spinner, Card, Button } from 'react-bootstrap';
import { AnimalRecord, AnimalRecordType, AnyAnimalRecordDetails } from '../../types'; // Adjust path as needed
import { useParams, useNavigate } from 'react-router-dom';
import { getRecords } from '../../api/recordApi';
import { RecordDetailsForm } from '../CreateRecordForm/DetailsForms/RecordDetailsForm';

export const RecordList = () => {
    const [records, setRecords] = useState<AnimalRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [recordType, setRecordType] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [detailsFilter, setDetailsFilter] = useState<AnyAnimalRecordDetails | null>(null);
    const [isDetailsValid, setIsDetailsValid] = useState(true);
    const { id: animalId, userId } = useParams<{ id?: string; userId?: string }>();
    const navigate = useNavigate();

    // Fetch records with filters
    const fetchRecords = async () => {
        setIsLoading(true);
        setError(null);
        setRecords([]);
        try {
            const filters: {
                animalId?: string;
                userId?: string;
                recordType?: string;
                dateFrom?: string;
                dateTo?: string;
                details?: AnyAnimalRecordDetails;
            } = {};
            if (animalId) filters.animalId = animalId;
            if (userId) filters.userId = userId;
            if (recordType) filters.recordType = recordType;
            if (dateFrom) filters.dateFrom = dateFrom;
            if (dateTo) filters.dateTo = dateTo;
            if (detailsFilter && Object.keys(detailsFilter).length > 0) filters.details = detailsFilter;
            const result = await getRecords(filters);
            if (result.status !== 200) {
                throw new Error(`Failed to fetch records: ${result.status}`);
            }
            setRecords(result.data as AnimalRecord[]);
        } catch (err) {
            console.error("Error fetching records:", err);
            setError((err as Error).message || "An unexpected error occurred while fetching records.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animalId, userId]);

    // Filter form submit
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecords();
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch {
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
                    {/* Filter Form */}
                    <form className="mb-3" onSubmit={handleFilterSubmit}>
                        <div className="row g-2 align-items-end">
                            <div className="col-md-4">
                                <label className="form-label mb-0">Type</label>
                                <select className="form-select" value={recordType} onChange={e => { setRecordType(e.target.value); setDetailsFilter(null); }}>
                                    <option value="">All Types</option>
                                    {Object.values(AnimalRecordType).map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label mb-0">From</label>
                                <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label mb-0">To</label>
                                <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary w-100">Filter</button>
                            </div>
                        </div>
                        {/* Details filter form, only show if a type is selected */}
                        {recordType && (
                            <div className="mt-3">
                                <RecordDetailsForm
                                    recordType={recordType as AnimalRecordType}
                                    onChange={setDetailsFilter}
                                    onValidityChange={setIsDetailsValid}
                                    filterMode={true}
                                />
                            </div>
                        )}
                    </form>
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
                                                    onClick={() => navigate(`/records/${record.id}`)}
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