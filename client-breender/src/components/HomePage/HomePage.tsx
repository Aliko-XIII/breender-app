import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext'; // Verify the path is correct
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../types'; // Verify the path is correct
import { getReminders } from '../../api/reminderApi';
import { AnimalReminder } from '../../types/reminder';
import { getPartnerships } from '../../api/partnershipApi';
import { getAnimals } from '../../api/animalApi';
import './HomePage.css';

// Interface for the profile data we want to display on the home page
interface UserProfileSummary {
    name: string;
    email: string;
    pictureUrl?: string;
}

// Interface for the component's props
interface HomePageProps {
    getUser: (userId: string, includeProfile: boolean) => Promise<ApiResponse>;
}

export const HomePage: React.FC<HomePageProps> = ({ getUser }) => {
    const { userId, isLoading: isUserContextLoading } = useUser();
    const [profileSummary, setProfileSummary] = useState<UserProfileSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Local loading state for the profile fetch
    const [reminders, setReminders] = useState<AnimalReminder[]>([]);
    const [remindersLoading, setRemindersLoading] = useState(false);
    const [remindersError, setRemindersError] = useState<string | null>(null);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false);
    const [pendingRequestsError, setPendingRequestsError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfileSummary = async () => {
            // Wait until UserContext has loaded the userId
            if (isUserContextLoading) {
                return;
            }

            // If userId is missing after UserContext load, redirect to login
            if (!userId) {
                navigate('/login');
                return;
            }

            setIsLoading(true); // Start loading profile data
            try {
                const response = await getUser(userId, true); // Fetch user data including the profile

                // Check for successful response and data presence
                if (response.status === 200 && response.data) {
                    // If the profile hasn't been created yet, redirect to the setup page
                    if (!response.data.profile) {
                        console.warn("User profile not found, redirecting to /setup-profile");
                        navigate('/setup-profile');
                        return; // Stop execution to avoid errors
                    }

                    setProfileSummary({
                        name: response.data.profile.name,
                        email: response.data.email,
                        pictureUrl: response.data.profile.pictureUrl,
                    });
                } else {
                    console.error("Failed to load profile data:", response.message || 'Non-200 response status');
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfileSummary();
    }, [userId, isUserContextLoading, getUser, navigate]);

    useEffect(() => {
        const fetchReminders = async () => {
            if (!userId) return;
            setRemindersLoading(true);
            setRemindersError(null);
            try {
                const res = await getReminders({ userId });
                if (res.status === 200 && Array.isArray(res.data)) {
                    setReminders(res.data);
                } else {
                    setRemindersError('Failed to load reminders');
                }
            } catch (e) {
                setRemindersError('Failed to load reminders');
            } finally {
                setRemindersLoading(false);
            }
        };
        if (userId) fetchReminders();
    }, [userId]);

    useEffect(() => {
        // Fetch pending partnership requests for my animals
        const fetchPendingRequests = async () => {
            if (!userId) return;
            setPendingRequestsLoading(true);
            setPendingRequestsError(null);
            try {
                const animalsRes = await getAnimals({ userId });
                if (animalsRes.status !== 200 || !Array.isArray(animalsRes.data)) {
                    setPendingRequestsError('Could not load your animals.');
                    setPendingRequests([]);
                    return;
                }
                const myAnimalIds = animalsRes.data.map((a: any) => a.id);
                if (myAnimalIds.length === 0) {
                    setPendingRequests([]);
                    return;
                }
                const reqRes = await getPartnerships({ recipientAnimalId: myAnimalIds.join(','), status: 'PENDING' });
                if (reqRes.status === 200 && Array.isArray(reqRes.data)) {
                    // Only show requests where requester is not the current user
                    setPendingRequests(reqRes.data.filter((r: any) => r.requesterAnimalId && !myAnimalIds.includes(r.requesterAnimalId)));
                } else {
                    setPendingRequestsError('Could not load requests.');
                }
            } catch (e) {
                setPendingRequestsError('Could not load requests.');
            } finally {
                setPendingRequestsLoading(false);
            }
        };
        if (userId) fetchPendingRequests();
    }, [userId]);

    // Helper to group reminders
    function groupReminders(reminders: AnimalReminder[]) {
        const today: AnimalReminder[] = [];
        const tomorrow: AnimalReminder[] = [];
        const week: AnimalReminder[] = [];
        const now = new Date();
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        const startOfTomorrow = new Date(endOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const endOfTomorrow = new Date(startOfTomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        reminders.forEach(reminder => {
            const remindAt = new Date(reminder.remindAt);
            if (remindAt <= endOfToday && remindAt >= now) {
                today.push(reminder);
            } else if (remindAt > endOfToday && remindAt <= endOfTomorrow) {
                tomorrow.push(reminder);
            } else if (remindAt > endOfTomorrow && remindAt <= endOfWeek) {
                week.push(reminder);
            }
        });
        return { today, tomorrow, week };
    }

    if (isUserContextLoading || isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!profileSummary) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Could not load profile information. Please try refreshing the page or logging in again.
                </div>
            </div>
        );
     }


    // Main page layout
    return (
        <div className="container home-page mt-4">
            <h1 className="mb-4">Home Page</h1>

            {/* Section: User Account Summary */}
            <div className="card profile-summary-card mb-4 shadow-sm">
                <div className="card-header">
                   Your Profile Summary
                </div>
                <div className="card-body d-flex align-items-center">
                    <img
                        src={profileSummary.pictureUrl || '/avatar-placeholder.png'} // Use placeholder if no picture
                        alt="User Avatar"
                        className="rounded-circle me-3"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div>
                        <h5 className="card-title mb-1">{profileSummary.name}</h5>
                        <p className="card-text text-muted mb-2">{profileSummary.email}</p>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/user-profile')}>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Section: Reminders */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">Upcoming Reminders</h5>
                                <button className="btn btn-link p-0 ms-2" onClick={() => navigate(`/users/${userId}/reminders`)}>View All</button>
                            </div>
                            {remindersLoading ? (
                                <div className="text-center"><div className="spinner-border" role="status" /><p>Loading reminders...</p></div>
                            ) : remindersError ? (
                                <div className="alert alert-danger">{remindersError}</div>
                            ) : (
                                (() => {
                                    const { today, tomorrow, week } = groupReminders(reminders);
                                    const renderCardGroup = (label: string, items: AnimalReminder[]) => (
                                        <div className="mb-2">
                                            <strong>{label}</strong>
                                            <div className="d-flex flex-column gap-2 mt-1">
                                                {items.map(r => (
                                                    <div
                                                        key={r.id}
                                                        className="card shadow-sm border-primary reminder-mini-card w-100"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => navigate(`/reminders/${r.id}`)}
                                                        tabIndex={0}
                                                        role="button"
                                                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/reminders/${r.id}`); }}
                                                    >
                                                        <div className="card-body p-2">
                                                            <div className="fw-bold small">{r.reminderType}</div>
                                                            {r.animal && <div className="small">for <b>{r.animal.name}</b></div>}
                                                            {r.message && <div className="small text-muted">{r.message}</div>}
                                                            <div className="small text-end text-primary mt-1">
                                                                {label === 'Today' || label === 'Tomorrow'
                                                                    ? new Date(r.remindAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                                    : new Date(r.remindAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                    return (
                                        <div>
                                            {today.length > 0 && renderCardGroup('Today', today)}
                                            {tomorrow.length > 0 && renderCardGroup('Tomorrow', tomorrow)}
                                            {week.length > 0 && renderCardGroup('During a week', week)}
                                            {today.length === 0 && tomorrow.length === 0 && week.length === 0 && (
                                                <div className="text-muted">No upcoming reminders for the next week.</div>
                                            )}
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </div>

                {/* Section: Requests & Messages */}
                <div className="col-md-6 mb-4">
                    <div className="card placeholder-card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Requests & Messages</h5>
                            <div className="mt-3">
                                <h6>Pending Partnership Requests</h6>
                                {pendingRequestsLoading ? (
                                    <div className="text-muted">Loading requests...</div>
                                ) : pendingRequestsError ? (
                                    <div className="alert alert-danger">{pendingRequestsError}</div>
                                ) : pendingRequests.length === 0 ? (
                                    <div className="text-muted">No pending requests from other users.</div>
                                ) : (
                                    <ul className="list-group">
                                        {pendingRequests.map((req) => (
                                            <li className="list-group-item" key={req.id}>
                                                <div>
                                                    <b>{req.requesterAnimal?.name || req.requesterAnimalId}</b> → <b>{req.recipientAnimal?.name || req.recipientAnimalId}</b>
                                                </div>
                                                <div className="small text-muted">Requested at: {req.requestedAt ? new Date(req.requestedAt).toLocaleString() : '-'}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Add this to the HomePage.css or in a <style> tag if you want a little hover effect: */
/*
.reminder-mini-card:hover, .reminder-mini-card:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13,110,253,.25);
  background: #f8f9fa;
}
*/