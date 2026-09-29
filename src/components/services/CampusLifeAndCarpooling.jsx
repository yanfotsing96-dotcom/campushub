import { useState } from 'react';
import {
  Car,
  Compass,
  Heart,
  Plus,
  MapPin,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import {
  INITIAL_CARPOOL_RIDES,
  INITIAL_CAMPUS_TIPS,
  INITIAL_MOTIVATION_POSTS,
} from './data/servicesData';

const STORAGE_CARPOOL_KEY = 'campushub_services_carpool';
const STORAGE_POSTS_KEY = 'campushub_services_motivation_posts';

export default function CampusLifeAndCarpooling() {
  const [activeSection, setActiveSection] = useState('carpool'); // 'carpool', 'tips', 'motivation'

  // Carpool State
  const [rides, setRides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CARPOOL_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CARPOOL_RIDES;
    } catch {
      return INITIAL_CARPOOL_RIDES;
    }
  });

  // Motivation Posts State
  const [motivationPosts, setMotivationPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MOTIVATION_POSTS;
    } catch {
      return INITIAL_MOTIVATION_POSTS;
    }
  });

  // Modals state
  const [isNewRideModalOpen, setIsNewRideModalOpen] = useState(false);
  const [selectedRideToBook, setSelectedRideToBook] = useState(null);
  const [newRideData, setNewRideData] = useState({
    departure: '',
    destination: 'Campus Ngoa-Ekellé (Château UY1)',
    departureTime: '07:30',
    availableSeats: 3,
    contribution: '250 FCFA',
    notes: '',
  });

  const [newMotivationText, setNewMotivationText] = useState('');
  const [newMotivationTag, setNewMotivationTag] = useState('Session d\'Examens');
  const [successBanner, setSuccessBanner] = useState('');

  // Handle Booking Seat
  const handleBookSeat = (rideId) => {
    const updated = rides.map((r) => {
      if (r.id === rideId && r.availableSeats > 0) {
        return { ...r, availableSeats: r.availableSeats - 1 };
      }
      return r;
    });
    setRides(updated);
    try {
      localStorage.setItem(STORAGE_CARPOOL_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
    setSelectedRideToBook(null);
    setSuccessBanner('Votre place de covoiturage a été réservée ! Le conducteur a été prévenu.');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Handle Adding a new ride
  const handleAddRide = (e) => {
    e.preventDefault();
    if (!newRideData.departure.trim()) return;

    const createdRide = {
      id: `ride-${Date.now()}`,
      driver: 'Yanick Fotsing (Moi)',
      matricule: '23S40192',
      filiere: 'L2 Informatique',
      vehicle: 'Véhicule Partagé UY1',
      departure: newRideData.departure.trim(),
      destination: newRideData.destination,
      date: 'Lundi à Vendredi',
      departureTime: newRideData.departureTime,
      availableSeats: Number(newRideData.availableSeats) || 2,
      contribution: newRideData.contribution || 'Gratuit pour camarades',
      notes: newRideData.notes.trim() || 'Départ ponctuel pour les cours de 8h.',
      phone: '+237 677 84 92 10',
    };

    const updated = [createdRide, ...rides];
    setRides(updated);
    localStorage.setItem(STORAGE_CARPOOL_KEY, JSON.stringify(updated));
    setIsNewRideModalOpen(false);
    setNewRideData({
      departure: '',
      destination: 'Campus Ngoa-Ekellé (Château UY1)',
      departureTime: '07:30',
      availableSeats: 3,
      contribution: '250 FCFA',
      notes: '',
    });
    setSuccessBanner('Votre trajet de covoiturage étudiant a été publié avec succès.');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Handle Like Motivation Post
  const handleLikePost = (postId) => {
    const updated = motivationPosts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    );
    setMotivationPosts(updated);
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  // Handle Submit Motivation Post
  const handleAddMotivationPost = (e) => {
    e.preventDefault();
    if (!newMotivationText.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: 'Yanick Fotsing (L2 Info)',
      date: 'À l\'instant',
      tag: newMotivationTag,
      likes: 1,
      content: `« ${newMotivationText.trim()} »`,
      avatarBg: '#8b5cf6',
    };

    const updated = [newPost, ...motivationPosts];
    setMotivationPosts(updated);
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updated));
    setNewMotivationText('');
    setSuccessBanner('Votre message d\'encouragement a été affiché sur le mur !');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 mb-2">
              <Compass size={13} />
              <span>CampusHub · Vie Pratique & Solidarité</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Covoiturage Étudiant, Bons Plans & Mur de Motivation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Facilitez vos trajets vers Ngoa-Ekellé, découvrez les bons plans du campus et boostez le moral de la communauté.
            </p>
          </div>

          {/* Sub-section Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveSection('carpool')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'carpool'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Car size={13} />
              <span>Covoiturage ({rides.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('tips')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'tips'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles size={13} />
              <span>Bons Plans Campus</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('motivation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'motivation'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Heart size={13} />
              <span>Mur de Motivation</span>
            </button>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 1. Carpool Section */}
      {activeSection === 'carpool' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Trajets disponibles vers le campus de Ngoa-Ekellé</span>
            <button
              type="button"
              onClick={() => setIsNewRideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <Plus size={13} />
              <span>Proposer un trajet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-900 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Car size={12} />
                      <span>{ride.vehicle}</span>
                    </span>

                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {ride.contribution}
                    </span>
                  </div>

                  {/* Route details */}
                  <div className="space-y-1.5 py-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                      <span>Départ : {ride.departure}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
                      <span>Arrivée : {ride.destination}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ride.notes}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500" />
                      <span>{ride.departureTime} ({ride.date})</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-blue-500" />
                      <strong className={ride.availableSeats > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {ride.availableSeats} place(s) libre(s)
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card Footer: Driver info & Book Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold">
                      {ride.driver}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      {ride.filiere} · {ride.matricule}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={ride.availableSeats <= 0}
                    onClick={() => setSelectedRideToBook(ride)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-40"
                  >
                    {ride.availableSeats > 0 ? 'Réserver ma place' : 'Complet'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Campus Life Tips Section */}
      {activeSection === 'tips' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
            Les bons plans indispensables pour la vie quotidienne à l'Université de Yaoundé I
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_CAMPUS_TIPS.map((tip) => (
              <div
                key={tip.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {tip.category}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {tip.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tip.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                    <span className="line-clamp-1">{tip.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <DollarSign size={13} />
                    <span>{tip.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Motivation Wall Section */}
      {activeSection === 'motivation' && (
        <div className="space-y-6">
          {/* Post submission form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Heart size={16} className="text-rose-500" />
              <span>Poster un message d'encouragement sur le Mur</span>
            </h3>

            <form onSubmit={handleAddMotivationPost} className="space-y-3">
              <textarea
                rows={2}
                required
                value={newMotivationText}
                onChange={(e) => setNewMotivationText(e.target.value)}
                placeholder="Partagez une citation, un encouragement pour les camarades qui révisent les examens..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Thème :</span>
                  <select
                    value={newMotivationTag}
                    onChange={(e) => setNewMotivationTag(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Session d'Examens">Session d'Examens</option>
                    <option value="Entraide & Fraternité">Entraide & Fraternité</option>
                    <option value="Courage & Révision">Courage & Révision</option>
                    <option value="Rattrapages UY1">Rattrapages UY1</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Heart size={13} fill="currentColor" />
                  <span>Publier sur le Mur</span>
                </button>
              </div>
            </form>
          </div>

          {/* Motivation Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {motivationPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
                      {post.tag}
                    </span>
                    <span className="text-[11px] text-slate-400">{post.date}</span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed font-serif">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: post.avatarBg || '#6366f1' }}
                    >
                      {post.author.charAt(0)}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {post.author}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold hover:scale-105 transition-transform"
                    title="Envoyer de la force"
                  >
                    <Heart size={13} fill="currentColor" />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Réserver une place de covoiturage */}
      {selectedRideToBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedRideToBook(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Car size={18} className="text-emerald-600" />
              <span>Confirmer ma réservation de covoiturage</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Trajet solidaire vers l'Université de Yaoundé I.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs mb-4">
              <div>
                <span className="text-slate-400">Itinéraire :</span>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                  {selectedRideToBook.departure} ➔ {selectedRideToBook.destination}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Heure de départ :</span>
                <span className="font-bold text-emerald-600">{selectedRideToBook.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conducteur :</span>
                <span>{selectedRideToBook.driver} ({selectedRideToBook.filiere})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Participation :</span>
                <span className="font-bold">{selectedRideToBook.contribution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact conducteur :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{selectedRideToBook.phone}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleBookSeat(selectedRideToBook.id)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Confirmer ma place immédiatement
              </button>

              <a
                href={`https://wa.me/237677849210?text=Bonjour%20${encodeURIComponent(selectedRideToBook.driver)},%20je%20suis%20intéressé%20par%20ton%20covoiturage%20CampusHub:%20${encodeURIComponent(selectedRideToBook.departure)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Écrire sur WhatsApp</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Proposer un trajet */}
      {isNewRideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsNewRideModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Car size={18} className="text-emerald-600" />
              <span>Proposer un trajet de covoiturage</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Partagez votre véhicule ou un taxi de course avec vos camarades d'amphi.
            </p>

            <form onSubmit={handleAddRide} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Point de départ dans Yaoundé *
                </label>
                <input
                  type="text"
                  required
                  value={newRideData.departure}
                  onChange={(e) => setNewRideData({ ...newRideData, departure: e.target.value })}
                  placeholder="Ex : Biyem-Assi, Mendong, Nkolbisson, Bastos..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination sur le campus *
                </label>
                <input
                  type="text"
                  required
                  value={newRideData.destination}
                  onChange={(e) => setNewRideData({ ...newRideData, destination: e.target.value })}
                  placeholder="Ex : Château UY1, Amphi 502, Entrée Polytech..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heure départ *
                  </label>
                  <input
                    type="time"
                    required
                    value={newRideData.departureTime}
                    onChange={(e) => setNewRideData({ ...newRideData, departureTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Places dispo
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newRideData.availableSeats}
                    onChange={(e) => setNewRideData({ ...newRideData, availableSeats: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Frais (FCFA)
                  </label>
                  <input
                    type="text"
                    value={newRideData.contribution}
                    onChange={(e) => setNewRideData({ ...newRideData, contribution: e.target.value })}
                    placeholder="250 FCFA ou Gratuit"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Précisions / Itinéraire
                </label>
                <textarea
                  rows={2}
                  value={newRideData.notes}
                  onChange={(e) => setNewRideData({ ...newRideData, notes: e.target.value })}
                  placeholder="Ex : Passage par Melen, départ précis à l'heure, coffre disponible..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRideModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Publier mon trajet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
