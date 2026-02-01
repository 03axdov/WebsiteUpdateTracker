import { useState } from "react";
import type { TrackedWebsite } from "../types/tracked-websites";
import { Link } from "react-router-dom";

type TrackedWebsiteElementProps = {
    trackedWebsite: TrackedWebsite
}

export default function TrackedWebsiteElement({trackedWebsite} : TrackedWebsiteElementProps) {
    return <div className="tracked-website-element">
        <Link to={trackedWebsite.url} target="_blank">{trackedWebsite.url}</Link>
    </div>
}