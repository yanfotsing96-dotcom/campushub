import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Filter,
  Copy,
  Check,
  HelpCircle,
  Hash,
  School,
  Atom,
} from 'lucide-react';
import { LAB_02_METADATA, LAB_02_FILIERES } from '../../data/labs/lab02Data';

/**
 * Composant d'affichage officiel du Lab L02 - Physique
 * Respecte rigoureusement la palette beige (#F7F5F0, #EFECE6, #E3DEC9, accents #5C4033)
 * et le repérage officiel des 14 filières MINESUP (Pages 2 et 3) avec numéros de page du dossier.
 */
export default function Lab02PhysicsView({ onNavigateToSimulator }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'FS' | 'ENS'
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedFiliere, setSelectedFiliere] = useState(LAB_02_FILIERES[0]); // Par défaut UY1 FS
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Liste unique des régions
  const regions = useMemo(() => {
    const list = Array.from(new Set(LAB_02_FILIERES.map((f) => f.region)));
    return ['ALL', ...list];
  }, []);

  // Filtrage dynamique des 14 filières
  const filteredFilieres = useMemo(() => {
    return LAB_02_FILIERES.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.universite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sigleUniversite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.faculte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pageDossier.toString().includes(searchQuery.trim());

      const matchType =
        selectedType === 'ALL' ||
        (selectedType === 'FS' && (item.faculteSigle === 'FS' || item.faculteSigle === 'Faculty of Science')) ||
        (selectedType === 'ENS' && (item.faculteSigle === 'ENS' || item.faculteSigle === 'HTTC'));

      const matchRegion = selectedRegion === 'ALL' || item.region === selectedRegion;

      return matchSearch && matchType && matchRegion;
    });
  }, [searchQuery, selectedType, selectedRegion]);

  const handleCopyRef = (item) => {
    const text = `${item.sigleUniversite} - ${item.faculte} (Page ${item.pageDossier})`;
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDetails = (item) => {
    setSelectedFiliere(item);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Bannière d'en-tête officielle Lab L02 (Thème Beige & Chocolat) */}
      <div className="rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#5C4033] text-white tracking-wider uppercase shadow-xs">
                {LAB_02_METADATA.code} • MINESUP
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]/60 flex items-center gap-1.5">
                <BookOpen size={13} className="text-[#5C4033]" />
                {LAB_02_METADATA.domain}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                {LAB_02_METADATA.totalFilieres} Filières Répertoriées (UY1 à UEb)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600/10 border border-sky-300/40 flex items-center justify-center text-sky-700">
                <Atom size={22} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2218] tracking-tight">
                {LAB_02_METADATA.title}
              </h2>
            </div>

            <p className="text-sm text-[#6E5D4F] max-w-3xl leading-relaxed">
              {LAB_02_METADATA.description}
            </p>
          </div>

          {/* Statistiques rapides & Accès rapide */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-center min-w-[100px]">
              <div className="text-2xl font-black text-[#5C4033]">14</div>
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">Établissements</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-center min-w-[100px]">
              <div className="text-2xl font-black text-[#0284C7]">10</div>
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">Régions Couvertes</div>
            </div>
            {onNavigateToSimulator && (
              <button
                type="button"
                onClick={onNavigateToSimulator}
                className="px-4 py-3 rounded-2xl bg-[#5C4033] hover:bg-[#4A3328] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Bancs de Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barre de Recherche & Filtres ergonomiques */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Champ recherche */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7355]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par université (ex: UY1, Ngaoundéré), faculté, ville ou page (ex: 27)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E3DEC9] text-sm text-[#2C2218] placeholder-[#A89F91] focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20 focus:border-[#5C4033] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7355] hover:text-[#5C4033]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtre Type (Faculté vs ENS) */}
          <div className="inline-flex p-1 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'ALL'
                  ? 'bg-[#5C4033] text-white shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2C2218]'
              }`}
            >
              Toutes (14)
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('FS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'FS'
                  ? 'bg-[#5C4033] text-white shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2C2218]'
              }`}
            >
              Facultés (FS)
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('ENS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'ENS'
                  ? 'bg-[#5C4033] text-white shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2C2218]'
              }`}
            >
              Écoles (ENS/HTTC)
            </button>
          </div>
        </div>

        {/* Filtre par Région */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#E3DEC9]/60 text-xs">
          <span className="text-[#8C7355] font-bold flex items-center gap-1 shrink-0">
            <Filter size={12} />
            Région :
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-[#E3DEC9] text-[#2C2218] border border-[#5C4033]/30 font-bold'
                  : 'bg-white/80 text-[#6E5D4F] border border-[#E3DEC9] hover:bg-white'
              }`}
            >
              {reg === 'ALL' ? 'Toutes les régions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des 14 Filières */}
      {filteredFilieres.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#F7F5F0] border border-dashed border-[#E3DEC9] space-y-3">
          <HelpCircle size={36} className="mx-auto text-[#8C7355]" />
          <h3 className="text-base font-bold text-[#2C2218]">Aucune filière trouvée</h3>
          <p className="text-xs text-[#6E5D4F] max-w-sm mx-auto">
            Aucun établissement ne correspond à votre filtre "{searchQuery}". Essayez avec un autre sigle (ex: UY1, Ngaoundéré, Bertoua).
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedRegion('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-[#5C4033] text-white text-xs font-bold hover:bg-[#4A3328]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFilieres.map((item) => {
            const isENS = item.faculteSigle === 'ENS' || item.faculteSigle === 'HTTC';
            return (
              <div
                key={item.id}
                onClick={() => openDetails(item)}
                className="group relative cursor-pointer p-5 rounded-2xl bg-[#F7F5F0] hover:bg-[#EFECE6] border border-[#E3DEC9] hover:border-[#5C4033]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Badge en-tête Université & Dossier */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3] flex items-center gap-1.5">
                      <School size={12} />
                      {item.sigleUniversite}
                    </span>

                    {/* Badge Page Dossier officiel */}
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1 shadow-2xs">
                        <Hash size={11} className="text-sky-800" />
                        Page {item.pageDossier}
                      </span>
                    </div>
                  </div>

                  {/* Titre & Faculté */}
                  <div className="space-y-1 mb-3">
                    <h4 className="text-base font-black text-[#2C2218] group-hover:text-[#5C4033] transition-colors leading-snug">
                      {item.universite}
                    </h4>
                    <p className={`text-xs font-bold ${isENS ? 'text-sky-800' : 'text-[#5C4033]'}`}>
                      {item.faculte}
                    </p>
                  </div>

                  {/* Localisation & Diplômes */}
                  <div className="space-y-1.5 text-xs text-[#6E5D4F] mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#8C7355] shrink-0" />
                      <span>{item.ville} ({item.region})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={12} className="text-[#8C7355] shrink-0" />
                      <span className="truncate">{item.diplomes.slice(0, 2).join(' • ')}</span>
                    </div>
                  </div>
                </div>

                {/* Pied de carte avec action */}
                <div className="pt-3 border-t border-[#E3DEC9] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#8C7355] group-hover:text-[#5C4033] flex items-center gap-1">
                    Voir détails & fiche
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyRef(item);
                    }}
                    title="Copier la référence officielle"
                    className="p-1.5 rounded-lg text-[#8C7355] hover:text-[#5C4033] hover:bg-white transition-colors"
                  >
                    {copiedId === item.id ? (
                      <Check size={13} className="text-emerald-700" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Fiche détaillée de la Filière */}
      {showModal && selectedFiliere && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto text-left">
            {/* Bouton fermeture */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8C7355] hover:text-[#2C2218] hover:bg-[#EFECE6] transition-all"
            >
              <X size={18} />
            </button>

            {/* En-tête Modal */}
            <div className="space-y-2 mb-6 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#5C4033] text-white">
                  {selectedFiliere.sigleUniversite}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1">
                  <Hash size={12} />
                  Page {selectedFiliere.pageDossier} du Dossier Officiel
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E3DEC9] text-[#5C4033]">
                  {selectedFiliere.region}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#2C2218]">
                {selectedFiliere.universite}
              </h3>
              <p className="text-sm font-bold text-[#5C4033]">
                {selectedFiliere.faculte}
              </p>
            </div>

            {/* Contenu Fiche */}
            <div className="space-y-5">
              {/* Encadré Page Dossier */}
              <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5C4033] text-white flex items-center justify-center font-black text-sm shrink-0">
                    p.{selectedFiliere.pageDossier}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2C2218]">
                      Page officielle dans le recueil d'inscription CampusHub
                    </div>
                    <div className="text-[11px] text-[#6E5D4F]">
                      Référence certifiée conforme au document officiel MINESUP
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyRef(selectedFiliere)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#5C4033] text-xs font-bold text-[#5C4033] flex items-center gap-1.5 transition-all shrink-0"
                >
                  {copiedId === selectedFiliere.id ? (
                    <>
                      <Check size={12} className="text-emerald-700" />
                      <span>Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copier réf.</span>
                    </>
                  )}
                </button>
              </div>

              {/* Diplômes */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#5C4033]" />
                  Diplômes & Cursus Préparés
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedFiliere.diplomes.map((dip) => (
                    <span
                      key={dip}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E3DEC9] text-xs font-bold text-[#2C2218]"
                    >
                      {dip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spécialités */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-[#5C4033]" />
                  Spécialités & Modules Clés
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedFiliere.specialites.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1.5 rounded-xl bg-[#E3DEC9]/50 border border-[#E3DEC9] text-xs font-semibold text-[#5C4033]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Informations institutionnelles */}
              <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355] font-semibold">Type d'établissement :</span>
                  <span className="font-bold text-[#2C2218]">{selectedFiliere.typeEtablissement}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355] font-semibold">Campus & Ville :</span>
                  <span className="font-bold text-[#2C2218]">{selectedFiliere.ville}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8C7355] font-semibold">Orientation pédagogique :</span>
                  <span className="font-medium text-[#6E5D4F] text-right max-w-xs">{selectedFiliere.notes}</span>
                </div>
              </div>
            </div>

            {/* Pied de modal */}
            <div className="mt-6 pt-4 border-t border-[#E3DEC9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-[#8C7355]">
                Lab L02 • Physique MINESUP
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5C4033] hover:bg-[#4A3328] text-white text-xs font-bold transition-all shadow-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
