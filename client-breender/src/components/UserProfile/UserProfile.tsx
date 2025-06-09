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
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", width: "100%" }}>
        {/* Edit Button at the top right, like AnimalProfile */}
        {isOwnProfile && !isEditing && (
          <div className="d-flex justify-content-end mb-2">
            <button
              className="btn btn-primary mt-0 px-4"
              style={{ fontWeight: 500 }}
              onClick={() => setIsEditing(true)}
            >
              <span role="img" aria-label="edit" className="me-2">✏️</span> Edit Profile
            </button>
          </div>
        )}
        <h1 className="text-center mb-4">User Profile</h1>

        <div className="text-center mb-4">
          <img
            src={getProfilePicUrl(userProfile.pictureUrl)}
            alt="User Avatar"
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          {isEditing && isOwnProfile && (
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
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

        {/* Basic Information Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Basic Information</h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Name</label>
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
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{userProfile.name}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Email</label>
              <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{userProfile.email}</p>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Role</label>
              <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{userProfile.role}</p>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Phone</label>
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
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{userProfile.phone || "Not set"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Bio</h5>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="form-control"
              rows={4}
              placeholder="Tell us about yourself..."
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            />
          ) : (
            <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)', minHeight: '60px' }}>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', lineHeight: '1.6' }}>
                {userProfile.bio || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No bio available.</span>}
              </p>
            </div>
          )}
        </div>

        {/* Availability Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Availability</h5>
          {
            isEditing && isOwnProfile ? (
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availabilitySwitch"
                  checked={isAvailable}
                  onChange={handleAvailabilityChange}
                  disabled={availabilityLoading}
                />
                <label className="form-check-label" htmlFor="availabilitySwitch" style={{ color: 'var(--color-text)' }}>
                  {isAvailable ? "Available for Partnership" : "Not Available for Partnership"}
                </label>
              </div>
            ) : (
              <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>
                {isAvailable ? "Available for Partnership" : "Not Available for Partnership"}
              </p>
            )
          }
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Picture URL</label>
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
        )}{/* Tags Section (OWNER only) */}
        {ownerData && (
          <div className="mb-3">
            <h5 className="mb-3 fw-bold" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>🏷️ Tags</h5>
            {isEditing ? (
              <div>
                <p className="mb-3 text-muted small">Select tags that describe your qualities as an owner:</p>
                <div className="row g-2">
                  {AVAILABLE_OWNER_TAGS.map((tag) => {
                    const isSelected = (formData.tags || []).includes(tag);
                    return (
                      <div key={tag} className="col-6 col-sm-4 col-md-3">
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
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.375rem 0.5rem',
                            transition: 'all 0.2s ease',
                            background: isSelected ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                            borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                            color: isSelected ? 'white' : 'var(--color-text)'
                          }}
                        >
                          {isSelected && '✓ '}
                          {tag.charAt(0) + tag.slice(1).toLowerCase()}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-3 p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                    <small className="text-muted">Selected tags: </small>
                    <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>
                      {formData.tags.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase()).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {((ownerData as { tags?: string[] }).tags && (ownerData as { tags?: string[] }).tags!.length > 0) ? (
                  <div className="d-flex flex-wrap gap-2">
                    {(ownerData as { tags?: string[] }).tags!.map((tag) => (
                      <span
                        key={tag}
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          background: 'var(--color-primary)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        {tag.charAt(0) + tag.slice(1).toLowerCase()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                    <i style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>🏷️ No tags assigned</i>
                  </div>
                )}
              </>
            )}
          </div>
        )}{/* Custom Fields Section (OWNER only) */}
        {ownerData && (
          <div className="mb-3">
            <h5 className="mb-3 fw-bold" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Custom Fields</h5>
            {isEditing ? (
              <>
                {customFields.map((field, idx) => (
                  <div className="card mb-3 border-0" key={field.id} style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="card-body p-3">
                      <div className="row g-2">
                        <div className="col-md-5">
                          <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Field Name</label>
                          <input
                            type="text"
                            className="form-control"
                            style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            placeholder="e.g., Experience Level"
                            value={field.key}
                            onChange={e => {
                              const updatedFields = [...customFields];
                              updatedFields[idx] = { ...field, key: e.target.value };
                              setCustomFields(updatedFields);
                              updateCustomFieldsInFormData(updatedFields);
                            }}
                          />
                        </div>
                        <div className="col-md-5">
                          <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Value</label>
                          <textarea
                            className="form-control"
                            style={{ 
                              background: 'var(--color-bg)', 
                              color: 'var(--color-text)', 
                              border: '1px solid var(--color-border)',
                              minHeight: '38px',
                              resize: 'vertical'
                            }}
                            placeholder="Enter value..."
                            value={field.value}
                            rows={1}
                            onChange={e => {
                              const updatedFields = [...customFields];
                              updatedFields[idx] = { ...field, value: e.target.value };
                              setCustomFields(updatedFields);
                              updateCustomFieldsInFormData(updatedFields);
                            }}
                            onInput={(e) => {
                              // Auto-resize textarea based on content
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = Math.max(38, target.scrollHeight) + 'px';
                            }}
                          />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                          <button
                            className="btn btn-outline-danger w-100"
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
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-outline-primary"
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
              </>
            ) : (
              <>
                {(ownerData.customData && Object.keys(ownerData.customData as Record<string, unknown>).length > 0) ? (
                  <div className="row g-3">
                    {Object.entries(ownerData.customData as Record<string, unknown>).map(([key, value]) => (
                      <div className="col-12" key={key}>
                        <div className="card border-0 h-100" style={{ background: 'var(--color-bg-secondary)' }}>
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="card-title mb-1 text-uppercase small fw-bold" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                                  {key}
                                </h6>
                                <p className="card-text mb-0" style={{ 
                                  color: 'var(--color-text)', 
                                  wordBreak: 'break-word',
                                  overflowWrap: 'anywhere',
                                  whiteSpace: 'pre-wrap',
                                  lineHeight: '1.5',
                                  maxWidth: '100%',
                                  fontWeight: '500'
                                }}>
                                  {String(value)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                    <i style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>📝 No custom fields added</i>
                  </div>
                )}
              </>
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
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
