import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    fetch("/api/health/")
      .then((r) => r.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Django + React</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}