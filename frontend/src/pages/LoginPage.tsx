import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth"; // adjust path

export default function LoginPage() {
  const nav = useNavigate();
  const { user, loading: authLoading, login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    if (!authLoading && user) nav("/dashboard", { replace: true });
  }, [authLoading, user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email: emailOrUsername, password });

      nav("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || authLoading;

  return (
    <div className="account-form">
      <h1 className="account-form-title">Login</h1>

      <form onSubmit={onSubmit} className="account-form-inner">
        <input
          placeholder="Email (or username)"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          autoComplete="username"
          disabled={disabled}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={disabled}
        />

        <button className="account-form-button" disabled={disabled}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="account-form-note text-gray">Don't have an account? Then please <Link to="/register">sign up</Link></p>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
