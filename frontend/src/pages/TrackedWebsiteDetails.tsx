import {useEffect, useState} from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatNiceDate, type TrackedWebsite } from "../types/tracked-websites";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNotify } from "../contexts/notify";


export default function TrackedWebsiteDetails() {
  const notify = useNotify()
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>();
  const [trackedWebsite, setTrackedWebsite] = useState<TrackedWebsite>();
  const [loadingTrackedWebsite, setLoadingTrackedWebsite] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(false)

  async function getTrackedWebsite() {
    if (!id) return;
    setLoadingTrackedWebsite(true)
    setError(null)
    try {
      const data = await apiFetch("/api/tracked-websites/" + id, { method: "GET" });
      setTrackedWebsite(data)
      if (editing) {
        hydrateForm(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load website.")
    } finally {
      setLoadingTrackedWebsite(false)
    }
  }

  function hydrateForm(data: TrackedWebsite) {
    setTitle(data.title || "")
    setUrl(data.url || "")
    setDescription(data.description || "")
    setEmailNotifications(Boolean(data.notify_email))
  }

  async function updateTrackedWebsite() {
    if (!id) return;
    setSaving(true)
    setError(null)
    try {
      await ensureCsrfCookie();
      const data = await apiFetch("/api/tracked-websites/" + id + "/", {
        method: "PATCH",
        body: JSON.stringify({
          url: url,
          title: title ?? "",
          description: description ?? "",
          notify_email: emailNotifications,
        }),
      });
      setTrackedWebsite(data)
      setEditing(false)
      notify("Saved changes successfully", { type: "success" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update website.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteTrackedWebsite() {
    if (!id) return;
    const ok = window.confirm("Delete this tracked website? This cannot be undone.");
    if (!ok) return;
    setDeleting(true)
    setError(null)
    try {
      await ensureCsrfCookie();
      await apiFetch("/api/tracked-websites/" + id + "/", { method: "DELETE" });
      notify("Deleted successfully", { type: "success" })
      navigate("/dashboard")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete website.")
    } finally {
      setDeleting(false)
    }
  }

  function startEditing() {
    if (!trackedWebsite) return;
    hydrateForm(trackedWebsite)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
    if (trackedWebsite) {
      hydrateForm(trackedWebsite)
    }
    setError(null)
  }

  useEffect(() => {
    getTrackedWebsite()
  }, [id])

  return (
    <div className="details-panel">
      <div className="tracked-website-details-header">
        <Link className="dashboard-back" to="/dashboard"><img className="dashboard-back-icon" src="/images/back.svg"/></Link>
        {(trackedWebsite?.title ? 
        <h1 className="dashboard-title">{trackedWebsite?.title}</h1> : 
        <h1 className="dashboard-title text-grayer">No title</h1>
        )}
        {!editing && trackedWebsite && (
          <div className="details-header-actions">
            <button className="details-edit-button" type="button" onClick={startEditing}>Edit</button>
            <button className="details-delete-button" type="button" onClick={deleteTrackedWebsite} disabled={deleting}>
              {!deleting ? "Delete" : "Deleting..."}
            </button>
          </div>
        )}
      </div>
      
      {loadingTrackedWebsite && <div className="tracked-website-details-fields">Loading...</div>}

      {error && <div className="form-error">{error}</div>}

      {trackedWebsite && !editing && <div className="tracked-website-details-fields">
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

        <div className="label-field-container">
          <span className="tracked-website-details-label">Email notifications:</span>
          <span className="tracked-website-details-field">{trackedWebsite.notify_email ? "Enabled" : "Disabled"}</span>
        </div>

        <div className="label-field-container label-field-description">
          <span className="tracked-website-details-label">Description:</span>
          <span className="tracked-website-details-description">{trackedWebsite.description || "You have not added a description to this website."}</span>
        </div>
        
      </div>}

      {trackedWebsite && editing && (
        <form className="create-tracked-website-form" onSubmit={(e) => {
          e.preventDefault()
          updateTrackedWebsite()
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

          <div className="details-edit-actions">
            <button className="details-cancel-button" type="button" onClick={cancelEditing} disabled={saving}>Cancel</button>
            <button className="submit-tracked-website-button" type="submit" disabled={saving}>
              {(!saving ? "Save changes" : "Saving...")}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
