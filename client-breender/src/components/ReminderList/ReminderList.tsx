import React, { useState, useEffect } from "react";
import { Alert, ListGroup, Spinner, Card, Button, Form, Row, Col } from "react-bootstrap";
import { AnimalReminder } from "../../types/reminder";
import { useParams, useNavigate } from "react-router-dom";
import { getReminders } from "../../api/reminderApi";
import { ReminderType } from "../../types/reminder-type.enum";
import { useUser } from "../../context/UserContext";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from 'react-responsive';

export const ReminderList = () => {
  const [reminders, setReminders] = useState<AnimalReminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id: animalId, userId: paramUserId } = useParams<{ id?: string; userId?: string }>();
  const { userId: contextUserId } = useUser();
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Responsive: detect if mobile
  const isMobile = useMediaQuery({ maxWidth: 600 });

  // Calendar localizer setup
  const locales = {
    'en-US': enUS,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay: (date: Date) => date.getDay(),
    locales,
  });

  // Filter state
  const [filters, setFilters] = useState({
    userId: paramUserId || contextUserId || "",
    animalId: animalId || "",
    reminderType: "",
    message: "",
    remindAtFrom: "",
    remindAtTo: ""
  });

  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Load reminders with filters
  const loadReminders = async () => {
    setIsLoading(true);
    setError(null);
    setReminders([]);
    try {
      // Only send non-empty filters
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });
      const result = await getReminders(activeFilters);
      if (result.status !== 200) {
        throw new Error(result.data?.message || `Failed to fetch reminders: ${result.status}`);
      }
      setReminders(result.data as AnimalReminder[]);
    } catch {
      setError("An unexpected error occurred while fetching reminders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.userId, filters.animalId]);

  // Filter form submit
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadReminders();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Transform reminders to calendar events
  const calendarEvents = reminders.map((reminder) => ({
    id: reminder.id,
    title: reminder.reminderType + (reminder.animal ? ` (${reminder.animal.name})` : ''),
    start: new Date(reminder.remindAt),
    end: new Date(reminder.remindAt),
    allDay: false,
    resource: reminder,
  }));

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
      return <Alert variant="info">No reminders found for the selected filters.</Alert>;
    }
    return (
      <ListGroup variant="flush">
        {reminders.map((reminder) => (
          <ListGroup.Item key={reminder.id} className="mb-3 p-0 border-0 bg-transparent" style={{ background: "none" }}>
            <Card className="shadow-sm bg-light border border-primary">
              <Card.Body className="d-flex justify-content-between align-items-start flex-wrap p-3">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{reminder.reminderType}</div>
                  {reminder.animal && (
                    <div>
                      <small className="text-muted">Animal:</small> {reminder.animal.name} {reminder.animal.breed ? `(${reminder.animal.breed}, ${reminder.animal.species})` : `(${reminder.animal.species})`}
                    </div>
                  )}
                  {reminder.message && (
                    <div>
                      <small className="text-muted">Message:</small> {reminder.message}
                    </div>
                  )}
                </div>
                <span className="text-muted ms-md-3 mt-2 mt-md-0">
                  <small>{formatDate(reminder.remindAt)}</small>
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="ms-3 mt-2 mt-md-0"
                  onClick={() => navigate(`/reminders/${reminder.id}`)}
                >
                  View
                </Button>
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
        <Card.Header className="d-flex flex-column align-items-center">
          <span>Reminders</span>
          {/* View Toggle */}
          <div className="mb-2 mt-2">
            <Button
              variant={view === 'list' ? 'primary' : 'outline-primary'}
              size="sm"
              className="me-2"
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'calendar' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              Calendar View
            </Button>
          </div>
          {/* Filter Form */}
          <Form className="w-100 mt-3" onSubmit={handleFilterSubmit}>
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Reminder Type</Form.Label>
                  <Form.Select name="reminderType" value={filters.reminderType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    {Object.values(ReminderType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Message Contains</Form.Label>
                  <Form.Control type="text" name="message" value={filters.message} onChange={handleFilterChange} placeholder="Search message..." />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Remind At From</Form.Label>
                  <Form.Control type="datetime-local" name="remindAtFrom" value={filters.remindAtFrom} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Remind At To</Form.Label>
                  <Form.Control type="datetime-local" name="remindAtTo" value={filters.remindAtTo} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button type="submit" variant="primary" className="w-100">Apply Filters</Button>
              </Col>
            </Row>
          </Form>
        </Card.Header>
        <div className="p-3 bg-white calendar-responsive-container" style={{ borderRadius: '0 0 0.5rem 0.5rem' }}>
          {view === 'list' ? renderContent() : (
            <div style={{ height: isMobile ? 350 : 500, minWidth: 0 }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: isMobile ? 350 : 500, width: '100%' }}
                popup
                tooltipAccessor={event => event.resource?.message || ''}
                onSelectEvent={event => navigate(`/reminders/${event.id}`)}
                views={isMobile ? ['agenda', 'day'] : undefined}
                defaultView={isMobile ? 'agenda' : 'month'}
                toolbar
              />
            </div>
          )}
        </div>
      </Card>
      <style>{`
        .calendar-responsive-container {
          width: 100%;
          min-width: 0;
        }
        @media (max-width: 600px) {
          .calendar-responsive-container {
            padding: 0.5rem !important;
          }
          .rbc-calendar {
            font-size: 0.92em;
          }
          .rbc-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};
