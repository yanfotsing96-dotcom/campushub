import { useState } from 'react';
import {
  Trophy,
  Award,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Share2,
  BrainCircuit,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  STUDENT_GAMIFICATION_PROFILE,
  MERIT_BADGES,
  UY1_LEADERBOARD,
} from './data/evaluationData';

export default function GamificationBadges() {
  const profile = STUDENT_GAMIFICATION_PROFILE;
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showHowToEarn, setShowHowToEarn] = useState(false);

  // Icon mapper helper
  const renderBadgeIcon = (iconName, size = 20) => {
    switch (iconName) {
      case 'Share2':
        return <Share2 size={size} />;
      case 'Code2':
        return <Code2 size={size} />;
      case 'CheckCircle2':
        return <CheckCircle2 size={size} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} />;
      case 'Trophy':
        return <Trophy size={size} />;
      case 'BrainCircuit':
        return <BrainCircuit size={size} />;
      default:
        return <Award size={size} />;
    }
  };

  const xpPercent = Math.round((profile.xp / profile.nextLevelXp) * 100);

  return (
    <div className="space-y-6">
      {/* Top Gamification Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Rank & Info */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-indigo-600/30 border-2 border-indigo-400 text-indigo-300 flex items-center justify-center font-black text-2xl shadow-inner">
                {profile.currentLevel}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                LVL
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Trophy size={13} className="text-amber-400" />
                <span>{profile.rank}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {profile.name}
              </h2>
              <p className="text-xs text-slate-300">
                Matricule {profile.matricule} · {profile.level} · Université de Yaoundé I
              </p>
            </div>
          </div>

          {/* XP Gauge & Rank Badge */}
          <div className="lg:min-w-[340px] space-y-2 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-300 flex items-center gap-1">
                <Zap size={14} className="text-amber-400" />
                <span>{profile.xp.toLocaleString()} XP / {profile.nextLevelXp.toLocaleString()} XP</span>
              </span>
              <span className="text-amber-400 font-black">
                Rang #{profile.positionRank} sur {profile.totalStudents} étudiants
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{xpPercent}% du Niveau 9</span>
              <span>Plus que {(profile.nextLevelXp - profile.xp).toLocaleString()} XP pour le prochain rang</span>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Share2 size={14} />
            <span>Cours Partagés</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {profile.stats.resourcesShared}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Polycopiés & annales certifiés</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 size={14} />
            <span>Avis Utiles</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {profile.stats.helpfulReviews}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Votes favorables des camarades</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle size={14} />
            <span>Questions Résolues</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {profile.stats.resolvedQuestions}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Entraide sur les forums UY1</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy size={14} />
            <span>Badges Débloqués</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {profile.stats.verifiedBadgesCount} / {MERIT_BADGES.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Certifications de mérite</p>
        </div>
      </div>

      {/* Main Grid: Badges Grid & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Badges of Merit (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span>Badges de Mérite & Certifications Pédagogiques</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Récompenses académiques attribuées selon votre contribution active à la communauté.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHowToEarn((prev) => !prev)}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {showHowToEarn ? 'Masquer barème' : 'Gagner des points'}
            </button>
          </div>

          {/* How to earn points collapsible guidance */}
          {showHowToEarn && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2 animate-in fade-in">
              <strong className="block font-bold text-indigo-900 dark:text-indigo-200">
                Barème officiel des récompenses XP (Faculté des Sciences) :
              </strong>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>• Publier un cours validé : <strong>+200 XP</strong></div>
                <div>• Rédiger un avis utile : <strong>+25 XP</strong></div>
                <div>• Résoudre un problème TP : <strong>+100 XP</strong></div>
                <div>• Réussir un quiz d'auto-évaluation : <strong>+50 XP</strong></div>
              </div>
            </div>
          )}

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {MERIT_BADGES.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  badge.earned
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                    : 'bg-slate-50/30 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      {renderBadgeIcon(badge.icon)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        badge.earned
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {badge.earned ? 'Obtenu' : 'En cours'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    +{badge.xpReward} XP
                  </span>
                  <span>{badge.earned ? `Débloqué le ${badge.earnedDate}` : `${badge.progress}% complété`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: UY1 Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Classement des Majors (UY1)</span>
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Hebdomadaire
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top des étudiants les plus investis dans l'entraide pédagogique et les révisions collégiales.
          </p>

          <div className="space-y-2.5 pt-1">
            {UY1_LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  user.isCurrentUser
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-400 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-black text-xs ${
                      user.rank === 1
                        ? 'text-amber-500 text-sm'
                        : user.rank === 2
                        ? 'text-slate-400 text-sm'
                        : user.rank === 3
                        ? 'text-amber-700 dark:text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    #{user.rank}
                  </span>

                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: user.avatarBg }}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-600 text-white font-bold">
                          Moi
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">{user.filiere}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                    {user.xp.toLocaleString()} XP
                  </div>
                  <span className="text-[10px] text-slate-400">{user.badges} badges</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Classement mis à jour en continu selon les contributions
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              {renderBadgeIcon(selectedBadge.icon, 28)}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Badge de Certification · {selectedBadge.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {selectedBadge.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Statut :</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedBadge.earned ? `Débloqué le ${selectedBadge.earnedDate}` : `${selectedBadge.progress}% complété`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Récompense associée :</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  +{selectedBadge.xpReward} XP
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
