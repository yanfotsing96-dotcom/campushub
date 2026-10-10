import { useState, useMemo } from 'react';
import {
  BookMarked,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  Info,
  CheckCircle2,
  Quote,
} from 'lucide-react';

const PRESET_SOURCES = [
  {
    type: 'livre',
    titre: 'Une vie de boy',
    auteurNom: 'Oyono',
    auteurPrenom: 'Ferdinand',
    annee: '1956',
    editeur: 'Éditions Julliard',
    lieu: 'Paris',
    revue: '',
    volume: '',
    pages: '',
    url: '',
  },
  {
    type: 'livre',
    titre: 'Cahier d\'un retour au pays natal',
    auteurNom: 'Césaire',
    auteurPrenom: 'Aimé',
    annee: '1939',
    editeur: 'Présence Africaine',
    lieu: 'Paris',
    revue: '',
    volume: '',
    pages: '',
    url: '',
  },
  {
    type: 'livre',
    titre: 'Essai sur la problématique philosophique dans l\'Afrique actuelle',
    auteurNom: 'Towa',
    auteurPrenom: 'Marcien',
    annee: '1971',
    editeur: 'Éditions Clé',
    lieu: 'Yaoundé',
    revue: '',
    volume: '',
    pages: '',
    url: '',
  },
  {
    type: 'article',
    titre: 'Le Camfranglais : une écologie linguistique camerounaise',
    auteurNom: 'Kouega',
    auteurPrenom: 'Jean-Paul',
    annee: '2003',
    editeur: '',
    lieu: '',
    revue: 'Revue Internationale des Sciences Humaines',
    volume: 'Vol. 14, N° 2',
    pages: '45-68',
    url: 'https://doi.org/10.1016/j.falsh.2003.04',
  },
];

export default function BibliographyGeneratorModule() {
  const [styleNorme, setStyleNorme] = useState('apa'); // 'apa' | 'mla' | 'chicago'
  const [sourceType, setSourceType] = useState('livre'); // 'livre' | 'article' | 'these'
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Formulaire courant
  const [auteurNom, setAuteurNom] = useState('Oyono');
  const [auteurPrenom, setAuteurPrenom] = useState('Ferdinand');
  const [titre, setTitre] = useState('Une vie de boy');
  const [annee, setAnnee] = useState('1956');
  const [editeur, setEditeur] = useState('Éditions Julliard');
  const [lieu, setLieu] = useState('Paris');
  const [revue, setRevue] = useState('');
  const [volume, setVolume] = useState('');
  const [pages, setPages] = useState('42');
  const [url, setUrl] = useState('');

  // Liste des références sauvegardées par l'étudiant
  const [savedReferences, setSavedReferences] = useState(PRESET_SOURCES);

  // Génération de la citation selon la norme
  const formatReference = (item, style) => {
    const { auteurNom, auteurPrenom, annee, titre, editeur, lieu, revue, volume, pages, type } = item;
    const initialPrenom = auteurPrenom ? `${auteurPrenom.charAt(0)}.` : '';

    if (style === 'apa') {
      // Norme APA 7e
      if (type === 'article') {
        return `${auteurNom}, ${initialPrenom} (${annee}). ${titre}. ${revue}, ${volume}, ${pages}.`;
      }
      return `${auteurNom}, ${initialPrenom} (${annee}). ${titre}. ${lieu ? lieu + ' : ' : ''}${editeur}.`;
    }

    if (style === 'mla') {
      // Norme MLA 9e
      if (type === 'article') {
        return `${auteurNom}, ${auteurPrenom}. « ${titre} ». ${revue}, vol. ${volume || '1'}, ${annee}, p. ${pages || '1'}.`;
      }
      return `${auteurNom}, ${auteurPrenom}. ${titre}. ${editeur}, ${annee}.`;
    }

    // Chicago 17e / ISO 690
    if (type === 'article') {
      return `${auteurNom}, ${auteurPrenom}. « ${titre} », ${revue} ${volume} (${annee}) : ${pages}.`;
    }
    return `${auteurNom}, ${auteurPrenom}. ${titre}. ${lieu} : ${editeur}, ${annee}.`;
  };

  const formatInTextCitation = (item, style, pageNum = '45') => {
    const { auteurNom, annee } = item;
    if (style === 'apa') return `(${auteurNom}, ${annee}, p. ${pageNum})`;
    if (style === 'mla') return `(${auteurNom} ${pageNum})`;
    return `(${auteurNom} ${annee} : ${pageNum})`;
  };

  // Référence active courante
  const currentItem = useMemo(() => {
    return {
      type: sourceType,
      auteurNom: auteurNom.trim() || 'Auteur',
      auteurPrenom: auteurPrenom.trim() || 'Prénom',
      titre: titre.trim() || 'Titre de l\'ouvrage',
      annee: annee.trim() || '2026',
      editeur: editeur.trim() || 'Maison d\'édition',
      lieu: lieu.trim() || 'Ville',
      revue: revue.trim(),
      volume: volume.trim(),
      pages: pages.trim(),
      url: url.trim(),
    };
  }, [sourceType, auteurNom, auteurPrenom, titre, annee, editeur, lieu, revue, volume, pages, url]);

  const activeFormattedRef = useMemo(() => {
    return formatReference(currentItem, styleNorme);
  }, [currentItem, styleNorme]);

  const activeInText = useMemo(() => {
    return formatInTextCitation(currentItem, styleNorme, pages || '35');
  }, [currentItem, styleNorme, pages]);

  const handleCopy = (text, index = 'active') => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddToList = () => {
    setSavedReferences([currentItem, ...savedReferences]);
  };

  const handleDeleteRef = (idx) => {
    setSavedReferences(savedReferences.filter((_, i) => i !== idx));
  };

  const handleExportAll = () => {
    const header = `=== BIBLIOGRAPHIE ACADÉMIQUE FALSH (NORME ${styleNorme.toUpperCase()}) ===\n\n`;
    const body = savedReferences
      .map((item, idx) => `[${idx + 1}] ${formatReference(item, styleNorme)}`)
      .join('\n\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `bibliographie_${styleNorme}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
  };

  const handleLoadPreset = (preset) => {
    setSourceType(preset.type);
    setAuteurNom(preset.auteurNom);
    setAuteurPrenom(preset.auteurPrenom);
    setTitre(preset.titre);
    setAnnee(preset.annee);
    setEditeur(preset.editeur);
    setLieu(preset.lieu);
    setRevue(preset.revue);
    setVolume(preset.volume);
    setPages(preset.pages);
    setUrl(preset.url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <BookMarked size={13} />
            <span>Module 3 · Normes Bibliographiques Universitaires</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Générateur de Citations & Bibliographie Académique
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formatez instantanément vos références de mémoire, thèse ou dissertation selon les normes APA, MLA et Chicago.
          </p>
        </div>

        {/* Choix de la Norme */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          {[
            { id: 'apa', label: 'APA (7e éd.)' },
            { id: 'mla', label: 'MLA (9e éd.)' },
            { id: 'chicago', label: 'Chicago / ISO' },
          ].map((norm) => (
            <button
              key={norm.id}
              type="button"
              onClick={() => setStyleNorme(norm.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                styleNorme === norm.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {norm.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille Formulaire + Rendu Instantané */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulaire de Saisie (7 colonnes) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Type de document :</span>
              <div className="inline-flex p-1 rounded-lg bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSourceType('livre')}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    sourceType === 'livre' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  Ouvrage / Livre
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('article')}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    sourceType === 'article' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  Article de revue
                </button>
              </div>
            </div>

            {/* Presets rapides */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400">Modèles types :</span>
              <select
                onChange={(e) => {
                  const p = PRESET_SOURCES.find((x) => x.titre === e.target.value);
                  if (p) handleLoadPreset(p);
                }}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Sélectionner...</option>
                {PRESET_SOURCES.map((p) => (
                  <option key={p.titre} value={p.titre}>
                    {p.titre} ({p.auteurNom})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champs de saisie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nom de l'auteur :</label>
              <input
                type="text"
                value={auteurNom}
                onChange={(e) => setAuteurNom(e.target.value)}
                placeholder="Ex: Césaire"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Prénom de l'auteur :</label>
              <input
                type="text"
                value={auteurPrenom}
                onChange={(e) => setAuteurPrenom(e.target.value)}
                placeholder="Ex: Aimé"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {sourceType === 'article' ? 'Titre de l\'article :' : 'Titre de l\'ouvrage :'}
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Cahier d'un retour au pays natal"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Année d'édition :</label>
              <input
                type="text"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                placeholder="Ex: 1939"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {sourceType === 'livre' ? (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Maison d'édition :</label>
                  <input
                    type="text"
                    value={editeur}
                    onChange={(e) => setEditeur(e.target.value)}
                    placeholder="Ex: Présence Africaine"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Lieu de publication :</label>
                  <input
                    type="text"
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                    placeholder="Ex: Paris"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Revue universitaire :</label>
                  <input
                    type="text"
                    value={revue}
                    onChange={(e) => setRevue(e.target.value)}
                    placeholder="Ex: Cahiers d'Études Africaines"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pages :</label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="Ex: 45-68"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleAddToList}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Ajouter à ma bibliographie</span>
            </button>
          </div>
        </div>

        {/* Panneau de Rendu Instantané & In-Text (5 colonnes) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Quote size={15} className="text-amber-400" />
              <span>Formatage Certifié ({styleNorme.toUpperCase()})</span>
            </span>

            <button
              type="button"
              onClick={() => handleCopy(activeFormattedRef, 'active')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 transition-colors"
            >
              {copiedIndex === 'active' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedIndex === 'active' ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          {/* Référence complète en bibliographie */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Référence finale (Bas de page ou fin de mémoire) :
            </span>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 font-serif text-xs text-amber-200/90 leading-relaxed break-words">
              {activeFormattedRef}
            </div>
          </div>

          {/* Citation dans le corps du texte */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Appel dans le texte (In-text citation) :
            </span>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-indigo-300 flex items-center justify-between">
              <span>{activeInText}</span>
              <button
                type="button"
                onClick={() => handleCopy(activeInText, 'in-text')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                {copiedIndex === 'in-text' ? 'Copié' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Guide des normes */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-300">
              <Info size={12} className="text-amber-400" />
              <span>Règle {styleNorme.toUpperCase()} :</span>
            </div>
            <p>
              {styleNorme === 'apa' && 'En APA, le titre de l\'ouvrage est en italique. Pour un article, seul le nom de la revue est en italique.'}
              {styleNorme === 'mla' && 'En MLA, le prénom complet de l\'auteur est mentionné et les titres d\'articles sont entre guillemets.'}
              {styleNorme === 'chicago' && 'En Chicago, la ville d\'édition précède toujours l\'éditeur avec deux-points.'}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des Références Sauvegardées */}
      {savedReferences.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Ma Bibliographie ({savedReferences.length} entrées)</span>
            </span>

            <button
              type="button"
              onClick={handleExportAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>Exporter toute la bibliographie (.txt)</span>
            </button>
          </div>

          <div className="space-y-2">
            {savedReferences.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="font-serif text-slate-300 text-xs break-words flex-1">
                  <span className="font-mono text-slate-500 mr-2">[{idx + 1}]</span>
                  {formatReference(item, styleNorme)}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(formatReference(item, styleNorme), idx)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
                    title="Copier cette référence"
                  >
                    {copiedIndex === idx ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRef(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
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
