import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { TrackedWebsiteCreateInput } from "../types/tracked-websites";
import { apiFetch, ensureCsrfCookie } from "../api";

export default function CreateTrackedWebsite() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(false)

  const [loading, setLoading] = useState(false)

  async function createTrackedWebsite() {
    setLoading(true)
    try {
      await ensureCsrfCookie();

      await apiFetch("/api/tracked-websites/", {
        method: "POST",
        body: JSON.stringify({
          url: url,
          title: title ?? "",
          description: description ?? "",
          notify_email: emailNotifications,
        }),
      });
      navigate("/dashboard")
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div className="create-tracked-website-page">
      <div className="tracked-website-details-header">
        <Link className="dashboard-back" to="/dashboard"><img className="dashboard-back-icon" src="/images/back.svg"/></Link>
        <h1 className="dashboard-title">Create Tracked Website</h1> 

      </div>

      <form className="create-tracked-website-form" onSubmit={(e) => {
        e.preventDefault()
        createTrackedWebsite()
      }}>
        <div className="label-field-container">
          <label htmlFor="title" className="label">Title</label>
          <input className="create-website-field" id="title" type="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        </div>

        <div className="label-field-container">
          <label htmlFor="url" className="label">URL <span className="label-required">(required)</span></label>
          <input className="create-website-field" id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" required />
        </div>

        <div className="label-field-container">
          <label className="label">Notifications</label>
          <div className="notifications-container">
            <div className="label-notification-element">
              <input className="notification-checkbox" type="checkbox" id="email-notification" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)}/>
              <label className="notification-label" htmlFor="email-notification">Email</label>
            </div>
          </div>
        </div>

        <div className="label-field-container label-field-description">
          <label htmlFor="description" className="label">Note</label>
          <textarea className="create-website-field create-website-description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        </div>
        

        <button className="submit-tracked-website-button" type="submit">{(!loading ? "Create" : "Loading...")}</button>
      </form>
    </div>
  )
}
