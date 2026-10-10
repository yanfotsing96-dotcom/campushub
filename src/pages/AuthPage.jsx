import { useState, useId } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  KeyRound,
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

  // Mode: 'login' or 'register'
  const urlMode = searchParams.get('mode');
  const [mode, setMode] = useState(urlMode || initialMode);

  // Switch mode handler
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setError('');
    setSuccessMsg('');
  };

  // Passwords visibility
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname || getDashboardRoute();

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: 'yanfotsing96@gmail.com',
    password: 'password123',
    rememberMe: true,
  });

  const loginIdentifierId = useId();
  const loginPasswordId = useId();

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = login(
        loginForm.identifier,
        null, // will match demo profile or default
        null,
        null,
        null
      );
      setSuccessMsg('Connexion réussie ! Redirection en cours...');
      setTimeout(() => {
        navigate(res?.redirectPath || from, { replace: true });
      }, 350);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.');
      setLoading(false);
    }
  };

  // 1-Click Demo Login
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
      }, 350);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la connexion démo.');
      setLoading(false);
    }
  };

  // Submit Register (delegated from RegisterForm)
  const handleRegisterSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const res = register(formData);
      setSuccessMsg('Compte académique créé avec succès ! Bienvenue sur CampusHub.');
      setTimeout(() => {
        navigate(res?.redirectPath || from, { replace: true });
      }, 350);
      return res;
    } catch (err) {
      setError(err?.message || 'Échec de la création du compte. Vérifiez les informations saisies.');
      setLoading(false);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white flex flex-col justify-between font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows (Deep Night Blue & Electric Violet) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-150px] left-1/4 w-[700px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-100px] left-1/3 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[150px]" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  CampusHub
                </span>
                <span className="text-xs">🇨🇲</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  SaaS
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 block -mt-0.5">
                Consortium Universitaire d'Excellence
              </span>
            </div>
          </Link>

          {/* Quick Header Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>Accueil</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <LanguageSelector variant="dropdown" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center">
        {/* If already authenticated, show friendly banner */}
        {isAuthenticated && user && (
          <div className="max-w-2xl mx-auto w-full mb-8 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Session active :</span>
                  <span className="text-sm font-black text-white">{user.fullName || user.nom}</span>
                  <RoleBadge role={user.role} size="xs" />
                </div>
                <p className="text-xs text-indigo-200/80">
                  {user.filiere} ({user.niveau}) · Matricule : <span className="font-mono font-bold">{user.matricule}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate(getDashboardRoute())}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Accéder au Dashboard</span>
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setError('');
                  setSuccessMsg('Session déconnectée.');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-colors"
                title="Déconnexion"
              >
                Changer de compte
              </button>
            </div>
          </div>
        )}

        {/* TWO-COLUMN GRID (Hero Motto & Value Proposition / Dynamic Auth Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: HERO MOTTO & ACADEMIC VALUE PROPOSITION */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* National Consortium Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-[11px] font-bold text-indigo-300 uppercase tracking-widest shadow-inner shadow-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Contrôle d'Accès Sécurisé · Universités du Cameroun</span>
            </div>

            {/* OFFICIAL MOTTO DISPLAY WITH LUMINOUS GRADIENT */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Devise Académique Officielle CampusHub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
                <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent italic drop-shadow-sm">
                  “If you concentrate more you will have more”
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed pt-1">
                Portail national unifié pour les étudiants des universités d'État et grandes écoles (Yaoundé I, Douala, Dschang, Buea, Polytechnique). Accédez à vos examens surveillés, vos ressources de cours et votre playground de code.
              </p>
            </div>

            {/* Institutional Security Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Cloisonnement Strict par Filière & Niveau</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Isolation automatique des épreuves et ressources selon votre parcours académique (Informatique, Mathématiques, Physique, Chimie, Biologie).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Rôles Hiérarchisés avec Code d'Accès Sécurisé</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Les fonctions de Délégué de promotion et Modérateur de pôle sont strictement verrouillées par des clés d'accès officielles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Award size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Certification Nationale & Annales Validées</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Corrigés types rédigés par les majors de promotion et professeurs certifiés des facultés scientifiques.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Slogan Note */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Session persistante chiffrée · LocalStorage & Bearer Token sécurisé</span>
            </div>
          </div>

          {/* RIGHT COLUMN: MODERN SAAS AUTHENTICATION CARD */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
              {/* Subtle accent border at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400" />

              {/* MODE SWITCHER TABS (CONNEXION / INSCRIPTION) */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock size={14} />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User size={14} />
                  <span>Inscription</span>
                </button>
              </div>

              {/* CARD TITLE & SUBTITLE */}
              <div className="text-left mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {mode === 'login' ? 'Espace Sécurisé CampusHub' : 'Créer un Compte Académique'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login'
                    ? 'Connectez-vous avec vos identifiants d\'étudiant ou utilisez les accès démo.'
                    : 'Remplissez le formulaire officiel pour rejoindre votre promotion et votre filière.'}
                </p>
              </div>

              {/* FEEDBACK ALERTS */}
              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                  <span className="leading-relaxed">{successMsg}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* 1. CONNEXION (LOGIN FORM) */}
              {/* ========================================================= */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  {/* Email or Identifier */}
                  <div className="space-y-1.5">
                    <label htmlFor={loginIdentifierId} className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail size={13} className="text-indigo-400" />
                      <span>Email académique ou Identifiant</span>
                    </label>
                    <input
                      id={loginIdentifierId}
                      type="text"
                      name="identifier"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="etudiant@univ-yaounde1.cm"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500 transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={loginPasswordId} className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Lock size={13} className="text-indigo-400" />
                        <span>Mot de passe</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id={loginPasswordId}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500 transition-colors pr-10"
                      />
                    </div>
                  </div>

                  {/* Remember Me & Help */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Mémoriser ma session</span>
                    </label>
                    <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                      Aide à la connexion
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Vérification en cours...' : 'Se connecter à CampusHub'}</span>
                    <ArrowRight size={14} />
                  </button>

                  {/* QUICK DEMO PROFILES SECTION (1-Click SaaS Test Showcase) */}
                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles size={12} className="text-amber-400" />
                        <span>Comptes Démo en 1 clic (Accès Rapide) :</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Test RBAC</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {DEMO_PROFILES.map((p) => {
                        return (
                          <button
                            key={p.role}
                            type="button"
                            onClick={() => handleDemoLogin(p)}
                            className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500 hover:bg-slate-950 text-left transition-all group space-y-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <RoleBadge role={p.role} size="xs" />
                              <ArrowRight size={11} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                              {p.nom.split(' ')[0]} {p.nom.split(' ')[1] || ''}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate font-mono">
                              {p.filiere} · {p.niveau}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* 2. INSCRIPTION (REGISTER FORM AVEC UPLOAD, VALIDATION, RBAC) */}
              {/* ========================================================= */}
              {mode === 'register' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400 shrink-0" />
                      <span>
                        <strong>Nouveau :</strong> Inscription ultra-synchronisée par Faculté (Sciences ou FALSH).
                      </span>
                    </div>
                    <Link
                      to="/register"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap shadow-xs"
                    >
                      Ouvrir le Hub UY1
                    </Link>
                  </div>

                  <RegisterForm
                    onSubmit={handleRegisterSubmit}
                    showHeaderMotto={false}
                  />
                </div>
              )}

              {/* TOGGLE BOTTOM LINK */}
              <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
                {mode === 'login' ? (
                  <span>
                    Pas encore inscrit ?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('register')}
                      className="font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer ml-1"
                    >
                      Créer un compte étudiant
                    </button>
                  </span>
                ) : (
                  <span>
                    Vous possédez déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer ml-1"
                    >
                      Se connecter directement
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CampusHub Cameroun 🇨🇲</span>
            <span>·</span>
            <span>Excellence Scientifique & Académique</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Devise : “If you concentrate more you will have more”
          </div>
        </div>
      </footer>
    </div>
  );
}
