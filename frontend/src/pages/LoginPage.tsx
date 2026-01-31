import { useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ensureCsrfCookie();

      // Try email first; if your backend expects username, switch the payload key.
      await apiFetch("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email: emailOrUsername, password }),
      });

      nav("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="account-form">
      <h1 className="account-form-title">Login</h1>
      <form onSubmit={onSubmit} className="account-form-inner">
        <input
          placeholder="Email (or username)"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button className="account-form-button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
