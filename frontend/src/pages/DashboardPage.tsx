import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const nav = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/auth/user/")
      .then(setUser)
      .catch(() => nav("/login"))
      .finally(() => setLoading(false));
  }, [nav]);

  return (<div className="dashboard-page">
    <div className="dashboard-left">
      <img src="images/home.svg" className="dashboard-icon" />
      <img src="images/settings.svg" className="dashboard-icon" />
      <img src="images/help.svg" className="dashboard-icon" style={{marginTop: "auto"}}/>
    </div>
    <div className="dashboard-right">
      <h1 className="dashboard-title">Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  </div>);
}
