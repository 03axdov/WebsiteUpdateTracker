import { useState } from "react";
import type { TrackedWebsite } from "../types/tracked-websites";
import { Link } from "react-router-dom";
import { formatNiceDate } from "../types/tracked-websites";

type TrackedWebsiteElementProps = {
    trackedWebsite: TrackedWebsite
}

export default function TrackedWebsiteElement({trackedWebsite} : TrackedWebsiteElementProps) {
    return <div className="tracked-website-element">
        <span className="tracked-website-title">
            {trackedWebsite.title || <span className="text-gray">No title</span>}
        </span>
        <Link className="tracked-website-url" to={trackedWebsite.url} target="_blank">{trackedWebsite.url}</Link>
        <span className="tracked-website-date">
            {formatNiceDate(trackedWebsite.created_at)}
        </span>
    </div>
}