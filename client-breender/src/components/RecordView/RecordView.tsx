import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button, Form } from "react-bootstrap";
import { getRecordById, updateRecord } from "../../api/recordApi";
import { AnimalRecord, AnimalRecordType, AnyAnimalRecordDetails } from "../../types";
import { RecordDetailsForm } from "../CreateRecordForm/DetailsForms/RecordDetailsForm";
import { useUser } from "../../context/UserContext";

export const RecordView: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<AnimalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formDescription, setFormDescription] = useState<string>("");
  const [formDetails, setFormDetails] = useState<AnyAnimalRecordDetails | null>(null);
  const [isDetailsValid, setIsDetailsValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { userId: currentUserId } = useUser();

  useEffect(() => {
    if (!recordId) return;
    setLoading(true);
    setError(null);
    getRecordById(recordId)
      .then((res) => {
        if (res.status === 200) {
          setRecord(res.data);
          setFormDescription(res.data.description || "");
          setFormDetails(res.data.details || null);
        } else setError(res.data?.message || "Record not found");
      })
      .catch(() => setError("Failed to fetch record."))
      .finally(() => setLoading(false));
  }, [recordId]);

  // Only allow editing if the user is an owner of the animal
  const isOwner = record?.animal && currentUserId && record.animal.id && currentUserId
    ? true // TODO: Replace with actual owner check if available in record
    : false;

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

  const handleSave = async () => {
    if (!record || !recordId) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await updateRecord(recordId, {
        description: formDescription,
        details: formDetails,
      });
      if (res.status === 200) {
        setRecord({ ...record, description: formDescription, details: formDetails });
        setIsEditing(false);
      } else {
        setError(res.data?.message || "Failed to update record.");
      }
    } catch (err) {
      setError("Failed to update record.");
    } finally {
      setIsSaving(false);
    }
  };

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
          <div><b>Description:</b> {isEditing ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              className="mb-2"
            />
          ) : (
            record.description || <span className="text-muted">(none)</span>
          )}</div>
          <div><b>Created:</b> {new Date(record.createdAt).toLocaleString()}</div>
          <div className="mt-3">
            <b>Details:</b>
            {isEditing ? (
              <div className="border p-3 rounded bg-light">
                <RecordDetailsForm
                  recordType={record.recordType}
                  onChange={setFormDetails}
                  onValidityChange={setIsDetailsValid}
                  initialDetails={formDetails}
                />
              </div>
            ) : (
              renderDetails(record.details)
            )}
          </div>
          <div className="mt-3 d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSaving}>Back</Button>
            {isOwner && !isEditing && (
              <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            {isOwner && isEditing && (
              <>
                <Button variant="success" onClick={handleSave} disabled={isSaving || !isDetailsValid}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" onClick={() => { setIsEditing(false); setFormDescription(record.description || ""); setFormDetails(record.details || null); }}>Cancel</Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
