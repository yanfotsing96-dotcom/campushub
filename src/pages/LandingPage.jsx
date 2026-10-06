import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Terminal,
  FileCheck2,
  BookOpen,
  Sparkles,
  Cpu,
  Award,
  Lock,
  Building,
  CheckCircle2,
  Code2,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CAMEROON_UNIVERSITIES } from '../constants/academicConstants';
import heroImage from '../assets/images/campushub_hero_laboratory_1791285683529.jpg';

// Pôles Scientifiques Spécialisés des Universités Camerounaises
const SCIENTIFIC_POLES = [
  {
    id: 'inf',
    name: 'Informatique & Génie Logiciel',
    code: 'INF / GL',
    icon: Terminal,
    color: 'indigo',
    accentClass: 'from-indigo-600 to-blue-600',
    description: 'Algorithmique avancée, structures de données, systèmes d\'exploitation POSIX, réseaux IP et génie logiciel.',
    stats: '640+ Ressources · 18 Épreuves en ligne',
    keySubjects: ['INF201 : Algorithmes C', 'INF204 : Systèmes & Threads', 'INF302 : Bases de Données SQL', 'INF305 : Réseaux & Sockets'],
  },
  {
    id: 'mat',
    name: 'Mathématiques Fondamentales & Calcul',
    code: 'MAT / CALCUL',
    icon: Code2,
    color: 'purple',
    accentClass: 'from-purple-600 to-indigo-600',
    description: 'Analyse réelle et complexe, algèbre bilinéaire, topologie, probabilités approfondies et calcul scientifique.',
    stats: '480+ Ressources · 14 Épreuves en ligne',
    keySubjects: ['MAT201 : Analyse Réelle L2', 'MAT202 : Algèbre Bilinéaire', 'MAT301 : Topologie Générale', 'MAT304 : Calcul Numérique'],
  },
  {
    id: 'phy',
    name: 'Physique & Sciences de l\'Ingénieur',
    code: 'PHY / TÉLÉCOMS',
    icon: Cpu,
    color: 'emerald',
    accentClass: 'from-emerald-600 to-teal-600',
    description: 'Électromagnétisme de Maxwell, mécanique quantique, optique ondulatoire et thermodynamique statistique.',
    stats: '410+ Ressources · 12 Épreuves en ligne',
    keySubjects: ['PHY201 : Électromagnétisme', 'PHY203 : Thermodynamique', 'PHY301 : Mécanique Quantique', 'PHY304 : Électronique HF'],
  },
  {
    id: 'chm',
    name: 'Chimie & Génie des Procédés',
    code: 'CHM / PROCÉDÉS',
    icon: Sparkles,
    color: 'amber',
    accentClass: 'from-amber-600 to-yellow-600',
    description: 'Chimie organique de synthèse, cinétique réactionnelle, spectroscopie RMN/IR et cristallochimie.',
    stats: '350+ Ressources · 9 Épreuves en ligne',
    keySubjects: ['CHM201 : Chimie Organique I', 'CHM203 : Cinétique Chimique', 'CHM301 : Spectroscopie RMN', 'CHM303 : Cristallochimie'],
  },
  {
    id: 'bio',
    name: 'Biologie & Sciences Biomédicales',
    code: 'BIO / SANTÉ',
    icon: Award,
    color: 'rose',
    accentClass: 'from-rose-600 to-pink-600',
    description: 'Biologie moléculaire, biochimie structurale, génétique mendélienne et physiologie animale/végétale.',
    stats: '520+ Ressources · 15 Épreuves en ligne',
    keySubjects: ['BIO201 : Biologie Moléculaire', 'BIO204 : Génétique Formelle', 'BIO301 : Biochimie Métabolique', 'BIO304 : Immunologie'],
  },
];

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [activePole, setActivePole] = useState(SCIENTIFIC_POLES[0]);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* Glow Ambient Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-1/4 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[-50px] right-1/4 w-[500px] h-[300px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      {/* 1. TOP BAR NAVIGATION CONTRACT */}
      <header className="relative z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base tracking-tight text-white block">
                CampusHub <span className="text-indigo-400">Cameroun</span> 🇨🇲
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                Portail Académique National
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#poles" className="hover:text-indigo-400 transition-colors">
              Pôles Scientifiques
            </a>
            <a href="#exams" className="hover:text-indigo-400 transition-colors">
              Examens Sécurisés
            </a>
            <a href="#playground" className="hover:text-indigo-400 transition-colors">
              Playground C & Py
            </a>
            <a href="#resources" className="hover:text-indigo-400 transition-colors">
              Annales & TD
            </a>
            <Link to="/pricing" className="hover:text-amber-400 text-amber-300/90 transition-colors flex items-center gap-1">
              <Zap size={13} className="text-amber-400" />
              <span>CampusHub Pro</span>
            </Link>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Mon Espace ({user?.fullName ? user.fullName.split(' ')[0] : 'Étudiant'})</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <span>Créer un compte</span>
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Institutional Trust Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-[11px] font-bold text-indigo-300 uppercase tracking-widest shadow-inner shadow-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consortium Universitaire d'Excellence · Yaoundé I · Douala · Dschang · Buea</span>
          </div>

          {/* OFFICIAL MOTTO (Highlighted with Luminous Gradient) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-balance">
              <span className="block text-slate-300 font-semibold text-lg sm:text-2xl md:text-3xl mb-2 font-mono tracking-normal">
                Devise Académique Officielle
              </span>
              <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent italic drop-shadow-sm">
                “If you concentrate more you will have more”
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed text-balance pt-2">
              La plateforme numérique des étudiants en sciences et technologies au Cameroun. Réussissez vos contrôles continus, affrontez des examens chronométrés sous surveillance continue et accédez aux annales officielles annotées par les majors de promotion.
            </p>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explorer l'Espace Étudiant</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/ressources"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-bold text-sm flex items-center justify-center gap-2.5 transition-colors backdrop-blur-md"
            >
              <BookOpen size={16} className="text-indigo-400" />
              <span>Consulter les Annales Nationales</span>
            </Link>

            <Link
              to="/admin"
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              title="Accès Administrateurs & Modérateurs"
            >
              <ShieldCheck size={15} className="text-purple-400" />
              <span>Console Admin / Délégués</span>
            </Link>
          </div>

          {/* Micro-trust indicators */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Conforme aux maquettes LMD du MINESUP
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-indigo-400" />
              Salle d'examen sécurisée anti-triche
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              Compilateurs C / Python 3 embarqués
            </span>
          </div>
        </div>

        {/* Cinematic Visual Laboratory Showcase (Hero Image + Glass HUD) */}
        <div className="mt-12 md:mt-16 relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/60 p-2 sm:p-3 backdrop-blur-xl shadow-2xl shadow-indigo-950/80 overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">
                campushub.minesup.cm · Session Académique Sécurisée
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Système Opérationnel · UY1 Ngoa-Ekellé</span>
            </div>
          </div>

          {/* Generated High-Fidelity Laboratory Asset with Fallback */}
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
            {!imageError ? (
              <img
                src={heroImage}
                alt="Étudiants camerounais en plein travail dans le laboratoire scientifique CampusHub"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center filter brightness-[0.88] hover:scale-[1.01] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <GraduationCap size={48} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Laboratoire d'Excellence Scientifique CampusHub</h3>
                <p className="text-xs text-slate-400 max-w-md">Environnement d'études et de recherche pour les universités camerounaises.</p>
              </div>
            )}

            {/* Gradient Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Floating Live HUD Badges on the Image */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="bg-slate-900/90 border border-white/10 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px] sm:text-xs">
                    Contrôles Continus en Temps Réel
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Session L2 Informatique · UY1
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex bg-slate-900/90 border border-white/10 backdrop-blur-md rounded-2xl p-3 shadow-lg items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Terminal size={18} />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">
                    Console GCC & Python 3.12
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    Sandbox temps réel sans lag
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-amber-500/20 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <div className="font-bold text-amber-300 text-[11px] sm:text-xs">
                    Taux de Réussite Major
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    94.8% avec les Annales UY1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY METRICS TICKER SECTION */}
      <section className="relative z-10 border-y border-white/5 bg-slate-900/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
              8+
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Universités d'État & Écoles d'Ingénieurs
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-indigo-400 font-mono tabular-nums">
              2 450+
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Cours, TDs & Épreuves avec Corrigés Détaillés
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">
              15 800+
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Étudiants Scientifiques Régulièrement Connectés
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Cloisonnement par Filière & Matricule Universitaire
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODULES & EXCELLENCE PILLARS (GLOW CARDS) */}
      <section id="exams" className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Fonctionnalités Clés & Architecture Pédagogique
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Conçu pour les Exigences des Facultés des Sciences
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Des outils spécialisés pensés pour accompagner l'étudiant du premier cycle (L1/L2) jusqu'aux masters de recherche et écoles d'ingénieurs (ENSPY).
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Examens Sécurisés */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <FileCheck2 size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Compositions Sécurisées
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Salle d'examen chronométrée en plein écran avec détection des pertes de focus (anti-triche), sauvegarde automatique toutes les 10s et notation instantanée.
              </p>
            </div>
            <Link
              to="/exams"
              className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors pt-2 border-t border-white/5"
            >
              <span>Accéder aux épreuves</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 2: Playground de Code */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Playground Code C & Py
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exécutez vos travaux pratiques d'algorithmique et structures de données (listes, arbres, threads POSIX) en direct dans le navigateur sans installation locale.
              </p>
            </div>
            <Link
              to="/learning?tab=playground"
              className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors pt-2 border-t border-white/5"
            >
              <span>Lancer le compilateur</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 3: Annales & Bibliothèque */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md hover:border-purple-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Annales & TDs Validés
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plus de 2 400 documents téléchargeables : cours magistraux officiels, fiches de TD résolues et corrections détaillées rédigées par des tuteurs universitaires.
              </p>
            </div>
            <Link
              to="/ressources"
              className="text-xs font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors pt-2 border-t border-white/5"
            >
              <span>Explorer le catalogue</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 4: Gouvernance & Anti-Plagiat */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md hover:border-amber-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Évaluation & Mérite Académique
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Système de notation participative par étoiles, audit anti-plagiat pour les rapports de stage et badges de certification pour valoriser les étudiants majors.
              </p>
            </div>
            <Link
              to="/evaluation"
              className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:text-amber-300 transition-colors pt-2 border-t border-white/5"
            >
              <span>Voir le classement</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SCIENTIFIC POLES SHOWCASE */}
      <section id="poles" className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-900/30 rounded-3xl border border-white/5 my-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Cloisonnement des Cursus Universitaires
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Les 5 Pôles Scientifiques d'Excellence
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Sélectionnez votre filière pour découvrir les épreuves actives, les programmes de cours et le laboratoire de simulation dédié.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {SCIENTIFIC_POLES.map((pole) => {
            const Icon = pole.icon;
            const isSelected = activePole.id === pole.id;
            return (
              <button
                key={pole.id}
                type="button"
                onClick={() => setActivePole(pole)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/10'
                }`}
              >
                <Icon size={15} />
                <span>{pole.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Pole Active Preview Panel */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activePole.code}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Maquettes L1 à M2 Actives
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {activePole.name}
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {activePole.description}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-xs font-mono font-bold text-indigo-400">
                {activePole.stats}
              </div>
              <Link
                to="/dashboard"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <span>Accéder au Tableau de Bord</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Key Syllabus Modules Grid */}
          <div className="pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Unités d'Enseignement (UE) Clés & Annales Disponibles :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePole.keySubjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span className="font-medium">{sub}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Corrigé Disponible
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNER UNIVERSITIES NETWORK */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Réseau Inter-Universitaire Fédéré
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Connecté aux Établissements Publics du Cameroun
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {CAMEROON_UNIVERSITIES.slice(0, 5).map((uni) => (
            <div
              key={uni.id}
              className="p-4 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/80 transition-colors flex flex-col items-center justify-center text-center space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                <Building size={16} />
              </div>
              <span className="font-bold text-xs text-white">
                {uni.shortName}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {uni.city}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONVERSION BANNER (FINAL CTA) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-8 md:p-12 text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Zap size={13} className="text-amber-400" />
              <span>Session Semestrielle Ouverte</span>
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Prêt à Élever Vos Résultats Académiques ?
            </h2>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
              Rejoignez plus de 15 000 étudiants camerounais. Inscrivez-vous gratuitement avec votre filière et votre niveau pour accéder à vos épreuves et vos corrigés.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Créer Mon Compte Étudiant</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-colors"
              >
                Se connecter avec son Matricule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER INSTITUTIONNEL */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap size={18} />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                CampusHub Cameroun 🇨🇲
              </span>
              <span className="text-[11px] text-slate-400">
                Consortium des Universités d'État & Écoles d'Ingénieurs
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link to="/ressources" className="hover:text-white transition-colors">
              Catalogue National
            </Link>
            <Link to="/exams" className="hover:text-white transition-colors">
              Compositions en Ligne
            </Link>
            <Link to="/pricing" className="hover:text-white transition-colors">
              CampusHub Pro
            </Link>
            <Link to="/help" className="hover:text-white transition-colors">
              Centre d'Aide & FAQ
            </Link>
            <Link to="/admin" className="hover:text-purple-400 transition-colors">
              Console Administrateur
            </Link>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            © 2026 CampusHub. République du Cameroun · MINESUP.
          </div>
        </div>
      </footer>
    </div>
  );
}
