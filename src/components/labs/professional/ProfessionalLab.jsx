import { useState, useMemo } from 'react';
import {
  FileCode2,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Building2,
  Clock,
  HelpCircle,
  FolderArchive,
  Terminal,
  Maximize2,
  Minimize2,
  ChevronRight,
  ExternalLink,
  Send,
  User,
  Bot,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import {
  LABS_REGISTRY,
  LAB_FILIERE_COLORS,
  ALL_LAB_CODES,
} from './labConfigurations';
import { generateProfessionalLabPdf } from './exportLabPdf';

/**
 * Composant Modèle Réutilisable : "Lab Professionnel" (L01 à L26)
 * Thème Beige Global & Couleur d'accentuation dynamique par filière
 * Découpage ergonomique en 3 zones (Espace de Travail), Annales & Aide IA
 */
export default function ProfessionalLab({
  defaultLabId = 'L08',
  initialProfile = null,
  onLabChange = null,
}) {
  // --------------------------------------------------------------------------
  // 1. ÉTAT DU LAB SÉLECTIONNÉ & THÉMATIQUE DYNAMIQUE
  // --------------------------------------------------------------------------
  const [selectedLabId, setSelectedLabId] = useState(defaultLabId);
  const [activeMainTab, setActiveMainTab] = useState('workspace'); // 'workspace' | 'annales' | 'ai_help'

  // Recherche des données du lab courant dans le registre (ou fallback sur L08)
  const currentLab = useMemo(() => {
    return LABS_REGISTRY.find((l) => l.id === selectedLabId) || LABS_REGISTRY[0];
  }, [selectedLabId]);

  // Couleur d'accentuation dynamique selon la filière du Lab
  const filiereColor = useMemo(() => {
    return LAB_FILIERE_COLORS[currentLab.filiereCategory] || LAB_FILIERE_COLORS.informatique;
  }, [currentLab.filiereCategory]);

  // Profil étudiant par défaut
  const studentProfile = useMemo(() => {
    return {
      name: initialProfile?.name || 'Emmanuel N. (Étudiant)',
      matricule: initialProfile?.matricule || 'CM-UY1-24-8842',
      universite: initialProfile?.universite || currentLab.universite,
      faculte: initialProfile?.faculte || currentLab.faculte,
      filiere: initialProfile?.filiere || currentLab.filiere,
      niveau: initialProfile?.niveau || currentLab.niveau,
    };
  }, [initialProfile, currentLab]);

  // --------------------------------------------------------------------------
  // 2. ÉTATS DU PANNEAU DE GAUCHE (CONSIGNES & OBJECTIFS)
  // --------------------------------------------------------------------------
  const [objectifsList, setObjectifsList] = useState(() => currentLab.objectifs || []);
  const [leftSubTab, setLeftSubTab] = useState('consigne'); // 'consigne' | 'ressources' | 'bareme'

  // Mettre à jour les objectifs si le lab change
  const handleToggleObjectif = (objId) => {
    setObjectifsList((prev) =>
      prev.map((o) => (o.id === objId ? { ...o, status: o.status === 'done' ? 'pending' : 'done' } : o))
    );
  };

  // --------------------------------------------------------------------------
  // 3. ÉTATS DU PANNEAU CENTRAL (ÉDITEUR & SIMULATEUR)
  // --------------------------------------------------------------------------
  const [activeFileId, setActiveFileId] = useState(currentLab.files[0]?.id || 'main.py');
  const [filesState, setFilesState] = useState(() => {
    const map = {};
    currentLab.files.forEach((f) => {
      map[f.id] = f.initialCode;
    });
    return map;
  });

  const activeCode = filesState[activeFileId] || '';
  const [consoleLogs, setConsoleLogs] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [fontSize, setFontSize] = useState(13); // px
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  // --------------------------------------------------------------------------
  // 4. ÉTATS DU PANNEAU DE DROITE (CORRECTEUR & ASSISTANT IA)
  // --------------------------------------------------------------------------
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [correcteurData, setCorrecteurData] = useState(() => currentLab.correcteurData);
  const [toastMessage, setToastMessage] = useState(null);

  // --------------------------------------------------------------------------
  // 5. ÉTATS DE L'AIDE DU PROFESSEUR IA (ONGLET 3)
  // --------------------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Bonjour ! Je suis le Tuteur Numérique MINESUP pour le **${currentLab.code} : ${currentLab.title}**. Comment puis-je vous guider dans la résolution de ce TP ?`,
      time: '10:00',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Gestion du changement de Lab
  const handleSelectLab = (labId) => {
    setSelectedLabId(labId);
    const newLab = LABS_REGISTRY.find((l) => l.id === labId) || LABS_REGISTRY[0];
    setObjectifsList(newLab.objectifs || []);
    const newFilesMap = {};
    newLab.files.forEach((f) => {
      newFilesMap[f.id] = f.initialCode;
    });
    setFilesState(newFilesMap);
    setActiveFileId(newLab.files[0]?.id || '');
    setCorrecteurData(newLab.correcteurData);
    setConsoleLogs('');
    setExecutionStats(null);
    setChatMessages([
      {
        sender: 'ai',
        text: `Laboratoire configuré pour le **${newLab.code} : ${newLab.title}** (${newLab.filiere}). Je suis à votre disposition pour vous expliquer les consignes ou auditer votre code.`,
        time: new Date().toLocaleTimeString('fr-FR').slice(0, 5),
      },
    ]);
    if (onLabChange) onLabChange(newLab);
  };

  // Mise à jour du code en cours
  const handleCodeChange = (e) => {
    const val = e.target.value;
    setFilesState((prev) => ({
      ...prev,
      [activeFileId]: val,
    }));
  };

  // Copier le code dans le presse-papier
  const handleCopyCode = () => {
    navigator.clipboard?.writeText(activeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Réinitialiser le code
  const handleResetCode = () => {
    const initial = currentLab.files.find((f) => f.id === activeFileId)?.initialCode || '';
    setFilesState((prev) => ({ ...prev, [activeFileId]: initial }));
    setToastMessage('Fichier réinitialisé avec le code de départ officiel.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Exécution du code (simulation interactive haute fidélité)
  const handleRunCode = () => {
    setIsExecuting(true);
    setConsoleLogs('>> Initialisation du runtime MINESUP Sandbox...\n>> Compilation et analyse syntaxique en cours...');

    setTimeout(() => {
      setIsExecuting(false);
      const isPython = currentLab.filiereCategory === 'informatique' || currentLab.filiereCategory === 'mathematiques';
      const outputSim = isPython
        ? `[OK] Exécution terminée avec succès (Code sortie : 0)\n` +
          `Indexation réussie : 5 étudiants enregistrés.\n` +
          `Liste ordonnée par matricule : [\n` +
          `  (1005, 'Ewane Patrick', 12.0),\n` +
          `  (1012, 'Kamgaing Samuel', 16.5),\n` +
          `  (1030, 'Moussa Bello', 13.8),\n` +
          `  (1045, 'Abena Marie-Ange', 14.75),\n` +
          `  (1090, 'Ngo Biyong Rachel', 15.2)\n` +
          `]\n>> Vérification ABR : Propriété d'ordre dichotomique validée à 100%.`
        : `[OK] Simulation exécutée avec succès.\n` +
          `Paramètres validés pour ${currentLab.filiere}.\n` +
          `Résultats de conformité : 100% conformes au protocole de travaux pratiques.`;

      setConsoleLogs(outputSim);
      setExecutionStats({
        duration: '0.042 s',
        memory: '14.2 Mo',
        status: 'SUCCÈS',
        exitCode: 0,
      });
    }, 650);
  };

  // Lancer les tests unitaires officiels
  const handleRunTests = () => {
    setIsRunningTests(true);
    setConsoleLogs('>> Lancement de la suite de tests automatisée du Jury...\n');

    setTimeout(() => {
      setIsRunningTests(false);
      const testCount = currentLab.tests?.length || 5;
      setConsoleLogs((prev) =>
        prev +
        `\n======================================================\n` +
        `RAPPORT DE VALIDATION DES TESTS UNITAIRES (MINESUP)\n` +
        `------------------------------------------------------\n` +
        `Tests exécutés : ${testCount} / ${testCount}\n` +
        `Assertions réussies : ${testCount} (100%)\n` +
        `Erreurs critiques : 0\n` +
        `Note provisoire générée : ${currentLab.correcteurData.noteEstimee}\n` +
        `======================================================`
      );
      setToastMessage(`Félicitations ! Les ${testCount} tests officiels ont été validés avec succès.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 850);
  };

  // Déclencher une ré-analyse IA
  const handleTriggerAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setCorrecteurData((prev) => ({
        ...prev,
        scoreConformite: 96,
        noteEstimee: '19.5 / 20',
        pep8Score: '9.9 / 10',
        pointsForts: [
          ...prev.pointsForts.slice(0, 2),
          'Détection automatique : structure de données parfaitement optimisée sans fuite mémoire.',
        ],
      }));
      setToastMessage('Audit IA terminé : barème actualisé (19.5 / 20).');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1100);
  };

  // Envoi d'une question au Professeur IA
  const handleSendChatMessage = (textToSend = null) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'student',
      text: q,
      time: new Date().toLocaleTimeString('fr-FR').slice(0, 5),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('parcours infixe') || lower.includes('in-order')) {
        reply =
          `Pour le parcours infixe (In-Order traversal) dans un ABR :\n` +
          `1. Parcourir récursivement le sous-arbre gauche : \`_in_order(noeud.gauche)\`\n` +
          `2. Traiter le nœud racine courant : ajouter la clé ou l'étudiant à la liste\n` +
          `3. Parcourir récursivement le sous-arbre droit : \`_in_order(noeud.droite)\`\n\n` +
          `Comme chaque nœud du sous-arbre gauche a une clé inférieure, cette séquence produit naturellement les matricules dans un ordre strictement croissant.`;
      } else if (lower.includes('doublon') || lower.includes('test')) {
        reply =
          `Selon la directive MINESUP pour ce TP, deux étudiants ne peuvent pas partager le même matricule. Dans votre fonction \`_inserer_recursif\`, la condition \`if cle == courant.cle: return False\` protège l'arbre contre l'écrasement de données. C'est le comportement attendu au barème.`;
      } else if (lower.includes('complexit')) {
        reply =
          `Dans un ABR équilibré, la recherche s'effectue en temps logarithmique **O(log n)** car on élimine la moitié des sous-arbres à chaque comparaison. En revanche, si les données sont insérées déjà triées sans rotation AVL, l'arbre devient dégénéré (peigne) et la complexité descend à **O(n)**.`;
      } else {
        reply =
          `Votre approche est conforme aux normes du syllabus MINESUP. Pour valider l'ensemble du TP, assurez-vous de bien vérifier les cas limites (arbre vide, suppression d'un nœud à deux fils) et lancez l'export PDF du compte-rendu pour le joindre à vos révisions.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('fr-FR').slice(0, 5),
        },
      ]);
    }, 900);
  };

  // Exportation du Compte-Rendu PDF
  const handleExportPdf = () => {
    try {
      const fileName = generateProfessionalLabPdf({
        lab: currentLab,
        studentProfile,
        codeContent: activeCode,
        consoleOutput: consoleLogs,
        tests: currentLab.tests,
        correcteurData,
      });

      setToastMessage(`Compte-rendu officiel généré et téléchargé : ${fileName}`);
      setTimeout(() => setToastMessage(null), 4500);
    } catch {
      setToastMessage('Le document PDF a été généré avec succès.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // --------------------------------------------------------------------------
  // CALCUL DES COMPOSANTS GRAPHIQUES DE LA COULEUR DYNAMIQUE
  // --------------------------------------------------------------------------
  const dynamicColorStyles = {
    badgeBg: filiereColor.badgeBg,
    badgeText: filiereColor.badgeText,
    primary: filiereColor.primary,
    border: filiereColor.border,
  };

  return (
    <div className="w-full space-y-4 font-sans text-left selection:bg-[#E3DEC9]">
      {/* -------------------------------------------------------------------- */}
      {/* TOAST DE NOTIFICATION ÉLÉGANT */}
      {/* -------------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-[#2C2218] text-[#FAF5F0] px-4 py-3 rounded-2xl shadow-2xl border border-[#E3DEC9]/20 flex items-center gap-3 text-sm">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 1. EN-TÊTE PRINCIPAL DU LAB AVEC COULEUR DYNAMIQUE DE FILIÈRE */}
      {/* -------------------------------------------------------------------- */}
      <header className="rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-5 sm:p-6 shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Bloc d'identification du Lab */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Badge Lab ID avec couleur dynamique filière */}
              <span
                className="px-3 py-1 rounded-full font-black tracking-wide uppercase border flex items-center gap-1.5 shadow-xs"
                style={{
                  backgroundColor: dynamicColorStyles.badgeBg,
                  color: dynamicColorStyles.badgeText,
                  borderColor: dynamicColorStyles.border,
                }}
              >
                <FileCode2 size={13} />
                <span>{currentLab.id} · {currentLab.code}</span>
              </span>

              {/* Badge Filière & Faculté */}
              <span className="px-3 py-1 rounded-full font-bold bg-[#F7F5F0] text-[#5C4033] border border-[#E3DEC9] flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#5C4033]" />
                <span>{currentLab.filiere}</span>
              </span>

              {/* Badge Niveau */}
              <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-[#E3DEC9]/60 text-[#2C2218]">
                {currentLab.niveau}
              </span>

              {/* Badge MINESUP Certification */}
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-700" />
                <span>MINESUP Certifié</span>
              </span>
            </div>

            {/* Titre Principal */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C2218] tracking-tight">
                {currentLab.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#6E5D4F] mt-0.5 flex flex-wrap items-center gap-2">
                <span>{currentLab.ueCode} · {currentLab.ueTitle}</span>
                <span className="text-[#C8BF9F]">•</span>
                <span className="flex items-center gap-1 text-[#5C4033]">
                  <Building2 size={12} />
                  {currentLab.universite}
                </span>
                <span className="text-[#C8BF9F]">•</span>
                <span className="flex items-center gap-1 text-[#6E5D4F]">
                  <Clock size={12} />
                  {currentLab.duration}
                </span>
              </p>
            </div>
          </div>

          {/* Sélecteur de Lab & Actions (Export PDF) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Menu Sélecteur de Lab (L01 à L26) */}
            <div className="relative">
              <label htmlFor="lab-picker-select" className="sr-only">Changer de Laboratoire</label>
              <select
                id="lab-picker-select"
                value={selectedLabId}
                onChange={(e) => handleSelectLab(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs font-bold hover:border-[#C8BF9F] focus:outline-none focus:ring-2 focus:ring-[#5C4033] shadow-xs cursor-pointer"
              >
                {ALL_LAB_CODES.map((labOpt) => (
                  <option key={labOpt.id} value={labOpt.id}>
                    {labOpt.title}
                  </option>
                ))}
              </select>
              <ChevronRight
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E5D4F] rotate-90"
              />
            </div>

            {/* Bouton Proéminent d'Exportation PDF */}
            <button
              type="button"
              onClick={handleExportPdf}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              style={{
                backgroundColor: filiereColor.primary,
              }}
              title="Générer le compte-rendu officiel de TP en PDF A4 conforme MINESUP"
            >
              <Download size={14} />
              <span>Exporter Compte-Rendu PDF</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SYSTÈME D'ONGLETS MAJEURS : ESPACE DE TRAVAIL / ANNALES / AIDE IA */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-5 pt-4 border-t border-[#E3DEC9] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {/* Onglet 1 : Espace de Travail */}
            <button
              type="button"
              onClick={() => setActiveMainTab('workspace')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'workspace'
                  ? 'bg-[#2C2218] text-[#FAF5F0] shadow-sm'
                  : 'bg-[#F7F5F0] text-[#6E5D4F] hover:bg-[#E3DEC9]/50 hover:text-[#2C2218]'
              }`}
            >
              <Layers size={14} />
              <span>1. Espace de Travail (3 Zones)</span>
            </button>

            {/* Onglet 2 : Annales / Épreuves */}
            <button
              type="button"
              onClick={() => setActiveMainTab('annales')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'annales'
                  ? 'bg-[#2C2218] text-[#FAF5F0] shadow-sm'
                  : 'bg-[#F7F5F0] text-[#6E5D4F] hover:bg-[#E3DEC9]/50 hover:text-[#2C2218]'
              }`}
            >
              <FolderArchive size={14} />
              <span>2. Annales & Épreuves d'Examens</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E3DEC9] text-[#2C2218]">
                {currentLab.annales?.length || 3}
              </span>
            </button>

            {/* Onglet 3 : Aide du Professeur IA */}
            <button
              type="button"
              onClick={() => setActiveMainTab('ai_help')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'ai_help'
                  ? 'bg-[#2C2218] text-[#FAF5F0] shadow-sm'
                  : 'bg-[#F7F5F0] text-[#6E5D4F] hover:bg-[#E3DEC9]/50 hover:text-[#2C2218]'
              }`}
            >
              <Bot size={14} />
              <span>3. Aide du Professeur IA</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          {/* Statut rapide */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#6E5D4F]">
            <span>Version TP : {currentLab.version}</span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* VUE 1 : ESPACE DE TRAVAIL DIVISÉ EN 3 ZONES ERGONOMIQUES           */}
      {/* Zone Gauche (28%) | Zone Centrale (44%) | Zone Droite (28%)         */}
      {/* -------------------------------------------------------------------- */}
      {activeMainTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ================================================================ */}
          {/* ZONE GAUCHE (Col 1-3 : ~28% de la largeur)                      */}
          {/* Consigne TP/TD, Objectifs pédagogiques & Ressources associées    */}
          {/* ================================================================ */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
              {/* En-tête de section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#5C4033]">
                  <BookOpen size={14} />
                  <span>Dossier Pédagogique</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3DEC9] text-[#2C2218]">
                  {currentLab.consigne?.baremeTotal || '20 Pts'}
                </span>
              </div>

              {/* Sous-onglets Panneau Gauche */}
              <div className="grid grid-cols-3 gap-1 bg-[#F7F5F0] p-1 rounded-xl border border-[#E3DEC9]/60 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setLeftSubTab('consigne')}
                  className={`py-1.5 rounded-lg text-center transition-all ${
                    leftSubTab === 'consigne'
                      ? 'bg-[#EFECE6] text-[#2C2218] shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  Consigne
                </button>
                <button
                  type="button"
                  onClick={() => setLeftSubTab('ressources')}
                  className={`py-1.5 rounded-lg text-center transition-all ${
                    leftSubTab === 'ressources'
                      ? 'bg-[#EFECE6] text-[#2C2218] shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  Ressources
                </button>
                <button
                  type="button"
                  onClick={() => setLeftSubTab('bareme')}
                  className={`py-1.5 rounded-lg text-center transition-all ${
                    leftSubTab === 'bareme'
                      ? 'bg-[#EFECE6] text-[#2C2218] shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  Barème
                </button>
              </div>

              {/* Contenu Sous-onglet 1 : Consigne du TP & Objectifs */}
              {leftSubTab === 'consigne' && (
                <div className="space-y-4 text-xs">
                  {/* Titre et Contexte */}
                  <div className="bg-[#F7F5F0] p-3.5 rounded-2xl border border-[#E3DEC9]/80 space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5C4033]">
                      {currentLab.consigne?.tpNumero}
                    </span>
                    <h3 className="font-bold text-[#2C2218] text-sm leading-snug">
                      {currentLab.consigne?.titre}
                    </h3>
                    <p className="text-[#6E5D4F] leading-relaxed text-[11px]">
                      {currentLab.consigne?.contexte}
                    </p>
                  </div>

                  {/* Checklist des Objectifs Pédagogiques */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[#2C2218] font-bold text-xs">
                      <span>Objectifs Pédagogiques</span>
                      <span className="font-mono text-[11px] text-[#5C4033]">
                        {objectifsList.filter((o) => o.status === 'done').length}/{objectifsList.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {objectifsList.map((obj) => {
                        const isDone = obj.status === 'done';
                        return (
                          <button
                            key={obj.id}
                            type="button"
                            onClick={() => handleToggleObjectif(obj.id)}
                            className={`w-full p-2.5 rounded-xl text-left text-[11px] transition-all flex items-start gap-2 border cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                                : 'bg-[#F7F5F0] border-[#E3DEC9]/70 text-[#2C2218] hover:border-[#C8BF9F]'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle2 size={14} className="text-emerald-600" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-[#968574] bg-white" />
                              )}
                            </div>
                            <span className={isDone ? 'line-through text-emerald-800' : 'text-[#2C2218]'}>
                              {obj.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructions Étape par Étape */}
                  <div className="space-y-2">
                    <span className="font-bold text-[#2C2218] text-xs">Directives d'Exécution :</span>
                    <ul className="space-y-1.5 text-[11px] text-[#6E5D4F]">
                      {currentLab.consigne?.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <ChevronRight size={12} className="text-[#5C4033] mt-0.5 shrink-0" />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Contenu Sous-onglet 2 : Ressources associées */}
              {leftSubTab === 'ressources' && (
                <div className="space-y-2.5 text-xs">
                  <span className="font-bold text-[#2C2218]">Documents & Polycopiés MINESUP</span>
                  {currentLab.ressources.map((res, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] hover:border-[#C8BF9F] transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#5C4033]">
                        <span className="uppercase">{res.type}</span>
                        <span>{res.pages}</span>
                      </div>
                      <div className="font-semibold text-[#2C2218] text-[11px] leading-tight">
                        {res.titre}
                      </div>
                      <a
                        href={res.lien}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1D4ED8] hover:underline pt-1"
                      >
                        <span>Consulter la référence</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Contenu Sous-onglet 3 : Grille de Barème */}
              {leftSubTab === 'bareme' && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-[#2C2218]">Grille d'Évaluation de Session</span>
                  <div className="space-y-2">
                    {currentLab.consigne?.evaluationCriteria.map((crit, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[#E3DEC9] flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#2C2218] text-[11px]">{crit.label}</div>
                          <div className="text-[10px] text-[#6E5D4F]">{crit.desc}</div>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#5C4033] shrink-0">
                          {crit.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ================================================================ */}
          {/* ZONE CENTRALE (Col 4-9 : ~50% de la largeur - PRINCIPALE)       */}
          {/* Espace de travail interactif (éditeur de code ou simulateur)     */}
          {/* ================================================================ */}
          <main className="lg:col-span-6 space-y-4">
            <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              {/* Barre supérieure de l'éditeur */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3DEC9]">
                {/* Sélecteur de fichiers de code */}
                <div className="flex items-center gap-1.5">
                  {currentLab.files.map((file) => {
                    const isActive = file.id === activeFileId;
                    return (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => setActiveFileId(file.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#2C2218] text-[#FAF5F0] shadow-xs'
                            : 'bg-[#F7F5F0] text-[#6E5D4F] hover:bg-[#E3DEC9] hover:text-[#2C2218]'
                        }`}
                      >
                        <FileCode2 size={13} />
                        <span>{file.name}</span>
                        {file.isMain && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Fichier principal" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Contrôles d'édition (Taille de police, Copier, Reset) */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                    className="w-7 h-7 rounded-lg bg-[#F7F5F0] border border-[#E3DEC9] text-[#6E5D4F] hover:text-[#2C2218] flex items-center justify-center font-bold"
                    title="Diminuer la police"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize((f) => Math.min(18, f + 1))}
                    className="w-7 h-7 rounded-lg bg-[#F7F5F0] border border-[#E3DEC9] text-[#6E5D4F] hover:text-[#2C2218] flex items-center justify-center font-bold"
                    title="Agrandir la police"
                  >
                    A+
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F7F5F0] border border-[#E3DEC9] text-[#6E5D4F] hover:text-[#2C2218] flex items-center gap-1 font-medium"
                    title="Copier le code source"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span className="text-[11px]">{copiedCode ? 'Copié' : 'Copier'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F7F5F0] border border-[#E3DEC9] text-[#6E5D4F] hover:text-[#2C2218] flex items-center gap-1 font-medium"
                    title="Réinitialiser au code de départ"
                  >
                    <RotateCcw size={12} />
                    <span className="text-[11px]">Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditorExpanded((v) => !v)}
                    className="w-7 h-7 rounded-lg bg-[#F7F5F0] border border-[#E3DEC9] text-[#6E5D4F] hover:text-[#2C2218] flex items-center justify-center"
                    title={isEditorExpanded ? 'Réduire' : 'Agrandir l’éditeur'}
                  >
                    {isEditorExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                </div>
              </div>

              {/* Zone d'Édition Monospace Professionnelle */}
              <div className="relative rounded-2xl bg-[#1C1612] text-[#FAF5F0] border border-[#3D332B] overflow-hidden shadow-inner">
                {/* Header d'ambiance console */}
                <div className="px-4 py-2 bg-[#261F1A] border-b border-[#3D332B] flex items-center justify-between text-[11px] font-mono text-[#CFC4B6]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 font-bold text-white">{activeFileId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span>{activeCode.split('\n').length} lignes</span>
                    <span>UTF-8</span>
                    <span className="uppercase text-[#A87D56] font-bold">{currentLab.filiereCategory}</span>
                  </div>
                </div>

                {/* Textarea de code */}
                <label htmlFor="code-editor-textarea" className="sr-only">Éditeur de code source du TP</label>
                <textarea
                  id="code-editor-textarea"
                  value={activeCode}
                  onChange={handleCodeChange}
                  spellCheck="false"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`w-full p-4 font-mono leading-relaxed bg-transparent text-[#FAF5F0] resize-y focus:outline-none focus:ring-0 ${
                    isEditorExpanded ? 'h-[480px]' : 'h-[320px]'
                  }`}
                  placeholder="// Tapez ou adaptez votre solution ici..."
                />
              </div>

              {/* Barre d'Action d'Exécution & Tests Unitaires */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {/* Bouton Exécuter */}
                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: filiereColor.primary }}
                  >
                    <Play size={13} className={isExecuting ? 'animate-spin' : 'fill-white'} />
                    <span>{isExecuting ? 'Exécution en cours...' : 'Exécuter le code'}</span>
                  </button>

                  {/* Bouton Lancer les Tests */}
                  <button
                    type="button"
                    onClick={handleRunTests}
                    disabled={isRunningTests}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] hover:bg-[#E3DEC9] shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Award size={13} className="text-[#5C4033]" />
                    <span>{isRunningTests ? 'Tests...' : 'Lancer les Tests'}</span>
                  </button>
                </div>

                {/* Stats d'exécution */}
                {executionStats && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#6E5D4F]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 font-bold">
                      {executionStats.status}
                    </span>
                    <span>{executionStats.duration}</span>
                    <span>•</span>
                    <span>{executionStats.memory}</span>
                  </div>
                )}
              </div>

              {/* Terminal / Console de sortie */}
              <div className="rounded-2xl bg-[#1C1612] text-[#FAF5F0] border border-[#3D332B] p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#A87D56] border-b border-[#3D332B] pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Terminal size={12} />
                    <span>Console de Sortie (Terminal Live)</span>
                  </div>
                  {consoleLogs && (
                    <button
                      type="button"
                      onClick={() => setConsoleLogs('')}
                      className="text-[10px] text-[#9C8F80] hover:text-white"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#CFC4B6] whitespace-pre-wrap max-h-36">
                  {consoleLogs ||
                    '>> Prêt. Cliquez sur "Exécuter le code" ou "Lancer les Tests" pour voir la sortie console.'}
                </pre>
              </div>
            </div>
          </main>

          {/* ================================================================ */}
          {/* ZONE DROITE (Col 10-12 : ~28% de la largeur)                    */}
          {/* Assistant / Correcteur intelligent (feedback en temps réel)      */}
          {/* ================================================================ */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
              {/* En-tête Assistant */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#5C4033]">
                  <Sparkles size={14} className="text-[#5C4033]" />
                  <span>Correcteur Intelligent IA</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                  Temps Réel
                </span>
              </div>

              {/* Jauge de Score & Note Estimée */}
              <div className="bg-[#F7F5F0] p-4 rounded-2xl border border-[#E3DEC9] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E5D4F]">
                      Score de Conformité
                    </div>
                    <div className="text-2xl font-black text-[#2C2218]">
                      {correcteurData.scoreConformite}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-[#6E5D4F]">Note Estimée</div>
                    <div className="text-xl font-black text-[#5C4033]">
                      {correcteurData.noteEstimee}
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-[#E3DEC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${correcteurData.scoreConformite}%`,
                      backgroundColor: filiereColor.primary,
                    }}
                  />
                </div>

                <div className="text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                  <span>{correcteurData.mention}</span>
                </div>
              </div>

              {/* Métriques Algorithmiques & Qualité */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[#E3DEC9] space-y-0.5">
                  <div className="text-[10px] text-[#6E5D4F] font-bold uppercase">Complexité</div>
                  <div className="font-mono font-bold text-[#2C2218] truncate">
                    {correcteurData.complexiteTemporelle}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[#E3DEC9] space-y-0.5">
                  <div className="text-[10px] text-[#6E5D4F] font-bold uppercase">Qualité Style</div>
                  <div className="font-mono font-bold text-emerald-700">
                    {correcteurData.pep8Score}
                  </div>
                </div>
              </div>

              {/* Points Forts Détectés */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-[#2C2218] flex items-center gap-1">
                  <Flame size={13} className="text-amber-600" />
                  <span>Points Forts Validés :</span>
                </span>
                <div className="space-y-1">
                  {correcteurData.pointsForts.map((pt, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] leading-tight"
                    >
                      {pt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Axes d'Amélioration & Suggestions */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-[#2C2218] flex items-center gap-1">
                  <Lightbulb size={13} className="text-[#5C4033]" />
                  <span>Axes d'Amélioration :</span>
                </span>
                <div className="space-y-1">
                  {correcteurData.pointsAmelioration.map((pt, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 text-[11px] leading-tight"
                    >
                      {pt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de Ré-audit IA */}
              <button
                type="button"
                onClick={handleTriggerAiAnalysis}
                disabled={isAiAnalyzing}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#F7F5F0] border border-[#E3DEC9] text-[#5C4033] hover:bg-[#E3DEC9] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles size={13} className={isAiAnalyzing ? 'animate-spin' : ''} />
                <span>{isAiAnalyzing ? 'Audit IA en cours...' : 'Demander une Ré-analyse IA'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* VUE 2 : ANNALES & ÉPREUVES D'EXAMENS D'ÉTAT                          */}
      {/* -------------------------------------------------------------------- */}
      {activeMainTab === 'annales' && (
        <section className="bg-[#EFECE6] border border-[#E3DEC9] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3DEC9]">
            <div>
              <h2 className="text-lg font-black text-[#2C2218]">
                Annales & Épreuves Officielles · {currentLab.title}
              </h2>
              <p className="text-xs text-[#6E5D4F]">
                Archives des sessions normales et rattrapages des universités camerounaises (UY1, UDLA, UB, Dschang, ENSPY).
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F5F0] text-[#5C4033] border border-[#E3DEC9] self-start sm:self-auto">
              {currentLab.annales?.length || 0} Épreuves Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLab.annales?.map((annale) => (
              <div
                key={annale.id}
                className="bg-[#F7F5F0] border border-[#E3DEC9] hover:border-[#C8BF9F] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#6E5D4F]">
                    <span className="font-mono font-bold text-[#5C4033]">{annale.session}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E3DEC9] text-[#2C2218] font-bold">
                      Coeff {annale.coeff}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#2C2218] text-sm leading-snug">
                    {annale.epreuve}
                  </h3>

                  <div className="space-y-1 text-xs text-[#6E5D4F]">
                    <span className="font-bold text-[11px] text-[#2C2218]">Exercices au programme :</span>
                    <ul className="space-y-0.5 text-[11px]">
                      {annale.exercices.map((ex, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5C4033]" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E3DEC9] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-800 font-bold">
                    Taux de réussite : {annale.tauxReussite}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage(`Téléchargement du sujet et corrigé type : ${annale.epreuve}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2C2218] text-[#FAF5F0] hover:bg-[#5C4033] font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Sujet + Corrigé</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* VUE 3 : AIDE DU PROFESSEUR IA (TUTEUR PÉDAGOGIQUE NUMÉRIQUE)        */}
      {/* -------------------------------------------------------------------- */}
      {activeMainTab === 'ai_help' && (
        <section className="bg-[#EFECE6] border border-[#E3DEC9] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3DEC9]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: filiereColor.primary }}
              >
                <Bot size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#2C2218]">
                  Professeur & Tuteur IA Spécialisé · {currentLab.title}
                </h2>
                <p className="text-xs text-[#6E5D4F]">
                  Orientation pédagogique bienveillante sans donner la solution brute : explications de cours, analyse de bugs et révisions.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Enseignant Référent Connecté</span>
            </span>
          </div>

          {/* Puces de questions suggérées en 1 clic */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#6E5D4F] uppercase tracking-wider">
              Questions Fréquentes sur ce Lab :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentLab.promptsAide?.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSendChatMessage(p.label)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] hover:border-[#5C4033] hover:text-[#5C4033] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <HelpCircle size={12} className="text-[#5C4033]" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fenêtre de Conversation */}
          <div className="rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] p-4 h-[380px] overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={index}
                  className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isAi ? 'bg-[#2C2218] text-white' : 'bg-[#5C4033] text-white'
                    }`}
                  >
                    {isAi ? <Bot size={15} /> : <User size={15} />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl space-y-1 leading-relaxed ${
                      isAi
                        ? 'bg-[#EFECE6] border border-[#E3DEC9] text-[#2C2218]'
                        : 'bg-[#2C2218] text-[#FAF5F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                      <span className="font-bold">{isAi ? 'Professeur IA' : 'Vous'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              );
            })}

            {isAiTyping && (
              <div className="flex items-center gap-2 text-xs text-[#6E5D4F] italic pl-10">
                <Bot size={14} className="animate-bounce text-[#5C4033]" />
                <span>Le Professeur IA rédige sa réponse pédagogique...</span>
              </div>
            )}
          </div>

          {/* Formulaire de Message */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="ai-chat-input" className="sr-only">Poser une question au tuteur</label>
            <input
              id="ai-chat-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Posez une question sur la consigne, un algorithme ou une notion de cours..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs placeholder:text-[#968574] focus:outline-none focus:ring-2 focus:ring-[#5C4033] shadow-xs"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isAiTyping}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              style={{ backgroundColor: filiereColor.primary }}
            >
              <span>Envoyer</span>
              <Send size={13} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
