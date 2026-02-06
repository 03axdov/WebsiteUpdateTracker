import { Link, useParams, useSearchParams } from "react-router-dom";

export default function TrackedWebsiteDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="details-panel">
      <Link to="/dashboard">Back</Link>
      <p>Tracked website id: {id}</p>
    </div>
  )
}
