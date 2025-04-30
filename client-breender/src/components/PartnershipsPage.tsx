import React, { useEffect, useState } from "react";
import { getPartnerships } from "../api/partnershipApi";

const TABS = ["PENDING", "ACCEPTED", "REJECTED", "CANCELED"] as const;
type TabType = typeof TABS[number];

export const PartnershipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPartnerships()
      .then((res) => {
        if (res.status === 200) {
          setPartnerships(res.data);
          setError(null);
        } else {
          setError("Failed to load partnership requests.");
        }
      })
      .catch(() => setError("Failed to load partnership requests."))
      .finally(() => setLoading(false));
  }, []);

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
          {filtered.map((p) => (
            <li className="list-group-item" key={p.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>From:</strong> {p.requesterAnimal?.name || p.requesterAnimalId}
                  {" "}
                  <strong>To:</strong> {p.recipientAnimal?.name || p.recipientAnimalId}
                </div>
                <span className="badge bg-secondary">{p.status}</span>
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
          ))}
        </ul>
      )}
    </div>
  );
};
