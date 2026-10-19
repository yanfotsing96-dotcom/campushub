import { useState } from 'react';
import ProfessionalLab from './professional/ProfessionalLab';
import CodePlayground from '../learning/CodePlayground';
import { Sparkles, Terminal } from 'lucide-react';

/**
 * ComputerScienceLab - Laboratoire Virtuel d'Informatique UY1 / MINESUP
 * Intègre le modèle de Lab Professionnel (L08) avec découpage 3 zones,
 * assistant IA et export PDF de compte-rendu officiel.
 */
export default function ComputerScienceLab() {
  const [labViewMode, setLabViewMode] = useState('pro_lab'); // 'pro_lab' | 'free_playground'

  return (
    <div className="space-y-4">
      {/* Sélecteur de Mode (Lab Professionnel 3-Zones vs Playground Libre) */}
      <div className="flex items-center justify-between bg-[#EFECE6] border border-[#E3DEC9] p-2.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLabViewMode('pro_lab')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              labViewMode === 'pro_lab'
                ? 'bg-[#2C2218] text-[#FAF5F0] shadow-xs'
                : 'bg-[#F7F5F0] text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Lab Professionnel L08 (TP, 3 Zones & IA)</span>
          </button>

          <button
            type="button"
            onClick={() => setLabViewMode('free_playground')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              labViewMode === 'free_playground'
                ? 'bg-[#2C2218] text-[#FAF5F0] shadow-xs'
                : 'bg-[#F7F5F0] text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Terminal size={13} />
            <span>Bac à Sable Multi-Langages Libre</span>
          </button>
        </div>

        <span className="hidden md:inline-block text-[11px] font-mono text-[#6E5D4F]">
          Syllabus Officiel UY1 · INF231
        </span>
      </div>

      {/* Rendu du Mode Sélectionné */}
      {labViewMode === 'pro_lab' ? (
        <ProfessionalLab defaultLabId="L08" />
      ) : (
        <CodePlayground />
      )}
    </div>
  );
}
