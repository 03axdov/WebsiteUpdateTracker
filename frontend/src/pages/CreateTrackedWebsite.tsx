import { useState } from "react";

export default function CreateTrackedWebsite() {

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="create-tracked-website-page">
      <h1 className="dashboard-title">Create Tracked Website</h1>

      <form className="create-tracked-website-form">
        <div className="label-field-container">
          <label htmlFor="title" className="label">Title</label>
          <input className="create-website-field" name="title" type="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        </div>

        <div className="label-field-container">
          <label htmlFor="url" className="label">URL <span className="label-required">(required)</span></label>
          <input className="create-website-field" name="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        </div>

        <div className="label-field-container label-field-description">
          <label htmlFor="description" className="label">Description</label>
          <textarea className="create-website-field create-website-description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        </div>

        <div className="label-field-container">
          <label htmlFor="title" className="label">Notifications</label>
          <div className="notifications-container">
            
          </div>
        </div>
      </form>
    </div>
  )
}
