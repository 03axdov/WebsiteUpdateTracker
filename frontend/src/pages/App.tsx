import { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useAuth } from "../auth";
import LogoutPage from "./LogoutPage";
import TrackedWebsitesList from "./TrackedWebsitesList";
import TrackedWebsiteDetails from "./TrackedWebsiteDetails";


function NotFound() {
  return <h1>404</h1>;
}


export default function App() {

  const { user, loading, logout } = useAuth();

  return (
    <div className="app">

      <nav className="navbar">
        {user && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " navbar-link-selected" : "")
          }
        >
          Dashboard
        </NavLink>
        )}
        <div className="navbar-auth">
          {
          loading ? (<span>
            
          </span>) : (user ? <>
            <Link className="navbar-link" to="/logout">Logout</Link>
            <div className="profile-icon">
              {user.username.slice(0, 2)}
            </div>
          </> : 
          <>
            <Link className="navbar-link" to="/login">Login</Link>
            <Link className="navbar-link" to="/register">Register</Link>
          </>)
          }
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/dashboard" element={<TrackedWebsitesList />} />
        <Route path="/dashboard/:id" element={<TrackedWebsiteDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />


        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}