import {
  BookOpen,
  Sparkles,
  BookMarked,
  Library,
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  ScrollText,
  Building,
} from 'lucide-react';
import { FALSH_DEPARTMENTS, FIGURES_OF_STYLE_DATA, HUMANITIES_RESOURCES } from './data/falshData';

export default function FalshOverview({ onSelectModule, onSelectDepartment }) {
  const tools = [
    {
      id: 'methodology',
      title: 'Module 1 : Assistant de Méthodologie',
      subtitle: 'Dissertation & Commentaire Composé',
      description: 'Déconstruisez le sujet, problématisez et générez un plan en 3 parties rigoureusement argumenté selon les normes des jurys.',
      icon: ScrollText,
      badge: 'Indispensable L1-Master',
      color: 'amber',
      accentBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
    {
      id: 'figures',
      title: 'Module 2 : Guide des Figures de Style',
      subtitle: 'Dictionnaire & Test Interactif',
      description: `Explorez ${FIGURES_OF_STYLE_DATA.length} figures de style avec définitions, effets et exemples comparés (Baudelaire, Hugo, Césaire, Senghor).`,
      icon: Sparkles,
      badge: 'Rhétorique & Stylistique',
      color: 'indigo',
      accentBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      btnColor: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    },
    {
      id: 'bibliography',
      title: 'Module 3 : Générateur Bibliographique',
      subtitle: 'Normes APA, MLA & Chicago / ISO',
      description: 'Formatage instantané de vos ouvrages et articles de revues pour vos fiches de lecture, mémoires de Master et thèses de doctorat.',
      icon: BookMarked,
      badge: 'Citations & Références',
      color: 'cyan',
      accentBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      btnColor: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    },
    {
      id: 'resources',
      title: 'Module 4 : Espace Partage & Ressources',
      subtitle: 'Fiches de Lecture & Annales Corrigées',
      description: `Accédez à ${HUMANITIES_RESOURCES.length} dossiers commentés : Une vie de boy, Cahier d'un retour au pays natal, Marcien Towa et histoire nationale.`,
      icon: Library,
      badge: 'Banque d\'Excellence',
      color: 'emerald',
      accentBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* 1. Hero Bannière d'Excellence FALSH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 text-white p-6 md:p-8 shadow-2xl border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <GraduationCap size={14} className="text-amber-400" />
              <span>Faculté des Arts, Lettres & Sciences Humaines · FALSH Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Pôle Académique d'Excellence en Humanités & Lettres
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-serif">
              Espace méthodologique, littéraire et documentaire conçu pour les étudiants de Licence 1 à Master 2 (Université de Yaoundé I, Douala, Dschang, Buea, Maroua).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building size={14} className="text-amber-400" />
                <span>Ngoa-Ekellé & Campus Nationaux</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                <span>Normes MINESUP Certifiées</span>
              </span>
            </div>
          </div>

          {/* Cartouches de statistiques rapides */}
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 text-left">
              <div className="text-xl font-black text-amber-400 font-mono">4 Filières</div>
              <div className="text-[11px] text-slate-400 font-medium">Départements Majeurs</div>
            </div>
            <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 text-left">
              <div className="text-xl font-black text-emerald-400 font-mono">100% Libre</div>
              <div className="text-[11px] text-slate-400 font-medium">Accès Ouvert & Fiches</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Les 4 Outils Pratiques & Méthodologiques (Grid 2x2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              <span>Outils Pratiques & Méthodologiques Disponibles</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accédez directement aux 4 modules d'entraînement et d'appui aux études littéraires et humaines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${tool.accentBg}`}>
                      {tool.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <ToolIcon size={18} />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-amber-300 transition-colors">
                    {tool.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 mb-2">
                    {tool.subtitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Formation L1 à Master
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectModule(tool.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${tool.btnColor}`}
                  >
                    <span>Lancer le module</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Les 4 Départements Majeurs de la FALSH */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building size={18} className="text-indigo-400" />
            <span>Départements Académiques de la Faculté</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Consultez les maquettes pédagogiques, crédits ECTS et UEs majeures par département.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FALSH_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg text-white"
                    style={{ backgroundColor: `${dept.accentColor}33`, borderColor: dept.accentColor }}
                  >
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {dept.badge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                  {dept.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {dept.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-slate-500" />
                    <span>Effectif :</span>
                  </span>
                  <span className="text-slate-300 font-mono">{dept.totalEtudiants}</span>
                </div>

                <div className="text-[10px] text-slate-500 truncate">
                  Dir. : {dept.chefDepartement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
