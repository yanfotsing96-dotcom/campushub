import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  X,
  GraduationCap,
} from 'lucide-react';
import { INITIAL_ADMIN_USERS } from './data/adminData';

const STORAGE_USERS_KEY = 'campushub_admin_users';

export default function UserModerationManager() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [selectedUserToWarn, setSelectedUserToWarn] = useState(null);
  const [warnReason, setWarnReason] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');

  const saveUsers = (updated) => {
    setUsers(updated);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  // Toggle user status (Block / Unblock)
  const handleToggleBlock = (userId) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Bloqué' ? 'Actif' : 'Bloqué';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
    setBannerMessage('Statut du compte mis à jour avec succès.');
    setTimeout(() => setBannerMessage(''), 3000);
  };

  // Change Role
  const handleChangeRole = (userId, newRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsers(updated);
    setSelectedUserToEdit(null);
    setBannerMessage(`Rôle mis à jour vers : ${newRole}`);
    setTimeout(() => setBannerMessage(''), 3000);
  };

  // Submit Official Warning
  const handleSendWarning = (e) => {
    e.preventDefault();
    if (!selectedUserToWarn || !warnReason.trim()) return;

    const updated = users.map((u) => {
      if (u.id === selectedUserToWarn.id) {
        return {
          ...u,
          status: 'Averti',
          reportsReceived: (u.reportsReceived || 0) + 1,
        };
      }
      return u;
    });

    saveUsers(updated);
    setSelectedUserToWarn(null);
    setWarnReason('');
    setBannerMessage(`Avertissement officiel notifié à ${selectedUserToWarn.name}.`);
    setTimeout(() => setBannerMessage(''), 4000);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.matricule.toLowerCase().includes(q) ||
        u.filiere.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 mb-2">
              <Users size={13} />
              <span>CampusHub · Contrôle des Accès & Sécurité UY1</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Gestion des Comptes & Modération des Utilisateurs
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supervisez les rôles académiques, suspendez les comptes abusifs et protégez la communauté estudiantine.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{users.length} comptes enregistrés</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{users.filter((u) => u.status === 'Actif').length} actifs</span>
            <span>•</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{users.filter((u) => u.status === 'Bloqué').length} bloqués</span>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, matricule (ex: 23S10482), email..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Role & Status Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rôle :</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Tous les rôles</option>
                <option value="Étudiant">Étudiant</option>
                <option value="Délégué">Délégué de filière</option>
                <option value="Modérateur">Modérateur</option>
                <option value="Enseignant">Enseignant</option>
                <option value="Administrateur">Administrateur</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Statut :</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Averti">Averti</option>
                <option value="Bloqué">Bloqué</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {bannerMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* SaaS User Moderation Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Utilisateur / Matricule</th>
                <th className="py-3.5 px-4">Filière / Département</th>
                <th className="py-3.5 px-4">Rôle Académique</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Inscription</th>
                <th className="py-3.5 px-4 text-right">Actions de Modération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* User name & email */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: user.avatarBg }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {user.matricule} · {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Filière */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {user.filiere}
                  </td>

                  {/* Role badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'Administrateur'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : user.role === 'Enseignant'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : user.role === 'Délégué'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : user.role === 'Modérateur'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {user.role === 'Administrateur' ? (
                        <Shield size={11} />
                      ) : user.role === 'Enseignant' ? (
                        <GraduationCap size={11} />
                      ) : (
                        <ShieldCheck size={11} />
                      )}
                      <span>{user.role}</span>
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'Actif'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : user.status === 'Averti'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Actif'
                            ? 'bg-emerald-500'
                            : user.status === 'Averti'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>{user.status}</span>
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {user.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUserToEdit(user)}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                        title="Modifier rôle"
                      >
                        Rôle
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUserToWarn(user)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-amber-50 text-amber-600 dark:hover:bg-slate-800"
                        title="Émettre un avertissement"
                      >
                        <AlertTriangle size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleBlock(user.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.status === 'Bloqué'
                            ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            : 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'
                        }`}
                        title={user.status === 'Bloqué' ? 'Débloquer le compte' : 'Bloquer le compte'}
                      >
                        {user.status === 'Bloqué' ? <UserCheck size={13} /> : <UserX size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Modifier Rôle */}
      {selectedUserToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedUserToEdit(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-indigo-600" />
              <span>Modifier le rôle académique</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pour {selectedUserToEdit.name} ({selectedUserToEdit.matricule}).
            </p>

            <div className="space-y-2">
              {['Étudiant', 'Délégué', 'Modérateur', 'Enseignant', 'Administrateur'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChangeRole(selectedUserToEdit.id, r)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                    selectedUserToEdit.role === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{r}</span>
                  {selectedUserToEdit.role === r && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Avertir l'utilisateur */}
      {selectedUserToWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedUserToWarn(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Notifier un avertissement officiel</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Cet avertissement sera consigné au dossier de l'étudiant {selectedUserToWarn.name}.
            </p>

            <form onSubmit={handleSendWarning} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Motif de l'avertissement *
                </label>
                <textarea
                  rows={3}
                  required
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  placeholder="Ex : Publication d'un corrigé d'examen comportant du plagiat non cité, comportement déplacé sur le forum..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedUserToWarn(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                >
                  Confirmer l'avertissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
