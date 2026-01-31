import { useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ensureCsrfCookie();

      await apiFetch("/api/auth/registration/", {
        method: "POST",
        body: JSON.stringify({ username, email, password1, password2 }),
      });

      // Often registration also logs you in (depends on configuration).
      // If not logged in, redirect to login instead.
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="account-form">
      <h1 className="account-form-title">Register</h1>
      <form onSubmit={onSubmit} className="account-form-inner">
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
        <input placeholder="Repeat password" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        <button className="account-form-button" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
