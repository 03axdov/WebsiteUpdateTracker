import { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useAuth } from "../auth";
import LogoutPage from "./LogoutPage";
import TrackedWebsiteDetails from "./TrackedWebsiteDetails";
import CreateTrackedWebsite from "./CreateTrackedWebsite";
import DashboardList from "./DashboardList";
import DashboardLayout from "../components/DashboardLayout";


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

        {/* Layout route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardList />} />
          <Route path="create" element={<CreateTrackedWebsite />} />
          <Route path=":id" element={<TrackedWebsiteDetails />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />


        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}