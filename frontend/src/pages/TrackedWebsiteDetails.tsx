import {useEffect, useState} from "react"
import { Link, useParams } from "react-router-dom";
import { formatNiceDate, type TrackedWebsite } from "../types/tracked-websites";
import { apiFetch } from "../api";

export default function TrackedWebsiteDetails() {
  const { id } = useParams<{ id: string }>();
  const [trackedWebsite, setTrackedWebsite] = useState<TrackedWebsite>();
  const [loadingTrackedWebsite, setLoadingTrackedWebsite] = useState(false)

  async function getTrackedWebsite() {
    const data = await apiFetch("/api/tracked-websites/" + id, { method: "GET" });
    setTrackedWebsite(data)
    setLoadingTrackedWebsite(false)
  }

  useEffect(() => {
    if (!trackedWebsite) {
      getTrackedWebsite()
    }
    
  }, [])

  console.log(trackedWebsite)

  return (
    <div className="details-panel">
      <div className="tracked-website-details-header">
        <Link className="dashboard-back" to="/dashboard"><img className="dashboard-back-icon" src="/images/back.svg"/></Link>
        {(trackedWebsite?.title ? 
        <h1 className="dashboard-title">{trackedWebsite?.title}</h1> : 
        <h1 className="dashboard-title text-grayer">No title</h1>
        )}
      </div>
      
      {trackedWebsite && <div className="tracked-website-details-fields">
        <div className="label-field-container">
          <span className="tracked-website-details-label">URL:</span>
          <Link className="tracked-website-details-field" to={trackedWebsite.url} target="_blank">{trackedWebsite.url}</Link>
        </div>

        <div className="label-field-container">
          <span className="tracked-website-details-label">Created:</span>
          <span className="tracked-website-details-field">{formatNiceDate(trackedWebsite.created_at)}</span>
        </div>

        <div className="label-field-container">
          <span className="tracked-website-details-label">Last scraped:</span>
          <span className="tracked-website-details-field">{trackedWebsite.last_scraped ? formatNiceDate(trackedWebsite.last_scraped) : <span className="text-grayer">Never</span>}</span>
        </div>

        <div className="label-field-container label-field-description">
          <span className="tracked-website-details-label">Description:</span>
          <span className="tracked-website-details-description">{trackedWebsite.description || "You have not added a description to this website."}</span>
        </div>
        
      </div>}
    </div>
  )
}
