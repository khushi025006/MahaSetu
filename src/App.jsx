import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import ApplicationSuccess from "./pages/ApplicationSuccess";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Consent from "./pages/Consent";
import Applications from "./pages/Applications";
import AISchemeFinder from "./pages/AISchemeFinder";
import AutoFill from "./pages/AutoFill";
import Documents from "./pages/Documents";
import ConsentManager from "./pages/ConsentManager";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for Firebase to restore login session
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Loading MahaSetu...
      </div>
    );
  }

  // Only redirect after Firebase confirms there is no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protected Pages */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-details"
          element={
            <ProtectedRoute>
              <ServiceDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consent"
          element={
            <ProtectedRoute>
              <Consent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/application-success"
          element={
            <ProtectedRoute>
              <ApplicationSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-scheme-finder"
          element={
            <ProtectedRoute>
              <AISchemeFinder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/autofill"
          element={
            <ProtectedRoute>
              <AutoFill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consent-manager"
          element={
            <ProtectedRoute>
              <ConsentManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;