import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth"; // adjust path

export default function RegisterPage() {
  const nav = useNavigate();
  const { user, loading: authLoading, register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, bounce
  useEffect(() => {
    if (!authLoading && user) nav("/dashboard", { replace: true });
  }, [authLoading, user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register({ username, email, password1, password2 });

      // If your backend DOES auto-login on registration, this will work.
      // If it DOESN’T, you may want to send them to /login instead.
      nav("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || authLoading;

  return (
    <div className="account-form">
      <h1 className="account-form-title">Register</h1>

      <form onSubmit={onSubmit} className="account-form-inner">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={disabled}
          autoComplete="username"
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          autoComplete="email"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          required
        />

        <input
          placeholder="Repeat password"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          required
        />

        <button className="account-form-button" disabled={disabled}>
          {submitting ? "Creating..." : "Create account"}
        </button>

        <p className="account-form-note text-gray">Already have an account? Then please <Link to="/login">sign in</Link></p>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
