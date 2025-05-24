import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AnimalRecordType, AnyAnimalRecordDetails } from "../../types"; // Adjust path
import { useParams } from "react-router-dom";
import { RecordDetailsForm } from "./DetailsForms/RecordDetailsForm"; // Adjust path

// --- Types ---
interface CreateRecordFormProps {
  createRecord: (data: {
    animalId: string,
    recordType: string,
    description?: string,
    details?: object,
  }) => Promise<any>;
  onSave?: (data: any) => void; // Optional, for legacy/mock
}

// --- Main Form ---
export const CreateRecordForm: React.FC<CreateRecordFormProps> = ({ createRecord, onSave }) => {
  const [recordType, setRecordType] = useState<AnimalRecordType | "">("");
  const [description, setDescription] = useState("");
  const [detailsData, setDetailsData] = useState<AnyAnimalRecordDetails | null>(null); // State to hold details object
  const [isDetailsValid, setIsDetailsValid] = useState(false); // State for details form validity
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: animalId } = useParams<{ id: string }>();

  // Form is valid if type is selected, AND the details form is valid
  const isFormValid = recordType !== "" && isDetailsValid;

  const handleSave = async () => {
    if (!isFormValid || !detailsData || !animalId) {
      console.error("Save attempt with invalid form or missing details data.");
      return;
    }

    const payload = {
      animalId,
      recordType,
      description,
      details: detailsData,
    };

    setIsSubmitting(true);
    try {
      const result = await createRecord(payload);
      if (result.status === 200 || result.status === 201) {
        alert("Record created successfully!");
        // Optionally reset form here
        setRecordType("");
        setDescription("");
        setDetailsData(null);
        setIsDetailsValid(false);
        if (onSave) onSave(result.data);
      } else {
        alert("Failed to create record: " + (result.data?.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error creating record.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as AnimalRecordType | "";
    setRecordType(newType);
    // Reset details state when type changes
    setDetailsData(null);
    setIsDetailsValid(false);
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-4">Create Record</h3>

        {/* Record Type */}
        <Form.Group className="mb-3">
          <Form.Label>Record Type <span className="text-danger">*</span></Form.Label>
          <Form.Select
            value={recordType}
            onChange={handleRecordTypeChange}
            required
            isInvalid={!recordType}
            className="bg-dark text-light"
          >
            <option value="">-- Select Type --</option>
            {/* Ensure AnimalRecordType has string values */}
            {Object.values(AnimalRecordType).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Record type is required.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any general notes about this record..."
            className="bg-dark text-light"
          />
        </Form.Group>

        {/* Details Section */}
        <div className="mb-3">
          <Form.Label>Details {recordType && <span className="text-danger">*</span>}</Form.Label>
          <div className="border p-3 rounded bg-dark text-light">
            <RecordDetailsForm
              recordType={recordType}
              onChange={setDetailsData}
              onValidityChange={setIsDetailsValid}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!isFormValid || isSubmitting}
          className="mt-3 w-100"
        >
          {isSubmitting ? "Saving..." : "Save Record"}
        </Button>
      </div>
    </div>
  );
};