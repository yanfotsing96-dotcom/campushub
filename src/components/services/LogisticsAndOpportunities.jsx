import { useState, useMemo } from 'react';
import {
  Laptop,
  Briefcase,
  Search,
  Filter,
  Plus,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  X,
  Send,
  Building,
} from 'lucide-react';
import {
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_INTERNSHIPS_PROJECTS,
} from './data/servicesData';
import { useAuth } from '../../hooks/useAuth';

const STORAGE_MARKETPLACE_KEY = 'campushub_services_marketplace';
const STORAGE_OPPORTUNITIES_KEY = 'campushub_services_opportunities';

export default function LogisticsAndOpportunities() {
  const { user } = useAuth();
  const currentSeller = `${user?.fullName || user?.nom || 'Étudiant'} (Moi)`;
  const currentMatricule = user?.matricule || '';
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'opportunities'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Stored state
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MARKETPLACE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_ITEMS;
    } catch {
      return INITIAL_MARKETPLACE_ITEMS;
    }
  });

  const [opportunities, setOpportunities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OPPORTUNITIES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_INTERNSHIPS_PROJECTS;
    } catch {
      return INITIAL_INTERNSHIPS_PROJECTS;
    }
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemToContact, setSelectedItemToContact] = useState(null);
  const [selectedOppToApply, setSelectedOppToApply] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // New Item / Opp form state
  const [newItemData, setNewItemData] = useState({
    title: '',
    category: 'Matériel',
    type: 'Vente',
    price: '',
    condition: 'Bon état',
    location: 'Campus Ngoa-Ekellé',
    description: '',
  });

  const saveItems = (updated) => {
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_MARKETPLACE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemData.title.trim()) return;

    if (activeTab === 'items') {
      const createdItem = {
        id: `item-${Date.now()}`,
        title: newItemData.title.trim(),
        category: newItemData.category,
        type: newItemData.type,
        price: newItemData.price || 'Prêt Gratuit',
        condition: newItemData.condition,
        seller: currentSeller,
        matricule: currentMatricule,
        level: 'L2 Informatique',
        location: newItemData.location || 'Campus Ngoa-Ekellé',
        date: 'À l\'instant',
        description: newItemData.description.trim(),
        status: 'Disponible',
        tags: [newItemData.category, newItemData.type, 'Étudiant'],
      };
      saveItems([createdItem, ...items]);
    } else {
      const createdOpp = {
        id: `opp-${Date.now()}`,
        title: newItemData.title.trim(),
        type: newItemData.type === 'Vente' ? 'Stage' : 'Projet',
        company: 'Université de Yaoundé I / Partenaire',
        location: newItemData.location || 'Yaoundé',
        duration: '3 mois',
        allowance: newItemData.price || 'Gratification à négocier',
        levelRequired: 'L2 / L3 Informatique',
        deadline: 'Fin de semestre',
        description: newItemData.description.trim(),
        contactEmail: 'contact.etudiant@uy1.uninet.cm',
        tags: ['Académique', 'UY1', 'Stage'],
      };
      const updatedOpps = [createdOpp, ...opportunities];
      setOpportunities(updatedOpps);
      localStorage.setItem(STORAGE_OPPORTUNITIES_KEY, JSON.stringify(updatedOpps));
    }

    setIsAddModalOpen(false);
    setNewItemData({
      title: '',
      category: 'Matériel',
      type: 'Vente',
      price: '',
      condition: 'Bon état',
      location: 'Campus Ngoa-Ekellé',
      description: '',
    });
    setActionSuccessMessage('Votre annonce a été publiée avec succès sur CampusHub !');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      if (selectedFilter !== 'ALL') {
        if (selectedFilter === 'Prêt' && item.type !== 'Prêt') return false;
        if (selectedFilter === 'Vente' && item.type !== 'Vente') return false;
        if (selectedFilter === 'Matériel' && item.category !== 'Matériel') return false;
        if (selectedFilter === 'Livres' && item.category !== 'Livres') return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.seller.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery, selectedFilter]);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return opportunities.filter((opp) => {
      if (selectedFilter !== 'ALL') {
        if (selectedFilter === 'Stage' && opp.type !== 'Stage') return false;
        if (selectedFilter === 'Projet' && opp.type !== 'Projet') return false;
      }
      if (!q) return true;
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q)
      );
    });
  }, [opportunities, searchQuery, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 mb-2">
              <Laptop size={13} />
              <span>CampusHub · Entraide Matérielle & Insertion</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Logistique, Matériel, Stages & Projets
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Prêt et vente d'équipements informatiques entre étudiants, et opportunités de stages professionnels à Yaoundé.
            </p>
          </div>

          {/* Tab Switcher & Post Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('items');
                  setSelectedFilter('ALL');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'items'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Laptop size={13} />
                <span>Matériel & Livres ({items.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('opportunities');
                  setSelectedFilter('ALL');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'opportunities'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Briefcase size={13} />
                <span>Stages & Projets ({opportunities.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>{activeTab === 'items' ? 'Déposer une annonce' : 'Proposer une opportunité'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'items'
                  ? 'Rechercher un PC, livre, calculatrice, câble...'
                  : 'Rechercher un stage (CAMTEL, MTN, React, C)...'
              }
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Filter size={12} />
              <span>Filtre :</span>
            </span>

            {activeTab === 'items' ? (
              <>
                {['ALL', 'Prêt', 'Vente', 'Matériel', 'Livres'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                      selectedFilter === f
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {f === 'ALL' ? 'Tous' : f === 'Prêt' ? 'Prêt Solidaire' : f === 'Vente' ? 'Vente Étudiante' : f}
                  </button>
                ))}
              </>
            ) : (
              <>
                {['ALL', 'Stage', 'Projet'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                      selectedFilter === f
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {f === 'ALL' ? 'Toutes les offres' : f === 'Stage' ? 'Stages Professionnels' : 'Projets de Recherche'}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Content Grid: Items Tab */}
      {activeTab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-900 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.type === 'Prêt'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>

                  <span className="font-black text-sm text-slate-900 dark:text-slate-100 font-mono">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-blue-500" />
                    <span>{item.location}</span>
                  </span>
                  <span>•</span>
                  <span>État : {item.condition}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Card Footer : Seller & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <strong className="block text-slate-800 dark:text-slate-200 font-bold">
                    {item.seller}
                  </strong>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.matricule} · {item.level}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItemToContact(item)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Contacter</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid: Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-900 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      opp.type === 'Stage'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {opp.type}
                  </span>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {opp.allowance}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {opp.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building size={13} className="text-blue-500" />
                    <span>{opp.company}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-blue-500" />
                    <span>{opp.location}</span>
                  </span>
                  <span>•</span>
                  <span>Durée : {opp.duration}</span>
                  <span>•</span>
                  <span>Profil : {opp.levelRequired}</span>
                </div>
              </div>

              {/* Card Footer: Deadline & Apply Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span>Date limite : </span>
                  <strong className="text-rose-600 dark:text-rose-400 font-semibold">{opp.deadline}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOppToApply(opp)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  <span>Postuler</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Contacter le propriétaire d'un matériel */}
      {selectedItemToContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedItemToContact(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Phone size={18} className="text-blue-600" />
              <span>Contacter le propriétaire</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Coordination directe pour remise sur le campus de l'Université de Yaoundé I.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs mb-4">
              <div>
                <span className="text-slate-400">Objet :</span>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">{selectedItemToContact.title}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Prix / Modalité :</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedItemToContact.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Étudiant :</span>
                <span>{selectedItemToContact.seller} ({selectedItemToContact.level})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lieu de rencontre :</span>
                <span>{selectedItemToContact.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/237677849210?text=Bonjour,%20je%20suis%20intéressé%20par%20votre%20annonce%20CampusHub:%20${encodeURIComponent(selectedItemToContact.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2"
              >
                <span>Contacter par WhatsApp / Téléphone</span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedItemToContact(null);
                  setActionSuccessMessage('Message de réservation transmis au camarade étudiant.');
                  setTimeout(() => setActionSuccessMessage(''), 3000);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Envoyer un message interne
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Postuler à un stage / opportunité */}
      {selectedOppToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedOppToApply(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Mail size={18} className="text-blue-600" />
              <span>Candidature à l'offre</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Transmission de votre CV académique et lettre de motivation.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs mb-4">
              <div>
                <span className="text-slate-400">Poste :</span>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">{selectedOppToApply.title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Organisme :</span>
                <span className="font-semibold">{selectedOppToApply.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact RH :</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{selectedOppToApply.contactEmail}</span>
              </div>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Message court d'introduction : Madame, Monsieur, étudiant en L2 Informatique à l'Université de Yaoundé I..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />

              <button
                type="button"
                onClick={() => {
                  setSelectedOppToApply(null);
                  setActionSuccessMessage(`Votre dossier de candidature a été transmis à ${selectedOppToApply.company} !`);
                  setTimeout(() => setActionSuccessMessage(''), 4000);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                <span>Envoyer ma candidature académique</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal : Publier une annonce ou offre */}
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
              <Plus size={18} className="text-blue-600" />
              <span>{activeTab === 'items' ? 'Déposer une annonce matériel' : 'Publier une opportunité de stage'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Réservé à la communauté estudiantine et enseignante de l'Université de Yaoundé I.
            </p>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  required
                  value={newItemData.title}
                  onChange={(e) => setNewItemData({ ...newItemData, title: e.target.value })}
                  placeholder={activeTab === 'items' ? 'Ex: PC Portable HP i5 pour TP, Calculatrice Casio...' : 'Ex: Stage PFE Développeur C/Linux...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {activeTab === 'items' ? 'Catégorie' : 'Type'}
                  </label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Matériel">Matériel Informatique</option>
                    <option value="Livres">Livre / Polycopié</option>
                    <option value="Accessoire">Accessoire / Câble</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {activeTab === 'items' ? 'Formule' : 'Indemnité / Rémunération'}
                  </label>
                  <select
                    value={newItemData.type}
                    onChange={(e) => setNewItemData({ ...newItemData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Vente">Vente à prix étudiant</option>
                    <option value="Prêt">Prêt solidaire gratuit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prix (FCFA) ou Modalité
                  </label>
                  <input
                    type="text"
                    value={newItemData.price}
                    onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                    placeholder="Ex: 15 000 FCFA ou Gratuit"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lieu de rencontre (Campus UY1)
                  </label>
                  <input
                    type="text"
                    value={newItemData.location}
                    onChange={(e) => setNewItemData({ ...newItemData, location: e.target.value })}
                    placeholder="Ex: Amphi 502, Château, Ngoa-Ekellé"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newItemData.description}
                  onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                  placeholder="Spécifications techniques, état d'usure, prérequis pour les cours..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  className="px-4 py-2 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Publier l'annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
