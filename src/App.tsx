import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Auth Routes */}
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <AuthLayout />
                    </PublicRoute>
                  }
                >
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route
                    path=""
                    element={<Navigate to="/auth/login" replace />}
                  />
                </Route>

                {/* Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<Dashboard />} />
                  <Route path="analytics" element={<div>Analytics Page</div>} />
                  <Route path="products" element={<div>Producs Page</div>} />
                  <Route path="customers" element={<div>Customers Page</div>} />
                  <Route path="settings" element={<div>Settings Page</div>} />
                </Route>

                {/* Redirect root to dashboard if authenticated, otherwise to login */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/dashboard" replace />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}

export default App;
