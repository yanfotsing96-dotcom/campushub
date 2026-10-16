import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import ThemeToggle from '../components/common/ThemeToggle';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Bar: Minimal, strict 3-zone linear style */}
      <header className="border-b border-slate-700/60 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <GraduationCap size={18} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                CampusHub Cameroun
              </span>
              <span className="text-xs text-slate-400 font-mono">· MINESUP</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Connexion</span>
            </Link>

            <div className="h-4 w-px bg-slate-700/60" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area: Grand Formulaire d'Inscription Unifié */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <RegisterForm showHeaderMotto={true} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-700/60 bg-slate-900 py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 CampusHub · Consortium des Universités d'État et Grandes Écoles du Cameroun
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            MINESUP Cameroun
          </span>
        </div>
      </footer>
    </div>
  );
}
