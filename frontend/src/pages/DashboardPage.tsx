import { useEffect, useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import type { TrackedWebsite } from "../types/tracked-websites";
import TrackedWebsiteElement from "../components/TrackedWebsiteElement";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [trackedWebsites, setTrackedWebsites] = useState<TrackedWebsite[]>([])

  async function getTrackedWebsites() {
    const data = await apiFetch("/api/tracked-websites/", { method: "GET" });
    setTrackedWebsites(data);
  }

  useEffect(() => {
    getTrackedWebsites()
  }, [authLoading])

  console.log(trackedWebsites)

  return (<div className="dashboard-page">
    <div className="dashboard-left">
      <img src="images/home.svg" className="dashboard-icon" />
      <img src="images/settings.svg" className="dashboard-icon" />
      <img src="images/help.svg" className="dashboard-icon" style={{marginTop: "auto"}}/>
    </div>
    <div className="dashboard-right">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="tracked-websites-list">
        {trackedWebsites.map((tw: TrackedWebsite) => <TrackedWebsiteElement trackedWebsite={tw} key={tw.id}></TrackedWebsiteElement>)}
      </div>

      
    </div>
  </div>);
}
