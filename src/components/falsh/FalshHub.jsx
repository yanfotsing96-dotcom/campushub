import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  BookMarked,
  Library,
  GraduationCap,
  ScrollText,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import FalshOverview from './FalshOverview';
import MethodologyAssistantModule from './modules/MethodologyAssistantModule';
import FiguresOfStyleModule from './modules/FiguresOfStyleModule';
import BibliographyGeneratorModule from './modules/BibliographyGeneratorModule';
import HumanitiesResourcesModule from './modules/HumanitiesResourcesModule';
import { FALSH_DEPARTMENTS, HUMANITIES_RESOURCES } from './data/falshData';

export default function FalshHub() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'methodology' | 'figures' | 'bibliography' | 'resources' | departmentId
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vérifier si l'onglet actif est un département
  const activeDepartment = useMemo(() => {
    return FALSH_DEPARTMENTS.find((d) => d.id === activeTab) || null;
  }, [activeTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Barre de Commande Supérieure avec Sélecteur Rapide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                FALSH Hub · Humanités & Lettres
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                L1 → Master
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Faculté des Arts, Lettres et Sciences Humaines (UY1, Douala, Dschang)
            </p>
          </div>
        </div>

        {/* Bouton pour ouvrir menu mobile */}
        <div className="flex sm:hidden justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            Navigation FALSH
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 text-xs"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Architecture en 2 Colonnes : Navigation Latérale Gauche & Contenu Droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Latérale (4 colonnes sur desktop) */}
        <div
          className={`lg:col-span-3 space-y-4 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Section 1 : Vue Générale & Outils Méthodologiques */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-1">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Espace Central
            </span>

            <button
              type="button"
              onClick={() => handleSelectTab('overview')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={15} />
                <span>Tableau de Bord</span>
              </div>
              <ChevronRight size={13} className="opacity-60" />
            </button>
          </div>

          {/* Section 2 : Les 4 Modules Pratiques & Méthodologiques */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-1">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
              Modules & Outils Pratiques
            </span>

            {[
              { id: 'methodology', label: '1. Assistant Méthodologie', icon: ScrollText },
              { id: 'figures', label: '2. Figures de Style & Quiz', icon: Sparkles },
              { id: 'bibliography', label: '3. Normes Bibliographiques', icon: BookMarked },
              { id: 'resources', label: '4. Fiches & Partage', icon: Library },
            ].map((mod) => {
              const ModIcon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelectTab(mod.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ModIcon size={15} />
                    <span>{mod.label}</span>
                  </div>
                  <ChevronRight size={13} className="opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Section 3 : Les 4 Départements Majeurs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-1">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">
              Départements de la Faculté
            </span>

            {FALSH_DEPARTMENTS.map((dept) => {
              const isDeptActive = activeTab === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => handleSelectTab(dept.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-left cursor-pointer ${
                    isDeptActive
                      ? 'bg-indigo-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.accentColor }} />
                    <span className="line-clamp-1">{dept.shortName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{dept.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone Principale de Contenu (9 colonnes sur desktop) */}
        <div className="lg:col-span-9 space-y-6">
          {/* VUE 1 : Tableau de Bord / Overview */}
          {activeTab === 'overview' && (
            <FalshOverview
              onSelectModule={(moduleId) => handleSelectTab(moduleId)}
              onSelectDepartment={(deptId) => handleSelectTab(deptId)}
            />
          )}

          {/* VUE 2 : Module 1 - Assistant de Méthodologie */}
          {activeTab === 'methodology' && <MethodologyAssistantModule />}

          {/* VUE 3 : Module 2 - Guide des Figures de Style */}
          {activeTab === 'figures' && <FiguresOfStyleModule />}

          {/* VUE 4 : Module 3 - Générateur Bibliographique */}
          {activeTab === 'bibliography' && <BibliographyGeneratorModule />}

          {/* VUE 5 : Module 4 - Espace Partage & Ressources */}
          {activeTab === 'resources' && <HumanitiesResourcesModule />}

          {/* VUE 6 : Fiche Détaillée d'un Département Sélectionné */}
          {activeDepartment && (
            <div className="space-y-6 text-left">
              {/* Header du département */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white"
                    style={{ backgroundColor: `${activeDepartment.accentColor}33`, borderColor: activeDepartment.accentColor }}
                  >
                    Département : {activeDepartment.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeDepartment.badge}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeDepartment.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                  {activeDepartment.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>Directeur de département : <strong>{activeDepartment.chefDepartement}</strong></span>
                  <span>•</span>
                  <span>Effectif étudiant : <strong>{activeDepartment.totalEtudiants}</strong></span>
                </div>
              </div>

              {/* Maquette des Unités d'Enseignement (UEs) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-amber-400" />
                  <span>Maquette Pédagogique des Unités d'Enseignement (UEs)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeDepartment.unitesEnseignement.map((ue) => (
                    <div
                      key={ue.code}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-amber-400">{ue.code}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                            {ue.niveau}
                          </span>
                        </div>
                        <h4 className="text-slate-200 font-medium leading-snug">
                          {ue.intitule}
                        </h4>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-mono font-bold text-indigo-400 text-xs">
                          {ue.credits} ECTS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiches et Ressources du département */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Library size={16} className="text-emerald-400" />
                  <span>Dossiers & Fiches Associés à ce Département</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {HUMANITIES_RESOURCES.filter((r) => r.departmentId === activeDepartment.id).map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                        {r.category}
                      </span>
                      <h4 className="font-bold text-white line-clamp-1">{r.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{r.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
