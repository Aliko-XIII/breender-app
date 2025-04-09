import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ReminderType } from "../../types";


interface CreateReminderFormProps {
  onSave?: (data: any) => void;
}

export const CreateReminderForm: React.FC<CreateReminderFormProps> = ({ onSave }) => {
  const { id: animalId } = useParams<{ id: string }>();
  const [reminderType, setReminderType] = useState<ReminderType | "">("");
  const [message, setMessage] = useState("");
  const [remindAt, setRemindAt] = useState("");

  const isFormValid = animalId && reminderType && remindAt;

  const handleSave = () => {
    if (!isFormValid) return;

    const payload = {
      animalId,
      reminderType,
      message,
      remindAt: new Date(remindAt),
    };

    onSave?.(payload);
    alert("Reminder saved (mock)!");
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-4">Create Reminder</h3>

        <Form.Group className="mb-3">
          <Form.Label>Reminder Type</Form.Label>
          <Form.Select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value as ReminderType)}
          >
            <option value="">-- Select Type --</option>
            {Object.values(ReminderType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reminder Message (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add an optional note..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Remind At</Form.Label>
          <Form.Control
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
        </Form.Group>

        <Button
          onClick={handleSave}
          disabled={!isFormValid}
          className="mt-3 w-100"
        >
          Save Reminder
        </Button>
      </div>
    </div>
  );
};
