import { useState, useMemo, useCallback } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  CheckCircle2,
  X,
  GraduationCap,
  Building2,
  Layers,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  UNIVERSITIES_MOCK,
  ACADEMIC_LEVELS_MOCK,
  TEST_PRESETS,
  NATIONAL_RESOURCES_DATA,
  CATEGORIES_MOCK,
} from './nationalResourcesData';

export default function NationalResourcesSection({ initialProfile }) {
  // --------------------------------------------------------------------------
  // SYNCHRONISATION INITIALE PROFIL (React Render-Time State Adjustment)
  // --------------------------------------------------------------------------
  const initialKey = `${initialProfile?.universityId || 'UY1'}-${initialProfile?.facultyId || 'FS'}-${initialProfile?.filiereId || 'Informatique'}-${initialProfile?.niveau || 'L2'}`;
  const [prevInitialKey, setPrevInitialKey] = useState(initialKey);

  const [profile, setProfile] = useState(() => ({
    universityId: initialProfile?.universityId || 'UY1',
    facultyId: initialProfile?.facultyId || 'FS',
    filiereId: initialProfile?.filiereId || 'Informatique',
    niveau: initialProfile?.niveau || 'L2',
  }));

  if (prevInitialKey !== initialKey) {
    setPrevInitialKey(initialKey);
    setProfile({
      universityId: initialProfile?.universityId || 'UY1',
      facultyId: initialProfile?.facultyId || 'FS',
      filiereId: initialProfile?.filiereId || 'Informatique',
      niveau: initialProfile?.niveau || 'L2',
    });
  }

  // Panneau de contrôle interactif ouvert/fermé
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

  // --------------------------------------------------------------------------
  // FILTRES SECONDAIRES & RECHERCHE LOCALE (Hooks React Purs)
  // --------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUe, setSelectedUe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'downloads' | 'rating' | 'title'

  // Modal d'aperçu d'un document
  const [activePreviewResource, setActivePreviewResource] = useState(null);

  // Toast de confirmation de téléchargement
  const [toastMessage, setToastMessage] = useState(null);

  // --------------------------------------------------------------------------
  // INFOS DÉRIVÉES DU PROFIL
  // --------------------------------------------------------------------------
  const currentUniversity = useMemo(() => {
    return UNIVERSITIES_MOCK.find((u) => u.id === profile.universityId) || UNIVERSITIES_MOCK[0];
  }, [profile.universityId]);

  const currentFaculty = useMemo(() => {
    return currentUniversity.faculties.find((f) => f.id === profile.facultyId) || currentUniversity.faculties[0];
  }, [currentUniversity, profile.facultyId]);

  // Synchronisation descendante si l'utilisateur change d'université ou de faculté
  const handleUniversityChange = (univId) => {
    const univ = UNIVERSITIES_MOCK.find((u) => u.id === univId);
    if (!univ) return;
    const firstFac = univ.faculties[0];
    const firstFil = firstFac.filieres[0];
    setProfile({
      universityId: univ.id,
      facultyId: firstFac.id,
      filiereId: firstFil,
      niveau: profile.niveau,
    });
    setSelectedUe('all');
  };

  const handleFacultyChange = (facId) => {
    const fac = currentUniversity.faculties.find((f) => f.id === facId);
    if (!fac) return;
    setProfile((prev) => ({
      ...prev,
      facultyId: fac.id,
      filiereId: fac.filieres[0],
    }));
    setSelectedUe('all');
  };

  const handleFiliereChange = (filId) => {
    setProfile((prev) => ({
      ...prev,
      filiereId: filId,
    }));
    setSelectedUe('all');
  };

  const handleNiveauChange = (niv) => {
    setProfile((prev) => ({
      ...prev,
      niveau: niv,
    }));
    setSelectedUe('all');
  };

  const handleApplyPreset = (preset) => {
    setProfile({
      universityId: preset.universityId,
      facultyId: preset.facultyId,
      filiereId: preset.filiereId,
      niveau: preset.niveau,
    });
    setSelectedUe('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // --------------------------------------------------------------------------
  // FILTRAGE STRICT AUTOMATIQUE DES RESSOURCES NATIONALES
  // RÈGLE : Afficher UNIQUEMENT et EXCLUSIVEMENT les ressources qui matchent :
  // res.filiereId === profile.filiereId ET res.niveau === profile.niveau
  // --------------------------------------------------------------------------
  const strictlyScopedResources = useMemo(() => {
    return NATIONAL_RESOURCES_DATA.filter((res) => {
      const filiereMatch = res.filiereId.toLowerCase() === profile.filiereId.toLowerCase();
      const niveauMatch = res.niveau.toUpperCase() === profile.niveau.toUpperCase();
      return filiereMatch && niveauMatch;
    });
  }, [profile.filiereId, profile.niveau]);

  // Liste des UEs disponibles pour ce niveau et cette filière (pour le selecteur d'UE)
  const availableUes = useMemo(() => {
    const map = new Map();
    strictlyScopedResources.forEach((res) => {
      if (res.codeUe && !map.has(res.codeUe)) {
        map.set(res.codeUe, res.ueTitle || res.codeUe);
      }
    });
    return Array.from(map.entries()).map(([code, title]) => ({ code, title }));
  }, [strictlyScopedResources]);

  // --------------------------------------------------------------------------
  // FILTRAGE SECONDAIRE CLIENT (Recherche texte, UE, Catégorie, Tri)
  // --------------------------------------------------------------------------
  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return strictlyScopedResources
      .filter((res) => {
        // Filtre UE
        if (selectedUe !== 'all' && res.codeUe !== selectedUe) {
          return false;
        }

        // Filtre Catégorie
        if (selectedCategory !== 'all' && res.category !== selectedCategory) {
          return false;
        }

        // Recherche textuelle multi-champs
        if (query) {
          const matchTitle = res.titre.toLowerCase().includes(query);
          const matchCode = res.codeUe.toLowerCase().includes(query);
          const matchUeTitle = (res.ueTitle || '').toLowerCase().includes(query);
          const matchAuthor = (res.author || '').toLowerCase().includes(query);
          const matchDesc = (res.description || '').toLowerCase().includes(query);
          if (!matchTitle && !matchCode && !matchUeTitle && !matchAuthor && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return b.id.localeCompare(a.id);
        }
        if (sortBy === 'downloads') {
          return (b.downloads || 0) - (a.downloads || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'title') {
          return a.titre.localeCompare(b.titre);
        }
        return 0;
      });
  }, [strictlyScopedResources, selectedUe, selectedCategory, searchQuery, sortBy]);

  // Simulation de téléchargement
  const handleDownload = useCallback((res) => {
    setToastMessage(`Téléchargement certifié lancé pour "${res.titre}" (Format ${res.format}).`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C2218] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ------------------------------------------------------------------ */}
        {/* EN-TÊTE DE LA SECTION RESSOURCES NATIONALES */}
        {/* ------------------------------------------------------------------ */}
        <header className="border-b border-[#E3DEC9] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033] shadow-xs">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C2218]">
                  Ressources Nationales
                </h1>
                <p className="text-xs sm:text-sm text-[#6E5D4F]">
                  Catalogue académique officiel cloisonné strictement selon le cursus de l'étudiant
                </p>
              </div>
            </div>
          </div>

          {/* Badge Profil Actif Synthétique */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5C4033] bg-[#EFECE6] border border-[#E3DEC9] rounded-xl px-4 py-2.5 shadow-xs">
            <span className="font-semibold text-[#2C2218]">{currentUniversity.name}</span>
            <span className="text-[#AFA28F]">/</span>
            <span>{currentFaculty.name.split('(')[0].trim()}</span>
            <span className="text-[#AFA28F]">/</span>
            <span className="font-bold underline decoration-[#5C4033]/40 underline-offset-4 text-[#5C4033]">
              {profile.filiereId}
            </span>
            <span className="text-[#AFA28F]">/</span>
            <span className="font-extrabold bg-[#5C4033] text-[#F7F5F0] px-2 py-0.5 rounded-md text-[11px]">
              {profile.niveau}
            </span>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* PANNEAU DE CONTRÔLE ET TESTS INTERACTIFS EN DIRECT */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-[#5C4033]" />
              <h2 className="text-sm sm:text-base font-bold text-[#2C2218]">
                Contrôleur de Profil Étudiant (Tests Front-End Interactifs)
              </h2>
              <span className="text-xs bg-[#E3DEC9] text-[#5C4033] font-semibold px-2 py-0.5 rounded-md">
                Simulation Live
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="text-xs font-semibold text-[#5C4033] hover:text-[#2C2218] flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-[#E3DEC9]/50"
            >
              {isControlPanelOpen ? 'Masquer les contrôles' : 'Afficher les contrôles'}
              {isControlPanelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isControlPanelOpen && (
            <div className="space-y-4 pt-1">
              <p className="text-xs text-[#6E5D4F]">
                Modifiez ci-dessous l'Université, la Faculté, la Filière et le Niveau exact en direct.
                Le filtrage strict ré-affiche instantanément et exclusivement les UEs et documents correspondants.
              </p>

              {/* Raccourcis de Test Préréglés (Presets) */}
              <div>
                <span className="text-[11px] font-bold text-[#6E5D4F] uppercase tracking-wider block mb-2">
                  Préréglages Rapides (1 Clic) :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TEST_PRESETS.map((preset) => {
                    const isSelected =
                      profile.universityId === preset.universityId &&
                      profile.facultyId === preset.facultyId &&
                      profile.filiereId === preset.filiereId &&
                      profile.niveau === preset.niveau;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? 'bg-[#5C4033] text-white border-[#5C4033] shadow-xs'
                            : 'bg-[#F7F5F0] text-[#2C2218] border-[#E3DEC9] hover:bg-[#E3DEC9]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sélecteurs de Profil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#E3DEC9]">
                {/* 1. Université */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] uppercase mb-1">
                    1. Université d'État
                  </label>
                  <select
                    value={profile.universityId}
                    onChange={(e) => handleUniversityChange(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl p-2.5 focus:outline-hidden focus:border-[#5C4033] font-medium"
                  >
                    {UNIVERSITIES_MOCK.map((univ) => (
                      <option key={univ.id} value={univ.id}>
                        {univ.name} ({univ.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Faculté / Grande École */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] uppercase mb-1">
                    2. Faculté / École
                  </label>
                  <select
                    value={profile.facultyId}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl p-2.5 focus:outline-hidden focus:border-[#5C4033] font-medium"
                  >
                    {currentUniversity.faculties.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Filière */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] uppercase mb-1">
                    3. Filière Dédiée
                  </label>
                  <select
                    value={profile.filiereId}
                    onChange={(e) => handleFiliereChange(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl p-2.5 focus:outline-hidden focus:border-[#5C4033] font-medium"
                  >
                    {currentFaculty.filieres.map((fil) => (
                      <option key={fil} value={fil}>
                        {fil}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Niveau Exact */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] uppercase mb-1">
                    4. Niveau d'Études Exact
                  </label>
                  <select
                    value={profile.niveau}
                    onChange={(e) => handleNiveauChange(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl p-2.5 focus:outline-hidden focus:border-[#5C4033] font-bold text-[#5C4033]"
                  >
                    {ACADEMIC_LEVELS_MOCK.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* BANDEAU DES MÉTRIQUES DU SCOPE STRICT */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-extrabold tabular-nums text-[#2C2218]">
                {strictlyScopedResources.length}
              </div>
              <div className="text-[11px] font-medium text-[#6E5D4F]">Ressources du Scope</div>
            </div>
          </div>

          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-extrabold tabular-nums text-[#2C2218]">
                {availableUes.length}
              </div>
              <div className="text-[11px] font-medium text-[#6E5D4F]">Unités d'Enseignement (UE)</div>
            </div>
          </div>

          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#5C4033] truncate">
                {profile.filiereId}
              </div>
              <div className="text-[11px] font-medium text-[#6E5D4F]">Filière Cloisonnée</div>
            </div>
          </div>

          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#2C2218] truncate">
                {profile.niveau} · {currentUniversity.shortName.split(' ')[0]}
              </div>
              <div className="text-[11px] font-medium text-[#6E5D4F]">Niveau & Pôle</div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BARRE DE RECHERCHE ET FILTRES CLIENTS DYNAMIQUES */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Barre de Recherche */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E5D4F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Rechercher un cours, TD, épreuve dans ${profile.filiereId} ${profile.niveau}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] placeholder-[#AFA28F] text-xs rounded-xl focus:outline-hidden focus:border-[#5C4033] transition-colors font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E5D4F] hover:text-[#2C2218]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sélecteur d'UE Spécifique au Scope */}
            <div className="w-full md:w-56">
              <select
                value={selectedUe}
                onChange={(e) => setSelectedUe(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl focus:outline-hidden focus:border-[#5C4033] font-medium"
              >
                <option value="all">Toutes les UEs ({availableUes.length})</option>
                {availableUes.map(({ code, title }) => (
                  <option key={code} value={code}>
                    {code} - {title.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur de Tri */}
            <div className="w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F7F5F0] border border-[#E3DEC9] text-[#2C2218] text-xs rounded-xl focus:outline-hidden focus:border-[#5C4033] font-medium"
              >
                <option value="recent">Plus récents</option>
                <option value="downloads">Plus téléchargés</option>
                <option value="rating">Mieux notés</option>
                <option value="title">Ordre alphabétique</option>
              </select>
            </div>
          </div>

          {/* Onglets de Catégories de Documents */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            {CATEGORIES_MOCK.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#5C4033] text-white shadow-2xs font-semibold'
                      : 'bg-[#F7F5F0] text-[#6E5D4F] hover:text-[#2C2218] border border-[#E3DEC9] hover:bg-[#E3DEC9]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* LISTE DES CARTES DES RESSOURCES OU ÉTAT VIDE ROBUSTE */}
        {/* ------------------------------------------------------------------ */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => (
              <article
                key={res.id}
                className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#C2B696] transition-all"
              >
                <div>
                  {/* Ligne En-tête : Code UE + Format */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-[#5C4033] bg-[#E3DEC9] px-2 py-0.5 rounded-md">
                      {res.codeUe}
                    </span>
                    <span className="text-[11px] font-bold text-[#6E5D4F] uppercase">
                      {res.category === 'COURS' ? '📖 Cours' : res.category === 'TD' ? '🧪 TD / TP' : res.category === 'EXAMEN' ? '📝 Épreuve' : '💡 Fiche'}
                    </span>
                  </div>

                  {/* Titre du document */}
                  <h3 className="text-sm font-bold text-[#2C2218] line-clamp-2 mb-2 leading-snug">
                    {res.titre}
                  </h3>

                  {/* Libellé UE */}
                  {res.ueTitle && (
                    <p className="text-xs text-[#5C4033] font-medium mb-3 line-clamp-1">
                      UE : {res.ueTitle}
                    </p>
                  )}

                  {/* Métadonnées Découplées sans pilules (Discipline Anti-Slop) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#6E5D4F] mb-4">
                    <span>{res.filiereId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-[#5C4033]">{res.niveau}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.pages} pages</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.fileSize}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-semibold text-[#3D6B42]">
                      ★ {res.rating}
                    </span>
                  </div>

                  {/* Description succincte */}
                  {res.description && (
                    <p className="text-xs text-[#6E5D4F] line-clamp-2 mb-4 leading-relaxed bg-[#F7F5F0] p-2.5 rounded-xl border border-[#E3DEC9]/60">
                      {res.description}
                    </p>
                  )}
                </div>

                {/* Pied de Carte : Auteur + Actions */}
                <div className="pt-3 border-t border-[#E3DEC9] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#6E5D4F] truncate max-w-[150px]">
                    {res.author}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActivePreviewResource(res)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E3DEC9] bg-[#F7F5F0] text-[#5C4033] hover:bg-[#E3DEC9] font-medium flex items-center gap-1 transition-colors"
                      title="Consulter les détails du document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(res)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#5C4033] text-white hover:bg-[#442814] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                      title="Télécharger le document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{res.format}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ------------------------------------------------------------------ */
          /* ÉTAT ROBUSTE "AUCUN RÉSULTAT TROUVÉ" DANS LES TONS BEIGE           */
          /* ------------------------------------------------------------------ */
          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] flex items-center justify-center text-[#5C4033] mb-4 shadow-xs">
              <FileText className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-[#2C2218] mb-2">
              Aucune ressource répertoriée dans ce périmètre
            </h3>

            <p className="text-xs sm:text-sm text-[#6E5D4F] max-w-md mx-auto mb-6 leading-relaxed">
              Le cloisonnement académique strict n'a identifié aucun document pour la filière{' '}
              <strong className="text-[#5C4033]">{profile.filiereId}</strong> au niveau{' '}
              <strong className="text-[#5C4033]">{profile.niveau}</strong> avec les filtres sélectionnés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {(searchQuery || selectedUe !== 'all' || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedUe('all');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5C4033] text-white text-xs font-semibold hover:bg-[#442814] transition-colors shadow-xs"
                >
                  Réinitialiser les filtres de recherche
                </button>
              )}

              <button
                type="button"
                onClick={() => handleApplyPreset(TEST_PRESETS[0])}
                className="px-4 py-2 rounded-xl bg-[#F7F5F0] border border-[#E3DEC9] text-[#5C4033] text-xs font-semibold hover:bg-[#E3DEC9] transition-colors"
              >
                Tester avec UY1 · Informatique L2
              </button>
            </div>
          </div>
        )}

      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL D'APERÇU DU DOCUMENT SÉLECTIONNÉ                                */}
      {/* -------------------------------------------------------------------- */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2218]/40 backdrop-blur-xs">
          <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl max-w-xl w-full p-6 shadow-xl relative space-y-4">
            <button
              type="button"
              onClick={() => setActivePreviewResource(null)}
              className="absolute right-4 top-4 text-[#6E5D4F] hover:text-[#2C2218] p-1 rounded-lg hover:bg-[#E3DEC9]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#5C4033] bg-[#E3DEC9] px-2 py-0.5 rounded-md">
                {activePreviewResource.codeUe}
              </span>
              <span className="text-xs font-semibold text-[#6E5D4F]">
                {activePreviewResource.ueTitle}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#2C2218]">
              {activePreviewResource.titre}
            </h3>

            <div className="bg-[#F7F5F0] border border-[#E3DEC9] rounded-xl p-3.5 space-y-2 text-xs text-[#6E5D4F]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#AFA28F] block">Filière & Niveau</span>
                  <span className="font-semibold text-[#2C2218]">{activePreviewResource.filiereId} ({activePreviewResource.niveau})</span>
                </div>
                <div>
                  <span className="text-[#AFA28F] block">Année & Session</span>
                  <span className="font-semibold text-[#2C2218]">{activePreviewResource.year} · {activePreviewResource.semester}</span>
                </div>
                <div>
                  <span className="text-[#AFA28F] block">Volume & Format</span>
                  <span className="font-semibold text-[#2C2218]">{activePreviewResource.pages} pages · {activePreviewResource.format} ({activePreviewResource.fileSize})</span>
                </div>
                <div>
                  <span className="text-[#AFA28F] block">Enseignant / Auteur</span>
                  <span className="font-semibold text-[#2C2218]">{activePreviewResource.author}</span>
                </div>
              </div>

              {activePreviewResource.description && (
                <div className="pt-2 border-t border-[#E3DEC9]">
                  <span className="text-[#AFA28F] block mb-1">Résumé pédagogique</span>
                  <p className="text-[#2C2218]">{activePreviewResource.description}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActivePreviewResource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E5D4F] hover:bg-[#E3DEC9]"
              >
                Fermer
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownload(activePreviewResource);
                  setActivePreviewResource(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5C4033] text-white hover:bg-[#442814] flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger le {activePreviewResource.format}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TOAST FLOTTANT DE FEEDBACK                                          */}
      {/* -------------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5C4033] text-white px-4 py-3 rounded-xl shadow-lg border border-[#442814] flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C2B696] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
