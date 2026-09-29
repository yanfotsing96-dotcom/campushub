import { useState, useMemo } from 'react';
import {
  Flag,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  FileText,
} from 'lucide-react';
import { INITIAL_CONTENT_REPORTS } from './data/adminData';

const STORAGE_REPORTS_KEY = 'campushub_admin_reports_queue';

export default function ContentReportsQueue() {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONTENT_REPORTS;
    } catch {
      return INITIAL_CONTENT_REPORTS;
    }
  });

  const [statusFilter, setStatusFilter] = useState('EN_ATTENTE');
  const [bannerMessage, setBannerMessage] = useState('');

  const saveReports = (updated) => {
    setReports(updated);
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  // Resolve by deleting/moderating content
  const handleRemoveContent = (reportId) => {
    const updated = reports.map((r) =>
      r.id === reportId ? { ...r, status: 'TRAITE', resolution: 'Contenu supprimé / masqué' } : r
    );
    saveReports(updated);
    setBannerMessage('Le contenu a été retiré de la plateforme CampusHub et l\'auteur a été notifié.');
    setTimeout(() => setBannerMessage(''), 4000);
  };

  // Dismiss report as conforming
  const handleDismissReport = (reportId) => {
    const updated = reports.map((r) =>
      r.id === reportId ? { ...r, status: 'REJETE', resolution: 'Contenu jugé conforme et maintenu' } : r
    );
    saveReports(updated);
    setBannerMessage('Le signalement a été classé sans suite. Le document reste en ligne.');
    setTimeout(() => setBannerMessage(''), 4000);
  };

  // Request author fix
  const handleRequestCorrection = (reportId) => {
    const updated = reports.map((r) =>
      r.id === reportId
        ? { ...r, status: 'CORRECTION_DEMANDEE', resolution: 'Demande de révision envoyée à l\'auteur' }
        : r
    );
    saveReports(updated);
    setBannerMessage('Une demande de révision a été adressée à l\'étudiant auteur.');
    setTimeout(() => setBannerMessage(''), 4000);
  };

  const filteredReports = useMemo(() => {
    if (statusFilter === 'ALL') return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const pendingCount = reports.filter((r) => r.status === 'EN_ATTENTE').length;

  return (
    <div className="space-y-6">
      {/* Header & Status Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50 mb-2">
              <Flag size={13} />
              <span>CampusHub · File d'Instruction Pédagogique</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              File d'Attente des Signalements & Modération de Contenu
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Traitez les signalements émis par les étudiants et enseignants de l'Université de Yaoundé I.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start lg:self-auto text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('EN_ATTENTE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'EN_ATTENTE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>En attente ({pendingCount})</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('TRAITE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'TRAITE'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Traité (Supprimé)
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('REJETE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'REJETE'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Rejeté (Conforme)
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Historique complet ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {bannerMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs transition-all space-y-4 ${
                report.severity === 'critical'
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      report.itemType === 'Document'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {report.itemType}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      report.severity === 'critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : report.severity === 'high'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Priorité {report.severity}
                  </span>

                  <span className="text-xs text-slate-400">· {report.date}</span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    report.status === 'EN_ATTENTE'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : report.status === 'TRAITE'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {report.status === 'EN_ATTENTE'
                    ? 'En attente d\'instruction'
                    : report.status === 'TRAITE'
                    ? 'Traité (Contenu supprimé)'
                    : 'Rejeté (Conforme)'}
                </span>
              </div>

              {/* Reported Content Details */}
              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">Contenu concerné :</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText size={16} className="text-rose-500 flex-shrink-0" />
                  <span>{report.itemTitle}</span>
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Auteur du contenu : <strong className="text-slate-700 dark:text-slate-300">{report.itemAuthor}</strong> · Signalé par : <strong>{report.reportedBy}</strong>
                </div>
              </div>

              {/* Justification Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  <span>Motif : {report.reason}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{report.description}"
                </p>
              </div>

              {report.resolution && (
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Résolution enregistrée : {report.resolution}</span>
                </div>
              )}

              {/* Action Buttons */}
              {report.status === 'EN_ATTENTE' && (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRequestCorrection(report.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Demander correction à l'auteur
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDismissReport(report.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Valider comme conforme (Rejeter)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveContent(report.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Supprimer le contenu</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Aucun signalement en attente
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Tous les contenus de l'Université de Yaoundé I sont actuellement conformes aux règles de la communauté.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
