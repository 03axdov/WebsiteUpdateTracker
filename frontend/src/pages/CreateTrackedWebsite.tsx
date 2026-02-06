import { useState } from "react";

export default function CreateTrackedWebsite() {

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

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
      </form>
    </div>
  )
}
