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
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C2218] dark:bg-[#1C1612] dark:text-[#FAF5F0] flex transition-colors">
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
            className="fixed inset-0 bg-[#2C2218]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#EFECE6] dark:bg-[#1C1612] shadow-2xl">
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
        <header className="sticky top-0 z-30 bg-[#EFECE6]/95 dark:bg-[#261F1A]/95 backdrop-blur-md border-b border-[#E3DEC9] dark:border-[#44382E] px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4 transition-colors">
          {/* Top-Left Header: Quick Help / FAQ Icon, Profile Icon, Mobile Toggle & Page Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* Direct Top-Left FAQ Quick Access Button */}
            <Link
              to="/help"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-semibold shrink-0 shadow-xs ${
                location.pathname === '/help'
                  ? 'bg-[#744A2B] border-[#5C381E] text-white'
                  : 'border-[#E3DEC9] dark:border-[#44382E] bg-[#FAF8F5] dark:bg-[#261F1A] hover:bg-[#E3DEC9] text-[#744A2B] dark:text-[#D8D1B8]'
              }`}
              title="Centre d'Aide & FAQ CampusHub"
              aria-label="Centre d'Aide & FAQ"
            >
              <LifeBuoy size={15} className={location.pathname === '/help' ? 'text-white' : 'text-[#744A2B] dark:text-[#D8D1B8]'} />
              <span className="hidden sm:inline">Aide & FAQ</span>
            </Link>

            {/* Direct Top-Left National Profile Quick Access Button */}
            <Link
              to="/profile"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-semibold shrink-0 shadow-xs ${
                location.pathname === '/profile'
                  ? 'bg-[#744A2B] border-[#5C381E] text-white'
                  : 'border-[#E3DEC9] dark:border-[#44382E] bg-[#FAF8F5] dark:bg-[#261F1A] hover:bg-[#E3DEC9] text-[#5C381E] dark:text-[#D1C7BA]'
              }`}
              title="Profil National & Identité Académique"
              aria-label="Profil National"
            >
              <User size={15} className={location.pathname === '/profile' ? 'text-white' : 'text-[#744A2B] dark:text-[#D1C7BA]'} />
              <span className="hidden md:inline">Profil National</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-[#E3DEC9] dark:border-[#44382E] text-[#6E5D4F] dark:text-[#D1C7BA] hover:text-[#2C2218] hover:bg-[#E3DEC9]/60"
              aria-label="Ouvrir le menu"
            >
              <Menu size={16} />
            </button>

            <div className="leading-tight min-w-0 flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#2C2218] dark:text-[#FAF5F0] truncate">
                {getPageTitle(location.pathname)}
              </h1>

              <button
                type="button"
                onClick={() => setUniversityModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#5C381E] dark:text-[#D8D1B8] hover:text-[#2C2218] bg-[#FAF8F5] dark:bg-[#261F1A] hover:bg-[#E3DEC9] border border-[#E3DEC9] dark:border-[#44382E] transition-colors"
                title="Changer d'établissement universitaire"
              >
                <Building size={11} className="text-[#744A2B] dark:text-[#A87D56]" />
                <span className="font-semibold">{student.universityShortName || selectedUniversity?.shortName}</span>
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
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#E3DEC9]/60 dark:hover:bg-[#332B24] transition-colors border border-transparent hover:border-[#E3DEC9] dark:hover:border-[#44382E]"
              title={`${fullName} (${role})`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#744A2B]/15 border border-[#744A2B]/30 text-[#744A2B] dark:bg-[#A87D56]/20 dark:border-[#A87D56]/40 dark:text-[#FAF5F0] font-extrabold text-xs flex items-center justify-center">
                {getInitials(fullName)}
              </div>
              <div className="text-left hidden md:block leading-tight text-xs">
                <span className="font-bold text-[#2C2218] dark:text-[#FAF5F0] block truncate max-w-[120px]">
                  {fullName}
                </span>
                <span className="text-[10px] font-mono text-[#6E5D4F] dark:text-[#AFA28F] block truncate">
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
        <footer className="border-t border-[#E3DEC9] dark:border-[#44382E] bg-[#EFECE6]/90 dark:bg-[#1C1612]/90 py-4 px-4 sm:px-6 mt-auto transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6E5D4F] dark:text-[#AFA28F]">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-[#744A2B] dark:text-[#A87D56]" />
              <span>
                <strong className="text-[#2C2218] dark:text-[#FAF5F0]">CampusHub Cameroun</strong> · Consortium des Universités d'État & Grandes Écoles
              </span>
            </div>
            <div className="font-mono text-[#6E5D4F] dark:text-[#968574] text-[11px]">
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
