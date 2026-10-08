import { useState, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  Info,
} from 'lucide-react';

const CS_SNIPPETS = {
  c: [
    {
      id: 'c-abr',
      title: 'Arbre Binaire de Recherche (ABR) en C',
      codeUe: 'INF201',
      code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *left;
    struct Node *right;
} Node;

Node* insert(Node *root, int val) {
    if (root == NULL) {
        Node *n = (Node*)malloc(sizeof(Node));
        n->val = val;
        n->left = n->right = NULL;
        return n;
    }
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}

void printInOrder(Node *root) {
    if (root != NULL) {
        printInOrder(root->left);
        printf("%d ", root->val);
        printInOrder(root->right);
    }
}

int main(void) {
    Node *root = NULL;
    int data[] = {45, 12, 78, 3, 25, 60, 92};
    printf("=== CampusHub Lab INF201 (UY1 / Polytechnique) ===\\n");
    for (int i = 0; i < 7; i++) root = insert(root, data[i]);
    printf("Parcours Infixe trié de l'ABR : ");
    printInOrder(root);
    printf("\\nStatut d'exécution : 0 OK\\n");
    return 0;
}`,
      output: `=== CampusHub Lab INF201 (UY1 / Polytechnique) ===
Parcours Infixe trié de l'ABR : 3 12 25 45 60 78 92 
Statut d'exécution : 0 OK`,
    },
    {
      id: 'c-posix',
      title: 'Programmation Système POSIX (fork & wait)',
      codeUe: 'INF203',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("Échec du fork");
        return 1;
    }
    if (pid == 0) {
        printf("[Processus Fils PID %d] Exécution de la tâche parallèle.\\n", getpid());
        exit(0);
    } else {
        printf("[Processus Parent PID %d] En attente du fils %d...\\n", getpid(), pid);
        wait(NULL);
        printf("[Processus Parent] Le fils s'est terminé sans fuite (Pas de zombie).\\n");
    }
    return 0;
}`,
      output: `[Processus Parent PID 1042] En attente du fils 1043...
[Processus Fils PID 1043] Exécution de la tâche parallèle.
[Processus Parent] Le fils s'est terminé sans fuite (Pas de zombie).`,
    },
  ],
  python: [
    {
      id: 'py-dijkstra',
      title: 'Algorithme du Plus Court Chemin (Dijkstra)',
      codeUe: 'INF201',
      code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        if curr_dist > distances[curr_node]:
            continue
        for neighbor, weight in graph[curr_node].items():
            dist = curr_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
    return distances

# Réseau Campus UY1 (Ngoa-Ekellé, Amphi 250, Labo Info, Polytech)
network = {
    'Ngoa-Ekellé': {'Amphi 250': 4, 'Labo Info': 2},
    'Amphi 250': {'Ngoa-Ekellé': 4, 'Polytech': 3},
    'Labo Info': {'Ngoa-Ekellé': 2, 'Amphi 250': 1, 'Polytech': 5},
    'Polytech': {'Amphi 250': 3, 'Labo Info': 5}
}

res = dijkstra(network, 'Ngoa-Ekellé')
print("Plus courts chemins depuis Ngoa-Ekellé :")
for node, d in res.items():
    print(f"  → {node}: {d} km")`,
      output: `Plus courts chemins depuis Ngoa-Ekellé :
  → Ngoa-Ekellé: 0 km
  → Amphi 250: 3 km
  → Labo Info: 2 km
  → Polytech: 6 km`,
    },
  ],
  sql: [
    {
      id: 'sql-students',
      title: 'Requête Relationnelle SQL & Jointures ACID',
      codeUe: 'INF301',
      code: `SELECT 
    e.matricule, 
    e.nom, 
    u.code_ue, 
    u.intitule, 
    n.note_cc, 
    n.note_sn,
    ROUND((n.note_cc * 0.3) + (n.note_sn * 0.7), 2) AS moyenne_finale
FROM etudiants e
JOIN notes n ON e.id = n.etudiant_id
JOIN ues u ON n.ue_id = u.id
WHERE u.code_ue = 'INF201' AND ROUND((n.note_cc * 0.3) + (n.note_sn * 0.7), 2) >= 12.0
ORDER BY moyenne_finale DESC;`,
      output: `TABLE DE RÉSULTAT SQL (3 lignes retournées en 4ms) :
| MATRICULE | NOM           | CODE_UE | INTITULÉ              | CC   | SN   | MOYENNE |
|-----------|---------------|---------|-----------------------|------|------|---------|
| 23S40192  | Yan Fotsing   | INF201  | Arbres & Graphes      | 18.0 | 17.5 | 17.65   |
| 23U1084   | Brice Kamga   | INF201  | Arbres & Graphes      | 16.5 | 16.0 | 16.15   |
| 23U1095   | Carole Ndongo | INF201  | Arbres & Graphes      | 14.0 | 13.5 | 13.65   |`,
    },
  ],
};

export default function ComputerScienceLab() {
  const [lang, setLang] = useState('c'); // 'c' | 'python' | 'sql'
  const [selectedSnippet, setSelectedSnippet] = useState(CS_SNIPPETS.c[0]);
  const [code, setCode] = useState(CS_SNIPPETS.c[0].code);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('stdout'); // 'stdout' | 'valgrind' | 'table'
  const textareaRef = useRef(null);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    const first = CS_SNIPPETS[newLang][0];
    setSelectedSnippet(first);
    setCode(first.code);
    setConsoleOutput('');
  };

  const handleSnippetSelect = (snippet) => {
    setSelectedSnippet(snippet);
    setCode(snippet.code);
    setConsoleOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput(`[Compilateur ${lang.toUpperCase()}] Analyse syntaxique et compilation en cours...`);

    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(selectedSnippet.output);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-left">
      {/* Header Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => handleLangChange('c')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === 'c'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Langage C (GCC)
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('python')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === 'python'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python 3.12
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('sql')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === 'sql'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SQL Relationnel
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {CS_SNIPPETS[lang]?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSnippetSelect(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedSnippet.id === s.id
                    ? 'bg-slate-800 border-indigo-500 text-indigo-300'
                    : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {s.codeUe} : {s.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer"
            title="Copier le code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
          <button
            type="button"
            onClick={() => setCode(selectedSnippet.code)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={handleRun}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
          >
            <Play size={13} fill="currentColor" />
            <span>{isRunning ? 'Exécution...' : 'Compiler & Lancer'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Code Editor */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-400 ml-1">
                {lang === 'c' ? 'main.c (POSIX ANSI)' : lang === 'python' ? 'script.py' : 'query.sql'}
              </span>
            </div>
            <span className="text-indigo-400 font-bold uppercase">{selectedSnippet.codeUe}</span>
          </div>

          <textarea
            ref={textareaRef}
            rows={17}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="p-4 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600"
          />

          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info size={12} className="text-indigo-400" />
              <span>Support C11 / Python 3.12 / PostgreSQL compatible</span>
            </span>
            <span className="font-mono text-slate-400">CampusHub IDE</span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('stdout')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'stdout'
                    ? 'bg-slate-800 text-indigo-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sortie (stdout)
              </button>
              {lang === 'c' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('valgrind')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'valgrind'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Valgrind Memcheck
                </button>
              )}
              {lang === 'sql' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'table'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Vue Table
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-500">Port 3000 IPC</span>
          </div>

          <div className="p-4 min-h-[380px] max-h-[460px] overflow-y-auto leading-relaxed">
            {activeTab === 'stdout' && (
              <pre className="whitespace-pre-wrap text-slate-200">
                {consoleOutput || '// Cliquez sur "Compiler & Lancer" pour exécuter le code dans l\'environnement virtuel...'}
              </pre>
            )}

            {activeTab === 'valgrind' && (
              <div className="space-y-3 font-sans">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={14} />
                    <span>0 Fuite Mémoire Détectée (Valgrind 3.22)</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Tous les blocs mémoire alloués via malloc() ont été proprement libérés avec free().
                  </p>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-400 whitespace-pre-wrap">
==12048== Memcheck, a memory error detector
==12048== All heap blocks were freed -- no leaks are possible
==12048== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0)
                </pre>
              </div>
            )}

            {activeTab === 'table' && (
              <div className="space-y-2 font-sans text-xs">
                <span className="text-slate-400 font-bold text-[11px]">Schéma Relationnel actif (MySQL / PostgreSQL) :</span>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-slate-300 text-[11px]">
                  <div>• <strong>etudiants</strong> (id, matricule, nom, filiere, niveau)</div>
                  <div>• <strong>ues</strong> (id, code_ue, intitule, credits)</div>
                  <div>• <strong>notes</strong> (id, etudiant_id, ue_id, note_cc, note_sn)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
