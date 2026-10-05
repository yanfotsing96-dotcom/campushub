import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileCheck2,
  BellRing,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCampusHub } from '../../hooks/useCampusHub';
import { departmentScopeService } from '../../services/departmentScopeService';
import { examService } from '../../services/examService';
import RoleBadge from '../../components/common/RoleBadge';
import ScopedCoursesManager from '../../components/courses/ScopedCoursesManager';
import DynamicPoleTechBlock from '../../components/tech/DynamicPoleTechBlock';

export default function StudentScopedDashboard() {
  const { user } = useAuth();
  const { selectedUniversity } = useCampusHub();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'exams' | 'announcements'

  const filiereId = user?.filiereId || user?.filiere || 'Informatique';
  const niveau = user?.niveau || 'L2';
  const matricule = user?.matricule || '';
  const displayName = user?.fullName || user?.nom || 'Étudiant';

  const department = useMemo(() => {
    return departmentScopeService.getDepartment(filiereId);
  }, [filiereId]);

  const scopedCourses = useMemo(() => {
    return departmentScopeService.getScopedCourses(user, { filiereId, niveau });
  }, [user, filiereId, niveau]);

  const availableExams = useMemo(() => {
    return examService.getAvailableExams(user);
  }, [user]);

  const mySubmissions = useMemo(() => {
    return examService.getStudentSubmissions(matricule);
  }, [matricule]);

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Administrative Identity Card (SaaS Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Lock size={12} className="text-indigo-400" />
                <span>Session Académique Scellée · MINESUP</span>
              </span>
              <RoleBadge role={user?.role} size="xs" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200">
                {niveau}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Bonjour, {displayName} !</span>
              </h1>
              <p className="text-xs md:text-sm text-indigo-200/90 font-medium mt-1">
                Portail réservé : <strong>{department.label}</strong> ({department.code}) · {selectedUniversity.name}
              </p>
            </div>

            {/* Official Administrative Credentials Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white font-mono font-bold">
                Matricule : {matricule}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-slate-300">
                {user?.email}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Inscrit 2025-2026</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 self-start lg:self-auto min-w-[300px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-white">{scopedCourses.length}</div>
              <div className="text-[10px] text-indigo-300 font-bold uppercase">UEs Inscrites</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-amber-400">{availableExams.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Compositions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-xl md:text-2xl font-black text-emerald-400">{mySubmissions.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Copies Validées</div>
            </div>
          </div>
        </div>

        {/* Decorative ambient light */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Enrolled Courses Chips of the Semester */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-600" />
            <span>Mes Unités d'Enseignement du Semestre ({filiereId} · {niveau})</span>
          </h2>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            {scopedCourses.reduce((acc, c) => acc + (c.credits || 0), 0)} Crédits ECTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scopedCourses.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
                  {c.codeUe}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {c.credits} Crédits
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug truncate">
                {c.titre}
              </h3>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>{c.enseignant}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{c.semestre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pôle Spécialisé & Outils Filière Dynamiques */}
      <DynamicPoleTechBlock showSimulator={false} />

      {/* 4. Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-3 gap-1.5 max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen size={14} />
            <span>Supports & Polycopiés</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'exams'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 size={14} />
            <span>Compositions en Ligne ({availableExams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BellRing size={14} />
            <span>Avis de Promotion</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Scoped Courses Manager */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <ScopedCoursesManager />
        </div>
      )}

      {/* Tab 2: Quick Online Exams Access */}
      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Compositions & Examens Officiels de la Filière
              </h3>
              <p className="text-xs text-slate-400">
                Chronométrage synchrone, autosave en temps réel et correction automatique.
              </p>
            </div>
            <Link
              to="/exams"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Accéder à l'espace compositions complet</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableExams.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-600 text-white">
                    {e.codeUe}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {e.durationMinutes} min · {e.totalPoints} pts
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {e.titre}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {e.description}
                </p>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/exams"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <span>Composer</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Department Class Announcements */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BellRing size={18} className="text-emerald-600" />
              <span>Tableau d'Affichage Officiel d'Amphi ({filiereId} · {niveau})</span>
            </h3>
            <span className="text-xs text-slate-400">Relayé par vos délégués</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">INF201 · Rattrapage TP</span>
                <span className="text-slate-400 text-[11px]">Aujourd'hui à 07:45</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Séance obligatoire sur les Arbres Binaires de Recherche en C
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Ce samedi à 08h00 au Laboratoire Informatique B (Campus Ngoa-Ekellé). Venez avec vos ordinateurs portables ou clés USB.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">MAT201 · Changement Salle</span>
                <span className="text-slate-400 text-[11px]">Hier à 16:30</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Déplacement du Contrôle Continu en Amphi 1001
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Le CC aura lieu en Amphi 1001 en raison des effectifs conjoints avec la filière Physique.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
