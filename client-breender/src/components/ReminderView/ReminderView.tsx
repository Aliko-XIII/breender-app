import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { getReminderById } from "../../api/reminderApi";
import { AnimalReminder } from "../../types/reminder";

export const ReminderView: React.FC = () => {
  const { reminderId } = useParams<{ reminderId: string }>();
  const [reminder, setReminder] = useState<AnimalReminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reminderId) return;
    setLoading(true);
    getReminderById(reminderId)
      .then((res) => {
        if (res.status === 200) setReminder(res.data);
        else setError(res.data?.message || "Reminder not found");
      })
      .catch(() => setError("Failed to fetch reminder."))
      .finally(() => setLoading(false));
  }, [reminderId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!reminder) return <Alert variant="warning" className="mt-5">Reminder not found.</Alert>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ maxWidth: 600, width: "100%" }} className="shadow">
        <Card.Header className="fw-bold">Reminder Details</Card.Header>
        <Card.Body>
          {reminder.animal && (
            <div className="mb-3 p-2 rounded bg-light border">
              <div><b>Animal:</b> {reminder.animal.name}</div>
              <div><b>Breed:</b> {reminder.animal.breed || <span className="text-muted">(none)</span>}</div>
              <div><b>Species:</b> {reminder.animal.species || <span className="text-muted">(none)</span>}</div>
            </div>
          )}
          <div><b>Type:</b> {reminder.reminderType}</div>
          <div><b>Message:</b> {reminder.message || <span className="text-muted">(none)</span>}</div>
          <div><b>Remind At:</b> {formatDate(reminder.remindAt)}</div>
          <div><b>Created:</b> {formatDate(reminder.createdAt)}</div>
          <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>Back</Button>
        </Card.Body>
      </Card>
    </div>
  );
};
