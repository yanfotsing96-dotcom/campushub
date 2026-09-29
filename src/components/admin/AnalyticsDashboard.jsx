import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  Layers,
  Clock,
  Star,
  CheckCircle2,
  Building,
  Radio,
} from 'lucide-react';
import {
  ANALYTICS_METRICS,
  DEPARTMENT_ACTIVITY,
  HOURLY_CAMPUS_TRAFFIC,
  TOP_CONSULTED_COURSES,
  RECENT_AUDIT_LOGS,
} from './data/adminData';

export default function AnalyticsDashboard() {
  const metrics = ANALYTICS_METRICS;

  return (
    <div className="space-y-6">
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Étudiants Inscrits
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {metrics.totalStudents.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp size={13} />
            <span>{metrics.studentsGrowth} ce semestre</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Documents & Polycopiés
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {metrics.sharedDocuments.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp size={13} />
            <span>{metrics.documentsGrowth}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Taux d'Engagement
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity size={18} />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {metrics.engagementRate}%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp size={13} />
            <span>{metrics.engagementGrowth} d'avis positifs</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sessions en Direct
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Radio size={18} className="animate-pulse" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {metrics.activeSessionsNow}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ngoa-Ekellé & En ligne</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: Department Activity & Hourly Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Department Activity Bars (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building size={16} className="text-indigo-600" />
              <span>Activité par Département (Faculté des Sciences UY1)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Parts (%)
            </span>
          </div>

          <div className="space-y-3.5">
            {DEPARTMENT_ACTIVITY.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {dept.name}
                  </span>
                  <span className="font-mono text-slate-500 font-bold">
                    {dept.studentsCount} étudiants ({dept.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${dept.percentage}%`,
                      backgroundColor: dept.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Campus Traffic Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" />
              <span>Charge & Fréquentation sur le Campus (24h)</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Pics à 10h et 20h
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intensité d'utilisation des salles machines et consultations depuis les résidences universitaires.
          </p>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {HOURLY_CAMPUS_TRAFFIC.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t-lg bg-emerald-500/80 hover:bg-emerald-600 transition-all duration-500 relative group"
                  style={{ height: `${item.load}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white px-1.5 py-0.5 rounded pointer-events-none">
                    {item.load}%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Courses & System Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Consulted Courses Table (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            <span>Top Cours & UE les Plus Consultées (UY1)</span>
          </h3>

          <div className="space-y-2.5">
            {TOP_CONSULTED_COURSES.map((course, idx) => (
              <div
                key={course.code}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-400 font-mono w-4">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                        {course.code}
                      </span>
                      <span>{course.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {course.views.toLocaleString()} vues
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-amber-500">
                    <Star size={11} fill="currentColor" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Audit Logs (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-600" />
            <span>Journal d'Audit & Événements Système Récents</span>
          </h3>

          <div className="space-y-2.5">
            {RECENT_AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {log.action}
                  </span>
                  <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Opérateur : {log.admin}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
