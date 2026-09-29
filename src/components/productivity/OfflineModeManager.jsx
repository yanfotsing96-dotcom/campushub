import { useState, useEffect, useMemo } from 'react';
import {
  Wifi,
  WifiOff,
  HardDrive,
  DownloadCloud,
  Trash2,
  CheckCircle2,
  Eye,
  X,
  Radio,
} from 'lucide-react';
import { INITIAL_OFFLINE_RESOURCES } from './data/productivityData';

const STORAGE_OFFLINE_KEY = 'campushub_offline_cache';

export default function OfflineModeManager() {
  const [isBrowserOnline, setIsBrowserOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  // Manual simulated toggle for campus testing (Ngoa-Ekellé Wi-Fi drops)
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  const [cachedResources, setCachedResources] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OFFLINE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_OFFLINE_RESOURCES;
    } catch {
      return INITIAL_OFFLINE_RESOURCES;
    }
  });

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Monitor real network status
  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveCache = (data) => {
    setCachedResources(data);
    try {
      localStorage.setItem(STORAGE_OFFLINE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  // Effective status (browser real status OR simulated)
  const isEffectivelyOnline = isBrowserOnline && !simulatedOffline;

  // Calculate simulated storage footprint
  const totalCachedCount = useMemo(() => {
    return cachedResources.filter((r) => r.isCached).length;
  }, [cachedResources]);

  const storageUsedMB = (totalCachedCount * 1.55).toFixed(2);
  const storageQuotaMB = 50;
  const storagePercentage = Math.round((storageUsedMB / storageQuotaMB) * 100);

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      const updated = cachedResources.map((res) => ({
        ...res,
        isCached: true,
        cachedDate: new Date().toISOString().split('T')[0],
      }));
      saveCache(updated);
    }, 1000);
  };

  const handleToggleResourceCache = (id) => {
    const updated = cachedResources.map((res) => {
      if (res.id === id) {
        return {
          ...res,
          isCached: !res.isCached,
          cachedDate: !res.isCached ? new Date().toISOString().split('T')[0] : null,
        };
      }
      return res;
    });
    saveCache(updated);
  };

  const handleClearCache = () => {
    if (window.confirm('Voulez-vous libérer le cache local et supprimer les copies hors-ligne ?')) {
      const updated = cachedResources.map((res) => ({
        ...res,
        isCached: false,
        cachedDate: null,
      }));
      saveCache(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Status Header & Campus Simulator */}
      <div
        className={`border rounded-3xl p-6 shadow-sm transition-all duration-300 ${
          isEffectivelyOnline
            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            : 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isEffectivelyOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
              }`}
            >
              {isEffectivelyOnline ? <Wifi size={28} /> : <WifiOff size={28} />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                    isEffectivelyOnline
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 animate-pulse'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isEffectivelyOnline ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isEffectivelyOnline ? 'Connexion Active (En Ligne)' : 'Mode Hors-ligne Actif'}</span>
                </span>
                {simulatedOffline && (
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    Simulation campus activée
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isEffectivelyOnline
                  ? 'Synchronisation & Continuité Pédagogique'
                  : 'Mode Hors-ligne : Consultation sans interruption'}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {isEffectivelyOnline
                  ? 'Vos cours, TD et annales d\'examens consultés sont automatiquement mis en mémoire tampon locale pour vous permettre d\'étudier même en cas de coupure réseau sur le campus de Ngoa-Ekellé.'
                  : 'Le réseau est indisponible ou coupé. CampusHub bascule automatiquement sur votre cache local (IndexedDB / LocalStorage) : vos cours enregistrés restent 100% lisibles.'}
              </p>
            </div>
          </div>

          {/* Offline Campus Simulator Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSimulatedOffline((prev) => !prev)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                simulatedOffline
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
              title="Tester le comportement de l'application en cas de panne réseau"
            >
              <Radio size={14} />
              <span>
                {simulatedOffline ? 'Désactiver la coupure' : 'Simuler coupure Wi-Fi campus'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Storage Quota & Management Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HardDrive size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Espace de Stockage Local Dédié
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {storageUsedMB} Mo utilisés sur {storageQuotaMB} Mo alloués dans le cache du navigateur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSyncingAll}
              onClick={handleSyncAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              <DownloadCloud size={14} className={isSyncingAll ? 'animate-bounce' : ''} />
              <span>{isSyncingAll ? 'Synchronisation...' : 'Tout mettre en cache'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearCache}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              title="Vider les copies locales"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Progress Storage Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Quota consommé : {storagePercentage}%</span>
            <span>{totalCachedCount} document(s) prêt(s) pour consultation hors-ligne</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, storagePercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cached Documents Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Documents Disponibles en Cache Local (UY1)
          </span>
          <span>{cachedResources.length} supports répertoriés</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cachedResources.map((res) => (
            <div
              key={res.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                res.isCached
                  ? 'border-emerald-200 dark:border-emerald-900/60'
                  : 'border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {res.code} · {res.format}
                  </span>

                  {res.isCached ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={13} />
                      <span>Disponible hors-ligne</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Non synchronisé</span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {res.summary}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                  <span>Taille : {res.size}</span>
                  <span>•</span>
                  <span>{res.pages} pages</span>
                  {res.cachedDate && (
                    <>
                      <span>•</span>
                      <span>Synchro : {res.cachedDate}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(res)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Eye size={13} />
                  <span>Consulter (Lecteur)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleResourceCache(res.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    res.isCached
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {res.isCached ? <Trash2 size={13} /> : <DownloadCloud size={13} />}
                  <span>{res.isCached ? 'Retirer du cache' : 'Télécharger'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Reader Preview Modal (100% works offline) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col relative">
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                {previewDoc.code}
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Lecture depuis le stockage local (0 octet consommé)</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {previewDoc.title}
            </h3>

            {/* Document Content Simulation */}
            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-4 my-2 leading-relaxed">
              <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400 border-b pb-1">
                Extrait Hors-Ligne Officiel · Département d'Informatique UY1
              </div>
              <p>
                Ce support pédagogique est entièrement indexé dans votre navigateur. Vous pouvez réviser l'ensemble des théorèmes, algorithmes et syntaxes clés sans nécessiter de point d'accès Wi-Fi ni données mobiles.
              </p>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs">
                // Exemple de code embarqué en cache local :<br />
                int main(void) &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;printf("Consultation hors-ligne active sur CampusHub UY1.\\n");<br />
                &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br />
                &#125;
              </div>
              <p>
                <strong>Sommaire du polycopié :</strong>
                <br />• Section 1 : Introduction et objectifs fondamentaux
                <br />• Section 2 : Spécifications et structures de données
                <br />• Section 3 : Exercices de travaux pratiques et corrigés détaillés
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>{previewDoc.pages} pages complètes</span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                Fermer le lecteur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
