import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  Search,
  Crown,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import GlobalSearchModal from '../search/GlobalSearchModal';
import { useAuth } from '../../hooks/useAuth';
import { useResources } from '../../hooks/useResources';
import { NAVIGATION_ITEMS } from '../../routes/navigationConfig';
import { ROLES, normalizeRole } from '../../constants/rbacConstants';
import '../../styles/LinkNav.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { favoritesCount } = useResources();
  const navigate = useNavigate();

  // Dynamic user data
  const fullName = user?.fullName || user?.nom || 'Étudiant';
  const matricule = user?.matricule || '';
  const role = user?.role || 'Étudiant';
  const isPro = user?.isPro ?? true;
  const status = user?.status || (isPro ? 'Étudiant Pro' : (user?.roleLabel || 'Étudiant'));

  // Role conditional styling helper (SaaS / Vercel theme)
  const getRoleTheme = (userRole, userStatus) => {
    const norm = normalizeRole(userRole);
    const isProUser = userStatus === 'Étudiant Pro' || userStatus?.toLowerCase().includes('pro');

    if (isProUser && norm === ROLES.STUDENT) {
      return {
        badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/60',
        dotBg: 'bg-amber-500',
        avatarBg: 'bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 text-white',
        icon: Crown,
        label: 'Étudiant Pro',
      };
    }

    switch (norm) {
      case ROLES.ADMIN:
        return {
          badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          dotBg: 'bg-purple-500',
          avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white',
          icon: Crown,
          label: userStatus || 'Administrateur',
        };
      case ROLES.MODERATOR:
        return {
          badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          dotBg: 'bg-sky-500',
          avatarBg: 'bg-gradient-to-tr from-sky-600 to-blue-600 text-white',
          icon: ShieldCheck,
          label: userStatus || 'Modérateur',
        };
      case ROLES.DELEGATE:
        return {
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dotBg: 'bg-emerald-500',
          avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white',
          icon: Award,
          label: userStatus || 'Délégué',
        };
      case ROLES.STUDENT:
      default:
        return {
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          dotBg: 'bg-indigo-500',
          avatarBg: 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white',
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'YF';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <header className="academic-header">
        <div className="academic-nav-container">
          {/* Brand Section */}
          <Link to="/ressources" className="brand-logo">
            <div className="brand-icon-box">
              <GraduationCap size={22} />
            </div>
            <div className="brand-texts">
              <span className="brand-title">CampusHub</span>
              <span className="brand-subtitle">Univ. Yaoundé I</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            <ul className="nav-links">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={17} className="nav-item-icon" />
                      <span>{item.label}</span>
                      {item.badgeKey === 'favoritesCount' && favoritesCount > 0 && (
                        <span
                          style={{
                            backgroundColor: 'var(--primary, #6366f1)',
                            color: '#ffffff',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            marginLeft: '2px',
                          }}
                        >
                          {favoritesCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Section: Global Search Trigger, Theme Toggle & Profile */}
          <div className="nav-actions">
            {/* Quick Global Search Trigger Button */}
            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--bg-subtle, #f1f5f9)',
                border: '1px solid var(--border-subtle, #e2e8f0)',
                color: 'var(--text-muted, #64748b)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Recherche globale rapide (Raccourci ⌘K ou Ctrl+K)"
            >
              <Search size={15} color="var(--primary, #6366f1)" />
              <span className="global-search-text" style={{ display: 'none' }}>Rechercher...</span>
              <kbd
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'inherit',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #cbd5e1)',
                  color: 'var(--text-muted, #64748b)',
                }}
              >
                ⌘K
              </kbd>
            </button>

            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>

            <Link
              to="/profile"
              className="user-profile-badge"
              title={`Profil de ${fullName} (${status} · ${matricule})`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div className="avatar-chip" style={{ position: 'relative' }}>
                {getInitials(fullName)}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: roleTheme.dotBg.includes('amber') ? '#f59e0b' : roleTheme.dotBg.includes('purple') ? '#a855f7' : roleTheme.dotBg.includes('sky') ? '#0ea5e9' : roleTheme.dotBg.includes('emerald') ? '#10b981' : '#6366f1',
                    border: '2px solid var(--bg-surface, #ffffff)',
                  }}
                />
              </div>
              <div className="user-info-text">
                <span className="user-name" style={{ fontWeight: 700 }}>{fullName}</span>
                <span className="user-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {matricule} · {user?.filiere || 'Info'}
                </span>
              </div>
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${roleTheme.badgeBg}`}
                style={{ marginLeft: '4px' }}
              >
                <RoleIcon size={10} />
                <span>{roleTheme.label}</span>
              </span>
            </Link>

            {/* Mobile hamburger button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer" style={{ display: 'block' }}>
            <div className="mobile-drawer-user" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="avatar-chip large">
                {getInitials(fullName)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {matricule} · {user?.filiere || 'Informatique'} ({user?.niveau || 'L2'})
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${roleTheme.badgeBg}`}>
                    <RoleIcon size={10} />
                    <span>{roleTheme.label}</span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGlobalSearchOpen(true);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <Search size={16} color="var(--primary, #6366f1)" />
                <span>Recherche globale... (⌘K)</span>
              </button>
            </div>

            <ul className="mobile-drawer-links" style={{ listStyle: 'none', padding: '12px 0', margin: 0 }}>
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: 500,
                      }}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                      {item.badgeKey === 'favoritesCount' && favoritesCount > 0 && (
                        <span
                          style={{
                            backgroundColor: 'var(--primary, #6366f1)',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            marginLeft: 'auto',
                          }}
                        >
                          {favoritesCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
    </>
  );
}
