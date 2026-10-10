import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Thermometer,
  Clock,
  FlaskConical,
  FileText,
  Activity,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

export default function ImmunologyModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'immunology');

  // Paramètres personnalisables en champs libres
  const [substrateConcentration, setSubstrateConcentration] = useState(50); // ng/mL d'antigène ([Ag])
  const [cultureTime, setCultureTime] = useState(30); // jours après contact (t)
  const [initialPopulation, setInitialPopulation] = useState(50); // UI/mL titre initial (N0)
  const [temperature, setTemperature] = useState(37); // °C (37°C normal, >38°C fièvre)
  const [boosterDay, setBoosterDay] = useState(14); // Jour de rappel antigénique (0 = pas de rappel)
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Simulation dynamique des cinétiques IgM vs IgG et titrage ELISA
  const immuneResponse = useMemo(() => {
    // Effet de la fièvre (>38°C) stimulant la prolifération des lymphocytes B et plasmocytes
    const feverFactor = temperature > 38 ? 1.25 : 1.0;

    // Génération de la courbe temporelle jour par jour (J0 à J45)
    const points = [];
    const maxDays = Math.max(45, cultureTime + 5);

    for (let day = 0; day <= maxDays; day += 0.5) {
      let igm = 0;
      let igg = 0;

      // 1. Réponse primaire après contact initial à J0
      if (day >= 3) {
        // IgM : pic rapide vers J7 puis décroissance
        const dtPrimary = day - 3;
        igm = Math.max(0, 150 * Math.exp(-0.15 * dtPrimary) * (1 - Math.exp(-0.6 * dtPrimary))) * feverFactor;
        // IgG : retardée (J6), pic vers J14
        if (day >= 6) {
          const dtG = day - 6;
          igg = Math.max(0, 300 * Math.exp(-0.06 * dtG) * (1 - Math.exp(-0.4 * dtG))) * feverFactor;
        }
      }

      // 2. Réponse secondaire suite au rappel antigénique (si boosterDay > 0 et day >= boosterDay)
      if (boosterDay > 0 && day >= boosterDay) {
        const dtBooster = day - boosterDay;
        // IgM : légère remontée transitoire
        const boostIgm = Math.max(0, 80 * Math.exp(-0.2 * dtBooster) * (1 - Math.exp(-0.8 * dtBooster)));
        igm += boostIgm;

        // IgG mémoire : décharge massive, pic colossal vers boosterDay + 5
        const boostIgg = Math.max(0, 2500 * Math.exp(-0.03 * dtBooster) * (1 - Math.exp(-0.9 * dtBooster))) * feverFactor;
        igg += boostIgg;
      }

      // Titre total avec bruit basal
      const totalTiter = initialPopulation + igm + igg;
      points.push({ day, igm, igg, totalTiter });
    }

    // Titres au jour actuel choisi par l'utilisateur
    const currentPt = points.find((p) => p.day >= cultureTime) || points[points.length - 1];
    const currentIgm = currentPt ? currentPt.igm : 0;
    const currentIgg = currentPt ? currentPt.igg : 0;
    const currentTotal = currentPt ? currentPt.totalTiter : initialPopulation;

    // Pourcentage de neutralisation antigénique (%)
    const neutralization = Math.min(99.9, ((currentTotal * (substrateConcentration / 50)) / (currentTotal + 200)) * 100);

    // Titrage ELISA : Densité Optique A450 calculée
    const elisaOD450 = Math.min(3.2, 0.05 + (currentTotal / 2500) * 2.8);

    return {
      points,
      currentIgm,
      currentIgg,
      currentTotal,
      neutralization,
      elisaOD450,
    };
  }, [substrateConcentration, cultureTime, initialPopulation, temperature, boosterDay]);

  const currentParams = {
    substrateConcentration,
    cultureTime,
    initialPopulation,
    temperature,
    boosterDay,
  };

  const experimentalResults = {
    'Titre Sérique IgG (Haute Affinité)': {
      value: Math.round(immuneResponse.currentIgg),
      unit: 'UI / mL',
      comment: immuneResponse.currentIgg > 800 ? 'Protection humorale mémoire robuste' : 'Taux post-primaire',
    },
    'Titre Sérique IgM (Précoce)': {
      value: Math.round(immuneResponse.currentIgm),
      unit: 'UI / mL',
      comment: 'Marqueur d\'infection aiguë ou récente',
    },
    'Neutralisation Pathogène In Vitro': {
      value: immuneResponse.neutralization.toFixed(1),
      unit: '%',
      comment: immuneResponse.neutralization > 85 ? 'Séroprotection totale' : 'Neutralisation partielle',
    },
    'Absorbance ELISA A₄₅₀': {
      value: immuneResponse.elisaOD450.toFixed(3),
      unit: 'DO',
      comment: 'Spectrophotométrie immuno-enzymatique',
    },
  };

  const handleReset = () => {
    setSubstrateConcentration(50);
    setCultureTime(30);
    setInitialPopulation(50);
    setTemperature(37);
    setBoosterDay(14);
  };

  const applyPreset = (preset) => {
    if (preset.substrateConcentration !== undefined) setSubstrateConcentration(preset.substrateConcentration);
    if (preset.cultureTime !== undefined) setCultureTime(preset.cultureTime);
    if (preset.initialPopulation !== undefined) setInitialPopulation(preset.initialPopulation);
    if (preset.temperature !== undefined) setTemperature(preset.temperature);
    if (preset.boosterDay !== undefined) setBoosterDay(preset.boosterDay);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              {moduleData?.code || 'BIO401'} · AVANCÉ (L3-MASTER)
            </span>
            <span className="text-xs text-slate-400 font-mono">Immunologie Humorale & Sérologie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="text-indigo-400" size={24} />
            <span>Immunologie : Réponse Anticorps & Titrage ELISA</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Cinétique comparée de la primo-réponse IgM versus réponse secondaire IgG (effet mémoire), affinité antigénique et test immuno-enzymatique ELISA à 450 nm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Immunologie & ELISA')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD d'immunologie"
          >
            <GraduationCap size={15} />
            <span>Mode Examen & TD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/30 cursor-pointer"
          >
            <FileText size={15} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      {/* Presets rapides */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Protocoles Immunologiques :</span>
        </span>
        {moduleData?.presets?.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 transition-colors font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grille principale : Paramètres à gauche, Graphe sérique à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PARAMÈTRES IMMUNOLOGIQUES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical size={16} className="text-indigo-400" />
                <span>Stimulation Antigénique & Suivi</span>
              </h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Concentration en antigène [Ag] */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <FlaskConical size={13} className="text-slate-400" />
                  <span>Dose Antigénique Injectée ([Ag]) :</span>
                </label>
                <span className="font-mono text-indigo-400">{substrateConcentration} ng/mL</span>
              </div>
              <input
                type="number"
                min="5"
                max="200"
                step="5"
                value={substrateConcentration}
                onChange={(e) => setSubstrateConcentration(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
              />
            </div>

            {/* 2. Temps de suivi (jours) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Jours Post-Injection (t) :</span>
                </label>
                <span className="font-mono text-indigo-400">J+{cultureTime}</span>
              </div>
              <input
                type="number"
                min="1"
                max="60"
                step="1"
                value={cultureTime}
                onChange={(e) => setCultureTime(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
              />
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={cultureTime}
                onChange={(e) => setCultureTime(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* 3. Jour de rappel antigénique (booster) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-violet-400" />
                  <span>Rappel Antigénique (Booster) :</span>
                </label>
                <span className="font-mono text-violet-400">
                  {boosterDay === 0 ? 'Aucun rappel' : `J+${boosterDay}`}
                </span>
              </div>
              <select
                value={boosterDay}
                onChange={(e) => setBoosterDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-indigo-500/60 focus:outline-none"
              >
                <option value={0}>Aucun rappel (Primo-infection seule)</option>
                <option value={7}>J+7 (Rappel très précoce)</option>
                <option value={14}>J+14 (Rappel vaccinal standard)</option>
                <option value={21}>J+21 (Protocole espacé)</option>
                <option value={28}>J+28 (Rappel tardif)</option>
              </select>
            </div>

            {/* 4. Température (°C) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température Corporelle de l'Hôte (T) :</span>
                </label>
                <span className="font-mono text-indigo-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="35"
                max="41"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 37)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">
                {temperature >= 38.5 ? '🔥 Fièvre active : booste la prolifération des plasmocytes.' : 'Apyrexie normale.'}
              </span>
            </div>
          </div>
        </div>

        {/* CINÉTIQUE SÉRIQUE DES IMMUNOGLOBULINES (IGM VS IGG) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" />
                  <span>Dynamique Sérique : IgM (Bleu) vs IgG (Violet)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Évolution des titres en anticorps en fonction des jours post-vaccinaux
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> IgM
                </span>
                <span className="flex items-center gap-1 text-violet-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> IgG (Mémoire)
                </span>
              </div>
            </div>

            {/* Tracé SVG Dynamique */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <svg viewBox="0 0 400 220" className="w-full h-56">
                {/* Axes */}
                <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                <line x1="45" y1="20" x2="45" y2="185" stroke="#475569" strokeWidth="1.5" />

                <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                  Jours (t)
                </text>
                <text x="15" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                  Titre (UI/mL)
                </text>

                {/* Marqueur de rappel si présent */}
                {boosterDay > 0 && (
                  <g>
                    {(() => {
                      const boostX = 45 + (boosterDay / 45) * 330;
                      return (
                        <>
                          <line x1={boostX} y1="20" x2={boostX} y2="185" stroke="#ec4899" strokeDasharray="3 3" />
                          <text x={boostX} y="32" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">
                            Rappel J+{boosterDay}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* Courbe IgM */}
                <path
                  d={
                    'M 45 185 ' +
                    immuneResponse.points
                      .map((pt) => {
                        const x = 45 + (pt.day / 45) * 330;
                        const y = 185 - (pt.igm / 2500) * 155;
                        return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Courbe IgG */}
                <path
                  d={
                    'M 45 185 ' +
                    immuneResponse.points
                      .map((pt) => {
                        const x = 45 + (pt.day / 45) * 330;
                        const y = 185 - (pt.igg / 2500) * 155;
                        return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />

                {/* Repère Jour Actuel */}
                {(() => {
                  const curX = 45 + (cultureTime / 45) * 330;
                  return (
                    <line x1={curX} y1="20" x2={curX} y2="185" stroke="#ffffff" strokeDasharray="2 2" opacity="0.6" />
                  );
                })()}
              </svg>
            </div>

            {/* Cartouches de résultats numériques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Titre IgG (J+{cultureTime})</span>
                <span className="text-lg font-black font-mono text-violet-400">
                  {Math.round(immuneResponse.currentIgg)}
                </span>
                <span className="text-[9px] text-slate-500 block">UI / mL</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Titre IgM</span>
                <span className="text-lg font-black font-mono text-sky-400">
                  {Math.round(immuneResponse.currentIgm)}
                </span>
                <span className="text-[9px] text-slate-500 block">UI / mL</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Neutralisation</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {immuneResponse.neutralization.toFixed(1)} %
                </span>
                <span className="text-[9px] text-slate-500 block">Protection</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Spectre ELISA A₄₅₀</span>
                <span className="text-lg font-black font-mono text-amber-400">
                  {immuneResponse.elisaOD450.toFixed(3)}
                </span>
                <span className="text-[9px] text-slate-500 block">Densité Optique</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'exportation du TP */}
      <BiologyTPExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        moduleData={moduleData}
        currentParams={currentParams}
        experimentalResults={experimentalResults}
      />
    </div>
  );
}
