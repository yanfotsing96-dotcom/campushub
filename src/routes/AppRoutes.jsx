import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';
import { useAuth } from '../hooks/useAuth';

// Auth & Registration Pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));

// Core Academic Pages (Preserved & Enhanced)
const StudentScopedDashboard = lazy(() => import('../pages/dashboard/StudentScopedDashboard'));
const ExamsListPage = lazy(() => import('../pages/exams/ExamsListPage'));
const ResourceCrud = lazy(() => import('../pages/ResourceCrud'));
const FalshHubPage = lazy(() => import('../pages/FalshHubPage'));
const LearningPage = lazy(() => import('../pages/LearningPage'));
const HelpCenterPage = lazy(() => import('../pages/HelpCenterPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

// Role-Protected Dedicated Dashboards (Admin, Moderation, Delegate)
const DelegateDashboardPage = lazy(() => import('../pages/delegate/DelegateDashboardPage'));
const ModeratorDashboardPage = lazy(() => import('../pages/moderator/ModeratorDashboardPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Root Gateway: Boots directly to the Dashboard if authenticated, or the Grand Registration Form
function RootGateway() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <RegisterPage />;
}

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingSkeleton />}>
        <Routes>
          {/* Direct entry point: boots to Grand Formulaire if guest, or main Dashboard if logged in */}
          <Route path="/" element={<RootGateway />} />
          <Route path="/home" element={<RootGateway />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Academic App with MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Scoped Dashboard & Courses */}
            <Route path="/dashboard" element={<StudentScopedDashboard />} />
            <Route path="/courses" element={<StudentScopedDashboard />} />
            <Route path="/exams" element={<ExamsListPage />} />

            {/* National Catalogue, Playgrounds & Specialized Hubs */}
            <Route path="/ressources" element={<ResourceCrud />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/falsh-hub" element={<FalshHubPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/help" element={<HelpCenterPage />} />

            {/* Redirects for direct lab links & removed sections */}
            <Route path="/lab" element={<Navigate to="/learning?tab=playground" replace />} />
            <Route path="/labs" element={<Navigate to="/learning?tab=playground" replace />} />
            <Route path="/workspace" element={<Navigate to="/dashboard" replace />} />
            <Route path="/tech-hub" element={<Navigate to="/learning?tab=playground" replace />} />
            <Route path="/search" element={<Navigate to="/ressources" replace />} />
            <Route path="/evaluation" element={<Navigate to="/dashboard" replace />} />
            <Route path="/pricing" element={<Navigate to="/dashboard" replace />} />
            <Route path="/notebook" element={<Navigate to="/dashboard" replace />} />

            {/* Role-Protected Dashboards */}
            <Route
              path="/delegate"
              element={
                <ProtectedRoute requiredRole="delegate">
                  <DelegateDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/moderation"
              element={
                <ProtectedRoute requiredRole="moderator">
                  <ModeratorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
