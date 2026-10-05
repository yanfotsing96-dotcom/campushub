import { useState } from 'react';
import {
  Award,
  BellRing,
  Pin,
  Calendar,
  Users,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCampusHub } from '../../hooks/useCampusHub';
import RoleBadge from '../../components/common/RoleBadge';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: '🚨 Rattrapage obligatoire TP INF201 (Algorithmique & Pointeurs C)',
    content: 'Suite à l\'interruption technique de mardi, la séance de travaux pratiques sur les arbres binaires de recherche (ABR) est reprogrammée ce samedi à 08h00 au Laboratoire Informatique B (Campus Ngoa-Ekellé). Venez avec vos ordinateurs portables ou clés USB.',
    course: 'INF201',
    isPinned: true,
    author: 'Brice Kamga (Délégué Principal)',
    date: 'Aujourd\'hui à 07:45',
    category: 'Rattrapage TP',
  },
  {
    id: 2,
    title: '📢 Déplacement du Contrôle Continu (CC) de Mathématiques MAT201',
    content: 'Le Pr. Nguemo confirme que le CC initialement prévu en Amphi 502 aura finalement lieu en Amphi 1001 en raison des effectifs conjoints avec la filière Physique.',
    course: 'MAT201',
    isPinned: true,
    author: 'Brice Kamga (Délégué Principal)',
    date: 'Hier à 16:30',
    category: 'Changement Salle',
  },
  {
    id: 3,
    title: '📚 Distribution des polycopiés imprimés d\'Architecture INF205',
    content: 'Les fiches de TD n°3 sont disponibles au secrétariat du département Informatique. Pensez à récupérer votre exemplaire avant vendredi 15h.',
    course: 'INF205',
    isPinned: false,
    author: 'Carine Mbida (Déléguée Adjointe)',
    date: 'Il y a 3 jours',
    category: 'Documentation',
  },
];

const INITIAL_SCHEDULE = [
  {
    id: 101,
    course: 'INF201',
    title: 'Contrôle Continu n°1 : Structures de Données & Arbres C',
    date: 'Samedi 10 Octobre 2026',
    time: '08h00 - 10h00',
    location: 'Amphi 1001 · UY1 Ngoa-Ekellé',
    weight: '30% Note Finale',
  },
  {
    id: 102,
    course: 'INF203',
    title: 'Rendu Projet Système : Mini-Shell UNIX & Fork/Execvp',
    date: 'Vendredi 16 Octobre 2026',
    time: '23h59 (Délai strict sur CampusHub)',
    location: 'Dépôt Numérique Git/Zip',
    weight: '40% Note Pratique',
  },
  {
    id: 103,
    course: 'MAT201',
    title: 'Partiel Écrit : Séries Entières & Calcul d\'Intégrales',
    date: 'Mardi 20 Octobre 2026',
    time: '14h00 - 17h00',
    location: 'Amphi 250 · Faculté des Sciences',
    weight: '30% Note Finale',
  },
];

export default function DelegateDashboardPage() {
  const { student, selectedUniversity, triggerToast } = useCampusHub();
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [schedule] = useState(INITIAL_SCHEDULE);

  // Announcement Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCourse, setNewCourse] = useState('INF201');
  const [newCategory, setNewCategory] = useState('Avis Général');
  const [newIsPinned, setNewIsPinned] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Handle Publish Announcement
  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created = {
      id: Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      course: newCourse,
      isPinned: newIsPinned,
      author: `${student.name} (Délégué Promotion)`,
      date: 'À l\'instant',
      category: newCategory,
    };

    setAnnouncements((prev) => [created, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsFormOpen(false);

    triggerToast({
      title: 'Avis officiel diffusé ! 📢',
      message: 'Votre annonce a été notifiée à l\'ensemble des étudiants de la promotion.',
      type: 'success',
    });
  };

  const handleTogglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    triggerToast({
      title: 'Avis supprimé',
      message: 'L\'annonce a été retirée du tableau d\'affichage.',
      type: 'info',
    });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* SaaS Hero Header for Class Delegate */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-emerald-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Award size={14} className="text-emerald-400" />
              <span>Espace Délégué de Promotion · Module Réservé</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Tableau de Bord Délégué de Classe</span>
              <RoleBadge role="delegate" size="md" />
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Gestion de promotion pour la filière <strong>{student.filiere}</strong> ({student.niveau}) à l'<strong>{selectedUniversity.name}</strong>. Diffusez les avis officiels, gérez le calendrier d'amphi et coordonnez les délégués de groupe.
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="grid grid-cols-2 gap-3 min-w-[260px] self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="text-2xl font-black text-white">{announcements.length}</div>
              <div className="text-[11px] text-emerald-300 font-semibold">Avis en cours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="text-2xl font-black text-white">184</div>
              <div className="text-[11px] text-emerald-300 font-semibold">Étudiants promotion</div>
            </div>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Left Column (Announcements Broadcast) | Right Column (Schedule & Coordination) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Announcements Stream */}
        <div className="lg:col-span-2 space-y-5">
          {/* Action Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BellRing size={18} className="text-emerald-600" />
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                Avis Officiels d'Amphi ({announcements.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus size={14} />
              <span>{isFormOpen ? 'Fermer' : 'Rédiger un avis officiel'}</span>
            </button>
          </div>

          {/* New Announcement Form (Collapsible) */}
          {isFormOpen && (
            <form
              onSubmit={handlePublishAnnouncement}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 md:p-6 shadow-md space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Diffusion d'une Annonce de Promotion
                  </h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newIsPinned}
                    onChange={(e) => setNewIsPinned(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Épingler en tête d'amphi</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unité d'Enseignement (UE) :
                  </label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="INF201">INF201 · Algorithmique & Structures de Données</option>
                    <option value="INF203">INF203 · Systèmes d'Exploitation & POSIX</option>
                    <option value="INF205">INF205 · Architecture des Ordinateurs</option>
                    <option value="MAT201">MAT201 · Analyse Mathématique II</option>
                    <option value="GÉNÉRAL">GÉNÉRAL · Vie de Promotion & Scolarité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type d'Annonce :
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="Rattrapage TP">Rattrapage de Cours / TP</option>
                    <option value="Changement Salle">Changement de Salle / Amphi</option>
                    <option value="Examen CC">Échéance Contrôle Continu / Partiel</option>
                    <option value="Documentation">Polycopiés & Fiches de TD</option>
                    <option value="Avis Général">Information Générale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre percutant de l'avis * :
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Rattrapage obligatoire TP INF201 samedi matin en Amphi 250..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Détails et instructions pour la promotion * :
                </label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Détaillez les consignes du professeur, les salles, les groupes concernés..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Publier l'avis officiel
                </button>
              </div>
            </form>
          )}

          {/* Announcements Feed */}
          <div className="space-y-3.5">
            {announcements.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border shadow-xs transition-all relative ${
                  item.isPinned
                    ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.course}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                        <Pin size={11} className="rotate-45" />
                        <span>Épinglé en tête</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.content}
                </p>

                {/* Footer with Author and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(item.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        item.isPinned
                          ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={item.isPinned ? 'Détacher' : 'Épingler'}
                    >
                      <Pin size={13} className={item.isPinned ? 'fill-current' : ''} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                      title="Supprimer l'avis"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Calendar of CC & Roster */}
        <div className="space-y-6">
          {/* Exam Deadlines & Calendar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Agenda des Examens & CC
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Promotion L2
              </span>
            </div>

            <div className="space-y-3">
              {schedule.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                      {ev.course}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {ev.weight}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {ev.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400 flex-shrink-0" />
                      <span>{ev.date} · {ev.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Promotion Group & Delegates Roster */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Users size={18} className="text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Coordination des Délégués
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Brice Kamga
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Délégué Principal · 23U1084
                  </div>
                </div>
                <RoleBadge role="delegate" size="xs" />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Carine Mbida
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Déléguée Adjointe · 23U2419
                  </div>
                </div>
                <RoleBadge role="delegate" size="xs" />
              </div>
            </div>

            {/* Official Broadcast Link */}
            <div className="pt-2">
              <a
                href="#whatsapp-broadcast"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast({
                    title: 'Lien du Canal Officiel',
                    message: 'Canal d\'annonces WhatsApp promotion L2 Info UY1 copié !',
                    type: 'info',
                  });
                }}
                className="w-full py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Canal d'Amphi Officiel (WhatsApp)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
