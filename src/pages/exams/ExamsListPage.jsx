import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  FileCheck2,
  Timer,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { examService } from '../../services/examService';
import { normalizeRole, ROLES } from '../../constants/rbacConstants';
import RoleBadge from '../../components/common/RoleBadge';
import RouteLoadingSkeleton from '../../components/common/RouteLoadingSkeleton';
import { useAcademicFilter } from '../../hooks/useAcademicFilter';
import DynamicContentGuard from '../../components/auth/DynamicContentGuard';

const SecureExamRoom = lazy(() => import('../../components/exams/SecureExamRoom'));
const AdminExamCreator = lazy(() => import('../../components/exams/AdminExamCreator'));

export default function ExamsListPage() {
  const { user } = useAuth();
  const { activeFiliere, activeNiveau } = useAcademicFilter();
  const currentRole = normalizeRole(user?.role);
  const isAdminOrModerator = currentRole === ROLES.ADMIN || currentRole === ROLES.MODERATOR;

  const [selectedExam, setSelectedExam] = useState(null);
  const [activeTab, setActiveTab] = useState(isAdminOrModerator ? 'admin' : 'student'); // 'student' | 'admin' | 'copies'
  const [updateCounter, setUpdateCounter] = useState(0);

  // Listen to custom updates from examService
  useEffect(() => {
    const handleUpdate = () => {
      setUpdateCounter((c) => c + 1);
    };
    window.addEventListener('campushub:exams_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('campushub:exams_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Available scoped exams for the active user
  const availableExams = useMemo(() => {
    return examService.getAvailableExams(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, updateCounter]);

  // Student's graded copies
  const mySubmissions = useMemo(() => {
    return examService.getStudentSubmissions(user?.matricule || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.matricule, updateCounter]);

  if (selectedExam) {
    return (
      <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<RouteLoadingSkeleton variant="simple" />}>
          <SecureExamRoom
            exam={selectedExam}
            onExit={() => {
              setSelectedExam(null);
              setUpdateCounter((c) => c + 1);
            }}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* SaaS Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <FileCheck2 size={13} className="text-indigo-400" />
                <span>Espace Compositions Sécurisées · Cloisonnement MINESUP</span>
              </span>
              <RoleBadge role={user?.role} size="xs" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Évaluations & Contrôles Continus en Ligne
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Compositions chronométrées en temps réel pour la filière <strong>{activeFiliere}</strong> ({activeNiveau}). Correction instantanée, sauvegarde automatique et enregistrement sécurisé sous votre matricule <strong>{user?.matricule || 'Officiel'}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">{availableExams.length}</div>
              <div className="text-[11px] text-indigo-300 font-semibold">Épreuves actives</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-400">{mySubmissions.length}</div>
              <div className="text-[11px] text-slate-300 font-semibold">Copies notées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Guard Certification Banner */}
      <DynamicContentGuard />

      {/* Admin / Moderator Multi-Mode Switcher */}
      {isAdminOrModerator && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Gestion & Création Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers size={14} />
            <span>Aperçu Étudiant ({availableExams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('copies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'copies'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award size={14} />
            <span>Copies & Relevés de Notes ({mySubmissions.length})</span>
          </button>
        </div>
      )}

      {/* TAB 1: ADMIN CREATOR & MANAGEMENT CONSOLE */}
      {isAdminOrModerator && activeTab === 'admin' && (
        <Suspense fallback={<RouteLoadingSkeleton variant="simple" />}>
          <AdminExamCreator onExamCreated={() => setUpdateCounter((c) => c + 1)} />
        </Suspense>
      )}

      {/* TAB 2: STUDENT AVAILABLE EXAMS */}
      {(!isAdminOrModerator || activeTab === 'student') && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Timer size={18} className="text-indigo-600" />
                <span>Compositions Disponibles pour votre Filière ({availableExams.length})</span>
              </h2>

              <span className="text-xs text-slate-400 font-medium">
                Filière : {user?.filiere || 'Informatique'} · {user?.niveau || 'L2'}
              </span>
            </div>

            {availableExams.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Aucune composition active pour votre filière
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Aucun examen n'est actuellement au statut actif pour la filière {user?.filiere || 'Informatique'} ({user?.niveau || 'L2'}). Revenez lors des créneaux officiels de contrôles continus.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
                          {exam.codeUe}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Timer size={13} className="text-indigo-500" />
                          <span>{exam.durationMinutes} minutes</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {exam.titre}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {exam.description}
                      </p>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div>Enseignant : <strong>{exam.professor}</strong></div>
                        <div>Barème officiel : <strong>{exam.totalPoints} points</strong> · Seuil validation : <strong>{exam.passPercentage}%</strong></div>
                        {exam.dateFin && (
                          <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                            Clôture : {new Date(exam.dateFin).toLocaleDateString()} à {new Date(exam.dateFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Prêt à composer</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedExam(exam)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Lancer la composition</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT COPIES & GRADE RECEIPTS */}
      {(!isAdminOrModerator || activeTab === 'copies' || activeTab === 'student') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <span>Mes Copies Notées & Relevés de Notes Sécurisés ({mySubmissions.length})</span>
          </h2>

          {mySubmissions.length === 0 ? (
            <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400">
              Vous n'avez pas encore validé de composition en ligne pour ce semestre.
            </div>
          ) : (
            <div className="space-y-3">
              {mySubmissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sub.codeUe}
                      </span>
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {sub.examTitle}
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Matricule : <strong>{sub.studentMatricule}</strong></span>
                      <span>•</span>
                      <span>Date : {new Date(sub.submittedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Intégrité : {sub.integrityScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base md:text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {sub.score} / {sub.totalPoints}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          sub.passed ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {sub.passed ? 'Admis (Validé)' : 'Ajourné'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
