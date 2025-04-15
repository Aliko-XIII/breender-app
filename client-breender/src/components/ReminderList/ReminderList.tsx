import { useState, useEffect } from "react";
import { Alert, ListGroup, Spinner, Card, Button } from "react-bootstrap";
import { AnimalReminder } from "../../types/reminder";
import { useParams, useNavigate } from "react-router-dom";
import { getRemindersByAnimal, getRemindersByUser } from "../../api/reminderApi";

export const ReminderList = () => {
  const [reminders, setReminders] = useState<AnimalReminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id: animalId, userId } = useParams<{ id?: string; userId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      setError(null);
      setReminders([]);
      if (animalId) {
        try {
          const result = await getRemindersByAnimal(animalId);
          if (result.status !== 200) {
            throw new Error(result.data?.message || `Failed to fetch reminders: ${result.status}`);
          }
          setReminders(result.data as AnimalReminder[]);
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred while fetching reminders.");
        } finally {
          setIsLoading(false);
        }
      } else if (userId) {
        try {
          const result = await getRemindersByUser(userId);
          if (result.status !== 200) {
            throw new Error(result.data?.message || `Failed to fetch reminders: ${result.status}`);
          }
          setReminders(result.data as AnimalReminder[]);
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred while fetching reminders.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("No animal or user ID provided.");
        setIsLoading(false);
      }
    };
    fetchReminders();
  }, [animalId, userId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading reminders...</span>
          </Spinner>
          <p className="mt-2">Loading reminders...</p>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">Error loading reminders: {error}</Alert>;
    }
    if (reminders.length === 0) {
      return <Alert variant="info">No reminders found for this {animalId ? "animal" : "user"}.</Alert>;
    }
    return (
      <ListGroup variant="flush">
        {reminders.map((reminder) => (
          <ListGroup.Item key={reminder.id} className="mb-3 p-0 border-0 bg-transparent" style={{ background: "none" }}>
            <Card className="shadow-sm bg-light border border-primary">
              <Card.Body className="d-flex justify-content-between align-items-start flex-wrap p-3">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{reminder.reminderType}</div>
                  {reminder.message && (
                    <div>
                      <small className="text-muted">Message:</small> {reminder.message}
                    </div>
                  )}
                </div>
                <span className="text-muted ms-md-3 mt-2 mt-md-0">
                  <small>{formatDate(reminder.remindAt)}</small>
                </span>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="mt-4 w-100" style={{ maxWidth: 600 }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>{animalId ? "Animal Reminders" : "User Reminders"}</span>
          {animalId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/animals/${animalId}/create-reminder`)}
              disabled={!animalId}
            >
              Create Reminder
            </Button>
          )}
        </Card.Header>
        <div className="p-3 bg-white" style={{ borderRadius: '0 0 0.5rem 0.5rem' }}>
          {renderContent()}
        </div>
      </Card>
    </div>
  );
};
