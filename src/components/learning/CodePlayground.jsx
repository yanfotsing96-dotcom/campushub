import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
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
  Database,
  Layout,
  Eye,
  Download,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Table as TableIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  PROGRAMMING_LANGUAGES,
  CODE_SNIPPETS,
  MOCK_SQL_DATABASE,
} from './data/playgroundSnippets';

/**
 * CodePlayground Hub - Environnement Interactif Multi-Langages
 * Filière Informatique (L1 à Master) · Département d'Informatique
 */
export default function CodePlayground() {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [selectedSnippetId, setSelectedSnippetId] = useState(CODE_SNIPPETS.python[0].id);
  const [code, setCode] = useState(CODE_SNIPPETS.python[0].code);

  // Panneau droit : sorties et exécution
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('stdout'); // 'stdout' | 'preview' | 'build' | 'valgrind' | 'sql_table'
  const [copied, setCopied] = useState(false);
  const [memoryReport, setMemoryReport] = useState(null);
  const [buildLogs, setBuildLogs] = useState('');
  const [sqlTableResult, setSqlTableResult] = useState(null);
  const [executionStats, setExecutionStats] = useState(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all'); // 'all', 'L1', 'L2', 'L3', 'Master'

  const textareaRef = useRef(null);
  const iframeRef = useRef(null);

  // Métriques du code en direct
  const lineCount = useMemo(() => code.split('\n').length, [code]);
  const charCount = useMemo(() => code.length, [code]);
  const currentLangConfig = useMemo(
    () => PROGRAMMING_LANGUAGES.find((l) => l.id === selectedLanguage) || PROGRAMMING_LANGUAGES[0],
    [selectedLanguage]
  );

  // Changement de langage
  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    const availableSnippets = CODE_SNIPPETS[langId] || [];
    const firstSnippet = availableSnippets[0];
    if (firstSnippet) {
      setSelectedSnippetId(firstSnippet.id);
      setCode(firstSnippet.code);
    } else {
      setSelectedSnippetId('');
      setCode('// Nouveau fichier\n');
    }

    setConsoleOutput('');
    setBuildLogs('');
    setMemoryReport(null);
    setSqlTableResult(null);
    setExecutionStats(null);

    // Ajuste l'onglet par défaut selon le langage
    if (langId === 'html') {
      setActiveTab('preview');
    } else if (langId === 'sql') {
      setActiveTab('sql_table');
    } else {
      setActiveTab('stdout');
    }
  };

  // Chargement d'un snippet précis
  const handleLoadSnippet = useCallback((snippet) => {
    setSelectedSnippetId(snippet.id);
    setCode(snippet.code);
    setConsoleOutput('');
    setBuildLogs('');
    setMemoryReport(null);
    setSqlTableResult(null);
    setExecutionStats(null);

    if (selectedLanguage === 'html') {
      setActiveTab('preview');
    } else if (selectedLanguage === 'sql') {
      setActiveTab('sql_table');
    } else {
      setActiveTab('stdout');
    }
  }, [selectedLanguage]);

  // Réinitialiser le code
  const handleReset = () => {
    const list = CODE_SNIPPETS[selectedLanguage] || [];
    const currentSnippet = list.find((s) => s.id === selectedSnippetId) || list[0];
    if (currentSnippet) {
      setCode(currentSnippet.code);
    } else {
      setCode('');
    }
    setConsoleOutput('');
    setBuildLogs('');
    setMemoryReport(null);
    setSqlTableResult(null);
    setExecutionStats(null);
  };

  // Effacer l'éditeur
  const handleClear = () => {
    setCode('');
    setConsoleOutput('');
    setBuildLogs('');
    setMemoryReport(null);
    setSqlTableResult(null);
    setExecutionStats(null);
  };

  // Copier le code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Télécharger le code source
  const handleDownloadSource = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campushub_${selectedLanguage}_${Date.now()}${currentLangConfig.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Gestion de la touche Tabulation dans la zone de texte
  const handleKeyDown = (e) => {
    // Raccourci Ctrl+Enter ou Cmd+Enter pour exécuter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }

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

  // Moteur d'exécution simulé multi-langages
  const handleRunCode = () => {
    setIsRunning(true);
    const startTime = performance.now();
    const timestamp = new Date().toLocaleTimeString('fr-FR');

    setTimeout(() => {
      setIsRunning(false);
      const elapsedMs = (performance.now() - startTime).toFixed(2);
      setExecutionStats({
        timeMs: elapsedMs,
        timestamp,
        status: 'OK',
        exitCode: 0,
      });

      // 1. MOTEUR LANGAGE C
      if (selectedLanguage === 'c') {
        const hasMain = code.includes('main(') || code.includes('main (');
        const hasSemicolons = code.includes(';');

        if (!hasMain) {
          setBuildLogs(
            `gcc -Wall -Wextra -std=c11 main.c -o main\n/usr/bin/ld: main.c:(.text+0x0): référence indéfinie vers « main »\ncollect2: error: ld returned 1 exit status`
          );
          setConsoleOutput(
            `[Erreur GCC 13.2]\nPoint d'entrée 'int main(void)' introuvable.\nExamen UY1 : Tout exécutable C doit impérativement définir une fonction main.`
          );
          setActiveTab('build');
          return;
        }

        if (!hasSemicolons && code.trim().length > 30) {
          setBuildLogs(
            `gcc -Wall -Wextra main.c -o main\nmain.c: In function 'main':\nmain.c: error: expected ';' before '}' token`
          );
          setConsoleOutput(
            `[Erreur de Syntaxe C]\nPoint-virgule manquant détecté. En langage C impératif, chaque instruction doit être close par ';' afin de permettre la génération d'arbre syntaxique.`
          );
          setActiveTab('build');
          return;
        }

        const preset = (CODE_SNIPPETS.c || []).find((s) => s.id === selectedSnippetId);
        const hasMalloc = code.includes('malloc(') || code.includes('calloc(');
        const hasFree = code.includes('free(');

        let outText;
        if (preset && code.trim() === preset.code.trim()) {
          outText = preset.expectedOutput;
        } else {
          outText = `=== Exécution binaire GCC C11 (x86_64 Linux) ===\nHorodatage : ${timestamp} | PID virtuel : 14209\n\n`;
          const printfMatches = [...code.matchAll(/printf\s*\(\s*"([^"]+)"/g)];
          if (printfMatches.length > 0) {
            outText += printfMatches
              .map((m) => m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'))
              .join('');
          } else {
            outText += `Processus C exécuté avec succès (aucun printf n'a été appelé).\nCode de retour standard 0 (EXIT_SUCCESS).`;
          }
        }

        setBuildLogs(
          `gcc -Wall -Wextra -pedantic -std=c11 main.c -o main\nCompilation réussie sans warnings (0 erreurs, 0 alertes).\nÉdition de liens terminée en ${elapsedMs}ms.`
        );
        setConsoleOutput(outText);
        setActiveTab('stdout');

        // Rapport Mémoire Valgrind
        if (hasMalloc && !hasFree) {
          setMemoryReport({
            status: 'warning',
            message: 'Fuite mémoire critique détectée (Memory Leak).',
            details:
              'HEAP SUMMARY: in use at exit: 64 bytes in 2 blocks. Des allocations malloc() n\'ont jamais été libérées par free(). En examen, cela pénalise la note de TP.',
          });
        } else if (hasMalloc && hasFree) {
          setMemoryReport({
            status: 'success',
            message: 'Gestion mémoire optimale : 0 fuite détectée.',
            details:
              'HEAP SUMMARY: All heap blocks were freed -- no leaks are possible. 0 errors from 0 contexts.',
          });
        } else {
          setMemoryReport({
            status: 'clean',
            message: 'Mémoire automatique (Pile / Stack) uniquement.',
            details:
              'Aucune allocation dynamique sur le tas (Heap) requise. Nettoyage automatique au retour de fonction.',
          });
        }
      }

      // 2. MOTEUR PYTHON
      else if (selectedLanguage === 'python') {
        const preset = (CODE_SNIPPETS.python || []).find((s) => s.id === selectedSnippetId);
        let pyOut;

        if (preset && code.trim() === preset.code.trim()) {
          pyOut = preset.expectedOutput;
        } else {
          pyOut = `=== Environnement CPython 3.12.3 ===\n[Session interactive lancée à ${timestamp}]\n\n`;
          const printMatches = [...code.matchAll(/print\s*\((.*?)\)/g)];
          if (printMatches.length > 0) {
            const lines = printMatches.map((m) => {
              const raw = m[1].trim();
              if (raw.startsWith('f"') || raw.startsWith("f'")) {
                return raw.replace(/^f["']|["']$/g, '');
              }
              return raw.replace(/^["']|["']$/g, '');
            });
            pyOut += lines.join('\n');
          } else {
            pyOut += `Script Python exécuté sans exception levée.\n(Utilisez print(...) pour inspecter vos variables).`;
          }
        }

        setBuildLogs(`python3 -m py_compile script.py\nSyntaxe de l'AST validée avec succès en ${elapsedMs}ms.`);
        setConsoleOutput(pyOut);
        setActiveTab('stdout');
      }

      // 3. MOTEUR SQL RELATIONNEL
      else if (selectedLanguage === 'sql') {
        const upperCode = code.toUpperCase();
        let columns;
        let rows;
        let queryType;

        if (upperCode.includes('JOIN')) {
          // Jointure étudiants + inscriptions + UE
          queryType = 'INNER JOIN TRIPARTITE';
          columns = ['matricule', 'nom', 'matiere', 'note_cc', 'note_sn', 'moyenne_ponderee'];
          rows = [
            { matricule: '21U5540', nom: 'Mballa Jean-Paul', matiere: 'INF305 Systèmes POSIX', note_cc: 18.0, note_sn: 17.5, moyenne_ponderee: 17.65 },
            { matricule: '22U1045', nom: 'Ngo Bisseck Marie', matiere: 'INF231 Structures C', note_cc: 17.0, note_sn: 16.0, moyenne_ponderee: 16.30 },
            { matricule: '21U2014', nom: 'Kamga Fotso Alain', matiere: 'INF301 Bases de Données', note_cc: 16.0, note_sn: 15.5, moyenne_ponderee: 15.65 },
            { matricule: '21U2014', nom: 'Kamga Fotso Alain', matiere: 'INF305 Systèmes POSIX', note_cc: 14.5, note_sn: 16.0, moyenne_ponderee: 15.55 },
            { matricule: '20U3391', nom: 'Tchinda Boris', matiere: 'INF411 Graphes & Optim', note_cc: 15.0, note_sn: 13.5, moyenne_ponderee: 13.95 },
            { matricule: '23U0128', nom: 'Abena Sandrine', matiere: 'INF111 Programmation Imp', note_cc: 14.0, note_sn: 13.0, moyenne_ponderee: 13.30 },
          ];
        } else if (upperCode.includes('GROUP BY')) {
          // Agrégats par filière
          queryType = 'AGGREGATION GROUP BY';
          columns = ['filiere', 'effectif_total', 'moyenne_filiere', 'meilleure_note', 'note_plancher'];
          rows = [
            { filiere: 'Systèmes & Réseaux', effectif_total: 1, moyenne_filiere: 17.10, meilleure_note: 17.1, note_plancher: 17.1 },
            { filiere: 'Informatique', effectif_total: 4, moyenne_filiere: 15.22, meilleure_note: 16.4, note_plancher: 13.7 },
            { filiere: 'Génie Logiciel', effectif_total: 1, moyenne_filiere: 14.20, meilleure_note: 14.2, note_plancher: 14.2 },
          ];
        } else if (upperCode.includes('RANK()')) {
          // Fonctions fenêtrées
          queryType = 'WINDOW FUNCTION RANK()';
          columns = ['matricule', 'nom', 'niveau', 'moyenne', 'rang_promo'];
          rows = [
            { matricule: '23U0128', nom: 'Abena Sandrine', niveau: 'L1', moyenne: 13.7, rang_promo: 1 },
            { matricule: '22U1045', nom: 'Ngo Bisseck Marie', niveau: 'L2', moyenne: 16.4, rang_promo: 1 },
            { matricule: '22U4421', nom: 'Fouda Christelle', niveau: 'L2', moyenne: 15.0, rang_promo: 2 },
            { matricule: '21U5540', nom: 'Mballa Jean-Paul', niveau: 'L3', moyenne: 17.1, rang_promo: 1 },
            { matricule: '21U2014', nom: 'Kamga Fotso Alain', niveau: 'L3', moyenne: 15.8, rang_promo: 2 },
            { matricule: '20U3391', nom: 'Tchinda Boris', niveau: 'M1', moyenne: 14.2, rang_promo: 1 },
          ];
        } else {
          // Sélection standard dans etudiants
          queryType = 'PROJECTION & FILTRAGE';
          columns = ['id', 'matricule', 'nom', 'filiere', 'niveau', 'moyenne', 'ville'];
          rows = MOCK_SQL_DATABASE.etudiants.filter((et) => {
            if (upperCode.includes(">= 14")) return et.moyenne >= 14.0;
            if (upperCode.includes(">= 15")) return et.moyenne >= 15.0;
            return true;
          });
        }

        setSqlTableResult({
          queryType,
          columns,
          rows,
          rowCount: rows.length,
          executionTime: `${elapsedMs} ms`,
        });

        setConsoleOutput(
          `-- PostgreSQL 16.2 / ANSI SQL Query Engine\n` +
          `Statut : Requête exécutée avec succès.\n` +
          `Lignes affectées/reçues : ${rows.length} tuples.\n` +
          `Temps d'exécution de l'optimiseur de requêtes : ${elapsedMs} ms.\n\n` +
          `Plan d'exécution (EXPLAIN ANALYZE) :\n` +
          `-> Seq Scan on relations (${queryType}) (cost=0.00..1.06 rows=${rows.length} width=64)\n` +
          `   Filter execution time: ${elapsedMs} ms`
        );
        setBuildLogs(`SQL Parser: Syntaxe vérifiée. Pas d'ambiguïté de schéma relationnel.`);
        setActiveTab('sql_table');
      }

      // 4. MOTEUR HTML/CSS
      else if (selectedLanguage === 'html') {
        setActiveTab('preview');
        setConsoleOutput(
          `[Moteur de Rendu Web]\nDocument HTML5 et feuilles de style CSS3 compilés dans l'iframe sécurisée sandboxée.\nRésolution virtuelle de prévisualisation : Pleine largeur dynamique.`
        );
      }

      // 5. MOTEUR JAVASCRIPT
      else if (selectedLanguage === 'javascript') {
        const capturedLogs = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalTime = console.time;
        const originalTimeEnd = console.timeEnd;
        const timerCache = {};

        try {
          // Capture des logs
          console.log = (...args) => {
            capturedLogs.push(
              args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
            );
          };
          console.error = (...args) => {
            capturedLogs.push(
              `[ERROR] ` +
                args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
            );
          };
          console.time = (label) => {
            timerCache[label] = performance.now();
          };
          console.timeEnd = (label) => {
            if (timerCache[label]) {
              const diff = (performance.now() - timerCache[label]).toFixed(3);
              capturedLogs.push(`${label}: ${diff}ms`);
            }
          };

          // Évaluation isolée
          const runner = new Function(code);
          runner();
        } catch (err) {
          capturedLogs.push(`❌ Erreur d'exécution JavaScript : ${err.message}`);
        } finally {
          console.log = originalLog;
          console.error = originalError;
          console.time = originalTime;
          console.timeEnd = originalTimeEnd;
        }

        const preset = (CODE_SNIPPETS.javascript || []).find((s) => s.id === selectedSnippetId);
        const finalLogs =
          capturedLogs.length > 0
            ? capturedLogs.join('\n')
            : preset
            ? preset.expectedOutput
            : `Script exécuté sans sortie console.log.\nUtilisez console.log(...) pour afficher des résultats.`;

        setConsoleOutput(`=== Moteur V8 / SpiderMonkey Virtuel ===\n[Horodatage : ${timestamp}]\n\n${finalLogs}`);
        setActiveTab('stdout');
      }
    }, 450);
  };

  // Synchronisation du rendu de l'iframe HTML
  useEffect(() => {
    if (selectedLanguage === 'html' && iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, [code, selectedLanguage]);

  // Liste filtrée des snippets du langage courant
  const availableSnippets = useMemo(() => {
    const list = CODE_SNIPPETS[selectedLanguage] || [];
    if (filterLevel === 'all') return list;
    return list.filter((s) => s.level.toLowerCase().includes(filterLevel.toLowerCase()));
  }, [selectedLanguage, filterLevel]);

  return (
    <div className="space-y-6 text-slate-100">
      {/* 1. En-tête Supérieur : Sélecteur de Langage & Barres d'Outils */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Onglets de Langages (Python, C, SQL, HTML/CSS, JS) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
              <Code2 size={14} className="text-indigo-400" />
              <span>Langage :</span>
            </span>

            <div className="inline-flex flex-wrap p-1 rounded-xl bg-slate-950 border border-slate-800 gap-1">
              {PROGRAMMING_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: lang.accentColor }}
                    />
                    <span>{lang.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-normal hidden sm:inline ${
                        isSelected
                          ? 'bg-slate-900 text-slate-300'
                          : 'bg-slate-900/40 text-slate-500'
                      }`}
                    >
                      {lang.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boutons d'Action Principaux */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors shadow-xs"
              title="Copier le code source"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSource}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors shadow-xs"
              title="Télécharger le fichier"
            >
              <Download size={14} className="text-indigo-400" />
              <span>Exporter {currentLangConfig.extension}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 transition-colors shadow-xs"
              title="Effacer le contenu de l'éditeur"
            >
              <Trash2 size={14} />
              <span>Effacer</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors shadow-xs"
              title="Restaurer l'exemple type initial"
            >
              <RotateCcw size={14} />
              <span>Exemple type</span>
            </button>

            {/* Bouton Exécuter Majeur */}
            <button
              type="button"
              disabled={isRunning || !code.trim()}
              onClick={handleRunCode}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play size={14} className={isRunning ? 'animate-spin' : ''} fill="currentColor" />
              <span>{isRunning ? 'Exécution en cours...' : 'Exécuter le code'}</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-mono">
                Ctrl+↵
              </kbd>
            </button>
          </div>
        </div>

        {/* Sous-Barre d'Information Contextuelle */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-indigo-400 font-bold">{currentLangConfig.version}</span>
            <span className="text-slate-600">•</span>
            <span>{currentLangConfig.description}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>{lineCount} lignes</span>
            <span>•</span>
            <span>{charCount} caractères</span>
          </div>
        </div>
      </div>

      {/* 2. Interface Principale Divisée : Éditeur de Code (Gauche) & Panneau de Résultats (Droite) */}
      <div
        className={`grid grid-cols-1 ${
          isEditorExpanded ? 'lg:grid-cols-1' : 'lg:grid-cols-12'
        } gap-5`}
      >
        {/* Colonne Gauche : Espace de Saisie de Code (7 colonnes) */}
        <div
          className={`${
            isEditorExpanded ? 'lg:col-span-12' : 'lg:col-span-7'
          } bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
        >
          {/* Header de l'Éditeur */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="ml-2 font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <FileCode size={13} className="text-indigo-400" />
                <span>
                  main{currentLangConfig.extension} ({currentLangConfig.name})
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title={isEditorExpanded ? 'Réduire' : 'Plein écran'}
              >
                {isEditorExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            </div>
          </div>

          {/* Corps de l'Éditeur avec Numérotation de Lignes et Textarea */}
          <div className="relative flex flex-1 min-h-[460px] max-h-[580px] overflow-hidden bg-slate-950/80 font-mono text-xs">
            {/* Colonne des numéros de lignes */}
            <div className="w-12 py-3 bg-slate-950 select-none text-right pr-3 text-slate-600 border-r border-slate-800 font-mono text-xs overflow-hidden leading-relaxed">
              {Array.from({ length: Math.max(lineCount, 22) }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Zone de texte de saisie avec police monospace & indentation */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto whitespace-pre selection:bg-indigo-600 selection:text-white"
              style={{ tabSize: 4 }}
              placeholder={`Écrivez votre code ${currentLangConfig.name} ici ou sélectionnez un exercice ci-dessous...`}
            />
          </div>

          {/* Pied de l'Éditeur */}
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info size={12} className="text-indigo-400" />
              <span>Touche Tabulation activée (4 espaces) · Exécution : Ctrl + Entrée</span>
            </span>
            <span className="font-mono text-slate-500">CampusHub Virtual Hub</span>
          </div>
        </div>

        {/* Colonne Droite : Panneau de Résultats & Rendu en Direct (5 colonnes) */}
        {!isEditorExpanded && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Onglets du Panneau de Sortie */}
            <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 overflow-x-auto">
                {/* Pour HTML : Onglet Prévisualisation */}
                {selectedLanguage === 'html' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-slate-800 text-amber-300 shadow-xs border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Aperçu Web Direct</span>
                  </button>
                )}

                {/* Pour SQL : Onglet Tableau */}
                {selectedLanguage === 'sql' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('sql_table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'sql_table'
                        ? 'bg-slate-800 text-cyan-300 shadow-xs border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <TableIcon size={13} />
                    <span>Table de Résultat</span>
                  </button>
                )}

                {/* Onglet Console Standard */}
                <button
                  type="button"
                  onClick={() => setActiveTab('stdout')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'stdout'
                      ? 'bg-slate-800 text-emerald-400 shadow-xs border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon size={13} />
                  <span>Sortie (stdout)</span>
                </button>

                {/* Onglet Journal de Compilation */}
                <button
                  type="button"
                  onClick={() => setActiveTab('build')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'build'
                      ? 'bg-slate-800 text-indigo-400 shadow-xs border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu size={13} />
                  <span>Compilateur</span>
                </button>

                {/* Onglet Diagnostic Valgrind (C uniquement) */}
                {selectedLanguage === 'c' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('valgrind')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'valgrind'
                        ? 'bg-slate-800 text-blue-400 shadow-xs border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldAlert size={13} />
                    <span>Valgrind</span>
                  </button>
                )}
              </div>

              {/* Bouton Nettoyer Sortie */}
              <button
                type="button"
                onClick={() => {
                  setConsoleOutput('');
                  setBuildLogs('');
                  setMemoryReport(null);
                  setSqlTableResult(null);
                  setExecutionStats(null);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                title="Vider les sorties"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Contenu Dynamique de la Sortie */}
            <div className="flex-1 min-h-[460px] max-h-[580px] p-4 font-mono text-xs overflow-y-auto bg-slate-950 text-slate-200 leading-relaxed">
              {/* VUE 1 : Rendu en Direct HTML/CSS (Iframe Sandbox) */}
              {activeTab === 'preview' && selectedLanguage === 'html' && (
                <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col">
                  <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Layout size={12} />
                      <span>Bac à sable sécurisé (about:blank)</span>
                    </span>
                    <span>Actualisation en temps réel</span>
                  </div>
                  <iframe
                    ref={iframeRef}
                    title="Aperçu Web en Direct"
                    sandbox="allow-scripts"
                    className="w-full flex-1 border-0 bg-white"
                  />
                </div>
              )}

              {/* VUE 2 : Tableau Relationnel SQL */}
              {activeTab === 'sql_table' && selectedLanguage === 'sql' && (
                <div className="space-y-3 font-sans">
                  {sqlTableResult ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <Database size={13} />
                          <span>{sqlTableResult.queryType}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {sqlTableResult.rowCount} tuples • {sqlTableResult.executionTime}
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              {sqlTableResult.columns.map((col) => (
                                <th key={col} className="px-3 py-2">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                            {sqlTableResult.rows.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40">
                                {sqlTableResult.columns.map((col) => (
                                  <td key={col} className="px-3 py-2 font-mono text-xs">
                                    {row[col] !== undefined ? String(row[col]) : 'NULL'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-20 font-sans">
                      <Database size={32} className="mb-2 text-slate-700" />
                      <p className="font-semibold text-slate-400">Moteur SQL prêt.</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Cliquez sur « Exécuter le code » pour interroger la base relationnelle.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* VUE 3 : Sortie Standard (Stdout) */}
              {activeTab === 'stdout' && (
                <div>
                  {consoleOutput ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed">
                      {consoleOutput}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-20 font-sans">
                      <TerminalIcon size={32} className="mb-2 text-slate-700" />
                      <p className="font-semibold text-slate-400">Console prête.</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Exécutez votre code pour visualiser les impressions stdout et retours d'exécution.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* VUE 4 : Logs du Compilateur */}
              {activeTab === 'build' && (
                <div>
                  <div className="text-slate-400 mb-2 font-bold text-[11px] uppercase tracking-wider font-sans">
                    Journal du compilateur / Interpréteur :
                  </div>
                  {buildLogs ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs text-indigo-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      {buildLogs}
                    </pre>
                  ) : (
                    <p className="text-slate-600 italic font-sans">
                      Aucune compilation récente. Lancez une exécution pour inspecter le journal GCC/Python.
                    </p>
                  )}
                </div>
              )}

              {/* VUE 5 : Diagnostic Valgrind (C) */}
              {activeTab === 'valgrind' && (
                <div className="space-y-3 font-sans">
                  <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    Diagnostic de Gestion Mémoire (Valgrind Memcheck) :
                  </div>
                  {memoryReport ? (
                    <div className="space-y-3">
                      <div
                        className={`p-3.5 rounded-xl border text-xs ${
                          memoryReport.status === 'warning'
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : memoryReport.status === 'success'
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <p className="font-bold mb-1 flex items-center gap-1.5">
                          {memoryReport.status === 'warning' ? (
                            <AlertTriangle size={14} className="text-amber-400" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          )}
                          <span>{memoryReport.message}</span>
                        </p>
                        <p className="text-[11px] opacity-90 font-mono mt-1">
                          {memoryReport.details}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400">
                        <div>==14209== Memcheck, a memory error detector for x86_64-linux</div>
                        <div>==14209== Command: ./main</div>
                        <div>==14209== Rerun with --leak-check=full to see detailed backtraces</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">
                      Lancez votre code C pour obtenir un rapport de traçabilité des allocations mémoire.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Pied du Panneau de Sortie : Horodatage & Statut d'Exécution */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-sans">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Environnement Virtuel Dédié UY1</span>
              </span>
              {executionStats ? (
                <span className="font-mono text-[11px] text-slate-400">
                  Temps : {executionStats.timeMs}ms • Code retour : {executionStats.exitCode}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Prêt</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Section des Snippets Académiques & Exercices Rapides (L1 à Master) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" />
              <span>Exercices & Modèles Types : {currentLangConfig.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sélectionnez un exercice pour charger instantanément le code source et le tester.
            </p>
          </div>

          {/* Filtres par Niveau Académique */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'L1', 'L2', 'L3', 'Master'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterLevel === lvl
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Tous' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Cartes d'Exercices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {availableSnippets.map((snippet) => {
            const isCurrentlyLoaded = selectedSnippetId === snippet.id;
            return (
              <div
                key={snippet.id}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrentlyLoaded
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      {snippet.module}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {snippet.level}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                    {snippet.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {snippet.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {snippet.code.split('\n').length} lignes
                  </span>

                  <button
                    type="button"
                    onClick={() => handleLoadSnippet(snippet)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      isCurrentlyLoaded
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{isCurrentlyLoaded ? 'Actif' : 'Charger'}</span>
                    <Sparkles size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
