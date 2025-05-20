import React, { useEffect, useState } from "react";
import { getPartnerships, acceptPartnership, rejectPartnership, cancelPartnership, reopenPartnership } from "../api/partnershipApi";
import { getAnimal } from "../api/animalApi";
import { Link, useNavigate } from "react-router-dom";
import { UserMention } from "./UserMention/UserMention";
import { useUser } from "../context/UserContext";
import { getChats, createChat } from "../api/chatApi";

const TABS = ["ACCEPTED", "PENDING", "REJECTED", "CANCELED"] as const;
type TabType = typeof TABS[number];

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string | null;
}

interface AnimalInfo {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  pictureUrl?: string | null;
  owners: OwnerInfo[];
}

interface PartnershipWithDetails {
  id: string;
  status: string;
  requestedAt?: string;
  respondedAt?: string;
  requesterAnimalId: string;
  recipientAnimalId: string;
  requesterAnimal?: AnimalInfo;
  recipientAnimal?: AnimalInfo;
}

// Helper to get animal profile pic URL
const getAnimalProfilePicUrl = (url?: string | null) => {
  if (!url) return '/animal-placeholder.png';
  if (url.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
  }
  return url;
};

export const PartnershipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ACCEPTED");
  const [partnerships, setPartnerships] = useState<PartnershipWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPartnerships()
      .then(async (res) => {
        if (res.status === 200) {
          const rawPartnerships = res.data;
          const animalIds = Array.from(new Set([
            ...rawPartnerships.map((p: any) => p.requesterAnimalId),
            ...rawPartnerships.map((p: any) => p.recipientAnimalId),
          ]));
          const animalResults = await Promise.all(
            animalIds.map((id) => getAnimal(id))
          );
          const animalMap: Record<string, AnimalInfo> = {};
          animalResults.forEach((result, idx) => {
            if (result.status === 200 && result.data) {
              const animal = result.data;
              animalMap[animal.id] = {
                id: animal.id,
                name: animal.name,
                species: animal.species,
                breed: animal.breed,
                pictureUrl: animal.pictureUrl,
                owners: (animal.owners || []).map((ownerRel: any) => {
                  const user = ownerRel?.owner?.user;
                  const profile = user?.userProfile;
                  return {
                    id: user?.id,
                    name: profile?.name || user?.email || "Unknown",
                    email: user?.email || "",
                    pictureUrl: profile?.pictureUrl || null,
                  };
                }).filter((o: OwnerInfo) => o.id && o.name && o.email),
              };
            }
          });
          const partnershipsWithDetails: PartnershipWithDetails[] = rawPartnerships.map((p: any) => ({
            ...p,
            requesterAnimal: animalMap[p.requesterAnimalId],
            recipientAnimal: animalMap[p.recipientAnimalId],
          }));
          setPartnerships(partnershipsWithDetails);
          setError(null);
        } else {
          setError("Failed to load partnership requests.");
        }
      })
      .catch(() => setError("Failed to load partnership requests."))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id: string) => {
    await acceptPartnership(id);
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await rejectPartnership(id);
    window.location.reload();
  };

  const handleCancel = async (id: string) => {
    await cancelPartnership(id);
    window.location.reload();
  };

  const handleReopen = async (id: string) => {
    await reopenPartnership(id);
    window.location.reload();
  };

  const handleChat = async (otherUserId: string) => {
    if (!currentUserId || !otherUserId) return;
    const chatsRes = await getChats();
    let chat = null;
    if (chatsRes.status === 200 && Array.isArray(chatsRes.data)) {
      chat = chatsRes.data.find((c: any) =>
        c.participants &&
        c.participants.some((p: any) => p.userId === currentUserId) &&
        c.participants.some((p: any) => p.userId === otherUserId)
      );
    }
    if (!chat) {
      const createRes = await createChat([currentUserId, otherUserId]);
      if (createRes.status === 200 || createRes.status === 201) {
        chat = createRes.data;
      }
    }
    if (chat) {
      navigate(`/chat/${otherUserId}`);
    }
  };

  // Count partnerships by status for tab counters
  const tabCounts: Record<TabType, number> = {
    ACCEPTED: partnerships.filter((p) => p.status === "ACCEPTED").length,
    PENDING: partnerships.filter((p) => p.status === "PENDING").length,
    REJECTED: partnerships.filter((p) => p.status === "REJECTED").length,
    CANCELED: partnerships.filter((p) => p.status === "CANCELED").length,
  };

  const filtered = partnerships.filter((p) => p.status === activeTab);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Partnership Requests</h2>
      <ul className="nav nav-tabs mb-3">
        {TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()} <span className="badge bg-light text-dark ms-1">{tabCounts[tab]}</span>
            </button>
          </li>
        ))}
      </ul>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info">No {activeTab.toLowerCase()} requests.</div>
      ) : (
        <ul className="list-group">
          {filtered.map((p) => {
            let actionButtons = null;
            const showChatBtn = (activeTab === "PENDING" || activeTab === "ACCEPTED") && p.requesterAnimal && p.recipientAnimal && p.requesterAnimal.owners.length > 0 && p.recipientAnimal.owners.length > 0;
            if (activeTab === "PENDING" && p.requesterAnimal && p.requesterAnimal.owners.length > 0) {
              const isMine = p.requesterAnimal.owners.some((o) => o.id === currentUserId);
              if (isMine) {
                actionButtons = (
                  <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleCancel(p.id)}>
                    Cancel
                  </button>
                );
              } else {
                actionButtons = (
                  <>
                    <button className="btn btn-outline-success btn-sm ms-2" onClick={() => handleAccept(p.id)}>
                      Accept
                    </button>
                    <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleReject(p.id)}>
                      Reject
                    </button>
                  </>
                );
              }
            } else if (activeTab === "ACCEPTED" && p.requesterAnimal && p.requesterAnimal.owners.length > 0) {
              // Allow cancel for accepted partnerships if current user is requester owner
              const isMine = p.requesterAnimal.owners.some((o) => o.id === currentUserId);
              if (isMine) {
                actionButtons = (
                  <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleCancel(p.id)}>
                    Cancel
                  </button>
                );
              }
            } else if (activeTab === "CANCELED") {
              actionButtons = (
                <button className="btn btn-outline-primary btn-sm ms-2" onClick={() => handleReopen(p.id)}>
                  Reopen
                </button>
              );
            }
            let chatBtn = null;
            if (showChatBtn && p.requesterAnimal && p.recipientAnimal) {
              const myOwnerId = currentUserId;
              const otherOwnerId = p.requesterAnimal.owners.some((o) => o.id === myOwnerId)
                ? p.recipientAnimal.owners[0]?.id
                : p.requesterAnimal.owners[0]?.id;
              if (otherOwnerId) {
                chatBtn = (
                  <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => handleChat(otherOwnerId)}>
                    Chat
                  </button>
                );
              }
            }
            return (
              <li className="list-group-item" key={p.id}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                  <div style={{ width: '100%' }}>
                    <div className="row">
                      <div className="col-md-6 mb-2 mb-md-0">
                        <div className="fw-bold">From:</div>
                        {p.requesterAnimal ? (
                          <>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <img
                                src={getAnimalProfilePicUrl(p.requesterAnimal.pictureUrl)}
                                alt={p.requesterAnimal.name}
                                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                              />
                              <Link to={`/animals/${p.requesterAnimal.id}`}>{p.requesterAnimal.name}</Link>
                            </div>
                            {(p.requesterAnimal.species || p.requesterAnimal.breed) && (
                              <span className="text-muted ms-1" style={{ fontSize: '0.95em' }}>
                                {p.requesterAnimal.species ? `(${p.requesterAnimal.species}` : ''}
                                {p.requesterAnimal.species && p.requesterAnimal.breed ? ', ' : ''}
                                {p.requesterAnimal.breed ? p.requesterAnimal.breed : ''}
                                {p.requesterAnimal.species ? ')' : ''}
                              </span>
                            )}
                            {p.requesterAnimal.owners.length > 0 && (
                              <>
                                {' '}<span> owned by </span>
                                <UserMention
                                  userId={p.requesterAnimal.owners[0].id}
                                  userName={p.requesterAnimal.owners[0].name}
                                  userEmail={p.requesterAnimal.owners[0].email}
                                  userPictureUrl={p.requesterAnimal.owners[0].pictureUrl}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          p.requesterAnimalId
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className="fw-bold">To:</div>
                        {p.recipientAnimal ? (
                          <>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <img
                                src={getAnimalProfilePicUrl(p.recipientAnimal.pictureUrl)}
                                alt={p.recipientAnimal.name}
                                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                              />
                              <Link to={`/animals/${p.recipientAnimal.id}`}>{p.recipientAnimal.name}</Link>
                            </div>
                            {(p.recipientAnimal.species || p.recipientAnimal.breed) && (
                              <span className="text-muted ms-1" style={{ fontSize: '0.95em' }}>
                                {p.recipientAnimal.species ? `(${p.recipientAnimal.species}` : ''}
                                {p.recipientAnimal.species && p.recipientAnimal.breed ? ', ' : ''}
                                {p.recipientAnimal.breed ? p.recipientAnimal.breed : ''}
                                {p.recipientAnimal.species ? ')' : ''}
                              </span>
                            )}
                            {p.recipientAnimal.owners.length > 0 && (
                              <>
                                {' '}<span> owned by </span>
                                <UserMention
                                  userId={p.recipientAnimal.owners[0].id}
                                  userName={p.recipientAnimal.owners[0].name}
                                  userEmail={p.recipientAnimal.owners[0].email}
                                  userPictureUrl={p.recipientAnimal.owners[0].pictureUrl}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          p.recipientAnimalId
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-2 mt-md-0">
                    <span className="badge bg-secondary me-2">{p.status}</span>
                    {actionButtons}
                    {chatBtn}
                  </div>
                </div>
                <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                  Requested: {p.requestedAt ? new Date(p.requestedAt).toLocaleString() : "-"}
                  {p.respondedAt && (
                    <>
                      {" | "}Responded: {new Date(p.respondedAt).toLocaleString()}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
