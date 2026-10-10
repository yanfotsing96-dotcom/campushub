import { useState, useMemo } from 'react';
import {
  Library,
  Search,
  BookOpen,
  Download,
  Eye,
  X,
  Check,
  Quote,
} from 'lucide-react';
import { HUMANITIES_RESOURCES, FALSH_DEPARTMENTS } from '../data/falshData';

export default function HumanitiesResourcesModule() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingModal, setActiveReadingModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredResources = useMemo(() => {
    return HUMANITIES_RESOURCES.filter((res) => {
      const matchDept = selectedDept === 'all' || res.departmentId === selectedDept;
      const matchCat = selectedCategory === 'all' || res.category === selectedCategory;
      const matchSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchCat && matchSearch;
    });
  }, [selectedDept, selectedCategory, searchQuery]);

  const handleCopyCitation = (res) => {
    navigator.clipboard.writeText(`${res.citationCle} (${res.title})`);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (res) => {
    const content = [
      `CAMPUSHUB FALSH · FICHE ACADÉMIQUE DE RÉFÉRENCE`,
      `Titre : ${res.title}`,
      `Auteur / Corpus : ${res.author}`,
      `Département : ${res.departmentName} (${res.level})`,
      `Catégorie : ${res.category}`,
      `============================================================`,
      ``,
      `[SYNTHÈSE DE L'ŒUVRE]`,
      res.summary,
      ``,
      `[POINTS CLÉS D'ANALYSE LITTÉRAIRE / CRITIQUE]`,
      ...res.keyPoints.map((p) => `• ${p}`),
      ``,
      `[CITATION MAÎTRESSE À RETENIR]`,
      res.citationCle,
      ``,
      `Document certifié FALSH CampusHub · Université de Yaoundé I`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `fiche_${res.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Library size={13} />
            <span>Module 4 · Banque de Savoirs & Corpus Littéraire</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Espace Partage, Fiches de Lecture & Dissertations Corrigées
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Corpus d'œuvres patrimoniales et africaines, fiches méthodologiques et annales d'examens commentées.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold">
            {HUMANITIES_RESOURCES.length} dossiers certifiés
          </span>
        </div>
      </div>

      {/* Barre de Filtres & Recherche */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        {/* Recherche */}
        <div className="md:col-span-5 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, auteur (ex: Césaire, Oyono)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Filtre par Département */}
        <div className="md:col-span-4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Tous les départements</option>
            {FALSH_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par Catégorie */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Toutes catégories</option>
            <option value="Fiche de lecture">Fiches de lecture</option>
            <option value="Commentaire corrigé">Commentaires corrigés</option>
            <option value="Dissertation corrigée">Dissertations corrigées</option>
            <option value="Mémoire & Annales">Mémoires & Annales</option>
            <option value="Rapport de recherche">Rapports de recherche</option>
          </select>
        </div>
      </div>

      {/* Grille des Ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {res.departmentName}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {res.level}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                {res.title}
              </h4>
              <p className="text-[11px] font-semibold text-indigo-400 mb-2">
                Auteur : {res.author}
              </p>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-3">
                {res.summary}
              </p>

              {/* Citation clé mise en avant */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-amber-200/90 italic font-serif leading-normal mb-2">
                {res.citationCle}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                {res.pages} • {res.downloads} téléchargements
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyCitation(res)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300"
                  title="Copier la citation"
                >
                  {copiedId === res.id ? <Check size={12} className="text-emerald-400" /> : <Quote size={12} />}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(res)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300"
                  title="Télécharger la fiche"
                >
                  <Download size={12} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReadingModal(res)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Lire</span>
                  <Eye size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
          <BookOpen size={36} className="mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold">Aucune ressource ne correspond à vos filtres.</p>
        </div>
      )}

      {/* Modal de Lecture Complète */}
      {activeReadingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                  {activeReadingModal.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeReadingModal.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeReadingModal.departmentName} · {activeReadingModal.level}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveReadingModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
              <div>
                <h5 className="font-bold text-white text-xs mb-1">Résumé & Contexte de l'Œuvre :</h5>
                <p>{activeReadingModal.summary}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-amber-400 text-xs mb-2">Axes & Clés d'Analyse Universitaire :</h5>
                <ul className="space-y-1.5">
                  {activeReadingModal.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <h5 className="font-bold text-amber-300 text-xs mb-1">Citation Maîtresse :</h5>
                <p className="italic font-serif text-amber-100 text-sm">
                  {activeReadingModal.citationCle}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                {activeReadingModal.pages} · Année {activeReadingModal.date}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(activeReadingModal)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
