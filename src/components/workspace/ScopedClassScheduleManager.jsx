import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { academicAccessService } from '../../services/academicAccessService';
import { ROLES, normalizeRole } from '../../constants/rbacConstants';

/**
 * ScopedClassScheduleManager
 * Gestion et affichage du planning de cours de la filière et du niveau
 * Modification/Ajout réservé au Délégué, Modérateur et Administrateur.
 */
export default function ScopedClassScheduleManager({ filiere, niveau }) {
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role);
  const canManage = currentRole === ROLES.DELEGATE || currentRole === ROLES.MODERATOR || currentRole === ROLES.ADMIN;

  const schedule = useMemo(() => {
    return academicAccessService.getScopedSchedule(user, { filiere, niveau });
  }, [user, filiere, niveau]);

  // Modal d'ajout de cours pour Délégué
  const [modalOpen, setModalOpen] = useState(false);
  const [newDay, setNewDay] = useState('Lundi');
  const [newTime, setNewTime] = useState('08h00 - 11h00');
  const [newUe, setNewUe] = useState('');
  const [newType, setNewType] = useState('Cours Magistral');
  const [newProf, setNewProf] = useState('');
  const [newSalle, setNewSalle] = useState(schedule.amphi || 'Amphi 250');
  const [toast, setToast] = useState('');

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newUe.trim()) return;

    const newSlot = {
      day: newDay,
      time: newTime,
      ue: newUe.toUpperCase().trim(),
      type: newType,
      prof: newProf.trim() || 'Enseignant responsable',
      salle: newSalle,
    };

    const updated = {
      ...schedule,
      slots: [...(schedule.slots || []), newSlot],
    };

    // Sauvegarde
    const allSchedules = academicAccessService.loadSchedules();
    const filtered = allSchedules.filter((s) => s.id !== schedule.id);
    academicAccessService.saveSchedules([...filtered, updated]);

    setToast(`Séance de ${newUe} enregistrée dans le planning de ${filiere} (${niveau}).`);
    setModalOpen(false);
    setNewUe('');
    setTimeout(() => setToast(''), 4000);
  };

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="space-y-4">
      {/* En-tête du Planning */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CalendarDays size={12} />
              <span>Emploi du Temps Officiel</span>
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              {filiere} · {niveau}
            </span>
          </div>

          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>{schedule.amphi}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {schedule.semestre} · Mis à jour en temps réel selon les annonces de la scolarité.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Ajouter une séance (Délégué)</span>
          </button>
        )}
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Grille des Jours de la Semaine */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {daysOfWeek.map((day) => {
          const daySlots = (schedule.slots || []).filter((s) => s.day === day);

          return (
            <div
              key={day}
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-black text-sm text-white flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-400" />
                  <span>{day}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {daySlots.length} séance{daySlots.length > 1 ? 's' : ''}
                </span>
              </div>

              {daySlots.length === 0 ? (
                <div className="py-6 text-center text-slate-600 text-xs italic">
                  Aucun cours programmé
                </div>
              ) : (
                <div className="space-y-2.5 flex-1">
                  {daySlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 hover:border-indigo-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-indigo-600 text-white">
                          {slot.ue}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1">
                          <Clock size={11} className="text-indigo-400" />
                          <span>{slot.time}</span>
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-100">
                        {slot.type}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <User size={11} className="text-slate-500" />
                          <span className="truncate">{slot.prof}</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <MapPin size={11} />
                          <span>{slot.salle}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Ajout Séance */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-emerald-400" />
              <span>Programmer une séance · {filiere} ({niveau})</span>
            </h4>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Jour de la semaine</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Code UE (ex: INF201)</label>
                  <input
                    type="text"
                    required
                    value={newUe}
                    onChange={(e) => setNewUe(e.target.value)}
                    placeholder="INF201"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Créneau horaire</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="08h00 - 11h00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Type de cours</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Cours Magistral">Cours Magistral</option>
                  <option value="Travaux Dirigés (TD)">Travaux Dirigés (TD)</option>
                  <option value="Travaux Pratiques (TP)">Travaux Pratiques (TP)</option>
                  <option value="Rattrapage">Rattrapage</option>
                  <option value="Contrôle Continu (CC)">Contrôle Continu (CC)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Enseignant</label>
                  <input
                    type="text"
                    value={newProf}
                    onChange={(e) => setNewProf(e.target.value)}
                    placeholder="Dr. Mbarga"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Salle / Amphi</label>
                  <input
                    type="text"
                    value={newSalle}
                    onChange={(e) => setNewSalle(e.target.value)}
                    placeholder="Amphi 250"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
