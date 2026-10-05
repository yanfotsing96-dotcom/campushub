import { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Shield,
  FileCode,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import {
  TECH_CHALLENGES,
  BIG_O_COMPLEXITIES,
  UNIX_POSIX_COMMANDS,
} from './data/techProblemsData';
import { useCampusHub } from '../../hooks/useCampusHub';

export default function TechExcellenceHub() {
  const { student, permissions, earnXp } = useCampusHub();
  const [activeTab, setActiveTab] = useState('playground'); // 'playground', 'algorithms', 'systems', 'bank'

  // Playground state
  const [selectedChallengeId, setSelectedChallengeId] = useState('c-trees');
  const activeChallenge = TECH_CHALLENGES.find((c) => c.id === selectedChallengeId) || TECH_CHALLENGES[0];
  const [currentCode, setCurrentCode] = useState(activeChallenge.starterCode);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [copied, setCopied] = useState(false);

  // Switch challenge
  const handleSelectChallenge = (challengeId) => {
    setSelectedChallengeId(challengeId);
    const chal = TECH_CHALLENGES.find((c) => c.id === challengeId);
    if (chal) {
      setCurrentCode(chal.starterCode);
      setConsoleOutput('');
      setExecutionStats(null);
    }
  };

  // Run code simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Compilation avec gcc -Wall -O2 / runtime...\n');

    setTimeout(() => {
      setConsoleOutput(activeChallenge.expectedOutput);
      setIsRunning(false);
      setExecutionStats({
        durationMs: (Math.random() * 12 + 4).toFixed(1),
        memoryMb: (Math.random() * 2 + 1.2).toFixed(2),
        status: 'SUCCÈS (Code de retour: 0)',
      });
      // Award student XP for running academic algorithms
      earnXp(25, `Exécution validée : ${activeChallenge.title}`);
    }, 750);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    setCurrentCode(activeChallenge.starterCode);
    setConsoleOutput('');
    setExecutionStats(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: National Tech Hub Badge & Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
              <Cpu size={14} className="text-indigo-600" />
              <span>Pôle d'Excellence Informatique & Génie Logiciel (Cœur Tech)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Laboratoire de Programmation & Algorithmique Nationale
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Compilateur C (GCC/POSIX), bac à sable Python 3, requêtes SQL et mémentos d'architecture pour les universités du Cameroun.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start lg:self-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('playground')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'playground'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal size={14} />
              <span>Playground C / Py / SQL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('algorithms')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'algorithms'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>Complexité Grand O</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('systems')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'systems'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield size={14} />
              <span>Systèmes UNIX & POSIX</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bank'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode size={14} />
              <span>Annales Nationales ({TECH_CHALLENGES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. TAB: Multi-Language Playground */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Challenge Selector & Code Editor (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Header: Challenge selector dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  {activeChallenge.codeUe} · {activeChallenge.university}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeChallenge.title}
                </h3>
              </div>

              {/* Challenge Selector */}
              <select
                value={selectedChallengeId}
                onChange={(e) => handleSelectChallenge(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 self-start sm:self-auto"
              >
                {TECH_CHALLENGES.map((chal) => (
                  <option key={chal.id} value={chal.id}>
                    [{chal.language.toUpperCase()}] {chal.codeUe} : {chal.title.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeChallenge.description}
            </p>

            {/* Code Editor Toolbar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider bg-slate-900 text-emerald-400 dark:bg-slate-800">
                  {activeChallenge.language}
                </span>
                <span className="text-xs text-slate-400">
                  {permissions.isPro ? 'Exécutions illimitées (Pro)' : 'Quota: 10 runs/jour'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  title="Copier le code"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>

                <button
                  type="button"
                  onClick={handleResetCode}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  title="Réinitialiser le code original"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Play size={13} fill="currentColor" />
                  <span>{isRunning ? 'Exécution...' : 'Compiler & Exécuter'}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea Editor */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
                <span>main.{activeChallenge.language === 'c' ? 'c' : activeChallenge.language === 'python' ? 'py' : activeChallenge.language === 'sql' ? 'sql' : 'js'}</span>
                <span>UTF-8 · GCC 13.2 / Python 3.12</span>
              </div>

              <textarea
                rows={16}
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                spellCheck="false"
                className="w-full p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600/40"
              />
            </div>
          </div>

          {/* Right Column: Live Terminal Output & Execution Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Terminal Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-400 ml-2">
                    Console stdout (Linux x86_64)
                  </span>
                </div>

                {isRunning && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>

              {/* Console stdout view */}
              <pre className="p-3 bg-slate-900/60 rounded-2xl text-xs text-slate-200 min-h-[220px] max-h-[340px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                {consoleOutput || '// Cliquez sur "Compiler & Exécuter" pour lancer le programme académique...'}
              </pre>

              {/* Execution Telemetry Stats */}
              {executionStats && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-slate-500 block">Temps d'exec.</span>
                    <strong className="text-emerald-400 font-bold">{executionStats.durationMs} ms</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mémoire RSS</span>
                    <strong className="text-indigo-400 font-bold">{executionStats.memoryMb} Mo</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Statut Exit</span>
                    <strong className="text-slate-300 font-bold">0 (OK)</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Tip Box */}
            <div className="p-4 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                <Zap size={14} className="text-amber-500" />
                <span>Rappel Méthodologique {student.universityShortName}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Aux examens de programmation en C de l'Université de Yaoundé I et de Polytechnique, n'oubliez jamais de libérer la mémoire allouée avec <code>free()</code> pour éviter les fuites mémoires (Memory Leaks).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Algorithmic Complexities (Big-O) */}
      {activeTab === 'algorithms' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              <span>Guide National de Complexité Algorithmique (Grand O / Big-O)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Barème d'efficacité temporelle et spatiale pour les contrôles continus d'Algorithmique (INF201 / Polytech).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIG_O_COMPLEXITIES.map((c) => (
              <div
                key={c.notation}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 rounded-xl text-xs font-mono font-black text-white shadow-xs"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.notation}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {c.evaluation}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {c.name}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                  Exemple : <code>{c.cExample}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: UNIX Systems & POSIX */}
      {activeTab === 'systems' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" />
              <span>Mémento des Appels Systèmes UNIX & Synchronisation POSIX</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tableau comparatif des fonctions systèmes indispensables pour les TP de Systèmes d'Exploitation (INF211 / Douala / Polytech).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">Appel Système (C / POSIX)</th>
                  <th className="py-3 px-3">Catégorie</th>
                  <th className="py-3 px-3">Description & Rôle Pédagogique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {UNIX_POSIX_COMMANDS.map((cmd) => (
                  <tr key={cmd.syscall} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {cmd.syscall}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cmd.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {cmd.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: National Exam Bank for Programming */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
            Annales et corrigés types de programmation des universités scientifiques du Cameroun
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECH_CHALLENGES.map((chal) => (
              <div
                key={chal.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {chal.language.toUpperCase()} · {chal.codeUe}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {chal.university}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {chal.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {chal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    Niveau : {chal.level}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectChallenge(chal.id);
                      setActiveTab('playground');
                    }}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <Terminal size={13} />
                    <span>Ouvrir dans le Playground</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
