import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Library,
  Search,
  Sparkles,
  Clock,
  Award,
  Briefcase,
  Crown,
  ShieldCheck,
  Star,
  BookMarked,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  CheckCircle2,
  ChevronDown,
  Building,
  Cpu,
  HelpCircle,
  LayoutDashboard,
  FileCheck2,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import RoleBadge from '../common/RoleBadge';
import RoleVerificationModal from '../auth/RoleVerificationModal';
import { useCampusHub } from '../../hooks/useCampusHub';
import { useResources } from '../../hooks/useResources';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { ROLES, normalizeRole, isRoleAtLeast, ROLE_LABELS } from '../../constants/rbacConstants';

const NAVIGATION_GROUPS = [
  {
    id: 'filiere',
    titleKey: 'nav.dashboard',
    items: [
      { path: '/dashboard', labelKey: 'nav.dashboard', defaultLabel: 'Tableau de Bord Filière', icon: LayoutDashboard, isPrimary: true },
      { path: '/exams', labelKey: 'nav.exams', defaultLabel: 'Compositions en Ligne', icon: FileCheck2 },
    ],
  },
  {
    id: 'tech',
    titleKey: 'nav.coreTechFlagship',
    items: [
      { path: '/tech-hub', labelKey: 'nav.techHub', defaultLabel: 'Pôle Informatique & Code', icon: Cpu, isFlagshipTech: true },
    ],
  },
  {
    id: 'resources',
    titleKey: 'nav.nationalResources',
    items: [
      { path: '/ressources', labelKey: 'nav.resources', defaultLabel: 'Catalogue Multi-Universités', icon: Library },
      { path: '/search', labelKey: 'nav.search', defaultLabel: 'Recherche & Filtres', icon: Search },
      { path: '/favs-history', labelKey: 'nav.favorites', defaultLabel: 'Favoris & Historique', icon: Star, hasBadge: true },
    ],
  },
  {
    id: 'study',
    titleKey: 'nav.studyTools',
    items: [
      { path: '/learning', labelKey: 'nav.learning', defaultLabel: 'Playground & IA', icon: Sparkles },
      { path: '/productivity', labelKey: 'nav.productivity', defaultLabel: 'Productivité & iCal', icon: Clock },
      { path: '/evaluation', labelKey: 'nav.evaluation', defaultLabel: 'Évaluation & Mérite', icon: Award },
    ],
  },
  {
    id: 'campus',
    titleKey: 'nav.campusLife',
    items: [
      { path: '/services', labelKey: 'nav.services', defaultLabel: 'Services & Covoiturage', icon: Briefcase },
    ],
  },
  {
    id: 'pro',
    titleKey: 'nav.proGovernance',
    items: [
      { path: '/pricing', labelKey: 'nav.pricing', defaultLabel: 'CampusHub Pro', icon: Crown, highlight: true },
      { path: '/delegate', labelKey: 'nav.delegate', defaultLabel: 'Espace Délégué', icon: Award, requiredRole: ROLES.DELEGATE },
      { path: '/moderation', labelKey: 'nav.moderation', defaultLabel: 'Console Modération', icon: ShieldCheck, requiredRole: ROLES.MODERATOR },
      { path: '/admin', labelKey: 'nav.admin', defaultLabel: 'Administration', icon: Crown, requiredRole: ROLES.ADMIN },
    ],
  },
  {
    id: 'help',
    titleKey: 'nav.assistanceGuides',
    items: [
      { path: '/help', labelKey: 'nav.help', defaultLabel: 'Centre d\'Aide & FAQ', icon: HelpCircle },
    ],
  },
  {
    id: 'space',
    titleKey: 'nav.mySpace',
    items: [
      { path: '/notebook', labelKey: 'nav.notebook', defaultLabel: 'Carnet Privé', icon: BookMarked },
      { path: '/profile', labelKey: 'nav.profile', defaultLabel: 'Profil National', icon: User },
    ],
  },
];

export default function AppSidebar({ isCollapsed, onToggleCollapse, onOpenSearch, onNavigate, onOpenUniversityModal }) {
  const { student, switchRole } = useCampusHub();
  const { favoritesCount } = useResources();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [verificationModalRole, setVerificationModalRole] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* 1. Header with Brand & Collapse Trigger */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link to="/ressources" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black flex-shrink-0 shadow-md shadow-indigo-500/20">
            <GraduationCap size={22} />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tight block">
                CampusHub 🇨🇲
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider truncate max-w-[150px]">
                {student.universityShortName}
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 2. Student Role & Pro Status Widget */}
      {!isCollapsed && (
        <div className="p-3.5 mx-3 my-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
          {/* University Switcher Pill */}
          <button
            type="button"
            onClick={onOpenUniversityModal}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between text-xs transition-colors shadow-2xs"
            title="Changer d'université camerounaise"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Building size={13} className="text-indigo-600 flex-shrink-0" />
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                {student.universityShortName}
              </span>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
              {t('header.switchUniversity')}
            </span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                {student.name.charAt(0)}
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {student.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {student.matricule}
                </span>
              </div>
            </div>

            {/* Quick Role Switcher Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:border-indigo-400 transition-colors shadow-2xs"
                title="Bascule de rôle simulation"
              >
                <RoleBadge role={student.role} size="xs" />
                <ChevronDown size={11} className={`text-slate-400 mr-0.5 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Changer de Rôle (RBAC)
                  </div>
                  {[
                    { id: ROLES.STUDENT, label: 'Étudiant' },
                    { id: ROLES.DELEGATE, label: 'Délégué de classe' },
                    { id: ROLES.MODERATOR, label: 'Modérateur' },
                    { id: ROLES.ADMIN, label: 'Administrateur' },
                  ].map((r) => {
                    const normCurrent = normalizeRole(student.role);
                    const isSelected = normCurrent === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          if (r.id === ROLES.STUDENT) {
                            switchRole(ROLE_LABELS[r.id]);
                          } else {
                            setVerificationModalRole(r.id);
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <RoleBadge role={r.id} size="xs" />
                        </div>
                        {isSelected && <CheckCircle2 size={13} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pro Status or Upgrade CTA */}
          {student.isPro ? (
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 border border-amber-300/40 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Crown size={12} className="text-amber-500" />
                <span>Membre Pro UY1</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Illimité</span>
            </div>
          ) : (
            <Link
              to="/pricing"
              className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-amber-500" />
                <span>Passer à Pro</span>
              </span>
              <span className="font-mono text-[10px]">1 500 F</span>
            </Link>
          )}

          {/* XP Progress Bar */}
          <div className="space-y-1 pt-0.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span>{student.xp.toLocaleString()} XP</span>
              <span className="text-indigo-600 dark:text-indigo-400">Niveau {student.currentLevel}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${student.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Links List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
        {NAVIGATION_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.requiredRole) {
              return isRoleAtLeast(student.role, item.requiredRole);
            }
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {t(group.titleKey)}
                </span>
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const label = t(item.labelKey, item.defaultLabel);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    title={isCollapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                        : item.highlight && !student.isPro
                        ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon
                    size={17}
                    className={
                      item.highlight && !isCollapsed
                        ? 'text-amber-500'
                        : undefined
                    }
                  />

                  {!isCollapsed && (
                    <span className="flex-1 truncate">{label}</span>
                  )}

                  {!isCollapsed && item.hasBadge && favoritesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {favoritesCount}
                    </span>
                  )}

                  {!isCollapsed && item.isFlagshipTech && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xs">
                      TECH
                    </span>
                  )}

                  {!isCollapsed && item.highlight && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      PRO
                    </span>
                  )}
                </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* 4. Footer Utilities: Search, Theme & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Quick Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className={`w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between px-3'
          }`}
          title="Recherche globale rapide (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-indigo-600" />
            {!isCollapsed && <span>{t('header.searchLabel')}</span>}
          </div>
          {!isCollapsed && (
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          )}
        </button>

        {/* Theme & Logout Row */}
        <div
          className={`flex items-center ${
            isCollapsed ? 'flex-col gap-2' : 'justify-between'
          }`}
        >
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title={t('nav.logout')}
          >
            <LogOut size={15} />
            {!isCollapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </div>

      <RoleVerificationModal
        targetRole={verificationModalRole}
        isOpen={!!verificationModalRole}
        onClose={() => setVerificationModalRole(null)}
        onSuccess={(elevated) => switchRole(ROLE_LABELS[elevated])}
      />
    </aside>
  );
}
