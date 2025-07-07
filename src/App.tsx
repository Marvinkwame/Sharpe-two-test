import React, { Suspense, lazy, memo, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load components for code splitting
const AuthLayout = lazy(() => import("./layouts/AuthLayout/AuthLayout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Products = lazy(() => import("./pages/Products"));
// const Customers = lazy(() => import("./pages/Customers"));
// const Settings = lazy(() => import("./pages/Settings"));

// Optimized Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});


// Optimized Suspense Wrapper
const SuspenseWrapper: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = memo(({ 
  children, 
  fallback = <LoadingSpinner /> 
}) => (
  <Suspense fallback={fallback}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </Suspense>
));

// Memoized Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <SuspenseWrapper>{children}</SuspenseWrapper>;
});

// Memoized Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SuspenseWrapper>{children}</SuspenseWrapper>;
});

// Memoized Route Components for better performance
const AuthRoutes = memo(() => (
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
    <Route path="" element={<Navigate to="/auth/login" replace />} />
  </Route>
));

const DashboardRoutes = memo(() => (
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="products" element={<Products />} />
  </Route>
));

// Root redirect component
const RootRedirect = memo(() => (
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Navigate to="/dashboard" replace />
      </ProtectedRoute>
    }
  />
));

// Main App Component with performance optimizations
const App: React.FC = memo(() => {
  // Memoize the router setup to prevent unnecessary re-renders
  const routerContent = useCallback(() => (
    <Router>
      <div className="App">
        <Routes>
          <AuthRoutes />
          <DashboardRoutes />
          <RootRedirect />
        </Routes>
      </div>
    </Router>
  ), []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserPreferencesProvider>
            <AuthProvider>
              <SuspenseWrapper>
                {routerContent()}
              </SuspenseWrapper>
            </AuthProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
});


export default App;