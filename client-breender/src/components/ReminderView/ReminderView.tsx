import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { getReminderById, updateReminder, deleteReminder } from "../../api/reminderApi";
import { AnimalReminder } from "../../types/reminder";
import { ReminderType } from "../../types/reminder-type.enum";
import { useUser } from "../../context/UserContext";

export const ReminderView: React.FC = () => {
  const { reminderId } = useParams<{ reminderId: string }>();
  const [reminder, setReminder] = useState<AnimalReminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formType, setFormType] = useState<ReminderType | "">("");
  const [formMessage, setFormMessage] = useState<string>("");
  const [formRemindAt, setFormRemindAt] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!reminderId) return;
    setLoading(true);
    setError(null);
    getReminderById(reminderId)
      .then((res) => {
        if (res.status === 200) {
          setReminder(res.data);
          setFormType(res.data.reminderType);
          setFormMessage(res.data.message || "");
          setFormRemindAt(res.data.remindAt ? res.data.remindAt.slice(0, 16) : ""); // for datetime-local
        } else setError(res.data?.message || "Reminder not found");
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

  const handleSave = async () => {
    if (!reminder || !reminderId) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await updateReminder(reminderId, {
        reminderType: formType,
        message: formMessage,
        remindAt: formRemindAt,
      });
      if (res.status === 200) {
        setReminder({ ...reminder, reminderType: formType as ReminderType, message: formMessage, remindAt: formRemindAt });
        setIsEditing(false);
      } else {
        setError(res.data?.message || "Failed to update reminder.");
      }
    } catch (err) {
      setError("Failed to update reminder.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!reminderId) return;
    if (!window.confirm("Are you sure you want to delete this reminder? This action cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteReminder(reminderId);
      if (res.status === 200) {
        navigate(-1);
      } else {
        setError(res.data?.message || "Failed to delete reminder.");
      }
    } catch (err) {
      setError("Failed to delete reminder.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!reminder) return <Alert variant="warning" className="mt-5">Reminder not found.</Alert>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ maxWidth: 600, width: "100%", background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} className="shadow">
        <Card.Header className="fw-bold" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>
          Reminder Details
        </Card.Header>
        <Card.Body>
          {reminder.animal && (
            <div className="mb-3 p-2 rounded border" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              <div><b>Animal:</b> {reminder.animal.name}</div>
              <div><b>Breed:</b> {reminder.animal.breed || <span className="text-muted">(none)</span>}</div>
              <div><b>Species:</b> {reminder.animal.species || <span className="text-muted">(none)</span>}</div>
            </div>
          )}
          <div><b>Type:</b> {isEditing ? (
            <select className="form-select" value={formType} onChange={e => setFormType(e.target.value as ReminderType)} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              <option value="" disabled>Select type</option>
              {Object.values(ReminderType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            reminder.reminderType
          )}</div>
          <div><b>Message:</b> {isEditing ? (
            <textarea className="form-control" rows={2} value={formMessage} onChange={e => setFormMessage(e.target.value)} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
          ) : (
            reminder.message || <span className="text-muted">(none)</span>
          )}</div>
          <div><b>Remind At:</b> {isEditing ? (
            <input type="datetime-local" className="form-control" value={formRemindAt} onChange={e => setFormRemindAt(e.target.value)} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
          ) : (
            formatDate(reminder.remindAt)
          )}</div>
          <div><b>Created:</b> {formatDate(reminder.createdAt)}</div>
          <div className="mt-3 d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSaving || isDeleting}>Back</Button>
            {!isEditing && (
              <Button variant="primary" onClick={() => setIsEditing(true)} disabled={isDeleting}>Edit</Button>
            )}
            {isEditing && (
              <>
                <Button variant="success" onClick={handleSave} disabled={isSaving || !formType || !formRemindAt}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" onClick={() => { setIsEditing(false); setFormType(reminder.reminderType); setFormMessage(reminder.message || ""); setFormRemindAt(reminder.remindAt ? reminder.remindAt.slice(0, 16) : ""); }} disabled={isSaving || isDeleting}>Cancel</Button>
              </>
            )}
            {!isEditing && (
              <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
