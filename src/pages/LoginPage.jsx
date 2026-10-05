import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import LanguageSelector from '../components/common/LanguageSelector';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleLogin = (data) => {
    const res = login(data?.email, data?.role, data?.filiere, data?.niveau);
    navigate(res?.redirectPath || '/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 transition-colors relative">
      {/* Top Header with Brand & Language Selector in top-right corner */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20">
            <GraduationCap size={20} />
          </div>
          <div className="leading-tight">
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight block">
              CampusHub 🇨🇲
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">
              Cameroun
            </span>
          </div>
        </Link>

        {/* Top-Right Language & Theme Utilities */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">
            {t('common.language')} :
          </span>
          <LanguageSelector variant="dropdown" />
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Login Form Center Area */}
      <main className="flex-1 flex items-center justify-center my-6">
        <LoginForm onSubmit={handleLogin} />
      </main>

      {/* Institutional Bilingual Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-4 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60">
        <p>
          <strong>CampusHub Cameroun</strong> · {t('auth.bilingualNotice')}
        </p>
      </footer>
    </div>
  );
}