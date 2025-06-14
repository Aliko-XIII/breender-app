import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button, Form } from "react-bootstrap";
import { getRecordById, updateRecord, deleteRecord } from "../../api/recordApi";
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
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Helper to export record as JSON and trigger download
  const handleExportJson = () => {
    if (!record) return;
    const json = JSON.stringify(record, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `record-${record.id || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  const handleDelete = async () => {
    if (!recordId) return;
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteRecord(recordId);
      if (res.status === 200) {
        navigate(-1);
      } else {
        setError(res.data?.message || "Failed to delete record.");
      }
    } catch {
      setError("Failed to delete record.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!record) return <Alert variant="warning" className="mt-5">Record not found.</Alert>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ maxWidth: 600, width: "100%", background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} className="shadow">
        <Card.Header className="fw-bold" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>
          Record Details
        </Card.Header>
        <Card.Body>
          {/* Animal Basic Details */}
          {record.animal && (
            <div className="mb-3 p-2 rounded border" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              <div><b>Animal:</b> {record.animal.name}</div>
              <div><b>Breed:</b> {record.animal.breed || <span className="text-muted">(none)</span>}</div>
              <div><b>Species:</b> {record.animal.species || <span className="text-muted">(none)</span>}</div>
            </div>
          )}
          <div><b>Type:</b> {record.recordType}</div>
          <div><b>Description:</b> {isEditing ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              className="mb-2"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            />
          ) : (
            record.description || <span className="text-muted">(none)</span>
          )}</div>
          <div><b>Created:</b> {new Date(record.createdAt).toLocaleString()}</div>
          <div className="mt-3">
            <b>Details:</b>
            {isEditing ? (
              <div className="border p-3 rounded" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
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
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSaving || isDeleting}>Back</Button>
            <Button variant="outline-primary" onClick={handleExportJson} disabled={!record || isDeleting}>Export as JSON</Button>
            {isOwner && !isEditing && (
              <>
                <Button variant="primary" onClick={() => setIsEditing(true)} disabled={isDeleting}>Edit</Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
            {isOwner && isEditing && (
              <>
                <Button variant="success" onClick={handleSave} disabled={isSaving || !isDetailsValid || isDeleting}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" onClick={() => { setIsEditing(false); setFormDescription(record.description || ""); setFormDetails(record.details || null); }} disabled={isSaving || isDeleting}>Cancel</Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
