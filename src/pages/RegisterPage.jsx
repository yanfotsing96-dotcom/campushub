import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Sparkles, Layers } from 'lucide-react';
import RegistrationFlow from '../components/auth/RegistrationFlow';
import RegistrationHub from '../components/auth/RegistrationHub';
import ThemeToggle from '../components/common/ThemeToggle';

/**
 * RegisterPage - Page Officielle d'Inscription et de Profilage Académique
 * Université de Yaoundé I (Faculté des Sciences & FALSH)
 */
export default function RegisterPage() {
  const [activeView, setActiveView] = useState('flow'); // 'flow' (2 étapes) ou 'hub' (explorateur)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Halos lumineux d'ambiance en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-150px] left-1/4 w-[700px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-100px] left-1/3 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Barre Supérieure Institutionnelle */}
      <header className="relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  CampusHub
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-white/10 text-indigo-300 border border-white/10">
                  UY1 Official
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Université de Yaoundé I · Faculté des Sciences & FALSH
              </p>
            </div>
          </Link>

          {/* Sélecteur de Mode d'Inscription */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveView('flow')}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
                activeView === 'flow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Parcours 2 Étapes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('hub')}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
                activeView === 'hub'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Catalogue & Outils Hub</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ArrowLeft size={13} />
              <span>Déjà inscrit ? Connexion</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Corps Principal : RegistrationFlow ou RegistrationHub */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeView === 'flow' ? <RegistrationFlow /> : <RegistrationHub />}
      </main>

      {/* Pied de Page */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>
            © 2026 CampusHub UY1 · République du Cameroun · Ministère de l'Enseignement Supérieur (MINESUP)
          </p>
          <p className="text-[11px] text-slate-600">
            Faculté des Sciences (FS) & Faculté des Arts, Lettres et Sciences Humaines (FALSH) · Campus de Ngoa-Ekellé
          </p>
        </div>
      </footer>
    </div>
  );
}
