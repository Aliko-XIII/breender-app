import React, { useEffect, useState } from "react";
import { ApiResponse } from "../../types";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

interface UserProfileData {
  name: string;
  bio?: string;
  pictureUrl?: string;
  phone?: string;
  email: string;
  role: "OWNER" | "ADMIN";
}

interface UserProfileProps {
  getUser: (userId: string, includeProfile: boolean) => Promise<ApiResponse>;
  updateUser: (userId: string, data: Partial<UserProfileData>) => Promise<ApiResponse>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ getUser, updateUser }) => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { userId: currentUserId, isLoading } = useUser();
  const { id: routeUserId } = useParams();
  const navigate = useNavigate();

  const isOwnProfile = !routeUserId || routeUserId === currentUserId;
  const userIdToLoad = routeUserId || currentUserId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoading || !userIdToLoad) return;

      try {
        const response = await getUser(userIdToLoad, true);
        if (!response.data.profile && isOwnProfile) {
          navigate("/setup-profile");
          return;
        }

        const profileData: UserProfileData = {
          name: response.data.profile.name,
          bio: response.data.profile.bio,
          pictureUrl: response.data.profile.pictureUrl,
          phone: response.data.profile.phone,
          email: response.data.email,
          role: response.data.role,
        };
        setUserProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdToLoad, navigate, getUser, isOwnProfile, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (isOwnProfile && currentUserId && formData) {
      try {
        await updateUser(currentUserId, formData);
        setUserProfile({ ...userProfile!, ...formData });
        setIsEditing(false);
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
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span className="ms-2">{userProfile.name}</span>
          )}
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <span className="ms-2">{userProfile.email}</span>
        </div>

        <div className="mb-3">
          <label>Role:</label>
          <span className="ms-2">{userProfile.role}</span>
        </div>

        <div className="mb-3">
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Not set"
            />
          ) : (
            <span className="ms-2">{userProfile.phone || "Not set"}</span>
          )}
        </div>

        <div className="mb-3">
          <label>Bio:</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Not set"
            />
          ) : (
            <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{userProfile.bio || "Not set"}</p>
          )}
        </div>

        {isEditing && (
          <div className="mb-3">
            <label>Picture URL:</label>
            <input
              type="text"
              name="pictureUrl"
              value={formData.pictureUrl || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Not set"
            />
          </div>
        )}

        {isOwnProfile && (
          <div className="mt-3">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-success me-2">
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(userProfile);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
