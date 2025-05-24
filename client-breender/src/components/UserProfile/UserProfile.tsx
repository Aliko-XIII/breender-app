import React, { useEffect, useState } from "react";
import { ApiResponse } from "../../types";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUserProfilePic } from "../../api/userApi";
import { getOwnerByUserId, switchOwnerAvailability, updateOwner } from "../../api/ownerApi";

interface UserProfileData {
  name: string;
  bio?: string;
  pictureUrl?: string;
  phone?: string;
  email: string;
  role: "OWNER" | "ADMIN";
  isAvailable?: boolean; // Owner availability
  tags?: string[];
  customData?: Record<string, string>;
}

// Add available owner tags constant
const AVAILABLE_OWNER_TAGS = [
  'RESPONSIBLE', 'EXPERIENCED', 'FRIENDLY', 'COMMUNICATIVE', 'CARING', 'ORGANIZED',
  'TRUSTWORTHY', 'PATIENT', 'KNOWLEDGEABLE', 'ACTIVE', 'SUPPORTIVE', 'FLEXIBLE',
  'DEDICATED', 'PUNCTUAL', 'EDUCATED', 'SOCIAL', 'CALM', 'ENTHUSIASTIC', 'ADAPTIVE', 'HELPFUL'
] as const;

interface CustomField {
  id: string;
  key: string;
  value: string;
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
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [ownerData, setOwnerData] = useState<Record<string, unknown> | null>(null);
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

        // Always fetch owner record for the user
        const ownerRes = await getOwnerByUserId(userIdToLoad);
        if (ownerRes.status === 200 && ownerRes.data) {
          setOwnerId(ownerRes.data.id);
          setIsAvailable(ownerRes.data.is_available);
          setOwnerData(ownerRes.data);
          // Initialize custom fields array from ownerData
          const cd = ownerRes.data.customData;
          let customDataObj = {};
          if (cd) {
            if (typeof cd === 'string') {
              try { customDataObj = JSON.parse(cd); } catch { customDataObj = {}; }
            } else {
              customDataObj = cd;
            }
          }
          const fieldsArray: CustomField[] = Object.entries(customDataObj).map(([key, value]) => ({
            id: `${Date.now()}-${Math.random()}`,
            key,
            value: String(value)
          }));
          setCustomFields(fieldsArray);
          // Also update formData with tags/customData from owner
          setFormData(prev => ({
            ...prev,
            tags: ownerRes.data.tags || [],
            customData: customDataObj
          }));
        } else {
          setOwnerData(null);
          setOwnerId(null);
          setIsAvailable(null);
          setCustomFields([]);
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
    } catch {
      alert("Error updating availability");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Helper function to convert custom fields array to object
  const customFieldsToObject = (fields: CustomField[]): Record<string, string> => {
    const result: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key.trim()) {
        result[field.key] = field.value;
      }
    });
    return result;
  };

  // Helper function to update custom fields in formData
  const updateCustomFieldsInFormData = (fields: CustomField[]) => {
    const customDataObject = customFieldsToObject(fields);
    setFormData(prev => ({ ...prev, customData: customDataObject }));
  };

  const handleSave = async () => {
    if (isOwnProfile && currentUserId && formData) {
      try {
        // Prepare user profile fields (exclude tags/customData)
        const { tags, customData, ...userFields } = formData;
        await updateUser(currentUserId, userFields);
        // If OWNER, update tags and customData via owner endpoint
        if (ownerId) {
          const ownerUpdate: { tags?: string[]; customData?: Record<string, string> } = {};
          if (Array.isArray(tags) && tags.length > 0) ownerUpdate.tags = tags;
          if (customData && Object.keys(customData).length > 0) ownerUpdate.customData = customData;
          if (Object.keys(ownerUpdate).length > 0) {
            await updateOwner(ownerId, ownerUpdate);
            // Update ownerData state so UI reflects changes immediately
            setOwnerData(prev => ({
              ...(prev || {}),
              ...(ownerUpdate.tags ? { tags: ownerUpdate.tags } : {}),
              ...(ownerUpdate.customData ? { customData: ownerUpdate.customData } : {}),
            }));
          }
        }
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
            <div className="mt-2 d-flex align-items-center justify-content-center gap-2">
              <label htmlFor="profilePicUpload" className="btn btn-outline-primary btn-sm mb-0">
                Choose File
              </label>
              <input
                id="profilePicUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span className="text-secondary small">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
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
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
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
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
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
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
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
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            />
          </div>
        )}

        {/* Tags Section (OWNER only) */}
        {(ownerData) && (
          <div className="mb-3">
            <label>Tags:</label>
            {isEditing ? (
              <div className="row g-2 mt-1">
                {AVAILABLE_OWNER_TAGS.map((tag) => {
                  const isSelected = (formData.tags || []).includes(tag);
                  return (
                    <div key={tag} className="col-6 col-sm-4">
                      <button
                        type="button"
                        className={`btn w-100 btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => {
                          const currentTags = formData.tags || [];
                          const newTags = isSelected
                            ? currentTags.filter(t => t !== tag)
                            : [...currentTags, tag];
                          setFormData({ ...formData, tags: newTags });
                        }}
                        style={{ fontSize: '0.85rem', marginBottom: 4 }}
                      >
                        {isSelected && '✓ '}{tag.charAt(0) + tag.slice(1).toLowerCase()}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2">
                {((ownerData as { tags?: string[] }).tags && (ownerData as { tags?: string[] }).tags!.length > 0) ? (
                  <div className="d-flex flex-wrap gap-2">
                    {(ownerData as { tags?: string[] }).tags!.map((tag) => (
                      <span key={tag} className="badge rounded-pill px-3 py-2 bg-primary text-white" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {tag.charAt(0) + tag.slice(1).toLowerCase()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">No tags assigned</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Fields Section (OWNER only) */}
        {(ownerData) && (
          <div className="mb-3">
            <label>Custom Fields:</label>
            {isEditing ? (
              <div>
                {customFields.length > 0 ? (
                  <div className="row g-3">
                    {customFields.map((field, idx) => (
                      <div className="col-12 d-flex align-items-center gap-2" key={field.id}>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Field Name"
                          value={field.key}
                          onChange={e => {
                            const updatedFields = [...customFields];
                            updatedFields[idx] = { ...field, key: e.target.value };
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                        />
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Value"
                          value={field.value}
                          onChange={e => {
                            const updatedFields = [...customFields];
                            updatedFields[idx] = { ...field, value: e.target.value };
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                        />
                        <button
                          className="btn btn-outline-danger btn-sm"
                          type="button"
                          onClick={() => {
                            const updatedFields = customFields.filter((_, i) => i !== idx);
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">No custom fields added</div>
                )}
                <button
                  className="btn btn-outline-primary btn-sm mt-2"
                  type="button"
                  onClick={() => {
                    const newField: CustomField = {
                      id: `${Date.now()}-${Math.random()}`,
                      key: "",
                      value: ""
                    };
                    const updatedFields = [...customFields, newField];
                    setCustomFields(updatedFields);
                    updateCustomFieldsInFormData(updatedFields);
                  }}
                >
                  + Add Custom Field
                </button>
              </div>
            ) : (
              <div className="mt-2">
                {(ownerData.customData && Object.keys(ownerData.customData as Record<string, unknown>).length > 0) ? (
                  <div className="row g-3">
                    {Object.entries(ownerData.customData as Record<string, unknown>).map(([key, value]) => (
                      <div className="col-12 d-flex align-items-center gap-2" key={key}>
                        <span className="fw-bold" style={{ minWidth: 100 }}>{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">No custom fields added</span>
                )}
              </div>
            )}
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
