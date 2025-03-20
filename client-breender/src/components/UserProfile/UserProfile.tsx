import React, { useEffect, useState } from "react";

interface UserProfileData {
    name: string;
    bio: string;
    pictureUrl: string | null;
    phone: string | null;
    email: string;
    role: "OWNER" | "VET" | "ADMIN";
}

export const UserProfile = () => {
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // const response = await fetch(`/api/users/${userId}/profile`);
                // const data: UserProfileData = await response.json();

                const data: UserProfileData = {
                    name: "John Doe",
                    bio: "Animal lover and breeder.",
                    pictureUrl: "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
                    phone: "+1234567890",
                    email: "test@mail.com",
                    role: "OWNER",
                };
                setUserProfile(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h1 className="text-center mb-4">User Profile</h1>

                <div className="text-center mb-3">
                    {userProfile.pictureUrl ? (
                        <img
                            src={userProfile.pictureUrl}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                    ) : (
                        <div className="rounded-circle" style={{ width: "150px", height: "150px", backgroundColor: "#ddd" }} />
                    )}
                </div>

                <div className="mb-3">
                    <strong>Name:</strong>
                    <p>{userProfile.name}</p>
                </div>

                <div className="mb-3">
                    <strong>Email:</strong>
                    <p>{userProfile.email}</p>
                </div>

                <div className="mb-3">
                    <strong>Role:</strong>
                    <p>{userProfile.role}</p>
                </div>

                <div className="mb-3">
                    <strong>Phone:</strong>
                    <p>{userProfile.phone ? userProfile.phone : "Not provided"}</p>
                </div>

                <div className="mb-3">
                    <strong>Bio:</strong>
                    <p>{userProfile.bio}</p>
                </div>
            </div>
        </div>
    );
};
