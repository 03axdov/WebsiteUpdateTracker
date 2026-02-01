import { useEffect, useMemo, useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import type { TrackedWebsite, TrackedWebsiteSortKey } from "../types/tracked-websites";
import TrackedWebsiteElement from "../components/TrackedWebsiteElement";


function safeLower(x: unknown) {
  return (typeof x === "string" ? x : "").toLowerCase();
}

function parseDateMs(value: unknown): number {
  // DRF typically returns ISO strings; Date.parse returns ms or NaN
  if (typeof value !== "string") return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [trackedWebsites, setTrackedWebsites] = useState<TrackedWebsite[]>([])

  // UI state
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<TrackedWebsiteSortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  async function getTrackedWebsites() {
    const data = await apiFetch("/api/tracked-websites/", { method: "GET" });
    setTrackedWebsites(data);
  }

  useEffect(() => {
    if (!authLoading && user) {
      getTrackedWebsites()
    }
  }, [authLoading])

  
  const visibleWebsites = useMemo(() => {
    const searchParsed = search.trim().toLowerCase();

    // filter based on search
    let filtered = trackedWebsites;
    if (searchParsed) {
      filtered = trackedWebsites.filter((tw) => {
        // Adjust these fields to match your TrackedWebsite type
        const url = safeLower((tw as any).url);
        return url.includes(searchParsed);
      });
    }

    // sort
    const dir = sortDir === "asc" ? 1 : -1;

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "url") {
        const av = safeLower((a as any).url);
        const bv = safeLower((b as any).url);
        return av.localeCompare(bv) * dir;
      }

      // created_at
      const aMs = parseDateMs((a as any).created_at);
      const bMs = parseDateMs((b as any).created_at);
      return (aMs - bMs) * dir;
    });

    return sorted;
  }, [trackedWebsites, search, sortKey, sortDir]);


  return (<div className="dashboard-page">
    <div className="dashboard-left">
      <img src="images/home.svg" className="dashboard-icon" />
      <img src="images/settings.svg" className="dashboard-icon" />
      <img src="images/help.svg" className="dashboard-icon" style={{marginTop: "auto"}}/>
    </div>
    <div className="dashboard-right">
      <h1 className="dashboard-title">Tracked Pages</h1>

      {/* Controls */}
      <div className="tracked-websites-controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="tracked-websites-search"
        />

        {/*<select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as TrackedWebsiteSortKey)}
          className="tracked-websites-sortkey"
        >
          <option value="created_at">Sort: Created</option>
          <option value="url">Sort: URL</option>
        </select>

        <img
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="tracked-websites-sortdir"
          title="Toggle sort direction"
          src="images/arrow.svg"
          style={{rotate: (sortDir === "asc" ? "180deg" : "0deg"), transition:"0.2s"}}
        />*/}

        <div style={{ marginLeft: "auto", opacity: 0.8 }}>
          {visibleWebsites.length} / {trackedWebsites.length}
        </div>
      </div>

      <div className="tracked-websites-list">
        {visibleWebsites.map((tw: TrackedWebsite) => <TrackedWebsiteElement trackedWebsite={tw} key={tw.id}></TrackedWebsiteElement>)}
        {trackedWebsites.length != 0 && visibleWebsites.length == 0 && <p className="gray-text">No such websites found.</p>}
      </div>

      
    </div>
  </div>);
}
