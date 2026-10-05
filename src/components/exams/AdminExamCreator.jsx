import { useState, useMemo } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  Timer,
  Layers,
  Calendar,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';
import { examService } from '../../services/examService';
import { useAuth } from '../../hooks/useAuth';

export default function AdminExamCreator({ onExamCreated }) {
  const { user } = useAuth();
  const [exams, setExams] = useState(() => examService.getAllExams());
  const [activeView, setActiveView] = useState('list'); // 'list' | 'create'
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedExamSubmissions, setSelectedExamSubmissions] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState(() => ({
    titre: '',
    codeUe: 'INF201',
    filiereId: 'Informatique',
    niveau: 'L2',
    durationMinutes: 20,
    status: 'actif', // 'brouillon' | 'actif' | 'termine'
    dateDebut: new Date().toISOString().slice(0, 16),
    dateFin: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    professor: user?.fullName || user?.nom || 'Dr. T. Mbarga',
    description: 'Contrôle continu en ligne sous surveillance chronométrée.',
  }));

  // Dynamic Questions Builder
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      text: 'Quelle est la complexité asymptotique de recherche dans un Arbre Binaire Équilibré AVL à n nœuds ?',
      type: 'single',
      points: 5,
      options: [
        { id: 'opt_a', label: 'O(1)' },
        { id: 'opt_b', label: 'O(log n)' },
        { id: 'opt_c', label: 'O(n)' },
        { id: 'opt_d', label: 'O(n^2)' },
      ],
      correctOptionId: 'opt_b',
      explanation: 'La hauteur d\'un arbre AVL est strictement bornée par 1.44 * log2(n), garantissant une recherche en O(log n).',
    },
    {
      id: 'q2',
      text: 'Expliquez la différence fondamentale entre un processus UNIX créé via fork() et un thread POSIX créé via pthread_create().',
      type: 'development',
      points: 5,
      explanation: 'Un processus possède son propre espace d\'adressage virtuel isolé, tandis que les threads partagent le même espace mémoire et les mêmes descripteurs de fichiers.',
    },
  ]);

  const refreshExams = () => {
    setExams(examService.getAllExams());
  };

  const handleToggleStatus = (examId, targetStatus) => {
    examService.toggleExamStatus(examId, targetStatus);
    refreshExams();
    if (onExamCreated) onExamCreated();
    setFeedback({
      type: 'success',
      message: `Statut mis à jour : L'épreuve est désormais ${targetStatus.toUpperCase()}.`,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette composition ?')) {
      examService.deleteExam(examId);
      refreshExams();
      if (onExamCreated) onExamCreated();
      setFeedback({
        type: 'success',
        message: 'Composition supprimée avec succès.',
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const totalPointsCalculated = useMemo(() => {
    return questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  }, [questions]);

  // Question manipulation
  const handleAddQuestion = (type = 'single') => {
    const nextIdx = questions.length + 1;
    const newQ = {
      id: 'q_' + Date.now(),
      text: type === 'single' ? `Nouvelle question QCM ${nextIdx} :` : `Question à développement ${nextIdx} :`,
      type,
      points: 5,
      options:
        type === 'single'
          ? [
              { id: 'opt_a', label: 'Option A (Correcte)' },
              { id: 'opt_b', label: 'Option B' },
              { id: 'opt_c', label: 'Option C' },
            ]
          : [],
      correctOptionId: type === 'single' ? 'opt_a' : '',
      explanation: 'Critères et explication de correction.',
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      setFeedback({ type: 'error', message: 'Une épreuve doit comporter au moins une question.' });
      setTimeout(() => setFeedback(null), 3500);
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleOptionChange = (qIdx, optIdx, newLabel) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      const opts = [...q.options];
      opts[optIdx] = { ...opts[optIdx], label: newLabel };
      q.options = opts;
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleAddOption = (qIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      const nextLetter = String.fromCharCode(65 + q.options.length);
      const newOptId = 'opt_' + nextLetter.toLowerCase();
      q.options = [...q.options, { id: newOptId, label: `Option ${nextLetter}` }];
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleRemoveOption = (qIdx, optId) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      if (q.options.length <= 2) {
        setFeedback({ type: 'error', message: 'Un QCM requiert au moins 2 options.' });
        setTimeout(() => setFeedback(null), 3500);
        return prev;
      }
      q.options = q.options.filter((o) => o.id !== optId);
      if (q.correctOptionId === optId && q.options.length > 0) {
        q.correctOptionId = q.options[0].id;
      }
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    if (questions.length === 0) {
      setFeedback({ type: 'error', message: 'Veuillez ajouter au moins une question.' });
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    try {
      examService.createExam(
        {
          ...formData,
          questions,
          totalPoints: totalPointsCalculated,
        },
        user
      );

      refreshExams();
      if (onExamCreated) onExamCreated();

      setFeedback({
        type: 'success',
        message: `L'épreuve "${formData.titre}" a été enregistrée avec succès sous le statut [${formData.status.toUpperCase()}].`,
      });

      setActiveView('list');
      // Reset form
      setFormData({
        titre: '',
        codeUe: 'INF201',
        filiereId: 'Informatique',
        niveau: 'L2',
        durationMinutes: 20,
        status: 'actif',
        dateDebut: new Date().toISOString().slice(0, 16),
        dateFin: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
        professor: user?.fullName || user?.nom || 'Dr. T. Mbarga',
        description: 'Contrôle continu en ligne sous surveillance chronométrée.',
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Erreur lors de la création : ' + err.message });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Filtered exams for list view
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchFiliere = filterFiliere === 'all' || (e.filiereId || '').toLowerCase() === filterFiliere.toLowerCase();
      const matchStatus = filterStatus === 'all' || e.status === filterStatus || (filterStatus === 'actif' && e.status === 'active');
      return matchFiliere && matchStatus;
    });
  }, [exams, filterFiliere, filterStatus]);

  // Status stats
  const stats = useMemo(() => {
    const total = exams.length;
    const active = exams.filter((e) => e.status === 'actif' || e.status === 'active').length;
    const drafts = exams.filter((e) => e.status === 'brouillon').length;
    const closed = exams.filter((e) => e.status === 'termine').length;
    return { total, active, drafts, closed };
  }, [exams]);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-bold border transition-all animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Control Header & Mode Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <ShieldCheck size={13} />
                <span>Console d'Administration & Modération</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {user?.fullName} ({user?.roleLabel || 'Admin'})
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              Gestionnaire des Compositions en Ligne
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Créez, chronométrez et programmez les contrôles continus officiels. Contrôlez instantanément la visibilité par filière via les statuts Brouillon / Actif / Terminé.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'list'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Layers size={14} />
              <span>Toutes les épreuves ({stats.total})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('create')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'create'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
              }`}
            >
              <Plus size={14} />
              <span>Créer une épreuve</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Épreuves</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.total}</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Actives (Visibles)</span>
            </span>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">{stats.active}</div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Brouillons (Masqués)</span>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300">{stats.drafts}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Clôturées</span>
            <div className="text-xl font-black text-slate-600 dark:text-slate-400">{stats.closed}</div>
          </div>
        </div>
      </div>

      {/* VIEW 1: CREATION FORM */}
      {activeView === 'create' && (
        <form onSubmit={handleCreateSubmit} className="space-y-6 animate-in fade-in">
          {/* General Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck2 size={18} className="text-indigo-600" />
                <span>Paramètres Généraux de la Composition</span>
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                Barème total cumulé : {totalPointsCalculated} points
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Titre officiel de l'épreuve * :
                </label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="Ex : Examen Final : Architecture Logicielle & Patterns GoF"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Code UE (Unité d'Enseignement) :
                </label>
                <input
                  type="text"
                  required
                  value={formData.codeUe}
                  onChange={(e) => setFormData({ ...formData, codeUe: e.target.value.toUpperCase() })}
                  placeholder="Ex : INF201, PHY203, MAT101..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold uppercase text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Filière Académique Assignée * :
                </label>
                <select
                  value={formData.filiereId}
                  onChange={(e) => setFormData({ ...formData, filiereId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Informatique">Informatique & Génie Logiciel</option>
                  <option value="Physique">Physique & Électronique</option>
                  <option value="Chimie">Chimie & Matériaux</option>
                  <option value="Biologie">Biologie & Sciences de la Terre</option>
                  <option value="Mathématiques">Mathématiques & Modélisation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Niveau d'études * :
                </label>
                <select
                  value={formData.niveau}
                  onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="L1">Licence 1 (L1)</option>
                  <option value="L2">Licence 2 (L2)</option>
                  <option value="L3">Licence 3 (L3)</option>
                  <option value="M1">Master 1 (M1)</option>
                  <option value="M2">Master 2 (M2)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Timer size={13} className="text-indigo-600" />
                  <span>Durée de l'épreuve (en minutes) * :</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  required
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-600" />
                  <span>Date & Heure de Début :</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-600" />
                  <span>Date & Heure de Fin :</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enseignant / Examinateur responsable :
                </label>
                <input
                  type="text"
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  placeholder="Ex : Pr. Joseph Nguemo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Statut initial de gestion :
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="actif">🟢 Actif (Visible et composable par la filière)</option>
                  <option value="brouillon">🟡 Brouillon (Masqué aux étudiants)</option>
                  <option value="termine">🔴 Terminé (Clôturé)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Consignes & Descriptif :
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Directives officielles pour les étudiants..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Questions Builder Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-600" />
                  <span>Constructeur Dynamique de Questions ({questions.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ajoutez des QCM à choix multiples avec autocorrection ou des questions à développement.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('single')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100"
                >
                  <Plus size={13} />
                  <span>+ Question QCM</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddQuestion('development')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-100"
                >
                  <Plus size={13} />
                  <span>+ Question Développement</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {qIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {q.type === 'single' ? 'QCM / Choix Unique' : 'Question à Développement'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <span>Barème :</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={q.points}
                          onChange={(e) => handleQuestionChange(qIdx, 'points', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-center text-xs"
                        />
                        <span>pts</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Supprimer cette question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Énoncé de la question :</label>
                    <input
                      type="text"
                      required
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                      placeholder="Saisissez l'énoncé précis de la question..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {/* QCM Options */}
                  {q.type === 'single' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">
                          Options & Bonne Réponse (Sélectionnez le bouton radio pour la clé correcte) :
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddOption(qIdx)}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          + Ajouter une option
                        </button>
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={q.correctOptionId === opt.id}
                              onChange={() => handleQuestionChange(qIdx, 'correctOptionId', opt.id)}
                              className="text-emerald-600 focus:ring-emerald-500"
                              title="Marquer comme bonne réponse"
                            />
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                              className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-medium bg-white dark:bg-slate-900 ${
                                q.correctOptionId === opt.id
                                  ? 'border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                              }`}
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(qIdx, opt.id)}
                                className="p-1 text-slate-400 hover:text-rose-500"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation / Grading Criteria */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">
                      Explication pédagogique & critères de notation :
                    </label>
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                      placeholder="Explication affichée aux étudiants lors du corrigé officiel..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {questions.length} questions · {totalPointsCalculated} pts
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <CheckCircle2 size={16} />
                <span>Publier et Enregistrer l'Épreuve</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: LIST & MANAGEMENT TABLE */}
      {activeView === 'list' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-500">Filtrer par :</span>
              <select
                value={filterFiliere}
                onChange={(e) => setFilterFiliere(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-xs"
              >
                <option value="all">Toutes les filières</option>
                <option value="Informatique">Informatique</option>
                <option value="Physique">Physique</option>
                <option value="Chimie">Chimie</option>
                <option value="Biologie">Biologie</option>
                <option value="Mathématiques">Mathématiques</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-xs"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">🟢 Actives uniquement</option>
                <option value="brouillon">🟡 Brouillons masqués</option>
                <option value="termine">🔴 Clôturées</option>
              </select>
            </div>

            <span className="text-slate-400">
              {filteredExams.length} composition{filteredExams.length > 1 ? 's' : ''} affichée{filteredExams.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredExams.map((exam) => {
              const subs = examService.getSubmissionsForExam(exam.id);
              const isDraft = exam.status === 'brouillon';
              const isActive = exam.status === 'actif' || exam.status === 'active';
              const isClosed = exam.status === 'termine';

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-mono font-black text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {exam.codeUe}
                      </span>

                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {exam.filiereId} ({exam.niveau})
                      </span>

                      {/* Status Badges */}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Actif (En ligne)</span>
                        </span>
                      )}
                      {isDraft && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <span>Brouillon (Masqué)</span>
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <span>Terminé (Clos)</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {exam.titre}
                    </h3>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>⏱️ <strong>{exam.durationMinutes} min</strong></span>
                      <span>•</span>
                      <span>❓ <strong>{exam.questions?.length || 0} questions</strong> ({exam.totalPoints} pts)</span>
                      <span>•</span>
                      <span>👨‍🏫 {exam.professor}</span>
                      <span>•</span>
                      <span>📥 <strong>{subs.length}</strong> copie{subs.length > 1 ? 's' : ''} remise{subs.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    {/* Status Toggler */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(exam.id, 'actif')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Rendre l'examen actif pour les étudiants"
                      >
                        Actif
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(exam.id, 'brouillon')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          isDraft
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Mettre en brouillon masqué"
                      >
                        Brouillon
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(exam.id, 'termine')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          isClosed
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Clôturer l'épreuve"
                      >
                        Clos
                      </button>
                    </div>

                    {/* View Submissions */}
                    {subs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedExamSubmissions(exam)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                      >
                        <span>Copies ({subs.length})</span>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteExam(exam.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Supprimer cette épreuve"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submissions Modal for Admin */}
      {selectedExamSubmissions && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Copies Remises : {selectedExamSubmissions.titre}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {selectedExamSubmissions.codeUe} · {selectedExamSubmissions.filiereId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExamSubmissions(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {examService.getSubmissionsForExam(selectedExamSubmissions.id).map((sub) => (
                <div
                  key={sub.submissionId}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {sub.studentNom} ({sub.studentMatricule})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Remis le {new Date(sub.submittedAt).toLocaleString()} · Intégrité {sub.integrityScore}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                      {sub.score} / {sub.totalPoints} pts ({sub.percentage}%)
                    </div>
                    <span className={`text-[10px] font-bold ${sub.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sub.passed ? 'Admis' : 'Ajourné'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
