import { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Megaphone,
  Code2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCampusHub } from '../../hooks/useCampusHub';
import { academicAccessService } from '../../services/academicAccessService';
import { ROLES, normalizeRole } from '../../constants/rbacConstants';
import RoleBadge from '../common/RoleBadge';
import ScopedClassScheduleManager from './ScopedClassScheduleManager';
import ScopedAnnouncementsBoard from './ScopedAnnouncementsBoard';
import RoleAccessManager from './RoleAccessManager';
import AcademicPlaygroundContainer from '../learning/AcademicPlaygroundContainer';

/**
 * StudentWorkspace
 * Composant Central de l'Espace de Travail des Étudiants (Université de Yaoundé I)
 *
 * Règles métier garanties :
 * 1. Filtrage Strict par Filière et Niveau (Cloisonnement Académique étanche : L1 !== L2 !== L3 !== M1 !== M2)
 * 2. Gestion des Rôles par Filière (Étudiant, Délégué, Modérateur, Administrateur)
 * 3. Intégration des Playgrounds et Ateliers interactifs spécifiques
 * 4. Planning de classe et tableau d'affichage officiel
 */
export default function StudentWorkspace() {
  const { user } = useAuth();
  const { selectedUniversity } = useCampusHub();
  const currentRole = normalizeRole(user?.role);
  const isAdmin = currentRole === ROLES.ADMIN;

  // Filière et Niveau connectés de l'étudiant
  const studentFiliere = user?.filiereId || user?.filiere || 'Informatique';
  const studentNiveau = user?.niveau || 'L2';
  const matricule = user?.matricule || '23Y1001';
  const displayName = user?.fullName || user?.nom || 'Étudiant';

  // Vue Admin : Permet à l'Administrateur de tester et d'auditer d'autres filières/niveaux
  const [adminFiliereFilter, setAdminFiliereFilter] = useState(studentFiliere);
  const [adminNiveauFilter, setAdminNiveauFilter] = useState(studentNiveau);

  // Valeurs effectives appliquées
  const activeFiliere = isAdmin ? adminFiliereFilter : studentFiliere;
  const activeNiveau = isAdmin ? adminNiveauFilter : studentNiveau;

  // Onglet actif : 'courses' | 'playground' | 'schedule' | 'announcements' | 'roles'
  const [activeTab, setActiveTab] = useState('courses');

  // Cours strictement cloisonnés
  const scopedCourses = useMemo(() => {
    return academicAccessService.getScopedCourses(user, {
      filiere: activeFiliere,
      niveau: activeNiveau,
    });
  }, [user, activeFiliere, activeNiveau]);

  // Total des crédits ECTS inscrits
  const totalCredits = useMemo(() => {
    return scopedCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
  }, [scopedCourses]);

  const filieresList = [
    'Informatique',
    'Chimie',
    'Physique',
    'Mathématiques',
    'Lettres modernes françaises',
    'Philosophie',
    'Histoire',
  ];

  const niveauxList = ['L1', 'L2', 'L3', 'M1', 'M2'];

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-100">
      {/* 1. Bandeau Administratif & Carte d'Identité Étudiante Sécurisée */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-2xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Lock size={12} className="text-indigo-400" />
                <span>Session Académique Scellée · MINESUP</span>
              </span>
              <RoleBadge role={currentRole} size="xs" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/10 font-mono">
                {activeNiveau}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Espace Académique : {displayName}</span>
              </h1>
              <p className="text-xs md:text-sm text-indigo-200/90 font-medium mt-1">
                Filière réservée : <strong>{activeFiliere}</strong> · Niveau <strong>{activeNiveau}</strong> · {selectedUniversity.name}
              </p>
            </div>

            {/* Jetons d'Identification Officiels */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white font-mono font-bold">
                Matricule : {matricule}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Cloisonnement Étanche Actif (L1 ≠ L2 ≠ L3 ≠ M1 ≠ M2)</span>
              </span>
            </div>
          </div>

          {/* Métriques d'Amphi */}
          <div className="grid grid-cols-3 gap-3 min-w-[280px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-white">{scopedCourses.length}</div>
              <div className="text-[10px] text-indigo-300 font-bold uppercase">UEs Inscrites</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-amber-400">{totalCredits}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Crédits ECTS</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-emerald-400">100%</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Isolement</div>
            </div>
          </div>
        </div>

        {/* Ambient lighting */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Barre d'Audit et de Démonstration pour Administrateur */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>Mode Super-Admin : Tester le cloisonnement sur n'importe quelle filière et niveau</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={adminFiliereFilter}
              onChange={(e) => setAdminFiliereFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs"
            >
              {filieresList.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select
              value={adminNiveauFilter}
              onChange={(e) => setAdminNiveauFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs"
            >
              {niveauxList.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 3. Navigation Principale de l'Espace de Travail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen size={14} />
            <span>Mes UEs & Cours ({scopedCourses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Code2 size={14} />
            <span>Playground & Ateliers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar size={14} />
            <span>Emploi du Temps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Megaphone size={14} />
            <span>Avis d'Amphi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'roles'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Gestion des Rôles (RBAC)</span>
          </button>
        </div>
      </div>

      {/* 4. Onglet 1 : UEs et Cours Rigoureusement Cloisonnés */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-400" />
                  <span>Unités d'Enseignement Filtrées ({activeFiliere} · {activeNiveau})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Étanchéité garantie : Seules les matières officielles de votre niveau actuel sont accessibles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 font-bold">
                  Total : {totalCredits} Crédits
                </span>
              </div>
            </div>

            {scopedCourses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                Aucune matière enregistrée pour ce cursus spécifique.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scopedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black bg-indigo-600 text-white">
                          {c.codeUe}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {c.credits} Crédits
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {c.titre}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-slate-300 truncate max-w-[150px]">
                        {c.enseignant}
                      </span>
                      <span className="text-indigo-400 font-bold">
                        {c.semestre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Onglet 2 : Playground & Ateliers Interactifs selon la filière */}
      {activeTab === 'playground' && (
        <AcademicPlaygroundContainer
          filiere={activeFiliere}
          niveau={activeNiveau}
        />
      )}

      {/* 6. Onglet 3 : Emploi du Temps Cloisonné */}
      {activeTab === 'schedule' && (
        <ScopedClassScheduleManager
          filiere={activeFiliere}
          niveau={activeNiveau}
        />
      )}

      {/* 7. Onglet 4 : Tableau d'Affichage & Avis de Classe */}
      {activeTab === 'announcements' && (
        <ScopedAnnouncementsBoard
          filiere={activeFiliere}
          niveau={activeNiveau}
        />
      )}

      {/* 8. Onglet 5 : Gestion des Rôles (RBAC) */}
      {activeTab === 'roles' && (
        <RoleAccessManager
          filiere={activeFiliere}
          niveau={activeNiveau}
        />
      )}
    </div>
  );
}
