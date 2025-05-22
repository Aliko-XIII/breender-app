import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Adjust the path as needed
// Import CSS module for styling
import styles from './UserMention.module.css'; // Make sure this file exists

// Update props to include email and optional picture URL
interface UserMentionProps {
    userId: string;
    userName: string;
    userEmail: string; // Add email prop
    userPictureUrl?: string | null; // Add optional picture URL prop
    clickable?: boolean; // Add clickable prop
}

// Helper to get absolute URL for profile picture
const getProfilePicUrl = (url?: string | null) => {
    if (!url) return '/avatar-placeholder.png';
    if (url.startsWith('/uploads/')) {
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
    }
    return url;
};

/**
 * Renders a user mention with profile picture, name (linkable if self), and email.
 */
export const UserMention: React.FC<UserMentionProps> = ({
    userId,
    userName,
    userEmail, // Destructure new prop
    userPictureUrl, // Destructure new prop
    clickable = false // Destructure clickable prop, default false
}) => {
    const { userId: loggedInUserId, isLoading: isUserContextLoading } = useUser();

    // Helper component to render the name conditionally (Link or span)
    const NameComponent = () => {
        // Wait for context before deciding on link type
        if (isUserContextLoading) {
            return <span className={styles.userName}>{userName}</span>;
        }

        // If clickable, always link to public profile (but use /user-profile/:id for self)
        if (clickable) {
            if (loggedInUserId === userId) {
                return (
                    <Link to={`/user-profile`} className={styles.userNameLink}>
                        {userName}
                    </Link>
                );
            } else {
                return (
                    <Link to={`/user-profile/${userId}`} className={styles.userNameLink}>
                        {userName}
                    </Link>
                );
            }
        }

        // Link to personal profile if the ID matches the logged-in user
        if (loggedInUserId === userId) {
            return (
                <Link to="/user-profile" className={styles.userNameLink}>
                    {userName}
                </Link>
            );
        } else {
            // Otherwise, just display the name as text
            return <span className={styles.userName}>{userName}</span>;
        }
    };

    return (
        // Main container using Flexbox for layout
        <div className={styles.userMentionContainer} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 6 }}>
            {/* Profile Picture */}
            <img
                // Use provided picture URL or fallback to a placeholder
                src={getProfilePicUrl(userPictureUrl)}
                alt={`${userName}'s avatar`}
                className={styles.avatar}
                style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                // Add basic error handling for images
                onError={(e) => {
                    // If the provided image fails to load, fall back to the placeholder
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/avatar-placeholder.png') {
                        target.src = '/avatar-placeholder.png';
                    }
                }}
            />
            {/* Container for text info (Name and Email) */}
            <div className={styles.userInfo} style={{ color: 'var(--color-text)' }}>
                {/* Render the name using the helper component */}
                <NameComponent />
                {/* Display the user's email below the name */}
                <span className={styles.userEmail} style={{ color: 'var(--color-text-secondary)' }}>{userEmail}</span>
            </div>
        </div>
    );
};
