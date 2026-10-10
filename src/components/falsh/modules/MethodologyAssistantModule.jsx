import { useState } from 'react';
import {
  BookOpen,
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  PenTool,
  Download,
  ListOrdered,
  Layers,
  Award,
} from 'lucide-react';
import { METHODOLOGY_TEMPLATES } from '../data/falshData';

export default function MethodologyAssistantModule() {
  const [selectedExercise, setSelectedExercise] = useState('dissertation'); // 'dissertation' | 'commentaire'
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);

  // Données de travail interactives de l'étudiant
  const template = METHODOLOGY_TEMPLATES[selectedExercise];
  const [subjectText, setSubjectText] = useState(template.exempleSujet.sujet);
  const [problematique, setProblematique] = useState(template.exempleSujet.problematique);
  
  // Parties du plan
  const [part1Title, setPart1Title] = useState(template.exempleSujet.planPropose[0]?.partie || '');
  const [part1ArgA, setPart1ArgA] = useState(template.exempleSujet.planPropose[0]?.arguments[0] || '');
  const [part1ArgB, setPart1ArgB] = useState(template.exempleSujet.planPropose[0]?.arguments[1] || '');

  const [part2Title, setPart2Title] = useState(template.exempleSujet.planPropose[1]?.partie || '');
  const [part2ArgA, setPart2ArgA] = useState(template.exempleSujet.planPropose[1]?.arguments[0] || '');
  const [part2ArgB, setPart2ArgB] = useState(template.exempleSujet.planPropose[1]?.arguments[1] || '');

  const [part3Title, setPart3Title] = useState(template.exempleSujet.planPropose[2]?.partie || 'III. Dépassement / Synthèse globale');
  const [part3ArgA, setPart3ArgA] = useState(template.exempleSujet.planPropose[2]?.arguments[0] || 'A. L\'élargissement ontologique ou esthétique');
  const [part3ArgB, setPart3ArgB] = useState(template.exempleSujet.planPropose[2]?.arguments[1] || 'B. Portée universelle de l\'œuvre');

  // Introduction
  const [amorce, setAmorce] = useState('Dès l\'émergence des littératures africaines d\'expression française au tournant des années 1930...');
  const [ouverture, setOuverture] = useState('Cette dialectique invite à s\'interroger sur les nouvelles voix de la littérature contemporaine...');

  const handleExerciseSwitch = (type) => {
    setSelectedExercise(type);
    const tmpl = METHODOLOGY_TEMPLATES[type];
    setSubjectText(tmpl.exempleSujet.sujet);
    setProblematique(tmpl.exempleSujet.problematique);
    setPart1Title(tmpl.exempleSujet.planPropose[0]?.partie || '');
    setPart1ArgA(tmpl.exempleSujet.planPropose[0]?.arguments[0] || '');
    setPart1ArgB(tmpl.exempleSujet.planPropose[0]?.arguments[1] || '');
    setPart2Title(tmpl.exempleSujet.planPropose[1]?.partie || '');
    setPart2ArgA(tmpl.exempleSujet.planPropose[1]?.arguments[0] || '');
    setPart2ArgB(tmpl.exempleSujet.planPropose[1]?.arguments[1] || '');
    if (tmpl.exempleSujet.planPropose[2]) {
      setPart3Title(tmpl.exempleSujet.planPropose[2].partie);
      setPart3ArgA(tmpl.exempleSujet.planPropose[2].arguments[0] || '');
      setPart3ArgB(tmpl.exempleSujet.planPropose[2].arguments[1] || '');
    } else {
      setPart3Title('');
      setPart3ArgA('');
      setPart3ArgB('');
    }
    setActiveStep(1);
  };

  const generateFullDocument = () => {
    const lines = [
      `============================================================`,
      `CAMPUSHUB FALSH · DOSSIER DE MÉTHODOLOGIE UNIVERSITAIRE`,
      `Exercice : ${template.title.toUpperCase()}`,
      `============================================================`,
      ``,
      `[1. SUJET OFFICIEL ANALYSÉ]`,
      subjectText,
      ``,
      `[2. PROBLÉMATIQUE CENTRALE]`,
      problematique,
      ``,
      `[3. ARCHITECTURE DU PLAN EN TROIS AXES]`,
      `--- ${part1Title} ---`,
      `  • ${part1ArgA}`,
      `  • ${part1ArgB}`,
      ``,
      `--- ${part2Title} ---`,
      `  • ${part2ArgA}`,
      `  • ${part2ArgB}`,
    ];

    if (part3Title) {
      lines.push(
        ``,
        `--- ${part3Title} ---`,
        `  • ${part3ArgA}`,
        `  • ${part3ArgB}`
      );
    }

    lines.push(
      ``,
      `[4. RÉDACTION DE L'INTRODUCTION]`,
      `• Amorce : ${amorce}`,
      `• Rappel du sujet : ${subjectText}`,
      `• Problématique : ${problematique}`,
      `• Annonce du plan : Dans un premier temps, nous étudierons [Partie I]. Puis, nous examinerons [Partie II]. Enfin, nous verrons [Partie III].`,
      ``,
      `[5. CONCLUSION & OUVERTURE]`,
      `• Bilan : La confrontation de ces axes révèle que...`,
      `• Ouverture : ${ouverture}`,
      ``,
      `Document certifié conforme aux exigences académiques L1-Master FALSH.`
    );

    return lines.join('\n');
  };

  const handleCopyPlan = () => {
    const text = generateFullDocument();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateFullDocument();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche_methodologie_${selectedExercise}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sélecteur de type d'exercice littéraire */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <PenTool size={13} />
            <span>Module 1 · Ingénierie Textuelle & Rhétorique</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Assistant de Méthodologie Littéraire & Philosophique
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Construisez pas à pas une dissertation rigoureuse ou un commentaire composé aux standards des jurys de la FALSH.
          </p>
        </div>

        {/* Boutons bascule d'exercice */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleExerciseSwitch('dissertation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedExercise === 'dissertation'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Dissertation</span>
          </button>

          <button
            type="button"
            onClick={() => handleExerciseSwitch('commentaire')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedExercise === 'commentaire'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Commentaire Composé</span>
          </button>
        </div>
      </div>

      {/* Stepper des 4 Étapes Méthodologiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {template.etapes.map((step) => {
          const isActive = activeStep === step.num;
          const isDone = activeStep > step.num;
          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                  : isDone
                  ? 'bg-slate-900/90 border-slate-700/60 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check size={12} /> : step.num}
                </span>
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Étape {step.num}/4
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight line-clamp-1">
                {step.titre.split('&')[0]}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Zone Interactive : Formulaire Guidé de Travail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Principale de Saisie & Structuration (7 colonnes) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-amber-400" />
              <span>Étape {activeStep} : {template.etapes[activeStep - 1]?.titre}</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {template.dureeConseillee}
            </span>
          </div>

          {/* Contenu dynamique selon l'étape active */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sujet d'épreuve ou Citation littéraire :
                </label>
                <textarea
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
                  placeholder="Saisissez ou collez ici le libellé exact du sujet..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  <span>Règles d'or de l'analyse liminaire (FALSH) :</span>
                </h5>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {template.etapes[0].conseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Passer à la Problématique</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Formulation de la Problématique Centrale :
                </label>
                <textarea
                  value={problematique}
                  onChange={(e) => setProblematique(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
                  placeholder="Formulez la question essentielle qui sous-tend le sujet..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Conseils pour problématiser avec brio :</span>
                </h5>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {template.etapes[1].conseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Construire le Plan en 3 Parties</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              {/* Partie 1 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold text-amber-400">
                  Partie I (Thèse première / Première perspective) :
                </label>
                <input
                  type="text"
                  value={part1Title}
                  onChange={(e) => setPart1Title(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={part1ArgA}
                    onChange={(e) => setPart1ArgA(e.target.value)}
                    placeholder="Sous-partie A + Exemple d'œuvre..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={part1ArgB}
                    onChange={(e) => setPart1ArgB(e.target.value)}
                    placeholder="Sous-partie B + Exemple d'œuvre..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Partie 2 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold text-amber-400">
                  Partie II (Antithèse / Limites ou Deuxième perspective) :
                </label>
                <input
                  type="text"
                  value={part2Title}
                  onChange={(e) => setPart2Title(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={part2ArgA}
                    onChange={(e) => setPart2ArgA(e.target.value)}
                    placeholder="Sous-partie A + Exemple..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={part2ArgB}
                    onChange={(e) => setPart2ArgB(e.target.value)}
                    placeholder="Sous-partie B + Exemple..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Partie 3 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold text-amber-400">
                  Partie III (Dépassement synthétique / Troisième perspective) :
                </label>
                <input
                  type="text"
                  value={part3Title}
                  onChange={(e) => setPart3Title(e.target.value)}
                  placeholder="Titre de la Partie III..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={part3ArgA}
                    onChange={(e) => setPart3ArgA(e.target.value)}
                    placeholder="Sous-partie A + Exemple..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={part3ArgB}
                    onChange={(e) => setPart3ArgB(e.target.value)}
                    placeholder="Sous-partie B + Exemple..."
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Passer à l'Introduction & Conclusion</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amorce de l'introduction (Contexte historique ou citation) :
                </label>
                <textarea
                  value={amorce}
                  onChange={(e) => setAmorce(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ouverture de la conclusion (Élargissement vers un autre courant ou une œuvre moderne) :
                </label>
                <textarea
                  value={ouverture}
                  onChange={(e) => setOuverture(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Award size={13} />
                  <span>Validation du jury :</span>
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  L'introduction forme un bloc continu de 20 à 30 lignes. Ne jamais utiliser de puces lors de la rédaction finale, liez vos phrases avec des connecteurs logiques élégants (d'une part, or, toutefois, en définitive).
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Dossier copié !' : 'Copier l\'ensemble du travail'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Colonne Droite : Fiche de Synthèse Générée en Temps Réel (5 colonnes) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ListOrdered size={15} className="text-amber-400" />
                <span>Fiche Récapitulative d'Examen</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                  title="Copier le plan"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                  title="Télécharger en .txt"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            {/* Aperçu formaté style manuscrit académique */}
            <div className="space-y-3.5 text-xs font-sans leading-relaxed text-slate-300 max-h-[520px] overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/90 block">
                  Sujet à traiter :
                </span>
                <p className="font-medium text-slate-200 mt-0.5 italic">
                  « {subjectText} »
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/90 block">
                  Problématique retenue :
                </span>
                <p className="text-slate-300 mt-0.5 font-sans">
                  {problematique}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/90 block">
                  Progression du plan :
                </span>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-amber-300 text-[11px]">{part1Title || 'I. Partie 1'}</div>
                  <div className="text-[10px] text-slate-400 pl-2">• {part1ArgA || 'Sous-partie A'}</div>
                  <div className="text-[10px] text-slate-400 pl-2">• {part1ArgB || 'Sous-partie B'}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-amber-300 text-[11px]">{part2Title || 'II. Partie 2'}</div>
                  <div className="text-[10px] text-slate-400 pl-2">• {part2ArgA || 'Sous-partie A'}</div>
                  <div className="text-[10px] text-slate-400 pl-2">• {part2ArgB || 'Sous-partie B'}</div>
                </div>

                {part3Title && (
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <div className="font-bold text-amber-300 text-[11px]">{part3Title}</div>
                    <div className="text-[10px] text-slate-400 pl-2">• {part3ArgA || 'Sous-partie A'}</div>
                    <div className="text-[10px] text-slate-400 pl-2">• {part3ArgB || 'Sous-partie B'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Norme Département LMF / PHI / HIS</span>
            </span>
            <span>Prêt pour composition</span>
          </div>
        </div>
      </div>
    </div>
  );
}
