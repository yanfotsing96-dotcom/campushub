import { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  UserCheck,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
} from 'lucide-react';

export default function ExamSecurityCheck({ exam, user, onVerified, onCancel }) {
  const [fullNameInput, setFullNameInput] = useState('');
  const [matriculeInput, setMatriculeInput] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const officialName = user?.nom || 'Étudiant UY1';
  const officialMatricule = user?.matricule || '23S40192';

  // Normalization helper
  const cleanStr = (s) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    if (!pledgeAccepted) {
      setError("Vous devez cocher l'engagement sur l'honneur pour poursuivre.");
      return;
    }

    const cleanInputName = cleanStr(fullNameInput);
    const cleanOfficialName = cleanStr(officialName);
    const cleanInputMatricule = String(matriculeInput || '').trim().toUpperCase();
    const cleanOfficialMatricule = String(officialMatricule || '').trim().toUpperCase();

    // Check Matricule
    const matriculeMatches = cleanInputMatricule === cleanOfficialMatricule;

    // Check Name: either exact match, or both first and last name tokens match
    const nameMatches =
      cleanInputName === cleanOfficialName ||
      (cleanOfficialName.split(' ').length > 1 &&
        cleanOfficialName.split(' ').every((part) => cleanInputName.includes(part)));

    if (!matriculeMatches || !nameMatches) {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);

      if (!matriculeMatches && !nameMatches) {
        setError(
          `Alerte de Sécurité (Tentative ${nextFailures}) : Le Nom complet ET le Matricule ne correspondent pas à la session connectée.`
        );
      } else if (!matriculeMatches) {
        setError(
          `Alerte de Sécurité (Tentative ${nextFailures}) : Le Matricule saisi ne concorde pas avec votre profil de session.`
        );
      } else {
        setError(
          `Alerte de Sécurité (Tentative ${nextFailures}) : Le Nom complet saisi ne correspond pas à l'identité officielle enregistrée (${officialName}).`
        );
      }
      return;
    }

    // Success: Identity certified!
    onVerified({
      verifiedAt: new Date().toISOString(),
      studentName: officialName,
      studentMatricule: officialMatricule,
    });
  };

  const handleQuickFill = () => {
    setFullNameInput(officialName);
    setMatriculeInput(officialMatricule);
    setPledgeAccepted(true);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Security Warning Banner if failed attempts */}
      {failedAttempts > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-1 animate-in shake">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle size={16} className="text-rose-600 flex-shrink-0" />
            <span>Contrôle d'Accès Strict : Échec d'Authentification ({failedAttempts})</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Pour des raisons de probité académique, toute composition en ligne nécessite la concordance exacte entre les informations saisies et le compte utilisateur authentifié.
          </p>
        </div>
      )}

      {/* Main Identity Check Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <Lock size={10} />
                  <span>Vérification d'Identité Pré-Examen</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  MINESUP Certifié
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                Contrôle d'Accès à l'Épreuve
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
          >
            Quitter
          </button>
        </div>

        {/* Exam Context Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
                {exam.codeUe}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {exam.titre}
              </span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <Clock size={13} />
              <span>{exam.durationMinutes} min</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
            <div>Filière : <strong className="text-slate-700 dark:text-slate-300">{exam.filiereId}</strong></div>
            <div>Niveau : <strong className="text-slate-700 dark:text-slate-300">{exam.niveau}</strong></div>
            <div>Barème : <strong className="text-slate-700 dark:text-slate-300">{exam.totalPoints} pts ({exam.passPercentage}% requis)</strong></div>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet officiel de l'étudiant * :
              </label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullNameInput}
                  onChange={(e) => {
                    setFullNameInput(e.target.value);
                    setError('');
                  }}
                  placeholder="Ex : Yan Fotsing"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro de Matricule unique * :
              </label>
              <div className="relative">
                <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={matriculeInput}
                  onChange={(e) => {
                    setMatriculeInput(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Ex : 23S40192"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Fill Button for smooth demo testing */}
          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>Profil actif : <strong>{officialName}</strong> ({officialMatricule})</span>
            </span>

            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wide"
            >
              Remplir mon identité
            </button>
          </div>

          {/* Honor Pledge Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={pledgeAccepted}
              onChange={(e) => setPledgeAccepted(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="leading-relaxed">
              J'atteste sur l'honneur être l'étudiant titulaire du matricule ci-dessus. Je m'engage à composer sans assistance non autorisée, sous surveillance de focus d'écran.
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Retour</span>
            </button>

            <button
              type="submit"
              disabled={!fullNameInput.trim() || !matriculeInput.trim() || !pledgeAccepted}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-40 transition-all"
            >
              <span>Certifier mon identité & Accéder à l'épreuve</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
