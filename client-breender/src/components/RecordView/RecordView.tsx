import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { getRecordById } from "../../api/recordApi";
import { AnimalRecord } from "../../types";

export const RecordView: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<AnimalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!recordId) return;
    setLoading(true);
    getRecordById(recordId)
      .then((res) => {
        if (res.status === 200) setRecord(res.data);
        else setError(res.data?.message || "Record not found");
      })
      .catch(() => setError("Failed to fetch record."))
      .finally(() => setLoading(false));
  }, [recordId]);

  // Helper to render details object nicely
  function renderDetails(details: Record<string, unknown> | null | undefined) {
    if (!details || typeof details !== 'object') return <span className="text-muted">(none)</span>;
    const entries = Object.entries(details).filter(([, v]) => v !== undefined && v !== null && v !== '');
    if (entries.length === 0) return <span className="text-muted">(none)</span>;
    return (
      <dl className="row mb-0">
        {entries.map(([key, value]) => (
          <React.Fragment key={key}>
            <dt className="col-5 text-capitalize" style={{ fontWeight: 500 }}>{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd className="col-7 mb-1">{Array.isArray(value) ? value.join(', ') : String(value)}</dd>
          </React.Fragment>
        ))}
      </dl>
    );
  }

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!record) return <Alert variant="warning" className="mt-5">Record not found.</Alert>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ maxWidth: 600, width: "100%" }} className="shadow">
        <Card.Header className="fw-bold">Record Details</Card.Header>
        <Card.Body>
          {/* Animal Basic Details */}
          {record.animal && (
            <div className="mb-3 p-2 rounded bg-light border">
              <div><b>Animal:</b> {record.animal.name}</div>
              <div><b>Breed:</b> {record.animal.breed || <span className="text-muted">(none)</span>}</div>
              <div><b>Species:</b> {record.animal.species || <span className="text-muted">(none)</span>}</div>
            </div>
          )}
          <div><b>Name:</b> {record.name}</div>
          <div><b>Type:</b> {record.recordType}</div>
          <div><b>Description:</b> {record.description || <span className="text-muted">(none)</span>}</div>
          <div><b>Created:</b> {new Date(record.createdAt).toLocaleString()}</div>
          <div className="mt-3">
            <b>Details:</b>
            {renderDetails(record.details)}
          </div>
          <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>Back</Button>
        </Card.Body>
      </Card>
    </div>
  );
};
