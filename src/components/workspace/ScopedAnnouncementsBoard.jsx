import { useState } from 'react';
import {
  Pin,
  Plus,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { academicAccessService } from '../../services/academicAccessService';
import { ROLES, normalizeRole } from '../../constants/rbacConstants';

/**
 * ScopedAnnouncementsBoard
 * Tableau d'annonces de classe cloisonné par filière et niveau
 * Publication réservée au Délégué, Modérateur et Administrateur.
 */
export default function ScopedAnnouncementsBoard({ filiere, niveau }) {
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role);
  const canPublish = currentRole === ROLES.DELEGATE || currentRole === ROLES.MODERATOR || currentRole === ROLES.ADMIN;

  const [announcements, setAnnouncements] = useState(() => {
    return academicAccessService.getScopedAnnouncements(user, { filiere, niveau });
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState('normal'); // high, medium, normal
  const [newPinned, setNewPinned] = useState(false);
  const [toast, setToast] = useState('');

  const refreshAnnouncements = () => {
    setAnnouncements(academicAccessService.getScopedAnnouncements(user, { filiere, niveau }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      academicAccessService.publishAnnouncement(user, {
        title: newTitle.trim(),
        content: newContent.trim(),
        priority: newPriority,
        pinned: newPinned,
      });

      setToast(`Avis officiel publié avec succès pour la promotion ${filiere} (${niveau}).`);
      setModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewPinned(false);
      refreshAnnouncements();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Megaphone size={12} />
              <span>Tableau d'Affichage Officiel</span>
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              {filiere} · {niveau}
            </span>
          </div>

          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Avis et Communications d'Amphi</span>
          </h3>
          <p className="text-xs text-slate-400">
            Relais officiel des délégués de filière, chefs de départements et enseignants responsables.
          </p>
        </div>

        {canPublish && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Publier un avis (Délégué)</span>
          </button>
        )}
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Liste des annonces */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs italic">
            Aucun avis officiel affiché pour votre classe pour le moment.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all ${
                ann.pinned
                  ? 'border-indigo-500/50 shadow-md shadow-indigo-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              } space-y-2.5`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {ann.pinned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Pin size={10} />
                      <span>Épinglé</span>
                    </span>
                  )}
                  {ann.priority === 'high' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      <span>Urgent</span>
                    </span>
                  )}
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {ann.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{ann.date}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ann.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <User size={12} className="text-indigo-400" />
                  <span>{ann.author}</span>
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  {filiere} · {niveau}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Publication */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone size={18} className="text-indigo-400" />
              <span>Publier un avis d'amphi · {filiere} ({niveau})</span>
            </h4>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Titre de l'annonce</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Rattrapage TP ou Déplacement d'amphi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Message officiel</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Précisez la date, la salle, les consignes et les enseignants concernés..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Niveau d'urgence</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Important</option>
                    <option value="high">Urgent</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span>Épingler en haut de l'amphi</span>
                  </label>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Diffuser l'annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
