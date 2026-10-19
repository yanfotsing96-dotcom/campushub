import { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Thermometer,
  Activity,
  Sliders,
  TrendingDown,
  Info,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { IDistillationData, IHeatExchangerData } from '../../../types/lab03';
import KaTeXMath from '../../common/KaTeXMath';

interface UnitOperationsDesignModuleProps {
  onDistillationChange?: (data: IDistillationData) => void;
  onExchangerChange?: (data: IHeatExchangerData) => void;
}

export default function UnitOperationsDesignModule({
  onDistillationChange,
  onExchangerChange,
}: UnitOperationsDesignModuleProps) {
  const [activeUnit, setActiveUnit] = useState<'distillation' | 'exchanger'>('distillation');

  // ─── 1. ÉTAT DISTILLATION (MCCABE-THIELE) ──────────────────────────────────
  const [alpha, setAlpha] = useState<number>(2.5); // Volatilité relative
  const [refluxR, setRefluxR] = useState<number>(2.5); // Reflux R = L/D
  const [zf, setZf] = useState<number>(0.5); // Fraction molaire d'alimentation
  const [xd, setXd] = useState<number>(0.95); // Pureté en tête (Distillat)
  const [xb, setXb] = useState<number>(0.05); // Pureté en pied (Résidu)
  const [feedQ, setFeedQ] = useState<number>(1.0); // q = 1: liquide saturé
  const [feedFlowF, setFeedFlowF] = useState<number>(100); // kmol/h
  const [murphreeEff, setMurphreeEff] = useState<number>(0.75); // 75% efficacité de plateau

  // ─── 2. ÉTAT ÉCHANGEUR DE CHALEUR (DTLM) ──────────────────────────────────
  const [flowType, setFlowType] = useState<'counter_current' | 'co_current'>('counter_current');
  const [flowHot, setFlowHot] = useState<number>(2.5); // kg/s
  const [flowCold, setFlowCold] = useState<number>(3.2); // kg/s
  const [tHotIn, setTHotIn] = useState<number>(115); // °C
  const [tHotOut, setTHotOut] = useState<number>(65); // °C
  const [tColdIn, setTColdIn] = useState<number>(20); // °C
  const [overallU, setOverallU] = useState<number>(850); // W/(m².K)
  const cpHot = 4180; // J/(kg.K) eau/fluide caloporteur
  const cpCold = 4180; // J/(kg.K) eau de refroidissement

  // ─── CALCULS MCCABE-THIELE ────────────────────────────────────────────────
  const distillationResults = useMemo(() => {
    // Fonction d'équilibre y_eq(x)
    const eqY = (x: number) => (alpha * x) / (1 + (alpha - 1) * x);
    // Fonction inverse x_eq(y)
    const invEqX = (y: number) => y / (alpha - (alpha - 1) * y);

    // Calcul Rmin : intersection de la q-line avec la courbe d'équilibre
    // Pour q = 1, x_pinch = zf => y_pinch = eqY(zf)
    const yPinch = eqY(zf);
    const slopeMin = (xd - yPinch) / (xd - zf);
    const rMin = slopeMin / Math.max(0.01, 1 - slopeMin);

    // Point d'intersection de la ROL et de la q-line (xp, yp)
    let xp = zf;
    let yp = zf;
    if (Math.abs(feedQ - 1.0) < 1e-4) {
      xp = zf;
      yp = (refluxR / (refluxR + 1)) * xp + xd / (refluxR + 1);
    } else {
      // Résolution de : yp = (R/(R+1))*xp + xd/(R+1) et yp = (q/(q-1))*xp - zf/(q-1)
      const m1 = refluxR / (refluxR + 1);
      const b1 = xd / (refluxR + 1);
      const m2 = feedQ / (feedQ - 1);
      const b2 = -zf / (feedQ - 1);
      xp = (b2 - b1) / (m1 - m2);
      yp = m1 * xp + b1;
    }

    // Construction des marches d'escalier
    const steps: { x: number; y: number }[] = [];
    let currentX = xd;
    let currentY = xd;
    steps.push({ x: currentX, y: currentY });

    let trayCount = 0;
    let feedTray = 1;
    const maxIterations = 35;

    while (currentX > xb && trayCount < maxIterations) {
      trayCount++;
      // Palier horizontal vers la courbe d'équilibre
      const newX = Math.max(0.001, invEqX(currentY));
      steps.push({ x: newX, y: currentY });

      // Si on franchit le point d'alimentation
      if (newX < xp && feedTray === 1) {
        feedTray = trayCount;
      }

      // Palier vertical vers la droite opératoire appropriée (ROL ou SOL)
      let newY: number;
      if (newX >= xp) {
        // Ligne de rectification
        newY = (refluxR / (refluxR + 1)) * newX + xd / (refluxR + 1);
      } else {
        // Ligne d'épuisement passant par (xb, xb) et (xp, yp)
        const slopeSOL = (yp - xb) / Math.max(0.001, xp - xb);
        newY = xb + slopeSOL * (newX - xb);
      }

      newY = Math.max(0, Math.min(1, newY));
      steps.push({ x: newX, y: newY });
      currentX = newX;
      currentY = newY;
    }

    const actualTrays = Math.ceil(trayCount / Math.max(0.1, murphreeEff));
    const D = (feedFlowF * (zf - xb)) / Math.max(0.01, xd - xb);
    const B = feedFlowF - D;
    const condDuty = D * 39.5 * (refluxR + 1);
    const rebDuty = (D * (refluxR + 1) + feedFlowF * 0.15) * 36.2;

    const data: IDistillationData = {
      feedFlowRate: feedFlowF,
      feedFractionLight: zf,
      distillateFraction: xd,
      bottomsFraction: xb,
      refluxRatio: refluxR,
      relativeVolatility: alpha,
      thermalStateQ: feedQ,
      minRefluxRatio: Math.max(0.5, rMin),
      theoreticalTrays: trayCount,
      feedTrayIndex: feedTray,
      actualTrays,
      condenserDutyKW: condDuty,
      reboilerDutyKW: rebDuty,
      steps,
    };

    return { data, xp, yp, eqY };
  }, [alpha, refluxR, zf, xd, xb, feedQ, feedFlowF, murphreeEff]);

  // ─── CALCULS ÉCHANGEUR DE CHALEUR ─────────────────────────────────────────
  const exchangerResults: IHeatExchangerData = useMemo(() => {
    // Puissance thermique cédée par le fluide chaud : Phi = m_c * Cp_c * (Th_in - Th_out)
    const heatDutyWatts = flowHot * cpHot * (tHotIn - tHotOut);
    const heatDutyKW = heatDutyWatts / 1000;

    // Équilibre thermique sur fluide froid : m_f * Cp_f * (Tc_out - Tc_in) = Phi
    const tColdOutCalc = tColdIn + heatDutyWatts / (flowCold * cpCold);

    // Calcul des écarts de température aux extrémités
    let deltaT1: number;
    let deltaT2: number;

    if (flowType === 'counter_current') {
      // Contre-courant : extrémité 1 = chaud entrant / froid sortant
      deltaT1 = tHotIn - tColdOutCalc;
      // extrémité 2 = chaud sortant / froid entrant
      deltaT2 = tHotOut - tColdIn;
    } else {
      // Co-courant : extrémité 1 = entrées
      deltaT1 = tHotIn - tColdIn;
      // extrémité 2 = sorties
      deltaT2 = tHotOut - tColdOutCalc;
    }

    // Calcul DTLM
    const dt1 = Math.max(0.5, deltaT1);
    const dt2 = Math.max(0.5, deltaT2);
    let dtlm: number;
    if (Math.abs(dt1 - dt2) < 0.1) {
      dtlm = dt1;
    } else {
      dtlm = (dt1 - dt2) / Math.log(dt1 / dt2);
    }

    // Surface requise A = Phi / (U * DTLM)
    const areaM2 = heatDutyWatts / (overallU * Math.max(0.1, dtlm));

    return {
      flowArrangement: flowType,
      hotFluidName: 'Procédé Éthanol / Vapeur',
      coldFluidName: 'Eau de Refroidissement Industrielle',
      massFlowHotKgS: flowHot,
      massFlowColdKgS: flowCold,
      tHotInC: tHotIn,
      tHotOutC: tHotOut,
      tColdInC: tColdIn,
      tColdOutC: tColdOutCalc,
      heatCapacityHot: cpHot,
      heatCapacityCold: cpCold,
      heatDutyKW,
      dtlmC: dtlm,
      overallUCoeff: overallU,
      requiredAreaM2: areaM2,
    };
  }, [flowType, flowHot, flowCold, tHotIn, tHotOut, tColdIn, overallU, cpHot, cpCold]);

  // Points SVG pour le diagramme de McCabe-Thiele (taille 300x300)
  const toSvgM = (val: number) => val * 260 + 20;
  const toSvgMY = (val: number) => 280 - val * 260;

  // Courbe d'équilibre SVG
  const eqPathD = useMemo(() => {
    let d = '';
    for (let i = 0; i <= 50; i++) {
      const x = i / 50;
      const y = distillationResults.eqY(x);
      const sx = toSvgM(x);
      const sy = toSvgMY(y);
      d += i === 0 ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
    }
    return d;
  }, [distillationResults]);

  // Marches d'escalier SVG
  const stepsPathD = useMemo(() => {
    return distillationResults.data.steps.reduce((acc, pt, idx) => {
      const sx = toSvgM(pt.x);
      const sy = toSvgMY(pt.y);
      return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
    }, '');
  }, [distillationResults]);

  useEffect(() => {
    onDistillationChange?.(distillationResults.data);
  }, [distillationResults.data, onDistillationChange]);

  useEffect(() => {
    onExchangerChange?.(exchangerResults);
  }, [exchangerResults, onExchangerChange]);

  return (
    <div className="space-y-5 text-left">
      {/* En-tête de sélection de l'opération unitaire */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DEC9]/70 pb-3">
        <div className="inline-flex p-1 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveUnit('distillation')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeUnit === 'distillation'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Layers size={13} />
            <span>Distillation (McCabe-Thiele)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveUnit('exchanger')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeUnit === 'exchanger'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Thermometer size={13} />
            <span>Échangeur Thermique (DTLM)</span>
          </button>
        </div>

        <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
          <Sparkles size={13} />
          Dimensionnement Industriel & Bilans
        </span>
      </div>

      {/* ─── 1. VUE DISTILLATION (MCCABE-THIELE VECTORIEL) ─────────────────── */}
      {activeUnit === 'distillation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Diagramme SVG McCabe-Thiele */}
            <div className="lg:col-span-7 p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-[#E3DEC9]/60 pb-2">
                <span className="font-bold text-[#2C2218] flex items-center gap-1">
                  <Activity size={14} className="text-[#059669]" />
                  Diagramme de McCabe-Thiele (y vs x)
                </span>
                <span className="font-mono text-[11px] font-bold text-[#059669]">
                  N_théo = {distillationResults.data.theoreticalTrays} plateaux | N_réel = {distillationResults.data.actualTrays}
                </span>
              </div>

              <div className="relative flex justify-center">
                <svg viewBox="0 0 300 300" className="w-full max-w-[320px] h-auto select-none bg-slate-950/5 rounded-xl border border-[#E3DEC9]">
                  {/* Grille */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="20" y1="150" x2="280" y2="150" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="150" y1="20" x2="150" y2="280" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Première bissectrice y = x */}
                  <line x1="20" y1="280" x2="280" y2="20" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Courbe d'équilibre y_eq(x) */}
                  <path d={eqPathD} fill="none" stroke="#059669" strokeWidth="2.5" />

                  {/* Ligne d'alimentation q-line */}
                  <line
                    x1={toSvgM(zf)}
                    y1={toSvgMY(zf)}
                    x2={toSvgM(distillationResults.xp)}
                    y2={toSvgMY(distillationResults.yp)}
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />

                  {/* Ligne de rectification ROL */}
                  <line
                    x1={toSvgM(xd)}
                    y1={toSvgMY(xd)}
                    x2={toSvgM(distillationResults.xp)}
                    y2={toSvgMY(distillationResults.yp)}
                    stroke="#0284C7"
                    strokeWidth="2"
                  />

                  {/* Ligne d'épuisement SOL */}
                  <line
                    x1={toSvgM(xb)}
                    y1={toSvgMY(xb)}
                    x2={toSvgM(distillationResults.xp)}
                    y2={toSvgMY(distillationResults.yp)}
                    stroke="#8B5CF6"
                    strokeWidth="2"
                  />

                  {/* Marches d'escalier des plateaux */}
                  <path d={stepsPathD} fill="none" stroke="#DC2626" strokeWidth="2" />

                  {/* Points clés */}
                  <circle cx={toSvgM(xd)} cy={toSvgMY(xd)} r="3.5" fill="#0284C7" />
                  <circle cx={toSvgM(zf)} cy={toSvgMY(zf)} r="3.5" fill="#F59E0B" />
                  <circle cx={toSvgM(xb)} cy={toSvgMY(xb)} r="3.5" fill="#8B5CF6" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#6E5D4F] pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#059669] rounded-full" /> Équilibre (α={alpha})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#0284C7] rounded-full" /> ROL (R={refluxR})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#F59E0B] rounded-full" /> q-line (q={feedQ})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#DC2626] rounded-full" /> Marches (Plateaux)</span>
              </div>
            </div>

            {/* Sliders et Contrôles McCabe-Thiele */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2">
                <span className="font-bold text-[#8C7355] uppercase block text-[11px]">Paramètres de Séparation</span>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Volatilité Relative α</span>
                    <span className="font-mono font-bold text-[#059669]">{alpha}</span>
                  </div>
                  <input
                    type="range"
                    min="1.3"
                    max="4.0"
                    step="0.1"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Taux de Reflux R = L/D</span>
                    <span className="font-mono font-bold text-[#059669]">{refluxR} (R_min ≈ {distillationResults.data.minRefluxRatio.toFixed(2)})</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.1"
                    value={refluxR}
                    onChange={(e) => setRefluxR(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Pureté Distillat xD</span>
                    <span className="font-mono font-bold text-[#2C2218]">{xd}</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="0.99"
                    step="0.01"
                    value={xd}
                    onChange={(e) => setXd(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Composition Alim zF</span>
                    <span className="font-mono font-bold text-[#2C2218]">{zf}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.8"
                    step="0.05"
                    value={zf}
                    onChange={(e) => setZf(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Efficacité de Murphree η</span>
                    <span className="font-mono font-bold text-[#2C2218]">{(murphreeEff * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="0.95"
                    step="0.05"
                    value={murphreeEff}
                    onChange={(e) => setMurphreeEff(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>
              </div>

              {/* Bilan Dimensionnement Colonne */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-1.5">
                <div className="flex justify-between py-0.5 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355]">Plateaux Théoriques (N) :</span>
                  <span className="font-mono font-black text-[#059669]">{distillationResults.data.theoreticalTrays}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355]">Plateau d'Injection Alim :</span>
                  <span className="font-mono font-bold text-[#2C2218]">Plateau #{distillationResults.data.feedTrayIndex}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355]">Plateaux Réels Industriels :</span>
                  <span className="font-mono font-bold text-[#5C4033]">{distillationResults.data.actualTrays} plateaux</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#8C7355]">Puissance Rebouilleur :</span>
                  <span className="font-mono text-emerald-800 font-bold">{distillationResults.data.reboilerDutyKW.toFixed(0)} kW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. VUE ÉCHANGEUR THERMIQUE (MÉTHODE DTLM) ─────────────────────── */}
      {activeUnit === 'exchanger' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Profils Thermiques le long de l'Échangeur (SVG) */}
            <div className="lg:col-span-7 p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#E3DEC9]/60 pb-2">
                <span className="font-bold text-[#2C2218] flex items-center gap-1.5">
                  <Thermometer size={14} className="text-[#059669]" />
                  Profils de Température le long de l'Échangeur
                </span>
                <span className="font-mono text-[11px] font-bold text-[#059669]">
                  ΔT_ln (DTLM) = {exchangerResults.dtlmC.toFixed(1)} °C
                </span>
              </div>

              {/* Schéma SVG des profils co/contre courant */}
              <div className="p-3 rounded-xl bg-slate-900 text-white">
                <svg viewBox="0 0 400 160" className="w-full h-40 select-none">
                  {/* Axes */}
                  <line x1="30" y1="130" x2="380" y2="130" stroke="#475569" strokeWidth="1.5" />
                  <text x="350" y="145" fontSize="10" fill="#94A3B8">Longueur L</text>
                  <text x="10" y="25" fontSize="10" fill="#94A3B8">T (°C)</text>

                  {/* Fluide Chaud (Rouge/Orange) : Th_in -> Th_out */}
                  <line x1="30" y1={130 - (tHotIn / 130) * 110} x2="380" y2={130 - (tHotOut / 130) * 110} stroke="#EF4444" strokeWidth="3" />
                  <circle cx="30" cy={130 - (tHotIn / 130) * 110} r="4" fill="#EF4444" />
                  <circle cx="380" cy={130 - (tHotOut / 130) * 110} r="4" fill="#EF4444" />
                  <text x="35" y={125 - (tHotIn / 130) * 110} fontSize="10" fill="#EF4444" fontWeight="bold">
                    Th_in = {tHotIn}°C
                  </text>
                  <text x="310" y={145 - (tHotOut / 130) * 110} fontSize="10" fill="#EF4444" fontWeight="bold">
                    Th_out = {tHotOut}°C
                  </text>

                  {/* Fluide Froid (Bleu/Cyan) */}
                  {flowType === 'counter_current' ? (
                    <>
                      {/* Contre-courant : entre en L=1 (380) et sort en L=0 (30) */}
                      <line x1="380" y1={130 - (tColdIn / 130) * 110} x2="30" y2={130 - (exchangerResults.tColdOutC / 130) * 110} stroke="#38BDF8" strokeWidth="3" />
                      <circle cx="380" cy={130 - (tColdIn / 130) * 110} r="4" fill="#38BDF8" />
                      <circle cx="30" cy={130 - (exchangerResults.tColdOutC / 130) * 110} r="4" fill="#38BDF8" />
                      <text x="35" y={145 - (exchangerResults.tColdOutC / 130) * 110} fontSize="10" fill="#38BDF8" fontWeight="bold">
                        Tc_out = {exchangerResults.tColdOutC.toFixed(1)}°C
                      </text>
                      <text x="310" y={125 - (tColdIn / 130) * 110} fontSize="10" fill="#38BDF8" fontWeight="bold">
                        Tc_in = {tColdIn}°C (← Flux)
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Co-courant : entre en 30 et sort en 380 */}
                      <line x1="30" y1={130 - (tColdIn / 130) * 110} x2="380" y2={130 - (exchangerResults.tColdOutC / 130) * 110} stroke="#38BDF8" strokeWidth="3" />
                      <circle cx="30" cy={130 - (tColdIn / 130) * 110} r="4" fill="#38BDF8" />
                      <circle cx="380" cy={130 - (exchangerResults.tColdOutC / 130) * 110} r="4" fill="#38BDF8" />
                      <text x="35" y={145 - (tColdIn / 130) * 110} fontSize="10" fill="#38BDF8" fontWeight="bold">
                        Tc_in = {tColdIn}°C (Flux →)
                      </text>
                      <text x="300" y={125 - (exchangerResults.tColdOutC / 130) * 110} fontSize="10" fill="#38BDF8" fontWeight="bold">
                        Tc_out = {exchangerResults.tColdOutC.toFixed(1)}°C
                      </text>
                    </>
                  )}
                </svg>
              </div>

              {/* Formule KaTeX DTLM */}
              <div className="p-2.5 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] text-center">
                <KaTeXMath
                  math="\Delta T_{\ln} = \frac{\Delta T_1 - \Delta T_2}{\ln(\Delta T_1 / \Delta T_2)}, \quad A = \frac{\Phi}{U \cdot \Delta T_{\ln}}"
                  block
                />
              </div>
            </div>

            {/* Sliders Échangeur Thermique */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2.5">
                <span className="font-bold text-[#8C7355] uppercase block text-[11px]">Configuration & Débits</span>

                {/* Configuration : Contre-courant vs Co-courant */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border border-[#E3DEC9] text-center font-bold">
                  <button
                    type="button"
                    onClick={() => setFlowType('counter_current')}
                    className={`py-1.5 rounded-lg transition-all ${
                      flowType === 'counter_current' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#6E5D4F]'
                    }`}
                  >
                    Contre-Courant (Optimal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowType('co_current')}
                    className={`py-1.5 rounded-lg transition-all ${
                      flowType === 'co_current' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#6E5D4F]'
                    }`}
                  >
                    Co-Courant
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Débit Chaud mh (kg/s)</span>
                    <span className="font-mono font-bold text-[#EF4444]">{flowHot}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={flowHot}
                    onChange={(e) => setFlowHot(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Temp. Entrée Chaude Th_in</span>
                    <span className="font-mono font-bold text-[#EF4444]">{tHotIn} °C</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="140"
                    step="5"
                    value={tHotIn}
                    onChange={(e) => setTHotIn(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Temp. Sortie Chaude Th_out</span>
                    <span className="font-mono font-bold text-[#EF4444]">{tHotOut} °C</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    step="5"
                    value={tHotOut}
                    onChange={(e) => setTHotOut(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#2C2218]">Coeff Global U (W/m²·K)</span>
                    <span className="font-mono font-bold text-[#059669]">{overallU}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1500"
                    step="50"
                    value={overallU}
                    onChange={(e) => setOverallU(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                </div>
              </div>

              {/* Bilan Dimensionnement Échangeur */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-1.5">
                <div className="flex justify-between py-0.5 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355]">Puissance Échangée Φ :</span>
                  <span className="font-mono font-black text-rose-700">{exchangerResults.heatDutyKW.toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#E3DEC9]/60">
                  <span className="text-[#8C7355]">DTLM calculée :</span>
                  <span className="font-mono font-bold text-[#059669]">{exchangerResults.dtlmC.toFixed(2)} °C</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#8C7355] font-bold">Surface d'Échange Requise :</span>
                  <span className="font-mono font-black text-emerald-800 text-sm">{exchangerResults.requiredAreaM2.toFixed(2)} m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
