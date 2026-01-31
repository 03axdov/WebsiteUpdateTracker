function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

// Ensure Django sets a CSRF cookie.
// We can call /api/auth/login/ with GET? No. Instead we create a tiny endpoint.
// If you don't have one yet, easiest is to add a backend endpoint /api/csrf/.
// For now we'll try a GET to /api/auth/user/ which often sets csrf if configured.
// If it doesn't, add the backend csrf endpoint (I show it below).
export async function ensureCsrfCookie() {
  await fetch("/api/csrf/", { credentials: "include" });
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = getCookie("csrftoken");
    if (csrf) headers.set("X-CSRFToken", csrf);
  }

  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg = (data && (data.detail || data.non_field_errors?.[0])) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
