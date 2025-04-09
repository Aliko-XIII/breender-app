import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AnimalRecordType } from "../../types";
import { useParams } from "react-router-dom";

// --- Types ---
interface CreateRecordFormProps {
  onSave?: (data: any) => void;
}

// --- Placeholder Details Component ---
const DetailsComponent: React.FC<{
  recordType: AnimalRecordType | "";
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
}> = ({ recordType, isComplete, setIsComplete }) => {
  if (!recordType) {
    return <div className="text-muted">Please select a record type to fill in details.</div>;
  }

  return (
    <div className="border p-3 rounded bg-light">
      <p><strong>{recordType}</strong> details form goes here...</p>
      <Button
        variant={isComplete ? "success" : "secondary"}
        onClick={() => setIsComplete(!isComplete)}
      >
        {isComplete ? "Mark as Incomplete" : "Mark as Complete"}
      </Button>
    </div>
  );
};

// --- Main Form ---
export const CreateRecordForm: React.FC<CreateRecordFormProps> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [recordType, setRecordType] = useState<AnimalRecordType | "">("");
  const [description, setDescription] = useState("");
  const [detailsComplete, setDetailsComplete] = useState(false);
  const { id: animalId } = useParams<{ id: string }>();

  const isFormValid = name.trim() !== "" && recordType !== "" && detailsComplete;

  const handleSave = () => {
    if (!isFormValid) return;

    const payload = {
      animalId,
      recordType,
      description,
      name,
      details: { completed: true } // placeholder for actual detail structure
    };

    onSave?.(payload);
    alert("Record saved (mock)!");
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-4">Create Record</h3>

        <Form.Group className="mb-3">
          <Form.Label>Record Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monthly checkup"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Record Type</Form.Label>
          <Form.Select
            value={recordType}
            onChange={(e) => {
              setRecordType(e.target.value as AnimalRecordType);
              setDetailsComplete(false);
            }}
          >
            <option value="">-- Select Type --</option>
            {Object.entries(AnimalRecordType).map(([key, val]) => (
              <option key={key} value={val}>{val}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Form.Label>Details</Form.Label>
          <DetailsComponent
            recordType={recordType}
            isComplete={detailsComplete}
            setIsComplete={setDetailsComplete}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!isFormValid}
          className="mt-3 w-100"
        >
          Save Record
        </Button>
      </div>
    </div>
  );
};
