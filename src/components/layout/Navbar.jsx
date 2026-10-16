import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import GlobalSearchModal from '../search/GlobalSearchModal';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION_ITEMS } from '../../routes/navigationConfig';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.fullName || user?.nom || 'Étudiant';
  const matricule = user?.matricule || '';
  const role = user?.role || 'Étudiant';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'ET';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          {/* Zone 1: Single Brand element */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-100 whitespace-nowrap">
              CampusHub Cameroun
            </span>
          </Link>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
            {NAVIGATION_ITEMS.slice(0, 6).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap transition-colors hover:text-slate-100 ${
                    isActive ? 'text-white font-semibold' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Search, Theme & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-300 text-xs hover:bg-slate-750 hover:text-white transition-colors"
              title="Recherche globale (⌘K)"
            >
              <Search size={13} />
              <span>Rechercher...</span>
              <kbd className="px-1 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors text-left"
              title={`${fullName} (${role})`}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center">
                {getInitials(fullName)}
              </div>
              <div className="hidden sm:block leading-tight text-xs">
                <span className="font-semibold text-slate-200 block truncate max-w-[120px]">
                  {fullName}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block truncate">
                  {matricule}
                </span>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/80 bg-slate-900 p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700/80 text-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center">
                {getInitials(fullName)}
              </div>
              <div>
                <span className="font-semibold text-white block">{fullName}</span>
                <span className="text-slate-500 font-mono text-[11px] block">{matricule} · {role}</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`
                    }
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
              >
                <LogOut size={15} />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
    </>
  );
}
