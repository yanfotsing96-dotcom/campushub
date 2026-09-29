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
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useCampusHub } from '../../hooks/useCampusHub';
import { useResources } from '../../hooks/useResources';
import { useAuth } from '../../hooks/useAuth';

const NAVIGATION_GROUPS = [
  {
    title: 'ACADÉMIQUE',
    items: [
      { path: '/ressources', label: 'Ressources & Cours', icon: Library },
      { path: '/search', label: 'Recherche & Filtres', icon: Search },
      { path: '/favs-history', label: 'Favoris & Historique', icon: Star, hasBadge: true },
    ],
  },
  {
    title: 'OUTILS D\'ÉTUDE',
    items: [
      { path: '/learning', label: 'Playground & IA', icon: Sparkles },
      { path: '/productivity', label: 'Productivité & iCal', icon: Clock },
      { path: '/evaluation', label: 'Évaluation & Mérite', icon: Award },
    ],
  },
  {
    title: 'VIE DU CAMPUS',
    items: [
      { path: '/services', label: 'Services & Covoiturage', icon: Briefcase },
    ],
  },
  {
    title: 'PRO & CONTRÔLE',
    items: [
      { path: '/pricing', label: 'CampusHub Pro', icon: Crown, highlight: true },
      { path: '/admin', label: 'Administration', icon: ShieldCheck, adminOnly: true },
    ],
  },
  {
    title: 'MON ESPACE',
    items: [
      { path: '/notebook', label: 'Carnet Privé', icon: BookMarked },
      { path: '/profile', label: 'Profil Étudiant', icon: User },
    ],
  },
];

export default function AppSidebar({ isCollapsed, onToggleCollapse, onOpenSearch, onNavigate }) {
  const { student, switchRole } = useCampusHub();
  const { favoritesCount } = useResources();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black flex-shrink-0 shadow-md shadow-indigo-500/20">
            <GraduationCap size={22} />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tight block">
                CampusHub
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">
                Univ. Yaoundé I
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
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
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:border-indigo-400 transition-colors"
                title="Bascule de rôle simulation"
              >
                <span>{student.role}</span>
                <ChevronDown size={11} className={roleDropdownOpen ? 'rotate-180' : ''} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 text-xs">
                  {['Étudiant', 'Délégué', 'Modérateur', 'Administrateur'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                        student.role === r
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{r}</span>
                      {student.role === r && <CheckCircle2 size={12} />}
                    </button>
                  ))}
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
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {group.title}
              </span>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  title={isCollapsed ? item.label : undefined}
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
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.hasBadge && favoritesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {favoritesCount}
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
        ))}
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
            {!isCollapsed && <span>Rechercher...</span>}
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
            title="Se déconnecter"
          >
            <LogOut size={15} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
