import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth"; // adjust path

export default function LogoutPage() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const [status, setStatus] = useState<"idle" | "loggingOut" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus("loggingOut");
      setError(null);

      try {
        await logout();
        if (cancelled) return;

        setStatus("done");

        // Optional: auto-redirect after logout
        // nav("/login", { replace: true });
      } catch (err: any) {
        if (cancelled) return;
        setStatus("error");
        setError(err?.message ?? "Logout failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [logout, nav]);

  return (
    <div className="account-form">
      <h1 className="account-form-title">Logout</h1>

      <div className="account-form-inner" style={{ display: "grid", gap: 12 }}>
        {status === "loggingOut" && <p>Logging out...</p>}

        {status === "done" && (
          <>
            <p>You are now logged out.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link className="navbar-link" to="/login">Go to login</Link>
              <Link className="navbar-link" to="/register">Create account</Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <p style={{ color: "crimson" }}>{error}</p>
            <button
              className="account-form-button"
              onClick={async () => {
                setStatus("loggingOut");
                setError(null);
                try {
                  await logout();
                  setStatus("done");
                } catch (err: any) {
                  setStatus("error");
                  setError(err?.message ?? "Logout failed");
                }
              }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
