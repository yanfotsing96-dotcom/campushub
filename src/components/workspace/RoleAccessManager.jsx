import { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Crown,
  BookOpen,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS, normalizeRole, verifyRolePasscode } from '../../constants/rbacConstants';
import RoleBadge from '../common/RoleBadge';

/**
 * RoleAccessManager
 * Panneau de contrôle des permissions et simulateur/sélecteur de rôles par filière.
 * Permet de basculer de rôle (Étudiant -> Délégué -> Modérateur -> Admin)
 * en fournissant le code d'accès de sécurité ou en mode promotion.
 */
export default function RoleAccessManager({ filiere, niveau }) {
  const { user, switchRole } = useAuth();
  const currentRole = normalizeRole(user?.role);

  const [targetRole, setTargetRole] = useState(currentRole);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const rolesConfig = [
    {
      id: ROLES.STUDENT,
      label: 'Étudiant',
      color: 'indigo',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: BookOpen,
      requiresPasscode: false,
      permissions: [
        'Accès exclusif aux cours et annales de sa filière et de son niveau',
        'Accès au playground adapté (Code, Labo chimie/physique, Atelier FALSH)',
        'Consultation des plannings et du tableau d\'affichage de sa classe',
        'Téléchargement certifié des épreuves et participation aux compositions',
      ],
      restrictions: [
        'Étanche : Aucun accès aux cours d\'autres niveaux ou filières',
        'Lecture seule sur les avis de classe et les plannings',
      ],
    },
    {
      id: ROLES.DELEGATE,
      label: 'Délégué (Class Rep)',
      color: 'emerald',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Award,
      requiresPasscode: true,
      passcodeHint: 'DELEGUE-UY1-2026',
      permissions: [
        'Toutes les permissions d\'un étudiant',
        'Publication d\'annonces officielles sur le tableau d\'amphi de la filière',
        'Gestion et mise à jour de l\'emploi du temps de la classe',
        'Dépôt de supports de cours et annales pour sa promotion',
        'Modération basique des échanges entre camarades de classe',
      ],
      restrictions: [
        'Restreint strictement à sa promotion et son niveau',
        'Pas d\'accès aux outils de sanction globale ou configuration système',
      ],
    },
    {
      id: ROLES.MODERATOR,
      label: 'Modérateur',
      color: 'sky',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: ShieldCheck,
      requiresPasscode: true,
      passcodeHint: 'MOD-SECURITY-7729',
      permissions: [
        'Toutes les permissions du délégué',
        'Validation et contrôle qualité des documents partagés',
        'Audit anti-plagiat et traitement des signalements de documents',
        'Modération multi-classes et gestion des accès aux ressources',
      ],
      restrictions: [
        'Pas d\'accès aux privilèges d\'administration système ou suppression de comptes',
      ],
    },
    {
      id: ROLES.ADMIN,
      label: 'Administrateur',
      color: 'amber',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Crown,
      requiresPasscode: true,
      passcodeHint: 'SUPERADMIN-UY1-ROOT',
      permissions: [
        'Plein contrôle et supervision globale de toutes les filières',
        'Bascule instantanée d\'audit sur n\'importe quelle filière et niveau',
        'Gestion des rôles, promotion des comptes et configuration système',
        'Statistiques académiques complètes et journal d\'audit MINESUP',
      ],
      restrictions: [
        'Aucune restriction (Super Admin)',
      ],
    },
  ];

  const handleApplyRole = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (targetRole === ROLES.STUDENT) {
      if (switchRole) switchRole(ROLES.STUDENT);
      setSuccessMsg('Rôle défini sur Étudiant standard.');
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }

    // Vérification du mot de passe secret officiel
    const verification = verifyRolePasscode(targetRole, passcode);
    if (!verification.valid) {
      setErrorMsg(verification.error || 'Code d\'accès secret incorrect.');
      return;
    }

    if (switchRole) switchRole(targetRole);
    setSuccessMsg(`Félicitations ! Vous possédez désormais le rôle ${ROLE_LABELS[targetRole]}. Vos permissions ont été étendues.`);
    setPasscode('');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Système RBAC & Contrôle d'Accès</span>
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              {filiere} · {niveau}
            </span>
          </div>

          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Hiérarchie des Rôles & Permissions de Filière</span>
          </h3>
          <p className="text-xs text-slate-400">
            Votre rôle actuel détermine strictement les actions autorisées dans l'espace de travail.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <RoleBadge role={currentRole} size="md" />
        </div>
      </div>

      {/* Cartes des Rôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rolesConfig.map((r) => {
          const Icon = r.icon;
          const isCurrent = currentRole === r.id;

          return (
            <div
              key={r.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border transition-all ${
                isCurrent
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              } space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${r.badgeBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{r.label}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Rôle Actuel
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Périmètre : {r.id === ROLES.ADMIN ? 'Université complète' : `${filiere} (${niveau})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Permissions autorisées */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Permissions accordées :
                </span>
                <ul className="space-y-1 text-slate-300">
                  {r.permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restrictions */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-400 flex items-center gap-1">
                  <Lock size={11} className="text-amber-400" />
                  <span>Restrictions de sécurité :</span>
                </span>
                <ul className="space-y-0.5 pl-3 list-disc text-slate-400">
                  {r.restrictions.map((res, idx) => (
                    <li key={idx}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulaire de Bascule de Rôle avec Code d'Accès */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <KeyRound size={16} className="text-indigo-400" />
          <span>Bascule de Rôle & Authentification Sécurisée (Passcode Amphi / DSI)</span>
        </h4>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleApplyRole} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Rôle cible</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
            >
              <option value={ROLES.STUDENT}>Étudiant (Sans code)</option>
              <option value={ROLES.DELEGATE}>Délégué de classe</option>
              <option value={ROLES.MODERATOR}>Modérateur académique</option>
              <option value={ROLES.ADMIN}>Administrateur UY1</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">
              Code d'accès secret {targetRole !== ROLES.STUDENT && <span className="text-rose-400">*</span>}
            </label>
            <input
              type="text"
              disabled={targetRole === ROLES.STUDENT}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={
                targetRole === ROLES.DELEGATE
                  ? 'ex: DELEGUE-UY1-2026'
                  : targetRole === ROLES.MODERATOR
                  ? 'ex: MOD-SECURITY-7729'
                  : targetRole === ROLES.ADMIN
                  ? 'ex: SUPERADMIN-UY1-ROOT'
                  : 'Non requis pour étudiant'
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder:text-slate-600 disabled:opacity-40"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20"
            >
              <KeyRound size={14} />
              <span>Valider le rôle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
