// pages/DashboardList.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth";
import type { TrackedWebsite } from "../types/tracked-websites";
import TrackedWebsiteElement from "../components/TrackedWebsiteElement";

function safeLower(x: unknown) {
  return (typeof x === "string" ? x : "").toLowerCase();
}

export default function DashboardList() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [trackedWebsites, setTrackedWebsites] = useState<TrackedWebsite[]>([]);
  const [loadingTrackedWebsites, setLoadingTrackedWebsites] = useState(true);
  const [search, setSearch] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);  // TODO: restore scroll

  async function getTrackedWebsites() {
    const data = await apiFetch("/api/tracked-websites/", { method: "GET" });
    setTrackedWebsites(data);
    setLoadingTrackedWebsites(false)
  }

  useEffect(() => {
    if (!authLoading && user) getTrackedWebsites();
    else if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);


  const visibleWebsites = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return trackedWebsites;
    return trackedWebsites.filter((tw) => safeLower((tw as any).url).includes(s));
  }, [trackedWebsites, search]);

  return (
    <div className="tracked-websites-list-outer" ref={listRef}>
      <h1 className="dashboard-title">Tracked Pages</h1>

      <div className="tracked-websites-controls">
        <span className="tracked-websites-search-container">
          <img className="tracked-websites-search-icon" src="/images/search.svg" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="tracked-websites-search"
          />
        </span>

        <button
          className="create-tracked-website-button"
          onClick={() => navigate("/dashboard/create")}
        >
          <span className="create-tracked-website-button-icon">+</span>
          Add tracked website
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.8 }}>
          Showing {visibleWebsites.length} / {trackedWebsites.length}
        </div>
      </div>

      <div className="tracked-websites-list">
        {trackedWebsites.length > 0 && <div className="tracked-website-element tracked-website-element-header">
          <span className="tracked-website-title">Title</span>
          <span className="tracked-website-url">URL</span>
          <span className="tracked-website-date">Created at</span>
        </div>}

        {visibleWebsites.map((tw) => (
          <TrackedWebsiteElement trackedWebsite={tw} key={tw.id} />
        ))}

        {trackedWebsites.length !== 0 && visibleWebsites.length === 0 && (
          <div className="tracked-website-element">
            <span className="text-gray">No such websites found.</span>
          </div>
        )}
        {!loadingTrackedWebsites && trackedWebsites.length == 0 && <div className="tracked-website-element">
            <span className="text-gray">You don't have any tracked websites. Click <Link to="/dashboard/create">here</Link> to create one.</span>
          </div>}
      </div>
    </div>
  );
}
