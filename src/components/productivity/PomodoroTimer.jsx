import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  ChevronDown,
  Clock,
  Radio,
  Coffee,
  Brain,
} from 'lucide-react';
import { STUDY_GROUPS } from './data/productivityData';

const MODES = {
  work: { id: 'work', label: 'Session de Travail', duration: 25 * 60, icon: Brain, color: 'indigo' },
  shortBreak: { id: 'shortBreak', label: 'Pause Courte', duration: 5 * 60, icon: Coffee, color: 'emerald' },
  longBreak: { id: 'longBreak', label: 'Pause Longue', duration: 15 * 60, icon: Sparkles, color: 'blue' },
};

const STORAGE_STATS_KEY = 'campushub_pomodoro_stats';

export default function PomodoroTimer() {
  const [currentMode, setCurrentMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group sync state
  const [isGroupSyncActive, setIsGroupSyncActive] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(STUDY_GROUPS[0]);
  const [connectedStudentsCount, setConnectedStudentsCount] = useState(16);
  const [groupReactions, setGroupReactions] = useState([
    { id: 1, user: 'Samuel N.', text: 'Pointeurs en C maîtrisés ! 🔥', time: 'il y a 2m' },
    { id: 2, user: 'Aïssatou M.', text: 'Objectif : finir le TP INF201 🎯', time: 'il y a 5m' },
  ]);

  // Statistics
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATS_KEY);
      return saved ? JSON.parse(saved).count : 3;
    } catch {
      return 3;
    }
  });

  const timerRef = useRef(null);

  const activeModeConfig = MODES[currentMode];
  const totalDuration = activeModeConfig.duration;

  // Sound chime using browser AudioContext
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (err) {
      console.warn('Audio non disponible :', err);
    }
  }, [soundEnabled]);

  // Timer Tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playChime();

            if (currentMode === 'work') {
              setCompletedSessions((c) => {
                const nextCount = c + 1;
                try {
                  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify({ count: nextCount }));
                } catch {
                  // Ignore
                }
                return nextCount;
              });
              // Switch to break
              const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
              setCurrentMode(nextMode);
              return MODES[nextMode].duration;
            } else {
              setCurrentMode('work');
              return MODES.work.duration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, currentMode, completedSessions, soundEnabled, playChime]);

  // Sync title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (isRunning) {
      document.title = `(${formatted}) CampusHub Pomodoro`;
    } else {
      document.title = 'CampusHub UY1 · Plateforme Pédagogique';
    }
  }, [timeLeft, isRunning]);

  // Handle Mode Change
  const handleModeSwitch = (modeKey) => {
    setIsRunning(false);
    setCurrentMode(modeKey);
    setTimeLeft(MODES[modeKey].duration);
  };

  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(activeModeConfig.duration);
  };

  const handleSkipNext = () => {
    setIsRunning(false);
    const nextMode = currentMode === 'work' ? 'shortBreak' : 'work';
    setCurrentMode(nextMode);
    setTimeLeft(MODES[nextMode].duration);
  };

  const handleAdjustTime = (deltaMinutes) => {
    if (isRunning) return;
    setTimeLeft((prev) => Math.max(60, prev + deltaMinutes * 60));
  };

  const handleSendReaction = (emojiText) => {
    const newReaction = {
      id: Date.now(),
      user: 'Moi (Étudiant UY1)',
      text: emojiText,
      time: 'à l\'instant',
    };
    setGroupReactions((prev) => [newReaction, ...prev.slice(0, 3)]);
  };

  // Format time display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular progress calculations
  const progressRatio = Math.max(0, Math.min(1, (totalDuration - timeLeft) / totalDuration));
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const totalFocusHours = useMemo(() => {
    const totalMinutes = completedSessions * 25;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }, [completedSessions]);

  return (
    <div className="space-y-6">
      {/* Top Banner : Synchronized Group Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Radio size={22} className={isGroupSyncActive && isRunning ? 'animate-pulse' : ''} />
              </div>
              {isGroupSyncActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Session de Groupe Synchronisée UY1
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En direct</span>
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {selectedGroup.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedGroup.subject} · {connectedStudentsCount} étudiants de Yaoundé I en sprint actif
              </p>
            </div>
          </div>

          {/* Group Switcher & Sync Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={selectedGroup.id}
                onChange={(e) => {
                  const grp = STUDY_GROUPS.find((g) => g.id === e.target.value);
                  if (grp) {
                    setSelectedGroup(grp);
                    setConnectedStudentsCount(grp.membersCount);
                  }
                }}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STUDY_GROUPS.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    Groupe : {grp.name} ({grp.membersCount} participants)
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setIsGroupSyncActive((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isGroupSyncActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Users size={14} />
              <span>{isGroupSyncActive ? 'Synchronisé' : 'Solo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pomodoro Clock Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column : Circular Timer & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8 max-w-full overflow-x-auto">
            {Object.values(MODES).map((mode) => {
              const Icon = mode.icon;
              const isSelected = currentMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleModeSwitch(mode.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Circular SVG Timer */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
              {/* Background Track Circle */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="none"
              />
              {/* Active Progress Circle */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                className={`${
                  currentMode === 'work'
                    ? 'stroke-indigo-600 dark:stroke-indigo-500'
                    : currentMode === 'shortBreak'
                    ? 'stroke-emerald-500 dark:stroke-emerald-400'
                    : 'stroke-blue-500 dark:stroke-blue-400'
                } transition-all duration-1000 ease-linear`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Content Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl md:text-6xl font-black tracking-tight font-mono text-slate-900 dark:text-slate-100">
                {timeFormatted}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                {isRunning ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ) : (
                  <Clock size={13} />
                )}
                <span>{isRunning ? 'Concentration active' : 'En pause'}</span>
              </span>
            </div>
          </div>

          {/* Quick Duration Fine-Tuning */}
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="text-slate-400">Ajuster durée :</span>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleAdjustTime(-5)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 disabled:opacity-40"
            >
              -5 min
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleAdjustTime(5)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 disabled:opacity-40"
            >
              +5 min
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={handleResetTimer}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Réinitialiser le compte à rebours"
            >
              <RotateCcw size={18} />
            </button>

            <button
              type="button"
              onClick={handleToggleTimer}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : currentMode === 'work'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              <span>{isRunning ? 'Pause' : 'Démarrer le Sprint'}</span>
            </button>

            <button
              type="button"
              onClick={handleSkipNext}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Passer à l'étape suivante"
            >
              <SkipForward size={18} />
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title={soundEnabled ? 'Alerte sonore activée' : 'Son désactivé'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-rose-500" />}
            </button>
          </div>
        </div>

        {/* Right Column : Metrics, Cycles & Group Pulse (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Daily Goal & Metric Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award size={15} className="text-amber-500" />
              <span>Bilan Pédagogique du Jour</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                  {completedSessions}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Pomodoros complétés
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {totalFocusHours}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Temps d'étude focalisée
                </div>
              </div>
            </div>

            {/* Cycle Visual Indicator (4 dots) */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>Cycle de travail en cours :</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Étape {(completedSessions % 4) + 1} / 4
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((stepIdx) => {
                  const isDone = completedSessions % 4 > stepIdx;
                  const isCurrent = completedSessions % 4 === stepIdx;

                  return (
                    <div
                      key={stepIdx}
                      className={`h-2.5 rounded-full transition-all ${
                        isDone
                          ? 'bg-indigo-600'
                          : isCurrent
                          ? 'bg-indigo-400 animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 italic">
                Une grande pause de 15 minutes est attribuée tous les 4 Pomodoros.
              </p>
            </div>
          </div>

          {/* Group Activity & Live Reactions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame size={15} className="text-rose-500" />
                <span>Activité du Groupe en Direct</span>
              </h4>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {connectedStudentsCount} en ligne
              </span>
            </div>

            {/* Quick Send Motivation reaction buttons */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handleSendReaction('🔥 Concentration max')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                🔥 Focus
              </button>
              <button
                type="button"
                onClick={() => handleSendReaction('☕ Pause méritée')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                ☕ Pause
              </button>
              <button
                type="button"
                onClick={() => handleSendReaction('💻 TP en cours')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                💻 TP
              </button>
              <button
                type="button"
                onClick={() => handleSendReaction('🎓 Force à nous !')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                🎓 Force
              </button>
            </div>

            {/* Recent Live Feed */}
            <div className="space-y-2 pt-1">
              {groupReactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                      {reaction.user.charAt(0)}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {reaction.user}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{reaction.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{reaction.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
