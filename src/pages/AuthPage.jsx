import { useState, useId } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  ROLE_LABELS,
  DEMO_PROFILES,
} from '../constants/rbacConstants';
import LanguageSelector from '../components/common/LanguageSelector';
import ThemeToggle from '../components/common/ThemeToggle';
import RoleBadge from '../components/common/RoleBadge';
import RegisterForm from '../components/auth/RegisterForm';

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, login, register, logout, getDashboardRoute } = useAuth();

  const urlMode = searchParams.get('mode');
  const [mode, setMode] = useState(urlMode || initialMode);

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setError('');
    setSuccessMsg('');
  };

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const from = location.state?.from?.pathname || getDashboardRoute();

  const [loginForm, setLoginForm] = useState({
    identifier: 'yanfotsing96@gmail.com',
    password: 'password123',
    rememberMe: true,
  });

  const loginIdentifierId = useId();
  const loginPasswordId = useId();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = login(
        loginForm.identifier,
        null,
        null,
        null,
        null
      );
      setSuccessMsg('Connexion réussie ! Redirection en cours...');
      setTimeout(() => {
        navigate(res?.redirectPath || from, { replace: true });
      }, 300);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.');
      setLoading(false);
    }
  };

  const handleDemoLogin = (profile) => {
    setError('');
    setLoading(true);
    try {
      const res = login(
        profile.email,
        profile.role,
        profile.filiere,
        profile.niveau,
        profile.nom,
        profile.matricule
      );
      setSuccessMsg(`Connecté en tant que ${profile.nom} (${ROLE_LABELS[profile.role]})`);
      setTimeout(() => {
        navigate(res?.redirectPath || from, { replace: true });
      }, 300);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la connexion démo.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const res = register(formData);
      setSuccessMsg('Compte académique créé avec succès !');
      setTimeout(() => {
        navigate(res?.redirectPath || from, { replace: true });
      }, 300);
      return res;
    } catch (err) {
      setError(err?.message || 'Échec de la création du compte.');
      setLoading(false);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-600 selection:text-white flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-700/60 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <LanguageSelector variant="dropdown" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Active Session Notice */}
        {isAuthenticated && user && (
          <div className="max-w-2xl mx-auto w-full mb-8 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">{user.fullName || user.nom}</span>
                  <RoleBadge role={user.role} size="xs" />
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {user.matricule} · {user.filiere} ({user.niveau})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(getDashboardRoute())}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Tableau de bord
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setError('');
                  setSuccessMsg('Session déconnectée.');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Changer
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Scope */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
                Portail Académique National
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Universités d'État & Grandes Écoles du Cameroun
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Connectez-vous ou créez votre compte pour accéder aux annales vérifiées, aux compositions en ligne surveillées et aux polycopiés officiels de votre filière.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <h2 className="text-xs font-semibold text-slate-200">Cloisonnement Universitaire & Filière</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Accès ciblé selon votre établissement (UY1, Douala, Dschang, Buea, Bamenda, Polytechnique...).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <h2 className="text-xs font-semibold text-slate-200">Rôles Sécurisés (RBAC)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Droits d'administration et publication d'amphi certifiés par clé de sécurité MINESUP.
                </p>
              </div>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                Comptes Démo Rapides (1 Clic) :
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_PROFILES.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleDemoLogin(p)}
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-left transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <RoleBadge role={p.role} size="xs" />
                      <ArrowRight size={11} className="text-slate-400" />
                    </div>
                    <div className="font-semibold text-xs text-white truncate mt-1">
                      {p.nom}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono truncate">
                      {p.filiere} · {p.niveau}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Auth Box */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-xl">
              {/* Tab Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700 mb-6">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    mode === 'login'
                      ? 'bg-slate-800 text-white shadow-xs border border-slate-650'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock size={13} />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    mode === 'register'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User size={13} />
                  <span>Inscription Nationale</span>
                </button>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-2 text-left">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2 text-left">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label htmlFor={loginIdentifierId} className="block text-xs font-medium text-slate-300">
                      Email académique ou Identifiant
                    </label>
                    <input
                      id={loginIdentifierId}
                      type="text"
                      name="identifier"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="etudiant@univ-yaounde1.cm"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={loginPasswordId} className="block text-xs font-medium text-slate-300">
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
                        <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                      </button>
                    </div>
                    <input
                      id={loginPasswordId}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                      />
                      <span>Mémoriser ma session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}

              {/* Register Form embedded */}
              {mode === 'register' && (
                <RegisterForm
                  onSubmit={handleRegisterSubmit}
                  showHeaderMotto={false}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/70 bg-slate-900 py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CampusHub Cameroun · Consortium National</span>
          <span className="font-mono text-slate-400 text-[11px]">MINESUP · 2025-2026</span>
        </div>
      </footer>
    </div>
  );
}
