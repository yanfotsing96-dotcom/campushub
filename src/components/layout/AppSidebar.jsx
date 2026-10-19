import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Library,
  Sparkles,
  Award,
  Crown,
  ShieldCheck,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Building,
  FileCheck2,
  Check,
  LifeBuoy,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const RoleVerificationModal = lazy(() => import('../auth/RoleVerificationModal'));
import { useCampusHub } from '../../hooks/useCampusHub';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { ROLES, normalizeRole, isRoleAtLeast, ROLE_LABELS } from '../../constants/rbacConstants';
import { examService } from '../../services/examService';

const NAVIGATION_GROUPS = [
  {
    id: 'filiere',
    titleKey: 'nav.dashboard',
    items: [
      { path: '/dashboard', labelKey: 'nav.dashboard', defaultLabel: 'Tableau de Bord', icon: GraduationCap, isPrimary: true },
      { path: '/exams', labelKey: 'nav.exams', defaultLabel: 'Compositions en Ligne', icon: FileCheck2, hasExamBadge: true },
    ],
  },
  {
    id: 'labs',
    titleKey: 'nav.studyTools',
    items: [
      { path: '/learning', labelKey: 'nav.learning', defaultLabel: 'Laboratoires & Playgrounds', icon: Sparkles, isLabFlag: true },
    ],
  },
  {
    id: 'resources',
    titleKey: 'nav.nationalResources',
    items: [
      { path: '/ressources', labelKey: 'nav.resources', defaultLabel: 'Catalogue National', icon: Library },
    ],
  },
  {
    id: 'roles',
    titleKey: 'nav.proGovernance',
    items: [
      { path: '/delegate', labelKey: 'nav.delegate', defaultLabel: 'Espace Délégué', icon: Award, requiredRole: ROLES.DELEGATE },
      { path: '/moderation', labelKey: 'nav.moderation', defaultLabel: 'Console Modération', icon: ShieldCheck, requiredRole: ROLES.MODERATOR },
      { path: '/admin', labelKey: 'nav.admin', defaultLabel: 'Administration', icon: Crown, requiredRole: ROLES.ADMIN },
    ],
  },
];

export default function AppSidebar({ isCollapsed, onToggleCollapse, onNavigate, onOpenUniversityModal }) {
  const { student, switchRole: campusSwitchRole } = useCampusHub();
  const { user, logout, switchRole: authSwitchRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [verificationModalRole, setVerificationModalRole] = useState(null);
  const [examsCounter, setExamsCounter] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setExamsCounter((c) => c + 1);
    window.addEventListener('campushub:exams_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('campushub:exams_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Dynamic user data
  const fullName = user?.fullName || user?.nom || student?.fullName || student?.name || 'Étudiant';
  const matricule = user?.matricule || student?.matricule || '';
  const role = user?.role || student?.role || 'Étudiant';

  const activeExamsCount = useMemo(() => {
    return examService.getActiveExamsCountForUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, examsCounter]);

  const getInitials = (name) => {
    if (!name || name === 'Étudiant') return 'ET';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleRoleSelect = (targetRoleKey) => {
    setRoleDropdownOpen(false);
    if (targetRoleKey === ROLES.STUDENT) {
      if (authSwitchRole) authSwitchRole(targetRoleKey);
      if (campusSwitchRole) campusSwitchRole(ROLE_LABELS[targetRoleKey]);
    } else {
      setVerificationModalRole(targetRoleKey);
    }
  };

  const handleElevatedRoleSuccess = (elevatedRole) => {
    if (authSwitchRole) authSwitchRole(elevatedRole);
    if (campusSwitchRole) campusSwitchRole(ROLE_LABELS[elevatedRole]);
    setVerificationModalRole(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#EFECE6] dark:bg-[#1C1612] border-r border-[#E3DEC9] dark:border-[#44382E] flex flex-col justify-between transition-all duration-200 z-40 select-none text-[#2C2218] dark:text-[#FAF5F0] ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. Top Header with Immediate Top-Left Quick Access Icons (Aide & FAQ + Profil National) */}
      <div className="p-2.5 border-b border-[#E3DEC9] dark:border-[#44382E] flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Top-Left Help & FAQ Quick Access Button */}
          <Link
            to="/help"
            onClick={onNavigate}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 shadow-xs flex items-center justify-center ${
              location.pathname === '/help'
                ? 'bg-[#744A2B] border-[#5C381E] text-white shadow-xs'
                : 'border-[#E3DEC9] dark:border-[#44382E] bg-[#FAF8F5] dark:bg-[#261F1A] hover:bg-[#E3DEC9] text-[#744A2B] dark:text-[#D8D1B8]'
            }`}
            title="Centre d'Aide & FAQ"
            aria-label="Centre d'Aide & FAQ"
          >
            <LifeBuoy size={16} />
          </Link>

          {/* Top-Left National Profile Quick Access Button */}
          <Link
            to="/profile"
            onClick={onNavigate}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 shadow-xs flex items-center justify-center ${
              location.pathname === '/profile'
                ? 'bg-[#744A2B] border-[#5C381E] text-white shadow-xs'
                : 'border-[#E3DEC9] dark:border-[#44382E] bg-[#FAF8F5] dark:bg-[#261F1A] hover:bg-[#E3DEC9] text-[#744A2B] dark:text-[#D8D1B8]'
            }`}
            title="Profil National & Identité Académique"
            aria-label="Profil National"
          >
            <User size={16} />
          </Link>

          {!isCollapsed && (
            <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-1.5 overflow-hidden ml-1">
              <div className="leading-tight truncate">
                <span className="font-extrabold text-[#2C2218] dark:text-[#FAF5F0] text-xs sm:text-sm tracking-tight block truncate">
                  CampusHub 🇨🇲
                </span>
                <span className="text-[10px] text-[#6E5D4F] dark:text-[#AFA28F] font-semibold block truncate">
                  {student.universityShortName || 'National'}
                </span>
              </div>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg border border-[#E3DEC9] dark:border-[#44382E] text-[#6E5D4F] dark:text-[#AFA28F] hover:text-[#2C2218] hover:bg-[#E3DEC9]/70 transition-colors shrink-0"
          title={isCollapsed ? 'Déplier la barre latérale' : 'Replier'}
          aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Replier'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 2. User & University Status Card */}
      {!isCollapsed && (
        <div className="p-3 mx-2.5 my-2.5 rounded-2xl bg-[#F7F5F0] dark:bg-[#261F1A] border border-[#E3DEC9] dark:border-[#44382E] space-y-2 shadow-xs">
          {/* University Switcher Trigger */}
          <button
            type="button"
            onClick={onOpenUniversityModal}
            className="w-full px-2.5 py-1.5 rounded-xl bg-[#EFECE6] dark:bg-[#1C1612] hover:bg-[#E3DEC9] border border-[#E3DEC9] dark:border-[#44382E] text-left flex items-center justify-between text-xs transition-colors"
            title="Changer d'université"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Building size={12} className="text-[#744A2B] dark:text-[#A87D56] shrink-0" />
              <span className="font-bold text-[#2C2218] dark:text-[#FAF5F0] truncate text-[11px]">
                {student.universityShortName}
              </span>
            </div>
            <span className="text-[10px] text-[#744A2B] dark:text-[#D8D1B8] font-mono font-bold">
              Changer
            </span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E3DEC9] dark:border-[#44382E]">
            <Link
              to="/profile"
              onClick={onNavigate}
              className="flex items-center gap-2 min-w-0 group flex-1"
              title={`${fullName} (${matricule})`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#744A2B]/15 border border-[#744A2B]/30 text-[#744A2B] dark:bg-[#A87D56]/20 dark:border-[#A87D56]/40 dark:text-[#FAF5F0] font-bold text-xs flex items-center justify-center shrink-0">
                {getInitials(fullName)}
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold text-[#2C2218] dark:text-[#FAF5F0] block truncate group-hover:text-[#744A2B] transition-colors">
                  {fullName}
                </span>
                <span className="text-[10px] font-mono text-[#6E5D4F] dark:text-[#AFA28F] block truncate">
                  {matricule} · {user?.niveau || student?.niveau || 'L2'}
                </span>
              </div>
            </Link>

            {/* Role Trigger */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                className="px-2 py-1 rounded-md bg-[#FAF8F5] dark:bg-[#1C1612] hover:bg-[#E3DEC9] border border-[#E3DEC9] dark:border-[#44382E] flex items-center gap-1 transition-colors text-[10px] font-mono text-[#2C2218] dark:text-[#FAF5F0]"
                title="Changer de rôle"
              >
                <span>{role}</span>
                <ChevronDown size={10} className={`text-[#6E5D4F] ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#FAF8F5] dark:bg-[#261F1A] border border-[#E3DEC9] dark:border-[#44382E] rounded-xl shadow-2xl p-1 z-50 text-xs">
                  {[
                    { id: ROLES.STUDENT, label: 'Étudiant' },
                    { id: ROLES.DELEGATE, label: 'Délégué' },
                    { id: ROLES.MODERATOR, label: 'Modérateur' },
                    { id: ROLES.ADMIN, label: 'Administrateur' },
                  ].map((r) => {
                    const normCurrent = normalizeRole(role);
                    const isSelected = normCurrent === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#744A2B] text-white font-semibold'
                            : 'hover:bg-[#EFECE6] dark:hover:bg-[#332B24] text-[#2C2218] dark:text-[#FAF5F0]'
                        }`}
                      >
                        <span>{r.label}</span>
                        {isSelected && <Check size={12} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Links List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        {NAVIGATION_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.requiredRole) {
              return isRoleAtLeast(student.role, item.requiredRole);
            }
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-0.5">
              {!isCollapsed && (
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6E5D4F] dark:text-[#AFA28F] block font-bold">
                  {t(group.titleKey)}
                </span>
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey, item.defaultLabel) : (item.defaultLabel || '');

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    title={isCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#744A2B] text-white border border-[#5C381E] shadow-xs'
                          : 'text-[#6E5D4F] dark:text-[#D1C7BA] hover:text-[#2C2218] dark:hover:text-[#FAF5F0] hover:bg-[#E3DEC9]/70 dark:hover:bg-[#261F1A]'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`
                    }
                  >
                    <Icon size={16} className={`shrink-0 ${item.isLabFlag ? 'text-[#744A2B] dark:text-[#D8D1B8]' : 'text-current'}`} />

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{label}</span>
                    )}

                    {!isCollapsed && item.hasExamBadge && activeExamsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-800 text-white font-bold">
                        {activeExamsCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* 4. Footer Utilities (Theme Switcher & Logout) */}
      <div className="p-3 border-t border-[#E3DEC9] dark:border-[#44382E]">
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#6E5D4F] dark:text-[#AFA28F] hover:text-red-600 rounded-lg hover:bg-[#E3DEC9]/70 dark:hover:bg-[#261F1A] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Déconnexion"
          >
            <LogOut size={14} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {verificationModalRole && (
        <Suspense fallback={null}>
          <RoleVerificationModal
            targetRole={verificationModalRole}
            isOpen={!!verificationModalRole}
            onClose={() => setVerificationModalRole(null)}
            onSuccess={handleElevatedRoleSuccess}
          />
        </Suspense>
      )}
    </aside>
  );
}
