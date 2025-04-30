import React, { useEffect, useState } from "react";
import { getPartnerships, acceptPartnership, rejectPartnership, cancelPartnership, reopenPartnership } from "../api/partnershipApi";
import { getAnimal } from "../api/animalApi";
import { Link } from "react-router-dom";
import { UserMention } from "./UserMention/UserMention";
import { useUser } from "../context/UserContext";

const TABS = ["PENDING", "ACCEPTED", "REJECTED", "CANCELED"] as const;
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

export const PartnershipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [partnerships, setPartnerships] = useState<PartnershipWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId: currentUserId } = useUser();

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
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
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
            } else if (activeTab === "CANCELED") {
              actionButtons = (
                <button className="btn btn-outline-primary btn-sm ms-2" onClick={() => handleReopen(p.id)}>
                  Reopen
                </button>
              );
            }
            return (
              <li className="list-group-item" key={p.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ width: '100%' }}>
                    <div className="mb-1">
                      <strong>From:</strong>{' '}
                      {p.requesterAnimal ? (
                        <>
                          <Link to={`/animals/${p.requesterAnimal.id}`}>{p.requesterAnimal.name}</Link>
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
                    <div>
                      <strong>To:</strong>{' '}
                      {p.recipientAnimal ? (
                        <>
                          <Link to={`/animals/${p.recipientAnimal.id}`}>{p.recipientAnimal.name}</Link>
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
                  <span className="badge bg-secondary">{p.status}</span>
                  {actionButtons}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
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
