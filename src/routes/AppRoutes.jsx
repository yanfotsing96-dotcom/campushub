import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
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
import PricingPage from '../pages/PricingPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Authentication Pages */}
      <Route path="/" element={<Navigate to="/ressources" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. Authenticated Academic App with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/ressources" element={<ResourceCrud />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/favs-history" element={<FavoritesHistoryPage />} />
        <Route path="/favorites" element={<FavoritesHistoryPage />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 3. Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
