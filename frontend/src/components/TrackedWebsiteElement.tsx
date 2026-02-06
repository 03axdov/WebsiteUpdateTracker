import { useState } from "react";
import type { TrackedWebsite } from "../types/tracked-websites";
import { Link, useNavigate } from "react-router-dom";
import { formatNiceDate } from "../types/tracked-websites";

type TrackedWebsiteElementProps = {
    trackedWebsite: TrackedWebsite
}

export default function TrackedWebsiteElement({trackedWebsite} : TrackedWebsiteElementProps) {
    const navigate = useNavigate()

    return <div onClick={() => navigate("/dashboard/" + trackedWebsite.id)} className="tracked-website-element">
        <span className="tracked-website-title">
            {trackedWebsite.title || <span className="text-gray">No title</span>}
        </span>
        <span className="tracked-website-url">
            <Link to={trackedWebsite.url} target="_blank" onClick={(e) => e.stopPropagation()}>{trackedWebsite.url}</Link>
        </span>
        <span className="tracked-website-date">
            {formatNiceDate(trackedWebsite.created_at)}
        </span>
    </div>
}