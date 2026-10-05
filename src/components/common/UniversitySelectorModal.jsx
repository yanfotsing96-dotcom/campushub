import { useState, useMemo } from 'react';
import {
  Search,
  Building,
  CheckCircle2,
  MapPin,
  X,
  Sparkles,
  Globe2,
} from 'lucide-react';
import { useCampusHub } from '../../hooks/useCampusHub';
import { CAMEROON_UNIVERSITIES } from '../../constants/academicConstants';

export default function UniversitySelectorModal({ isOpen, onClose }) {
  const { selectedUniversityId, setUniversity } = useCampusHub();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredUniversities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CAMEROON_UNIVERSITIES.filter((uni) => {
      if (selectedRegion !== 'ALL' && uni.region !== selectedRegion) {
        return false;
      }
      if (!q) return true;
      return (
        uni.name.toLowerCase().includes(q) ||
        uni.shortName.toLowerCase().includes(q) ||
        uni.code.toLowerCase().includes(q) ||
        uni.city.toLowerCase().includes(q) ||
        uni.faculties.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedRegion]);

  if (!isOpen) return null;

  const handleSelect = (uniId) => {
    setUniversity(uniId);
    onClose();
  };

  const regions = ['ALL', 'Centre', 'Littoral', 'Ouest', 'Sud-Ouest', 'Nord-Ouest', 'Adamaoua'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
              <span>🇨🇲 Réseau Académique National</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building size={20} className="text-indigo-600" />
              <span>Changer d'Université ou École d'Ingénieurs</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sélectionnez votre établissement d'origine pour adapter automatiquement les annales, filières et cours recommandés.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par université (UY1, Polytechnique, Douala, Dschang, Buea...)"
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedRegion === reg
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {reg === 'ALL' ? 'Toutes les Régions' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Universities List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {/* Option: Consortium National Global */}
          <button
            type="button"
            onClick={() => handleSelect('ALL')}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              selectedUniversityId === 'ALL'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black flex-shrink-0">
                <Globe2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    Réseau National Global (Toutes Universités)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Cameroun
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Consultez les ressources de l'ensemble des universités scientifiques du pays sans restriction d'établissement.
                </p>
              </div>
            </div>

            {selectedUniversityId === 'ALL' && (
              <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 ml-2" />
            )}
          </button>

          {/* Cameroon Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {filteredUniversities.map((uni) => {
              const isSelected = selectedUniversityId === uni.id;
              return (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => handleSelect(uni.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-black text-white"
                        style={{ backgroundColor: uni.badgeColor }}
                      >
                        {uni.code}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin size={11} className="text-rose-500" />
                        <span>{uni.city} ({uni.region})</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {uni.name}
                    </h4>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {uni.faculties.join(' · ')}
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0 ml-2 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles size={14} />
            <span>Multi-campus interconnecté (UY1, Douala, Dschang, Buea, Bamenda...)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
