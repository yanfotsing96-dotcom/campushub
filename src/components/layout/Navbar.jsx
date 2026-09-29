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
import { useResources } from '../../hooks/useResources';
import { NAVIGATION_ITEMS } from '../../routes/navigationConfig';
import '../../styles/LinkNav.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { favoritesCount } = useResources();
  const navigate = useNavigate();

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
    if (!name) return 'ET';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
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

            <Link to="/profile" className="user-profile-badge" title="Mon Profil Étudiant">
              <div className="avatar-chip">
                {getInitials(user?.nom)}
              </div>
              <div className="user-info-text">
                <span className="user-name">{user?.nom?.split(' ')[0] || 'Étudiant'}</span>
                <span className="user-role">{user?.niveau || 'L2'} · {user?.filiere || 'Info'}</span>
              </div>
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
                {getInitials(user?.nom)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.nom}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user?.matricule} · {user?.filiere} ({user?.niveau})
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
