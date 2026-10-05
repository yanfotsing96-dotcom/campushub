import { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Crown,
  GraduationCap,
  Sparkles,
  Building,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';
import AppSidebar from '../components/layout/AppSidebar';
import GlobalSearchModal from '../components/search/GlobalSearchModal';
import UniversitySelectorModal from '../components/common/UniversitySelectorModal';
import GlobalToast from '../components/common/GlobalToast';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSelector from '../components/common/LanguageSelector';
import { useCampusHub } from '../hooks/useCampusHub';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { ROLES, normalizeRole } from '../constants/rbacConstants';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [universityModalOpen, setUniversityModalOpen] = useState(false);

  const { student, selectedUniversity } = useCampusHub();
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  // Dynamic user data from authentication state
  const fullName = user?.fullName || user?.nom || student?.fullName || student?.name || 'Étudiant';
  const matricule = user?.matricule || student?.matricule || '';
  const role = user?.role || student?.role || 'Étudiant';
  const isPro = user?.isPro !== undefined ? user.isPro : student?.isPro;
  const status = user?.status || (isPro ? 'Étudiant Pro' : (user?.roleLabel || student?.role)) || 'Étudiant';

  // Dynamic initials helper
  const getInitials = (name) => {
    if (!name || name === 'Étudiant') return 'ET';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Role conditional styling helper (SaaS / Vercel theme)
  const getRoleTheme = (userRole, userStatus) => {
    const norm = normalizeRole(userRole);
    const isProUser = userStatus === 'Étudiant Pro' || userStatus?.toLowerCase().includes('pro');

    if (isProUser && norm === ROLES.STUDENT) {
      return {
        badgeBg: 'bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/60 shadow-amber-500/10',
        dotBg: 'bg-amber-500',
        avatarBg: 'bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 text-white',
        borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
        icon: Crown,
        label: userStatus || 'Étudiant Pro',
      };
    }

    switch (norm) {
      case ROLES.ADMIN:
        return {
          badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          dotBg: 'bg-purple-500',
          avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white',
          borderHover: 'hover:border-purple-400 dark:hover:border-purple-600',
          icon: Crown,
          label: userStatus || 'Administrateur',
        };
      case ROLES.MODERATOR:
        return {
          badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          dotBg: 'bg-sky-500',
          avatarBg: 'bg-gradient-to-tr from-sky-600 to-blue-600 text-white',
          borderHover: 'hover:border-sky-400 dark:hover:border-sky-600',
          icon: ShieldCheck,
          label: userStatus || 'Modérateur',
        };
      case ROLES.DELEGATE:
        return {
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dotBg: 'bg-emerald-500',
          avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white',
          borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
          icon: Award,
          label: userStatus || 'Délégué',
        };
      case ROLES.STUDENT:
      default:
        return {
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          dotBg: 'bg-indigo-500',
          avatarBg: 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white',
          borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
          icon: BookOpen,
          label: userStatus || 'Étudiant',
        };
    }
  };

  const roleTheme = getRoleTheme(role, status);
  const RoleIcon = roleTheme.icon;

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current active module name (dynamic bilingual translation)
  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard') || path.startsWith('/courses')) return t('nav.dashboard');
    if (path.startsWith('/exams')) return t('nav.exams');
    if (path.startsWith('/tech-hub')) return t('nav.techHub');
    if (path.startsWith('/ressources')) return t('nav.resources');
    if (path.startsWith('/search')) return t('nav.search');
    if (path.startsWith('/learning')) return t('nav.learning');
    if (path.startsWith('/productivity')) return t('nav.productivity');
    if (path.startsWith('/evaluation')) return t('nav.evaluation');
    if (path.startsWith('/services')) return t('nav.services');
    if (path.startsWith('/pricing')) return t('nav.pricing');
    if (path.startsWith('/delegate')) return t('nav.delegate');
    if (path.startsWith('/moderation')) return t('nav.moderation');
    if (path.startsWith('/admin')) return t('nav.admin');
    if (path.startsWith('/help')) return t('nav.help');
    if (path.startsWith('/favs-history') || path.startsWith('/favorites')) return t('nav.favorites');
    if (path.startsWith('/notebook')) return t('nav.notebook');
    if (path.startsWith('/profile')) return t('nav.profile');
    return 'CampusHub Cameroun 🇨🇲';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenSearch={() => setGlobalSearchOpen(true)}
          onOpenUniversityModal={() => setUniversityModalOpen(true)}
        />
      </div>

      {/* 2. Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl">
            <AppSidebar
              isCollapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              onNavigate={() => setMobileMenuOpen(false)}
              onOpenSearch={() => {
                setMobileMenuOpen(false);
                setGlobalSearchOpen(true);
              }}
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
        {/* Sticky Institutional Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                aria-label="Ouvrir le menu"
              >
                <Menu size={18} />
              </button>

              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {getPageTitle(location.pathname)}
                  </h1>

                  {/* University Switcher Trigger in Topbar */}
                  <button
                    type="button"
                    onClick={() => setUniversityModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 transition-colors"
                    title="Changer d'université camerounaise"
                  >
                    <Building size={11} className="text-indigo-600" />
                    <span>{student.universityShortName}</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  {selectedUniversity.name} · {student.filiere}
                </span>
              </div>
            </div>

            {/* Right: Actions, Search, Pro Pill, Theme & Profile */}
            <div className="flex items-center gap-2.5">
              {/* Quick Search Trigger */}
              <button
                type="button"
                onClick={() => setGlobalSearchOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                <Search size={14} className="text-indigo-600" />
                <span>{t('header.searchLabel')}</span>
                <kbd className="px-1 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>

              {/* Pro Status Pill */}
              {student.isPro ? (
                <Link
                  to="/pricing"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm"
                  title="Abonnement CampusHub Pro Actif"
                >
                  <Crown size={13} />
                  <span>{t('header.proActive')}</span>
                </Link>
              ) : (
                <Link
                  to="/pricing"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  <Sparkles size={13} className="text-amber-300" />
                  <span>{t('header.upgradePro')}</span>
                </Link>
              )}

              {/* Global Language Selector (FR / EN) */}
              <LanguageSelector variant="dropdown" />

              <ThemeToggle />

              {/* Profile Avatar Link with Dynamic User Info & Conditional Role Badge */}
              <Link
                to="/profile"
                className={`group flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/90 transition-all shadow-2xs ${roleTheme.borderHover}`}
                title={`Profil de ${fullName} (${status} · ${matricule})`}
              >
                {/* Avatar with Initials & live status dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${roleTheme.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs transition-transform group-hover:scale-105`}>
                    {getInitials(fullName)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${roleTheme.dotBg} border-2 border-white dark:border-slate-800`} />
                </div>

                {/* User Info (Full Name + Matricule) */}
                <div className="text-left hidden md:block leading-tight">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[150px]">
                    {fullName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block tracking-tight">
                    {matricule}
                  </span>
                </div>

                {/* Status Badge with Conditional Role Colors */}
                <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${roleTheme.badgeBg}`}>
                  <RoleIcon size={11} className="flex-shrink-0" />
                  <span>{roleTheme.label}</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet with smooth transition, Suspense and Error Boundary */}
        <main className="flex-1 w-full animate-in fade-in duration-150">
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Global Institutional Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 transition-colors mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-600" />
              <span>
                <strong>CampusHub Cameroun 🇨🇲</strong> · Plateforme Nationale d'Entraide Académique
              </span>
            </div>
            <div>
              Consortium des Universités d'État & Écoles d'Ingénieurs du Cameroun · 2025-2026
            </div>
          </div>
        </footer>
      </div>

      {/* Global Interactive Utilities */}
      <GlobalToast />
      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
      <UniversitySelectorModal
        isOpen={universityModalOpen}
        onClose={() => setUniversityModalOpen(false)}
      />
    </div>
  );
}
