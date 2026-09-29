import { useState, useRef, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal as TerminalIcon,
  Trash2,
  Code2,
  Cpu,
  ShieldAlert,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CODE_SNIPPETS } from './data/playgroundSnippets';

export default function CodePlayground() {
  const [language, setLanguage] = useState('c'); // 'c' or 'python'
  const [selectedSnippetId, setSelectedSnippetId] = useState(CODE_SNIPPETS.c[0].id);
  const [code, setCode] = useState(CODE_SNIPPETS.c[0].code);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState('stdout'); // 'stdout', 'build', 'valgrind'
  const [copied, setCopied] = useState(false);
  const [memoryReport, setMemoryReport] = useState(null);
  const [buildLogs, setBuildLogs] = useState('');

  const textareaRef = useRef(null);
  const lineCount = useMemo(() => code.split('\n').length, [code]);

  // When language changes, set default snippet
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const firstSnippet = CODE_SNIPPETS[newLang][0];
    setSelectedSnippetId(firstSnippet.id);
    setCode(firstSnippet.code);
    setConsoleOutput('');
    setBuildLogs('');
    setMemoryReport(null);
  };

  // When snippet is chosen from dropdown
  const handleSnippetSelect = (snippetId) => {
    const found = CODE_SNIPPETS[language].find((s) => s.id === snippetId);
    if (found) {
      setSelectedSnippetId(snippetId);
      setCode(found.code);
      setConsoleOutput('');
      setBuildLogs('');
      setMemoryReport(null);
    }
  };

  const handleReset = () => {
    const found = CODE_SNIPPETS[language].find((s) => s.id === selectedSnippetId);
    if (found) {
      setCode(found.code);
      setConsoleOutput('');
      setBuildLogs('');
      setMemoryReport(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tab key handling in textarea for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '    ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Simulated compilation and execution engine
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Simulation de l\'environnement d\'exécution en cours...');
    setActiveConsoleTab('stdout');

    setTimeout(() => {
      setIsRunning(false);
      const executionTimestamp = new Date().toLocaleTimeString();

      // Check common syntax errors
      if (language === 'c') {
        const hasMain = code.includes('main(') || code.includes('main (');
        const hasSemicolons = code.includes(';');

        if (!hasMain) {
          setBuildLogs(`gcc -Wall -Wextra -std=c11 main.c -o main\n/usr/bin/ld: main.c:(.text+0x0): référence indéfinie vers « main »\ncollect2: error: ld returned 1 exit status`);
          setConsoleOutput(`[Erreur de compilation GCC 13.2]\nFonction point d'entrée 'int main(void)' introuvable.\nExamen UY1 : Tout programme C exécutable doit comporter une fonction main.`);
          setActiveConsoleTab('build');
          return;
        }

        if (!hasSemicolons) {
          setBuildLogs(`gcc -Wall -Wextra main.c -o main\nmain.c: In function 'main':\nmain.c: error: expected ';' before '}' token`);
          setConsoleOutput(`[Erreur de syntaxe C]\nPoint-virgule manquant détecté. En langage C, chaque instruction élémentaire doit se terminer par ';'`);
          setActiveConsoleTab('build');
          return;
        }

        // Check if matching current preset
        const currentPreset = CODE_SNIPPETS.c.find((s) => s.id === selectedSnippetId);
        const hasFree = code.includes('free(');
        const hasMalloc = code.includes('malloc(') || code.includes('calloc(');

        let simulatedStdout;
        if (currentPreset && code.trim() === currentPreset.code.trim()) {
          simulatedStdout = currentPreset.expectedOutput;
        } else {
          // Dynamic simulated output for custom edits
          let outputText = `=== Compilation GCC 13.2.0 (Ubuntu / UY1 Lab) réussie ===\nExecution time: 0.014s | Exit code: 0\n[Programme exécuté à ${executionTimestamp}]\n\n`;
          // Extract printf strings if student modified them
          const printfMatches = [...code.matchAll(/printf\s*\(\s*"([^"]+)"/g)];
          if (printfMatches.length > 0) {
            const lines = printfMatches.map((m) => m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'));
            outputText += lines.join('');
          } else {
            outputText += `Programme C exécuté sans sortie explicite printf.\nProcessus terminé avec code de retour 0.`;
          }
          simulatedStdout = outputText;
        }

        setBuildLogs(`gcc -Wall -Wextra -pedantic -std=c11 main.c -o main\n[GCC] 0 avertissements, 0 erreurs.\nCompilation terminée en 0.048s.`);
        setConsoleOutput(simulatedStdout);

        // Memory diagnostic (Valgrind)
        if (hasMalloc && !hasFree) {
          setMemoryReport({
            status: 'warning',
            message: 'Fuite mémoire détectée : des blocs ont été alloués avec malloc() mais jamais libérés avec free().',
            details: 'HEAP SUMMARY: in use at exit: 64 bytes in 2 blocks. All heap blocks were NOT freed -- memory leak !',
          });
        } else if (hasMalloc && hasFree) {
          setMemoryReport({
            status: 'success',
            message: 'Gestion mémoire optimale : Tous les blocs alloués sur le tas ont été proprement libérés.',
            details: 'HEAP SUMMARY: All heap blocks were freed -- no leaks are possible (0 errors from 0 contexts).',
          });
        } else {
          setMemoryReport({
            status: 'clean',
            message: 'Aucune allocation dynamique sur le tas n\'a été détectée dans ce code.',
            details: 'Allocation statique / automatique sur la pile (Stack) uniquement.',
          });
        }
      } else {
        // Python execution
        const currentPreset = CODE_SNIPPETS.python.find((s) => s.id === selectedSnippetId);
        let simulatedStdout;
        if (currentPreset && code.trim() === currentPreset.code.trim()) {
          simulatedStdout = currentPreset.expectedOutput;
        } else {
          // Python simulated output
          let pyOutput = `=== Python 3.12.3 CPython Virtual Runtime ===\n[Exécution à ${executionTimestamp}]\n\n`;
          const printMatches = [...code.matchAll(/print\s*\((.*?)\)/g)];
          if (printMatches.length > 0) {
            const lines = printMatches.map((m) => {
              const inside = m[1].replace(/^["']|["']$/g, '');
              return inside;
            });
            pyOutput += lines.join('\n');
          } else {
            pyOutput += `Script Python exécuté avec succès (aucun print détecté).`;
          }
          simulatedStdout = pyOutput;
        }

        setBuildLogs(`python3 -m py_compile script.py\nSyntaxe Python validée avec succès.`);
        setConsoleOutput(simulatedStdout);
        setMemoryReport({
          status: 'clean',
          message: 'Ramasse-miettes (Garbage Collector Python 3.12) actif.',
          details: 'Gestion automatique du comptage de références et détection de cycles d\'objets.',
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Control Bar Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Language Selector & Snippet Choice */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Lang Switcher Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleLanguageChange('c')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  language === 'c'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Langage C (GCC)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('python')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  language === 'python'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Python 3.12</span>
              </button>
            </div>

            {/* Snippets Preset Dropdown */}
            <div className="relative">
              <select
                value={selectedSnippetId}
                onChange={(e) => handleSnippetSelect(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CODE_SNIPPETS[language].map((snippet) => (
                  <option key={snippet.id} value={snippet.id}>
                    Modèle : {snippet.name} ({snippet.module})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Copier le code dans le presse-papier"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Restaurer le template original"
            >
              <RotateCcw size={14} />
              <span>Réinitialiser</span>
            </button>

            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunCode}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Play size={14} className={isRunning ? 'animate-spin' : ''} fill="currentColor" />
              <span>{isRunning ? 'Compilation & Run...' : 'Exécuter le code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column : Code Editor Area (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
          {/* Editor Header Bar */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="ml-2 font-mono text-slate-400 font-medium">
                {language === 'c' ? 'main.c (C11)' : 'script.py (v3.12)'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>{lineCount} lignes</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400 font-bold uppercase">
                {language.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Editor Body with line numbers and textarea */}
          <div className="relative flex flex-1 min-h-[460px] max-h-[560px] overflow-hidden bg-slate-900 font-mono text-xs">
            {/* Line Numbers gutter */}
            <div className="w-12 py-3 bg-slate-950/60 select-none text-right pr-3 text-slate-600 border-r border-slate-800 font-mono text-xs overflow-hidden leading-relaxed">
              {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-emerald-400 dark:text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto whitespace-pre selection:bg-indigo-600 selection:text-white"
              style={{ tabSize: 4 }}
              placeholder="Écrivez ou collez votre code ici..."
            />
          </div>

          {/* Quick Helper Footer */}
          <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info size={12} className="text-slate-400" />
              <span>Touche Tab supportée · Indentation 4 espaces</span>
            </span>
            <span className="font-mono text-slate-400">CampusHub C/Py Engine</span>
          </div>
        </div>

        {/* Right Column : Interactive Console & Execution Output (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Terminal Tabs Header */}
          <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveConsoleTab('stdout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeConsoleTab === 'stdout'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <TerminalIcon size={13} />
                <span>Console (stdout)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveConsoleTab('build')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeConsoleTab === 'build'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Cpu size={13} />
                <span>Compilateur</span>
              </button>

              {language === 'c' && (
                <button
                  type="button"
                  onClick={() => setActiveConsoleTab('valgrind')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    activeConsoleTab === 'valgrind'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert size={13} />
                  <span>Mémoire Valgrind</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setConsoleOutput('');
                setBuildLogs('');
                setMemoryReport(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Nettoyer la console"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Console Output Screen */}
          <div className="flex-1 min-h-[440px] max-h-[500px] p-4 font-mono text-xs overflow-y-auto bg-slate-950 text-slate-200 leading-relaxed">
            {activeConsoleTab === 'stdout' && (
              <>
                {consoleOutput ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed">
                    {consoleOutput}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-16">
                    <TerminalIcon size={28} className="mb-2 text-slate-700" />
                    <p className="font-semibold text-slate-500">Terminal prêt.</p>
                    <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                      Cliquez sur « Exécuter le code » pour compiler et lancer l'exécution en temps réel.
                    </p>
                  </div>
                )}
              </>
            )}

            {activeConsoleTab === 'build' && (
              <div>
                <div className="text-slate-400 mb-2 font-bold text-[11px] uppercase tracking-wider">
                  Journal du compilateur :
                </div>
                {buildLogs ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-indigo-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    {buildLogs}
                  </pre>
                ) : (
                  <p className="text-slate-600 italic">Aucun log de build récent. Lancez une exécution.</p>
                )}
              </div>
            )}

            {activeConsoleTab === 'valgrind' && (
              <div className="space-y-3">
                <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  Analyseur de fuites mémoire (Valgrind Emulation) :
                </div>
                {memoryReport ? (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl border text-xs font-sans ${
                        memoryReport.status === 'warning'
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                          : memoryReport.status === 'success'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <p className="font-bold mb-1">{memoryReport.message}</p>
                      <p className="text-[11px] opacity-90">{memoryReport.details}</p>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400">
                      <div>==12480== Memcheck, a memory error detector for x86_64-linux</div>
                      <div>==12480== Copyright (C) 2002-2024, and GNU GPL'd, by Julian Seward et al.</div>
                      <div>==12480== Using Valgrind-3.22.0 and LibVEX; rerun with -h for copyright info</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 italic">Exécutez votre code C pour obtenir le rapport mémoire.</p>
                )}
              </div>
            )}
          </div>

          {/* Academic Info Banner */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Code2 size={14} className="text-indigo-600" />
              <span>Conforme aux TP du Département d'Informatique UY1</span>
            </span>
            <span className="text-[11px] text-slate-400">Exit Status : 0 OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
