import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  History,
  Trash2,
  Download,
  FileText,
  Search,
  Filter,
  Calendar,
  Layers,
  GraduationCap,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  BookmarkCheck,
  BookmarkX,
  Code2,
  Calculator,
  Atom,
  BookOpen,
  ArrowRight,
  Clock,
  X
} from 'lucide-react';
import '../styles/FavoritesHistory.css';
import { useResources } from '../hooks/useResources';

function getDisciplineIcon(filiere) {
  switch (filiere?.toLowerCase()) {
    case 'informatique':
      return Code2;
    case 'mathématiques':
    case 'mathematiques':
      return Calculator;
    case 'physique':
      return Atom;
    default:
      return BookOpen;
  }
}

function FavoritesHistoryPage() {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [previewResource, setPreviewResource] = useState(null);
  const [toast, setToast] = useState(null);

  const { resources, favorites, history, toggleFavorite, recordDownload, clearHistory } = useResources();

  // Simulation d'un chargement initial fluide
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    setIsLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsLoading(false);
    }, 240);
  };

  // Retirer un favori avec option "Annuler" dans le toast
  const handleRemoveFavorite = (resource) => {
    toggleFavorite(resource.id);

    // Toast avec action d'annulation
    setToast({
      message: `"${resource.titre}" a été retiré de vos favoris.`,
      undo: () => {
        toggleFavorite(resource.id);
        setToast(null);
      }
    });

    setTimeout(() => {
      setToast((curr) => (curr?.message.includes(resource.titre) ? null : curr));
    }, 4500);
  };

  // Ajouter / Re-télécharger dans l'historique
  const handleDownload = (resource) => {
    recordDownload(resource.id);

    setToast({
      message: `Téléchargement de "${resource.titre}" démarré !`,
      success: true
    });
    setTimeout(() => setToast(null), 3000);
  };

  // Vider tout l'historique
  const handleClearHistory = () => {
    clearHistory();
    setToast({
      message: 'Historique de téléchargement effacé.',
    });
    setTimeout(() => setToast(null), 3000);
  };

  // Associer les IDs aux données réelles
  const favoriteResources = useMemo(() => {
    return resources.filter((res) => favorites.includes(res.id));
  }, [resources, favorites]);

  const historyResources = useMemo(() => {
    return history
      .map((item) => {
        const res = resources.find((r) => r.id === item.id);
        return res ? { ...res, downloadedAt: item.date } : null;
      })
      .filter(Boolean);
  }, [resources, history]);

  // Filtrage actif (recherche textuelle et filière)
  const currentList = activeTab === 'favorites' ? favoriteResources : historyResources;

  const filteredItems = useMemo(() => {
    return currentList.filter((item) => {
      const matchesSearch =
        item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.filiere.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFiliere =
        selectedFiliere === 'All' || item.filiere === selectedFiliere;
      return matchesSearch && matchesFiliere;
    });
  }, [currentList, searchQuery, selectedFiliere]);

  // Statistiques pour le bandeau supérieur
  const stats = useMemo(() => {
    const filieres = new Set(favoriteResources.map((r) => r.filiere));
    return {
      totalFavs: favoriteResources.length,
      totalDownloads: historyResources.length,
      totalFilieres: filieres.size,
      lastDownload: historyResources[0]?.downloadedAt || 'Aucun'
    };
  }, [favoriteResources, historyResources]);

  const filieresList = ['All', 'Informatique', 'Mathématiques', 'Physique'];

  return (
    <div className="fav-history-page">
      {/* Toast Notification with Undo */}
      {toast && (
        <div className={`academic-toast ${toast.success ? 'success' : ''}`}>
          <div className="toast-content">
            <CheckCircle2 size={18} className="toast-icon" />
            <span className="toast-text">{toast.message}</span>
          </div>
          {toast.undo && (
            <button
              type="button"
              className="toast-undo-btn"
              onClick={toast.undo}
            >
              <RotateCcw size={14} />
              <span>Annuler</span>
            </button>
          )}
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header section with academic branding */}
      <div className="page-header-card">
        <div className="header-meta-row">
          <span className="header-breadcrumb">
            CampusHub <span className="sep">/</span> Espace Étudiant <span className="sep">/</span> Favoris & Historique
          </span>
          <span className="live-status-pill">
            <span className="status-dot pulse" />
            Synchronisé localement
          </span>
        </div>

        <div className="header-main-row">
          <div className="header-titles">
            <h1 className="page-title">
              <BookmarkCheck size={28} className="title-icon" />
              Favoris & Historique Académique
            </h1>
            <p className="page-description">
              Gérez vos cours prioritaires, vos fiches de travaux dirigés et suivez l'ensemble de vos documents téléchargés.
            </p>
          </div>

          <div className="header-quick-action">
            <Link to="/ressources" className="header-cta-btn">
              <BookOpen size={16} />
              <span>Ajouter un cours</span>
            </Link>
          </div>
        </div>

        {/* Dashboard KPI Summary Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-box fav-theme">
              <Star size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Cours Épinglés</span>
              <span className="kpi-value">{stats.totalFavs}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box download-theme">
              <Download size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Documents Consultés</span>
              <span className="kpi-value">{stats.totalDownloads}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box filiere-theme">
              <Layers size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Filières Actives</span>
              <span className="kpi-value">{stats.totalFilieres}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box clock-theme">
              <Clock size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Dernière Consultation</span>
              <span className="kpi-value date-val">{stats.lastDownload}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="workspace-card">
        {/* Navigation Tabs Bar */}
        <div className="tabs-container">
          <div className="segmented-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'favorites'}
              className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('favorites')}
            >
              <Star size={16} className="tab-icon" />
              <span>Mes Favoris</span>
              <span className="count-badge">{favoriteResources.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'history'}
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('history')}
            >
              <History size={16} className="tab-icon" />
              <span>Historique de Téléchargement</span>
              <span className="count-badge">{historyResources.length}</span>
            </button>
          </div>

          {activeTab === 'history' && historyResources.length > 0 && (
            <button
              type="button"
              className="clear-history-btn"
              onClick={handleClearHistory}
              title="Vider l'historique"
            >
              <Trash2 size={14} />
              <span>Vider l'historique</span>
            </button>
          )}
        </div>

        {/* Filter and Search Toolbar */}
        <div className="toolbar-row">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={`Rechercher parmi les ${activeTab === 'favorites' ? 'favoris' : 'téléchargements'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filière filter chips */}
          <div className="filter-chips-row">
            <Filter size={14} className="filter-icon" />
            <div className="chips-list">
              {filieresList.map((filiere) => (
                <button
                  key={filiere}
                  type="button"
                  className={`filter-chip ${selectedFiliere === filiere ? 'active' : ''}`}
                  onClick={() => setSelectedFiliere(filiere)}
                >
                  {filiere === 'All' ? 'Toutes les filières' : filiere}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Cards Grid or Loading / Empty States */}
        <div className="tab-view-body">
          {isLoading ? (
            /* Loading Skeleton Cards */
            <div className="cards-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="course-card skeleton-card">
                  <div className="skeleton-bar skeleton-badge" />
                  <div className="skeleton-bar skeleton-title" />
                  <div className="skeleton-bar skeleton-desc" />
                  <div className="skeleton-bar skeleton-desc short" />
                  <div className="skeleton-footer">
                    <div className="skeleton-bar skeleton-meta" />
                    <div className="skeleton-bar skeleton-btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty State */
            <div className="empty-state-card">
              <div className="empty-icon-circle">
                {activeTab === 'favorites' ? (
                  <BookmarkX size={36} className="empty-icon" />
                ) : (
                  <History size={36} className="empty-icon" />
                )}
              </div>
              <h3 className="empty-title">
                {searchQuery || selectedFiliere !== 'All'
                  ? 'Aucun résultat correspondant à vos filtres'
                  : activeTab === 'favorites'
                  ? 'Aucun cours en favori pour le moment'
                  : "Aucun historique de téléchargement"}
              </h3>
              <p className="empty-description">
                {searchQuery || selectedFiliere !== 'All'
                  ? 'Essayez de modifier votre mot-clé ou sélectionnez une autre filière.'
                  : activeTab === 'favorites'
                  ? 'Explorez le catalogue de cours et épinglez vos modules pour y accéder rapidement ici.'
                  : 'Téléchargez des cours ou fiches de travaux dirigés depuis le catalogue pour les retrouver ici.'}
              </p>
              <div className="empty-actions">
                {searchQuery || selectedFiliere !== 'All' ? (
                  <button
                    type="button"
                    className="empty-cta-btn secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFiliere('All');
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>Réinitialiser les filtres</span>
                  </button>
                ) : (
                  <Link to="/search" className="empty-cta-btn">
                    <Search size={16} />
                    <span>Explorer le catalogue de cours</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Course Cards Grid */
            <div className="cards-grid">
              {filteredItems.map((item) => {
                const DisciplineIcon = getDisciplineIcon(item.filiere);
                const isFavorite = favorites.includes(item.id);

                return (
                  <article key={item.id} className="course-card">
                    {/* Card Top Pill Bar */}
                    <div className="card-top-row">
                      <div className="card-tags">
                        <span className={`filiere-tag ${item.filiere.toLowerCase()}`}>
                          <DisciplineIcon size={13} className="tag-icon" />
                          {item.filiere}
                        </span>
                        <span className="level-tag">{item.niveau}</span>
                      </div>

                      {activeTab === 'history' && item.downloadedAt && (
                        <div className="download-timestamp" title="Date de consultation">
                          <Calendar size={13} />
                          <span>{item.downloadedAt}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="card-content">
                      <h3 className="course-title">{item.titre}</h3>
                      <p className="course-description">{item.description}</p>
                    </div>

                    {/* Card Sub-metadata */}
                    <div className="card-meta-details">
                      <span className="author-detail">
                        <GraduationCap size={14} />
                        {item.author || 'Enseignant UY1'}
                      </span>
                      <span className="pages-detail">
                        <FileText size={14} />
                        {item.pages || 'Fiche PDF'}
                      </span>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="card-actions-row">
                      <button
                        type="button"
                        className="btn-preview"
                        onClick={() => setPreviewResource(item)}
                        title="Aperçu des détails du cours"
                      >
                        <ExternalLink size={15} />
                        <span>Consulter</span>
                      </button>

                      {activeTab === 'favorites' ? (
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className="btn-download-quick"
                            onClick={() => handleDownload(item)}
                            title="Télécharger la fiche de cours"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-remove-favorite"
                            onClick={() => handleRemoveFavorite(item)}
                            title="Retirer ce cours de vos favoris"
                            aria-label={`Retirer ${item.titre} des favoris`}
                          >
                            <Trash2 size={15} className="remove-icon" />
                            <span className="remove-label">Retirer</span>
                          </button>
                        </div>
                      ) : (
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className={`btn-favorite-toggle ${isFavorite ? 'is-fav' : ''}`}
                            onClick={() => {
                              if (isFavorite) {
                                handleRemoveFavorite(item);
                              } else {
                                toggleFavorite(item.id);
                                setToast({
                                  message: `"${item.titre}" ajouté aux favoris !`,
                                  success: true
                                });
                                setTimeout(() => setToast(null), 3000);
                              }
                            }}
                            title={isFavorite ? 'Enregistré dans les favoris' : 'Ajouter aux favoris'}
                          >
                            <Star size={15} className={isFavorite ? 'star-filled' : ''} />
                            <span>{isFavorite ? 'Favori' : 'Épingler'}</span>
                          </button>
                          <button
                            type="button"
                            className="btn-download-quick"
                            onClick={() => handleDownload(item)}
                            title="Télécharger à nouveau"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Course Detail Modal */}
      {previewResource && (
        <div className="modal-backdrop" onClick={() => setPreviewResource(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-badge-group">
                <span className={`filiere-tag ${previewResource.filiere.toLowerCase()}`}>
                  {previewResource.filiere}
                </span>
                <span className="level-tag">{previewResource.niveau}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewResource(null)}
                aria-label="Fermer la boîte de dialogue"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <h2 className="modal-title">{previewResource.titre}</h2>
              <div className="modal-meta-row">
                <span>
                  <GraduationCap size={15} /> Enseignant : {previewResource.author || 'Département UY1'}
                </span>
                <span>
                  <FileText size={15} /> Format : PDF Numérisé ({previewResource.pages || '40+ pages'})
                </span>
              </div>

              <div className="modal-section">
                <h4>Description & Objectifs du cours</h4>
                <p>{previewResource.description}</p>
                <p className="modal-extra-info">
                  Ce document contient les notions fondamentales, les exercices d'application résolus, ainsi que les références bibliographiques recommandées par l'Université de Yaoundé I.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setPreviewResource(null)}
              >
                Fermer
              </button>
              <button
                type="button"
                className="modal-btn-download"
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
              >
                <Download size={16} />
                <span>Télécharger le document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesHistoryPage;