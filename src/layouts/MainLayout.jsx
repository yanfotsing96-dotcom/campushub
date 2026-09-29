import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Crown,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import AppSidebar from '../components/layout/AppSidebar';
import GlobalSearchModal from '../components/search/GlobalSearchModal';
import GlobalToast from '../components/common/GlobalToast';
import ThemeToggle from '../components/common/ThemeToggle';
import { useCampusHub } from '../hooks/useCampusHub';
export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  const { student } = useCampusHub();
  const location = useLocation();

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

  // Determine current active module name
  const getPageTitle = (path) => {
    if (path.startsWith('/ressources')) return 'Ressources Académiques';
    if (path.startsWith('/search')) return 'Recherche & Filtres Avancés';
    if (path.startsWith('/learning')) return 'Apprentissage, Playground & IA';
    if (path.startsWith('/productivity')) return 'Productivité, Pomodoro & iCal';
    if (path.startsWith('/evaluation')) return 'Évaluation, Points & Anti-Plagiat';
    if (path.startsWith('/services')) return 'Services Annexes & Covoiturage';
    if (path.startsWith('/pricing')) return 'Tarifs & CampusHub Pro';
    if (path.startsWith('/admin')) return 'Administration & Supervision';
    if (path.startsWith('/favs-history') || path.startsWith('/favorites')) return 'Favoris & Historique';
    if (path.startsWith('/notebook')) return 'Carnet Privé Sécurisé';
    if (path.startsWith('/profile')) return 'Mon Profil Étudiant';
    return 'CampusHub UY1';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenSearch={() => setGlobalSearchOpen(true)}
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
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                    UY1 · Ngoa-Ekellé
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  Faculté des Sciences · Année Universitaire 2025-2026
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
                <span>Rechercher...</span>
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
                  <span>Pro Actif</span>
                </Link>
              ) : (
                <Link
                  to="/pricing"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Passer Pro</span>
                </Link>
              )}

              <ThemeToggle />

              {/* Profile Avatar Link */}
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Consulter mon profil"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {student.name.charAt(0)}
                </div>
                <div className="text-left hidden xl:block leading-tight">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {student.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {student.role}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet with smooth transition */}
        <main className="flex-1 w-full animate-in fade-in duration-150">
          <Outlet />
        </main>

        {/* Global Institutional Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 transition-colors mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-600" />
              <span>
                <strong>CampusHub UY1</strong> · Plateforme d'Entraide Académique
              </span>
            </div>
            <div>
              Faculté des Sciences · Université de Yaoundé I (Ngoa-Ekellé) · 2025-2026
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
    </div>
  );
}
