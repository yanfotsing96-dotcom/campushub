import { useState } from 'react';
import {
  Atom,
  Calculator,
  Activity,
  FileCheck2,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState('rlc'); // 'rlc' | 'optics' | 'thermo' | 'tp'

  // RLC Simulator State
  const [resistance, setResistance] = useState(50); // Ohms
  const [inductance, setInductance] = useState(0.1); // Henry
  const [capacitance, setCapacitance] = useState(10); // microFarads (1e-6)

  // Optics State
  const [n1, setN1] = useState(1.0); // Air
  const [n2, setN2] = useState(1.5); // Verre
  const [theta1, setTheta1] = useState(30); // degrés

  // Thermodynamics State
  const [tempHot, setTempHot] = useState(500); // Kelvin
  const [tempCold, setTempCold] = useState(300); // Kelvin

  // Calculations: RLC
  const cFarad = capacitance * 1e-6;
  const f0 = 1 / (2 * Math.PI * Math.sqrt(inductance * cFarad));
  const omega0 = 1 / Math.sqrt(inductance * cFarad);
  const qFactor = (1 / resistance) * Math.sqrt(inductance / cFarad);

  // Calculations: Optics (Snell-Descartes)
  const theta1Rad = (theta1 * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
  const isTotalReflection = sinTheta2 > 1;
  const theta2Deg = isTotalReflection ? null : (Math.asin(sinTheta2) * 180) / Math.PI;
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Calculations: Thermo
  const carnotEfficiency = tempHot > tempCold ? (1 - tempCold / tempHot) * 100 : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Header Tabs */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('rlc')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'rlc'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={14} />
            <span>Circuit RLC & Résonance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('optics')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'optics'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Atom size={14} />
            <span>Optique & Réfraction</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('thermo')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'thermo'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={14} />
            <span>Thermodynamique (Carnot)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tp')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'tp'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 size={14} />
            <span>Protocoles de TP Officiels</span>
          </button>
        </div>

        <div className="text-xs text-amber-300/80 font-mono flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span>PHY201 · Faculté des Sciences UY1 / Polytech</span>
        </div>
      </div>

      {/* 1. RLC Resonance Calculator */}
      {activeTab === 'rlc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-amber-400" />
                <span>Simulateur de Circuit RLC Série</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ajustez les paramètres passifs pour calculer instantanément la pulsation propre, la fréquence de résonance et le facteur de qualité.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Résistance R (Ω) :</span>
                  <span className="text-amber-400 font-mono">{resistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={resistance}
                  onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Inductance L (Henry) :</span>
                  <span className="text-amber-400 font-mono">{inductance} H</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2"
                  step="0.01"
                  value={inductance}
                  onChange={(e) => setInductance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Capacité C (μF) :</span>
                  <span className="text-amber-400 font-mono">{capacitance} μF</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={capacitance}
                  onChange={(e) => setCapacitance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <div>Équation différentielle : d²u/dt² + (R/L)·du/dt + (1/LC)·u = 0</div>
              <div>Régime : {qFactor > 0.5 ? 'Oscillatoire pseudo-périodique (Q > 0.5)' : 'Apériodique amorti (Q ≤ 0.5)'}</div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator size={18} className="text-amber-400" />
              <span>Grandeurs Caractéristiques Calculées</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Fréquence de résonance f₀</span>
                <span className="text-xl font-black text-amber-400 font-mono">{f0.toFixed(2)} Hz</span>
                <span className="text-[10px] text-slate-500 block font-mono">f₀ = 1 / (2π√(LC))</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Pulsation propre ω₀</span>
                <span className="text-xl font-black text-white font-mono">{omega0.toFixed(1)} rad/s</span>
                <span className="text-[10px] text-slate-500 block font-mono">ω₀ = 1 / √(LC)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Facteur de qualité Q</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{qFactor.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block font-mono">Q = (1/R)·√(L/C)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Bande passante Δf</span>
                <span className="text-xl font-black text-indigo-400 font-mono">{(f0 / (qFactor || 1)).toFixed(2)} Hz</span>
                <span className="text-[10px] text-slate-500 block font-mono">Δf = f₀ / Q</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              <strong>Application TP :</strong> À la fréquence de résonance $f_0$, l'impédance du circuit est minimale et purement résistive ($Z = R$). L'intensité du courant atteint sa valeur crête maximale.
            </div>
          </div>
        </div>
      )}

      {/* 2. Optics Calculator */}
      {activeTab === 'optics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Atom size={18} className="text-amber-400" />
              <span>Lois de Snell-Descartes pour la Réfraction</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Indice du milieu 1 (n₁) :</label>
                <select
                  value={n1}
                  onChange={(e) => setN1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value={1.0}>Air (n = 1.00)</option>
                  <option value={1.33}>Eau (n = 1.33)</option>
                  <option value={1.5}>Verre Crown (n = 1.50)</option>
                  <option value={2.42}>Diamant (n = 2.42)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Indice du milieu 2 (n₂) :</label>
                <select
                  value={n2}
                  onChange={(e) => setN2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value={1.0}>Air (n = 1.00)</option>
                  <option value={1.33}>Eau (n = 1.33)</option>
                  <option value={1.5}>Verre Crown (n = 1.50)</option>
                  <option value={2.42}>Diamant (n = 2.42)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Angle d'incidence θ₁ (degrés) :</span>
                  <span className="text-amber-400 font-mono">{theta1}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={theta1}
                  onChange={(e) => setTheta1(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator size={18} className="text-amber-400" />
              <span>Résultats Optiques & Réflexion Totale</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Angle de réfraction θ₂ :</span>
                {isTotalReflection ? (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    Réflexion Totale (Pas de rayon réfracté)
                  </span>
                ) : (
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {theta2Deg.toFixed(2)}°
                  </span>
                )}
              </div>

              {criticalAngleDeg !== null && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Angle critique de réflexion totale θ_c :</span>
                  <span className="text-white font-mono font-bold">{criticalAngleDeg.toFixed(2)}°</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-xs">
              Loi fondamentale : <code>n₁ · sin(θ₁) = n₂ · sin(θ₂)</code>. Si n₁ &gt; n₂ et θ₁ &gt; θ_c, l'onde subit une réflexion interne totale (principe de la fibre optique).
            </div>
          </div>
        </div>
      )}

      {/* 3. Thermodynamics Carnot */}
      {activeTab === 'thermo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>Rendement Théorique de Carnot</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Température Source Chaude T_chaud (Kelvin) :</span>
                  <span className="text-amber-400 font-mono">{tempHot} K ({tempHot - 273}°C)</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  value={tempHot}
                  onChange={(e) => setTempHot(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Température Source Froide T_froid (Kelvin) :</span>
                  <span className="text-amber-400 font-mono">{tempCold} K ({tempCold - 273}°C)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={tempCold}
                  onChange={(e) => setTempCold(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Efficacité Maximale</h3>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-slate-400 text-xs block">Rendement de Carnot η_max</span>
              <div className="text-4xl font-black text-emerald-400 font-mono">
                {carnotEfficiency.toFixed(1)}%
              </div>
              <span className="text-xs text-slate-500 font-mono block">η = 1 - (T_froid / T_chaud)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Théorème de Carnot : Aucun moteur thermique fonctionnant entre deux sources de chaleur ne peut avoir un rendement supérieur à celui d'un cycle réversible de Carnot.
            </p>
          </div>
        </div>
      )}

      {/* 4. TP Protocols */}
      {activeTab === 'tp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                TP PHY201 · Électronique
              </span>
              <span className="text-xs font-mono text-slate-400">Labo 204</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Étalonnage d'Oscilloscope & Mesures de Déphasage
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Méthode des ellipses de Lissajous pour déterminer le déphasage φ entre la tension d'entrée et de sortie sur un filtre passe-bas du 1er ordre.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                TP PHY203 · Optique
              </span>
              <span className="text-xs font-mono text-slate-400">Labo Optique</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Interféromètre de Michelson & Mesure de Longueur d'Onde
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configuration en lame d'air et coin d'air. Défilement de 50 anneaux d'interférence pour mesurer la longueur d'onde de la raie jaune du sodium ($\lambda = 589$ nm).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
