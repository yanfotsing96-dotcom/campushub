import { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  Sparkles,
  Filter,
  FileCheck2,
  Award,
  ShieldAlert,
} from 'lucide-react';
import { useCampusHub } from '../../hooks/useCampusHub';
import { examService } from '../../services/examService';
import RoleBadge from '../../components/common/RoleBadge';

const INITIAL_QUEUE = [
  {
    id: 'rep-1',
    docId: 104,
    docTitle: 'Corrigé Examen INF201 (Arbres Binaires & AVL)',
    author: 'Etudiant_UY1_94',
    uploaderUniversity: 'Université de Yaoundé I',
    type: 'Plagiat Suspecté',
    severity: 'high',
    similarity: 78,
    reportedBy: 'Dr. Kamga (Enseignant)',
    reason: 'Document identique au polycopié de travaux pratiques sous copyright 2024 de l\'ENSPY sans citation de source.',
    date: 'Aujourd\'hui à 09:12',
    status: 'pending',
  },
  {
    id: 'rep-2',
    docId: 108,
    docTitle: 'Fiche Résumé Algèbre Linéaire MAT101',
    author: 'Junior_B',
    uploaderUniversity: 'Université de Douala',
    type: 'Qualité / Illisible',
    severity: 'medium',
    similarity: 12,
    reportedBy: 'Etudiant L1',
    reason: 'Photos floues prises au smartphone, pages 4 et 5 coupées à la reliure.',
    date: 'Hier à 18:40',
    status: 'pending',
  },
  {
    id: 'rep-3',
    docId: 112,
    docTitle: 'Annales Partiels Systèmes d\'Exploitation INF203',
    author: 'Michel_N',
    uploaderUniversity: 'Université de Dschang',
    type: 'Erreur d\'Énoncé',
    severity: 'low',
    similarity: 4,
    reportedBy: 'Brice Kamga (Délégué)',
    reason: 'La solution de l\'exercice 3 sur les sémaphores de Dijkstra contient un interblocage (Deadlock). Correction requise.',
    date: 'Il y a 2 jours',
    status: 'pending',
  },
];

export default function ModeratorDashboardPage() {
  const { triggerToast, selectedUniversity } = useCampusHub();
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [submissions, setSubmissions] = useState(() => examService.loadSubmissions());
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'submissions' | 'audit'

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchesSearch =
      item.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleApprove = (id, title) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'approved' } : q)));
    triggerToast({
      title: 'Document Validé ✅',
      message: `Le document « ${title} » a été certifié conforme et maintenu dans le catalogue.`,
      type: 'success',
    });
  };

  const handleReject = (id, title) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'rejected' } : q)));
    triggerToast({
      title: 'Document Retiré ❌',
      message: `Le document « ${title} » a été supprimé de la base nationale pour non-conformité.`,
      type: 'info',
    });
  };

  const handleRequestRevision = (id, title) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'revision_requested' } : q)));
    triggerToast({
      title: 'Demande de Révision Envoyée 📝',
      message: `Une notification de correction a été adressée à l'auteur de « ${title} ».`,
      type: 'info',
    });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* SaaS Moderator Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-sky-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <ShieldCheck size={14} className="text-sky-400" />
              <span>Espace Modération & Intégrité Académique</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Console de Modération des Ressources</span>
              <RoleBadge role="moderator" size="md" />
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Supervision de la qualité pédagogique pour <strong>{selectedUniversity.name}</strong> et le réseau national : validation des signalements, audit anti-plagiat et charte d'honnêteté intellectuelle.
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="grid grid-cols-2 gap-3 min-w-[260px] self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="text-2xl font-black text-white">
                {queue.filter((q) => q.status === 'pending').length}
              </div>
              <div className="text-[11px] text-sky-300 font-semibold">En attente d'audit</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="text-2xl font-black text-emerald-400">99.2%</div>
              <div className="text-[11px] text-slate-300 font-semibold">Intégrité académique</div>
            </div>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 max-w-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Signalements ({queue.filter((q) => q.status === 'pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('submissions');
              setSubmissions(examService.loadSubmissions());
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 size={14} />
            <span>Copies & Anti-Fraude ({submissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles size={14} />
            <span>Audit Anti-Plagiat</span>
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        /* Review Queue Section */
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un document ou auteur..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="all">Toutes les gravités</option>
                <option value="high">Critique / Plagiat élevé</option>
                <option value="medium">Moyenne (Qualité / Lisibilité)</option>
                <option value="low">Faible (Précision mineure)</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredQueue.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                {/* Meta Top Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.severity === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : item.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.type}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      Réf: #{item.id} · {item.uploaderUniversity}
                    </span>
                  </div>

                  {item.status !== 'pending' ? (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.status === 'approved'
                        ? 'Validé & Conforme'
                        : item.status === 'rejected'
                        ? 'Supprimé du catalogue'
                        : 'Révision demandée'}
                    </span>
                  ) : (
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>En attente de décision</span>
                    </span>
                  )}
                </div>

                {/* Content Info */}
                <div className="space-y-2">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.docTitle}
                  </h3>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        Motif du signalement ({item.reportedBy}) :
                      </span>
                      {item.similarity > 0 && (
                        <span
                          className={`font-mono font-bold text-[11px] ${
                            item.similarity > 50
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600'
                          }`}
                        >
                          Similarité IA : {item.similarity}%
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed">{item.reason}</p>
                  </div>
                </div>

                {/* Action Buttons for Moderator */}
                {item.status === 'pending' ? (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Auteur : <strong>{item.author}</strong> · Reçu le {item.date}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRequestRevision(item.id, item.docTitle)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw size={13} />
                        <span>Demander Révision</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(item.id, item.docTitle)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <XCircle size={13} />
                        <span>Rejeter / Supprimer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.docTitle)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle2 size={13} />
                        <span>Valider & Maintenir</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Décision enregistrée par la modération</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQueue((prev) =>
                          prev.map((q) => (q.id === item.id ? { ...q, status: 'pending' } : q))
                        )
                      }
                      className="text-sky-600 hover:underline text-[11px] font-semibold"
                    >
                      Réexaminer ce cas
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'submissions' ? (
        /* Exam Submissions & Anti-Cheat Queue */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 size={18} className="text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Copies d'Examens Transmises & Contrôle d'Intégrité ({submissions.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Synchronisation temps réel avec les salles d'examens
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Aucune copie en attente d'audit
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Toutes les compositions récentes ont été certifiées sans infraction anti-triche.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
                        {sub.codeUe}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {sub.examTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.focusLossCount > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <ShieldAlert size={12} />
                          <span>{sub.focusLossCount} sortie{sub.focusLossCount > 1 ? 's' : ''} de fenêtre</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Intégrité 100%</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-600 dark:text-slate-400">
                        Candidat : <strong className="text-slate-900 dark:text-slate-100">{sub.studentNom}</strong> ({sub.studentEmail})
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono">
                        Matricule certifié : {sub.studentMatricule} · Filière : {sub.filiereId} ({sub.niveau})
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                          {sub.score} / {sub.totalPoints}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${sub.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.passed ? 'Admis' : 'Ajourné'} ({sub.percentage}%)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerToast({
                            title: 'Copie Certifiée ✅',
                            message: `La note de ${sub.studentNom} (${sub.score}/${sub.totalPoints}) a été validée par la modération.`,
                            type: 'success',
                          });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Award size={13} />
                        <span>Certifier la copie</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Anti-Plagiarism Engine Explainer */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={18} className="text-sky-500" />
              <span>Moteur National d'Audit Anti-Plagiat</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Le moteur compare chaque rapport de TP et correction d'examen soumis avec la base d'annales des universités d'État (UY1, Douala, Dschang, Buea, ENSPY) pour prévenir la triche et garantir la fiabilité académique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                0% - 15% · Conforme
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Citations standards et formulations autonomes. Publication directe autorisée.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                16% - 40% · Alerte Modération
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Similarités significatives détectées. Vérification humaine requise par un modérateur.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-1">
              <div className="text-xs font-bold text-rose-700 dark:text-rose-300">
                &gt; 40% · Blocage Automatique
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Copier-coller manifeste ou fraude aux partiels. Suspension temporaire des droits de dépôt.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
