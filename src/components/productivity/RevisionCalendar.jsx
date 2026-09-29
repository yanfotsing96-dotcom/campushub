import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BookOpen,
  CalendarCheck,
} from 'lucide-react';
import { INITIAL_REVISION_EVENTS } from './data/productivityData';

const STORAGE_CALENDAR_KEY = 'campushub_revision_events';

export default function RevisionCalendar() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CALENDAR_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REVISION_EVENTS;
    } catch {
      return INITIAL_REVISION_EVENTS;
    }
  });

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    course: 'INF231',
    type: 'Révision',
    date: '2026-10-16',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Salle Machine 2',
    description: '',
  });

  // Save to localStorage
  const saveEvents = (updated) => {
    setEvents(updated);
    try {
      localStorage.setItem(STORAGE_CALENDAR_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur de sauvegarde locale :', err);
    }
  };

  const handleToggleComplete = (id) => {
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
    );
    saveEvents(updated);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    const created = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      isCompleted: false,
      priority: newEvent.type === 'Examen' ? 'high' : 'medium',
    };

    saveEvents([...events, created]);
    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      course: 'INF231',
      type: 'Révision',
      date: '2026-10-16',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Salle Machine 2',
      description: '',
    });
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedCourseFilter !== 'ALL' && ev.course !== selectedCourseFilter) {
        return false;
      }
      if (selectedDateFilter && ev.date !== selectedDateFilter) {
        return false;
      }
      return true;
    });
  }, [events, selectedCourseFilter, selectedDateFilter]);

  // Unique courses for filter
  const courseOptions = useMemo(() => {
    const set = new Set(events.map((e) => e.course));
    return ['ALL', ...Array.from(set)];
  }, [events]);

  // Generate and Download RFC 5545 .ics file
  const handleExportICal = () => {
    const formatICSDate = (dateStr, timeStr) => {
      // e.g. 2026-10-15 and 08:00 -> 20261015T080000Z
      const cleanDate = dateStr.replace(/-/g, '');
      const cleanTime = (timeStr || '00:00').replace(/:/g, '') + '00';
      return `${cleanDate}T${cleanTime}`;
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusHub//Revision Planning UY1//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:CampusHub UY1 - Calendrier de Révision',
      'X-WR-TIMEZONE:Africa/Douala',
    ];

    events.forEach((ev) => {
      const dtStart = formatICSDate(ev.date, ev.startTime);
      const dtEnd = formatICSDate(ev.date, ev.endTime || ev.startTime);
      const createdDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:campushub-${ev.id}@uy1.uninet.cm`);
      icsContent.push(`DTSTAMP:${createdDate}`);
      icsContent.push(`DTSTART:${dtStart}`);
      icsContent.push(`DTEND:${dtEnd}`);
      icsContent.push(`SUMMARY:[${ev.course}] ${ev.title}`);
      icsContent.push(`DESCRIPTION:${(ev.description || '').replace(/\n/g, '\\n')}`);
      icsContent.push(`LOCATION:${ev.location || 'Université de Yaoundé I'}`);
      icsContent.push(`STATUS:${ev.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campushub-planning-revisions-uy1.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Month navigation helpers
  const monthYearLabel = currentMonthDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const changeMonth = (delta) => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + delta, 1)
    );
  };

  // Month calendar grid generation
  const daysInMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayIndex = (new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    1
  ).getDay() + 6) % 7; // Monday as 0

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 mb-2">
              <CalendarCheck size={13} />
              <span>CampusHub · Planification Universitaire</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Calendrier de Révision & Échéances d'Examens
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Synchronisez vos épreuves, contrôles continus et séances d'étude avec Google Agenda et Outlook.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Plus size={14} />
              <span>Ajouter une séance</span>
            </button>

            <button
              type="button"
              onClick={handleExportICal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              title="Générer un fichier standard .ics"
            >
              <Download size={14} />
              <span>Exporter en iCal (.ics)</span>
            </button>
          </div>
        </div>

        {/* Course Filter Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter size={12} />
            <span>Matières :</span>
          </span>
          {courseOptions.map((code) => {
            const isSelected = selectedCourseFilter === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedCourseFilter(code)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {code === 'ALL' ? 'Toutes les matières' : code}
              </button>
            );
          })}

          {selectedDateFilter && (
            <button
              type="button"
              onClick={() => setSelectedDateFilter(null)}
              className="ml-auto px-2.5 py-1 text-[11px] rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 flex items-center gap-1"
            >
              <X size={12} />
              <span>Date : {selectedDateFilter}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Mini Month Calendar & Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Month View (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold capitalize text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon size={16} className="text-emerald-600" />
              <span>{monthYearLabel}</span>
            </h3>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-2">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div>Sam</div>
            <div>Dim</div>
          </div>

          {/* Calendar day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-9" />
            ))}

            {/* Month days */}
            {daysArray.map((day) => {
              const dayStr = `${currentMonthDate.getFullYear()}-${String(
                currentMonthDate.getMonth() + 1
              ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              const dayEvents = events.filter((e) => e.date === dayStr);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDateFilter === dayStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDateFilter(isSelected ? null : dayStr)}
                  className={`h-9 rounded-xl text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : hasEvents
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick info note */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cliquez sur un jour avec point vert pour filtrer</span>
            <span>Total : {events.length} sessions</span>
          </div>
        </div>

        {/* Right Column: Events Detailed List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {filteredEvents.length} échéance{filteredEvents.length > 1 ? 's' : ''} planifiée{filteredEvents.length > 1 ? 's' : ''}
            </span>
            <span>
              {filteredEvents.filter((e) => e.isCompleted).length} révisée(s)
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4.5 transition-all shadow-xs flex items-start justify-between gap-4 ${
                  ev.isCompleted
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : ev.type === 'Examen'
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ev.type === 'Examen'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                          : ev.type === 'Devoir'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                          : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {ev.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                      {ev.course}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-bold text-slate-900 dark:text-slate-100 ${
                      ev.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {ev.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500" />
                      <span>{ev.date} · {ev.startTime} - {ev.endTime}</span>
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-indigo-500" />
                        <span>{ev.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Mark as Completed Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(ev.id)}
                  className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                    ev.isCompleted
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={ev.isCompleted ? 'Marquer comme non terminé' : 'Marquer comme révisé'}
                >
                  <CheckCircle2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Aucune séance ne correspond aux critères.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal : Ajouter une séance */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <CalendarIcon size={18} className="text-emerald-600" />
              <span>Programmer une séance de révision</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Planifiez vos révisions et examens pour la session de l'Université de Yaoundé I.
            </p>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Intitulé de la session *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex : Révision Arbres Binaires et Listes C"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Matière / Code UE
                  </label>
                  <input
                    type="text"
                    value={newEvent.course}
                    onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
                    placeholder="INF231, INF201..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type d'échéance
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Révision">Session Révision</option>
                    <option value="Examen">Examen Final</option>
                    <option value="Devoir">Contrôle Continu</option>
                    <option value="Projet">Soutenance / TPE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heure début
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lieu (Campus UY1 / En ligne)
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Ex : Salle Machine Ngoa-Ekellé"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Objectifs
                </label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Points de cours ou exercices clés à traiter..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Enregistrer la séance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
