import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AnimalRecordType, AnyAnimalRecordDetails } from "../../types"; // Adjust path
import { useParams } from "react-router-dom";
import { RecordDetailsForm } from "./DetailsForms/RecordDetailsForm"; // Adjust path

// --- Types ---
interface CreateRecordFormProps {
  onSave?: (data: any) => void; // Consider defining a more specific type for saved data
}

// --- Main Form ---
export const CreateRecordForm: React.FC<CreateRecordFormProps> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [recordType, setRecordType] = useState<AnimalRecordType | "">("");
  const [description, setDescription] = useState("");
  const [detailsData, setDetailsData] = useState<AnyAnimalRecordDetails | null>(null); // State to hold details object
  const [isDetailsValid, setIsDetailsValid] = useState(false); // State for details form validity
  const { id: animalId } = useParams<{ id: string }>();

  // Form is valid if name, type are selected, AND the details form is valid
  const isFormValid = name.trim() !== "" && recordType !== "" && isDetailsValid;

  const handleSave = () => {
    if (!isFormValid || !detailsData) { // Ensure detailsData is not null
        console.error("Save attempt with invalid form or missing details data.");
        return;
    };

    const payload = {
      animalId,
      recordType,
      description,
      name,
      details: detailsData, // Use the actual details data from state
    };

    console.log("Saving Payload:", payload); // Log before calling onSave
    onSave?.(payload);
    alert("Record saved (mock)!");
    // Consider resetting the form here
    // setName("");
    // setRecordType("");
    // setDescription("");
    // setDetailsData(null);
    // setIsDetailsValid(false);
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

        {/* Record Name */}
        <Form.Group className="mb-3">
          <Form.Label>Record Name <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monthly checkup"
            required
            isInvalid={!name.trim()}
          />
           <Form.Control.Feedback type="invalid">
                Record name is required.
            </Form.Control.Feedback>
        </Form.Group>

        {/* Record Type */}
        <Form.Group className="mb-3">
          <Form.Label>Record Type <span className="text-danger">*</span></Form.Label>
          <Form.Select
            value={recordType}
            onChange={handleRecordTypeChange}
            required
            isInvalid={!recordType}
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
          />
        </Form.Group>

        {/* Details Section */}
        <div className="mb-3">
          <Form.Label>Details {recordType && <span className="text-danger">*</span>}</Form.Label>
           <div className="border p-3 rounded bg-light"> {/* Added container similar to old placeholder */}
             <RecordDetailsForm
                recordType={recordType}
                onChange={setDetailsData} // Pass the setter for details data
                onValidityChange={setIsDetailsValid} // Pass the setter for validity
             />
           </div>
        </div>

        {/* Save Button */}
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