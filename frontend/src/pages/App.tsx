import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";


function NotFound() {
  return <h1>404</h1>;
}


export default function App() {

  /* useEffect(() => {
    fetch("/api/health/")
      .then((r) => r.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []); */

  return (
    <div style={{ padding: 24 }}>

      <nav className="navbar">
        <div className="navbar-auth">
            <Link className="navbar-link" to="/login">Login</Link>
            <Link className="navbar-link" to="/register">Register</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}