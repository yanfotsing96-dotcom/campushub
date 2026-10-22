import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileCheck2,
  BellRing,
  Lock,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Sparkles,
  Atom,
  TestTube2,
  Dna,
  Calculator,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCampusHub } from '../../hooks/useCampusHub';
import { departmentScopeService } from '../../services/departmentScopeService';
import { examService } from '../../services/examService';
import RoleBadge from '../../components/common/RoleBadge';
import ScopedCoursesManager from '../../components/courses/ScopedCoursesManager';
import DynamicContentGuard from '../../components/auth/DynamicContentGuard';

export default function StudentScopedDashboard() {
  const { user } = useAuth();
  const { student, selectedUniversity } = useCampusHub();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'exams' | 'announcements'

  const filiereId = user?.filiereLabel || user?.filiere || student.filiere || 'Informatique';
  const niveau = user?.niveau || student.niveau || 'L2';
  const matricule = user?.matricule || student.matricule || '';
  const displayName = user?.fullName || user?.nom || student.name || 'Étudiant';

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

  // Contextual icon and details for the student's Virtual Lab
  const getLabDetails = (filiere) => {
    const f = (filiere || '').toLowerCase();
    if (f.includes('phys')) {
      return {
        icon: Atom,
        title: 'Laboratoire de Physique Virtuelle',
        tools: 'Oscillateur RLC · Réfraction Snell-Descartes · Thermodynamique · Formulaire TP',
        color: 'text-sky-400 bg-sky-500/20 border-sky-500/30',
      };
    }
    if (f.includes('chim')) {
      return {
        icon: TestTube2,
        title: 'Laboratoire de Chimie Analytique',
        tools: 'Tableau Périodique Mendeleïev · Calculateur Molarité & pH · Équilibreur de Réactions',
        color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      };
    }
    if (f.includes('bio')) {
      return {
        icon: Dna,
        title: 'Laboratoire de Biologie Moléculaire',
        tools: 'Transcription/Traduction ADN · Échiquier de Punnett · Atlas Cellulaire & Mitose',
        color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      };
    }
    if (f.includes('math')) {
      return {
        icon: Calculator,
        title: 'Laboratoire de Mathématiques Appliquées',
        tools: 'Calcul Matriciel · Intégration Numérique (Simpson) · Tracé de Fonctions & Dérivées',
        color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      };
    }
    return {
      icon: Terminal,
      title: 'Laboratoire & Bac à Sable Informatique',
      tools: 'Playground C · Bac à Sable Python · Éditeur SQL interactif · Mémentos Algorithmiques',
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
    };
  };

  const labDetails = getLabDetails(filiereId);
  const LabIcon = labDetails.icon;

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Administrative Identity Card (Illuminated SaaS Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-850 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
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
                Portail réservé : <strong>{department.label}</strong> ({department.code}) · {user?.faculty ? `${user.faculty} · ` : ''}{selectedUniversity.name}
              </p>
            </div>

            {/* Official Administrative Credentials Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white font-mono font-bold">
                Matricule : {matricule}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-slate-300">
                🇨🇲 {student.universityShortName || selectedUniversity.shortName}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Inscrit 2025-2026</span>
              </span>
              <Link
                to="/profile"
                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Mon Profil Académique</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 self-start lg:self-auto min-w-[300px]">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/60 text-center">
              <div className="text-xl md:text-2xl font-black text-white">{scopedCourses.length}</div>
              <div className="text-[10px] text-indigo-300 font-bold uppercase">UEs Inscrites</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/60 text-center">
              <div className="text-xl md:text-2xl font-black text-amber-400">{availableExams.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Compositions</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/60 text-center">
              <div className="text-xl md:text-2xl font-black text-emerald-400">{mySubmissions.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Copies Validées</div>
            </div>
          </div>
        </div>

        {/* Decorative ambient light */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Dynamic Academic Isolation Guard Certification */}
      <DynamicContentGuard />

      {/* 2. Interactive Virtual Lab & Playground Direct Gateway */}
      <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/60 shadow-lg text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
            <LabIcon size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                {labDetails.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Filière {filiereId}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Outils interactifs & simulateurs dédiés : <strong className="text-slate-200">{labDetails.tools}</strong>
            </p>
          </div>
        </div>

        <Link
          to="/learning?tab=playground"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <Sparkles size={14} />
          <span>Lancer le Laboratoire</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* 3. Enrolled Courses Chips of the Semester */}
      <div className="bg-slate-800/95 border border-slate-700/70 rounded-3xl p-5 shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-400" />
            <span>Mes Unités d'Enseignement du Semestre ({filiereId} · {niveau})</span>
          </h2>
          <span className="text-[11px] text-indigo-400 font-bold font-mono">
            {scopedCourses.reduce((acc, c) => acc + (c.credits || 0), 0)} Crédits ECTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scopedCourses.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-700/80 space-y-1.5 hover:border-indigo-400 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
                  {c.codeUe}
                </span>
                <span className="text-[11px] font-bold text-slate-300 font-mono">
                  {c.credits} Crédits
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 leading-snug truncate">
                {c.titre}
              </h3>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>{c.enseignant}</span>
                <span className="text-indigo-400 font-semibold">{c.semestre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-3 gap-1.5 max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-750 hover:text-white'
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
                : 'text-slate-300 hover:bg-slate-750 hover:text-white'
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
                : 'text-slate-300 hover:bg-slate-750 hover:text-white'
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
        <div className="bg-slate-800/90 border border-slate-700/60 rounded-3xl p-6 shadow-xs space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Compositions & Examens Officiels de la Filière
              </h3>
              <p className="text-xs text-slate-400">
                Chronométrage synchrone, autosave en temps réel et correction automatique.
              </p>
            </div>
            <Link
              to="/exams"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Accéder à toutes les compositions</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableExams.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-2xl bg-slate-850/90 border border-slate-700/80 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-600 text-white">
                    {e.codeUe}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {e.durationMinutes} min · {e.totalPoints} pts
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100">
                  {e.titre}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {e.description}
                </p>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/exams"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
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
        <div className="bg-slate-800/95 border border-slate-700/70 rounded-3xl p-6 shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BellRing size={18} className="text-emerald-400" />
              <span>Tableau d'Affichage Officiel d'Amphi ({filiereId} · {niveau})</span>
            </h3>
            <span className="text-xs text-slate-400">Relayé par vos délégués</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-400">INF201 · Rattrapage TP</span>
                <span className="text-slate-400 text-[11px]">Aujourd'hui à 07:45</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">
                Séance obligatoire sur les Arbres Binaires de Recherche en C
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Ce samedi à 08h00 au Laboratoire Informatique B (Campus Ngoa-Ekellé). Venez avec vos ordinateurs portables ou clés USB.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-400">MAT201 · Changement Salle</span>
                <span className="text-slate-400 text-[11px]">Hier à 16:30</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">
                Déplacement du Contrôle Continu en Amphi 1001
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Le CC aura lieu en Amphi 1001 en raison des effectifs conjoints avec la filière Physique.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
