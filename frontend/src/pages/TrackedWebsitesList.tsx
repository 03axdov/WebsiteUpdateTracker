import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import type { TrackedWebsite, TrackedWebsiteSortKey } from "../types/tracked-websites";
import TrackedWebsiteElement from "../components/TrackedWebsiteElement";


function safeLower(x: unknown) {
  return (typeof x === "string" ? x : "").toLowerCase();
}

export default function TrackedWebsitesList() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth();
  const [trackedWebsites, setTrackedWebsites] = useState<TrackedWebsite[]>([])

  // UI state
  const [search, setSearch] = useState("");

  
  async function getTrackedWebsites() {
    const data = await apiFetch("/api/tracked-websites/", { method: "GET" });
    setTrackedWebsites(data);
  }

  useEffect(() => {
    if (!authLoading && user) {
      getTrackedWebsites()
    } else if (!authLoading && !user) {
      navigate("/login")
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

    return filtered;
  }, [trackedWebsites, search]);


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
        <span className="tracked-websites-search-container">
          <img className="tracked-websites-search-icon" src="/images/search.svg" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="tracked-websites-search"
          />
        </span>
        

        <div style={{ marginLeft: "auto", opacity: 0.8 }}>
          {visibleWebsites.length} / {trackedWebsites.length}
        </div>
      </div>

      <div className="tracked-websites-list">
        <div className="tracked-website-element tracked-website-element-header">
          <span className="tracked-website-title">
            Title
          </span>
          <span className="tracked-website-url">URL</span>
          <span className="tracked-website-date">
              Created at
          </span>
        </div>

        {visibleWebsites.map((tw: TrackedWebsite , idx: number) => <TrackedWebsiteElement trackedWebsite={tw} key={tw.id}></TrackedWebsiteElement>)}
        {trackedWebsites.length != 0 && visibleWebsites.length == 0 && <div className="tracked-website-element"><span className="text-gray">No such websites found.</span></div>}
      </div>
    </div>
  </div>);
}
