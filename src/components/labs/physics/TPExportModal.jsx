import { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  FileText,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
} from 'lucide-react';

export default function TPExportModal({
  isOpen,
  onClose,
  moduleData,
  currentParams = {},
  computedResults = {},
}) {
  const [studentName, setStudentName] = useState('Étudiant CampusHub');
  const [matricule, setMatricule] = useState('23U1098');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [institution, setInstitution] = useState('Faculté des Sciences / École Polytechnique');
  const [customObservations, setCustomObservations] = useState(
    'Les résultats obtenus corroborent fidèlement les prédictions du modèle théorique avec un accord satisfaisant aux bornes physiques.'
  );
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'raw'

  // Génération du contenu textuel Markdown propre et structuré
  const markdownContent = useMemo(() => {
    if (!moduleData) return '';

    const today = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines = [];

    lines.push(`# RÉPUBLIQUE DU CAMEROUN`);
    lines.push(`**Paix - Travail - Patrie**`);
    lines.push(`*MINESUP · ${institution}*`);
    lines.push(`*Département de Physique · Année Académique : ${academicYear}*`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`# COMPTE-RENDU DE TRAVAUX PRATIQUES`);
    lines.push(`## ${moduleData.code} : ${moduleData.title.toUpperCase()}`);
    lines.push(``);
    lines.push(`- **Étudiant(e)** : ${studentName}`);
    lines.push(`- **Matricule** : ${matricule}`);
    lines.push(`- **Niveau** : ${moduleData.levelLabel}`);
    lines.push(`- **Date de la manipulation** : ${today}`);
    lines.push(`- **Plateforme de simulation** : CampusHub PhysicsLab Hub`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`### I. OBJECTIF & CADRE THÉORIQUE`);
    lines.push(``);
    lines.push(`${moduleData.description}`);
    lines.push(``);
    lines.push(`- **Loi fondamentale régissante** : ${moduleData.keyLaw}`);
    lines.push(`- **Formulation mathématique principale** : \`${moduleData.formula}\``);
    if (moduleData.expandedFormula) {
      lines.push(`- **Équation développée / aux dérivées partielles** : \`${moduleData.expandedFormula}\``);
    }
    lines.push(``);
    lines.push(`**Objectifs pédagogiques visés :**`);
    if (moduleData.learningOutcomes && moduleData.learningOutcomes.length > 0) {
      moduleData.learningOutcomes.forEach((outcome, idx) => {
        lines.push(`${idx + 1}. ${outcome}`);
      });
    }
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`### II. CONDITIONS EXPÉRIMENTALES & PARAMÈTRES D'ENTRÉE`);
    lines.push(``);
    lines.push(`| Paramètre Physique | Symbole | Valeur Fixée | Unité SI / Pratique |`);
    lines.push(`| :--- | :---: | :---: | :--- |`);

    // Paramètres actuels
    Object.entries(currentParams).forEach(([key, val]) => {
      const displayKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      let unit = '';
      if (key.includes('mass')) unit = 'kg';
      else if (key.includes('v0')) unit = 'm/s';
      else if (key.includes('angle') || key.includes('theta')) unit = 'degrés (°)';
      else if (key.includes('h0')) unit = 'm';
      else if (key.includes('gravity')) unit = 'm/s²';
      else if (key.includes('resistance')) unit = 'Ω (Ohms)';
      else if (key.includes('inductance')) unit = 'H (Henry)';
      else if (key.includes('capacitance')) unit = 'µF';
      else if (key.includes('frequency')) unit = 'Hz';
      else if (key.includes('temp')) unit = 'K (Kelvin)';
      else if (key.includes('wavelength')) unit = 'nm';
      else if (key.includes('energy')) unit = 'eV';
      else if (key.includes('width')) unit = 'nm';

      lines.push(`| ${displayKey} | \`${key}\` | ${val} | ${unit || '-'} |`);
    });

    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`### III. RÉSULTATS NUMÉRIQUES & CARACTÉRISTIQUES CALCULÉES`);
    lines.push(``);
    lines.push(`| Grandeur Caractéristique | Valeur Obtenue | Unité | Interprétation Physique |`);
    lines.push(`| :--- | :---: | :---: | :--- |`);

    Object.entries(computedResults).forEach(([label, info]) => {
      const valStr = typeof info === 'object' ? `${info.val}` : `${info}`;
      const unitStr = typeof info === 'object' && info.unit ? info.unit : '';
      const commentStr = typeof info === 'object' && info.comment ? info.comment : 'Conforme au modèle';
      lines.push(`| ${label} | **${valStr}** | ${unitStr} | ${commentStr} |`);
    });

    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`### IV. ANALYSE PHYSIQUE & COMMENTAIRES DE L'ÉTUDIANT`);
    lines.push(``);
    lines.push(`${customObservations}`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`### V. CONCLUSION & VALIDATION ACADÉMIQUE`);
    lines.push(``);
    lines.push(
      `Ce travail pratique confirme la cohérence rigoureuse entre la formalisation analytique et les comportements numériques mesurés dans l'environnement CampusHub PhysicsLab. Document certifié pour intégration au rapport d'évaluation semestrielle.`
    );
    lines.push(``);
    lines.push(`*Généré automatiquement par CampusHub Virtual Laboratory · Export UTF-8 conforme.*`);

    return lines.join('\n');
  }, [
    moduleData,
    currentParams,
    computedResults,
    studentName,
    matricule,
    academicYear,
    institution,
    customObservations,
  ]);

  if (!isOpen || !moduleData) return null;

  // Téléchargement via Blob UTF-8 propre
  const handleDownload = () => {
    try {
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      const cleanDate = new Date().toISOString().slice(0, 10);
      downloadLink.href = url;
      downloadLink.download = `CR_TP_${moduleData.code}_${cleanDate}.md`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement du rapport :', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Échec de la copie :', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête du Modal */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="tp-modal-title" className="text-base sm:text-lg font-bold text-white">
                  Exportation de Compte-Rendu de TP
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {moduleData.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Génération propre en Markdown (UTF-8) avec données expérimentales certifiées.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps avec configuration & prévisualisation */}
        <div className="p-5 overflow-y-auto space-y-5 text-left text-xs">
          {/* Métadonnées de l'étudiant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <User size={12} className="text-indigo-400" />
                <span>Nom de l'étudiant</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <GraduationCap size={12} className="text-violet-400" />
                <span>Matricule / ID</span>
              </label>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Calendar size={12} className="text-indigo-400" />
                <span>Année Académique</span>
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <BookOpen size={12} className="text-violet-400" />
                <span>Établissement</span>
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white truncate focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Saisie d'observations personnalisées */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span>Observations et analyse personnelle (inclus dans la section IV du rapport) :</span>
            </label>
            <textarea
              rows={3}
              value={customObservations}
              onChange={(e) => setCustomObservations(e.target.value)}
              placeholder="Saisissez ici vos constats physiques sur les écarts, temps de réponse ou limites de résonance..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Sélecteur de mode de vue */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Aperçu Document Structuré
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Code Markdown Brut (.md)
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
              Encodage UTF-8 certifié sans balise parasite
            </div>
          </div>

          {/* Affichage du document */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed select-text whitespace-pre-wrap">
            {markdownContent}
          </div>
        </div>

        {/* Pied de page d'actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier le Texte'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Download size={15} />
              <span>Télécharger le Rapport (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
