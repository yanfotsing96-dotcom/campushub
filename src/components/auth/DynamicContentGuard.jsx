import { useAcademicFilter } from '../../hooks/useAcademicFilter';
import { Lock, ShieldAlert, GraduationCap, CheckCircle2 } from 'lucide-react';

/**
 * Composant de Garde Académique Dynamique (Dynamic Content Guard)
 * Protège et certifie que l'étudiant navigue dans un environnement strictement étanche
 * selon sa filière et son niveau d'études.
 */
export default function DynamicContentGuard({
  children,
  targetFiliere,
  targetNiveau,
  showBanner = true,
  fallbackTitle = 'Contenu hors périmètre académique',
  fallbackDescription,
}) {
  const { activeFiliere, activeNiveau, department, isAdmin, canAccessItem } = useAcademicFilter();

  // Si des cibles explicites sont fournies, vérifie la conformité
  const isTargetProvided = targetFiliere !== undefined;
  const isAccessible = !isTargetProvided || canAccessItem({ filiere: targetFiliere, niveau: targetNiveau });

  if (!isAccessible && !isAdmin) {
    return (
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 backdrop-blur-xl text-left shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <ShieldAlert size={24} />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-widest block">
              Cloisonnement MINESUP · Accès Interdit
            </span>
            <h3 className="text-lg font-black text-white">
              {fallbackTitle}
            </h3>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {fallbackDescription || (
            <>
              Cette ressource appartient à la filière <strong>{targetFiliere}</strong> ({targetNiveau}). En tant qu'étudiant inscrit en <strong>{department.label}</strong> ({activeNiveau}), l'accès est strictement réservé aux unités d'enseignement de votre cursus.
            </>
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Lock size={12} />
            <span>Votre périmètre certifié :</span>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-bold">
            {activeFiliere} · {activeNiveau}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showBanner && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <Lock size={13} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Filtrage Académique Actif</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">
                Affichage exclusif des cours, annales et examens de : <strong className="text-indigo-300">{department.label}</strong> (<strong className="text-white">{activeNiveau}</strong>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/80 font-mono font-bold flex items-center gap-1">
              <GraduationCap size={12} className="text-indigo-400" />
              <span>{department.code}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Périmètre Scellé</span>
            </span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
