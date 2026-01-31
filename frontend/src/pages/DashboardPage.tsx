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

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
