import { Outlet, useNavigate, useLocation } from "react-router-dom";

function iconSrc(name: string, active: boolean) {
  return active
    ? `/images/imagesBlue/${name}.svg`
    : `/images/${name}.svg`;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isCreate = pathname.startsWith("/dashboard/create");
  const isSettings = pathname.startsWith("/dashboard/settings");
  const isHelp = pathname.startsWith("/dashboard/help");

  // Home is active for:
  // - /dashboard
  // - /dashboard/:id
  // but NOT when a more specific section is active
  const isHome =
    pathname === "/dashboard" ||
    (/^\/dashboard\/[^/]+$/.test(pathname) &&
      !isCreate &&
      !isSettings &&
      !isHelp);

  return (
    <div className="dashboard-page">
      <div className="dashboard-left">
        <img
          src={iconSrc("home", isHome)}
          className="dashboard-icon"
          onClick={() => navigate("/dashboard")}
        />

        <img
          src={iconSrc("create", isCreate)}
          className="dashboard-icon"
          onClick={() => navigate("/dashboard/create")}
        />

        <img
          src={iconSrc("settings", isSettings)}
          className="dashboard-icon"
          onClick={() => navigate("/dashboard/settings")}
        />

        <img
          src={iconSrc("help", isHelp)}
          className="dashboard-icon"
          style={{ marginTop: "auto" }}
          onClick={() => navigate("/dashboard/help")}
        />
      </div>

      <div className="dashboard-right">
        <Outlet />
      </div>
    </div>
  );
}
