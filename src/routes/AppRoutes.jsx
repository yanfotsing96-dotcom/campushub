import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StudentScopedDashboard from '../pages/dashboard/StudentScopedDashboard';
import ExamsListPage from '../pages/exams/ExamsListPage';
import ResourceCrud from '../pages/ResourceCrud';
import SearchPage from '../pages/SearchPage';
import FavoritesHistoryPage from '../pages/FavoritesHistoryPage';
import NotebookPage from '../pages/NotebookPage';
import ProfilePage from '../pages/ProfilePage';
import LearningPage from '../pages/LearningPage';
import ProductivityPage from '../pages/ProductivityPage';
import EvaluationPage from '../pages/EvaluationPage';
import ServicesPage from '../pages/ServicesPage';
import AdminPage from '../pages/AdminPage';
import DelegateDashboardPage from '../pages/delegate/DelegateDashboardPage';
import ModeratorDashboardPage from '../pages/moderator/ModeratorDashboardPage';
import PricingPage from '../pages/PricingPage';
import TechHubPage from '../pages/TechHubPage';
import HelpCenterPage from '../pages/HelpCenterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Authentication Pages */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. Authenticated Academic App with MainLayout */}
      <Route element={<MainLayout />}>
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
  );
}
