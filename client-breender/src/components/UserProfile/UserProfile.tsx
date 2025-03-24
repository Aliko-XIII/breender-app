import React, { useEffect, useState } from "react";
import { ApiResponse } from "../../types";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface UserProfileData {
    name: string;
    bio?: string;
    pictureUrl?: string;
    phone?: string;
    email: string;
    role: "OWNER" | "VET" | "ADMIN";
}

interface UserProfileProps {
    getUser: (userId: string, includeProfile: boolean) => Promise<ApiResponse>;
    updateUser: (userId: string, data: Partial<UserProfileData>) => Promise<ApiResponse>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ getUser, updateUser }) => {
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const { userId, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (isLoading) return;

                if (!userId) {
                    navigate("/login");
                    return;
                }

                const response = await getUser(userId, true);
                if (!response.data.profile) navigate("/setup-profile");
                setUserProfile({
                    name: response.data.profile.name,
                    bio: response.data.profile.bio,
                    pictureUrl: response.data.profile.pictureUrl,
                    phone: response.data.profile.phone,
                    email: response.data.email,
                    role: response.data.role,
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [userId, navigate, getUser, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (userProfile) {
            setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (userId && userProfile) {
            try {
                await updateUser(userId, userProfile);
                alert("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile.");
            }
        }
    };

    if (isLoading || !userProfile) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h1 className="text-center mb-4">User Profile</h1>

                <div className="text-center mb-3">
                    <img
                        src={userProfile.pictureUrl || "/avatar-placeholder.png"}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                </div>

                <div className="mb-3">
                    <label>Name:</label>
                    <input type="text" name="name" value={userProfile.name} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>Email:</label>
                    <p>{userProfile.email}</p>
                </div>

                <div className="mb-3">
                    <label>Role:</label>
                    <p>{userProfile.role}</p>
                </div>

                <div className="mb-3">
                    <label>Phone:</label>
                    <input type="text" name="phone" value={userProfile.phone || ""} onChange={handleChange} className="form-control" placeholder="Not set" />
                </div>

                <div className="mb-3">
                    <label>Bio:</label>
                    <textarea name="bio" value={userProfile.bio} onChange={handleChange} className="form-control" placeholder="Not set" />
                </div>

                <div className="mb-3">
                    <label>Picture URL:</label>
                    <input type="text" name="pictureUrl" value={userProfile.pictureUrl || ""} onChange={handleChange} className="form-control" placeholder="Not set" />
                </div>

                <button onClick={handleSave} className="btn btn-primary w-100">Save</button>
            </div>
        </div>
    );
};