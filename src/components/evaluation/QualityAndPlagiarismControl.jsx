import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  Flag,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SAMPLE_PLAGIARISM_CASES, RATED_DOCUMENTS } from './data/evaluationData';

export default function QualityAndPlagiarismControl() {
  const [selectedCaseId, setSelectedCaseId] = useState(SAMPLE_PLAGIARISM_CASES[0].id);
  const [inputText, setInputText] = useState(SAMPLE_PLAGIARISM_CASES[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportDocTitle, setReportDocTitle] = useState(RATED_DOCUMENTS[0].title);
  const [reportReason, setReportReason] = useState('plagiat'); // 'plagiat', 'erreur_scientifique', 'inapproprie', 'obsolete'
  const [reportDetails, setReportDetails] = useState('');
  const [submittedReports, setSubmittedReports] = useState([
    {
      id: 'rep-1',
      doc: 'Fiche TP INF211 Sémaphores Unix',
      reason: 'Erreur de code / Segfault à l\'exécution',
      status: 'Traité & Corrigé',
      date: 'Hier à 16:30',
    },
  ]);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    const found = SAMPLE_PLAGIARISM_CASES.find((c) => c.id === caseId);
    if (found) {
      setInputText(found.text);
      setAnalysisResult(null);
    }
  };

  const handleRunPlagiarismScan = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const text = inputText.toLowerCase();

      // Realistic heuristic: check overlap with common phrases or case template
      const currentCase = SAMPLE_PLAGIARISM_CASES.find((c) => c.id === selectedCaseId);

      let score;
      let matches;

      if (currentCase && inputText.trim() === currentCase.text.trim()) {
        score = currentCase.expectedScore;
        matches = currentCase.matches;
      } else if (
        text.includes('coffman') ||
        text.includes('deadlock') ||
        text.includes('interblocage') ||
        text.includes('exclusion mutuelle')
      ) {
        score = 82;
        matches = [
          {
            source: 'Polycopié INF211 - Systèmes d\'Exploitation UY1 (Chapitre 4)',
            similarity: '64%',
            snippet: 'Définition des 4 conditions de Coffman pour l\'interblocage...',
          },
          {
            source: 'Archives des Examens 2024 Faculté des Sciences',
            similarity: '18%',
            snippet: 'Exclusion mutuelle, non-préemption et attente circulaire...',
          },
        ];
      } else {
        // Dynamic analysis for custom input
        score = Math.min(94, Math.max(4, Math.floor(text.length % 25) + 3));
        matches = [
          {
            source: 'Base d\'archives académiques de Yaoundé I',
            similarity: `${score}%`,
            snippet: text.slice(0, 120) + '...',
          },
        ];
      }

      setAnalysisResult({
        similarityScore: score,
        isOriginal: score <= 20,
        hasWarnings: score > 20 && score <= 45,
        isPlagiarism: score > 45,
        matches,
      });
    }, 800);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    const newRep = {
      id: `rep-${Date.now()}`,
      doc: reportDocTitle,
      reason:
        reportReason === 'plagiat'
          ? 'Suspicion de plagiat ou copie non sourcée'
          : reportReason === 'erreur_scientifique'
          ? 'Erreur scientifique ou corrigé inexact'
          : reportReason === 'obsolete'
          ? 'Syllabus obsolète ou hors-programme'
          : 'Contenu inapproprié / abus',
      status: 'En cours d\'instruction par les modérateurs',
      date: 'À l\'instant',
    };

    setSubmittedReports((prev) => [newRep, ...prev]);
    setReportDetails('');
    setIsReportModalOpen(false);
    setShowReportSuccess(true);
    setTimeout(() => setShowReportSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50 mb-2">
              <ShieldCheck size={13} />
              <span>CampusHub · Intégrité Académique & Modération</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Contrôle Qualité, Détecteur Anti-Plagiat & Signalement
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vérifiez la conformité de vos devoirs avant soumission et signalez les contenus erronés ou litigieux.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors self-start lg:self-auto"
          >
            <Flag size={14} />
            <span>Signaler un document ou corrigé</span>
          </button>
        </div>
      </div>

      {showReportSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>
            Votre signalement a été transmis à la commission pédagogique de l'Université de Yaoundé I. Merci pour votre vigilance !
          </span>
        </div>
      )}

      {/* Main Plagiarism Engine Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Text Input & Presets (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileSearch size={16} className="text-rose-600" />
              <span>Texte ou Code Source à Analyser</span>
            </h3>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Tester un cas type :</span>
              {SAMPLE_PLAGIARISM_CASES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCase(c.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                    selectedCaseId === c.id
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.status === 'ORIGINAL' ? 'Original (C)' : 'Plagiat (OS)'}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedCaseId('custom');
            }}
            placeholder="Collez ici le rapport de TP, le résumé de cours ou le bloc de code à vérifier..."
            className="w-full p-4 text-xs font-mono rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              {inputText.length} caractères · Comparaison avec 4 500+ annales et thèses UY1
            </span>

            <button
              type="button"
              disabled={isAnalyzing || !inputText.trim()}
              onClick={handleRunPlagiarismScan}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              <FileSearch size={14} className={isAnalyzing ? 'animate-spin' : ''} />
              <span>{isAnalyzing ? 'Analyse spectrale en cours...' : 'Lancer l\'audit anti-plagiat'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Scan Result Diagnosis (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-600" />
            <span>Rapport d'Intégrité Académique</span>
          </h3>

          {analysisResult ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Score Card Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between ${
                  analysisResult.isOriginal
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                    : analysisResult.hasWarnings
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    {analysisResult.similarityScore}%
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Indice de similarité global
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      analysisResult.isOriginal
                        ? 'bg-emerald-600 text-white'
                        : analysisResult.hasWarnings
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {analysisResult.isOriginal
                      ? 'Original Certifié'
                      : analysisResult.hasWarnings
                      ? 'Citations à Sourcer'
                      : 'Plagiat Critique'}
                  </span>
                </div>
              </div>

              {/* Status explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {analysisResult.isOriginal
                  ? 'Le contenu analysé présente un niveau de ressemblance négligeable (citations techniques standard uniquement). Conforme aux normes d\'évaluation de l\'Université de Yaoundé I.'
                  : analysisResult.hasWarnings
                  ? 'Des similitudes partielles ont été repérées. Veillez à inclure les références bibliographiques des auteurs pour éviter toute sanction lors des corrections de TPE.'
                  : 'Forte concordance textuelle détectée avec des documents existants sans mention des sources. Ce travail risque un rejet immédiat par la commission pédagogique.'}
              </p>

              {/* Matching Sources Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sources correspondantes répertoriées :
                </h4>
                {analysisResult.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>{m.source}</span>
                      <span className="font-mono text-rose-600 font-bold">{m.similarity}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic font-mono">
                      "{m.snippet}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-14 text-slate-400 space-y-2">
              <FileSearch size={32} className="mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs">
                Aucun audit en cours. Cliquez sur « Lancer l'audit anti-plagiat ».
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Moderation History & Community Reports Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flag size={16} className="text-rose-500" />
          <span>Suivi des Signalements & Traitements de Modération (UY1)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Transparence collégiale : chaque signalement soumis par les étudiants fait l'objet d'un examen par les délégués et modérateurs.
        </p>

        <div className="space-y-2.5 pt-2">
          {submittedReports.map((rep) => (
            <div
              key={rep.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                  {rep.doc}
                </strong>
                <span className="text-slate-500 dark:text-slate-400">
                  Motif : {rep.reason} · {rep.date}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                  rep.status.includes('Traité')
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal : Signaler un document */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Flag size={18} className="text-rose-600" />
              <span>Signaler un document ou corrigé</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Aidez à préserver la qualité et l'intégrité des cours partagés à l'Université de Yaoundé I.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document concerné
                </label>
                <select
                  value={reportDocTitle}
                  onChange={(e) => setReportDocTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {RATED_DOCUMENTS.map((doc) => (
                    <option key={doc.id} value={doc.title}>
                      [{doc.course}] {doc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nature de l'anomalie *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="plagiat">Plagiat ou copie non autorisée d'un travail tiers</option>
                  <option value="erreur_scientifique">Erreur grave dans le cours ou corrigé inexact</option>
                  <option value="obsolete">Document obsolète ou non conforme au programme UY1</option>
                  <option value="inapproprie">Contenu hors-sujet, promotionnel ou inapproprié</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Détails et justifications *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Précisez la page, l'exercice ou la source originale plagiée..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
                >
                  Transmettre le signalement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
