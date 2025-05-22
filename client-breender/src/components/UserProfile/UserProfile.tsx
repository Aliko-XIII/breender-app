import React, { useEffect, useState } from "react";
import { ApiResponse } from "../../types";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUserProfilePic } from "../../api/userApi";
import { getOwnerByUserId, switchOwnerAvailability } from "../../api/ownerApi";

interface UserProfileData {
  name: string;
  bio?: string;
  pictureUrl?: string;
  phone?: string;
  email: string;
  role: "OWNER" | "ADMIN";
  isAvailable?: boolean; // Owner availability
}

interface UserProfileProps {
  getUser: (userId: string, includeProfile: boolean) => Promise<ApiResponse>;
  updateUser: (userId: string, data: Partial<UserProfileData>) => Promise<ApiResponse>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ getUser, updateUser }) => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const { userId: currentUserId, isLoading } = useUser();
  const { id: routeUserId } = useParams();
  const navigate = useNavigate();

  const isOwnProfile = !routeUserId || routeUserId === currentUserId;
  const userIdToLoad = routeUserId || currentUserId;

  // Helper to get absolute URL for profile picture
  const getProfilePicUrl = (url?: string) => {
    if (!url) return "/avatar-placeholder.png";
    if (url.startsWith("/uploads/")) {
      // You may want to use an environment variable for API base URL
      return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}${url}`;
    }
    return url;
  };

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

        // Fetch owner availability if user is OWNER
        if (response.data.role === "OWNER") {
          const ownerRes = await getOwnerByUserId(userIdToLoad);
          if (ownerRes.status === 200 && ownerRes.data) {
            setOwnerId(ownerRes.data.id);
            setIsAvailable(ownerRes.data.is_available);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userIdToLoad, navigate, getUser, isOwnProfile, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPic = async () => {
    if (!selectedFile || !currentUserId) return;
    setUploading(true);
    try {
      const res = await uploadUserProfilePic(currentUserId, selectedFile);
      if ((res.status === 200 || res.status === 201) && res.data.url) {
        setUserProfile((prev) => (prev ? { ...prev, pictureUrl: res.data.url } : prev));
        setFormData((prev) => ({ ...prev, pictureUrl: res.data.url }));
        setSelectedFile(null);
        alert("Profile picture updated!");
      } else {
        alert("Failed to upload profile picture.");
      }
    } catch {
      alert("Error uploading profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvailabilityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ownerId) return;
    setAvailabilityLoading(true);
    try {
      const newValue = e.target.checked;
      const res = await switchOwnerAvailability(ownerId, newValue);
      if (res.status === 200) {
        setIsAvailable(newValue);
        alert("Availability updated!");
      } else {
        alert("Failed to update availability");
      }
    } catch (err) {
      alert("Error updating availability");
    } finally {
      setAvailabilityLoading(false);
    }
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h1 className="text-center mb-4">User Profile</h1>

        <div className="text-center mb-3">
          <img
            src={getProfilePicUrl(userProfile.pictureUrl)}
            alt="User Avatar"
            className="rounded-circle"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          {isEditing && isOwnProfile && (
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={handleUploadPic}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
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
            <p className="mt-1" style={{ whiteSpace: "pre-wrap" }}>{userProfile.bio || "Not set"}</p>
          )}
        </div>

        <div className="mb-3">
          <label>Availability for Partnership:</label>
          {userProfile.role === "OWNER" && isAvailable !== null ? (
            isEditing && isOwnProfile ? (
              <div className="form-check form-switch ms-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availabilitySwitch"
                  checked={isAvailable}
                  onChange={handleAvailabilityChange}
                  disabled={availabilityLoading}
                />
                <label className="form-check-label" htmlFor="availabilitySwitch">
                  {isAvailable ? "Available" : "Not Available"}
                </label>
              </div>
            ) : (
              <span className="ms-2">{isAvailable ? "Available" : "Not Available"}</span>
            )
          ) : null}
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
