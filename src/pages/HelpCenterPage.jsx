import { useState } from 'react';
import {
  HelpCircle,
  Compass,
  MessageSquare,
} from 'lucide-react';
import HelpFaqSection from '../components/help/HelpFaqSection';
import QuickStartGuide from '../components/help/QuickStartGuide';
import SupportTicketForm from '../components/help/SupportTicketForm';
import { useCampusHub } from '../hooks/useCampusHub';

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq', 'guide', 'ticket'
  const { selectedUniversity } = useCampusHub();

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <HelpCircle size={14} className="text-amber-400" />
              <span>Assistance & Support Étudiant · Réseau National Cameroun</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Centre d'Aide & FAQ CampusHub
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Tout ce dont vous avez besoin pour vos révisions universitaires : guides pratiques pas-à-pas, réponses aux questions fréquentes et assistance technique dédiée pour {selectedUniversity.name} et l'ensemble des campus du Cameroun.
            </p>
          </div>

          {/* Quick Support Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[240px] space-y-2 self-start md:self-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Équipe de Modération en Ligne</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Assistance technique active à Ngoa-Ekellé, Douala, Dschang et Buea.
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faq'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle size={16} />
            <span>1. FAQ & Base de Connaissances</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass size={16} />
            <span>2. Guide de Démarrage (5 Étapes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ticket')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ticket'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare size={16} />
            <span>3. Contacter le Support & Signaler un Bug</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Panel */}
      <main className="transition-opacity duration-200">
        {activeTab === 'faq' && <HelpFaqSection />}
        {activeTab === 'guide' && <QuickStartGuide />}
        {activeTab === 'ticket' && <SupportTicketForm />}
      </main>
    </div>
  );
}
