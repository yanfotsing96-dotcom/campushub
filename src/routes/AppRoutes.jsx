import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';

// Auth Pages (lightweight or lazy)
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Core Academic Pages (Code-split chunks)
const StudentScopedDashboard = lazy(() => import('../pages/dashboard/StudentScopedDashboard'));
const ExamsListPage = lazy(() => import('../pages/exams/ExamsListPage'));
const ResourceCrud = lazy(() => import('../pages/ResourceCrud'));
const TechHubPage = lazy(() => import('../pages/TechHubPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const LearningPage = lazy(() => import('../pages/LearningPage'));
const ProductivityPage = lazy(() => import('../pages/ProductivityPage'));
const EvaluationPage = lazy(() => import('../pages/EvaluationPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const HelpCenterPage = lazy(() => import('../pages/HelpCenterPage'));
const FavoritesHistoryPage = lazy(() => import('../pages/FavoritesHistoryPage'));
const NotebookPage = lazy(() => import('../pages/NotebookPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

// Role-Protected Heavy Pages (Admin, Moderation, Delegate)
const DelegateDashboardPage = lazy(() => import('../pages/delegate/DelegateDashboardPage'));
const ModeratorDashboardPage = lazy(() => import('../pages/moderator/ModeratorDashboardPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingSkeleton />}>
        <Routes>
          {/* 1. Public Authentication Pages */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. Authenticated Academic App with MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Scoped Dashboard & Enrolled Courses */}
            <Route path="/dashboard" element={<StudentScopedDashboard />} />
            <Route path="/courses" element={<StudentScopedDashboard />} />
            <Route path="/exams" element={<ExamsListPage />} />

            {/* National Catalogue & Search */}
            <Route path="/ressources" element={<ResourceCrud />} />
            <Route path="/tech-hub" element={<TechHubPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/productivity" element={<ProductivityPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/favs-history" element={<FavoritesHistoryPage />} />
            <Route path="/favorites" element={<FavoritesHistoryPage />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* 3. Role-Protected Dedicated Dashboards */}
            {/* Delegate Space: requires 'delegate' or higher ('admin') */}
            <Route
              path="/delegate"
              element={
                <ProtectedRoute requiredRole="delegate">
                  <DelegateDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Moderator Space: requires 'moderator' or higher ('admin') */}
            <Route
              path="/moderation"
              element={
                <ProtectedRoute requiredRole="moderator">
                  <ModeratorDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Space: strictly requires 'admin' */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 4. Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
