import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import DashboardPage from "./modules/dashboard/DashboardPage";
import ClaimsRegisterPage from "./modules/claims/pages/ClaimsRegisterPage";
import ClaimWorkspacePage from "./modules/claims/pages/ClaimWorkspacePage";
import PlaceholderPage from "./modules/common/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/claims"
          element={<ClaimsRegisterPage />}
        />

        <Route
          path="/claims/:id"
          element={<ClaimWorkspacePage />}
        />

        <Route
          path="/commercial"
          element={<PlaceholderPage title="Commercial" />}
        />

        <Route
          path="/procurement"
          element={<PlaceholderPage title="Procurement" />}
        />

        <Route
          path="/projects"
          element={<PlaceholderPage title="Projects" />}
        />

        <Route
          path="/documents"
          element={<PlaceholderPage title="Documents" />}
        />

        <Route
          path="/knowledge"
          element={<PlaceholderPage title="Knowledge Base" />}
        />

        <Route
          path="/administration"
          element={<PlaceholderPage title="Administration" />}
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}
