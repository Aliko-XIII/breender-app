import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ReminderType } from "../../types";
import { createReminder } from "../../api/reminderApi";

interface CreateReminderFormProps {
  onSave?: (data: any) => void;
}

export const CreateReminderForm: React.FC<CreateReminderFormProps> = ({ onSave }) => {
  const { id: animalId } = useParams<{ id: string }>();
  const [reminderType, setReminderType] = useState<ReminderType | "">("");
  const [message, setMessage] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = animalId && reminderType && remindAt;

  const handleSave = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setError(null);
    const payload = {
      animalId: animalId!,
      reminderType: reminderType as string,
      message,
      remindAt: new Date(remindAt).toISOString(), // Convert to ISO string
    };
    const result = await createReminder(payload);
    setIsSubmitting(false);
    if (result.status === 200 || result.status === 201) {
      alert("Reminder created successfully!");
      setReminderType("");
      setMessage("");
      setRemindAt("");
      onSave?.(result.data);
    } else {
      setError(result.data?.message || "Failed to create reminder");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm bg-dark text-light" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-4">Create Reminder</h3>
        {error && <div className="alert alert-danger bg-danger text-light border-0">{error}</div>}
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Reminder Type</Form.Label>
          <Form.Select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value as ReminderType)}
            disabled={isSubmitting}
            className="form-select bg-dark text-light border-secondary"
          >
            <option value="">-- Select Type --</option>
            {Object.values(ReminderType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-light">Reminder Message (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add an optional note..."
            disabled={isSubmitting}
            className="bg-dark text-light border-secondary"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-light">Remind At</Form.Label>
          <Form.Control
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            disabled={isSubmitting}
            className="bg-dark text-light border-secondary"
          />
        </Form.Group>

        <Button
          onClick={handleSave}
          className="mt-3 w-100 btn-light btn-outline-dark"
        >
          {isSubmitting ? "Saving..." : "Save Reminder"}
        </Button>
      </div>
    </div>
  );
};
