import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext'; // Verify the path is correct
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../types'; // Verify the path is correct
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
                {/* Section: Reminders (Placeholder) */}
                <div className="col-md-6 mb-4">
                    <div className="card placeholder-card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Upcoming Reminders</h5>
                            <p className="card-text"><i>[Care reminders component will go here]</i></p>
                             {/* Optional: Add a button or link if needed */}
                             {/* <a href="#" className="btn btn-primary mt-auto">View All</a> */}
                        </div>
                    </div>
                </div>

                {/* Section: Requests & Messages (Placeholder) */}
                <div className="col-md-6 mb-4">
                    <div className="card placeholder-card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Requests & Messages</h5>
                            <p className="card-text"><i>[Requests and messages component from other owners will go here]</i></p>
                             {/* Optional: Add a button or link */}
                             {/* <a href="#" className="btn btn-primary mt-auto">View All</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};