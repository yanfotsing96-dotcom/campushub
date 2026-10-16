import { useState, Suspense, lazy } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  GraduationCap,
  Building,
  LifeBuoy,
  User,
} from 'lucide-react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';
import AppSidebar from '../components/layout/AppSidebar';
import GlobalToast from '../components/common/GlobalToast';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSelector from '../components/common/LanguageSelector';

const UniversitySelectorModal = lazy(() => import('../components/common/UniversitySelectorModal'));
import { useCampusHub } from '../hooks/useCampusHub';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [universityModalOpen, setUniversityModalOpen] = useState(false);

  const { student, selectedUniversity } = useCampusHub();
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const fullName = user?.fullName || user?.nom || student?.fullName || student?.name || 'Étudiant';
  const matricule = user?.matricule || student?.matricule || '';
  const role = user?.role || student?.role || 'Étudiant';

  const getInitials = (name) => {
    if (!name || name === 'Étudiant') return 'ET';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard') || path.startsWith('/courses')) return t('nav.dashboard', 'Tableau de Bord');
    if (path.startsWith('/exams')) return t('nav.exams', 'Compositions en Ligne');
    if (path.startsWith('/learning')) return 'Laboratoires & Playgrounds';
    if (path.startsWith('/falsh-hub')) return t('nav.falshHub', 'Pôle FALSH & Lettres');
    if (path.startsWith('/ressources')) return t('nav.resources', 'Catalogue National');
    if (path.startsWith('/delegate')) return t('nav.delegate', 'Espace Délégué');
    if (path.startsWith('/moderation')) return t('nav.moderation', 'Console Modération');
    if (path.startsWith('/admin')) return t('nav.admin', 'Administration');
    if (path.startsWith('/help')) return 'Centre d\'Aide & FAQ';
    if (path.startsWith('/profile')) return t('nav.profile', 'Profil National');
    return 'CampusHub Cameroun 🇨🇲';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex transition-colors">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenUniversityModal={() => setUniversityModalOpen(true)}
        />
      </div>

      {/* 2. Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-slate-900 shadow-2xl">
            <AppSidebar
              isCollapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              onNavigate={() => setMobileMenuOpen(false)}
              onOpenUniversityModal={() => {
                setMobileMenuOpen(false);
                setUniversityModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Main Application Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header with Top-Left FAQ & Profile Quick Access + Institutional Switcher */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60 px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
          {/* Top-Left Header: Quick Help / FAQ Icon, Profile Icon, Mobile Toggle & Page Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* Direct Top-Left FAQ Quick Access Button */}
            <Link
              to="/help"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-semibold shrink-0 shadow-xs ${
                location.pathname === '/help'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'border-slate-700/70 bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white'
              }`}
              title="Centre d'Aide & FAQ CampusHub"
              aria-label="Centre d'Aide & FAQ"
            >
              <LifeBuoy size={15} className={location.pathname === '/help' ? 'text-white' : 'text-indigo-400'} />
              <span className="hidden sm:inline">Aide & FAQ</span>
            </Link>

            {/* Direct Top-Left National Profile Quick Access Button */}
            <Link
              to="/profile"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-semibold shrink-0 shadow-xs ${
                location.pathname === '/profile'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'border-slate-700/70 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
              }`}
              title="Profil National & Identité Académique"
              aria-label="Profil National"
            >
              <User size={15} className={location.pathname === '/profile' ? 'text-white' : 'text-slate-300'} />
              <span className="hidden md:inline">Profil National</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Ouvrir le menu"
            >
              <Menu size={16} />
            </button>

            <div className="leading-tight min-w-0 flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-100 truncate">
                {getPageTitle(location.pathname)}
              </h1>

              <button
                type="button"
                onClick={() => setUniversityModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/60 transition-colors"
                title="Changer d'établissement universitaire"
              >
                <Building size={11} className="text-indigo-400" />
                <span>{student.universityShortName || selectedUniversity?.shortName}</span>
              </button>
            </div>
          </div>

          {/* Top-Right Header: Language, Theme & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSelector variant="dropdown" />
            <ThemeToggle />

            {/* Profile Avatar Card */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700/60"
              title={`${fullName} (${role})`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 font-bold text-xs flex items-center justify-center">
                {getInitials(fullName)}
              </div>
              <div className="text-left hidden md:block leading-tight text-xs">
                <span className="font-semibold text-slate-100 block truncate max-w-[120px]">
                  {fullName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {matricule}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 w-full p-4 sm:p-6 max-w-7xl mx-auto">
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Refined Institutional Footer */}
        <footer className="border-t border-slate-700/60 bg-slate-900/80 py-4 px-4 sm:px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-indigo-400" />
              <span>
                <strong className="text-slate-300">CampusHub Cameroun</strong> · Consortium des Universités d'État & Grandes Écoles
              </span>
            </div>
            <div className="font-mono text-slate-400 text-[11px]">
              MINESUP Cameroun · Session 2025-2026
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Toasts */}
      <GlobalToast />
      {universityModalOpen && (
        <Suspense fallback={null}>
          <UniversitySelectorModal
            isOpen={universityModalOpen}
            onClose={() => setUniversityModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
