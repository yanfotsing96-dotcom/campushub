import { useState, useMemo, useCallback } from 'react';
import {
  Calculator,
  Binary,
  Sparkles,
  BookOpen,
  School,
} from 'lucide-react';
import Lab01MathematicsView from './Lab01MathematicsView';

export default function MathematicsLab() {
  const [activeTab, setActiveTab] = useState('filieres'); // 'filieres' | 'matrix' | 'calculus' | 'theorems'

  // 2x2 Matrix State: [ [a, b], [c, d] ]
  const [a, setA] = useState(4);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const [d, setD] = useState(3);

  // Calculus State
  const [funcChoice, setFuncChoice] = useState('poly'); // 'poly' | 'sin' | 'exp' | 'gauss'
  const [evalX, setEvalX] = useState(2);
  const [integralA, setIntegralA] = useState(0);
  const [integralB, setIntegralB] = useState(2);

  // Matrix Calculations
  const det = a * d - b * c;
  const trace = a + d;
  const discriminant = trace * trace - 4 * det;
  const hasRealEigenvalues = discriminant >= 0;
  const lambda1 = hasRealEigenvalues ? (trace + Math.sqrt(discriminant)) / 2 : null;
  const lambda2 = hasRealEigenvalues ? (trace - Math.sqrt(discriminant)) / 2 : null;

  // Numerical Functions
  const evaluateFunction = useCallback((x) => {
    switch (funcChoice) {
      case 'poly':
        return x * x * x - 2 * x + 1; // f(x) = x^3 - 2x + 1
      case 'sin':
        return Math.sin(x) * Math.cos(2 * x); // f(x) = sin(x)*cos(2x)
      case 'exp':
        return Math.exp(-0.5 * x) * Math.cos(x); // f(x) = e^(-0.5x)*cos(x)
      case 'gauss':
        return Math.exp(-x * x); // f(x) = e^(-x^2)
      default:
        return x;
    }
  }, [funcChoice]);

  const funcLabel = {
    poly: 'f(x) = x³ - 2x + 1',
    sin: 'f(x) = sin(x) · cos(2x)',
    exp: 'f(x) = e^(-x/2) · cos(x)',
    gauss: 'f(x) = e^(-x²) (Courbe de Gauss)',
  }[funcChoice];

  // Derivative: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
  const h = 1e-5;
  const fVal = evaluateFunction(evalX);
  const fPrime = (evaluateFunction(evalX + h) - evaluateFunction(evalX - h)) / (2 * h);

  // Numerical Integral via Simpson rule
  const numericalIntegral = useMemo(() => {
    const n = 100;
    const step = (integralB - integralA) / n;
    let sum = evaluateFunction(integralA) + evaluateFunction(integralB);
    for (let i = 1; i < n; i++) {
      const xVal = integralA + i * step;
      sum += (i % 2 === 0 ? 2 : 4) * evaluateFunction(xVal);
    }
    return (step / 3) * sum;
  }, [evaluateFunction, integralA, integralB]);

  return (
    <div className="space-y-6 text-left">
      {/* Header Tabs (Thème Beige & Chocolat MINESUP) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="inline-flex p-1 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('filieres')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'filieres'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <School size={14} />
            <span>Filières Officielles UY1 à UEb (14)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Binary size={14} />
            <span>Algèbre & Matrices</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculus')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'calculus'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Calculator size={14} />
            <span>Analyse Numérique</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theorems')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'theorems'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <BookOpen size={14} />
            <span>Théorèmes</span>
          </button>
        </div>

        <div className="text-xs text-[#5C4033] font-bold flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#5C4033]" />
          <span>Lab L01 · Mathématiques & Statistiques MINESUP</span>
        </div>
      </div>

      {/* 0. Répertoire Officiel des 14 Filières Lab L01 */}
      {activeTab === 'filieres' && (
        <Lab01MathematicsView onNavigateToSimulator={() => setActiveTab('matrix')} />
      )}

      {/* 1. Matrix Calculator */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#F7F5F0] border border-[#E3DEC9] rounded-3xl p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-black text-[#2C2218] flex items-center gap-2">
              <Binary size={18} className="text-[#5C4033]" />
              <span>Matrice 2x2 M = [ [a, b], [c, d] ]</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 max-w-xs font-mono text-center">
              <div>
                <label className="text-[11px] text-[#6E5D4F] font-bold block mb-1">M₁₁ (a) :</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-bold text-base text-center focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6E5D4F] font-bold block mb-1">M₁₂ (b) :</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-bold text-base text-center focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6E5D4F] font-bold block mb-1">M₂₁ (c) :</label>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-bold text-base text-center focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6E5D4F] font-bold block mb-1">M₂₂ (d) :</label>
                <input
                  type="number"
                  value={d}
                  onChange={(e) => setD(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-bold text-base text-center focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-mono text-[#5C4033] space-y-1">
              <div>Polynôme caractéristique : P_M(λ) = λ² - Tr(M)·λ + det(M)</div>
              <div className="font-bold">P_M(λ) = λ² - ({trace})·λ + ({det})</div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F7F5F0] border border-[#E3DEC9] rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-[#2C2218]">Invariants Algébriques</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-1">
                <span className="text-[11px] text-[#8C7355] font-semibold">Déterminant det(M)</span>
                <span className="text-2xl font-black text-[#5C4033] font-mono block">{det}</span>
                <span className="text-[10px] text-[#6E5D4F] font-mono">
                  {det !== 0 ? 'Matrice Inversible (GL₂)' : 'Matrice Non Inversible (Singulière)'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-1">
                <span className="text-[11px] text-[#8C7355] font-semibold">Trace Tr(M)</span>
                <span className="text-2xl font-black text-[#2C2218] font-mono block">{trace}</span>
                <span className="text-[10px] text-[#6E5D4F] font-mono">Tr = a + d</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-1 col-span-2">
                <span className="text-[11px] text-[#8C7355] font-semibold">Valeurs Propres (Spectre Sp(M))</span>
                {hasRealEigenvalues ? (
                  <div className="text-lg font-black text-emerald-800 font-mono">
                    λ₁ = {lambda1.toFixed(3)} , λ₂ = {lambda2.toFixed(3)}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-amber-800 font-mono">
                    Valeurs propres complexes conjuguées (Δ = {discriminant} &lt; 0)
                  </div>
                )}
              </div>
            </div>

            {det !== 0 && (
              <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs font-mono">
                <span className="text-[#8C7355] text-[11px] block font-bold">Matrice Inverse M⁻¹ = (1/det) × [ [d, -b], [-c, a] ] :</span>
                <div className="text-[#2C2218] font-bold">
                  | {(d / det).toFixed(3)}   {(-b / det).toFixed(3)} |
                </div>
                <div className="text-[#2C2218] font-bold">
                  | {(-c / det).toFixed(3)}   {(a / det).toFixed(3)} |
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Calculus Numerical Sandbox */}
      {activeTab === 'calculus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#F7F5F0] border border-[#E3DEC9] rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-[#2C2218] flex items-center gap-2">
              <Calculator size={18} className="text-[#5C4033]" />
              <span>Fonction & Dérivation Numérique</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#2C2218] font-bold mb-1">Choisir la fonction f(x) :</label>
                <select
                  value={funcChoice}
                  onChange={(e) => setFuncChoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-mono focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                >
                  <option value="poly">f(x) = x³ - 2x + 1 (Polynôme)</option>
                  <option value="sin">f(x) = sin(x) · cos(2x) (Trigonométrique)</option>
                  <option value="exp">f(x) = e^(-x/2) · cos(x) (Oscillation amortie)</option>
                  <option value="gauss">f(x) = e^(-x²) (Densité Gaussienne)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#2C2218] mb-1">
                  <span>Point d'évaluation x₀ :</span>
                  <span className="text-[#5C4033] font-mono">{evalX}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={evalX}
                  onChange={(e) => setEvalX(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-mono focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-1">
                  <span className="text-[11px] text-[#8C7355] font-semibold">f(x₀)</span>
                  <span className="text-xl font-black text-[#2C2218] font-mono block">{fVal.toFixed(4)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-1">
                  <span className="text-[11px] text-[#8C7355] font-semibold">Dérivée f'(x₀)</span>
                  <span className="text-xl font-black text-[#5C4033] font-mono block">{fPrime.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F7F5F0] border border-[#E3DEC9] rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-[#2C2218]">Intégration Numérique (Méthode de Simpson)</h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C2218] font-bold mb-1">Borne inférieure a :</label>
                  <input
                    type="number"
                    value={integralA}
                    onChange={(e) => setIntegralA(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-mono focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#2C2218] font-bold mb-1">Borne supérieure b :</label>
                  <input
                    type="number"
                    value={integralB}
                    onChange={(e) => setIntegralB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-[#2C2218] font-mono focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E3DEC9] text-center space-y-2">
                <span className="text-[#6E5D4F] text-xs block font-mono">∫ [a={integralA} → b={integralB}] {funcLabel} dx</span>
                <div className="text-4xl font-black text-[#5C4033] font-mono">
                  {numericalIntegral.toFixed(5)}
                </div>
                <span className="text-[11px] text-[#8C7355] block">Quadrature de Simpson d'ordre 4 (100 sous-intervalles)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Theorems */}
      {activeTab === 'theorems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]">
              MAT201 · Algèbre
            </span>
            <h4 className="text-sm font-black text-[#2C2218]">Théorème Spectral pour les Endomorphismes Symétriques</h4>
            <p className="text-[#6E5D4F] leading-relaxed">
              Toute matrice symétrique réelle A ∈ M_n(ℝ) (A = A^T) est diagonalisable dans une base orthonormée de vecteurs propres. Toutes ses valeurs propres sont réelles.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]">
              MAT201 · Analyse
            </span>
            <h4 className="text-sm font-black text-[#2C2218]">Théorème de Convergence Dominée de Lebesgue</h4>
            <p className="text-[#6E5D4F] leading-relaxed">
              Soit $(f_n)$ une suite de fonctions mesurables convergeant simplement vers $f$. S'il existe une fonction intégrable $g$ telle que $|f_n| \le g$ presque partout, alors $f$ est intégrable et $\lim \int f_n = \int f$.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
