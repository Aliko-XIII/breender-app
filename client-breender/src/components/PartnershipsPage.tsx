import React, { useEffect, useState } from "react";
import { getPartnerships, acceptPartnership, rejectPartnership, cancelPartnership, reopenPartnership } from "../api/partnershipApi";
import { getAnimal } from "../api/animalApi";
import { Link, useNavigate } from "react-router-dom";
import { UserMention } from "./UserMention/UserMention";
import { useUser } from "../context/UserContext";
import { getChats, createChat } from "../api/chatApi";
import '../dark-theme.css';

const TABS = ["ACCEPTED", "PENDING", "REJECTED", "CANCELED"] as const;
type TabType = typeof TABS[number];

const TOP_TABS = ["PARTNERS", "PARTNERED_ANIMALS", "REQUESTS"] as const;
type TopTabType = typeof TOP_TABS[number];

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

// Add dark theme styles for PartnershipsPage
const darkListItemStyle = {
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)'
};
const darkMutedStyle = { color: 'var(--color-text-secondary)' };
const darkBadgeStyle = { background: 'var(--color-bg-input)', color: 'var(--color-text-secondary)' };
const darkTabStyle = { background: 'var(--color-bg-secondary)', color: 'var(--color-text)' };
const darkTabActiveStyle = { background: 'var(--color-bg-primary)', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' };

function RequestsTabContent({
  partnerships,
  activeTab,
  setActiveTab,
  currentUserId,
  handleAccept,
  handleReject,
  handleCancel,
  handleReopen,
  handleChat,
  tabCounts,
  loading,
  error,
}: {
  partnerships: PartnershipWithDetails[];
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  currentUserId: string;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  handleCancel: (id: string) => void;
  handleReopen: (id: string) => void;
  handleChat: (otherUserId: string) => void;
  tabCounts: Record<TabType, number>;
  loading: boolean;
  error: string | null;
}) {
  const filtered = partnerships.filter((p) => p.status === activeTab);
  return (
    <>
      <ul className="nav nav-tabs mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link${activeTab === tab ? " active" : ""}`}
              style={activeTab === tab ? darkTabActiveStyle : darkTabStyle}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()} <span className="badge bg-light text-dark ms-1" style={darkBadgeStyle}>{tabCounts[tab]}</span>
            </button>
          </li>
        ))}
      </ul>
      {loading ? (
        <div style={darkListItemStyle}>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger" style={darkListItemStyle}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info" style={darkListItemStyle}>No {activeTab.toLowerCase()} requests.</div>
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
            } else if (activeTab === "ACCEPTED" && p.requesterAnimal && p.recipientAnimal) {
              const isMine = p.requesterAnimal.owners.some((o) => o.id === currentUserId) ||
                p.recipientAnimal.owners.some((o) => o.id === currentUserId);
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
              <li className="list-group-item" key={p.id} style={darkListItemStyle}>
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
                              <span className="text-muted ms-1" style={{ ...darkMutedStyle, fontSize: '0.95em' }}>
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
                                  clickable={true}
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
                              <span className="text-muted ms-1" style={{ ...darkMutedStyle, fontSize: '0.95em' }}>
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
                                  clickable={true}
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
                    <span className="badge bg-secondary me-2" style={darkBadgeStyle}>{p.status}</span>
                    {actionButtons}
                    {chatBtn}
                  </div>
                </div>
                <div className="text-muted mt-2" style={{ ...darkMutedStyle, fontSize: 12 }}>
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
    </>
  );
}

export const PartnershipsPage: React.FC = () => {
  const [topTab, setTopTab] = useState<TopTabType>("REQUESTS");
  const [activeTab, setActiveTab] = useState<TabType>("ACCEPTED");
  const [partnerships, setPartnerships] = useState<PartnershipWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();

  // Helper to refresh partnerships without resetting tab state
  const refreshPartnerships = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const res = await getPartnerships({ userId: currentUserId });
      if (res.status === 200) {
        const rawPartnerships: PartnershipWithDetails[] = res.data;
        const animalIds = Array.from(new Set([
          ...rawPartnerships.map((p) => p.requesterAnimalId),
          ...rawPartnerships.map((p) => p.recipientAnimalId),
        ]));
        const animalResults = await Promise.all(
          animalIds.map((id) => getAnimal(id))
        );
        const animalMap: Record<string, AnimalInfo> = {};
        animalResults.forEach((result) => {
          if (result.status === 200 && result.data) {
            const animal = result.data;
            animalMap[animal.id] = {
              id: animal.id,
              name: animal.name,
              species: animal.species,
              breed: animal.breed,
              pictureUrl: animal.pictureUrl,
              owners: (animal.owners || []).map((ownerRel: { owner: { user: { id: string; email: string; userProfile?: { name?: string; pictureUrl?: string | null } } } }) => {
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
        const partnershipsWithDetails: PartnershipWithDetails[] = rawPartnerships.map((p) => ({
          ...p,
          requesterAnimal: animalMap[p.requesterAnimalId],
          recipientAnimal: animalMap[p.recipientAnimalId],
        }));
        setPartnerships(partnershipsWithDetails);
        setError(null);
      } else {
        setError("Failed to load partnership requests.");
      }
    } catch {
      setError("Failed to load partnership requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPartnerships();
  }, [currentUserId]);

  const handleAccept = async (id: string) => {
    await acceptPartnership(id);
    refreshPartnerships();
  };

  const handleReject = async (id: string) => {
    await rejectPartnership(id);
    refreshPartnerships();
  };

  const handleCancel = async (id: string) => {
    await cancelPartnership(id);
    refreshPartnerships();
  };

  const handleReopen = async (id: string) => {
    await reopenPartnership(id);
    refreshPartnerships();
  };

  const handleChat = async (otherUserId: string) => {
    if (!currentUserId || !otherUserId) return;
    const chatsRes = await getChats();
    let chat = null;
    if (chatsRes.status === 200 && Array.isArray(chatsRes.data)) {
      chat = chatsRes.data.find((c: { participants: { userId: string }[] }) =>
        c.participants &&
        c.participants.some((p) => p.userId === currentUserId) &&
        c.participants.some((p) => p.userId === otherUserId)
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

  const partnerUsers: OwnerInfo[] = React.useMemo(() => {
    const accepted = partnerships.filter((p) => p.status === "ACCEPTED");
    const users: Record<string, OwnerInfo> = {};
    accepted.forEach((p) => {
      const owners = [
        ...(p.requesterAnimal?.owners || []),
        ...(p.recipientAnimal?.owners || []),
      ];
      owners.forEach((owner) => {
        if (owner.id !== currentUserId && !users[owner.id]) {
          users[owner.id] = owner;
        }
      });
    });
    return Object.values(users);
  }, [partnerships, currentUserId]);

  const partneredAnimals: AnimalInfo[] = React.useMemo(() => {
    const accepted = partnerships.filter((p) => p.status === "ACCEPTED");
    const animals: Record<string, AnimalInfo> = {};
    accepted.forEach((p) => {
      [p.requesterAnimal, p.recipientAnimal].forEach((animal) => {
        if (
          animal &&
          !animal.owners.some((o) => o.id === currentUserId) &&
          !animals[animal.id]
        ) {
          animals[animal.id] = animal;
        }
      });
    });
    return Object.values(animals);
  }, [partnerships, currentUserId]);

  return (
    <div className="container mt-4" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', borderRadius: 12, padding: 24 }}>
      <h2 className="mb-4" style={{ color: 'var(--color-text)' }}>Partnerships</h2>
      {/* Top-level tab bar */}
      <ul className="nav nav-tabs mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {TOP_TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link${topTab === tab ? " active" : ""}`}
              style={topTab === tab ? darkTabActiveStyle : darkTabStyle}
              onClick={() => setTopTab(tab)}
              type="button"
            >
              {tab === "PARTNERS" ? "Partners" : tab === "PARTNERED_ANIMALS" ? "Partnered Animals" : "Requests"}
            </button>
          </li>
        ))}
      </ul>
      {topTab === "PARTNERS" ? (
        loading ? (
          <div style={darkListItemStyle}>Loading...</div>
        ) : error ? (
          <div className="alert alert-danger" style={darkListItemStyle}>{error}</div>
        ) : partnerUsers.length === 0 ? (
          <div className="alert alert-info" style={darkListItemStyle}>No partners found.</div>
        ) : (
          <ul className="list-group">
            {partnerUsers.map((user) => (
              <li className="list-group-item d-flex align-items-center justify-content-between" key={user.id} style={darkListItemStyle}>
                <div className="d-flex align-items-center gap-2">
                  <Link to={`/user-profile/${user.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                    <img
                      src={user.pictureUrl && user.pictureUrl !== '' ? (user.pictureUrl.startsWith('http') ? user.pictureUrl : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${user.pictureUrl}`) : '/avatar-placeholder.png'}
                      alt={user.name}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#eee', border: '1px solid #ccc' }}
                    />
                    <div>
                      <div className="fw-bold" style={{ color: 'var(--color-text)' }}>{user.name}</div>
                      <div className="text-muted" style={{ ...darkMutedStyle, fontSize: 13 }}>{user.email}</div>
                    </div>
                  </Link>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleChat(user.id)}>
                  Chat
                </button>
              </li>
            ))}
          </ul>
        )
      ) : topTab === "PARTNERED_ANIMALS" ? (
        loading ? (
          <div style={darkListItemStyle}>Loading...</div>
        ) : error ? (
          <div className="alert alert-danger" style={darkListItemStyle}>{error}</div>
        ) : partneredAnimals.length === 0 ? (
          <div className="alert alert-info" style={darkListItemStyle}>No partnered animals found.</div>
        ) : (
          <ul className="list-group">
            {partneredAnimals.map((animal) => (
              <li className="list-group-item d-flex align-items-center justify-content-between" key={animal.id} style={darkListItemStyle}>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={getAnimalProfilePicUrl(animal.pictureUrl)}
                    alt={animal.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#eee', border: '1px solid #ccc' }}
                  />
                  <div>
                    <Link to={`/animals/${animal.id}`} className="fw-bold">{animal.name}</Link>
                    <div className="text-muted" style={{ ...darkMutedStyle, fontSize: 13 }}>
                      {animal.species || ''}{animal.species && animal.breed ? ', ' : ''}{animal.breed || ''}
                    </div>
                  </div>
                </div>
                {animal.owners.length > 0 && (
                  <span className="text-muted" style={{ ...darkMutedStyle, fontSize: 13 }}>
                    owned by {animal.owners[0].name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )
      ) : (
        <RequestsTabContent
          partnerships={partnerships}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUserId={currentUserId || ''}
          handleAccept={handleAccept}
          handleReject={handleReject}
          handleCancel={handleCancel}
          handleReopen={handleReopen}
          handleChat={handleChat}
          tabCounts={tabCounts}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};
